"use client"

import { useReviews } from "@/components/reviews-context"
import StarRating from "@/components/star-rating"

interface ProductRatingProps {
  productId: string
  className?: string
  showCount?: boolean
}

export default function ProductRating({ productId, className, showCount = false }: ProductRatingProps) {
  const { getProductReviews, getAverageRating } = useReviews()

  const averageRating = getAverageRating(productId)
  const reviewCount = getProductReviews(productId).length

  if (reviewCount === 0) {
    return null
  }

  return (
    <div className={className}>
      <div className="flex items-center">
        <StarRating rating={averageRating} size="sm" />
        {showCount && (
          <span className="ml-2 text-xs text-muted-foreground">
            ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
          </span>
        )}
      </div>
    </div>
  )
}
