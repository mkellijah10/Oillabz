"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"

export default function CartIcon() {
  const { getCartCount, recentlyAdded } = useCart()
  const [count, setCount] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [animateCount, setAnimateCount] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setCount(getCartCount())
  }, [getCartCount])

  // Update count when cart changes
  useEffect(() => {
    if (isClient) {
      const newCount = getCartCount()
      if (newCount > count) {
        setAnimateCount(true)
        setTimeout(() => setAnimateCount(false), 1000)
      }
      setCount(newCount)
    }
  }, [getCartCount, isClient, count])

  // Trigger notification when recentlyAdded changes to true
  useEffect(() => {
    if (recentlyAdded) {
      setShowNotification(true)

      // Reset notification after it completes
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [recentlyAdded])

  // Only show count badge if on client and count > 0
  const showBadge = isClient && count > 0

  return (
    <div className="relative">
      {showNotification && (
        <div className="absolute -top-10 right-0 bg-green-500 text-white text-xs rounded-md py-1 px-2 animate-bounce whitespace-nowrap z-50 shadow-md">
          Item added to cart!
        </div>
      )}
      <Link href="/cart">
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "relative transition-all duration-300",
            showNotification && "ring-2 ring-primary ring-offset-2 ring-offset-background",
          )}
        >
          <ShoppingCart className={cn("h-4 w-4", showNotification && "text-primary")} />
          {showBadge && (
            <span
              className={cn(
                "absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all",
                (showNotification || animateCount) && "animate-pulse scale-125",
              )}
            >
              {count}
            </span>
          )}
          <span className="sr-only">Shopping Cart</span>
        </Button>
      </Link>
    </div>
  )
}
