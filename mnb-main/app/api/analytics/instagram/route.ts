import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { instagramService } from "@/lib/services/instagram";

// Basic in-memory cache to prevent hitting rate limits
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
            // Add a flag to indicate it came from cache
            return NextResponse.json({ ...cachedEntry.data, _cached: true, _timestamp: cachedEntry.timestamp }, { status: 200 });
        }

        // 2. Fetch Fresh Data using the service layer
        const analytics = await instagramService.getAnalytics(userId, supabase);

        // 3. Update Cache
        analyticsCache.set(userId, { data: analytics, timestamp: now });

        return NextResponse.json({ ...analytics, _cached: false, _timestamp: now }, { status: 200 });

    } catch (error: any) {
        // If they are not connected or an auth error occurs, handle gracefully
        if (error.message?.includes('not connected')) {
            // Silence expected error
        } else {
            console.error("Instagram Analytics Route Error:", error);
        }

        // Return a zeroed-out response for gracefully handling disconnections
        return NextResponse.json({
            connected: false,
            followers: 0,
            mediaCount: 0,
            likes: 0,
            comments: 0,
            totalEngagement: 0,
            reach: 0,
            impressions: 0,
            engagementRate: 0,
            _timestamp: Date.now()
        }, { status: 200 });
    }
}
