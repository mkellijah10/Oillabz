"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Clock, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  timestamp: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/contact")
      const data = await response.json()

      if (response.ok) {
        setMessages(data.messages || [])
      } else {
        throw new Error(data.error || "Failed to fetch messages")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load messages",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Email address copied to clipboard",
    })
  }

  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Contact Messages</h1>
        <Button onClick={fetchMessages} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-sm">
              {messages.length} {messages.length === 1 ? "message" : "messages"}
            </Badge>
          </div>

          {messages.map((message) => (
            <Card key={message.id} className="w-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{message.subject}</CardTitle>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        <button
                          onClick={() => copyToClipboard(message.email)}
                          className="hover:text-primary hover:underline"
                        >
                          {message.email}
                        </button>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(message.timestamp)}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{message.name}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Separator />
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.message}</div>
                  <Separator />
                  <div className="flex space-x-2">
                    <Button size="sm" asChild>
                      <a href={`mailto:${message.email}?subject=Re: ${message.subject}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Reply via Email
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(message.email)}>
                      Copy Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
