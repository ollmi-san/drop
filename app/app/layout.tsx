import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DROP. — Dein Style. Dein Avatar.",
  description: "Fashion App — Berlin Urban Style",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full">
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
