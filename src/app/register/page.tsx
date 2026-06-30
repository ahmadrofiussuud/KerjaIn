"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function RegisterPage() {
  const router = useRouter();

  const handleMockRegister = (role: "applicant" | "recruiter") => {
    localStorage.setItem("mock_user_role", role);
    window.dispatchEvent(new CustomEvent("mock-role-change", { detail: role }));
    
    if (role === "applicant") {
      router.push("/jobs");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-card text-center">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Daftar Akun Baru</h1>
          <p className="text-sm text-slate-500 mb-6">Mulai perjalanan Anda bersama KerjaIn hari ini</p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleMockRegister("applicant")}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 transition-all text-left group cursor-pointer w-full bg-white"
            >
              <div>
                <h3 className="font-bold text-slate-900">Daftar sebagai Pencari Kerja</h3>
                <p className="text-xs text-slate-500 mt-0.5">Lengkapi profil singkat Anda & lamar instan</p>
              </div>
              <span className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-600 transition-colors font-bold">&rarr;</span>
            </button>

            <button
              onClick={() => handleMockRegister("recruiter")}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 transition-all text-left group cursor-pointer w-full bg-white"
            >
              <div>
                <h3 className="font-bold text-slate-900">Daftar sebagai Perekrut (UMKM)</h3>
                <p className="text-xs text-slate-500 mt-0.5">Dapatkan tenaga kerja harian terlatih di sekitar Anda</p>
              </div>
              <span className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-600 transition-colors font-bold">&rarr;</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400">
            Sudah memiliki akun? <Link href="/login" className="text-sky-600 hover:underline">Masuk di sini</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
