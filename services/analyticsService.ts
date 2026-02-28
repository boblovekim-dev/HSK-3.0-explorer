// Analytics Service for HSK Explorer
// 用于追踪网站访问统计

import { supabase } from './supabaseClient';

// 缓存IP信息，避免重复请求
let cachedIpInfo: { ip: string; country: string; countryCode: string } | null = null;

/**
 * 获取用户IP和国家信息
 */
export async function getIpInfo(): Promise<{ ip: string; country: string; countryCode: string }> {
    if (cachedIpInfo) {
        return cachedIpInfo;
    }

    try {
        // 使用免费且支持HTTPS的 geojs.io 获取IP和地理位置
        const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (response.ok) {
            const data = await response.json();
            cachedIpInfo = {
                ip: data.ip || 'unknown',
                country: data.country || 'Unknown',
                countryCode: data.country_code || 'XX'
            };
            return cachedIpInfo;
        }
    } catch (error) {
        console.warn('Failed to get IP info:', error);
    }

    // Fallback
    cachedIpInfo = { ip: 'unknown', country: 'Unknown', countryCode: 'XX' };
    return cachedIpInfo;
}

/**
 * 记录每日访问
 * - 记录访问日期、IP地址和国家
 * - 相同IP同一天多次访问会更新visit_count
 */
export async function trackVisit(): Promise<void> {
    try {
        const { ip, country } = await getIpInfo();
        const today = new Date().toISOString().split('T')[0];

        // Upsert: 如果已存在则更新visit_count，否则插入新记录
        const { error } = await supabase
            .from('daily_visits')
            .upsert(
                {
                    date: today,
                    ip_address: ip,
                    country: country,
                    visit_count: 1,
                    last_visit_at: new Date().toISOString()
                },
                {
                    onConflict: 'date,ip_address',
                    ignoreDuplicates: false
                }
            );

        if (error) {
            // 如果upsert失败，尝试更新visit_count
            if (error.code === '23505') { // Unique violation
                await supabase
                    .from('daily_visits')
                    .update({
                        visit_count: supabase.rpc('increment_visit_count'),
                        last_visit_at: new Date().toISOString()
                    })
                    .eq('date', today)
                    .eq('ip_address', ip);
            } else {
                console.warn('Failed to track visit:', error);
            }
        }
    } catch (error) {
        console.warn('Analytics trackVisit error:', error);
    }
}

/**
 * 记录页面曝光
 * - 按等级+资料类别+日期计数
 */
export async function trackPageExposure(level: string, category: string): Promise<void> {
    try {
        const today = new Date().toISOString().split('T')[0];

        // 先尝试更新现有记录
        const { data: existing } = await supabase
            .from('page_exposures')
            .select('id, exposure_count')
            .eq('date', today)
            .eq('level', level)
            .eq('category', category)
            .single();

        if (existing) {
            // 更新曝光计数
            await supabase
                .from('page_exposures')
                .update({ exposure_count: existing.exposure_count + 1 })
                .eq('id', existing.id);
        } else {
            // 插入新记录
            await supabase
                .from('page_exposures')
                .insert({
                    date: today,
                    level: level,
                    category: category,
                    exposure_count: 1
                });
        }
    } catch (error) {
        console.warn('Analytics trackPageExposure error:', error);
    }
}

/**
 * 记录语言选择
 * - 相同IP只记录一次（第一次选择）
 * - 如果用户更换语言，会更新记录
 */
export async function trackLanguageSelection(language: string): Promise<void> {
    try {
        const { ip } = await getIpInfo();

        // Upsert: 如果已存在则更新语言，否则插入新记录
        const { error } = await supabase
            .from('language_selections')
            .upsert(
                {
                    ip_address: ip,
                    language: language,
                    updated_at: new Date().toISOString()
                },
                {
                    onConflict: 'ip_address',
                    ignoreDuplicates: false
                }
            );

        if (error) {
            console.warn('Failed to track language selection:', error);
        }
    } catch (error) {
        console.warn('Analytics trackLanguageSelection error:', error);
    }
}

/**
 * 记录下载按钮点击
 * - 记录点击平台 (ios, android, qr, zalo, mobile_banner)
 * - 绑定IP和国家信息
 */
export async function trackDownloadClick(platform: 'ios' | 'android' | 'qr' | 'zalo' | 'mobile_banner'): Promise<void> {
    try {
        const { ip, country } = await getIpInfo();
        await supabase.from('download_clicks').insert({
            ip_address: ip,
            country: country,
            platform: platform
        });
    } catch (error) {
        console.warn('Analytics trackDownloadClick error:', error);
    }
}

/**
 * 获取统计摘要（可用于管理后台）
 */
export async function getAnalyticsSummary() {
    try {
        const today = new Date().toISOString().split('T')[0];

        // 今日访问人次
        const { data: dailyVisits } = await supabase
            .from('daily_visits')
            .select('visit_count')
            .eq('date', today);

        const todayVisitCount = dailyVisits?.reduce((sum, v) => sum + (v.visit_count || 0), 0) || 0;
        const todayUniqueVisitors = dailyVisits?.length || 0;

        // 总用户数
        const { count: totalUniqueUsers } = await supabase
            .from('daily_visits')
            .select('ip_address', { count: 'exact', head: true });

        // 各国家用户数
        const { data: countryStats } = await supabase
            .from('daily_visits')
            .select('country, ip_address')
            .order('country');

        // 语言选择统计
        const { data: languageStats } = await supabase
            .from('language_selections')
            .select('language');

        return {
            todayVisitCount,
            todayUniqueVisitors,
            totalUniqueUsers: totalUniqueUsers || 0,
            countryStats,
            languageStats,
            downloadStats: {
                totalClicks: await supabase.from('download_clicks').select('*', { count: 'exact', head: true }).then(r => r.count || 0),
                uniqueDownloaders: await supabase.from('download_clicks').select('ip_address')
                    .then(r => {
                        if (r.error) return 0;
                        return new Set(r.data.map(d => d.ip_address)).size;
                    })
            }
        };
    } catch (error) {
        console.warn('Failed to get analytics summary:', error);
        return null;
    }
}
