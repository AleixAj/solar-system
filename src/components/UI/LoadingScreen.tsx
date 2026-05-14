import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const LoadingOverlay = () => {
  const { progress } = useProgress();
  const [visible, setVisible] = useState(true);

  // Hide the static pre-loader from index.html
  useEffect(() => {
    const preLoader = document.getElementById("pre-loader");
    if (preLoader) preLoader.style.display = "none";
  }, []);

  // Fade out when fully loaded
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (!visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-zinc-950 flex items-center justify-center">
      <div className="relative flex flex-col items-center text-center">
        {/* Animated rings + sun */}
        <div className="relative w-32 h-32 mb-8">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-yellow-400/30 rounded-full animate-[spin_4s_linear_infinite]" />
          {/* Middle ring */}
          <div className="absolute inset-4 border-4 border-yellow-400/40 rounded-full animate-[spin_3s_linear_infinite_reverse]" />
          {/* Inner ring */}
          <div className="absolute inset-8 border-4 border-yellow-400/60 rounded-full animate-[spin_2s_linear_infinite]" />

          {/* Central Sun */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full flex items-center justify-center shadow-[0_0_40px_#facc15] animate-pulse">
              <span className="text-4xl">☀️</span>
            </div>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-4xl font-bold tracking-tighter text-white mb-1">
          SOLAR <span className="text-yellow-400">EXPLORER</span>
        </h1>
        <p className="text-zinc-400 text-lg mb-8">Initializing simulation…</p>

        {/* Progress bar */}
        <div className="w-80 max-w-[320px]">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
              style={{ width: `${Math.round(progress)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-3 text-zinc-400 font-mono">
            <span>LOADING</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};