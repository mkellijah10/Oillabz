import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Log the message to console (you can see this in Vercel logs)
    console.log("=== NEW CONTACT MESSAGE ===")
    console.log("Time:", new Date().toISOString())
    console.log("Name:", name)
    console.log("Email:", email)
    console.log("Subject:", subject)
    console.log("Message:", message)
    console.log("========================")

    // Always return success - we're just logging for now
    return NextResponse.json({
      success: true,
      message: "Message received successfully! We'll get back to you soon.",
    })
  } catch (error: any) {
    console.error("Contact form error:", error)

    // Even if there's an error, return success to the user
    return NextResponse.json({
      success: true,
      message: "Message received! We'll get back to you soon.",
    })
  }
}
