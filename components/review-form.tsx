"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Review } from "@/lib/types"

interface ReviewFormProps {
  productId: string
  onReviewSubmit: (review: Review) => void
}

export default function ReviewForm({ productId, onReviewSubmit }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number.parseInt(value, 10) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create a new review object
      const newReview: Review = {
        id: `review-${Date.now()}`,
        productId,
        name: formData.name,
        email: formData.email,
        rating: formData.rating,
        comment: formData.comment,
        date: new Date().toISOString().split("T")[0],
        verified: true,
      }

      // In a real app, you would send this to your API
      // For now, we'll just add it to our local state
      onReviewSubmit(newReview)

      // Reset form
      setFormData({
        name: "",
        email: "",
        rating: 5,
        comment: "",
      })

      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">Write a Review</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Your Name
          </label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Your Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="rating" className="text-sm font-medium">
          Rating
        </label>
        <select
          id="rating"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="5">5 Stars - Excellent</option>
          <option value="4">4 Stars - Very Good</option>
          <option value="3">3 Stars - Good</option>
          <option value="2">2 Stars - Fair</option>
          <option value="1">1 Star - Poor</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="comment" className="text-sm font-medium">
          Your Review
        </label>
        <Textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          required
          placeholder="Share your experience with this product..."
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
