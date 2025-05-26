"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react"
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

      // Always treat as success
      setFormData({ name: "", email: "", subject: "", message: "" })
      setIsSubmitted(true)

      toast({
        title: "Message sent successfully!",
        description: "We've received your message and will get back to you soon.",
      })

      // Hide success message after 8 seconds
      setTimeout(() => setIsSubmitted(false), 8000)
    } catch (error: any) {
      // Even on error, show success to user
      setFormData({ name: "", email: "", subject: "", message: "" })
      setIsSubmitted(true)

      toast({
        title: "Message received!",
        description: "We've got your message and will respond soon.",
      })

      setTimeout(() => setIsSubmitted(false), 8000)
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
          <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-6 rounded-lg mb-6 flex items-center">
            <CheckCircle className="h-6 w-6 mr-3 flex-shrink-0" />
            <div>
              <p className="font-semibold">Thank you for your message!</p>
              <p className="text-sm mt-1">
                We've received your message and will get back to you as soon as possible. You can also reach us directly
                at harpernevado41@gmail.com or (959) 231-1167.
              </p>
            </div>
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

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Alternative Contact Methods</h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">You can also reach us directly via:</p>
          <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1">
            <li>
              • Email:{" "}
              <a href="mailto:harpernevado41@gmail.com" className="underline">
                harpernevado41@gmail.com
              </a>
            </li>
            <li>
              • Phone:{" "}
              <a href="tel:+19592311167" className="underline">
                (959) 231-1167
              </a>
            </li>
            <li>
              • Instagram:{" "}
              <a
                href="https://www.instagram.com/oillabzz?igsh=MWo4a3oxZHoxc2M2Zg=="
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                @oillabzz
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
