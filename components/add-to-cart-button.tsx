"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/types"

interface AddToCartButtonProps {
  product: Product
  size?: "default" | "sm" | "lg"
  className?: string
}

export default function AddToCartButton({ product, size = "default", className }: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const { toast } = useToast()
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    // Add the product to the cart
    addToCart(product.id, 1)

    setIsAdded(true)

    // Show toast notification
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })

    // Reset button after 2 seconds
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  return (
    <Button size={size} className={className} onClick={handleAddToCart}>
      {isAdded ? (
        <>
          <Check className={size === "sm" ? "mr-1 h-4 w-4" : "mr-2 h-5 w-5"} />
          {size === "sm" ? "Added" : "Added to Cart"}
        </>
      ) : (
        <>
          <ShoppingCart className={size === "sm" ? "mr-1 h-4 w-4" : "mr-2 h-5 w-5"} />
          {size === "sm" ? "Add" : "Add to Cart"}
        </>
      )}
    </Button>
  )
}
