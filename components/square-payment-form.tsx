"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
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
  const [payments, setPayments] = useState<any>(null)
  const cardContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const initializeSquare = async () => {
      try {
        // Wait for DOM to be ready
        if (!cardContainerRef.current) {
          console.log("Card container not ready, retrying...")
          setTimeout(initializeSquare, 500)
          return
        }

        if (!window.Square) {
          throw new Error("Square.js failed to load")
        }

        const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID
        const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID

        if (!applicationId || !locationId) {
          throw new Error("Square configuration missing")
        }

        console.log("Initializing Square with:", { applicationId, locationId })

        // Initialize Square Payments
        const paymentsInstance = window.Square.payments(applicationId, locationId)
        setPayments(paymentsInstance)

        // Create card payment method
        const cardInstance = await paymentsInstance.card({
          style: {
            input: {
              fontSize: "16px",
              fontFamily: "inherit",
              color: "hsl(var(--foreground))",
              backgroundColor: "hsl(var(--background))",
            },
            ".input-container": {
              borderColor: "hsl(var(--border))",
              borderRadius: "6px",
            },
            ".input-container.is-focus": {
              borderColor: "hsl(var(--ring))",
            },
            ".input-container.is-error": {
              borderColor: "hsl(var(--destructive))",
            },
          },
        })

        // Attach to the card container
        await cardInstance.attach("#card-container")
        setCard(cardInstance)

        console.log("Square initialized successfully")
        setIsLoading(false)
      } catch (error: any) {
        console.error("Square initialization error:", error)
        toast({
          title: "Payment system error",
          description: "Unable to load payment form. Please refresh the page and try again.",
          variant: "destructive",
        })
        onPaymentError(error)
      }
    }

    // Wait for component to mount and Square SDK to load
    const timer = setTimeout(initializeSquare, 1500)
    return () => clearTimeout(timer)
  }, [toast, onPaymentError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (disabled || !card || !payments) return

    setIsProcessing(true)

    try {
      // Tokenize the card
      const tokenResult = await card.tokenize()

      if (tokenResult.status === "OK") {
        // Send payment to your server
        const response = await fetch("/api/square/process-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourceId: tokenResult.token,
            amount: Math.round(amount * 100), // Convert to cents
            currency: "USD",
            customerDetails: {
              name: cardholderName,
              email: customerEmail,
            },
          }),
        })

        const result = await response.json()

        if (result.success) {
          onPaymentSuccess(result.payment)
        } else {
          throw new Error(result.error || "Payment failed")
        }
      } else {
        const errorMessage = tokenResult.errors?.[0]?.detail || "Card validation failed"
        throw new Error(errorMessage)
      }
    } catch (error: any) {
      console.error("Payment error:", error)
      toast({
        title: "Payment failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
      onPaymentError(error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading payment form...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="cardholderName">Name on Card</Label>
        <Input
          id="cardholderName"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="Cardholder Name"
          required
          disabled={isProcessing || disabled}
        />
      </div>

      <div>
        <Label>Card Information</Label>
        <div
          id="card-container"
          ref={cardContainerRef}
          className="mt-1 p-3 border rounded-md bg-background min-h-[60px] w-full"
          style={{ minHeight: "60px" }}
        />
        <p className="text-xs text-muted-foreground mt-2">Your payment information is processed securely by Square.</p>
      </div>

      <Button type="submit" className="w-full" disabled={isProcessing || disabled || !card}>
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </Button>

      <div className="flex items-center justify-center mt-4">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
          <span>Secured by Square</span>
        </div>
      </div>
    </form>
  )
}
