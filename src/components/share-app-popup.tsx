'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Share2 } from 'lucide-react';
import { Copy } from 'lucide-react';
import { Check } from 'lucide-react';

interface ShareAppPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareAppPopup({ isOpen, onClose }: ShareAppPopupProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const shareUrl = 'https://quizzicallabs.ai';
  const shareText = 'Check out Quizzicallabs AI - Your ultimate AI-powered study partner! Generate custom quizzes, practice questions, and study guides instantly. 🚀';

  const copyToClipboard = async () => {
    if (!mounted) return;
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      color: 'bg-green-500'
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-600'
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-sky-500'
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-700'
    }
  ];

  if (!isOpen || !mounted) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-6">
          <Share2 className="mx-auto mb-3 text-blue-600" size={32} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Share Quizzicallabs AI</h3>
          <p className="text-gray-600 text-sm">Help your friends discover the ultimate AI study partner!</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {shareOptions.map((option) => (
            <a
              key={option.name}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${option.color} text-white p-3 rounded-lg text-center font-medium hover:opacity-90 transition-opacity`}
            >
              {option.name}
            </a>
          ))}
        </div>

        <button
          onClick={copyToClipboard}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}