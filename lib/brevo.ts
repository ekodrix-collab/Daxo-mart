const BREVO_API_KEY = process.env.BREVO_API_KEY || "";

// Sender: Verified Brevo user email from screenshot
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "devdaxo369@gmail.com";
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || "DaxoMart Orders";

// Recipient: Strictly ADMIN ONLY (Your Personal Email)
const PRIMARY_ADMIN_EMAIL = "siyadsidu760@gmail.com";
const SECONDARY_ADMIN_EMAIL = "devdaxo369@gmail.com";

const SITE_URL = "https://daxomart.resellerpro.in";
const LOGO_URL = `${SITE_URL}/icon-192.png`;

export interface OrderEmailPayload {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  city?: string;
  state?: string;
  pincode?: string;
  totalAmount: number;
  paymentMethod?: string;
  items: Array<{
    productName: string;
    productImage?: string;
    selectedColor?: string;
    selectedSize?: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
}

export async function sendOrderNotificationEmail(order: OrderEmailPayload) {
  if (!BREVO_API_KEY) {
    console.warn("Brevo API key is not configured.");
    return { success: false, error: "Missing Brevo API Key" };
  }

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemsHtml = order.items
    .map(
      (item) => `
    <div style="background-color: #18181c; border: 1px solid #2d2d33; border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; gap: 16px; align-items: center;">
      ${
        item.productImage
          ? `<div style="width: 72px; height: 72px; border-radius: 10px; background-color: #0c0c0e; border: 1px solid #383842; padding: 4px; shrink: 0; text-align: center;">
              <img src="${item.productImage}" alt="${item.productName}" width="64" height="64" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 6px;" />
             </div>`
          : ""
      }
      <div style="flex: 1; min-width: 0;">
        <h4 style="margin: 0 0 6px 0; color: #ffffff; font-size: 15px; font-weight: 700; line-height: 1.3;">${item.productName}</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px;">
          ${
            item.selectedColor
              ? `<span style="font-size: 11px; font-weight: 700; color: #f59e0b; background-color: #271e0c; border: 1px solid #78350f; padding: 2px 8px; border-radius: 6px; display: inline-block;">🎨 Color: ${item.selectedColor}</span>`
              : ""
          }
          ${
            item.selectedSize
              ? `<span style="font-size: 11px; font-weight: 700; color: #38bdf8; background-color: #0c2a3a; border: 1px solid #0369a1; padding: 2px 8px; border-radius: 6px; display: inline-block;">📏 Scale/Size: ${item.selectedSize}</span>`
              : ""
          }
        </div>
        <div style="font-size: 13px; color: #a1a1aa;">
          Qty: <strong style="color: #ffffff;">${item.quantity}</strong> × ₹${item.unitPrice.toLocaleString("en-IN")}
        </div>
      </div>
      <div style="text-align: right; shrink: 0;">
        <span style="font-size: 11px; color: #71717a; text-transform: uppercase; display: block;">Subtotal</span>
        <span style="font-size: 16px; font-weight: 800; color: #c5a059;">₹${item.subtotal.toLocaleString("en-IN")}</span>
      </div>
    </div>
  `
    )
    .join("");

  const cleanPhone = order.customerPhone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`}?text=${encodeURIComponent(
    `Hello ${order.customerName}, thank you for your order ${order.orderNumber} on DaxoMart! We are preparing your shipment.`
  )}`;

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NEW ORDER RECEIVED - ${order.orderNumber}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#0c0c0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#e4e4e7; -webkit-font-smoothing: antialiased;">
    
    <div style="max-width: 620px; margin: 24px auto; background-color: #121215; border: 1px solid #27272a; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);">
      
      <!-- AMAZON-STYLE LOGO HEADER -->
      <div style="background: linear-gradient(180deg, #1c1c22 0%, #121215 100%); padding: 24px; text-align: center; border-bottom: 1px solid #27272a;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td style="vertical-align: middle; padding-right: 12px;">
              <img src="${LOGO_URL}" alt="DaxoMart Logo" width="48" height="48" style="display: block; border-radius: 12px; border: 1px solid #c5a059;" />
            </td>
            <td style="vertical-align: middle; text-align: left;">
              <h2 style="margin: 0; color: #c5a059; font-size: 22px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">DAXOMART</h2>
              <span style="font-size: 11px; color: #a1a1aa; tracking: 1px; text-transform: uppercase;">PREMIUM DIECAST & RC STORE</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- NEW ORDER ALERT BANNER -->
      <div style="background: linear-gradient(90deg, #15803d 0%, #166534 100%); padding: 12px 24px; text-align: center; border-bottom: 1px solid #22c55e;">
        <span style="color: #ffffff; font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">
          🚨 NEW ORDER RECEIVED • INSTANT ALERT
        </span>
      </div>

      <!-- ORDER DETAILS BAR -->
      <div style="background-color: #18181c; padding: 18px 24px; border-bottom: 1px solid #27272a;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <span style="font-size: 11px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.5px;">ORDER NUMBER</span>
              <h3 style="margin: 3px 0 0 0; color: #ffffff; font-size: 18px; font-weight: 800;">${order.orderNumber}</h3>
              <span style="font-size: 11px; color: #71717a;">${currentDate}</span>
            </td>
            <td style="text-align: right;">
              <span style="font-size: 11px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.5px;">TOTAL AMOUNT</span>
              <h3 style="margin: 3px 0 0 0; color: #c5a059; font-size: 22px; font-weight: 900;">₹${order.totalAmount.toLocaleString("en-IN")}</h3>
              <span style="font-size: 11px; color: #eab308; font-weight: 700;">PAYMENT: ${order.paymentMethod || "COD / WhatsApp"}</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- MAIN CONTENT CONTAINER -->
      <div style="padding: 24px;">

        <!-- CUSTOMER & SHIPPING ADDRESS CARD -->
        <div style="background-color: #18181c; border: 1px solid #27272a; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
          <h4 style="margin: 0 0 14px 0; color: #c5a059; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
            📦 Shipping & Customer Details
          </h4>
          
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 13.5px; line-height: 1.6;">
            <tr>
              <td style="padding-bottom: 8px; color: #a1a1aa; width: 32%;">Customer Name:</td>
              <td style="padding-bottom: 8px; color: #ffffff; font-weight: 700;">${order.customerName}</td>
            </tr>
            <tr>
              <td style="padding-bottom: 8px; color: #a1a1aa;">Phone Number:</td>
              <td style="padding-bottom: 8px; color: #22c55e; font-weight: 800;">
                ${order.customerPhone}
              </td>
            </tr>
            ${
              order.customerEmail
                ? `
            <tr>
              <td style="padding-bottom: 8px; color: #a1a1aa;">Customer Email:</td>
              <td style="padding-bottom: 8px; color: #ffffff;">${order.customerEmail}</td>
            </tr>
            `
                : ""
            }
            <tr>
              <td style="vertical-align: top; color: #a1a1aa;">Delivery Address:</td>
              <td style="color: #ffffff; font-weight: 600; line-height: 1.5;">${order.shippingAddress}</td>
            </tr>
          </table>

          <!-- QUICK WHATSAPP BUTTON FOR ADMIN -->
          <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid #27272a; text-align: center;">
            <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background-color: #25d366; color: #ffffff; font-size: 13px; font-weight: 800; text-decoration: none; padding: 10px 20px; border-radius: 10px; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4);">
              💬 Reply to Customer on WhatsApp
            </a>
          </div>
        </div>

        <!-- ORDERED ITEMS BREAKDOWN -->
        <h4 style="margin: 0 0 14px 0; color: #c5a059; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
          🛒 Order Items Breakdown (${order.items.length})
        </h4>

        ${itemsHtml}

        <!-- SUMMARY TOTAL TABLE -->
        <div style="background-color: #18181c; border: 1px solid #27272a; border-radius: 12px; padding: 16px; margin-top: 16px;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 13px;">
            <tr>
              <td style="padding-bottom: 6px; color: #a1a1aa;">Shipping Fee:</td>
              <td style="padding-bottom: 6px; text-align: right; color: #22c55e; font-weight: 800;">FREE SHIPPING (₹0.00)</td>
            </tr>
            <tr>
              <td style="padding-top: 8px; border-top: 1px solid #27272a; color: #ffffff; font-size: 15px; font-weight: 800;">Total Payable:</td>
              <td style="padding-top: 8px; border-top: 1px solid #27272a; text-align: right; color: #c5a059; font-size: 18px; font-weight: 900;">₹${order.totalAmount.toLocaleString("en-IN")}</td>
            </tr>
          </table>
        </div>

      </div>

      <!-- FOOTER -->
      <div style="background-color: #0c0c0e; padding: 18px; text-align: center; border-top: 1px solid #27272a; font-size: 11px; color: #71717a;">
        <p style="margin: 0 0 4px 0;">DaxoMart Automation System • Admin Notification for ${PRIMARY_ADMIN_EMAIL}</p>
        <p style="margin: 0; color: #52525b;">This email was sent automatically when a customer submitted an order on DaxoMart.</p>
      </div>

    </div>

  </body>
  </html>
  `;

  try {
    // STRICTLY ADMIN ONLY - NEVER SENT TO CUSTOMER
    const recipients = [
      {
        email: PRIMARY_ADMIN_EMAIL,
        name: "Siyad (Admin)",
      },
      {
        email: SECONDARY_ADMIN_EMAIL,
        name: "DaxoMart Owner",
      },
    ];

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: BREVO_SENDER_NAME,
          email: BREVO_SENDER_EMAIL,
        },
        to: recipients,
        subject: `🚨 NEW ORDER RECEIVED #${order.orderNumber} - ₹${order.totalAmount.toLocaleString("en-IN")} (${order.customerName})`,
        htmlContent: htmlContent,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Brevo Admin Notification Email Sent Successfully to:", PRIMARY_ADMIN_EMAIL, data.messageId || data);
      return { success: true, messageId: data.messageId };
    } else {
      console.error("Brevo API Error Response:", data);
      return { success: false, error: data };
    }
  } catch (err: any) {
    console.error("Brevo Fetch Network Error:", err);
    return { success: false, error: err.message };
  }
}
