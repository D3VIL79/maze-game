import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Upload, Users, TrendingUp, FileText, Lightbulb, Briefcase, CheckCircle } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const Navbar = () => {
  const location = useLocation();
  const { resumeAnalysis } = useResume();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/trends', label: 'Job Trends', icon: TrendingUp },
    { path: '/upload', label: 'Resume Upload', icon: Upload },
    { path: '/matching', label: 'Job Matching', icon: Users },
    { path: '/skills', label: 'Skills Analysis', icon: FileText },
    { path: '/suggestions', label: 'Skill Suggestions', icon: Lightbulb },
    { path: '/builder', label: 'Resume Builder', icon: Briefcase },
    { path: '/insights', label: 'Market Insights', icon: TrendingUp }
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">JobTrend Analyzer</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                    {resumeAnalysis && item.path === '/upload' && (
                      <CheckCircle className="w-3 h-3 ml-1 text-green-600" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-600 hover:text-gray-900 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
