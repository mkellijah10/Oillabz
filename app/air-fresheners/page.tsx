import { products } from "@/lib/products"
import ProductCard from "@/components/product-card"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AirFreshenersPage() {
  // Filter air freshener products
  const airFresheners = products.filter((product) => product.type === "air-freshener")

  // Separate car air fresheners from regular air fresheners
  const carAirFresheners = airFresheners.filter((product) => product.category === "Car Air Freshener")
  const regularAirFresheners = airFresheners.filter((product) => product.category !== "Car Air Freshener")

  return (
    <div className="container py-12">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Air Fresheners</h1>
        <p className="text-muted-foreground text-center max-w-2xl mb-8">
          Premium air fresheners for your home, car, and office. Made with high-quality ingredients for long-lasting
          freshness.
        </p>
        <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
          <Image src="/images/air-freshener-bundle.jpeg" alt="Air Fresheners" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h2 className="text-white text-3xl font-bold">Premium Air Fresheners</h2>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 p-6 rounded-lg border mb-12">
        <h2 className="text-xl font-semibold mb-4">About Our Air Fresheners</h2>
        <p className="mb-4">
          Our premium air fresheners are designed to provide long-lasting fragrance for your home, office, or any space
          that needs a refreshing scent. Each air freshener is crafted with high-quality ingredients that last longer
          than standard fresheners.
        </p>
        <p className="mb-4">
          <strong>Did you know?</strong> All of our fragrance scents are also available as car air fresheners! Contact
          us to order any of our premium fragrances as a hanging car air freshener.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/contact">Contact Us for Custom Orders</Link>
          </Button>
        </div>
      </div>

      {/* Regular Air Fresheners Section */}
      <h2 className="text-2xl font-bold mb-6">Home & Office Air Fresheners</h2>
      {regularAirFresheners.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No air fresheners found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {regularAirFresheners.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Car Air Fresheners Section */}
      {carAirFresheners.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6">Car Air Fresheners</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {carAirFresheners.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
