import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import KeyExchange from "./pages/KeyExchange";
import AttackSimulator from "./pages/MitmAttack";
import AuthenticatedExchange from "./pages/AuthenticatedExchange";
import About from "./pages/About";
import Comparison from "./pages/Comparison";

type PageName =
  | "dashboard"
  | "exchange"
  | "attack"
  | "authentication"
  | "comparison"
  | "about";

function getCurrentPage(): PageName {
  const hash = window.location.hash.replace("#", "");

  const validPages: PageName[] = [
  "dashboard",
  "exchange",
  "attack",
  "authentication",
  "comparison",
  "about",
];

  return validPages.includes(hash as PageName)
    ? (hash as PageName)
    : "dashboard";
}

export default function App() {
  const [page, setPage] = useState<PageName>(getCurrentPage);

  useEffect(() => {
    function handleHashChange() {
      setPage(getCurrentPage());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  function renderPage() {
    switch (page) {
      case "exchange":
        return <KeyExchange />;

      case "attack":
        return <AttackSimulator />;

      case "authentication":
        return <AuthenticatedExchange />;

      case "comparison":
        return <Comparison />;

      case "about":
        return <About />;

      default:
        return <Dashboard />;
    }
  }

  return (
    <div className="app-shell">
      <Navbar />
      {renderPage()}

      <footer className="app-footer">
        <p>KeyTrap · Cryptography Learning Lab</p>
        <p>Educational simulations only — not for production security.</p>
      </footer>
    </div>
  );
}