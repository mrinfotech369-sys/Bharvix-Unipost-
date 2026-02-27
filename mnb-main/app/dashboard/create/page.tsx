"use client"


import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Instagram, Youtube, Twitter, Linkedin, Facebook } from "lucide-react"

// Import our new modular platform components
import { InstagramTabs } from "@/components/instagram/InstagramTabs"
import { YouTubeTabs } from "@/components/youtube/YouTubeTabs"
import { FacebookTabs } from "@/components/facebook/FacebookTabs"

const platforms = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "from-purple-500 to-pink-500" },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "from-red-500 to-red-700" },
  { id: "twitter", name: "Twitter", icon: Twitter, color: "from-blue-400 to-blue-600" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "from-blue-600 to-blue-800" },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "from-blue-500 to-blue-700" },
]

export default function CreatePostPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)

  const togglePlatform = (platformId: string) => {
    // For this unified flow, we only allow selecting ONE platform at a time to render its specific complex UI.
    // If they click the already selected one, we deselect it.
    if (selectedPlatform === platformId) {
      setSelectedPlatform(null)
    } else {
      setSelectedPlatform(platformId)
    }
  }

  const renderActivePlatformUI = () => {
    if (!selectedPlatform) {
      return (
        <Card className="glass h-[400px] flex flex-col justify-center items-center text-center p-6 border-dashed border-2">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Instagram className="w-8 h-8 text-muted-foreground opacity-50 absolute" />
            <Youtube className="w-8 h-8 text-muted-foreground opacity-50 ml-4 mt-4" />
          </div>
          <h3 className="text-xl font-semibold">Select a Platform</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Choose a social media platform from the right sidebar to access its dedicated content creation studio.
          </p>
        </Card>
      )
    }

    if (selectedPlatform === 'instagram') {
      return <InstagramTabs />
    }

    if (selectedPlatform === 'youtube') {
      return <YouTubeTabs />
    }

    if (selectedPlatform === 'facebook') {
      return <FacebookTabs />
    }

    return (
      <Card className="glass p-12 text-center text-muted-foreground">
        Publishing to {platforms.find(p => p.id === selectedPlatform)?.name} is disabled in this demo.
      </Card>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
          Create New Post
        </h1>
        <p className="text-muted-foreground mt-1">
          Select a platform to access specialized publishing tools.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">

        {/* Main Content Area (Dynamic UI) */}
        <div className="lg:col-span-3 space-y-6 transition-all">
          {renderActivePlatformUI()}
        </div>

        {/* Sidebar Selection */}
        <div className="space-y-6">
          <Card className="glass sticky top-6">
            <CardHeader>
              <CardTitle>Platforms</CardTitle>
              <CardDescription>Select where to publish</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {platforms.map((platform) => {
                const Icon = platform.icon
                const isSelected = selectedPlatform === platform.id
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${isSelected
                      ? "border-neon-cyan bg-neon-cyan/10 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                      : "border-border hover:border-neon-cyan/50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold">{platform.name}</span>
                    </div>
                  </button>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
