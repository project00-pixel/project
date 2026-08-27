import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audioController } from '../utils/sound';

export interface ComicEffectInstance {
  id: string;
  text: string;
  x: number;
  y: number;
  rotation: number;
  colorScheme: 'yellow' | 'orange' | 'cyan' | 'green' | 'magenta' | 'purple';
  scale: number;
}

const COMIC_WORDS = [
  'POW!',
  'ZAP!',
  'WHOOSH!',
  'BAM!',
  'KAPOW!',
  'CLICK!',
  'SWOOSH!',
  'PING!',
  'BOOM!',
  'SNAP!',
  'POP!',
  'CLACK!',
  'WHAM!',
  'ZOOM!',
  'THWACK!'
];

const COLOR_SCHEMES = [
  {
    type: 'yellow' as const,
    bg: 'bg-[#fbbf24]',
    text: 'text-[#1c1917]',
    border: 'border-[#1c1917]',
    shadow: 'shadow-[4px_4px_0px_#1c1917]',
    accent: '#f59e0b'
  },
  {
    type: 'orange' as const,
    bg: 'bg-[#f97316]',
    text: 'text-white',
    border: 'border-[#1c1917]',
    shadow: 'shadow-[4px_4px_0px_#1c1917]',
    accent: '#ea580c'
  },
  {
    type: 'cyan' as const,
    bg: 'bg-[#38bdf8]',
    text: 'text-[#0f172a]',
    border: 'border-[#0f172a]',
    shadow: 'shadow-[4px_4px_0px_#0f172a]',
    accent: '#0284c7'
  },
  {
    type: 'green' as const,
    bg: 'bg-[#84cc16]',
    text: 'text-[#14532d]',
    border: 'border-[#14532d]',
    shadow: 'shadow-[4px_4px_0px_#14532d]',
    accent: '#65a30d'
  },
  {
    type: 'magenta' as const,
    bg: 'bg-[#f43f5e]',
    text: 'text-white',
    border: 'border-[#1c1917]',
    shadow: 'shadow-[4px_4px_0px_#1c1917]',
    accent: '#e11d48'
  },
  {
    type: 'purple' as const,
    bg: 'bg-[#a855f7]',
    text: 'text-white',
    border: 'border-[#1c1917]',
    shadow: 'shadow-[4px_4px_0px_#1c1917]',
    accent: '#9333ea'
  }
];

// Helper to trigger custom comic fx anywhere
export const triggerComicFX = (x: number, y: number, text?: string) => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('trigger-comic-fx', {
      detail: { x, y, text }
    });
    window.dispatchEvent(event);
  }
};

