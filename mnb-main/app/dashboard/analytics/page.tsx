"use client"

import React, { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  TrendingUp,
  Eye,
  Heart,
  BarChart3,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AnalyticsPage() {
  // Use SWR to poll every 60 seconds (60000ms)
  const { data: igData, error: igError, isLoading: igLoading } = useSWR('/api/analytics/instagram', fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: true
  })

  const { data: ytData, error: ytError, isLoading: ytLoading } = useSWR('/api/analytics/youtube', fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: true
  })

  // Format timestamp helper
  const getRelativeTime = (timestamp?: number) => {
    if (!timestamp) return "Just now"
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return "Just now"
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min ago`
  }

  // Formatting helpers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const isLoading = igLoading || ytLoading
  const hasError = igError || ytError

  const instagramData = igData || {}
  const youtubeData = ytData || {}

  // Aggregate Data
  const totalReachViews = (instagramData.reach || 0) + (youtubeData.views || 0)
  const totalImpressions = (instagramData.impressions || 0) + (youtubeData.views || 0)
  const totalEngagement = (instagramData.totalEngagement || 0) + (youtubeData.totalEngagement || 0)
  const totalPossibleReach = totalReachViews > 0 ? totalReachViews : 1
  const avgEngagementRate = ((totalEngagement / totalPossibleReach) * 100).toFixed(2)

  const platformStats = [
    {
      platform: "Instagram",
      connected: instagramData.connected || false,
      posts: formatNumber(instagramData.mediaCount || 0),
      reach: formatNumber(instagramData.reach || 0),
      impressions: formatNumber(instagramData.impressions || 0),
      engagementRate: `${instagramData.engagementRate || 0}%`,
      likes: formatNumber(instagramData.likes || 0),
      comments: formatNumber(instagramData.comments || 0),
      color: "from-purple-500 to-pink-500",
      timestamp: instagramData._timestamp
    },
    {
      platform: "YouTube",
      connected: youtubeData.connected || false,
      posts: formatNumber(youtubeData.videos || 0),
      reach: formatNumber(youtubeData.views || 0),
      impressions: formatNumber(youtubeData.views || 0),
      engagementRate: `${youtubeData.engagementRate || 0}%`,
      likes: "0",
      comments: "0",
      color: "from-red-500 to-red-700",
      timestamp: youtubeData._timestamp
    }
  ]

  if (hasError) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4 text-red-500">
          <AlertCircle className="w-8 h-8" />
          <p>Failed to load analytics. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent flex items-center gap-3">
            Real-Time Analytics
            {/* Live Indicator Badge */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-green/10 text-neon-green text-xs font-bold border border-neon-green/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
              </span>
              LIVE
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Live insights auto-refreshing every 60 seconds
          </p>
        </div>
      </div>

      {/* Aggregate Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass hover:glow-cyan transition-all relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reach / Views
            </CardTitle>
            <Eye className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="h-8 bg-zinc-800/50 rounded animate-pulse w-24"></div> : (
              <div className="text-2xl font-bold">{formatNumber(totalReachViews)}</div>
            )}
          </CardContent>
        </Card>

        <Card className="glass hover:glow-purple transition-all relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Impressions
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-neon-purple" />
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="h-8 bg-zinc-800/50 rounded animate-pulse w-24"></div> : (
              <div className="text-2xl font-bold">{formatNumber(totalImpressions)}</div>
            )}
          </CardContent>
        </Card>

        <Card className="glass hover:glow-pink transition-all relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Engagement
            </CardTitle>
            <Heart className="h-4 w-4 text-neon-pink" />
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="h-8 bg-zinc-800/50 rounded animate-pulse w-24"></div> : (
              <div className="text-2xl font-bold">{formatNumber(totalEngagement)}</div>
            )}
          </CardContent>
        </Card>

        <Card className="glass hover:glow-cyan transition-all relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Engagement Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="h-8 bg-zinc-800/50 rounded animate-pulse w-20"></div> : (
              <div className="text-2xl font-bold">{avgEngagementRate}%</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance (Live Data) */}
      <div className="grid gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Platform Connections</CardTitle>
            <CardDescription>Live stats from your authenticated accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {platformStats.filter(s => s.connected).length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {platformStats.filter(s => s.connected).map((stat) => (
                  <div
                    key={stat.platform}
                    className={`p-5 rounded-xl border-2 transition-all relative overflow-hidden border-neon-cyan/50 bg-neon-cyan/5 hover:border-neon-cyan`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg shrink-0`}>
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{stat.platform}</h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {isLoading ? (
                              <div className="h-4 w-20 bg-zinc-800/50 rounded animate-pulse"></div>
                            ) : (
                              <span className="flex items-center text-xs font-semibold text-neon-green bg-neon-green/10 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Connected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Timestamp Indicator */}
                      {!isLoading && (
                        <div className="flex items-center text-[10px] text-muted-foreground bg-black/20 px-2 flex-col xs:flex-row py-1 rounded gap-1 absolute top-4 right-4 text-right">
                          <Clock className="w-3 h-3" /> Updated {getRelativeTime(stat.timestamp)}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm bg-black/20 p-4 rounded-lg">
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1">Posts/Videos</p>
                        {isLoading ? <div className="h-6 w-16 bg-zinc-800/50 rounded animate-pulse"></div> : <p className="font-bold text-lg">{stat.posts}</p>}
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1">Reach/Views</p>
                        {isLoading ? <div className="h-6 w-16 bg-zinc-800/50 rounded animate-pulse"></div> : <p className="font-bold text-lg">{stat.reach}</p>}
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1">Engagement</p>
                        {isLoading ? <div className="h-6 w-16 bg-zinc-800/50 rounded animate-pulse"></div> : <p className="font-bold text-lg text-neon-green">{stat.engagementRate}</p>}
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1">Impressions</p>
                        {isLoading ? <div className="h-6 w-16 bg-zinc-800/50 rounded animate-pulse"></div> : <p className="font-bold text-lg">{stat.impressions}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No Platforms Connected</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Connect your YouTube or Instagram account in the connections page to start seeing detailed analytics here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map(i => (
                  <div key={i} className="h-48 bg-zinc-800/20 rounded-xl animate-pulse border border-zinc-800"></div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
