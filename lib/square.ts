// This file contains Square API integration utilities

// Square API endpoints
const SQUARE_API_URL = process.env.squareapiurl1 || "https://connect.squareup.com/v2";
const SQUARE_LOCATION_ID = process.env.sqaurelocationid1;

// Initialize Square Web Payments SDK
export const initializeSquarePayments = async () => {
  if (!window.Square) {
    console.error("Square SDK not loaded");
    return null;
  }

  try {
    const payments = window.Square.payments(
      process.env.squareapplicationid1 || "",
      SQUARE_LOCATION_ID || "",
    );
    return payments;
  } catch (error) {
    console.error("Failed to initialize Square payments:", error);
    return null;
  }
};

// Create a card payment method
export const createCardPaymentMethod = async (payments) => {
  try {
    const card = await payments.card();
    await card.attach("#card-container");
    return card;
  } catch (error) {
    console.error("Failed to create card payment method:", error);
    return null;
  }
};

// Process payment with Square
export const processSquarePayment = async (
  card,
  amount,
  currency = "USD",
  customerDetails
) => {
  try {
    // Get a payment token from the card
    const tokenResult = await card.tokenize();
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
      });

      const result = await response.json();
      return result;
    } else {
      throw new Error(tokenResult.errors[0].message);
    }
  } catch (error) {
    console.error("Payment failed:", error);
    throw error;
  }
};
