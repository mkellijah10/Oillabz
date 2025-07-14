import { NextResponse } from "next/server"
import Stripe from "stripe"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "https://oillabzz.vercel.app"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export async function POST(request: Request) {
  try {
    const { amount, cartItems, customerEmail, customerName, deliveryMethod, shippingAddress } = await request.json()

    // Build Stripe line-items with absolute image URLs
    const lineItems = cartItems.map((item: any) => {
      const absoluteImage =
        item.imageUrl && item.imageUrl.startsWith("http")
          ? item.imageUrl
          : item.imageUrl
            ? `${BASE_URL}${item.imageUrl}`
            : undefined

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            ...(absoluteImage ? { images: [absoluteImage] } : {}),
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }
    })

    // Calculate subtotal from cart items only
    const subtotal = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    // Add shipping if applicable (based on subtotal, not total amount)
    if (deliveryMethod === "shipping" && subtotal < 50) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
          },
          unit_amount: 599, // $5.99 in cents
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout`,
      metadata: {
        customerName,
        deliveryMethod,
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : "",
      },
      shipping_address_collection:
        deliveryMethod === "shipping"
          ? {
              allowed_countries: ["US", "CA"],
            }
          : undefined,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: error.message || "Failed to create checkout session" }, { status: 500 })
  }
}
