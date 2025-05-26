"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, ArrowLeft, CheckCircle, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { products } from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import SquarePaymentForm from "@/components/square-payment-form"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { clearCart } = useCart()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cartItems, setCartItems] = useState<Array<{ productId: string; quantity: number }>>([])
  const [email, setEmail] = useState("")
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState("shipping")
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phoneNumber: "",
  })

  // Get cart products with details
  const cartProducts = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return product
        ? {
            ...product,
            quantity: item.quantity,
          }
        : null
    })
    .filter(Boolean)

  // Calculate subtotal
  const subtotal = cartProducts.reduce((total, item) => {
    return total + (item?.price || 0) * (item?.quantity || 0)
  }, 0)

  // Calculate shipping (free over $50 or if pickup is selected)
  const shipping = deliveryMethod === "pickup" ? 0 : subtotal > 50 ? 0 : 5.99

  // Calculate total
  const total = subtotal + shipping

  useEffect(() => {
    // Load checkout data from localStorage
    const savedEmail = localStorage.getItem("checkout_email")
    const savedCart = localStorage.getItem("checkout_cart")

    if (savedEmail && savedCart) {
      try {
        setEmail(savedEmail)
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse checkout data:", error)
        toast({
          title: "Checkout error",
          description: "There was an error loading your checkout information. Please try again.",
          variant: "destructive",
        })
        router.push("/cart")
      }
    } else {
      // If no checkout data, redirect back to cart
      router.push("/cart")
    }

    setIsLoading(false)
  }, [router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate shipping/pickup information
    if (deliveryMethod === "shipping") {
      if (!formData.fullName || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
        toast({
          title: "Missing information",
          description: "Please fill in all shipping details.",
          variant: "destructive",
        })
        return
      }
    } else {
      // For pickup, require name and phone
      if (!formData.fullName || !formData.phoneNumber) {
        toast({
          title: "Missing information",
          description: "Please provide your name and phone number for pickup.",
          variant: "destructive",
        })
        return
      }
    }

    // Proceed to payment step
    setCurrentStep(2)
    window.scrollTo(0, 0)
  }

  const handlePaymentSuccess = async (paymentResult: any) => {
    // Generate a random order number
    const randomPart = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "")
    const newOrderNumber = `OL-${datePart}-${randomPart}`

    setOrderNumber(newOrderNumber)

    // Send order notification emails
    try {
      const orderData = {
        orderNumber: newOrderNumber,
        customerDetails: {
          name: formData.fullName,
          email: email,
          phone: formData.phoneNumber,
        },
        cartItems: cartProducts.map((item) => ({
          name: item?.name,
          quantity: item?.quantity,
          price: item?.price,
        })),
        total: total,
        deliveryMethod: deliveryMethod,
        shippingAddress:
          deliveryMethod === "shipping"
            ? {
                name: formData.fullName,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: formData.country,
              }
            : null,
      }

      const response = await fetch("/api/orders/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error("Failed to send order notifications")
      }
    } catch (error) {
      console.error("Failed to send order notifications:", error)
      // Don't fail the order if email fails
    }

    setOrderComplete(true)

    // Clear cart
    clearCart()

    // Clear checkout data from localStorage
    localStorage.removeItem("checkout_email")
    localStorage.removeItem("checkout_cart")

    window.scrollTo(0, 0)
  }

  const handlePaymentError = (error: Error) => {
    toast({
      title: "Payment failed",
      description: error.message || "There was an error processing your payment. Please try again.",
      variant: "destructive",
    })
  }

  const handleBackToShipping = () => {
    setCurrentStep(1)
    window.scrollTo(0, 0)
  }

  if (isLoading) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="container py-20 max-w-2xl mx-auto">
        <div className="bg-muted/30 rounded-lg border p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
          <p className="text-muted-foreground mb-6">Your payment was successful and your order has been placed.</p>

          <div className="bg-background rounded-lg p-6 mb-8 inline-block">
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="text-xl font-bold">{orderNumber}</p>
          </div>

          {deliveryMethod === "pickup" ? (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Pickup Information</h2>
              <p className="text-muted-foreground">
                Your order will be available for pickup at our Hartford location within 24 hours.
              </p>
              <p className="text-muted-foreground">
                We'll contact you at {formData.phoneNumber} when your order is ready.
              </p>
              <div className="mt-4 p-4 bg-primary/10 rounded-lg inline-block">
                <p className="font-medium">OilLabzZ Hartford</p>
                <p className="text-muted-foreground">257 South Marshall Street</p>
                <p className="text-muted-foreground">Hartford, CT 06105</p>
                <p className="text-muted-foreground mt-2">Hours: Mon-Sat 10am-7pm, Sun 12pm-5pm</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground mb-8">
              We've sent a confirmation email to {email} with your order details. You'll receive another email when your
              order ships.
            </p>
          )}

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

  return (
    <div className="container py-12">
      <Link href="/cart" className="flex items-center text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Checkout Steps */}
      <div className="mb-8">
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
          >
            1
          </div>
          <div className={`h-1 flex-1 mx-2 ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`}></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
          >
            2
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm font-medium">Shipping</span>
          <span className="text-sm font-medium">Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <form onSubmit={handleContinueToPayment} className="space-y-8">
              {/* Delivery Method */}
              <div className="bg-muted/30 rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Delivery Method</h2>
                <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="shipping" id="shipping" className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="shipping" className="font-medium">
                        Ship to my address
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Standard shipping ({shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`})
                        {shipping > 0 && " - Free shipping on orders over $50"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="pickup" className="font-medium">
                        Pickup in Hartford (Free)
                      </Label>
                      <div className="text-sm text-muted-foreground">
                        <p>Pick up your order at our Hartford location:</p>
                        <p className="mt-1">OilLabzZ Hartford</p>
                        <p>257 South Marshall Street, Hartford, CT 06105</p>
                        <p className="mt-1">Hours: Mon-Sat 10am-7pm, Sun 12pm-5pm</p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Shipping Information - Only show if shipping is selected */}
              {deliveryMethod === "shipping" && (
                <div className="bg-muted/30 rounded-lg border p-6">
                  <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          required
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pickup Information - Only show if pickup is selected */}
              {deliveryMethod === "pickup" && (
                <div className="bg-muted/30 rounded-lg border p-6">
                  <h2 className="text-xl font-semibold mb-4">Pickup Information</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                    </div>

                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="(123) 456-7890"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        We'll contact you when your order is ready for pickup
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-primary/10 rounded-lg flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">OilLabzZ Hartford</p>
                      <p className="text-sm text-muted-foreground">257 South Marshall Street, Hartford, CT 06105</p>
                      <p className="text-sm text-muted-foreground mt-1">Hours: Mon-Sat 10am-7pm, Sun 12pm-5pm</p>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full">
                Continue to Payment
              </Button>
            </form>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              {/* Order Summary for Payment Step */}
              <div className="bg-muted/30 rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Payment</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Complete your purchase securely with Square. Your payment information is encrypted and secure.
                </p>

                <SquarePaymentForm
                  amount={total}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  customerName={formData.fullName}
                  customerEmail={email}
                />
              </div>

              <Button variant="outline" onClick={handleBackToShipping} className="w-full">
                Back to Shipping
              </Button>
            </div>
          )}
        </div>

        <div>
          <div className="bg-muted/30 rounded-lg border p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-4">
              {cartProducts.map((item) => (
                <div key={item?.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="relative h-12 w-12 rounded overflow-hidden mr-3">
                      <Image
                        src={item?.imageUrl || "/placeholder.svg"}
                        alt={item?.name || ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item?.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item?.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">${((item?.price || 0) * (item?.quantity || 0)).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Subtotal</p>
                <p className="font-medium">${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">{deliveryMethod === "pickup" ? "Pickup" : "Shipping"}</p>
                <p className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</p>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <p className="font-semibold">Total</p>
                <p className="font-bold">${total.toFixed(2)}</p>
              </div>
            </div>

            {/* Shipping/Pickup Information Summary */}
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">
                {deliveryMethod === "pickup" ? "Pickup" : "Shipping"} Information
              </h3>
              {deliveryMethod === "pickup" ? (
                <div className="text-sm text-muted-foreground">
                  <p>{formData.fullName}</p>
                  <p>{formData.phoneNumber}</p>
                  <p className="mt-2">OilLabzZ Hartford</p>
                  <p>257 South Marshall Street, Hartford, CT 06105</p>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  <p>{formData.fullName}</p>
                  <p>{formData.address}</p>
                  <p>
                    {formData.city}, {formData.state} {formData.zipCode}
                  </p>
                  <p>{formData.country === "US" ? "United States" : "Canada"}</p>
                </div>
              )}
            </div>

            {/* Secure Checkout Badge */}
            <div className="mt-6 flex justify-center">
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-500"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className="text-xs text-muted-foreground">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
