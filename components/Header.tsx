
import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="bg-teal-600 text-white p-4 shadow-md sticky top-0 z-20">
      <div className="container mx-auto flex items-center">
        <img src="https://picsum.photos/40/40?random=1" alt="Agent Avatar" className="w-10 h-10 rounded-full mr-3 border-2 border-white"/>
        <div>
            <h1 className="text-xl font-semibold">Gemini Agent</h1>
            <p className="text-xs text-teal-100">Online</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
