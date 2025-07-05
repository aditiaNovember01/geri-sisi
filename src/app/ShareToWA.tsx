"use client";
import React, { useState, useEffect } from "react";

function getNamaFromQuery() {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  return params.get("nama") || "";
}

export default function ShareToWA() {
  const [nama, setNama] = useState("");

  useEffect(() => {
    setNama(getNamaFromQuery());
  }, []);

  const templatePesan = `Assalamu'alaikum Wr. Wb.\n\nDengan penuh sukacita kami mengundang Bapak/Ibu/Saudara/i {nama} untuk menghadiri pernikahan kami:\n\nGery & Sisi\nJumat, 1 Agustus 2025\n\nUntuk informasi lebih lanjut, silakan buka undangan digital kami di:\n{url}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.\n\nWassalamu'alaikum Wr. Wb.`;

  const urlUndangan = typeof window !== "undefined"
    ? `${window.location.origin}/?to=${encodeURIComponent(nama)}`
    : "";

  const pesan = templatePesan
    .replace("{nama}", nama ? `*${nama.toUpperCase()}*` : "*BAPAK/IBU/SAUDARA/I*")
    .replace("{url}", urlUndangan);

  const handleShare = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(pesan)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8f5f1] via-[#f7f0e9] to-[#e8d7cc] px-4 py-12">
      <div className="bg-white/90 rounded-3xl shadow-xl p-8 max-w-lg w-full flex flex-col items-center">
        <img src="/images/bg2.jpeg" alt="Ilustrasi Undangan" className="w-32 h-32 object-cover rounded-full border-4 border-[#e8d7cc] shadow mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#5c4634] text-center">Bagikan Undangan via WhatsApp</h1>
        <p className="text-[#7c6650] text-center mb-4">Masukkan nama tamu yang akan diundang, lalu klik tombol di bawah untuk membagikan undangan ke WhatsApp.</p>
        <input
          type="text"
          className="border border-[#e5dad1] rounded px-4 py-3 font-serif text-[#5c4634] bg-[#f7f0e9] w-full mb-4 focus:outline-none focus:ring-2 focus:ring-pink-200 text-center"
          placeholder="Nama Tamu yang Diundang"
          value={nama}
          onChange={e => setNama(e.target.value)}
        />
        <button
          onClick={handleShare}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg flex items-center gap-2 transition mb-4"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16.72 13.06c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.28-.74.94-.91 1.13-.17.19-.34.21-.63.07-.29-.14-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.17-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1.01-1 2.46 0 1.45 1.03 2.85 1.18 3.05.14.19 2.03 3.1 4.92 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.7-.7 1.94-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.33z" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
          Bagikan ke WhatsApp
        </button>
        <div className="w-full bg-[#f7f0e9] rounded-xl p-4 text-sm text-[#5c4634] font-mono whitespace-pre-line border border-[#e5dad1]">
          <b>Preview Pesan:</b>
          <br />
          {pesan}
        </div>
      </div>
    </div>
  );
} 