import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Basic validation
    const { name, email, company, phone, request_details } = body

    if (!name || !email || !request_details) {
      return NextResponse.json({ error: "Name, email, and request details are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("deal_finder_requests")
      .insert({
        name,
        email,
        company: company || null,
        phone: phone || null,
        request_details,
        status: "new",
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving to Supabase:", error)
      return NextResponse.json({ error: "Failed to save request" }, { status: 500 })
    }

    console.log("New Deal Finder request saved:", data)

    return NextResponse.json({ ok: true, data })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
