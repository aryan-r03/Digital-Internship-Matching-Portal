import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';

import { Home } from './pages/Home.js';
import { Opportunities } from './pages/Opportunities.js';
import { OpportunityDetail } from './pages/OpportunityDetail.js';
import { Dashboard } from './pages/Dashboard.js';
import { Profile } from './pages/Profile.js';
import { NotFound } from './pages/NotFound.js';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-manga-bg text-manga-text selection:bg-manga-accent selection:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/opportunities/:id" element={<OpportunityDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
