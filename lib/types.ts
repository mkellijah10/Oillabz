export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  images?: string[] // Added multiple images support
  gender?: "male" | "female" | "unisex"
  type: "fragrance" | "air-freshener" | "clothing"
}

export interface Review {
  id: string
  productId: string
  name: string
  email: string
  rating: number
  comment: string
  date: string
  verified: boolean
}
