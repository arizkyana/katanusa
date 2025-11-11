
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1E2A23] text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white">Nusadaya</h3>
            <p className="mt-4 text-gray-300">
              Menghubungkan Anda dengan kekayaan budaya Indonesia melalui para ahli.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg">Navigasi</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Beranda</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Pakar</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Tentang Kami</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg">Legal</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Kebijakan Privasi</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Syarat & Ketentuan</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Kontak</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg">Hubungi Kami</h4>
             <button className="mt-4 bg-[#2A754B] text-white px-5 py-2 rounded-full hover:bg-opacity-90 transition-all font-medium">
              Hubungi Kami
            </button>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Nusadaya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;