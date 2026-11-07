
interface ParticipantCardProps {
  name: string;
  role: string;
  publicValue?: number | string;
  description: string;
  accent?: string;
}

export default function ParticipantCard({
  name,
  role,
  publicValue,
  description,
  accent = "#acf2f1",
}: ParticipantCardProps) {
  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderTop: `4px solid ${accent}`,
        borderRadius: "12px",
        padding: "18px",
        minWidth: 0,
        overflowWrap: "anywhere",
        boxShadow: "0 3px 12px rgba(44, 22, 7, 0.06)",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#730f11",
          fontSize: "12px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        {role}
      </p>

      <h3 style={{ margin: "8px 0", color: "#2C1607" }}>
        {name}
      </h3>

      <p style={{ color: "#62564f", fontSize: "14px" }}>
        {description}
      </p>

      {publicValue !== undefined && (
        <div
          style={{
            background: "#f5f5f4",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          <span style={{ fontSize: "12px", color: "#62564f" }}>
            Public value
          </span>
          <p
            style={{
              margin: "4px 0 0",
              fontWeight: 700,
              overflowWrap: "anywhere",
            }}
          >
            {publicValue}
          </p>
        </div>
      )}
    </section>
  );
}