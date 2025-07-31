import * as React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  const id = React.useId();

  return (
    <svg
      viewBox="0 0 160 52"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-auto", className)}
      aria-label="Quizzicallabs AI Logo"
    >
      <defs>
        <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#A7F3D0', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#0D9488', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Q with lightbulb */}
      <path
        d="M26 2C12.745 2 2 12.745 2 26s10.745 24 24 24c5.96 0 11.405-2.17 15.65-5.75l-7.3-7.3C35.52 39.78 31.02 42 26 42c-8.837 0-16-7.163-16-16S17.163 10 26 10c8.837 0 16 7.163 16 16 0 2.21-.45 4.31-1.25 6.25l7.3 7.3C50.11 35.8 52 31.09 52 26 52 12.745 40.255 2 26 2zM38.82 45.17l-4.24-4.24L45.17 30.34l4.24 4.24L38.82 45.17z"
        fill="white"
      />
      <path
        d="M26 15c-3.866 0-7 3.134-7 7v1c0 1.34.42 2.58 1.15 3.63.15.22.32.42.5.61.53.56 1.17.98 1.85 1.26v2.5h7v-2.5c.68-.28 1.32-.7 1.85-1.26.18-.19.35-.39.5-.61C32.58 25.58 33 24.34 33 23v-1c0-3.866-3.134-7-7-7zm0 2c2.76 0 5 2.24 5 5v1c0 .75-.22 1.44-.6 2.02-.38.58-.93 1.05-1.57 1.35l-.83.4v2.23h-4v-2.23l-.83-.4c-.64-.3-1.19-.77-1.57-1.35-.38-.58-.6-1.27-.6-2.02v-1c0-2.76 2.24-5 5-5z"
        fill="white"
      />
      
      {/* A */}
      <path
        d="M68.64 50L84 2h4.72l15.36 48h-5.04L94.2 36.8h-23.6L65.76 50H60.72l15.36-48h4.72L68.64 50zM83.4 8.72L74.88 32.48h17.04L83.4 8.72z"
        fill={`url(#gradient-${id})`}
      />
      
      {/* I */}
      <path
        d="M108 2h5.04v48H108V2z"
        fill={`url(#gradient-${id})`}
      />
    </svg>
  );
}
