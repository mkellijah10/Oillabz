"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string
    const subject = (formData.get("subject") as string) || "New Contact Form Submission"

    // Replace with the actual email from your website
    const recipientEmail = "your-email@example.com" // Update this with your actual email

    const { data, error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>", // This will work for testing
      to: [recipientEmail],
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        
        <hr>
        <p><em>This email was sent from your website's contact form.</em></p>
      `,
      replyTo: email, // This allows you to reply directly to the sender
    })

    if (error) {
      console.error("Email sending error:", error)
      return { success: false, error: "Failed to send email" }
    }

    return { success: true, message: "Email sent successfully!" }
  } catch (error) {
    console.error("Server error:", error)
    return { success: false, error: "Server error occurred" }
  }
}
