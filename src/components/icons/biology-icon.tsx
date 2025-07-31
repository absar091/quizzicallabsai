
import type { SVGProps } from 'react';

export function BiologyIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M14.5 2.5a2.5 2.5 0 0 0-3 0l-6 6a4.95 4.95 0 0 0 7 7l6-6a2.5 2.5 0 0 0 0-3l-4.5-4.5Z" />
      <path d="m20 10-4.5 4.5" />
      <path d="m9.5 13.5 4.5-4.5" />
      <path d="m14.5 18.5 4-4" />
      <path d="m5 10 4-4" />
    </svg>
  );
}
