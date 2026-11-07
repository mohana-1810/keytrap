import { useState, type FormEvent } from "react";
import { runAuthenticatedExchange } from "../services/authenticationService";
import type { AuthenticatedExchangeResult } from "../types/exchange";
import ParticipantCard from "../components/ParticipantCard";
import StatusBadge from "../components/StatusBadge";
import ExchangeTimeline, {
  type TimelineEvent,
} from "../components/ExchangeTimeline";

const initialValues = {
  p: "23",
  g: "5",
  alice_private: "6",
  bob_private: "15",
};

type FormValues = typeof initialValues;

export default function AuthenticatedExchange() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [result, setResult] =
    useState<AuthenticatedExchangeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateValue(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleExchange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);

    const parsed = {
      p: Number(values.p),
      g: Number(values.g),
      alice_private: Number(values.alice_private),
      bob_private: Number(values.bob_private),
    };

    if (Object.values(parsed).some((v) => !Number.isSafeInteger(v))) {
      setError("Enter valid whole numbers in every field.");
      return;
    }

    const { p, g, alice_private, bob_private } = parsed;

    if (p <= 3 || p > 10000 || g < 2 || g >= p) {
      setError("Use p between 5 and 10000, and g between 2 and p - 1.");
      return;
    }

    if ([alice_private, bob_private].some((v) => v < 2 || v > p - 2)) {
      setError("Each private value must be between 2 and p - 2.");
      return;
    }

    setLoading(true);
    try {
      const data = await runAuthenticatedExchange(parsed);
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Authenticated exchange failed."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setValues(initialValues);
    setResult(null);
    setError("");
  }

  const events: TimelineEvent[] = result
    ? [
        {
          title: "Exchange values generated",
          description: `Alice's public value is ${result.alice_public}; Bob's is ${result.bob_public}.`,
          status: "neutral",
        },
        {
          title: "Participants sign their messages",
          description: "Alice and Bob sign their exchange messages using Ed25519 signing keys.",
          status: "success",
        },
        {
          title: "Signatures are verified",
          description:
            `Alice: ${result.alice_signature_valid ? "valid" : "invalid"}; ` +
            `Bob: ${result.bob_signature_valid ? "valid" : "invalid"}.`,
          status:
            result.alice_signature_valid && result.bob_signature_valid
              ? "success"
              : "danger",
        },
        {
          title: "Mallory attempts substitution",
          description: result.substitution_rejected
            ? "The modified value fails signature verification."
            : "The attempted substitution was not rejected.",
          status: result.substitution_rejected ? "success" : "danger",
        },
      ]
    : [];

  return (
    <main className="page-container">
      <section className="hero">
        <p className="eyebrow">KEYTRAP · AUTHENTICATION LAB</p>
        <h1>Authenticated Key Exchange</h1>
        <p>
          Explore how digital signatures help detect substituted public values
          when the participants' signing public keys are trusted.
        </p>
      </section>

      <form className="content-card" onSubmit={handleExchange}>
        <h2>Exchange parameters</h2>
        <div className="input-grid">
          <NumberField label="Prime modulus (p)" value={values.p}
            onChange={(v) => updateValue("p", v)} />
          <NumberField label="Generator candidate (g)" value={values.g}
            onChange={(v) => updateValue("g", v)} />
        </div>

        <h3>Participants' private values</h3>
        <div className="input-grid">
          <NumberField label="Alice's private value (a)"
            value={values.alice_private}
            onChange={(v) => updateValue("alice_private", v)} />
          <NumberField label="Bob's private value (b)"
            value={values.bob_private}
            onChange={(v) => updateValue("bob_private", v)} />
        </div>

        <p className="security-note">
          Signing keys are generated internally for this demonstration.
          A real protocol must authenticate the signing public keys to prevent
          an attacker from substituting identities.
        </p>

        {error && <p role="alert" className="error-message">{error}</p>}

        <div className="button-row">
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Run authenticated exchange"}
          </button>
          <button className="secondary-button" type="button" onClick={resetForm}>
            Reset values
          </button>
        </div>
      </form>

      {result && (
        <section className="results-section" aria-live="polite">
          <h2>Authentication results</h2>

          <div className="participant-grid">
            <ParticipantCard name="Alice" role="Authenticated participant"
              publicValue={result.alice_public}
              description="Signs her exchange message with her private signing key." />
            <ParticipantCard name="Bob" role="Authenticated participant"
              publicValue={result.bob_public}
              description="Signs his exchange message with his private signing key." />
            <ParticipantCard name="Mallory" role="Attacker"
              publicValue={result.mallory_substituted_value}
              description="Attempts to substitute a public value."
              accent="#d97736" />
          </div>

          <section className="content-card">
            <h3>Security verification</h3>
            <p>
              Alice's signature:{" "}
              <StatusBadge
                label={result.alice_signature_valid ? "Valid" : "Invalid"}
                status={result.alice_signature_valid ? "success" : "danger"} />
            </p>
            <p>
              Bob's signature:{" "}
              <StatusBadge
                label={result.bob_signature_valid ? "Valid" : "Invalid"}
                status={result.bob_signature_valid ? "success" : "danger"} />
            </p>
            <p>
              Shared secrets match:{" "}
              <StatusBadge
                label={String(result.shared_secrets_match)}
                status={result.shared_secrets_match ? "success" : "danger"} />
            </p>
            <p>
              Substitution rejected:{" "}
              <StatusBadge
                label={String(result.substitution_rejected)}
                status={result.substitution_rejected ? "success" : "danger"} />
            </p>

            <h3>{result.attack_blocked
              ? "Attack successfully detected"
              : "Security checks incomplete"}</h3>
          </section>

          <ExchangeTimeline events={events} />

          
          <section className="content-card formula-breakdown">
            <h3>Authenticated Exchange — Formula Breakdown</h3>
            <p>
              This exchange combines Diffie–Hellman key agreement with
              digital signatures to help detect substituted public values.
            </p>

            <div className="formula-step">
              <h4>Step 1: Calculate the public values</h4>
              <p className="formula-equation">
                A = g<sup>a</sup> mod p
              </p>
              <p>
                A = {result.g}<sup>{values.alice_private}</sup> mod {result.p}
                {" = "}
                <strong>{result.alice_public}</strong>
              </p>

              <p className="formula-equation">
                B = g<sup>b</sup> mod p
              </p>
              <p>
                B = {result.g}<sup>{values.bob_private}</sup> mod {result.p}
                {" = "}
                <strong>{result.bob_public}</strong>
              </p>
              <p className="formula-explanation">
                Alice and Bob calculate public values from their private
                exponents. The private exponents are not sent to each other.
              </p>
            </div>

            <div className="formula-step">
              <h4>Step 2: Calculate the shared secret</h4>
              <p className="formula-equation">
                S<sub>A</sub> = B<sup>a</sup> mod p
              </p>
              <p>
                S<sub>A</sub> = {result.bob_public}
                <sup>{values.alice_private}</sup>
                {" mod "}{result.p}
                {" = "}
                <strong>{result.shared_secrets_match ? "Matches Bob's secret" : "Does not match Bob's secret"}</strong>
              </p>

              <p className="formula-equation">
                S<sub>B</sub> = A<sup>b</sup> mod p
              </p>
              <p>
                S<sub>B</sub> = {result.alice_public}
                <sup>{values.bob_private}</sup>
                {" mod "}{result.p}
              </p>
              <p className="formula-explanation">
                Both participants independently derive the same shared
                secret when they use each other's authentic public values.
              </p>
            </div>

            <div className="formula-step">
              <h4>Step 3: Sign and verify the exchange messages</h4>
              <p className="formula-equation">
                σ<sub>A</sub> = Sign(sk<sub>A</sub>, m<sub>A</sub>)
              </p>
              <p className="formula-equation">
                Verify(pk<sub>A</sub>, m<sub>A</sub>, σ<sub>A</sub>)
              </p>
              <p>
                Alice's signature verification:{" "}
                <strong>
                  {result.alice_signature_valid ? "Valid" : "Invalid"}
                </strong>
              </p>

              <p className="formula-equation">
                σ<sub>B</sub> = Sign(sk<sub>B</sub>, m<sub>B</sub>)
              </p>
              <p className="formula-equation">
                Verify(pk<sub>B</sub>, m<sub>B</sub>, σ<sub>B</sub>)
              </p>
              <p>
                Bob's signature verification:{" "}
                <strong>
                  {result.bob_signature_valid ? "Valid" : "Invalid"}
                </strong>
              </p>
              <p className="formula-explanation">
                Each participant signs their exchange message using a
                private signing key. The corresponding public key verifies
                the signature. A modified message should fail verification.
              </p>
            </div>

            <div className="formula-step">
              <h4>Step 4: Detect public-value substitution</h4>
              <p>
                Mallory's substituted value:{" "}
                <strong>{result.mallory_substituted_value}</strong>
              </p>
              <p>
                Substitution rejected:{" "}
                <strong>{result.substitution_rejected ? "Yes" : "No"}</strong>
              </p>
              <p className="formula-explanation">
                The demonstration modifies Alice's signed exchange message
                and checks whether its original signature still verifies.
                A signature over the original message should not validate
                the modified message.
              </p>
            </div>

            <div className="formula-result">
              <strong>
                {result.attack_blocked
                  ? "✓ The attempted substitution was detected."
                  : "The expected security checks were not all satisfied."}
              </strong>
              <p>
                Digital signatures help detect tampering when the signing
                public keys are trusted. They do not, by themselves,
                establish that a public key belongs to the claimed identity.
              </p>
            </div>
          </section>


          <section className="content-card">
            <h3>Security note</h3>
            <p>{result.security_note}</p>
            <p className="security-note">
              This demo trusts the signing public keys internally. In a real
              protocol, those identities must be authenticated independently.
            </p>
          </section>
        </section>
      )}
    </main>
  );
}

interface NumberFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}


function NumberField({ label, value, onChange }: NumberFieldProps) {
  const isPrivateValue =
    label.includes("private value");

  return (
    <label className="number-field">
      <span>{label}</span>
      <input
        type="number"
        min={2}
        step={1}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {isPrivateValue && (
        <small className="field-hint">
          Choose an integer between 2 and p-2 (inclusive).
        </small>
      )}
    </label>
  );
}