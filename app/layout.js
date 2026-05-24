import "./globals.css";
import { Header } from "../components/layout/Header.jsx";

export const metadata = {
  title: "Nura — Community Health Triage",
  description:
    "WHO-protocol clinical decision support for community health workers. Covers SDG 3 targets 3.1 (maternal mortality), 3.2 (child mortality), and 3.d (health security).",
  keywords: [
    "SDG 3",
    "community health",
    "WHO IMNCI",
    "maternal health",
    "neonatal triage",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen antialiased font-sans">
        <Header />
        {children}
      </body>
    </html>
  );
}
