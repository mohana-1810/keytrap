import { useState, type FormEvent } from "react";
import { runMitmAttack } from "../services/attackService";
import type { MitmAttackResult } from "../types/attack";
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
  mallory_for_alice: "7",
  mallory_for_bob: "9",
};

type FormValues = typeof initialValues;

export default function MitmAttack() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [result, setResult] = useState<MitmAttackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  function updateValue(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleAttack(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);

    const parsed = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, Number(value)])
    ) as Record<keyof FormValues, number>;

    if (Object.values(parsed).some((value) => !Number.isSafeInteger(value))) {
      setError("Enter valid whole numbers for all fields.");
      return;
    }

    const { p, g, alice_private, bob_private,
      mallory_for_alice, mallory_for_bob } = parsed;

    if (p <= 3 || g < 2 || g >= p) {
      setError("Use p > 3 and a generator candidate g between 2 and p - 1.");
      return;
    }

    if ([alice_private, bob_private, mallory_for_alice, mallory_for_bob]
      .some((value) => value < 2 || value > p - 2)) {
      setError("Each private value must be between 2 and p - 2.");
      return;
    }

    setLoading(true);

    try {
      const data = await runMitmAttack({
        p,
        g,
        alice_private,
        bob_private,
        mallory_for_alice,
        mallory_for_bob,
      });
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "MITM attack request failed."
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
          title: "Alice generates her public value",
          description: `Alice's public value is ${result.alice_public}.`,
          status: "neutral",
        },
        {
          title: "Mallory intercepts the exchange",
          description:
            `Mallory presents ${result.mallory_public_for_alice} to Alice ` +
            `and ${result.mallory_public_for_bob} to Bob.`,
          status: "danger",
        },
        {
          title: "Separate secrets are calculated",
          description:
            "Each endpoint calculates a secret with Mallory using the substituted public value.",
          status: "warning",
        },
        {
          title: "Attack outcome",
          description: result.attack_successful
            ? "Alice and Bob have different secrets, while Mallory shares a matching secret with each."
            : "The expected MITM conditions were not all satisfied.",
          status: result.attack_successful ? "danger" : "neutral",
        },
      ]
    : [];

  return (
    <main className="page-container">
      <section className="hero">
        <p className="eyebrow">KEYTRAP · ATTACK LAB</p>
        <h1>Man-in-the-Middle Attack</h1>
        <p>
          Choose the private values and observe how Mallory can establish
          separate shared secrets by replacing unauthenticated public values.
        </p>
      </section>

      <form className="content-card" onSubmit={handleAttack}>
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

        <h3>Mallory's private values</h3>
        <div className="input-grid">
          <NumberField label="Mallory's value for Alice connection"
            value={values.mallory_for_alice}
            onChange={(v) => updateValue("mallory_for_alice", v)} />
          <NumberField label="Mallory's value for Bob connection"
            value={values.mallory_for_bob}
            onChange={(v) => updateValue("mallory_for_bob", v)} />
        </div>

        <p className="security-note">
          Educational parameters only. Use a prime p and a suitable generator
          for meaningful experiments. These small values are not secure.
        </p>

        {error && <p role="alert" className="error-message">{error}</p>}

        <div className="button-row">
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Calculating..." : "Run MITM attack"}
          </button>
          <button className="secondary-button" type="button" onClick={resetForm}>
            Reset values
          </button>
        </div>
      </form>

      {result && (
        <section className="results-section" aria-live="polite">
          <h2>Attack results</h2>

          <div className="participant-grid">
            <ParticipantCard name="Alice" role="Participant"
              publicValue={result.alice_public}
              description="Receives Mallory's substituted public value." />
            <ParticipantCard name="Mallory" role="Attacker"
              publicValue={`${result.mallory_public_for_alice} / ${result.mallory_public_for_bob}`}
              description="Maintains separate shared secrets with each participant."
              accent="#d97736" />
            <ParticipantCard name="Bob" role="Participant"
              publicValue={result.bob_public}
              description="Receives Mallory's other substituted public value." />
          </div>

          <div className="content-card">
            <h3>Verification</h3>
            <p>Alice's secret matches Mallory's:{" "}
              <StatusBadge label={String(result.alice_secret_matches_mallory)}
                status={result.alice_secret_matches_mallory ? "success" : "danger"} />
            </p>
            <p>Bob's secret matches Mallory's:{" "}
              <StatusBadge label={String(result.bob_secret_matches_mallory)}
                status={result.bob_secret_matches_mallory ? "success" : "danger"} />
            </p>
            <p>Alice and Bob share the same secret:{" "}
              <StatusBadge label={String(result.alice_and_bob_share_same_secret)}
                status={result.alice_and_bob_share_same_secret ? "success" : "danger"} />
            </p>
            <p>Attack successful:{" "}
              <StatusBadge
                label={result.attack_successful ? " Yes" : "✕ No"}
                status={result.attack_successful ? "success" : "neutral"}
              />
            </p>
          </div>

          <SecretComparison
            aliceMatchesBob={result.alice_and_bob_share_same_secret}
            aliceMatchesMallory={result.alice_secret_matches_mallory}
            bobMatchesMallory={result.bob_secret_matches_mallory}
          />
      
          <section className="content-card formula-breakdown">
            <h3>MITM Formula Breakdown</h3>
            <p>
              Follow how Alice, Bob, and Mallory calculate their public values
              and shared secrets using modular exponentiation.
            </p>

            <div className="formula-step">
              <h4>Step 1: Alice and Bob generate public values</h4>
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
            </div>

            <div className="formula-step">
              <h4>Step 2: Mallory generates two substituted public values</h4>
              <p className="formula-equation">
                M<sub>A</sub> = g<sup>mA</sup> mod p
              </p>
              <p>
                M<sub>A</sub> = {result.g}<sup>{values.mallory_for_alice}</sup>
                {" mod "}{result.p}
                {" = "}
                <strong>{result.mallory_public_for_alice}</strong>
              </p>

              <p className="formula-equation">
                M<sub>B</sub> = g<sup>mB</sup> mod p
              </p>
              <p>
                M<sub>B</sub> = {result.g}<sup>{values.mallory_for_bob}</sup>
                {" mod "}{result.p}
                {" = "}
                <strong>{result.mallory_public_for_bob}</strong>
              </p>
            </div>

            <div className="formula-step">
              <h4>Step 3: Alice derives a secret with Mallory</h4>
              <p className="formula-equation">
                S<sub>A</sub> = M<sub>A</sub><sup>a</sup> mod p
              </p>
              <p>
                S<sub>A</sub> = {result.mallory_public_for_alice}
                <sup>{values.alice_private}</sup>
                {" mod "}{result.p}
                {" = "}
                <strong>
                  {Number(
                    BigInt(result.mallory_public_for_alice) **
                    BigInt(values.alice_private) %
                    BigInt(result.p)
                  )}
                </strong>
              </p>
              <p className="formula-explanation">
                Mallory can calculate the same secret using Alice's public value
                and Mallory's private exponent for this connection.
              </p>
            </div>

            <div className="formula-step">
              <h4>Step 4: Bob derives a secret with Mallory</h4>
              <p className="formula-equation">
                S<sub>B</sub> = M<sub>B</sub><sup>b</sup> mod p
              </p>
              <p>
                S<sub>B</sub> = {result.mallory_public_for_bob}
                <sup>{values.bob_private}</sup>
                {" mod "}{result.p}
                {" = "}
                <strong>
                  {Number(
                    BigInt(result.mallory_public_for_bob) **
                    BigInt(values.bob_private) %
                    BigInt(result.p)
                  )}
                </strong>
              </p>
              <p className="formula-explanation">
                Mallory can independently calculate the same secret as Bob
                for this second connection.
              </p>
            </div>

            <div className="formula-result">
              <strong>
                {result.attack_successful
                  ? "✓ MITM attack demonstrated"
                  : "The expected MITM conditions were not all satisfied."}
              </strong>
              <p>
                Alice and Bob derive different secrets because each received
                Mallory's substituted public value. Mallory can establish a
                matching secret with each participant separately.
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
    label.includes("private value") ||
    label.includes("value for Alice connection") ||
    label.includes("value for Bob connection");

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