"use client";
import { useEffect, useRef, useState } from "react";
import { Playfair_Display } from "next/font/google";
import "aos/dist/aos.css";
import AOS from "aos";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { createClient } from '@supabase/supabase-js';

const sections = [
  { id: "couple", label: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg> },
  { id: "countdown", label: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" /></svg> },
  { id: "event", label: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" /></svg> },
  { id: "rsvp", label: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4.5M3 10.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7.5M16 2v4M8 2v4M3 10.5h18" /></svg> },
];

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "900"], style: ["italic", "normal"] });

function useScrollReveal() {
  useEffect(() => {
    const reveal = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in", "animate-slide-in-up");
          observer.unobserve(entry.target);
        }
      });
    };
    const observer = new window.IntersectionObserver(reveal, { threshold: 0.15 });
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useSmoothScroll() {
  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches("[data-scroll]") && (target as HTMLAnchorElement).hash) {
        const el = document.getElementById((target as HTMLAnchorElement).hash.replace("#", ""));
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
}

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [prev, setPrev] = useState(value);
  useEffect(() => {
    if (value !== prev && ref.current) {
      ref.current.classList.remove("animate-fade-in", "animate-slide-in-up");
      // trigger reflow
      void ref.current.offsetWidth;
      ref.current.classList.add("animate-fade-in", "animate-slide-in-up");
      setPrev(value);
    }
  }, [value, prev]);
  return (
    <span ref={ref} className="transition-all duration-400 ease-in-out block">
      {value.toString().padStart(2, "0")}
    </span>
  );
}

