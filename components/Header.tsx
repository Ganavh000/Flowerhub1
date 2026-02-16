
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-[#F5F5F4]/80 backdrop-blur-md border-b border-[#B76E79]/20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#B76E79] rounded-full flex items-center justify-center text-white font-serif text-xl">
            F
          </div>
          <h1 className="text-2xl font-serif tracking-widest text-[#2D2D2D]">FLOWERHUB</h1>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium tracking-widest text-[#2D2D2D]/70">
          <a href="#" className="hover:text-[#B76E79] transition-colors">COLLECTIONS</a>
          <a href="#try-on" className="hover:text-[#B76E79] transition-colors">VIRTUAL TRY-ON</a>
          <a href="#" className="hover:text-[#B76E79] transition-colors">BOUTIQUES</a>
          <a href="#" className="hover:text-[#B76E79] transition-colors">OUR STORY</a>
        </nav>
        <button className="bg-[#B76E79] text-white px-6 py-2 rounded-full text-xs font-bold tracking-widest hover:bg-[#A65D68] transition-all shadow-lg shadow-[#B76E79]/20">
          SHOP NOW
        </button>
      </div>
    </header>
  );
};

export default Header;
