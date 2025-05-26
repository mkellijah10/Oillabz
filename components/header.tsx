"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "./mode-toggle"
import CartIcon from "./cart-icon"
import { CategoryDropdown } from "./category-dropdown"

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/about",
      label: "About Us",
      active: pathname === "/about",
    },
    {
      href: "/contact",
      label: "Contact Us",
      active: pathname === "/contact",
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-primary">OilLabzZ</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                route.active ? "text-foreground font-semibold" : "text-foreground/60",
              )}
            >
              {route.label}
            </Link>
          ))}
          <div className="hidden md:block">
            <CategoryDropdown />
          </div>
        </nav>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          <CartIcon />

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-foreground/60 transition-colors hover:text-foreground",
                      route.active ? "text-foreground font-semibold" : "",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {route.label}
                  </Link>
                ))}
                <Link href="/fragrances/male" className="text-foreground/60 hover:text-foreground">
                  Men's Fragrances
                </Link>
                <Link href="/fragrances/female" className="text-foreground/60 hover:text-foreground">
                  Women's Fragrances
                </Link>
                <Link href="/air-fresheners" className="text-foreground/60 hover:text-foreground">
                  Air Fresheners
                </Link>
                <Link href="/clothing" className="text-foreground/60 hover:text-foreground">
                  Clothing
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
