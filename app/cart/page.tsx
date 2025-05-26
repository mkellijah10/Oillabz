"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2 } from "lucide-react"
import { products } from "@/lib/products"
import CheckoutButton from "@/components/checkout-button"
import { useCart } from "@/lib/cart-context"

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart()
  const [email, setEmail] = useState("")

  // Get product details for cart items
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

  // Calculate shipping (free over $50)
  const shipping = subtotal > 50 ? 0 : 5.99

  // Calculate total
  const total = subtotal + shipping

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 space-y-6">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-muted/30 rounded-lg border overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 p-4 bg-muted/50 font-medium">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="divide-y">
                {cartProducts.map((item) => (
                  <div key={item?.id} className="p-4 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
                    <div className="col-span-6 flex items-center space-x-4 mb-4 sm:mb-0">
                      <Image
                        src={item?.imageUrl || "/placeholder.svg?height=80&width=80"}
                        alt={item?.name || "Product"}
                        width={80}
                        height={80}
                        className="rounded-md w-20 h-20 object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{item?.name}</h3>
                        <p className="text-sm text-muted-foreground">{item?.category}</p>
                      </div>
                    </div>

                    <div className="col-span-2 text-center mb-4 sm:mb-0">
                      <p className="sm:hidden text-sm font-medium inline-block mr-2">Price:</p>
                      <p>${item?.price.toFixed(2)}</p>
                    </div>

                    <div className="col-span-2 flex items-center justify-center mb-4 sm:mb-0">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item?.id || "", (item?.quantity || 0) - 1)}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Decrease</span>
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item?.quantity}
                          onChange={(e) => updateQuantity(item?.id || "", Number.parseInt(e.target.value) || 1)}
                          className="h-8 w-12 text-center border-0 rounded-none"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item?.id || "", (item?.quantity || 0) + 1)}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Increase</span>
                        </Button>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center justify-between sm:justify-end">
                      <div>
                        <p className="sm:hidden text-sm font-medium inline-block mr-2">Total:</p>
                        <p className="font-medium">${((item?.price || 0) * (item?.quantity || 0)).toFixed(2)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => removeFromCart(item?.id || "")}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-muted/30 rounded-lg border p-6 space-y-6">
              <h2 className="text-xl font-bold">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Subtotal</p>
                  <p className="font-medium">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Shipping</p>
                  <p className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</p>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <p className="font-semibold">Total</p>
                  <p className="font-bold">${total.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email for order confirmation
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <CheckoutButton
                  cartItems={cartItems.map((item) => ({ productId: item.productId, quantity: item.quantity }))}
                  customerEmail={email}
                  className="w-full"
                />
              </div>

              <div className="text-center">
                <Link href="/" className="text-sm text-primary hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
