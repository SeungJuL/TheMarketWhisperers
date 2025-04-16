import React from "react";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { useNavigate } from "react-router-dom";

const HomePage = ({ user }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <PageWrapper>
      <div className="relative min-h-screen w-full flex flex-col">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(15, 23, 42, 0.85), 
                rgba(15, 23, 42, 0.85)
              ), 
              url("/backgroundhome.png")
            `,
            backgroundBlendMode: "overlay",
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          {/* Hero Section */}
          <div className="max-w-6xl flex items-center justify-center py-8 min-h-[30vh] mt-20 w-full">
            {/* Hero Content */}
            <div className="relative text-center px-20">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight animate-fadeIn mt-20 text-white">
                Investing Made Simple
              </h1>
              <p className="text-base md:text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
                Explore the stock market with an AI-powered guide that keeps it
                beginner friendly.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {/* Only show Sign Up if user is NOT logged in */}
                {!user && (
                  <Link
                    to="/signup"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold text-base transition-colors flex items-center justify-center gap-1"
                  >
                    Sign Up
                  </Link>
                )}

                <Link
                  to="/about"
                  className="bg-slate-600 hover:bg-slate-800 text-white px-6 py-2 rounded-md font-semibold text-base transition-colors flex items-center justify-center gap-1"
                >
                  About Us
                </Link>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Feature 1 */}
              <div className="bg-opacity-0 backdrop-blur-lg rounded-2xl shadow-md p-4 border border-white/20 rounded-lg text-center">
                <div className="text-xl mb-1">📊</div>
                <h3 className="text-base font-semibold mb-1 text-white">
                  Smart Analysis
                </h3>
                <p className="text-white text-xs">
                  Get AI-powered insights and analysis of market trends in plain
                  English.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-opacity-0 backdrop-blur-lg rounded-2xl shadow-md p-4 border border-white/20 rounded-lg text-center">
                <div className="text-xl mb-1">🎯</div>
                <h3 className="text-base font-semibold mb-1 text-white">
                  Personalized Learning
                </h3>
                <p className="text-white text-xs">
                  Learn at your own pace with customized recommendations and
                  tutorials.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-opacity-0 backdrop-blur-lg rounded-2xl shadow-md p-4 border border-white/20 rounded-lg text-center">
                <div className="text-xl mb-1">📱</div>
                <h3 className="text-base font-semibold mb-1 text-white">
                  Easy Tracking
                </h3>
                <p className="text-white text-xs">
                  Monitor your watchlist and get real-time updates on your
                  investments.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="bg-opacity-0 backdrop-blur-lg rounded-2xl shadow-md p-4 border border-white/20 rounded-lg text-center py-8 w-full mt-8">
            <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-white">
                Ready to Start Your Investment Journey?
              </h2>
              <p className="text-base text-slate-300 mb-4">
                Join thousands of investors who are already using Market
                Whisperers to make smarter investment decisions.
              </p>
              <button
                onClick={handleGetStarted}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default HomePage;
