import { useState, type FormEvent } from "react";
import { runKeyExchange } from "../services/keyExchangeService";
import type { KeyExchangeResult } from "../types/exchange";
import ParticipantCard from "../components/ParticipantCard";
import StatusBadge from "../components/StatusBadge";
import SecretComparison from "../components/SecretComparison";
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

export default function KeyExchange() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [result, setResult] = useState<KeyExchangeResult | null>(null);
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
      const data = await runKeyExchange(parsed);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Exchange failed.");
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
          title: "Public parameters selected",
          description: `The exchange uses p = ${result.p} and g = ${result.g}.`,
          status: "neutral",
        },
        {
          title: "Public values exchanged",
          description: `Alice sends ${result.alice_public}; Bob sends ${result.bob_public}.`,
          status: "success",
        },
        {
          title: "Shared secrets calculated",
          description: result.secrets_match
            ? "Both participants independently calculated matching shared secrets."
            : "The calculated shared secrets do not match.",
          status: result.secrets_match ? "success" : "danger",
        },
      ]
    : [];

  return (
    <main className="page-container">
      <section className="hero">
        <p className="eyebrow">KEYTRAP · KEY EXCHANGE LAB</p>
        <h1>Diffie–Hellman Key Exchange</h1>
        <p>
          Choose the parameters and private values to see how Alice and Bob
          derive the same shared secret without transmitting it directly.
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
          These are small educational values, not production cryptography.
          For meaningful experiments, choose a prime p and a suitable generator.
        </p>

        {error && <p role="alert" className="error-message">{error}</p>}

        <div className="button-row">
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Calculating..." : "Calculate shared secret"}
          </button>
          <button className="secondary-button" type="button" onClick={resetForm}>
            Reset values
          </button>
        </div>
      </form>

      {result && (
        <section className="results-section" aria-live="polite">
          <h2>Exchange results</h2>

          <div className="participant-grid">
            <ParticipantCard name="Alice" role="Participant"
              publicValue={result.alice_public}
              description="Calculates a public value from her private value." />
            <ParticipantCard name="Bob" role="Participant"
              publicValue={result.bob_public}
              description="Calculates an independent public value." />
          </div>

          <section className="content-card">
            <h3>Shared-secret verification</h3>
            <p>Prime modulus: <strong>{result.p}</strong></p>
            <p>Generator: <strong>{result.g}</strong></p>
            <p>Alice's shared secret: <strong>{result.alice_shared_secret}</strong></p>
            <p>Bob's shared secret: <strong>{result.bob_shared_secret}</strong></p>
            <StatusBadge
              label={result.secrets_match ? "Secrets match" : "Secrets differ"}
              status={result.secrets_match ? "success" : "danger"}
            />
          </section>

          <SecretComparison aliceMatchesBob={result.secrets_match} />
                   
          <section className="content-card formula-breakdown">
            <h3>Formula Breakdown</h3>
            <p>
              Follow how Alice and Bob calculate their public values
                and independently derive the same shared secret.
            </p>

            <div className="formula-step">
              <h4>Step 1: Alice calculates her public value</h4>
              <p className="formula-equation">
                A = g<sup>a</sup> mod p
              </p>
              <p>
                A = {result.g}<sup>{values.alice_private}</sup> mod {result.p}
                {" = "}
                <strong>{result.alice_public}</strong>
              </p>
              <p className="formula-explanation">
                Alice uses the public generator raised to her private
                value, then takes the remainder after division by p.
              </p>
            </div>

            <div className="formula-step">
              <h4>Step 2: Bob calculates his public value</h4>
              <p className="formula-equation">
                B = g<sup>b</sup> mod p
              </p>
              <p>
                B = {result.g}<sup>{values.bob_private}</sup> mod {result.p}
                {" = "}
                <strong>{result.bob_public}</strong>
              </p>
              <p className="formula-explanation">
                Bob performs the same process using his own private value.
              </p>
            </div>

            <div className="formula-step">
              <h4>Step 3: Alice derives the shared secret</h4>
              <p className="formula-equation">
                S = B<sup>a</sup> mod p
              </p>
              <p>
                S = {result.bob_public}<sup>{values.alice_private}</sup>
                {" mod "}{result.p}
                {" = "}
                <strong>{result.alice_shared_secret}</strong>
              </p>
            </div>

            <div className="formula-step">
              <h4>Step 4: Bob derives the shared secret</h4>
              <p className="formula-equation">
                S = A<sup>b</sup> mod p
              </p>
              <p>
                S = {result.alice_public}<sup>{values.bob_private}</sup>
                {" mod "}{result.p}
                {" = "}
                <strong>{result.bob_shared_secret}</strong>
              </p>
            </div>

            <div className="formula-result">
              <strong>
                {result.secrets_match
                  ? "✓ Both participants derived the same shared secret."
                  : "✕ The shared secrets do not match."}
              </strong>
              <p>
                The private values are never transmitted directly.
                Both participants independently calculate the shared secret
                using their own private value and the other participant's
                public value.
              </p>
            </div>
          </section>

          <ExchangeTimeline events={events} />
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