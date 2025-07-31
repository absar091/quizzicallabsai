
import type { SVGProps } from 'react';

export function EnglishIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M20 11v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" />
      <path d="M4 9V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
      <path d="m12 15-3-3 3-3" />
      <path d="M9 12h7" />
    </svg>
  );
}
