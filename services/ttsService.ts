import { v4 as uuidv4 } from 'uuid';

// Types
type Voice = 'zh-CN-XiaoxiaoNeural' | 'zh-CN-YunxiNeural';

interface TTSRequest {
    text: string;
    voice?: Voice;
    onAudio: (url: string) => void;
    onError: (err: any) => void;
}

// UUID generator simple polyfill if uuid package not available or just use crypto
function getUuid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class EdgeTtsService {
    private static instance: EdgeTtsService;
    private cache: Map<string, string> = new Map(); // Map text -> blob URL
    private queue: TTSRequest[] = [];
    private isProcessing = false;

    // Use relative path to go through Vite Proxy which handles CORS/Origin
    private getWsUrl() {
        // Construct WSS URL relative to current host
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        return `${protocol}//${host}/edge-tts/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4-EA85-41EA-8151-81BA150BD555`;
    }

    private constructor() { }

    public static getInstance(): EdgeTtsService {
        if (!EdgeTtsService.instance) {
            EdgeTtsService.instance = new EdgeTtsService();
        }
        return EdgeTtsService.instance;
    }

    /**
     * Speak the text. Tries Edge TTS first, falls back to Web Speech API.
     */
    public async speak(text: string, voice: Voice = 'zh-CN-XiaoxiaoNeural'): Promise<void> {
        const cleanText = text.trim();
        if (!cleanText) return;

        // Check Cache
        const cacheKey = `${voice}:${cleanText}`;
        if (this.cache.has(cacheKey)) {
            const audioUrl = this.cache.get(cacheKey)!;
            return this.playAudio(audioUrl);
        }

        return new Promise<void>((resolve, reject) => {
            // Add to queue
            this.queue.push({
                text: cleanText,
                voice,
                onAudio: (url) => {
                    this.cache.set(cacheKey, url);
                    this.playAudio(url).then(resolve).catch(reject);
                },
                onError: (err) => {
                    console.warn("Edge TTS failed, falling back to system:", err);
                    this.fallbackSpeak(cleanText).then(resolve);
                }
            });

            this.processQueue();
        });
    }

    private async processQueue() {
        if (this.isProcessing || this.queue.length === 0) return;

        this.isProcessing = true;
        const req = this.queue.shift()!;

        try {
            await this.fetchEdgeAudio(req);
        } catch (e) {
            // Ensure we don't crash the queue processor
            console.error("Queue processing error", e);
            req.onError(e); // Trigger fallback
        } finally {
            this.isProcessing = false;
            // Slight delay to be nice to the server
            setTimeout(() => this.processQueue(), 200);
        }
    }

    private fetchEdgeAudio(req: TTSRequest): Promise<void> {
        return new Promise((resolve, reject) => {
            let ws: WebSocket;
            try {
                ws = new WebSocket(this.getWsUrl());
            } catch (e) {
                return reject("WebSocket create failed: " + e);
            }

            const requestId = getUuid().replace(/-/g, '');
            let audioData: Blob[] = [];

            ws.binaryType = 'arraybuffer';

            ws.onopen = () => {
                // 1. Send Config
                const configMsg = `X-Timestamp:${new Date().toString()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
                    JSON.stringify({
                        context: {
                            synthesis: {
                                audio: {
                                    metadataoptions: {
                                        sentenceBoundaryEnabled: "false",
                                        wordBoundaryEnabled: "false"
                                    },
                                    outputFormat: "audio-24khz-48kbitrate-mono-mp3"
                                }
                            }
                        }
                    });
                ws.send(configMsg);

                // 2. Send SSML
                const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='zh-CN'>` +
                    `<voice name='${req.voice || 'zh-CN-XiaoxiaoNeural'}'>` +
                    `${req.text}` +
                    `</voice></speak>`;

                const ssmlMsg = `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n` + ssml;
                ws.send(ssmlMsg);
            };

            ws.onmessage = (event) => {
                const data = event.data;
                if (typeof data === 'string') {
                    if (data.includes("Path:turn.end")) {
                        // Done
                        ws.close();
                        const blob = new Blob(audioData, { type: 'audio/mp3' });
                        const url = URL.createObjectURL(blob);
                        req.onAudio(url);
                        resolve();
                    }
                } else if (data instanceof ArrayBuffer) {
                    // Helper to check headers in binary message would be good, 
                    // but effectively all binary data after the start is audio in this simple flow.
                    // However, the binary message format is: 2 bytes header size + text header + binary body
                    // We need to strip the text header.

                    const view = new DataView(data);
                    const headerSize = view.getUint16(0);
                    const audioPart = data.slice(2 + headerSize);
                    audioData.push(new Blob([audioPart]));
                }
            };

            ws.onerror = (e) => {
                console.error("WS Error", e);
                reject(e);
            };

            ws.onclose = (e) => {
                if (audioData.length > 0) {
                    // handled in turn.end usually, but if it closes unexpectedly but we have data...
                    // Actually, turn.end is better trigger. 
                    // If we get here without resolve, it might be error?
                    // If we resolved, this is fine.
                } else {
                    // reject("Closed without data");
                    // We rely on turn.end to resolve. 
                    // If resolve wasn't called, we should reject inside a timeout or similar?
                    // For now, let's assume onError catches network errors.
                }
            };

            // Safety timeout
            setTimeout(() => {
                if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                    ws.close();
                    if (audioData.length === 0) reject("Timeout");
                }
            }, 10000);
        });
    }

    private playAudio(url: string): Promise<void> {
        return new Promise((resolve) => {
            const audio = new Audio(url);
            audio.onended = () => resolve();
            audio.onerror = () => resolve(); // Fail gracefully
            audio.play().catch(e => {
                console.error("Play failed", e);
                resolve();
            });
        });
    }

    private fallbackSpeak(text: string): Promise<void> {
        return new Promise((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.8;
            utterance.onend = () => resolve();
            utterance.onerror = () => resolve();
            window.speechSynthesis.speak(utterance);
        });
    }
}

export const ttsService = EdgeTtsService.getInstance();
