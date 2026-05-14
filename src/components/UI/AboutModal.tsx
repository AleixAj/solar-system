import { memo } from 'react';
import { useLanguage } from '../../context/LanguageContext';

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.252-.446-1.266.098-2.638 0 0 .84-.27 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.296 2.747-1.027 2.747-1.027.546 1.372.202 2.387.1 2.638.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal = memo(({ isOpen, onClose }: AboutModalProps) => {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  const highlights =
    language === 'es'
      ? [
          'Arquitectura React + TypeScript con componentes reutilizables y estado desacoplado',
          'Experiencia 3D interactiva con selección, navegación de cámara y tooltips en escena',
          'Interfaz responsive con navegación desktop/mobile, modal, drawer y controles flotantes',
          'Internacionalización ES/EN sin dependencias externas y persistencia local',
          'Cuidado de rendimiento en WebGL: lazy loading, Suspense y geometrías ligeras',
        ]
      : [
          'React + TypeScript architecture with reusable components and decoupled state',
          'Interactive 3D experience with selection, camera navigation and in-scene tooltips',
          'Responsive UI with desktop/mobile navigation, modal, drawer and floating controls',
          'ES/EN internationalization without external dependencies and local persistence',
          'WebGL performance care: lazy loading, Suspense and lightweight geometries',
        ];

  return (
    <div
      className="fixed inset-0 z-[110] flex min-h-0 justify-center overflow-y-auto overscroll-y-contain bg-black/70 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div
        className="my-auto flex w-full max-w-2xl max-h-[min(calc(100dvh-2rem),56rem)] flex-col overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
          {/* Header del modal */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-700 bg-zinc-900 px-4 py-4 sm:px-7 sm:py-5">
            <h2 id="about-modal-title" className="min-w-0 text-xl font-bold tracking-tight text-white sm:text-2xl">
              {t('aboutProject')}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl leading-none text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              aria-label={t('aboutClose')}
            >
              ✕
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4 text-zinc-300 sm:space-y-7 sm:p-7">

            <div>
              <h3 className="text-yellow-400 text-sm uppercase tracking-widest mb-2">{t('aboutTech')}</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-zinc-800 rounded-2xl text-sm">React 19</span>
                <span className="px-4 py-2 bg-zinc-800 rounded-2xl text-sm">TypeScript</span>
                <span className="px-4 py-2 bg-zinc-800 rounded-2xl text-sm">Three.js</span>
                <span className="px-4 py-2 bg-zinc-800 rounded-2xl text-sm">React Three Fiber</span>
                <span className="px-4 py-2 bg-zinc-800 rounded-2xl text-sm">Tailwind CSS</span>
                <span className="px-4 py-2 bg-zinc-800 rounded-2xl text-sm">Vite</span>
                <span className="px-4 py-2 bg-zinc-800 rounded-2xl text-sm">i18n ES/EN</span>
              </div>
            </div>

            <div>
              <h3 className="text-yellow-400 text-sm uppercase tracking-widest mb-2">{t('aboutLearned')}</h3>
              <ul className="list-disc list-inside space-y-2 text-zinc-400">
                {highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5 text-sm md:grid-cols-2">
              <div className="space-y-1">
                <span className="text-zinc-500">{t('aboutDuration')}</span>
                <span className="block font-medium text-white">
                  {language === 'es'
                    ? 'Experiencia web completa: escena 3D, UI, responsive e idioma'
                    : 'Complete web experience: 3D scene, UI, responsive layout and language support'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500">
                  {language === 'es' ? 'Enfoque:' : 'Focus:'}
                </span>
                <span className="block font-medium text-white">
                  {language === 'es'
                    ? 'Proyecto personal evolutivo con foco en producto e interacción'
                    : 'Evolving personal project focused on product feel and interaction'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer: móvil — dos botones a mitad y mitad; sm+ — fila con más aire */}
          <div className="flex shrink-0 border-t border-zinc-700 bg-zinc-950 px-4 py-4 sm:px-8 sm:py-6">
            <div className="flex w-full gap-2 sm:justify-between sm:gap-4">
              <a
                href="https://github.com/AleixAj/solar-system"
                target="_blank"
                rel="noreferrer"
                aria-label={t('aboutViewCode')}
                className="inline-flex min-h-[48px] min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl border border-zinc-600 bg-zinc-800 px-3 py-3 text-sm font-semibold text-white transition-colors hover:border-zinc-500 hover:bg-zinc-700 sm:flex-none sm:px-5"
              >
                <GitHubIcon className="h-5 w-5 shrink-0 text-zinc-200" />
                <span className="truncate">GitHub</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[48px] min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-3 py-3 text-sm font-semibold text-zinc-950 shadow-sm transition-colors hover:bg-yellow-300 active:scale-[0.98] sm:flex-none sm:px-6"
              >
                <CloseIcon className="h-5 w-5 shrink-0" />
                <span className="truncate">{t('aboutClose')}</span>
              </button>
            </div>
          </div>
      </div>
    </div>
  );
});