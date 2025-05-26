"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [isLoading, setIsLoading] = useState(true)
  const [orderNumber, setOrderNumber] = useState("")

  useEffect(() => {
    // Generate a random order number for demonstration
    // In a real application, you would fetch this from your database
    const generateOrderNumber = () => {
      const randomPart = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")
      const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "")
      return `OL-${datePart}-${randomPart}`
    }

    // Simulate API call to verify payment
    const verifyPayment = async () => {
      try {
        // In a real application, you would verify the session with Stripe
        // and retrieve order details from your database
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setOrderNumber(generateOrderNumber())
      } catch (error) {
        console.error("Error verifying payment:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (sessionId) {
      verifyPayment()
    } else {
      setIsLoading(false)
    }
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="container py-20 max-w-2xl mx-auto text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-primary" />
        <h1 className="text-2xl font-bold mb-4">Processing Your Order</h1>
        <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
      </div>
    )
  }

  if (!sessionId) {
    return (
      <div className="container py-20 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid Session</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find your order information. If you've completed a purchase, please contact customer support.
        </p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-20 max-w-2xl mx-auto">
      <div className="bg-muted/30 rounded-lg border p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
        <p className="text-muted-foreground mb-6">Your order has been placed successfully.</p>

        <p className="text-muted-foreground mb-8">
          We've sent a confirmation email with your order details. You'll receive another email when your order ships.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
