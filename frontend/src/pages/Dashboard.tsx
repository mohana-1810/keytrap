import ParticipantCard from "../components/ParticipantCard";

const scenarios = [
  {
    title: "Key Exchange",
    description:
      "Explore how Alice and Bob establish a shared secret using Diffie–Hellman.",
    href: "#exchange",
    label: "Explore exchange →",
  },
  {
    title: "MITM Attack",
    description:
      "See how Mallory intercepts public values and establishes separate shared secrets.",
    href: "#attack",
    label: "Simulate attack →",
  },
  {
    title: "Authenticated Exchange",
    description:
      "Use digital signatures to detect unauthorized public-value substitution.",
    href: "#authentication",
    label: "Test authentication →",
  },
];

export default function Dashboard() {
  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "32px 20px",
        color: "#2C1607",
      }}
    >
      <section
        style={{
          background: "#acf2f1",
          padding: "32px",
          borderRadius: "18px",
          marginBottom: "28px",
        }}
      >
        <p
          style={{
            fontWeight: 700,
            color: "#730f11",
            letterSpacing: "2px",
            fontSize: "12px",
          }}
        >
          CRYPTOGRAPHY LAB
        </p>

        <h1 style={{ fontSize: "clamp(30px, 5vw, 48px)", margin: "8px 0" }}>
          Understand the exchange. Expose the attack.
        </h1>

        <p style={{ maxWidth: "680px", lineHeight: 1.7 }}>
          KeyTrap is an educational simulator for Diffie–Hellman key
          exchange, man-in-the-middle attacks, and signature-based
          authentication.
        </p>

        <a
          href="#exchange"
          style={{
            display: "inline-block",
            marginTop: "12px",
            padding: "12px 18px",
            borderRadius: "8px",
            background: "#730f11",
            color: "#ffffff",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Start experimenting
        </a>
      </section>

      <h2>Explore the lab</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "18px",
        }}
      >
        {scenarios.map((scenario, index) => (
          <div key={scenario.href}>
            <ParticipantCard
              name={scenario.title}
              role={`SCENARIO 0${index + 1}`}
              description={scenario.description}
              accent={index === 1 ? "#d97736" : "#acf2f1"}
            />

            <a
              href={scenario.href}
              style={{
                display: "inline-block",
                marginTop: "12px",
                color: "#730f11",
                fontWeight: 700,
              }}
            >
              {scenario.label}
            </a>
          </div>
        ))}
      </div>

      <section style={{ marginTop: "32px" }}>
        <h2>What you'll learn</h2>
        <ul style={{ lineHeight: 2 }}>
          <li>Modular exponentiation and shared-secret generation</li>
          <li>Why unauthenticated Diffie–Hellman is vulnerable to MITM</li>
          <li>How digital signatures detect tampered exchange messages</li>
          <li>Why trusted public keys matter for authentication</li>
        </ul>
      </section>
    </main>
  );
}