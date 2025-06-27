import { NextResponse } from "next/server"
import { randomUUID } from "crypto"

export async function POST(request: Request) {
  const { Client, Environment } = await import("square") // ← dynamic import
  const client = new Client({
    accessToken: process.env.squareaccesstoken1!,
    environment: process.env.squareenviorment1 === "production" ? Environment.Production : Environment.Sandbox,
  })

  try {
    const { sourceId, amount, currency, customerDetails } = await request.json()

    const { paymentsApi } = client
    const res = await paymentsApi.createPayment({
      sourceId,
      idempotencyKey: randomUUID(),
      locationId: process.env.sqaurelocationid1,
      amountMoney: { amount: BigInt(amount), currency: currency || "USD" },
      note: `OilLabzZ - ${customerDetails.name}`,
      buyerEmailAddress: customerDetails.email,
    })

    return NextResponse.json({ success: true, payment: res.result.payment })
  } catch (error: any) {
    console.error("Square payment error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
