export default function AboutPage() {
  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">About OilLabzZ</h1>

      <div className="space-y-8">
        <div className="bg-muted/30 p-8 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-muted-foreground mb-4">
            OilLabzZ was founded by Odavens Scentation, a passionate perfume entrepreneur with a vision to create
            premium fragrances inspired by luxury brands but at accessible prices.
          </p>
          <p className="text-muted-foreground mb-4">
            What began as a small operation serving the New England area has now expanded to serve customers across the
            entire country, thanks to the exceptional quality and craftsmanship of our products.
          </p>
          <p className="text-muted-foreground">
            Each fragrance is carefully crafted to capture the essence of designer scents while maintaining its own
            unique character. We take pride in our attention to detail and commitment to quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-muted/30 p-8 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              At OilLabzZ, our mission is to make luxury fragrances accessible to everyone. We believe that everyone
              deserves to experience premium scents without the premium price tag. We are committed to creating
              high-quality products that rival designer brands while maintaining affordability and exceptional customer
              service.
            </p>
          </div>

          <div className="bg-muted/30 p-8 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Quality: We use only the finest ingredients in our fragrances</li>
              <li>• Affordability: Luxury scents at accessible prices</li>
              <li>• Integrity: Honest business practices and transparency</li>
              <li>• Customer Satisfaction: Your happiness is our priority</li>
              <li>• Innovation: Constantly evolving and improving our products</li>
            </ul>
          </div>
        </div>

        <div className="bg-muted/30 p-8 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Meet the Founder</h2>
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Odavens Scentation</h3>
              <p className="text-muted-foreground mb-4">
                Odavens Scentation is a committed perfume entrepreneur with a passion for creating exceptional
                fragrances. With years of experience in the fragrance industry, Odavens has developed a keen sense for
                recreating luxury scents while adding unique touches that make OilLabzZ products stand out.
              </p>
              <p className="text-muted-foreground">
                Starting from humble beginnings in New England, Odavens has built OilLabzZ into a respected brand known
                for quality and affordability. The commitment to excellence and customer satisfaction remains at the
                heart of everything we do.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
