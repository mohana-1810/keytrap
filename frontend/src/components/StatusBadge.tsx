
type Status = "success" | "danger" | "warning" | "neutral";

interface StatusBadgeProps {
  label: string;
  status: Status;
}

const statusStyles: Record<
  Status,
  { background: string; color: string }
> = {
  success: { background: "#dcfce7", color: "#166534" },
  danger: { background: "#fee2e2", color: "#991b1b" },
  warning: { background: "#fef3c7", color: "#92400e" },
  neutral: { background: "#e7e5e4", color: "#44403c" },
};

export default function StatusBadge({
  label,
  status,
}: StatusBadgeProps) {
  const colors = statusStyles[status];

  return (
    <span
      role="status"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: colors.background,
        color: colors.color,
        padding: "6px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 700,
      }}
    >
      <span aria-hidden="true">
        {status === "success"
          ? "✓"
          : status === "danger"
            ? "✕"
            : status === "warning"
              ? "!"
              : "•"}
      </span>
      {label}
    </span>
  );
}