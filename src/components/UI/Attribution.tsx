import { memo } from 'react';

const ThreeJsIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 36 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Three.js"
    role="img"
  >
    <path
      d="M18 1.5 L34.5 30.5 L1.5 30.5 Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M18 9 L26.25 23.5 L9.75 23.5 Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
      strokeOpacity="0.55"
    />
    <line x1="18" y1="1.5" x2="18" y2="30.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
    <line x1="9.75" y1="16.5" x2="26.25" y2="16.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
  </svg>
);

export const Attribution = memo(() => (
  <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 text-xs text-zinc-500 flex items-center gap-2 bg-zinc-950/70 backdrop-blur-md px-5 py-2 rounded-3xl border border-zinc-800">
    <span>Crafted with</span>
    <span className="text-red-500">♥</span>
    <span>and</span>
    <span className="flex items-center gap-1">
      <ThreeJsIcon />
      <span className="font-medium text-zinc-400">Three.js</span>
    </span>
    <span className="text-zinc-400">by</span>
    <span className="font-semibold text-white">Aleix</span>
  </div>
));