"use client";



export default function SettingsPage() {
  return (
    <div className="flex flex-col text-slate-900">

      <main className="flex-1 mx-auto max-w-2xl w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Pengaturan</h1>
          <p className="text-slate-600 text-sm">
            Sesuaikan preferensi keamanan, notifikasi, dan akun Anda.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-900">Notifikasi WhatsApp</p>
              <p className="text-xs text-slate-500">Kirimkan pembaruan status lamaran langsung ke WhatsApp Anda</p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5 accent-sky-600" />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">Mode Keamanan Tambahan</p>
              <p className="text-xs text-slate-500">Minta verifikasi OTP saat masuk melalui perangkat baru</p>
            </div>
            <input type="checkbox" className="h-5 w-5 accent-sky-600" />
          </div>
        </div>
      </main>

    </div>
  );
}
