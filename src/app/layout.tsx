import "./globals.css";
import Link from "next/link";

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
    <html lang="en">
      <body className="min-h-screen text-gray-900">
        <nav className="bg-[#111] text-[#eee] shadow mb-8">
          <div className="max-w-5xl mx-auto px-4 py-3 flex gap-4">
            <Link href="/">Home</Link>
            <Link href="/cars">Cars</Link>
            <Link href="/about">About</Link>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
