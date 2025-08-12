import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import ResumeUpload from './pages/ResumeUpload';
import JobMatching from './pages/JobMatching';
import SkillsAnalysis from './pages/SkillsAnalysis';
import SkillSuggestions from './pages/SkillSuggestions';
import JobTrends from './pages/JobTrends';
import MarketInsights from './pages/MarketInsights';
import { ResumeProvider } from './context/ResumeContext';
import './App.css';

// Set the base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Make it available globally
window.API_BASE_URL = API_BASE_URL;

function App() {
  return (
    <ResumeProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/resume-upload" element={<ResumeUpload />} />
              <Route path="/job-matching" element={<JobMatching />} />
              <Route path="/skills-analysis" element={<SkillsAnalysis />} />
              <Route path="/skill-suggestions" element={<SkillSuggestions />} />
              <Route path="/job-trends" element={<JobTrends />} />
              <Route path="/market-insights" element={<MarketInsights />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ResumeProvider>
  );
}

export default App;
