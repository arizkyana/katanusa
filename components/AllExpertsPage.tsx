import React, { useState, useMemo } from 'react';
import { EXPERTS } from '../constants';
import ExpertCard from './ExpertCard';

const SearchIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const AllExpertsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const allCategories = useMemo(() => {
        const categories = new Set<string>();
        EXPERTS.forEach(expert => {
            expert.specialties.forEach(specialty => categories.add(specialty));
        });
        return ['Semua Kategori', ...Array.from(categories).sort()];
    }, []);

    const filteredExperts = useMemo(() => {
        return EXPERTS.filter(expert => {
            const matchesCategory = selectedCategory && selectedCategory !== 'Semua Kategori'
                ? expert.specialties.includes(selectedCategory) 
                : true;

            const matchesSearch = searchTerm.trim().toLowerCase()
                ? expert.name.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
                  expert.title.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
                  expert.specialties.some(s => s.toLowerCase().includes(searchTerm.trim().toLowerCase()))
                : true;
                
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, selectedCategory]);
    
    return (
        <div className="flex-grow">
            {/* Header Section */}
            <section className="bg-white pt-16 pb-12">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1E2A23]">Direktori Pakar Budaya</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Cari dan temukan ahli budaya yang sesuai dengan minat dan kebutuhan Anda dari seluruh Indonesia.
                    </p>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="sticky top-[72px] bg-[#F9FAF5]/80 backdrop-blur-md z-30 py-6 border-b border-gray-200">
                <div className="container mx-auto px-6">
                    <div className="relative max-w-xl mx-auto">
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama, keahlian, atau bidang..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#2A754B] focus:border-transparent transition"
                        />
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                    </div>
                     <div className="mt-6 flex justify-center flex-wrap gap-2">
                        {allCategories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category === 'Semua Kategori' ? null : category)}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                                    (selectedCategory === category || (!selectedCategory && category === 'Semua Kategori'))
                                        ? 'bg-[#2A754B] text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experts Grid */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                     <p className="text-center text-gray-600 mb-10">
                        Menampilkan <span className="font-bold text-[#1E2A23]">{filteredExperts.length}</span> dari <span className="font-bold text-[#1E2A23]">{EXPERTS.length}</span> pakar.
                    </p>
                    {filteredExperts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                            {filteredExperts.map(expert => (
                                <ExpertCard key={expert.id} expert={expert} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <h3 className="text-2xl font-semibold text-gray-800">Pakar Tidak Ditemukan</h3>
                            <p className="mt-2 text-gray-500">Coba ubah kata kunci pencarian atau filter kategori Anda.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AllExpertsPage;
