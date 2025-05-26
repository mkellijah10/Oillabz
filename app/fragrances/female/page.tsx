import { products } from "@/lib/products"
import ProductCard from "@/components/product-card"
import Image from "next/image"

export default function FemaleFrgrancesPage() {
  // Filter female fragrance products
  const femaleFrgrances = products.filter((product) => product.type === "fragrance" && product.gender === "female")

  return (
    <div className="container py-12">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Women's Fragrances</h1>
        <p className="text-muted-foreground text-center max-w-2xl mb-8">
          Discover our premium collection of women's fragrances inspired by luxury brands. Each fragrance is carefully
          crafted to provide a long-lasting and captivating scent.
        </p>
        <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
          <Image src="/images/fragrances-cover.jpeg" alt="Women's Fragrances" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h2 className="text-white text-3xl font-bold">Premium Women's Fragrances</h2>
          </div>
        </div>
      </div>

      {femaleFrgrances.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No fragrances found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {femaleFrgrances.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
