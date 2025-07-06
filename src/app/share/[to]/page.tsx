import { Metadata } from 'next';
import Image from 'next/image';
import bg2 from '../../../public/images/bg2.jpeg';

export async function generateMetadata({ params }: { params: { to: string } }): Promise<Metadata> {
  const namaTamu = decodeURIComponent(params.to || '').replace(/\+/g, ' ');
  return {
    title: `Undangan Pernikahan untuk ${namaTamu} | Geri & Sisi`,
    description: `Yth. ${namaTamu}, Anda diundang ke pernikahan Geri & Sisi. Klik untuk detail & RSVP.`,
    openGraph: {
      title: `Undangan Pernikahan untuk ${namaTamu} | Geri & Sisi`,
      description: `Yth. ${namaTamu}, Anda diundang ke pernikahan Geri & Sisi. Klik untuk detail & RSVP.`,
      images: [
        {
          url: '/images/bg2.jpeg',
          width: 1200,
          height: 630,
          alt: 'Undangan Pernikahan Geri & Sisi',
        },
      ],
      url: `https://wedding-repository.vercel.app/share/${encodeURIComponent(params.to)}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Undangan Pernikahan untuk ${namaTamu} | Geri & Sisi`,
      description: `Yth. ${namaTamu}, Anda diundang ke pernikahan Geri & Sisi. Klik untuk detail & RSVP.`,
      images: ['/images/bg2.jpeg'],
    },
  };
}

export default function SharePage({ params }: { params: { to: string } }) {
  const namaTamu = decodeURIComponent(params.to || '').replace(/\+/g, ' ');
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8f5f1] via-[#f7f0e9] to-[#e8d7cc] px-4 py-12">
      <div className="bg-white/90 rounded-3xl shadow-xl p-8 max-w-lg w-full flex flex-col items-center">
        <Image src={bg2} alt="Cover Undangan" width={180} height={180} className="w-32 h-32 object-cover rounded-full border-4 border-[#e8d7cc] shadow mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#5c4634] text-center">Undangan untuk {namaTamu}</h1>
        <p className="text-[#7c6650] text-center mb-4">Yth. {namaTamu}, Anda diundang ke pernikahan Geri & Sisi.<br />Klik tombol di bawah untuk melihat detail undangan.</p>
        <a href="/" className="mt-4 px-8 py-3 bg-[#5c4634] text-white rounded-full shadow-lg font-bold text-lg transition hover:bg-[#3e2d1a]">Lihat Undangan</a>
      </div>
    </main>
  );
} 