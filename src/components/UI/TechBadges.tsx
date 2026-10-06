import type { FC } from 'react';

// Brand colors, kept here so the icons below read better.
const REACT_CYAN = '#61DAFB';
const TS_BLUE = '#3178C6';
const VITE_PURPLE = '#646CFF';
const VITE_LIGHTNING = '#FFD24A';

function ReactBrandIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke={REACT_CYAN} strokeWidth="1.15">
        <ellipse cx="12" cy="12" rx="10.5" ry="4" />
        <ellipse cx="12" cy="12" rx="10.5" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10.5" ry="4" transform="rotate(120 12 12)" />
      </g>
      <circle cx="12" cy="12" r="2" fill={REACT_CYAN} />
    </svg>
  );
}

function TypeScriptIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="3" fill={TS_BLUE} />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fill="#fff"
        fontSize="11.5"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        TS
      </text>
    </svg>
  );
}

function ThreeJsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#fff" d="M12 2.2 21.8 21H2.2L12 2.2z" />
    </svg>
  );
}

function ReactThreeFiberIcon({ className }: { className?: string }) {
  return (
    <svg
      className={['text-sky-400', className].filter(Boolean).join(' ')}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
    >
      <path d="M12 5l7 4v10l-7 4-7-4V9l7-4z" opacity="0.85" />
      <path d="M12 5v10M5 9l7 4 7-4M5 19l7-4" />
    </svg>
  );
}

function TailwindIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="#38BDF8">
      <path d="M12 6.5c-2.6 0-4.2 1.3-4.9 3.9 1-1.3 2.1-1.8 3.4-1.5.7.2 1.3.7 1.9 1.3 1.1 1.1 2.3 2.3 5 2.3 2.6 0 4.2-1.3 4.9-3.9-1 1.3-2.1 1.8-3.4 1.5-.7-.2-1.3-.7-1.9-1.3-1.1-1.1-2.3-2.3-5-2.3zm-5 7.4c-2.6 0-4.2 1.3-4.9 3.9 1-1.3 2.1-1.8 3.4-1.5.7.2 1.3.7 1.9 1.3 1.1 1.1 2.3 2.3 5 2.3 2.6 0 4.2-1.3 4.9-3.9-1 1.3-2.1 1.8-3.4 1.5-.7-.2-1.3-.7-1.9-1.3-1.1-1.1-2.3-2.3-5-2.3z" />
    </svg>
  );
}

function ViteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill={VITE_PURPLE}
        d="M14.3 2.4 22 18.2c.4.8-.2 1.7-1 1.8l-7.2 1.3c-.4.1-.8 0-1.1-.3l-9.5-9.5c-.6-.6-.1-1.6.7-1.6l6.5-.7 3.9-6.8z"
      />
      <path
        fill={VITE_LIGHTNING}
        d="m13.1 8.2 2.8 5.4-4.2-1-1.4 2.7 1-6.1z"
      />
    </svg>
  );
}

function I18nIcon({ className }: { className?: string }) {
  return (
    <svg
      className={['text-emerald-400', className].filter(Boolean).join(' ')}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
    >
      <circle cx="12" cy="12" r="9" opacity="0.9" />
      <path d="M3 12h18M12 3c2.2 3.8 2.2 8.2 0 12M12 3c-2.2 3.8-2.2 8.2 0 12" />
    </svg>
  );
}

const TECH_BADGES: { key: string; label: string; Icon: FC<{ className?: string }> }[] = [
  { key: 'react', label: 'React 19', Icon: ReactBrandIcon },
  { key: 'ts', label: 'TypeScript', Icon: TypeScriptIcon },
  { key: 'three', label: 'Three.js', Icon: ThreeJsIcon },
  { key: 'r3f', label: 'React Three Fiber', Icon: ReactThreeFiberIcon },
  { key: 'tailwind', label: 'Tailwind CSS', Icon: TailwindIcon },
  { key: 'vite', label: 'Vite', Icon: ViteIcon },
  { key: 'i18n', label: 'i18n ES/EN', Icon: I18nIcon },
];

/** Chips with the tools used in the project, shown inside the about modal. */
export const TechBadges = () => (
  <div className="flex flex-wrap gap-2">
    {TECH_BADGES.map(({ key, label, Icon }) => (
      <span
        key={key}
        className="inline-flex items-center gap-2 rounded-2xl bg-zinc-800 px-3 py-2 pr-4 text-sm text-zinc-100 transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-700 hover:shadow-lg hover:shadow-black/20"
      >
        <Icon className="h-5 w-5 shrink-0" />
        {label}
      </span>
    ))}
  </div>
);
