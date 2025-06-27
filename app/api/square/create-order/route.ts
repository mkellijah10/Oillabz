import { NextResponse } from "next/server"
import { Client, Environment } from "squareup"
import { randomUUID } from "crypto"

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === "production" ? Environment.Production : Environment.Sandbox,
})

export async function POST(request: Request) {
  try {
    const { cartItems, customerDetails, total } = await request.json()

    const { ordersApi } = client

    // Create line items for Square order
    const lineItems = cartItems.map((item: any) => ({
      name: item.name,
      quantity: item.quantity.toString(),
      basePriceMoney: {
        amount: BigInt(Math.round(item.price * 100)), // Convert to cents
        currency: "USD",
      },
    }))

    // Create order in Square
    const orderRequest = {
      order: {
        locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
        lineItems,
        fulfillments: [
          {
            type: "PICKUP",
            state: "PROPOSED",
            pickupDetails: {
              recipient: {
                displayName: customerDetails.name,
                emailAddress: customerDetails.email,
              },
              note: `Order from OilLabzZ website`,
            },
          },
        ],
      },
      idempotencyKey: randomUUID(),
    }

    const response = await ordersApi.createOrder(orderRequest)

    if (response.result.order) {
      return NextResponse.json({
        success: true,
        order: response.result.order,
      })
    } else {
      throw new Error("Order creation failed")
    }
  } catch (error: any) {
    console.error("Square order creation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create order in Square",
      },
      { status: 500 },
    )
  }
}
