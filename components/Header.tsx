import React from 'react';

const Header: React.FC = () => {
  const backgroundUrl = 'https://i.ibb.co/2Y58PzKx/c88109504938c691e5169f508b94c9c2.jpg';
  
  return (
    <header 
        className="shadow-lg relative bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${backgroundUrl})`, 
          backgroundColor: '#cccccc' // Fallback color
        }}
    >
      {/* Semi-transparent overlay to ensure text is readable */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div className="container mx-auto text-center py-20 md:py-28 relative z-10 text-white">
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)' }}
        >
          ইরা গার্ডেন
        </h1>
        <p 
          className="mt-3 text-lg md:text-xl lg:text-2xl opacity-95"
          style={{ textShadow: '1px 1px 6px rgba(0, 0, 0, 0.8)' }}
        >
          ৮/১৯/৩৮, পূর্ব নন্দীপাড়া, খিলগাঁও, ঢাকা-১২১৯
        </p>
      </div>
    </header>
  );
};

export default Header;