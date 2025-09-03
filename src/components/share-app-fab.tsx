'use client';

import { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';
import ShareAppPopup from './share-app-popup';

export default function ShareAppFAB() {
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <button
        onClick={() => setShowSharePopup(true)}
        className="fixed bottom-20 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-40"
        aria-label="Share app with friends"
      >
        <Share2 size={20} />
      </button>
      
      <ShareAppPopup 
        isOpen={showSharePopup} 
        onClose={() => setShowSharePopup(false)} 
      />
    </>
  );
}