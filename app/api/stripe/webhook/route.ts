import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export async function POST(request: Request) {
  try {
    const sig = request.headers.get("stripe-signature")
    const body = await request.text()

    let event
    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object

      // Generate order number
      const randomPart = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")
      const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "")
      const orderNumber = `OL-${datePart}-${randomPart}`

      // Send order notification emails
      try {
        const orderData = {
          orderNumber,
          customerDetails: {
            name: session.metadata.customerName,
            email: session.customer_email,
          },
          total: session.amount_total / 100, // Convert from cents
          deliveryMethod: session.metadata.deliveryMethod,
          shippingAddress: session.metadata.shippingAddress ? JSON.parse(session.metadata.shippingAddress) : null,
          stripeSessionId: session.id,
        }

        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/notify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        })
      } catch (error) {
        console.error("Failed to send order notifications:", error)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
