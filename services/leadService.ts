// Lead Service for HSK Explorer
// 用于处理留资表单提交

import { supabase } from './supabaseClient';

const LEAD_SUBMITTED_KEY = 'hsk_lead_submitted';

export interface LeadData {
    name: string;
    phone: string;
    country_code: string;
    learning_purpose?: string;
    ip_address?: string;
}

/**
 * 检查用户是否已经提交过留资信息
 */
export function hasSubmittedLead(): boolean {
    try {
        return localStorage.getItem(LEAD_SUBMITTED_KEY) === 'true';
    } catch {
        return false;
    }
}

/**
 * 标记用户已提交留资信息
 */
export function markLeadSubmitted(): void {
    try {
        localStorage.setItem(LEAD_SUBMITTED_KEY, 'true');
    } catch {
        console.warn('Failed to save lead status to localStorage');
    }
}

/**
 * 获取用户IP地址
 */
async function getUserIp(): Promise<string> {
    try {
        const response = await fetch('https://ip-api.com/json/?fields=query');
        if (response.ok) {
            const data = await response.json();
            return data.query || 'unknown';
        }
    } catch (error) {
        console.warn('Failed to get IP:', error);
    }
    return 'unknown';
}

/**
 * 提交留资信息到数据库
 */
export async function submitLead(data: LeadData): Promise<{ success: boolean; error?: string }> {
    try {
        const ip = await getUserIp();

        const { error } = await supabase
            .from('leads')
            .insert({
                name: data.name,
                phone: data.phone,
                country_code: data.country_code,
                learning_purpose: data.learning_purpose || null,
                ip_address: ip,
                created_at: new Date().toISOString()
            });

        if (error) {
            console.error('Failed to submit lead:', error);
            return { success: false, error: error.message };
        }

        // 标记已提交
        markLeadSubmitted();
        return { success: true };
    } catch (error) {
        console.error('Lead submission error:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}
