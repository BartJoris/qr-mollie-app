import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId, amount } = req.body;

  const response = await fetch("https://api.mollie.com/v2/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: { currency: "EUR", value: parseFloat(amount).toFixed(2) },
      description: `POS betaling ${orderId}`,
      redirectUrl: "https://qr.babetteconcept.be/bedankt",
      metadata: { order_id: orderId },
    }),
  });

  const json = await response.json();
  const checkoutUrl = json._links?.checkout?.href;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(checkoutUrl)}`;

  res.status(200).json({ qrUrl, checkoutUrl, id: json.id });
}
