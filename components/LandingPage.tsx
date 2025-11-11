import React from 'react';
import { Link } from 'react-router-dom';
import { Expert } from '../types';
import ExpertCard from './ExpertCard';

interface LandingPageProps {
  experts: Expert[];
}

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#2A754B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);
const ConnectIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#2A754B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
);
const LearnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#2A754B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
);

const LandingPage: React.FC<LandingPageProps> = ({ experts }) => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#EAF4EF] pt-20 pb-24 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E2A23] leading-tight">
            Temukan Kekayaan Budaya Indonesia <br /> Bersama Para Ahlinya
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Hubungkan diri Anda dengan para ahli budaya Indonesia untuk memperdalam pemahaman dan pengalaman Anda tentang warisan bangsa saya.
          </p>
          <button className="mt-8 bg-[#2A754B] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-opacity-90 transition-all shadow-lg">
            Jelajahi Budaya
          </button>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="p-8 bg-white rounded-lg shadow-md">
                <img src="https://i.ibb.co/3k5fH0k/plant.png" alt="Potted Plant" className="w-full h-auto object-cover rounded"/>
            </div>
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Selamat Datang di Nusadaya</h2>
                <p className="mt-4 text-gray-600 leading-relaxed">
                    Nusadaya adalah jembatan digital Anda menuju kekayaan budaya Indonesia. Kami menghubungkan Anda dengan para pakar terkemuka di berbagai bidang, mulai dari tarian, kuliner, filsafat hidup, hingga seni pertunjukan. Misi kami adalah meneruskan warisan keahlian kepada generasi masa kini dan mendatang.
                </p>
                <a href="#" className="mt-6 inline-block text-[#2A754B] font-semibold hover:underline">Pelajari Lebih Lanjut &rarr;</a>
            </div>
        </div>
      </section>
      
      {/* Experts Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Pakar Budaya Unggulan</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Temui beberapa ahli yang siap berbagi pengetahuan dan pengalaman mereka dengan Anda.
          </p>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {experts.slice(0, 4).map(expert => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>
          <div className="mt-16">
            <Link
              to="/pakar"
              className="inline-block bg-white text-[#2A754B] px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all border-2 border-[#2A754B] shadow-sm hover:shadow-md transform hover:-translate-y-1"
            >
              Lihat Semua Pakar &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Bagaimana Kami Bekerja</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6">
              <div className="bg-[#EAF4EF] p-4 rounded-full"><SearchIcon/></div>
              <h3 className="mt-4 text-xl font-bold">1. Cari Pakar</h3>
              <p className="mt-2 text-gray-600">Jelajahi direktori pakar budaya berdasarkan keahlian dan lokasi.</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="bg-[#EAF4EF] p-4 rounded-full"><ConnectIcon/></div>
              <h3 className="mt-4 text-xl font-bold">2. Hubungi & Jadwalkan</h3>
              <p className="mt-2 text-gray-600">Kirim pesan, tanyakan ketersediaan, dan mengatur sesi konsultasi.</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="bg-[#EAF4EF] p-4 rounded-full"><LearnIcon/></div>
              <h3 className="mt-4 text-xl font-bold">3. Mulai Belajar</h3>
              <p className="mt-2 text-gray-600">Dapatkan wawasan mendalam langsung dari sumbernya.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Apa Kata Mereka?</h2>
          <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-[#F9FAF5] p-8 rounded-lg text-left">
              <p className="text-gray-600 italic">"Nusadaya membuka wawasan saya tentang budaya Sunda yang sebelumnya tidak pernah saya ketahui. Platform yang luar biasa!"</p>
              <div className="flex items-center mt-4">
                <img src="https://picsum.photos/seed/rina/50" alt="Rina" className="w-12 h-12 rounded-full object-cover"/>
                <div className="ml-4">
                  <p className="font-bold">Rina, Mahasiswa</p>
                  <p className="text-sm text-gray-500">Jakarta</p>
                </div>
              </div>
            </div>
            <div className="bg-[#F9FAF5] p-8 rounded-lg text-left">
              <p className="text-gray-600 italic">"Sebagai seorang peneliti, menemukan narasumber yang kredibel itu sulit. Nusadaya sangat membantu pekerjaan saya. Terima kasih."</p>
              <div className="flex items-center mt-4">
                <img src="https://picsum.photos/seed/andra/50" alt="Andra" className="w-12 h-12 rounded-full object-cover"/>
                <div className="ml-4">
                  <p className="font-bold">Andra, Peneliti Budaya</p>
                  <p className="text-sm text-gray-500">Yogyakarta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#EAF4EF]">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800">Siap Menjelajahi Budaya Indonesia?</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                Bergabunglah dengan komunitas kami. Baik Anda seorang pelajar, pencari ilmu atau seorang pakar, Nusadaya adalah tempatnya.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
                <button className="bg-[#2A754B] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-opacity-90 transition-all shadow-lg">
                    Daftar Sekarang
                </button>
                <button className="bg-white text-[#2A754B] px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all border border-gray-300">
                    Hubungi Kami
                </button>
            </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;