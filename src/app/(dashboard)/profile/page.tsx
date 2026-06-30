"use client";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <div className="flex flex-col text-slate-900">

      <main className="flex-1 mx-auto max-w-2xl w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Profil Pengguna</h1>
          <p className="text-slate-600 text-sm">
            Kelola informasi data diri Anda untuk mempermudah proses melamar cepat.
          </p>
        </div>

        <form className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Input label="Nama Lengkap" defaultValue="Ahmad Rizky Pratama" />
          <Input label="Nomor Telepon" defaultValue="0812-3456-7890" />
          <Input label="Lokasi Domisili" defaultValue="Jakarta Selatan" />
          <div className="pt-2">
            <Button
              variant="primary"
              className="bg-sky-600 hover:bg-sky-500 text-white font-semibold"
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </main>

    </div>
  );
}
