import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { EXPERTS } from '../constants';

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#2A754B]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
);

const MessageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm1.707 2.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 9.586 3.707 7.293z" /></svg>
);


const ExpertProfilePage: React.FC = () => {
  const { expertId } = useParams<{ expertId: string }>();
  const expert = EXPERTS.find(e => e.id === expertId);

  if (!expert) {
    return <div className="text-center py-20">Pakar tidak ditemukan.</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12 md:py-20 max-w-4xl">
      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
          <div className="relative mb-6 md:mb-0 md:mr-8 flex-shrink-0">
            <img 
              src={expert.avatarUrl} 
              alt={expert.name}
              className="w-40 h-40 rounded-full object-cover border-4 border-[#FDF8E8]"
            />
            <div className="absolute bottom-2 right-2 bg-yellow-400 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zM9 11a1 1 0 112 0v1a1 1 0 11-2 0v-1zm1-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{expert.name}</h1>
            <p className="text-xl font-semibold text-[#2A754B] mt-1">{expert.title}</p>
            <p className="text-md text-gray-500 mt-2">{expert.experience}</p>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Tentang Pakar</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">{expert.bio}</p>
        </div>

        <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-800">Keahlian</h2>
            <div className="mt-4 flex flex-wrap gap-3">
                {expert.specialties.map(skill => (
                    <span key={skill} className="bg-[#FDF8E8] text-[#D59A1D] px-4 py-2 rounded-full text-sm font-medium border border-[#EFE5C6]">
                        {skill}
                    </span>
                ))}
            </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row gap-4">
            <Link 
                to={`/expert/${expert.id}/chat`}
                className="w-full flex items-center justify-center bg-white text-[#2A754B] px-6 py-3 rounded-full font-semibold text-lg border-2 border-[#2A754B] hover:bg-[#EAF4EF] transition-all"
            >
                <LocationIcon />
                Tanya Asisten AI Saya (Gratis)
            </Link>
            <button 
                onClick={() => alert('Fitur premium ini akan segera tersedia!')}
                className="w-full flex items-center justify-center bg-[#2A754B] text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-opacity-90 transition-all"
            >
                <MessageIcon />
                Pesan Sesi Konsultasi (Premium)
            </button>
        </div>

      </div>
    </div>
  );
};

export default ExpertProfilePage;
