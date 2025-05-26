"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { initialReviews } from "@/lib/reviews"
import type { Review } from "@/lib/types"

type ReviewsContextType = {
  reviews: Review[]
  addReview: (review: Review) => void
  getProductReviews: (productId: string) => Review[]
  getAverageRating: (productId: string) => number
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined)

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([])

  // Load reviews from localStorage on initial render
  useEffect(() => {
    const savedReviews = localStorage.getItem("reviews")
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews))
      } catch (error) {
        console.error("Failed to parse reviews from localStorage:", error)
        setReviews(initialReviews)
      }
    } else {
      setReviews(initialReviews)
    }
  }, [])

  // Save reviews to localStorage whenever it changes
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem("reviews", JSON.stringify(reviews))
    }
  }, [reviews])

  const addReview = (review: Review) => {
    setReviews((prevReviews) => [...prevReviews, review])
  }

  const getProductReviews = (productId: string) => {
    return reviews.filter((review) => review.productId === productId)
  }

  const getAverageRating = (productId: string) => {
    const productReviews = getProductReviews(productId)
    if (productReviews.length === 0) return 0

    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0)
    return totalRating / productReviews.length
  }

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        addReview,
        getProductReviews,
        getAverageRating,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  )
}

export function useReviews() {
  const context = useContext(ReviewsContext)
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewsProvider")
  }
  return context
}
