
import React from 'react';

const GalleryBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#fdfcfb]">
      {/* Soft Paper Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')` }} />
      
      {/* Elegant Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-50/40 rounded-full blur-[120px]" />
      
      {/* Subtle Moving Grain */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-multiply pointer-events-none animate-[pulse_5s_infinite]">
        <div className="w-full h-full bg-slate-900" />
      </div>
    </div>
  );
};

export default GalleryBackground;
