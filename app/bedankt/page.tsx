'use client';

export default function Bedankt() {
  return (
    <main style={{ textAlign: "center", padding: "2rem", fontFamily: "sans-serif" }}>
      <a href="https://babetteconcept.be">
        <img
          src="/Babette.png"
          alt="Babette Logo"
          style={{
            maxWidth: "200px",
            marginBottom: "1rem",
            transition: "transform 0.2s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        />
      </a>
      <h1>✅ De betaling is geslaagd.</h1>
      <p>Bedankt voor je aankoop!</p>
    </main>
  );
}
