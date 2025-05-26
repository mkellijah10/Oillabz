// This file contains Square API integration utilities

// Square API endpoints
const SQUARE_API_URL = process.env.NEXT_PUBLIC_SQUARE_API_URL || "https://connect.squareup.com/v2"
const SQUARE_LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID

// Initialize Square Web Payments SDK
export const initializeSquarePayments = async () => {
  if (!window.Square) {
    console.error("Square SDK not loaded")
    return null
  }

  try {
    const payments = window.Square.payments(
      process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || "",
      SQUARE_LOCATION_ID || "",
    )
    return payments
  } catch (error) {
    console.error("Failed to initialize Square payments:", error)
    return null
  }
}

// Create a card payment method
export const createCardPaymentMethod = async (payments: any) => {
  try {
    const card = await payments.card()
    await card.attach("#card-container")
    return card
  } catch (error) {
    console.error("Failed to create card payment method:", error)
    return null
  }
}

// Process payment with Square
export const processSquarePayment = async (
  card: any,
  amount: number,
  currency = "USD",
  customerDetails: {
    email: string
    name: string
  },
) => {
  try {
    // Get a payment token from the card
    const tokenResult = await card.tokenize()
    if (tokenResult.status === "OK") {
      // Send the token to your server to create a payment
      const response = await fetch("/api/square/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceId: tokenResult.token,
          amount,
          currency,
          customerDetails,
        }),
      })

      const result = await response.json()
      return result
    } else {
      throw new Error(tokenResult.errors[0].message)
    }
  } catch (error) {
    console.error("Payment failed:", error)
    throw error
  }
}
