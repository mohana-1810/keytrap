
export default function About() {
  return (
    <main className="page-container">
      <section className="hero">
        <p className="eyebrow">ABOUT THE PROJECT</p>
        <h1>Understanding key exchange security</h1>
        <p>
          KeyTrap is an educational cryptography simulator that
          demonstrates Diffie–Hellman key exchange, man-in-the-middle
          attacks, and digital-signature-based authentication.
        </p>
      </section>

      <section className="content-card">
        <h2>Project objectives</h2>
        <ul className="learning-list">
          <li>Understand modular arithmetic in key exchange.</li>
          <li>Observe how unauthenticated Diffie–Hellman can be attacked.</li>
          <li>Explore how digital signatures detect message tampering.</li>
          <li>Compare secure and insecure exchange scenarios.</li>
        </ul>
      </section>

      <section className="content-card">
        <h2>Cryptographic concepts</h2>

        <h3>Diffie–Hellman key exchange</h3>
        <p>
          Allows two participants to calculate a common secret using
          exchanged public values and their own private values.
        </p>

        <h3>Man-in-the-Middle attack</h3>
        <p>
          An attacker intercepts and substitutes public values, potentially
          establishing separate secrets with both participants.
        </p>

        <h3>Digital signatures</h3>
        <p>
          Signatures help verify the authenticity and integrity of signed
          messages when the signer's public key is trusted.
        </p>
      </section>

      <section className="content-card">
        <h2>Technology stack</h2>
        <div className="tag-list">
          <span>React</span>
          <span>TypeScript</span>
          <span>Vite</span>
          <span>Python</span>
          <span>FastAPI</span>
          <span>Ed25519</span>
        </div>
      </section>

      <p className="security-note">
        KeyTrap uses small mathematical parameters for educational
        demonstrations. It is not a production-ready secure communication
        system.
      </p>
    </main>
  );
}