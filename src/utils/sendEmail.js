import { createTransport } from "nodemailer";

//* HTML content
export const activateEmailHTMLContent = (activationLink) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Email Activation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background: #fff;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .header{
    text-align:center;
    }
    .header img {
      width: 60%;
      border-radius: 10px 10px 0 0;
    }
    h2 {
      color: #313033;
    }
    p {
      font-size: 16px;
      color: #313033;
    }
    .btn {
      display: inline-block;
      margin-top: 20px;
      padding: 7px 30px;
      background-color: #0B5D5D;
      color: #fff !important;
      text-decoration: none !important;
      border-radius: 5px;
      margin-bottom:10px;
    }
    .footer {
      margin-top: 30px;
      font-size: 13px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://i.postimg.cc/kg8Lttyn/logo3.png" alt="Activate Your Email">
    </div>
    <h2>Welcome to SWIRLO!</h2>
    <p>Thanks for signing up. Please confirm your email address to activate your email.</p>
    <a href="${activationLink}" target="_blank" class="btn">Activate Email</a>
    <p class="footer">If you didn’t sign up, please ignore this email.</p>
  </div>
</body>
</html>`;

//* send email function
export const orderDetailsHTMLContent = (order) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        background-color: #ffffff;
        margin: 20px auto;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #e0e0e0;
      }
      h1 {
        color: #333333;
        margin-bottom: 10px;
      }
      .order-summary {
        padding: 20px 0;
      }
      .order-summary h2 {
        color: #555555;
        margin-bottom: 10px;
      }
      .order-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #e0e0e0;
      }
      .order-item:last-child {
        border-bottom: none;
      }
      .item-info {
        display: flex;
        align-items: center;
        gap: 15px;
      }
      .item-image {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 4px;
      }
      .total {
        font-weight: bold;
        font-size: 16px;
        padding-top: 10px;
        text-align: right;
        margin-top: 15px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #888888;
        margin-top: 20px;
        border-top: 1px solid #e0e0e0;
      }
      .logo {
        margin-bottom: 15px;
        width:100%
      }
      .shipping{
        margin-bottom:10px
      }
    </style>
  </head>
  <body>
    <div class="container">
    <div class="header">
    <img src="https://i.postimg.cc/kg8Lttyn/logo3.png" alt="Company Logo" class="logo">
        <h1>Order Confirmation</h1>
        <p>Thank you for your purchase!</p>
        </div>

      <div class="order-summary">
        <h2>Order Summary</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Order Date:</strong> ${new Date(
          order.createdAt
        )?.toLocaleDateString()}</p>

        <div>
          ${order.cartItems
            .map(
              (item) => `
            <div class="order-item">
              <div class="item-info">
                <img src="${item.productId.thumbnail}" alt="${item.productId.title}" class="item-image" />
                <span>${item.productId.title}</span>
              </div>
              <div>
                ${item.quantity} × ${item.productId?.price} EGP
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="total">
        <p class="shipping">Shipping Price: 50 EGP</p>
          <strong>Total Amount:</strong> ${order.totalPrice} EGP
        </div>
      </div>

      <div class="footer">
        <p>If you have any questions, please contact us at support@swirlo.com</p>
        <p>&copy; ${new Date().getFullYear()} SWIRLO. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;
};

//* create nodemailer transporter
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_NODE_MAILER_EMAIL,
    pass: process.env.USER_APP_NODE_MAILER_PASS,
  },
});

const sendEmail = async (to, subject, HTMLContent, data) => {
  try {
    await transporter.sendMail({
      from: `"SWIRLO" <${process.env.USER_NODE_MAILER_EMAIL}>`,
      to: to || process.env.USER_NODE_MAILER_EMAIL,
      subject: subject,
      html: typeof HTMLContent === "function" ? HTMLContent(data) : HTMLContent,
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw the error for handling at a higher level
  }
};

export default sendEmail;
