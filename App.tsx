import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import ExpertProfilePage from './components/ExpertProfilePage';
import ChatPage from './components/ChatPage';
import AllExpertsPage from './components/AllExpertsPage';
import { EXPERTS } from './constants';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-[#F9FAF5] text-[#1E1E1E]">
        <Header />
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage experts={EXPERTS} />} />
            <Route path="/pakar" element={<AllExpertsPage />} />
            <Route 
              path="/expert/:expertId" 
              element={<ExpertProfilePage />} 
            />
             <Route 
              path="/expert/:expertId/chat" 
              element={<ChatPage />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};


export default App;
