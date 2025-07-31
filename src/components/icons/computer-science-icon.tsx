
import type { SVGProps } from 'react';

export function ComputerScienceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="12" x="3" y="4" rx="2" />
      <line x1="2" x2="22" y1="20" y2="20" />
      <path d="M8 20v-4" />
      <path d="M16 20v-4" />
      <path d="m7 12-4-2.5 4-2.5" />
      <path d="m17 12 4-2.5-4-2.5" />
    </svg>
  );
}
