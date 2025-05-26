import { formatDistanceToNow } from "date-fns"
import { CheckCircle } from "lucide-react"
import StarRating from "@/components/star-rating"
import type { Review } from "@/lib/types"

interface ReviewListProps {
  reviews: Review[]
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6 last:border-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <StarRating rating={review.rating} size="sm" />
              <h4 className="ml-2 font-medium">{review.name}</h4>
              {review.verified && (
                <span className="ml-2 flex items-center text-xs text-green-600 dark:text-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified Purchase
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}
