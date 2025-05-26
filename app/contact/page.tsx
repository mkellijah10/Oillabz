"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        // Reset form and show success message
        setFormData({ name: "", email: "", subject: "", message: "" })
        setIsSubmitted(true)

        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you as soon as possible.",
        })

        // Hide success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000)
      } else {
        throw new Error(result.error || "Failed to send message")
      }
    } catch (error: any) {
      console.error("Contact form error:", error)
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later or contact us directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-muted/30 p-6 rounded-lg border flex flex-col items-center text-center">
          <Mail className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Email</h3>
          <p className="text-muted-foreground">
            <a href="mailto:harpernevado41@gmail.com" className="hover:underline">
              harpernevado41@gmail.com
            </a>
          </p>
        </div>

        <div className="bg-muted/30 p-6 rounded-lg border flex flex-col items-center text-center">
          <Phone className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Phone</h3>
          <p className="text-muted-foreground">
            <a href="tel:+19592311167" className="hover:underline">
              (959) 231-1167
            </a>
          </p>
        </div>

        <div className="bg-muted/30 p-6 rounded-lg border flex flex-col items-center text-center">
          <MapPin className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Location</h3>
          <p className="text-muted-foreground">New England, USA</p>
        </div>
      </div>

      <div className="bg-muted/30 p-8 rounded-lg border">
        <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>

        {isSubmitted ? (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-lg mb-6">
            Thank you for your message! We'll get back to you as soon as possible.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Your Name *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Your Email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject *
            </label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="How can we help you?"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message *
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Your message here..."
              rows={6}
              disabled={isSubmitting}
            />
          </div>

          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  )
}
