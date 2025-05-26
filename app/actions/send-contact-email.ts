"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(formData: FormData) {
  console.log("Contact form submission started")

  try {
    // Check if API key exists
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is missing")
      return { success: false, error: "Email service not configured. Please try again later." }
    }

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string
    const subject = (formData.get("subject") as string) || "New Contact Form Submission"
    const phone = formData.get("phone") as string

    console.log("Form data received:", { name, email, subject, hasMessage: !!message })

    // Validate required fields
    if (!name || !email || !message || !subject) {
      return { success: false, error: "Please fill in all required fields." }
    }

    // Send email to OilLabzZ
    console.log("Attempting to send email to droopyfoa@gmail.com")

    const { data, error } = await resend.emails.send({
      from: "OilLabzZ Contact <onboarding@resend.dev>",
      to: ["droopyfoa@gmail.com"],
      subject: `OilLabzZ Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #e91e63, #f06292); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">OilLabzZ</h1>
            <p style="color: white; margin: 5px 0 0 0;">New Contact Form Submission</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Customer Inquiry</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
              ${phone ? `<p style="margin: 0 0 10px 0;"><strong>Phone:</strong> ${phone}</p>` : ""}
              <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
              <p style="margin: 0; line-height: 1.6; color: #555;">${message.replace(/\n/g, "<br>")}</p>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; background: #333; color: white;">
            <p style="margin: 0; font-size: 14px;">This email was sent from the OilLabzZ website contact form</p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">Visit us at oillabzz.com</p>
          </div>
        </div>
      `,
      replyTo: email,
    })

    if (error) {
      console.error("Resend API error:", error)
      return { success: false, error: "Failed to send email. Please try again or contact us directly." }
    }

    console.log("Email sent successfully:", data)
    return {
      success: true,
      message: "Thank you for contacting OilLabzZ! We'll get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Server error in sendContactEmail:", error)
    return { success: false, error: "Something went wrong. Please try again later or contact us directly." }
  }
}
