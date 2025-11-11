import React from 'react';
import { Link } from 'react-router-dom';
import { Expert } from '../types';

const ExpertCard: React.FC<{ expert: Expert }> = ({ expert }) => (
  <Link to={`/expert/${expert.id}`} className="block text-center group">
    <img src={expert.avatarUrl} alt={expert.name} className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300" />
    <div className="mt-4">
        <h4 className="font-bold text-lg text-gray-800 group-hover:text-[#2A754B] transition-colors">{expert.name}</h4>
        <p className="text-gray-500 text-sm">{expert.title}</p>
    </div>
  </Link>
);

export default ExpertCard;
