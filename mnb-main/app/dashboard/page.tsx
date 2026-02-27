import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  ArrowUpRight,
  Plus
} from "lucide-react"
import Link from "next/link"

const stats = [
  { name: "Total Posts", value: "247", change: "+12%", icon: TrendingUp, color: "text-neon-cyan" },
  { name: "Total Reach", value: "45.2K", change: "+23%", icon: Users, color: "text-neon-purple" },
  { name: "Impressions", value: "128K", change: "+18%", icon: Eye, color: "text-neon-pink" },
  { name: "Engagement", value: "8.4%", change: "+5%", icon: Heart, color: "text-neon-green" },
]

const recentPosts = [
  {
    id: 1,
    title: "5 Tips for Better Content",
    platforms: ["Instagram", "Twitter", "LinkedIn"],
    status: "Published",
    engagement: "2.4K",
    date: "2 hours ago",
  },
  {
    id: 2,
    title: "Product Launch Announcement",
    platforms: ["Instagram", "Facebook"],
    status: "Scheduled",
    engagement: "1.8K",
    date: "5 hours ago",
  },
  {
    id: 3,
    title: "Weekly Roundup",
    platforms: ["Twitter", "LinkedIn"],
    status: "Published",
    engagement: "3.2K",
    date: "1 day ago",
  },
]

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your content today
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button variant="neon" className="gap-2">
            <Plus className="w-4 h-4" />
            Create Post
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="glass hover:glow-cyan transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <span className="text-neon-green">{stat.change}</span>
                <span>from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Your latest content performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-start justify-between p-4 rounded-lg glass border border-border/50 hover:border-neon-cyan/50 transition-all"
              >
                <div className="space-y-1 flex-1">
                  <h4 className="font-semibold">{post.title}</h4>
                  <div className="flex flex-wrap gap-2">
                    {post.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="text-xs px-2 py-1 rounded bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.engagement}
                    </span>
                    <span>{post.date}</span>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    post.status === "Published"
                      ? "bg-neon-green/10 text-neon-green border border-neon-green/20"
                      : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                  }`}
                >
                  {post.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get things done faster</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/create">
              <Button variant="outline" className="w-full justify-start gap-2 glass">
                <Plus className="w-4 h-4" />
                Create New Post
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="outline" className="w-full justify-start gap-2 glass">
                <TrendingUp className="w-4 h-4" />
                View Analytics
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start gap-2 glass">
              <Share2 className="w-4 h-4" />
              Schedule Post
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 glass">
              <MessageCircle className="w-4 h-4" />
              View Comments
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>Engagement across all platforms</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              View All
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { platform: "Instagram", engagement: 45, posts: 89, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
              { platform: "Twitter", engagement: 32, posts: 67, color: "bg-gradient-to-r from-blue-400 to-blue-600" },
              { platform: "LinkedIn", engagement: 28, posts: 45, color: "bg-gradient-to-r from-blue-600 to-blue-800" },
              { platform: "Facebook", engagement: 18, posts: 34, color: "bg-gradient-to-r from-blue-500 to-blue-700" },
            ].map((item) => (
              <div key={item.platform} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.platform}</span>
                  <span className="text-muted-foreground">{item.posts} posts</span>
                </div>
                <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${item.engagement}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.engagement}% engagement rate
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
