import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // Save to database
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject: subject || "Contact Form Submission",
      message,
      status: "unread",
    })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
    }

    // Here you would typically send an email notification
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
