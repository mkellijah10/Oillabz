"use client"

import { useActionState } from "react"
import { sendContactEmail } from "@/app/actions/send-email"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, CheckCircle, AlertCircle } from "lucide-react"

export default function ContactForm() {
  const [state, action, isPending] = useActionState(sendContactEmail, null)

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Us
                </CardTitle>
                <CardDescription>Send us an email and we'll get back to you within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">contact@yourwebsite.com</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Call Us
                </CardTitle>
                <CardDescription>Speak directly with our team during business hours.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">+1 (555) 123-4567</p>
                <p className="text-sm text-gray-600">Mon-Fri 9AM-6PM EST</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Visit Us
                </CardTitle>
                <CardDescription>Come visit our office for an in-person consultation.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">123 Business Street</p>
                <p className="text-gray-600">Suite 100, City, State 12345</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={action} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <Input type="text" id="name" name="name" required placeholder="Your full name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <Input type="email" id="email" name="email" required placeholder="your.email@example.com" />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <Input type="text" id="subject" name="subject" required placeholder="What is this regarding?" />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Sending..." : "Send Message"}
                </Button>

                {/* Success/Error Messages */}
                {state?.success && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
                    <CheckCircle className="w-5 h-5" />
                    <span>{state.message}</span>
                  </div>
                )}

                {state?.error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
                    <AlertCircle className="w-5 h-5" />
                    <span>{state.error}</span>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
