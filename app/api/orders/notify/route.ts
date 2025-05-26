import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { orderNumber, customerDetails, cartItems, total, deliveryMethod, shippingAddress } = await request.json()

    // Validate required fields
    if (!orderNumber || !customerDetails || !cartItems) {
      return NextResponse.json({ error: "Missing order information" }, { status: 400 })
    }

    // Create order items HTML
    const orderItemsHtml = cartItems
      .map(
        (item: any) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px; text-align: left;">${item.name}</td>
        <td style="padding: 10px; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `,
      )
      .join("")

    // Send notification email to business owner
    const { data: ownerEmail, error: ownerError } = await resend.emails.send({
      from: "OilLabzZ Orders <noreply@yourdomain.com>",
      to: ["harpernevado41@gmail.com"],
      subject: `🛍️ New Order Received - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #e91e63; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">New Order Received!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${orderNumber}</p>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #333; margin-top: 0;">Customer Information</h2>
            <p><strong>Name:</strong> ${customerDetails.name}</p>
            <p><strong>Email:</strong> ${customerDetails.email}</p>
            ${customerDetails.phone ? `<p><strong>Phone:</strong> ${customerDetails.phone}</p>` : ""}
          </div>

          <div style="padding: 20px;">
            <h2 style="color: #333; margin-top: 0;">Order Details</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderItemsHtml}
              </tbody>
            </table>
            
            <div style="text-align: right; font-size: 18px; font-weight: bold; color: #e91e63;">
              Order Total: $${total.toFixed(2)}
            </div>
          </div>

          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #333; margin-top: 0;">
              ${deliveryMethod === "pickup" ? "Pickup Information" : "Shipping Information"}
            </h2>
            ${
              deliveryMethod === "pickup"
                ? `
              <p><strong>Pickup Location:</strong> OilLabzZ Hartford</p>
              <p>257 South Marshall Street, Hartford, CT 06105</p>
              <p><strong>Customer Phone:</strong> ${customerDetails.phone}</p>
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-top: 15px;">
                <p style="margin: 0; color: #856404;"><strong>Action Required:</strong> Contact customer when order is ready for pickup</p>
              </div>
            `
                : `
              <p><strong>Ship to:</strong></p>
              <p>${shippingAddress.name}<br>
              ${shippingAddress.address}<br>
              ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br>
              ${shippingAddress.country === "US" ? "United States" : "Canada"}</p>
            `
            }
          </div>

          <div style="padding: 20px; text-align: center; background-color: #333; color: white;">
            <p style="margin: 0;">This order was placed on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      `,
    })

    // Send confirmation email to customer
    const { data: customerEmail, error: customerError } = await resend.emails.send({
      from: "OilLabzZ <noreply@yourdomain.com>",
      to: [customerDetails.email],
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #e91e63; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Thank You for Your Order!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${orderNumber}</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Hi ${customerDetails.name},</p>
            <p>Thank you for your order! We've received your payment and are preparing your items.</p>
            
            <h2 style="color: #333;">Order Summary</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${cartItems
                  .map(
                    (item: any) => `
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px; text-align: left;">${item.name}</td>
                    <td style="padding: 10px; text-align: center;">${item.quantity}</td>
                    <td style="padding: 10px; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
            
            <div style="text-align: right; font-size: 18px; font-weight: bold; color: #e91e63;">
              Total: $${total.toFixed(2)}
            </div>

            ${
              deliveryMethod === "pickup"
                ? `
              <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <h3 style="margin-top: 0; color: #155724;">Pickup Information</h3>
                <p style="margin-bottom: 0;"><strong>Location:</strong> OilLabzZ Hartford<br>
                257 South Marshall Street, Hartford, CT 06105<br>
                <strong>Hours:</strong> Mon-Sat 10am-7pm, Sun 12pm-5pm</p>
                <p style="margin-bottom: 0; margin-top: 10px;"><strong>We'll contact you when your order is ready for pickup!</strong></p>
              </div>
            `
                : `
              <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <h3 style="margin-top: 0; color: #0c5460;">Shipping Information</h3>
                <p style="margin-bottom: 0;">Your order will be shipped to:<br>
                ${shippingAddress.name}<br>
                ${shippingAddress.address}<br>
                ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}</p>
                <p style="margin-bottom: 0; margin-top: 10px;"><strong>We'll send you tracking information once your order ships!</strong></p>
              </div>
            `
            }
          </div>

          <div style="padding: 20px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #dee2e6;">
            <p style="margin: 0; color: #6c757d;">Questions about your order? Reply to this email or contact us at harpernevado41@gmail.com</p>
          </div>
        </div>
      `,
    })

    if (ownerError || customerError) {
      console.error("Email sending error:", ownerError || customerError)
      return NextResponse.json({ error: "Failed to send notification emails" }, { status: 500 })
    }

    return NextResponse.json(
      {
        message: "Order notifications sent successfully",
        ownerEmailId: ownerEmail?.id,
        customerEmailId: customerEmail?.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Order notification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
