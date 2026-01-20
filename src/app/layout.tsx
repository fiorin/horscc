import "./globals.css";
import Link from "next/link";
import { UserNav } from "../components/UserNav";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { ToastProvider } from "../components/ToastProvider";

export const metadata = {
  title: "Horscc",
  description: "Hot Wheels Expositor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen text-gray-900" suppressHydrationWarning>
        <ToastProvider />
        <nav className="bg-[#111] text-[#eee] shadow mb-8">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">Home</Link>
              <Link href="/cars">Cars</Link>
              <Link href="/stats">Stats</Link>
              <Link href="/about">About</Link>
              <Link href="/login">Login</Link>
            </div>

            <UserNav />
          </div>
        </nav>

        <ErrorBoundary>
          <main className="max-w-5xl mx-auto">{children}</main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
