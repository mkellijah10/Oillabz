import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/types"
import AddToCartButton from "@/components/add-to-cart-button"
import ProductRating from "@/components/product-rating"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background">
      <Link href={`/product/${product.id}`} className="block overflow-hidden">
        <Image
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          width={300}
          height={300}
          className="h-[300px] w-full object-cover transition-transform group-hover:scale-105"
        />
      </Link>
      <div className="p-5">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold tracking-tight hover:underline">{product.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
        <ProductRating productId={product.id} className="mb-3" />
        <div className="flex items-center justify-between">
          <p className="font-semibold">${product.price.toFixed(2)}</p>
          <AddToCartButton product={product} size="sm" />
        </div>
      </div>
    </div>
  )
}
