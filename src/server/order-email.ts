import "server-only";

import nodemailer from "nodemailer";

import { env } from "@/env";
import { createOrderStatusToken } from "@/server/order-status-token";

type OrderEmailItem = {
  name: string;
  quantity: number;
  unitAmount: number;
  size?: string | null;
};

type SendOrderConfirmationEmailInput = {
  orderId: string;
  customerEmail: string;
  paymentReference: string;
  paidAmount: number;
  currency: string;
  items: OrderEmailItem[];
  receiptUrl?: string;
};

type SendOrderConfirmationEmailResult =
  | {
      sent: true;
    }
  | {
      sent: false;
      reason: string;
    };

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderBillRows(items: OrderEmailItem[], currency: string) {
  return items
    .map((item) => {
      const itemName = item.size ? `${item.name} (${item.size})` : item.name;

      return `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${escapeHtml(itemName)}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatMoney(item.unitAmount, currency)}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatMoney(
            item.unitAmount * item.quantity,
            currency,
          )}</td>
        </tr>`;
    })
    .join("");
}

function renderTextBill(items: OrderEmailItem[], currency: string) {
  return items
    .map((item) => {
      const itemName = item.size ? `${item.name} (${item.size})` : item.name;
      return `${item.quantity} x ${itemName} - ${formatMoney(
        item.unitAmount * item.quantity,
        currency,
      )}`;
    })
    .join("\n");
}

export async function sendOrderConfirmationEmail({
  orderId,
  customerEmail,
  paymentReference,
  paidAmount,
  currency,
  items,
  receiptUrl,
}: SendOrderConfirmationEmailInput): Promise<SendOrderConfirmationEmailResult> {
  const smtpHost = env.SMTP_HOST;
  const smtpPort = env.SMTP_PORT;
  const from = env.ORDER_EMAIL_FROM;
  const statusToken = createOrderStatusToken({
    orderId,
    email: customerEmail,
  });

  if (!smtpHost) {
    return { sent: false, reason: "SMTP_HOST is not configured" };
  }

  if (!smtpPort) {
    return { sent: false, reason: "SMTP_PORT is not configured" };
  }

  if (!from) {
    return { sent: false, reason: "ORDER_EMAIL_FROM is not configured" };
  }

  if (!statusToken) {
    return {
      sent: false,
      reason: "ORDER_STATUS_LINK_SECRET is not configured",
    };
  }

  const statusUrl = `${env.NEXT_PUBLIC_BASE_URL}/order-status?token=${encodeURIComponent(
    statusToken,
  )}`;
  const subject = `Mio Mideal order confirmation ${orderId.slice(0, 8)}`;
  const total = formatMoney(paidAmount, currency);
  const paymentReferenceText = paymentReference.slice(0, 12);
  const receiptLinkHtml = receiptUrl
    ? `<p><a href="${escapeHtml(receiptUrl)}">Open Stripe receipt</a></p>`
    : "";
  const receiptLinkText = receiptUrl ? `\nStripe receipt: ${receiptUrl}` : "";

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
      <h1 style="font-size: 24px; margin-bottom: 8px;">Payment verified</h1>
      <p>Thank you for your order. Stripe confirmed your payment and your order is now processing.</p>
      <p><strong>Order:</strong> ${escapeHtml(orderId.slice(0, 8))}</p>
      <p><strong>Payment reference:</strong> ${escapeHtml(paymentReferenceText)}</p>

      <h2 style="font-size: 18px; margin-top: 24px;">Payment bill</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="padding: 10px 0; border-bottom: 1px solid #d1d5db; text-align: left;">Item</th>
            <th style="padding: 10px 0; border-bottom: 1px solid #d1d5db; text-align: center;">Qty</th>
            <th style="padding: 10px 0; border-bottom: 1px solid #d1d5db; text-align: right;">Unit</th>
            <th style="padding: 10px 0; border-bottom: 1px solid #d1d5db; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>${renderBillRows(items, currency)}</tbody>
      </table>
      <p style="font-size: 18px; text-align: right;"><strong>Total paid: ${escapeHtml(total)}</strong></p>

      <p>
        <a href="${escapeHtml(statusUrl)}" style="display: inline-block; padding: 12px 18px; background: #111827; color: #ffffff; text-decoration: none; border-radius: 6px;">
          Check order status
        </a>
      </p>
      <p style="font-size: 12px; color: #6b7280;">This private status link is encrypted and expires after 30 days.</p>
      ${receiptLinkHtml}
    </div>
  `;

  const text = `Payment verified

Thank you for your order. Stripe confirmed your payment and your order is now processing.

Order: ${orderId.slice(0, 8)}
Payment reference: ${paymentReferenceText}

Payment bill
${renderTextBill(items, currency)}

Total paid: ${total}

Check order status: ${statusUrl}
This private status link is encrypted and expires after 30 days.${receiptLinkText}
`;

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: env.SMTP_SECURE ? env.SMTP_SECURE === "true" : smtpPort === 465,
    auth:
      env.SMTP_USER && env.SMTP_PASSWORD
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASSWORD,
          }
        : undefined,
  });

  await transporter.sendMail({
    from,
    to: customerEmail,
    subject,
    html,
    text,
  });

  return { sent: true };
}
