"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StripeCheckoutButtonProps {
  amount: number
  cartItems: Array<{
    name: string
    price: number
    quantity: number
    imageUrl?: string
  }>
  customerEmail: string
  customerName: string
  deliveryMethod: string
  shippingAddress?: any
}

export default function StripeCheckoutButton({
  amount,
  cartItems,
  customerEmail,
  customerName,
  deliveryMethod,
  shippingAddress,
}: StripeCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          cartItems,
          customerEmail,
          customerName,
          deliveryMethod,
          shippingAddress,
        }),
      })

      const { url, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      if (url) {
        // Redirect to Stripe checkout
        window.location.href = url
      }
    } catch (error: any) {
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to start checkout process",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading} size="lg" className="w-full">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecting to Checkout...
        </>
      ) : (
        `Pay $${amount.toFixed(2)} with Stripe`
      )}
    </Button>
  )
}
