import { NextResponse } from "next/server"
import { randomUUID } from "crypto"

export async function POST(request: Request) {
  const { Client, Environment } = await import("square") // ← dynamic import
  const client = new Client({
    accessToken: process.env.squareaccesstoken1!,
    environment: Environment.Production,
  })

  try {
    const { cartItems, customerDetails } = await request.json()
    const { ordersApi } = client

    const order = await ordersApi.createOrder({
      idempotencyKey: randomUUID(),
      order: {
        locationId: process.env.sqaurelocationid1,
        lineItems: cartItems.map((i: any) => ({
          name: i.name,
          quantity: `${i.quantity}`,
          basePriceMoney: { amount: BigInt(Math.round(i.price * 100)), currency: "USD" },
        })),
        fulfillments: [
          {
            type: "PICKUP",
            state: "PROPOSED",
            pickupDetails: {
              recipient: {
                displayName: customerDetails.name,
                emailAddress: customerDetails.email,
              },
            },
          },
        ],
      },
    })

    return NextResponse.json({ success: true, order: order.result.order })
  } catch (error: any) {
    console.error("Square order error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
