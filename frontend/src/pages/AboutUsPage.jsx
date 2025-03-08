import React from 'react';
import PageWrapper from '../components/PageWrapper';

const AboutUsPage = () => {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="max-w-2xl text-center text-lg">
          Welcome to MarketWhisperer, your AI-powered guide to navigating the stock market. Our mission is to simplify investing for everyone, providing insights and tools that are both powerful and easy to use. Whether you're a seasoned investor or just starting out, MarketWhisperer is here to help you make informed decisions and grow your portfolio with confidence.
        </p>
      </div>
    </PageWrapper>
  );
};

export default AboutUsPage; 