import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"
import ProductCard from "@/components/product-card"
import { products } from "@/lib/products"

export default function Home() {
  // Filter featured products (first 3)
  const featuredProducts = products.slice(0, 3)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-20 md:py-28">
        <div className="container flex flex-col items-center text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Premium Fragrances by <span className="text-primary">OilLabzZ</span>
          </h1>
          <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl">
            Discover luxury scents crafted with passion by Odavens Scentation, serving New England and now the entire
            country.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button asChild size="lg">
              <Link href="/fragrances/male">Shop Men's Fragrances</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/fragrances/female">Shop Women's Fragrances</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Featured Fragrances</h2>
            <Link href="/fragrances/all" className="flex items-center text-primary hover:underline">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Shop by Category</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/fragrances/all" className="group relative overflow-hidden rounded-lg shadow-md">
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors z-10"></div>
              <Image
                src="/images/fragrances-cover.jpeg"
                alt="Fragrances"
                width={400}
                height={300}
                className="w-full h-[200px] object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <h3 className="text-white text-2xl font-bold">Fragrances</h3>
              </div>
            </Link>

            <Link href="/air-fresheners" className="group relative overflow-hidden rounded-lg shadow-md">
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors z-10"></div>
              <Image
                src="/images/air-freshener-bundle.jpeg"
                alt="Air Fresheners"
                width={400}
                height={300}
                className="w-full h-[200px] object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <h3 className="text-white text-2xl font-bold">Air Fresheners</h3>
              </div>
            </Link>

            <Link href="/clothing" className="group relative overflow-hidden rounded-lg shadow-md">
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors z-10"></div>
              <Image
                src="/images/clothing-cover.jpeg"
                alt="Clothing"
                width={400}
                height={300}
                className="w-full h-[200px] object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <h3 className="text-white text-2xl font-bold">Clothing</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">What Our Customers Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-muted/30 p-6 rounded-lg border">
              <div className="flex text-amber-500 mb-4">
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
              </div>
              <p className="text-muted-foreground mb-4">
                "The Louis Vuitton inspired fragrance is amazing! Lasts all day and I get compliments everywhere I go."
              </p>
              <p className="font-semibold">- Michael T.</p>
            </div>

            <div className="bg-muted/30 p-6 rounded-lg border">
              <div className="flex text-amber-500 mb-4">
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
              </div>
              <p className="text-muted-foreground mb-4">
                "Sugar Girl is my new favorite! The scent is perfect for everyday wear and the quality is exceptional."
              </p>
              <p className="font-semibold">- Sarah L.</p>
            </div>

            <div className="bg-muted/30 p-6 rounded-lg border">
              <div className="flex text-amber-500 mb-4">
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
              </div>
              <p className="text-muted-foreground mb-4">
                "Odavens really knows his craft. These fragrances are comparable to designer brands at a fraction of the
                price."
              </p>
              <p className="font-semibold">- James K.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/10">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Experience Premium Fragrances?</h2>
          <p className="text-muted-foreground max-w-[600px] mx-auto mb-8">
            Browse our collection of luxury scents inspired by your favorite designer fragrances.
          </p>
          <Button asChild size="lg">
            <Link href="/fragrances/all">Shop Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
