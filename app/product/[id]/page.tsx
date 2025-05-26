"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { products } from "@/lib/products"
import AddToCartButton from "@/components/add-to-cart-button"
import ProductImageGallery from "@/components/product-image-gallery"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StarRating from "@/components/star-rating"
import ReviewList from "@/components/review-list"
import ReviewForm from "@/components/review-form"
import { useReviews } from "@/components/reviews-context"
import ProductRating from "@/components/product-rating" // Import ProductRating component

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = params
  const { getProductReviews, getAverageRating, addReview } = useReviews()
  const [activeTab, setActiveTab] = useState("description")

  // Find product by ID
  const product = products.find((p) => p.id === id)

  // If product not found, return 404
  if (!product) {
    notFound()
  }

  // Get reviews for this product
  const productReviews = getProductReviews(product.id)
  const averageRating = getAverageRating(product.id)

  // Get related products (same category, excluding current product)
  const relatedProducts = products.filter((p) => p.type === product.type && p.id !== product.id).slice(0, 3)

  // Prepare images array for gallery
  const productImages = product.images || [product.imageUrl]

  return (
    <div className="container py-12">
      <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <ProductImageGallery images={productImages} alt={product.name} />

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">{product.category}</p>

            <div className="flex items-center mt-2">
              <StarRating rating={averageRating} showValue size="md" />
              <span className="ml-2 text-sm text-muted-foreground">
                ({productReviews.length} {productReviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>

          <div className="border-t pt-6">
            <p className="text-3xl font-bold mb-4">${product.price.toFixed(2)}</p>
            <p className="text-muted-foreground mb-6">{product.description}</p>

            <div className="space-y-4">
              <AddToCartButton product={product} />
              <Link href="/cart">
                <Button variant="outline" size="lg" className="w-full">
                  View Cart
                </Button>
              </Link>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Product Details</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-medium">Type:</span>{" "}
                {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
              </li>
              {product.gender && (
                <li>
                  <span className="font-medium">Gender:</span>{" "}
                  {product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}
                </li>
              )}
              <li>
                <span className="font-medium">Category:</span> {product.category}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-16">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({productReviews.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="pt-6">
          <div className="prose max-w-none dark:prose-invert">
            <h3>About {product.name}</h3>
            <p>{product.description}</p>

            {product.type === "fragrance" && (
              <>
                <h4>Fragrance Notes</h4>
                <p>
                  Our premium fragrances are crafted with high-quality ingredients to provide a long-lasting scent
                  experience. Each fragrance is carefully formulated to capture the essence of luxury brands while
                  maintaining its own unique character.
                </p>
                <h4>How to Use</h4>
                <p>
                  Apply to pulse points such as wrists, neck, and behind ears. For longer-lasting fragrance, apply after
                  showering or moisturizing when skin is still slightly damp.
                </p>
              </>
            )}

            {product.type === "air-freshener" && (
              <>
                <h4>Usage Instructions</h4>
                <p>
                  Our premium air fresheners are designed to provide long-lasting freshness. Simply hang in your desired
                  location and enjoy the captivating scent for weeks. Perfect for cars, closets, or any small space.
                </p>
              </>
            )}

            {product.type === "clothing" && (
              <>
                <h4>Material & Care</h4>
                <p>
                  Our hoodies are made from premium cotton blend (80% cotton, 20% polyester) for maximum comfort and
                  durability. Machine wash cold with like colors, tumble dry low. Do not bleach.
                </p>
              </>
            )}
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="pt-6">
          <div className="space-y-8">
            <div className="bg-muted/30 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <p className="text-4xl font-bold">{averageRating.toFixed(1)}</p>
                  <StarRating rating={averageRating} size="md" />
                  <p className="text-sm text-muted-foreground mt-1">
                    {productReviews.length} {productReviews.length === 1 ? "review" : "reviews"}
                  </p>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = productReviews.filter((review) => review.rating === star).length
                    const percentage = productReviews.length > 0 ? (count / productReviews.length) * 100 : 0

                    return (
                      <div key={star} className="flex items-center text-sm mb-1">
                        <span className="w-12">{star} stars</span>
                        <div className="flex-1 mx-3 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="w-8 text-right text-muted-foreground">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <ReviewList reviews={productReviews} />
            </div>

            <div className="bg-muted/30 p-6 rounded-lg border">
              <ReviewForm productId={product.id} onReviewSubmit={addReview} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="group relative overflow-hidden rounded-lg border bg-background">
                <Link href={`/product/${relatedProduct.id}`} className="block overflow-hidden">
                  <Image
                    src={relatedProduct.imageUrl || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    width={300}
                    height={300}
                    className="h-[250px] w-full object-cover transition-transform group-hover:scale-105"
                  />
                </Link>
                <div className="p-5">
                  <Link href={`/product/${relatedProduct.id}`}>
                    <h3 className="font-semibold tracking-tight hover:underline">{relatedProduct.name}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2">{relatedProduct.category}</p>
                  <ProductRating productId={relatedProduct.id} className="mb-3" /> {/* Use ProductRating component */}
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">${relatedProduct.price.toFixed(2)}</p>
                    <Button size="sm" asChild>
                      <Link href={`/product/${relatedProduct.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
