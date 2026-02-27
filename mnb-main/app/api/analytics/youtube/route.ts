import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { youtubeService } from "@/lib/services/youtube";

// In-memory cache for YouTube to restrict quota usage
// Key: userId, Value: { data: any, timestamp: number }
const CACHE_DURATION_MS = 60 * 1000; // 60 seconds
const analyticsCache = new Map<string, { data: any, timestamp: number }>();

export async function GET(request: NextRequest) {
    try {
        const supabase = createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = user.id;

        // 1. Check Cache
        const cachedEntry = analyticsCache.get(userId);
        const now = Date.now();

        if (cachedEntry && (now - cachedEntry.timestamp < CACHE_DURATION_MS)) {
            return NextResponse.json({ ...cachedEntry.data, _cached: true, _timestamp: cachedEntry.timestamp }, { status: 200 });
        }

        // 2. Fetch Fresh Data
        const analytics = await youtubeService.getAnalytics(userId, supabase);

        // 3. Update Cache
        analyticsCache.set(userId, { data: analytics, timestamp: now });

        return NextResponse.json({ ...analytics, _cached: false, _timestamp: now }, { status: 200 });

    } catch (error: any) {
        // Handle disconnected states gracefully without cluttering server logs
        if (error.message?.includes('connection not found')) {
            // Silence expected error
        } else {
            console.error("YouTube Analytics Route Error:", error);
        }

        return NextResponse.json({
            connected: false,
            subscribers: 0,
            views: 0,
            videos: 0,
            totalEngagement: 0,
            engagementRate: 0,
            _timestamp: Date.now()
        }, { status: 200 });
    }
}