function Countdown({ targetDate }: { targetDate: Date }) {
  const [time, setTime] = useState<{ d: number; h: number; m: number; s: number }>({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, targetDate.getTime() - now.getTime());
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTime({ d, h, m, s });
    };
    tick();
    const intv = setInterval(tick, 1000);
    return () => clearInterval(intv);
  }, [targetDate]);
  return (
    <div className="flex gap-4 justify-center" data-reveal>
      {[{ label: "Hari", v: time.d }, { label: "Jam", v: time.h }, { label: "Menit", v: time.m }, { label: "Detik", v: time.s }].map((item) => (
        <div key={item.label} className="flex flex-col items-center animate-countup">
          <AnimatedNumber value={item.v} />
          <span className="text-xs mt-1 text-gray-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function Cover({ onOpen }: { onOpen: () => void }) {
  const [hide, setHide] = useState(false);
  const [petalPositions, setPetalPositions] = useState<{left: string, delay: string}[]>([]);
  const [namaTamu, setNamaTamu] = useState('');
  useEffect(() => {
    setPetalPositions(
      Array.from({ length: 18 }, () => ({
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`
      }))
    );
    // Ambil nama tamu dari query string
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setNamaTamu(params.get('to') || '');
    }
  }, []);
  const handleOpen = () => {
    setHide(true);
    setTimeout(onOpen, 400);
  };
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-[#f8f5f1] via-[#f7f0e9] to-[#e8d7cc] transition-opacity duration-400 ease-in-out ${hide ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      style={{ minHeight: "100dvh", padding: '2rem' }}
    >
      {/* Background gambar */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img src="/images/bg2.jpeg" alt="background" className="object-cover w-full h-full" style={{ filter: 'brightness(0.7) blur(1px)' }} />
      </div>
      {/* Overlay gradasi */}
      <div className="absolute inset-0 w-full h-full z-10 bg-gradient-to-b from-white/80 via-white/60 to-[#f8f5f1]/80" />
      {/* Semua konten utama di atas overlay */}
      <div className="relative z-40 flex flex-col items-center w-full">
        {/* Animasi hujan kelopak bunga */}
        <div className="flower-rain pointer-events-none absolute inset-0 w-full h-full z-20">
          {petalPositions.map((pos, i) => (
            <span key={i} className={`petal petal-${i % 6}`} style={{ left: pos.left, animationDelay: pos.delay }} />
          ))}
        </div>
        {/* Ornamen floral kiri atas */}
        <svg className="absolute left-4 top-4 w-16 h-16 z-30 opacity-70" viewBox="0 0 64 64" fill="none"><path d="M32 2C36 18 46 18 62 32C46 46 36 46 32 62C28 46 18 46 2 32C18 18 28 18 32 2Z" stroke="#b08968" strokeWidth="2" fill="#f7f0e9"/></svg>
        {/* Ornamen floral kanan bawah */}
        <svg className="absolute right-4 bottom-4 w-16 h-16 z-30 opacity-70 rotate-180" viewBox="0 0 64 64" fill="none"><path d="M32 2C36 18 46 18 62 32C46 46 36 46 32 62C28 46 18 46 2 32C18 18 28 18 32 2Z" stroke="#b08968" strokeWidth="2" fill="#f7f0e9"/></svg>
        {/* Foto pasangan */}
        <div className="w-36 h-36 rounded-full border-8 border-[#f8f5f1] shadow-xl flex items-center justify-center mx-auto mb-6 z-40 bg-white overflow-hidden animate-fade-in" data-aos="fade-up" data-aos-delay="50">
          <img src="/images/rsvp.jpeg" alt="Geri & Sisi" className="object-cover w-full h-full" />
        </div>
        {/* Judul dan tombol */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2 animate-fade-in" data-aos="fade-up" data-aos-delay="200" style={{ color: '#5c4634' }}>Geri & Sisi</h1>
        <p className="text-lg text-[#7c6650] max-w-xl mx-auto mb-4 animate-fade-in" data-aos="fade-up" data-aos-delay="300">
          Kepada Yth. <span className="font-bold" style={{ textTransform: 'uppercase' }}>{namaTamu ? namaTamu : 'Bapak/Ibu/Saudara/i'}</span>,<br />
          Kami mengundang Anda untuk hadir dalam acara pernikahan kami
        </p>
        <span className="block text-xl font-serif font-semibold mb-8 animate-fade-in" style={{ color: '#b08968', textShadow: '0 1px 8px #fff8' }} data-aos="fade-up" data-aos-delay="400"></span>
        <button
          onClick={handleOpen}
          className="px-10 py-4 bg-[#5c4634] text-white rounded-full shadow-lg font-bold text-lg transition duration-400 ease-in-out transform hover:scale-105 hover:bg-[#3e2d1a] focus:outline-none animate-zoom-in"
          style={{ boxShadow: '0 4px 24px #5c463444' }}
          data-aos="fade-up"
          data-aos-delay="500"
        >
          Buka Undangan
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  useScrollReveal();
  useSmoothScroll();
  const date = new Date();
  date.setMonth(7); // Agustus (0-indexed)
  date.setDate(17);
  date.setHours(10, 0, 0, 0);
  // Tanggal acara (target countdown)
  const eventDate = new Date(2025, 7, 1, 13, 0, 0, 0); // 1 Agustus 2025, 13:00 WIB
  // Inisialisasi AOS
  useEffect(() => { AOS.init({ duration: 800, once: true, easing: "ease-in-out" }); }, []);

  // Play audio saat undangan dibuka
  useEffect(() => {
    if (opened && audioRef.current) {
      audioRef.current.play();
      setAudioPlaying(true);
    }
  }, [opened]);

  const handleAudioToggle = () => {
    if (!audioRef.current) return;
    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.play();
      setAudioPlaying(true);
    }
  };

  return (
    <div className={`min-h-screen bg-[#f8f5f1] ${playfair.className} text-[#5c4634]`}> {/* creamy beige bg, soft brown text */}
      {/* Audio player dan kontrol */}
      <audio ref={audioRef} src="/audio/wedding.mp3" loop preload="auto" />
      {!opened && <Cover onOpen={() => setOpened(true)} />}
      {/* Navbar dan konten undangan hanya muncul jika sudah dibuka */}
      <div className={opened ? "" : "pointer-events-none select-none blur-sm"}>
        {/* Navbar */}
        <nav className="fixed top-0 left-0 w-full z-20 bg-white/80 dark:bg-black/60 shadow backdrop-blur flex justify-center py-2 gap-4 transition duration-400 ease-in-out">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              data-scroll
              className="px-4 py-1 rounded transition duration-400 ease-in-out hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center justify-center"
            >
              {s.label}
            </a>
          ))}
        </nav>
        <main className="flex flex-col items-center justify-center min-h-screen py-8 px-2">
          {/* Section utama dengan id untuk anchor scroll */}
          <div id="couple" className="w-full max-w-5xl bg-white/80 rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden">
            {/* Kiri: Teks */}
            <div className="flex-1 flex flex-col justify-center p-8 md:p-12 gap-8" data-aos="fade-right">
              <h1 className="text-4xl md:text-5xl font-bold italic mb-2 leading-tight">
                <span className="not-italic font-black">Geri</span> <span className="italic font-bold">dan</span> <span className="not-italic font-black">Sisi</span>
              </h1>
              <div className="text-lg md:text-xl italic text-[#a68c6d] mb-4">
                &quot;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang...&quot;<br />
                <span className="block text-right text-base mt-2">(Q.S. Ar-Rum: 21)</span>
              </div>
              <div className="text-2xl md:text-3xl text-[#5c4634] font-serif mb-2">وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً</div>
            
            </div>
            {/* Kanan: Gambar & countdown */}
            <div className="flex-1 flex flex-col items-center justify-center bg-[#f3ede7] p-8 md:p-12 relative" data-aos="fade-left">
              {/* Foto pasangan */}
              <div className="relative flex items-center justify-center mb-8">
                <img src="/images/bg.jpeg" alt="Geri and Sisi" className="w-56 h-56 md:w-72 md:h-72 object-cover rounded-full border-8 border-[#f8f5f1] shadow-lg" style={{ boxShadow: "0 8px 32px #e2d6c2" }} />
                {/* Teks melingkar */}
                <svg width="180" height="180" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <defs>
                    <path id="circlePath" d="M90,90 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0" />
                  </defs>
                  <text fill="#a68c6d" fontSize="16" fontFamily="serif">
                    <textPath xlinkHref="#circlePath" startOffset="0"> SAVE THE DATE • SAVE THE DATE • </textPath>
                  </text>
                </svg>
              </div>
              {/* Countdown modern */}
              <div className="flex gap-4 justify-center mt-2" data-aos="fade-up" id="countdown">
                <Countdown targetDate={eventDate} />
              </div>
            </div>
          </div>
          
          {/* Section Profil Mempelai */}
          <div className="w-full py-12 px-2 bg-[#e8d7cc] flex flex-col items-center" id="event">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center serif" data-aos="fade-up">Mempelai Wanita & Pria</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">      
              {/* Groom */}
              <div className="flex flex-col items-center bg-white/70 rounded-3xl p-6" data-aos="fade-up" data-aos-delay="100">
                <div className="overflow-hidden w-40 h-48 mb-4" style={{ borderRadius: '0 0 0 2.5rem' }}>
                  <img src="/images/groom.jpeg" alt="The Groom" className="object-cover w-full h-full" />
                </div>
                <div className="text-2xl md:text-3xl font-bold serif mb-1">
                  <span className="font-playfair">Geri Afria Irman, S. Pd</span>
                </div>
                <div className="text-center text-base text-[#5c4634] mb-2">Putra dari (Alm) Bapak Irman & Ibu Dariharyeti<br />Alamat: Koto Pulai, Barung Barung Belantai, Pesisir Selatan</div>
              </div>
                  {/* Bride */}
              <div className="flex flex-col items-center bg-white/70 rounded-3xl p-6" data-aos="fade-up">
                <div className="overflow-hidden w-40 h-48 mb-4" style={{ borderRadius: '0 0 2.5rem 0' }}>
                  <img src="/images/bridge.jpeg" alt="The Bride" className="object-cover w-full h-full" />
                </div>
                <div className="text-2xl md:text-3xl font-bold serif mb-1">
                  <span className="font-playfair">Sisi Mona Fitri, S. Pd</span>
                </div>
                <div className="text-center text-base text-[#5c4634] mb-2">Putri dari Bapak Zainal & Ibu Reni Susmita<br />Alamat: Bukit Kaciak, Rantau Simalenang, Air Haji, Pesisir Selatan</div>
              </div>
            </div>
          </div>

          {/* Section Our Love Story Majalah Wedding */}
          <section className="w-full py-16 px-2 bg-[#f7f0e9] flex flex-col md:flex-row items-stretch gap-8 max-w-6xl mx-auto">
            {/* Judul di kiri */}
            <div className="flex flex-col items-start md:w-1/4 mb-8 md:mb-0 justify-center">
              <span className="text-5xl md:text-6xl font-black serif leading-none mb-2" style={{ letterSpacing: '0.04em' }}>CERITA</span>
              <span className="text-2xl font-script text-[#b08968] ml-1 mt-1">Cinta Kami</span>
            </div>
            {/* 3 Kolom Cerita */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* The Beginning */}
              <div className="flex flex-col items-center text-center" data-aos="fade-up">
                <div className="w-32 h-44 md:w-36 md:h-52 bg-white shadow-lg rounded-full overflow-hidden mb-4 flex items-center justify-center" style={{ boxShadow: '0 4px 24px #e2d6c2' }}>
                  <img src="/images/a.jpeg" alt="The Beginning" className="object-cover w-full h-full" style={{ borderRadius: '50% / 45%' }} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold serif mb-2 text-[#a68c6d]">Awal Kisah</h3>
                <p className="text-base md:text-lg font-serif text-[#5c4634]">Awal kisah kami dimulai dari pertemuan sederhana yang tak terduga, membawa dua hati saling mengenal dan tumbuh bersama.</p>
              </div>
              {/* First Date */}
              <div className="flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay="100">
                <div className="w-32 h-44 md:w-36 md:h-52 bg-white shadow-lg rounded-full overflow-hidden mb-4 flex items-center justify-center" style={{ boxShadow: '0 4px 24px #e2d6c2' }}>
                  <img src="/images/b.jpeg" alt="First Date" className="object-cover w-full h-full" style={{ borderRadius: '50% / 45%' }} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold serif mb-2 text-[#a68c6d]">Kencan Pertama</h3>
                <p className="text-base md:text-lg font-serif text-[#5c4634]">Momen kencan pertama menjadi kenangan manis, penuh tawa dan cerita yang membuat kami semakin dekat satu sama lain.</p>
              </div>
              {/* The Proposal */}
              <div className="flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay="200">
                <div className="w-32 h-44 md:w-36 md:h-52 bg-white shadow-lg rounded-full overflow-hidden mb-4 flex items-center justify-center" style={{ boxShadow: '0 4px 24px #e2d6c2' }}>
                  <img src="/images/c.jpeg" alt="The Proposal" className="object-cover w-full h-full" style={{ borderRadius: '50% / 45%' }} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold serif mb-2 text-[#a68c6d]">Lamaran</h3>
                <p className="text-base md:text-lg font-serif text-[#5c4634]">Di hari istimewa, sebuah lamaran sederhana namun penuh makna menjadi awal babak baru perjalanan cinta kami.</p>
              </div>
            </div>
          </section>

          {/* Section Galeri Foto - Image Slider */}
          <section className="w-full py-16 px-2 bg-[#d9c7bb] flex flex-col items-center" data-aos="fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center serif text-[#5c4634]">Galeri Foto</h2>
            <div className="w-full max-w-5xl">
              <Swiper
                spaceBetween={24}
                slidesPerView={1.2}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                loop={true}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                modules={[Autoplay, Pagination]}
                className="pb-8"
              >
                <SwiperSlide>
                  <img src="/images/1.jpeg" alt="Galeri 1" className="h-96 w-auto object-cover rounded-xl shadow-lg transition-all duration-500" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/images/2.jpeg" alt="Galeri 2" className="h-96 w-auto object-cover rounded-xl shadow-lg transition-all duration-500" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/images/3.jpeg" alt="Galeri 3" className="h-96 w-auto object-cover rounded-xl shadow-lg transition-all duration-500" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/images/4.jpeg" alt="Galeri 4" className="h-96 w-auto object-cover rounded-xl shadow-lg transition-all duration-500" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/images/5.jpeg" alt="Galeri 5" className="h-96 w-auto object-cover rounded-xl shadow-lg transition-all duration-500" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/images/6.jpeg" alt="Galeri 6" className="h-96 w-auto object-cover rounded-xl shadow-lg transition-all duration-500" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/images/7.jpeg" alt="Galeri 7" className="h-96 w-auto object-cover rounded-xl shadow-lg transition-all duration-500" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/images/8.jpeg" alt="Galeri 7" className="h-96 w-auto object-cover rounded-xl shadow-lg transition-all duration-500" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/images/slide1.jpeg" alt="Galeri 7" className="h-96 w-auto object-cover rounded-xl shadow-lg transition-all duration-500" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/images/slide2.jpeg" alt="Galeri 7" className="h-96 w-auto object-cover rounded-xl shadow-lg transition-all duration-500" />
                </SwiperSlide>
              </Swiper>
              
            </div>
          </section>

          {/* Section Detail Acara (Akad Nikah & Resepsi) */}
          <section className="w-full py-16 px-2 bg-[#f7f0e9] flex flex-col items-center" data-aos="fade-up">
            {/* Gambar besar setengah lingkaran bawah di tengah atas */}
            <div className="w-full flex justify-center mb-8">
              <div className="w-64 h-40 bg-cover bg-center rounded-b-full shadow-lg" style={{ backgroundImage: 'url(/images/bg.jpeg)' }}></div>
            </div>
            {/* Dua kolom detail acara */}
            <div className="w-full max-w-4xl flex flex-col md:flex-row items-stretch bg-white/70 rounded-3xl shadow-xl overflow-hidden">
              {/* Kolom kiri: Akad & Resepsi 1 (di rumah wanita) */}
              <div className="flex-1 flex flex-col items-center justify-center p-8 gap-3">
                <span className="text-xs tracking-widest text-[#a68c6d] font-semibold mb-2">AKAD NIKAH</span>
                <span className="text-2xl md:text-3xl font-bold serif text-[#5c4634] mb-1">Jum&apos;at, 1 Agustus 2025</span>
                <span className="text-lg font-serif text-[#5c4634] mb-1">Jam 13:00 - selesai</span>
                <span className="text-base font-serif text-[#5c4634] text-center mb-4">di rumah mempelai wanita<br/>Bukit Kaciak, Rantau Simalenang, Air Haji, Kabupaten Pesisir Selatan</span>
                <span className="text-xs tracking-widest text-[#a68c6d] font-semibold mb-2">RESEPSI 1</span>
                <span className="text-2xl md:text-3xl font-bold serif text-[#5c4634] mb-1">Sabtu, 2 Agustus 2025</span>
                <span className="text-lg font-serif text-[#5c4634] mb-1">Jam 10:00 - selesai</span>
                <span className="text-base font-serif text-[#5c4634] text-center">di rumah mempelai wanita<br/>Bukit Kaciak, Rantau Simalenang, Air Haji, Kabupaten Pesisir Selatan</span>
              </div>
              {/* Garis pemisah vertikal */}
              <div className="hidden md:flex w-px bg-[#e2d6c2] mx-2 my-8"></div>
              {/* Kolom kanan: Resepsi 2 (di rumah pria) */}
              <div className="flex-1 flex flex-col items-center justify-center p-8 gap-3">
                <span className="text-xs tracking-widest text-[#a68c6d] font-semibold mb-2">RESEPSI 2</span>
                <span className="text-2xl md:text-3xl font-bold serif text-[#5c4634] mb-1">Sabtu, 9 Agustus 2025</span>
                <span className="text-lg font-serif text-[#5c4634] mb-1">Jam 10:00 - selesai</span>
                <span className="text-base font-serif text-[#5c4634] text-center">di rumah mempelai laki-laki<br/>Koto Pulai, Barung Barung Belantai, Pesisir Selatan</span>
              </div>
            </div>
          </section>

          {/* Section RSVP (Reservation) */}
          <section className="w-full py-16 px-2 bg-[#f7f0e9] flex flex-col items-center" id="rsvp">
            <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white/70 rounded-3xl shadow-xl overflow-hidden">
              {/* Kiri: Gambar pasangan menikah */}
              <div className="flex-1 flex items-center justify-center p-0 md:p-8 bg-[#f3ede7]" data-aos="fade-right">
                <div className="w-full h-80 md:h-full flex items-end">
                  <img src="/images/rsvp.jpeg" alt="Pasangan Menikah" className="object-cover w-full h-80 md:h-[28rem] rounded-bl-[4rem]" style={{ objectPosition: 'center top' }} />
                </div>
              </div>
              {/* Kanan: Form RSVP */}
              <div className="flex-1 flex flex-col justify-center p-8" data-aos="fade-left">
                <h3 className="text-2xl md:text-3xl font-bold italic serif mb-6 text-[#5c4634]">Reservasi <span className="not-italic">(RSVP)</span></h3>
                <form className="flex flex-col gap-4" onSubmit={e => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const nama = form.nama.value;
                  const wa = form.wa.value;
                  const alamat = form.alamat.value;
                  const hadir = form.hadir.value;
                  const tujuan = form.tujuan.value;
                  const nomor = tujuan === 'cewek' ? '6285377291952' : '6283145300040';
                  const pesan = `Halo, saya ingin konfirmasi kehadiran untuk undangan pernikahan.\n\nNama: ${nama}\nNo. WA: ${wa}\nAlamat/Instansi: ${alamat}\nKehadiran: ${hadir === 'ya' ? 'Hadir' : 'Tidak Hadir'}`;
                  const url = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;
                  window.open(url, '_blank');
                }} autoComplete="off">
                  <input name="nama" type="text" placeholder="Nama Lengkap*" className="border border-pink-200 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300 font-serif text-[#5c4634] bg-white/90" required />
                  <input name="wa" type="text" placeholder="No. WhatsApp*" className="border border-pink-200 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300 font-serif text-[#5c4634] bg-white/90" required />
                  <input name="alamat" type="text" placeholder="Alamat / Instansi" className="border border-pink-200 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300 font-serif text-[#5c4634] bg-white/90" />
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-sm font-semibold text-[#a68c6d] mb-1">Akan hadir?</span>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input type="radio" name="hadir" value="ya" className="appearance-none w-5 h-5 border-2 border-pink-300 rounded-full checked:border-pink-500 checked:ring-2 checked:ring-pink-400 focus:outline-none transition-all" required />
                        <span className="ml-2 text-[#5c4634] font-serif">Ya, saya akan hadir</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input type="radio" name="hadir" value="tidak" className="appearance-none w-5 h-5 border-2 border-pink-300 rounded-full checked:border-pink-500 checked:ring-2 checked:ring-pink-400 focus:outline-none transition-all" />
                        <span className="ml-2 text-[#5c4634] font-serif">Maaf, tidak bisa hadir</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-sm font-semibold text-[#a68c6d] mb-1">Kirim RSVP ke:</span>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input type="radio" name="tujuan" value="cewek" className="appearance-none w-5 h-5 border-2 border-pink-300 rounded-full checked:border-pink-500 checked:ring-2 checked:ring-pink-400 focus:outline-none transition-all" required />
                        <span className="ml-2 text-[#5c4634] font-serif">Mempelai Wanita</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input type="radio" name="tujuan" value="cowok" className="appearance-none w-5 h-5 border-2 border-pink-300 rounded-full checked:border-pink-500 checked:ring-2 checked:ring-pink-400 focus:outline-none transition-all" />
                        <span className="ml-2 text-[#5c4634] font-serif">Mempelai Pria</span>
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="mt-6 bg-black text-white rounded-lg py-4 font-bold text-lg tracking-widest uppercase transition duration-400 ease-in-out hover:bg-gray-900 focus:outline-none">KIRIM RESPON ANDA</button>
                </form>
              </div>
            </div>
          </section>

          {/* Section Lokasi Undangan Pernikahan */}
          <section className="w-full py-16 px-2 bg-[#f7f0e9] flex flex-col items-center" data-aos="fade-up">
            <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8">
              {/* Kiri: Lokasi Mempelai Wanita */}
              <div className="flex-1 flex flex-col items-center">
                <h3 className="text-xl md:text-2xl font-bold serif mb-4 text-[#5c4634] text-center">Lokasi Keluarga Mempelai Wanita</h3>
                <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg bg-white/80 p-2">
                  <iframe
                    src="https://www.google.com/maps?q=Bukit+Kaciak,+Rantau+Simalenang,+Air+Haji,+Pesisir+Selatan&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi Mempelai Wanita"
                  ></iframe>
                </div>
              </div>
              {/* Kanan: Lokasi Mempelai Pria */}
              <div className="flex-1 flex flex-col items-center">
                <h3 className="text-xl md:text-2xl font-bold serif mb-4 text-[#5c4634] text-center">Lokasi Keluarga Mempelai Pria</h3>
                <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg bg-white/80 p-2">
                  <iframe
                    src="https://www.google.com/maps?q=Koto+Pulai,+Barung+Barung+Belantai,+Pesisir+Selatan&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi Mempelai Pria"
                  ></iframe>
                </div>
              </div>
            </div>
          </section>

          {/* Section Send Your Gift */}
          <SendGiftSection />

          {/* Section Wishes */}
          <WishesSection />

          {/* Section Closing */}
          <ClosingSection />
        </main>
        <footer className="text-center text-xs text-gray-400 py-6">&copy; 2025 AditiaNovirman. Dibuat dengan cinta.</footer>
        {/* Scroll hint animasi panah ke bawah setelah undangan dibuka */}
       
      </div>
      {opened && (
        <button
          onClick={handleAudioToggle}
          className="fixed top-4 right-4 z-[100] bg-white/80 rounded-full shadow-lg p-3 flex items-center justify-center hover:bg-white transition"
          title={audioPlaying ? "Pause Musik" : "Putar Musik"}
        >
          {audioPlaying ? (
            <svg className="w-6 h-6 text-[#b08968]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="2"/><rect x="14" y="4" width="4" height="16" rx="2"/></svg>
          ) : (
            <svg className="w-6 h-6 text-[#b08968]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21 5,3"/></svg>
          )}
        </button>
      )}
    </div>
  );
}

// Komponen Section Send Your Gift dengan interaksi radio button
function SendGiftSection() {
  const [mode, setMode] = useState<'transfer' | 'gift'>('transfer');
  return (
    <section className="w-full py-16 px-2 bg-[#1a1a1a] flex flex-col items-center" data-aos="fade-up">
      <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-xl">
        {/* Kolom Kiri */}
        <div className="flex-1 bg-[#1a1a1a] text-white flex flex-col justify-center p-8 gap-6">
          <h2 className="text-3xl md:text-4xl font-bold serif mb-6 text-white">Ucapan & Doa</h2>
          <p className="text-base md:text-lg text-gray-200 mb-4">Catatan kado atau kata kata terimakasih untuk yang memberikan hadiah, di menu (Amplop digital)</p>
          <div className="flex flex-col gap-4">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="radio"
                name="giftmode"
                value="transfer"
                checked={mode === 'transfer'}
                onChange={() => setMode('transfer')}
                className="appearance-none w-4 h-4 rounded-full border-2 border-red-500 bg-white checked:bg-red-500 checked:border-red-500 focus:outline-none mt-1 transition-all"
              />
              <span className="mt-1 w-4 h-4 rounded-full bg-red-500 inline-block shadow-md border-2 border-red-500" style={{ boxShadow: mode === 'transfer' ? '0 0 0 4px #f87171' : undefined }}></span>
              <div>
                <span className="font-bold serif text-lg">Direct Transfer</span>
                <div className="text-sm text-gray-300">Transfer directly to the account listed</div>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="radio"
                name="giftmode"
                value="gift"
                checked={mode === 'gift'}
                onChange={() => setMode('gift')}
                className="appearance-none w-4 h-4 rounded-full border-2 border-pink-300 bg-white checked:bg-white checked:border-pink-500 focus:outline-none mt-1 transition-all"
              />
              <span className="mt-1 w-4 h-4 rounded-full bg-white inline-block shadow-md border-2 border-pink-300" style={{ boxShadow: mode === 'gift' ? '0 0 0 4px #f9a8d4' : undefined }}></span>
              <div>
                <span className="font-bold serif text-lg text-white">Send Gift</span>
                <div className="text-sm text-gray-300">Send gifts to the address listed</div>
              </div>
            </label>
          </div>
        </div>
        {/* Kolom Kanan */}
        <div className="flex-1 bg-[#1a1a1a] text-white flex flex-col justify-center p-8 gap-4 border-t md:border-t-0 md:border-l border-[#333]">
          {mode === 'transfer' ? (
            <>
              <div className="mb-4">
                <span className="font-serif text-lg text-gray-200">Transfer directly to the account below:</span>
              </div>
              <div className="flex flex-col gap-6">
                {/* Rekening 1 */}
                <div>
                  <div className="font-serif text-base text-gray-300">BANK BRI</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl md:text-3xl font-bold tracking-wide select-all">548601043208537</span>
                    <button type="button" className="focus:outline-none" onClick={() => navigator.clipboard.writeText('548601043208537')} title="Copy">
                      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="4" y="6" width="12" height="10" rx="2" fill="#fff" fillOpacity="0.2"/><rect x="6" y="4" width="10" height="10" rx="2" stroke="#fff" strokeWidth="1.5"/></svg>
                    </button>
                  </div>
                  <div className="text-sm text-gray-400">A/N GERY AFRIA IRMAN</div>
                </div>
                {/* Rekening 2 */}
                <div>
                  <div className="font-serif text-base text-gray-300">BANK BRI</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl md:text-3xl font-bold tracking-wide select-all">5478 0101 9328 530</span>
                    <button type="button" className="focus:outline-none" onClick={() => navigator.clipboard.writeText('5478 0101 9328 530')} title="Copy">
                      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="4" y="6" width="12" height="10" rx="2" fill="#fff" fillOpacity="0.2"/><rect x="6" y="4" width="10" height="10" rx="2" stroke="#fff" strokeWidth="1.5"/></svg>
                    </button>
                  </div>
                  <div className="text-sm text-gray-400">A/N SISI MONA FITRI</div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4 items-center justify-center h-full w-full">
              <div className="mb-2 font-serif text-lg text-gray-200">Kirim hadiah ke alamat berikut:</div>
              <div className="bg-white/10 rounded-xl p-6 text-center w-full max-w-md mx-auto">
                <div className="font-bold text-lg text-white mb-2">Alamat Pengiriman Hadiah</div>
                <div className="text-base text-gray-200 mb-2">
                  <b>Untuk mempelai wanita:</b><br />
                  Bukit Kaciak, Rantau Simalenang, Air Haji, Kabupaten Pesisir Selatan<br /><br />
                  <b>Untuk mempelai pria:</b><br />
                  Koto Pulai, Barung Barung Belantai, Pesisir Selatan
                </div>
                <div className="text-xs text-gray-400 mt-2">*Mohon konfirmasi pengiriman ke WhatsApp mempelai</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Komponen Section Wishes
function WishesSection() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Supabase client
  const supabase = createClient(
    'https://uatbllwdtjtbgtraqxmw.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhdGJsbHdkdGp0Ymd0cmFxeG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3Mjg0MDcsImV4cCI6MjA2NzMwNDQwN30.mRNAop44hKzeqflo6HSyzBxpV9ZmbvT_UNR9r4OFUK8'
  );

  // Ambil wishes dari Supabase saat mount
  useEffect(() => {
    const fetchWishes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setWishes((data as SupabaseWish[]).map((w) => ({
          name: w.name,
          address: w.address,
          message: w.message,
          time: new Date(w.created_at).getTime(),
        })));
      }
      setLoading(false);
    };
    fetchWishes();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError('Full Name and Message are required.');
      return;
    }
    setError('');
    setLoading(true);
    const { error } = await supabase.from('wishes').insert({
      name: name.trim(),
      address: address.trim(),
      message: message.trim(),
    });
    if (error) {
      setError('Gagal mengirim ucapan. Coba lagi nanti.');
    } else {
      // Ambil ulang wishes setelah insert
      const { data } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) {
        setWishes((data as SupabaseWish[]).map((w) => ({
          name: w.name,
          address: w.address,
          message: w.message,
          time: new Date(w.created_at).getTime(),
        })));
      }
      setName('');
      setAddress('');
      setMessage('');
    }
    setLoading(false);
  }

  return (
    <section className="w-full py-16 px-2 bg-[#f7f0e9] flex flex-col items-center" data-aos="fade-up">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        {/* Kiri: Form Input */}
        <div className="flex-1 bg-white/80 rounded-3xl shadow-xl p-8 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold serif mb-6 text-[#5c4634]">Ucapan & Doa</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
            <input
              type="text"
              placeholder="Nama Lengkap*"
              className="border border-[#e5dad1] rounded px-4 py-3 font-serif text-[#5c4634] bg-[#f7f0e9] placeholder:text-[#b8a99a] focus:outline-none focus:ring-2 focus:ring-pink-200"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Alamat / Kota / Instansi"
              className="border border-[#e5dad1] rounded px-4 py-3 font-serif text-[#5c4634] bg-[#f7f0e9] placeholder:text-[#b8a99a] focus:outline-none focus:ring-2 focus:ring-pink-200"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
            <textarea
              placeholder="Ucapan (misal: selamat atas pernikahannya)*"
              className="border border-[#e5dad1] rounded px-4 py-3 font-serif text-[#5c4634] bg-[#f7f0e9] placeholder:text-[#b8a99a] focus:outline-none focus:ring-2 focus:ring-pink-200 min-h-[96px] resize-none"
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
            {error && <div className="text-red-500 text-sm font-semibold">{error}</div>}
            <button
              type="submit"
              className="mt-2 bg-black text-[#f7f0e9] rounded-lg py-3 font-bold text-lg uppercase tracking-wider transition duration-400 ease-in-out hover:bg-gray-900 focus:outline-none"
              disabled={loading}
            >
              {loading ? 'MENGIRIM...' : 'KIRIM SEKARANG'}
            </button>
          </form>
        </div>
        {/* Kanan: Daftar Ucapan */}
        <div className="flex-1 flex flex-col gap-4 max-h-[32rem] overflow-y-auto pr-2">
          {loading ? (
            <div className="text-[#b8a99a] font-serif italic text-center mt-12">Memuat ucapan...</div>
          ) : wishes.length === 0 ? (
            <div className="text-[#b8a99a] font-serif italic text-center mt-12">Belum ada ucapan, jadilah yang pertama!</div>
          ) : (
            wishes.map((wish, idx) => (
              <div key={wish.time + '-' + idx} className="bg-[#E5DAD1] rounded-xl p-5 shadow font-serif text-[#5c4634]">
                <div className="text-lg md:text-xl italic mb-2">“{wish.message}”</div>
                <div className="text-sm text-right font-semibold mt-2">
                  {wish.name}{wish.address ? <span className="text-[#a68c6d]"> &middot; {wish.address}</span> : ''}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

type Wish = {
  name: string;
  address: string;
  message: string;
  time: number;
};

type SupabaseWish = {
  name: string;
  address: string;
  message: string;
  created_at: string;
};

function ClosingSection() {
  return (
    <section className="w-full py-0 px-0 bg-[#1E1E1E] flex flex-col items-center" data-aos="fade-in">
      <div className="w-full max-w-5xl flex flex-col md:flex-row min-h-[28rem] rounded-3xl overflow-hidden shadow-xl">
        {/* Kiri: Gambar pasangan */}
        <div className="relative flex-1 min-h-[18rem] md:min-h-[28rem] h-full">
          <img
            src="/images/slide1.jpeg"
            alt="Pasangan di pantai"
            className="w-full h-full object-cover object-center min-h-[18rem] md:min-h-[28rem]"
            style={{ minHeight: '100%' }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        {/* Kanan: Teks penutup */}
        <div className="flex-1 flex flex-col justify-center items-center bg-[#1E1E1E] p-8 md:p-12 gap-8 text-white">
          {/* Ucapan Terima Kasih */}
          <div className="text-base md:text-lg font-serif text-gray-200 text-center max-w-lg">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila, Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.<br />
            Terima kasih atas kehadiran dan doa restunya.
          </div>
          {/* Daftar Tamu */}
          <div className="w-full">
            <div className="text-lg md:text-xl font-bold serif mb-2 text-white">Turut Mengundang:</div>
            <ul className="list-disc list-inside text-base font-serif text-gray-300 pl-2">
              <li>Keluarga Besar Bapak Irman</li>
              <li>Keluarga Besar Zainal</li>
            
            </ul>
          </div>
          {/* Ucapan Penutup & Logo */}
          <div className="flex flex-col items-center mt-4">
            <div className="text-3xl md:text-5xl font-bold serif tracking-wide mb-4">Terima Kasih</div>
            <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-2xl md:text-3xl font-bold tracking-widest text-white">G&S</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
