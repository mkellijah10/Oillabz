"use client"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const categories = [
  {
    title: "Fragrances",
    href: "/fragrances/all",
    description: "Discover our premium collection of luxury inspired fragrances.",
    image: "/images/fragrances-cover.jpeg",
    subcategories: [
      {
        title: "Men's Fragrances",
        href: "/fragrances/male",
      },
      {
        title: "Women's Fragrances",
        href: "/fragrances/female",
      },
    ],
  },
  {
    title: "Air Fresheners",
    href: "/air-fresheners",
    description: "Premium air fresheners for your home, car, and office.",
    image: "/images/air-freshener-bundle.jpeg",
    subcategories: [],
  },
  {
    title: "Clothing",
    href: "/clothing",
    description: "Stylish and comfortable clothing featuring our exclusive designs.",
    image: "/images/clothing-cover.jpeg",
    subcategories: [],
  },
]

export function CategoryDropdown() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {categories.map((category) => (
          <NavigationMenuItem key={category.title}>
            <NavigationMenuTrigger>{category.title}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <div className="relative h-full w-full min-h-[150px]">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Link href={category.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      )}
                    >
                      <div className="text-sm font-medium leading-none">{category.title}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{category.description}</p>
                    </NavigationMenuLink>
                  </Link>
                  {category.subcategories?.map((subcategory) => (
                    <Link key={subcategory.href} href={subcategory.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          "block select-none rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        )}
                      >
                        {subcategory.title}
                      </NavigationMenuLink>
                    </Link>
                  ))}
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
