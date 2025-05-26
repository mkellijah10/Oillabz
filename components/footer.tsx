import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">OilLabzZ</h3>
            <p className="text-sm text-muted-foreground">
              Premium fragrances crafted by Odavens Scentation, serving New England and beyond.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/fragrances/male" className="text-muted-foreground hover:text-foreground">
                  Male Fragrances
                </Link>
              </li>
              <li>
                <Link href="/fragrances/female" className="text-muted-foreground hover:text-foreground">
                  Female Fragrances
                </Link>
              </li>
              <li>
                <Link href="/air-fresheners" className="text-muted-foreground hover:text-foreground">
                  Air Fresheners
                </Link>
              </li>
              <li>
                <Link href="/clothing" className="text-muted-foreground hover:text-foreground">
                  Clothing
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <Link
                href="https://www.instagram.com/oillabzz?igsh=MWo4a3oxZHoxc2M2Zg=="
                className="text-muted-foreground hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://facebook.com" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Email:{" "}
              <a href="mailto:harpernevado41@gmail.com" className="hover:underline">
                harpernevado41@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} OilLabzZ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
