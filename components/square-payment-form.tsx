"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SquarePaymentFormProps {
  amount: number
  onPaymentSuccess: (paymentResult: any) => void
  onPaymentError: (error: Error) => void
  customerName: string
  customerEmail: string
  disabled?: boolean
}

declare global {
  interface Window {
    Square: any
  }
}

export default function SquarePaymentForm({
  amount,
  onPaymentSuccess,
  onPaymentError,
  customerName,
  customerEmail,
  disabled = false,
}: SquarePaymentFormProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [card, setCard] = useState<any>(null)
  const [cardholderName, setCardholderName] = useState(customerName || "")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const init = async () => {
      try {
        console.log("Starting Square initialization...")

        // Wait for DOM to be fully ready
        await new Promise((resolve) => setTimeout(resolve, 3000))

        // Create container element dynamically
        const existingContainer = document.getElementById("card-container")
        if (existingContainer) {
          existingContainer.remove()
        }

        const container = document.createElement("div")
        container.id = "card-container"
        container.style.cssText = `
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background-color: white;
          min-height: 100px;
          width: 100%;
          display: block;
        `

        // Find the parent element and append
        const parentElement = document.querySelector("[data-card-parent]")
        if (parentElement) {
          parentElement.appendChild(container)
          console.log("Container created and appended")
        } else {
          throw new Error("Parent element not found")
        }

        // Wait for Square SDK
        let attempts = 0
        while (!window.Square && attempts < 100) {
          await new Promise((resolve) => setTimeout(resolve, 100))
          attempts++
        }

        if (!window.Square) {
          throw new Error("Square SDK not loaded")
        }

        console.log("Square SDK loaded, creating payments...")

        const payments = window.Square.payments(
          process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID!,
          process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!,
        )

        const cardInstance = await payments.card()
        console.log("Card instance created, attaching...")

        await cardInstance.attach("#card-container")
        console.log("Card attached successfully!")

        setCard(cardInstance)
        setIsLoading(false)
      } catch (err: any) {
        console.error("Square initialization error:", err)
        setError(err.message)
        setIsLoading(false)
      }
    }

    init()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!card || !cardholderName.trim()) return

    setIsProcessing(true)
    try {
      const tokenResult = await card.tokenize()
      if (tokenResult.status !== "OK") {
        throw new Error(tokenResult.errors?.[0]?.detail || "Card error")
      }

      const response = await fetch("/api/square/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: tokenResult.token,
          amount: Math.round(amount * 100),
          currency: "USD",
          customerDetails: { name: cardholderName, email: customerEmail },
        }),
      })

      const result = await response.json()
      if (result.success) {
        onPaymentSuccess(result.payment)
      } else {
        throw new Error(result.error)
      }
    } catch (err: any) {
      toast({
        title: "Payment failed",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Payment Error: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry Payment Setup</Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Setting up secure payment form...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Name on Card</Label>
        <Input
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          required
          disabled={isProcessing}
          placeholder="Enter cardholder name"
        />
      </div>

      <div>
        <Label>Card Information</Label>
        <div data-card-parent className="mt-2">
          {/* Container will be created here dynamically */}
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isProcessing || !card}>
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </Button>

      <div className="text-center text-xs text-muted-foreground">🔒 Secured by Square</div>
    </form>
  )
}
