
import type { SVGProps } from 'react';

export function PhysicsIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 2.5c-5.25 1.5-9.5 5.75-9.5 11.25 0 4.25 2.5 8 6 9.75" />
      <path d="M12 2.5c5.25 1.5 9.5 5.75 9.5 11.25 0 4.25-2.5 8-6 9.75" />
      <path d="M12 22.5c-5.5-1.5-8-5.5-8-9.5 0-4.5 3-8.5 7.5-9.75" />
      <path d="M12 22.5c5.5-1.5 8-5.5 8-9.5 0-4.5-3-8.5-7.5-9.75" />
      <ellipse cx="12" cy="12" rx="2" ry="3" />
    </svg>
  );
}
