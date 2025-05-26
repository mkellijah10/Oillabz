"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductImageGalleryProps {
  images: string[]
  alt: string
}

export default function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // If no images provided, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="relative rounded-lg overflow-hidden">
        <div className="relative z-10 p-8 flex items-center justify-center min-h-[400px]">
          <Image
            src="/placeholder.svg?height=400&width=400"
            alt="Product image"
            width={400}
            height={400}
            className="max-h-[400px] w-auto object-contain"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative rounded-lg overflow-hidden bg-muted/30">
        <div className="absolute inset-0 z-0">
          <Image src="/images/fragrances-cover.jpeg" alt="Background" fill className="object-cover opacity-20" />
        </div>
        <div className="relative z-10 p-8 flex items-center justify-center min-h-[400px]">
          <Image
            src={images[selectedImageIndex] || "/placeholder.svg"}
            alt={`${alt} - Image ${selectedImageIndex + 1}`}
            width={400}
            height={400}
            className="max-h-[400px] w-auto object-contain transition-opacity duration-300"
          />
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={cn(
                "relative rounded-md overflow-hidden border-2 h-20 transition-all",
                selectedImageIndex === index
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-primary/50",
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${alt} - Thumbnail ${index + 1}`}
                fill
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
