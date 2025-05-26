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
  const { toast } = useToast()

  // This is a simplified version without actual Square SDK integration
  // In a real implementation, you would load the Square Web Payments SDK
  // and initialize the card element

  useEffect(() => {
    // Simulate loading the Square SDK
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (disabled) return

    setIsProcessing(true)

    try {
      // In a real implementation, you would tokenize the card and process the payment
      // For this demo, we'll simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const paymentResult = {
        id: `sq_payment_${Date.now()}`,
        amount,
        currency: "USD",
        status: "COMPLETED",
        receiptUrl: `https://squareup.com/receipt/preview/${Date.now()}`,
        customer: {
          name: customerName,
          email: customerEmail,
        },
      }

      onPaymentSuccess(paymentResult)
    } catch (error: any) {
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
        <div className="mt-1 p-3 border rounded-md bg-background">
          {/* In a real implementation, this would be the Square card element */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" required disabled={isProcessing || disabled} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expDate">Expiration Date</Label>
                <Input id="expDate" placeholder="MM/YY" required disabled={isProcessing || disabled} />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" required disabled={isProcessing || disabled} />
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Your payment information is processed securely by Square.</p>
      </div>

      <Button type="submit" className="w-full" disabled={isProcessing || disabled}>
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </Button>

      <div className="flex items-center justify-center mt-4">
        <img src="/images/square-secure-payments.png" alt="Secured by Square Payments" className="h-6" />
      </div>
    </form>
  )
}
