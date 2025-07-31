
import type { SVGProps } from 'react';

export function ChemistryIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M21 9a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2Z" />
      <path d="M7 21a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H5" />
      <path d="M12 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="m11.5 2.5.9-1" />
      <path d="m12.5 2.5-.9-1" />
      <path d="m15.5 2.5.9-1" />
      <path d="m14.5 2.5-.9-1" />
    </svg>
  );
}
