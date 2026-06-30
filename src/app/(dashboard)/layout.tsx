import { AppNavbar } from "@/components/layout/app-navbar";
import { Footer } from "@/components/layout/footer";

/**
 * Dashboard Layout — Layout untuk semua halaman setelah login.
 * Menggunakan AppNavbar yang cerdas dan menampilkan menu berbeda per role.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AppNavbar />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
