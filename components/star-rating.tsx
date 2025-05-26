import { Star, StarHalf } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  max?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  className?: string
}

export default function StarRating({ rating, max = 5, size = "md", showValue = false, className }: StarRatingProps) {
  // Calculate full and half stars
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  // Determine star size based on the size prop
  const starSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }[size]

  // Generate stars array
  const stars = Array.from({ length: max }, (_, i) => {
    if (i < fullStars) {
      return <Star key={i} className={cn(starSize, "fill-amber-500 text-amber-500")} />
    } else if (i === fullStars && hasHalfStar) {
      return <StarHalf key={i} className={cn(starSize, "fill-amber-500 text-amber-500")} />
    } else {
      return <Star key={i} className={cn(starSize, "text-muted-foreground")} />
    }
  })

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex">{stars}</div>
      {showValue && <span className="ml-2 text-sm text-muted-foreground">({rating.toFixed(1)})</span>}
    </div>
  )
}
