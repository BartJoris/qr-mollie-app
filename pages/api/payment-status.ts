import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { paymentId } = req.query;

  const response = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`,
    },
  });

  const json = await response.json();
  res.status(200).json({ status: json.status });
}
