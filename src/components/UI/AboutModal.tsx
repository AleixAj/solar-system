import { memo } from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal = memo(({ isOpen, onClose }: AboutModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-700 overflow-hidden">
          {/* Header del modal */}
          <div className="px-8 py-6 border-b border-zinc-700 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tighter text-white">About this project</h2>
            <button
              onClick={onClose}
              className="text-4xl leading-none text-zinc-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-8 space-y-8 text-zinc-300">
            <div>
              <h3 className="text-yellow-400 text-sm uppercase tracking-widest mb-2">Tecnologías</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-zinc-800 rounded-2xl text-sm">React 19</span>
                <span className="px-4 py-2 bg-zinc-800 rounded-2xl text-sm">TypeScript</span>
                <span className="px-4 py-2 bg-zinc-800 rounded-2xl text-sm">Three.js</span>
                <span className="px-4 py-2 bg-zinc-800 rounded-2xl text-sm">React Three Fiber</span>
                <span className="px-4 py-2 bg-zinc-800 rounded-2xl text-sm">Tailwind CSS</span>
                <span className="px-4 py-2 bg-zinc-800 rounded-2xl text-sm">GSAP (próximamente)</span>
                <span className="px-4 py-2 bg-zinc-800 rounded-2xl text-sm">Vite</span>
              </div>
            </div>

            <div>
              <h3 className="text-yellow-400 text-sm uppercase tracking-widest mb-2">Qué aprendí</h3>
              <ul className="list-disc list-inside space-y-2 text-zinc-400">
                <li>Optimización avanzada de escenas 3D con React Three Fiber</li>
                <li>Manejo de performance en WebGL (useFrame, frameloop)</li>
                <li>Diseño de UI moderna y accesible con Tailwind</li>
                <li>Estructura limpia de proyecto grande en React + TypeScript</li>
                <li>Animaciones suaves y UX fluida en aplicaciones 3D</li>
              </ul>
            </div>

            <div className="flex justify-between text-sm">
              <div>
                <span className="text-zinc-500">Tiempo de desarrollo:</span>
                <span className="block font-medium text-white">≈ 2 semanas</span>
              </div>
              <div>
                <span className="text-zinc-500">Dificultad:</span>
                <span className="block font-medium text-white">Junior → Mid</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-zinc-950 flex items-center justify-between border-t border-zinc-700">
            <a
              href="https://github.com/AleixAj/solar-system"
              target="_blank"
              className="text-zinc-400 hover:text-white flex items-center gap-2"
            >
              Ver código en GitHub →
            </a>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-white text-zinc-950 font-medium rounded-2xl hover:bg-yellow-400 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
});