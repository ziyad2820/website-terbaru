import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware-auth"
import { supabase } from "@/lib/supabase"

async function handler(request: NextRequest) {
  try {
    // Get counts from each table
    const [projectsResult, notesResult, videosResult, messagesResult, viewsResult] = await Promise.all([
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("notes").select("id", { count: "exact", head: true }),
      supabase.from("videos").select("id", { count: "exact", head: true }),
      supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "unread"),
      supabase.from("videos").select("views"),
    ])

    // Calculate total views
    const totalViews = viewsResult.data?.reduce((sum, video) => sum + (video.views || 0), 0) || 0

    const stats = {
      projects: projectsResult.count || 0,
      notes: notesResult.count || 0,
      videos: videosResult.count || 0,
      messages: messagesResult.count || 0,
      totalViews,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

export const GET = withAuth(handler)
