import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "KerjaIn — Temukan Pekerja & Pekerjaan Informal",
    template: "%s | KerjaIn",
  },
  description:
    "Platform penghubung pekerja informal dengan perekrut UMKM. Temukan pekerjaan harian, paruh waktu, dan kontrak di sekitar Anda.",
  keywords: [
    "kerja informal",
    "lowongan UMKM",
    "pekerja harian",
    "rekrut pekerja",
    "KerjaIn",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
