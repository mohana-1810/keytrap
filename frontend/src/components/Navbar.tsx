const links = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Key Exchange", href: "#exchange" },
  { label: "MITM Attack", href: "#attack" },
  { label: "Authenticated Exchange", href: "#authentication" },
  { label: "Comparison", href: "#comparison" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  return (
    <nav
      aria-label="Main navigation"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
        padding: "16px 24px",
        background: "#2C1607",
        color: "#ffffff",
      }}
    >
      <a
        href="#dashboard"
        style={{
          color: "#acf2f1",
          fontSize: "22px",
          fontWeight: 800,
          textDecoration: "none",
        }}
      >
        KeyTrap
      </a>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 18px",
        }}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}