const comparisons = [
  {
    id: "normal",
    number: "01",
    title: "Normal Diffie–Hellman",
    status: "Secrets match",
    statusClass: "success",
    summary:
      "Alice and Bob exchange public values and independently derive the same shared secret.",
    points: [
      "Public values are exchanged directly.",
      "Both participants derive matching secrets.",
      "The exchange does not authenticate who sent each public value.",
    ],
    outcome: "Key agreement works, but an active MITM attack is possible.",
    outcomeClass: "comparison-warning",
  },
  {
    id: "mitm",
    number: "02",
    title: "Man-in-the-Middle Attack",
    status: "Attack demonstrated",
    statusClass: "danger",
    summary:
      "Mallory intercepts and replaces public values, establishing separate shared secrets with Alice and Bob.",
    points: [
      "Alice establishes a secret with Mallory.",
      "Bob establishes a different secret with Mallory.",
      "Alice and Bob do not derive the same secret in this demonstration.",
    ],
    outcome:
      "Unauthenticated key exchange allows public-value substitution.",
    outcomeClass: "comparison-danger",
  },
  {
    id: "authenticated",
    number: "03",
    title: "Authenticated Key Exchange",
    status: "Substitution rejected",
    statusClass: "success",
    summary:
      "Digital signatures bind participants' identities and exchange parameters to their public values.",
    points: [
      "Alice and Bob sign their exchange messages.",
      "The signatures are verified before accepting the exchange.",
      "A modified public value fails signature verification.",
    ],
    outcome:
      "Authentication helps detect substitution when signing public keys are trusted.",
    outcomeClass: "comparison-success",
  },
];

export default function Comparison() {
  return (
    <main className="page-container">
      <section className="hero">
        <p className="eyebrow">KEYTRAP · COMPARISON LAB</p>
        <h1>Compare Key Exchange Methods</h1>
        <p>
          Explore how ordinary Diffie–Hellman works, how a
          Man-in-the-Middle attack exploits missing authentication,
          and how digital signatures help detect substitution.
        </p>
      </section>

      <section className="comparison-grid">
        {comparisons.map((item) => (
          <article className="content-card comparison-card" key={item.id}>
            <p className="eyebrow">SCENARIO {item.number}</p>
            <h2>{item.title}</h2>

            <span className={`comparison-status ${item.statusClass}`}>
              {item.statusClass === "success" ? "✓ " : "✕ "}
              {item.status}
            </span>

            <p>{item.summary}</p>

            <div className="comparison-card-content">
                <ul className="comparison-points">
                    {item.points.map((point) => (
                    <li key={point}>{point}</li>
                    ))}
                </ul>
            </div>

            <div className={`comparison-outcome ${item.outcomeClass}`}>
              <strong>Key takeaway</strong>
              <p>{item.outcome}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="content-card comparison-summary">
        <h2>What makes the difference?</h2>
        <p>
          Diffie–Hellman provides key agreement, not identity
          authentication. Without authentication, an attacker can
          substitute public values and create separate keys with
          each participant. Digital signatures can detect modified
          exchange messages, provided the signing public keys are
          independently trusted.
        </p>
        <p className="security-note">
          This project uses small educational parameters. It demonstrates
          cryptographic concepts and is not intended for production security.
        </p>
      </section>
    </main>
  );
}