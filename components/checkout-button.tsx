"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CheckoutButtonProps {
  cartItems: Array<{ productId: string; quantity: number }>
  customerEmail?: string
  className?: string
}

export default function CheckoutButton({ cartItems, customerEmail, className }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    if (!customerEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address to continue with checkout.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Store cart information in localStorage for the checkout page
      localStorage.setItem("checkout_email", customerEmail)
      localStorage.setItem("checkout_cart", JSON.stringify(cartItems))

      // Redirect to checkout page
      router.push("/checkout")
    } catch (error: any) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: error.message || "An error occurred during checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button className={className} size="lg" onClick={handleCheckout} disabled={isLoading || cartItems.length === 0}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          Proceed to Checkout
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  )
}
