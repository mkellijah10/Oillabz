"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
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
  const [error, setError] = useState<string | null>(null)
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const { toast } = useToast()
  const [containerReady, setContainerReady] = useState(false)

  const addDebugInfo = (message: string) => {
    console.log(`[Square Debug] ${message}`)
    setDebugInfo((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  // Callback ref to capture the container element
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      addDebugInfo("Container ref captured successfully")
      setContainerElement(node)
      setContainerReady(true) // Add this line
    }
  }, [])

  useEffect(() => {
    addDebugInfo("Component mounted, starting initialization...")

    // Log environment variables (without exposing sensitive data)
    addDebugInfo(`App ID exists: ${!!process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID}`)
    addDebugInfo(`Location ID exists: ${!!process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID}`)
    addDebugInfo(`API URL: ${process.env.NEXT_PUBLIC_SQUARE_API_URL || "not set"}`)

    if (!containerReady || !containerElement) {
      addDebugInfo("Waiting for container element...")
      return
    }

    const initializeSquare = async () => {
      try {
        setError(null)
        addDebugInfo("Container element ready, checking Square SDK...")

        // Check if Square SDK script is loaded
        const squareScript = document.querySelector('script[src*="square.js"]')
        addDebugInfo(`Square script element found: ${!!squareScript}`)

        // Wait for Square SDK with more detailed logging
        let sdkRetries = 0
        const maxRetries = 100 // Increase max retries

        while (!window.Square && sdkRetries < maxRetries) {
          addDebugInfo(`SDK check attempt ${sdkRetries + 1}/${maxRetries}`)
          await new Promise((resolve) => setTimeout(resolve, 200)) // Longer wait
          sdkRetries++
        }

        if (!window.Square) {
          throw new Error(`Square SDK failed to load after ${maxRetries} attempts. Please refresh the page.`)
        }

        addDebugInfo("Square SDK loaded successfully!")

        const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID
        const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID

        if (!applicationId || !locationId) {
          throw new Error("Missing Square configuration. Please contact support.")
        }

        addDebugInfo(`Initializing with App ID: ${applicationId.substring(0, 10)}...`)
        addDebugInfo(`Location ID: ${locationId.substring(0, 10)}...`)

        // Initialize Square Payments
        const paymentsInstance = window.Square.payments(applicationId, locationId)
        addDebugInfo("Square payments instance created")
        setPayments(paymentsInstance)

        addDebugInfo("Creating card instance...")

        // Create card payment method with simpler options first
        const cardInstance = await paymentsInstance.card()
        addDebugInfo("Card instance created successfully")

        addDebugInfo("Attaching card to container...")

        // Attach directly to the container element
        await cardInstance.attach(containerElement)
        addDebugInfo("Card attached to container successfully!")

        setCard(cardInstance)
        setIsLoading(false)
        addDebugInfo("Square payment form fully initialized!")
      } catch (error: any) {
        addDebugInfo(`Initialization error: ${error.message}`)
        console.error("Square initialization error:", error)
        setError(error.message)
        setIsLoading(false)
        onPaymentError(error)
      }
    }

    // Longer delay to ensure everything is ready
    addDebugInfo("Starting initialization in 1 second...")
    const timer = setTimeout(initializeSquare, 1000)
    return () => clearTimeout(timer)
  }, [containerReady, containerElement, onPaymentError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (disabled || !card || !payments || !cardholderName.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    addDebugInfo("Starting payment process...")

    try {
      addDebugInfo("Tokenizing card...")

      // Tokenize the card
      const tokenResult = await card.tokenize()

      if (tokenResult.status === "OK") {
        addDebugInfo("Card tokenized successfully, processing payment...")

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
          addDebugInfo("Payment processed successfully!")
          toast({
            title: "Payment successful!",
            description: "Your order has been processed.",
          })
          onPaymentSuccess(result.payment)
        } else {
          throw new Error(result.error || "Payment failed")
        }
      } else {
        const errorMessage = tokenResult.errors?.[0]?.detail || "Card validation failed"
        throw new Error(errorMessage)
      }
    } catch (error: any) {
      addDebugInfo(`Payment error: ${error.message}`)
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

  const handleRetry = () => {
    addDebugInfo("Retrying initialization...")
    setError(null)
    setIsLoading(true)
    setDebugInfo([])
    window.location.reload()
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-8 space-y-4 text-center">
        <div className="text-red-500 mb-4">
          <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold">Payment System Error</h3>
        <p className="text-sm text-muted-foreground max-w-md">{error}</p>

        {/* Debug information */}
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm font-medium">Debug Information</summary>
          <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono max-h-40 overflow-y-auto">
            {debugInfo.map((info, index) => (
              <div key={index}>{info}</div>
            ))}
          </div>
        </details>

        <Button onClick={handleRetry} className="mt-4">
          Retry Payment Setup
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading secure payment form...</span>

        {/* Show debug info while loading */}
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm font-medium">Loading Details</summary>
          <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono max-h-40 overflow-y-auto">
            {debugInfo.map((info, index) => (
              <div key={index}>{info}</div>
            ))}
          </div>
        </details>

        {/* Force retry button after 30 seconds */}
        <Button onClick={handleRetry} variant="outline" size="sm" className="mt-4 bg-transparent">
          Force Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="cardholderName">Name on Card *</Label>
          <Input
            id="cardholderName"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            placeholder="Enter cardholder name"
            required
            disabled={isProcessing || disabled}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Card Information *</Label>
          <div
            ref={containerRef}
            className="mt-1 p-4 border-2 border-gray-300 rounded-lg bg-white min-h-[120px] w-full"
            style={{
              minHeight: "120px",
              width: "100%",
              display: "block",
              position: "relative",
            }}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Your payment information is encrypted and processed securely by Square.
          </p>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isProcessing || disabled || !card || !cardholderName.trim()}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Payment...
            </>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </Button>
      </form>

      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
          <span>Secured by Square</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">We accept all major credit and debit cards</p>
      </div>
    </div>
  )
}
