import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

const HomePage = () => {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* Hero Section */}
        <div className="relative flex items-center justify-center py-8">
          {/* Background overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-800"></div>
          
          {/* Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Investing Made Simple
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Explore the stock market with an AI-powered guide that keeps it beginner friendly.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold text-md transition-colors"
              >
                Sign Up
              </Link>
              <Link
                to="/about"
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-semibold text-md transition-colors"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors text-center">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="text-lg font-semibold mb-2">Smart Analysis</h3>
              <p className="text-slate-300 text-sm">
                Get AI-powered insights and analysis of market trends in plain English.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors text-center">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Personalized Learning</h3>
              <p className="text-slate-300 text-sm">
                Learn at your own pace with customized recommendations and tutorials.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors text-center">
              <div className="text-2xl mb-2">📱</div>
              <h3 className="text-lg font-semibold mb-2">Easy Tracking</h3>
              <p className="text-slate-300 text-sm">
                Monitor your watchlist and get real-time updates on your investments.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-slate-900 py-12 w-full">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-lg text-slate-300 mb-6">
              Join thousands of investors who are already using Market Whisperers to make smarter investment decisions.
            </p>
            <Link
              to="/signup"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold text-md transition-colors"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default HomePage;
