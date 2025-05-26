import { notFound } from "next/navigation"
import { products } from "@/lib/products"
import ProductCard from "@/components/product-card"

interface FragrancesPageProps {
  params: {
    gender: string
  }
}

export default function FragrancesPage({ params }: FragrancesPageProps) {
  const { gender } = params

  // Validate gender parameter
  if (gender !== "male" && gender !== "female" && gender !== "all") {
    notFound()
  }

  // Filter products based on gender
  const filteredProducts = products.filter((product) => {
    if (gender === "all") {
      return product.type === "fragrance"
    }
    return product.type === "fragrance" && product.gender === gender
  })

  // Set page title based on gender
  const pageTitle = gender === "all" ? "All Fragrances" : gender === "male" ? "Men's Fragrances" : "Women's Fragrances"

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">{pageTitle}</h1>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No fragrances found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
