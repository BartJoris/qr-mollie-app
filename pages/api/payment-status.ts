import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { paymentId } = req.query;

  const response = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`,
    },
  });

  if (!response.ok) {
    return res.status(response.status).json({ error: "Failed to fetch payment status" });
  }

  const json = await response.json();
  const status = json.status;

  const messages: Record<string, string> = {
    open: "💤 Betaling nog niet gestart",
    pending: "⏳ Betaling in verwerking",
    authorized: "🔒 Betaling geautoriseerd, wacht op bevestiging",
    paid: "✅ Betaling ontvangen!",
    failed: "❌ Betaling mislukt",
    expired: "⌛ QR-code verlopen",
    canceled: "🚫 Betaling geannuleerd",
    refunded: "↩️ Betaling terugbetaald",
    charged_back: "⚠️ Betaling teruggevorderd",
  };

  const message = messages[status] || `⚠️ Onbekende status: ${status}`;
  res.status(200).json({ status, message });
}
