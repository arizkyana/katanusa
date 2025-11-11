import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-[#2A754B]">
          Nusadaya
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-600 hover:text-[#2A754B] transition-colors">Beranda</Link>
          <Link to="/pakar" className="text-gray-600 hover:text-[#2A754B] transition-colors">Pakar</Link>
          <a href="#" className="text-gray-600 hover:text-[#2A754B] transition-colors">Tentang Kami</a>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="hidden md:block text-gray-600 hover:text-[#2A754B] transition-colors">Masuk</button>
          <button className="bg-[#2A754B] text-white px-5 py-2 rounded-full hover:bg-opacity-90 transition-all font-medium">
            Daftar
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;