import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Eye, Calendar } from "lucide-react"
import Image from "next/image"

interface Video {
  id: string
  title: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  views: number
  created_at: string
}

async function getVideos(): Promise<Video[]> {
  const { data, error } = await supabase.from("videos").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching videos:", error)
    return []
  }

  return data || []
}

export default async function VideosPage() {
  const videos = await getVideos()

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Motivational Videos</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Inspiring content about AI, career development, and the future of technology. Join me on this journey of
            continuous learning and growth.
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {videos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No videos available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}

function VideoCard({ video }: { video: Video }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        {video.thumbnail_url ? (
          <Image
            src={video.thumbnail_url || "/placeholder.svg"}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Play className="w-16 h-16 text-white opacity-80" />
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Play className="w-8 h-8 text-gray-800 ml-1" />
          </div>
        </div>

        {/* Views badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-black bg-opacity-70 text-white border-0">
            <Eye className="w-3 h-3 mr-1" />
            {formatViews(video.views)}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors line-clamp-2">
          {video.title}
        </CardTitle>
        {video.description && (
          <CardDescription className="text-gray-600 line-clamp-3">{video.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(video.created_at)}
          </div>
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {formatViews(video.views)} views
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
