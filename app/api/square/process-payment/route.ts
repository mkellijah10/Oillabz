import { NextResponse } from "next/server"
import { Client, Environment } from "@square/square"
import { randomUUID } from "crypto"

// Initialize Square client
const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === "production" ? Environment.Production : Environment.Sandbox,
})

export async function POST(request: Request) {
  try {
    const { sourceId, amount, currency, customerDetails } = await request.json()

    if (!process.env.SQUARE_ACCESS_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          error: "Square access token not configured",
        },
        { status: 500 },
      )
    }

    const { paymentsApi } = client

    // Create payment request
    const requestBody = {
      sourceId,
      amountMoney: {
        amount: BigInt(amount), // Amount in cents
        currency: currency || "USD",
      },
      idempotencyKey: randomUUID(),
      locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
      note: `OilLabzZ Order - ${customerDetails.name}`,
      buyerEmailAddress: customerDetails.email,
    }

    console.log("Processing Square payment:", {
      amount: amount,
      currency: currency,
      customer: customerDetails.name,
    })

    // Process the payment
    const response = await paymentsApi.createPayment(requestBody)

    if (response.result.payment) {
      const payment = response.result.payment

      return NextResponse.json({
        success: true,
        payment: {
          id: payment.id,
          amount: Number(payment.amountMoney?.amount || 0) / 100,
          currency: payment.amountMoney?.currency,
          status: payment.status,
          receiptUrl: payment.receiptUrl,
          createdAt: payment.createdAt,
        },
        customer: customerDetails,
      })
    } else {
      throw new Error("Payment creation failed")
    }
  } catch (error: any) {
    console.error("Square payment processing error:", error)

    // Handle Square API errors
    if (error.errors) {
      const squareError = error.errors[0]
      return NextResponse.json(
        {
          success: false,
          error: squareError.detail || "Payment processing failed",
          code: squareError.code,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "An error occurred while processing your payment",
      },
      { status: 500 },
    )
  }
}
