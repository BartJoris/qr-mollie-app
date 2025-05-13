import { useState } from "react";

export default function Home() {
  const [amount, setAmount] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [status, setStatus] = useState("");
  const [paymentId, setPaymentId] = useState("");

  const startPayment = async () => {
    const res = await fetch("/api/mollie-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: "POS-" + Date.now(), amount }),
    });
    const data = await res.json();
    setQrUrl(data.qrUrl);
    setPaymentId(data.id);
    setStatus("Wacht op betaling...");
    pollStatus(data.id);
  };

  const pollStatus = async (id: string) => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/payment-status?paymentId=${id}`);
      const data = await res.json();
      if (data.status === "paid") {
        clearInterval(interval);
        setStatus("✅ Betaling ontvangen!");
      } else if (data.status === "expired") {
        clearInterval(interval);
        setStatus("❌ Betaling verlopen");
      }
    }, 5000);
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>Mollie QR-betaling</h1>
      <input
        type="number"
        placeholder="Bedrag in euro"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ fontSize: "1.5rem", padding: "1rem", width: "200px", marginBottom: "1rem" }}
      />
      <br />
      <button onClick={startPayment} style={{ fontSize: "1.2rem", padding: "1rem 2rem" }}>
        Genereer QR
      </button>

      {qrUrl && (
        <div style={{ marginTop: "2rem" }}>
          <img src={qrUrl} alt="Mollie QR Code" width="250" height="250" />
          <p style={{ fontSize: "1.2rem" }}>{status}</p>
        </div>
      )}
    </main>
  );
}
