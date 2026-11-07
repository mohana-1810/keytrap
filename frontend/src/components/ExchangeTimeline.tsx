export interface TimelineEvent {
  title: string;
  description: string;
  status: "success" | "danger" | "warning" | "neutral";
}

interface ExchangeTimelineProps {
  events: TimelineEvent[];
}

const markerColors = {
  success: "#16803d",
  danger: "#b91c1c",
  warning: "#b7791f",
  neutral: "#78716c",
};

export default function ExchangeTimeline({
  events,
}: ExchangeTimelineProps) {
  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px",
      }}
    >
      <h3 style={{ color: "#2C1607", marginTop: 0 }}>
        Exchange timeline
      </h3>

      {events.length === 0 ? (
        <p style={{ color: "#78716c" }}>
          Run a simulation to see the exchange steps.
        </p>
      ) : (
        <ol
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {events.map((event, index) => (
            <li
              key={`${event.title}-${index}`}
              style={{
                display: "flex",
                gap: "12px",
                paddingBottom: "20px",
              }}
            >
              <span
                aria-hidden="True"
                style={{
                  width: "12px",
                  height: "12px",
                  marginTop: "5px",
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: markerColors[event.status],
                }}
              />

              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    color: "#2C1607",
                  }}
                >
                  {index + 1}. {event.title}
                </p>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#62564f",
                    fontSize: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  {event.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}