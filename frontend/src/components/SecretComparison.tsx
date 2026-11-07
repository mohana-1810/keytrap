
interface SecretComparisonProps {
  aliceMatchesBob: boolean;
  aliceMatchesMallory?: boolean;
  bobMatchesMallory?: boolean;
}

export default function SecretComparison({
  aliceMatchesBob,
  aliceMatchesMallory,
  bobMatchesMallory,
}: SecretComparisonProps) {
  const rows = [
    {
      label: "Alice ↔ Bob",
      matches: aliceMatchesBob,
    },
    ...(aliceMatchesMallory !== undefined
      ? [
          {
            label: "Alice ↔ Mallory",
            matches: aliceMatchesMallory,
          },
        ]
      : []),
    ...(bobMatchesMallory !== undefined
      ? [
          {
            label: "Bob ↔ Mallory",
            matches: bobMatchesMallory,
          },
        ]
      : []),
  ];

  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "18px",
      }}
    >
      <h3 style={{ color: "#2C1607", marginTop: 0 }}>
        Shared-secret comparison
      </h3>

      {rows.map((row) => (
        <div
          key={row.label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            padding: "12px 0",
            borderBottom: "1px solid #f0eeec",
          }}
        >
          <span>{row.label}</span>

          <span
            style={{
              fontWeight: 700,
              color: row.matches ? "#166534" : "#991b1b",
            }}
          >
            {row.matches ? "MATCH" : "DIFFERENT"}
          </span>
        </div>
      ))}

      <p style={{ fontSize: "13px", color: "#62564f" }}>
        In a successful MITM attack, Alice and Bob have different
        secrets, while Mallory shares a separate secret with each.
      </p>
    </section>
  );
}