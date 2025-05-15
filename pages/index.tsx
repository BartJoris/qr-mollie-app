'use client';
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [amount, setAmount] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [status, setStatus] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [statusClass, setStatusClass] = useState("neutral");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [lastPlayedId, setLastPlayedId] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialAmount = urlParams.get("amount");
    if (initialAmount) {
      setAmount(initialAmount);
      startPayment(initialAmount);
    }
  }, []);

  const startPayment = async (inputAmount?: string) => {
    const value = inputAmount || amount;
    const res = await fetch("/api/mollie-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: "POS-" + Date.now(), amount: value }),
    });
    const data = await res.json();
    setQrUrl(data.qrUrl);
    setPaymentId(data.id);
    setStatus("🔄 QR gegenereerd...");
    setStatusClass("neutral");
    pollStatus(data.id);
  };

  const pollStatus = async (id: string) => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/payment-status?paymentId=${id}`);
      const data = await res.json();

      if (data.message) {
        setStatus(data.message);
      }

      const classMap: Record<string, string> = {
        open: "neutral",
        pending: "pending",
        authorized: "authorized",
        paid: "paid",
        failed: "failed",
        expired: "failed",
        canceled: "failed",
        refunded: "refunded",
        charged_back: "refunded",
      };

      setStatusClass(classMap[data.status] || "neutral");

      if (data.status === "paid" && lastPlayedId !== id) {
        setLastPlayedId(id);
        audioRef.current?.play();
        if (navigator.vibrate) navigator.vibrate(300);
      }

      if (["paid", "expired", "failed", "canceled", "refunded", "charged_back"].includes(data.status)) {
        clearInterval(interval);
      }
    }, 5000);
  };

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        maxWidth: "400px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <img src="/Babette.png" alt="Babette Logo" style={{ maxWidth: "190px", margin: "2rem auto 1rem" }} />

      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Bedrag</h2>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>€</span>
        <input
          type="tel"
          inputMode="decimal"
          pattern="[0-9]*"
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            fontSize: "1.5rem",
            padding: "0.5rem 1rem",
            width: "100px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={() => startPayment()}
          style={{
            fontSize: "1rem",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#eee",
            border: "1px solid #ccc",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Genereer QR
        </button>
      </div>

      {qrUrl && (
        <>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <img
              src={qrUrl}
              alt="Mollie QR Code"
              style={{
                marginTop: "0.5rem",
                marginBottom: "1rem",
              }}
            />
          </div>
          <p style={{ fontSize: "1.1rem", marginTop: "0.5rem", color: "#333" }}>{status}</p>
        </>
      )}

      <audio ref={audioRef} src="/success.mp3" preload="auto" />
    </main>
  );
}