export const ComicSoundFXLayer: React.FC = () => {
  const [effects, setEffects] = useState<ComicEffectInstance[]>([]);

  const addEffect = useCallback((x: number, y: number, customText?: string) => {
    // Select randomized word if none provided
    const text = customText || COMIC_WORDS[Math.floor(Math.random() * COMIC_WORDS.length)];
    const colorScheme = COLOR_SCHEMES[Math.floor(Math.random() * COLOR_SCHEMES.length)].type;
    const rotation = (Math.random() - 0.5) * 28; // -14deg to +14deg
    const scale = 0.95 + Math.random() * 0.2; // 0.95 to 1.15

    // Clamp coordinates to keep inside window
    const clampedX = Math.max(48, Math.min(window.innerWidth - 64, x));
    const clampedY = Math.max(48, Math.min(window.innerHeight - 48, y));

    const id = `fx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newEffect: ComicEffectInstance = {
      id,
      text,
      x: clampedX,
      y: clampedY,
      rotation,
      colorScheme,
      scale
    };

    setEffects((prev) => [...prev.slice(-12), newEffect]);

    // Optional audio pop
    audioController.playPop();

    // Auto remove after animation completes
    setTimeout(() => {
      setEffects((prev) => prev.filter((e) => e.id !== id));
    }, 1100);
  }, []);

  useEffect(() => {
    // Listen for custom dispatched events
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number; text?: string }>;
      if (customEvent.detail) {
        addEffect(customEvent.detail.x, customEvent.detail.y, customEvent.detail.text);
      }
    };

    // Global click listener targeting buttons & clickable controls
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if target is a button or inside a clickable control
      const clickable = target.closest('button, [role="button"], a, input[type="range"], .clickable-comic-target');
      if (clickable) {
        // Offset slightly above the click point
        const clientX = e.clientX;
        const clientY = e.clientY - 24;
        addEffect(clientX, clientY);
      }
    };

    window.addEventListener('trigger-comic-fx', handleCustomEvent);
    window.addEventListener('click', handleGlobalClick, { capture: true });

    return () => {
      window.removeEventListener('trigger-comic-fx', handleCustomEvent);
      window.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, [addEffect]);

  return (
    <div
      id="comic-sound-fx-layer"
      className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden select-none"
      aria-hidden="true"
    >
      <AnimatePresence mode="popLayout">
        {effects.map((effect) => {
          const scheme = COLOR_SCHEMES.find((s) => s.type === effect.colorScheme) || COLOR_SCHEMES[0];

          return (
            <motion.div
              key={effect.id}
              initial={{
                opacity: 0,
                scale: 0.1,
                x: effect.x,
                y: effect.y,
                rotate: effect.rotation - 15
              }}
              animate={{
                opacity: [0, 1, 1, 0.9, 0],
                scale: [0.2, 1.35 * effect.scale, 1.0 * effect.scale, 1.08 * effect.scale, 0.7],
                x: effect.x,
                y: [effect.y, effect.y - 12, effect.y - 32, effect.y - 48, effect.y - 64],
                rotate: [effect.rotation - 10, effect.rotation, effect.rotation + 4, effect.rotation]
              }}
              exit={{
                opacity: 0,
                scale: 0.5,
                y: effect.y - 75,
                transition: { duration: 0.25 }
              }}
              transition={{
                duration: 0.95,
                times: [0, 0.15, 0.35, 0.75, 1],
                ease: [0.175, 0.885, 0.32, 1.275]
              }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                transform: 'translate(-50%, -50%)'
              }}
              className="flex items-center justify-center -translate-x-1/2 -translate-y-1/2 will-change-transform"
            >
              {/* Comic Starburst Graphic Shape */}
              <div className="relative flex items-center justify-center">
                {/* Comic Jagged Star Background */}
                <svg
                  className="absolute w-28 h-20 -z-10 drop-shadow-[3px_3px_0px_rgba(28,25,23,1)] filter"
                  viewBox="0 0 100 65"
                  fill={scheme.accent}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polygon
                    points="50,2 62,14 78,8 80,24 96,28 88,42 98,54 82,58 76,64 60,58 50,65 38,56 22,64 18,50 2,46 10,32 4,18 20,20 24,6 38,16"
                    stroke="#1c1917"
                    strokeWidth="2.5"
                    strokeLinejoin="miter"
                  />
                </svg>

                {/* Primary Action Label Badge */}
                <div
                  className={`relative px-3.5 py-1.5 rounded-md ${scheme.bg} ${scheme.text} ${scheme.border} ${scheme.shadow} border-[2.5px] font-black uppercase tracking-wider text-xs sm:text-sm font-serif shadow-xl flex items-center gap-1 leading-none`}
                  style={{
                    fontFamily: '"Fraunces", "Impact", "Arial Black", sans-serif',
                    textShadow: '0.5px 0.5px 0px rgba(0,0,0,0.2)'
                  }}
                >
                  {/* Speed lines micro decoration */}
                  <span className="text-[10px] opacity-75 font-mono select-none">⚡</span>
                  <span className="tracking-widest drop-shadow-sm">{effect.text}</span>
                  <span className="text-[10px] opacity-75 font-mono select-none">💥</span>
                </div>

                {/* Micro Action Sparks */}
                <motion.div
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: [0.5, 1.4, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute -inset-2 pointer-events-none flex items-center justify-center -z-20"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-300 absolute -top-3 -right-2 shadow-sm" />
                  <div className="w-2 h-2 rounded-full bg-orange-400 absolute -bottom-2.5 -left-3 shadow-sm" />
                  <div className="w-1 h-1 rounded-full bg-yellow-200 absolute -top-2 -left-2 shadow-sm" />
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 absolute -bottom-1 -right-3 shadow-sm" />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
