
import type { SVGProps } from 'react';

export function AccountingIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="8" x2="16" y1="8" y2="8" />
      <line x1="8" x2="16" y1="12" y2="12" />
      <line x1="8" x2="12" y1="16" y2="16" />
    </svg>
  );
}
