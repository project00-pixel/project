import React, { useState, useEffect, useRef } from 'react';
import { UserPathRecord } from '../types';
import { Sliders, RefreshCw, AlertTriangle, ShieldCheck, TrendingDown, Globe2, Activity } from 'lucide-react';
import { audioController } from '../utils/sound';

// 1. SILENT SHOCK BACTERIAL RESISTANCE SIMULATION (Chapter 2)
export const AMRSimulation: React.FC = () => {
  const [doseFrequency, setDoseFrequency] = useState(70); // % routine / prophylactic usage
  const [isSimulating, setIsSimulating] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Colony particle state
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; resistant: boolean; radius: number }>>([]);

  useEffect(() => {
    // Initialize bacterial population
    const count = 45;
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 80;
      newParticles.push({
        x: 120 + Math.cos(angle) * dist,
        y: 100 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        resistant: Math.random() < doseFrequency / 100,
        radius: Math.random() * 3 + 3
      });
    }
    particlesRef.current = newParticles;
  }, [doseFrequency]);

  useEffect(() => {
    let animationFrame: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Petri Dish Base
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = 90;

      // Agar plate gradient
      const agarGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, r);
      agarGrad.addColorStop(0, '#1c2720');
      agarGrad.addColorStop(1, '#0f1a16');
      ctx.fillStyle = agarGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Glass rim
      ctx.strokeStyle = 'rgba(200, 220, 210, 0.25)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Zone of inhibition circle (shrinks as doseFrequency increases)
      const inhibitionRadius = Math.max(15, (100 - doseFrequency) * 0.7);
      ctx.strokeStyle = 'rgba(125, 143, 108, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, inhibitionRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Update & Draw Bacteria
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce inside dish
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > r - 10) {
          p.vx *= -1;
          p.vy *= -1;
        }

        ctx.fillStyle = p.resistant ? '#a23b34' : '#7d8f6c';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow for resistant bacteria
        if (p.resistant) {
          ctx.strokeStyle = 'rgba(207, 90, 80, 0.5)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      if (isSimulating) {
        animationFrame = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [doseFrequency, isSimulating]);

  const resistantCount = Math.round(doseFrequency);
  const drugEfficacy = Math.max(12, Math.round(100 - doseFrequency * 0.88));

  return (
    <div className="w-full max-w-xl mx-auto p-5 sm:p-6 rounded-3xl bg-[#fbf7ee] dark:bg-[#16222c] border border-[#a23b34]/25 shadow-xl">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#a23b34]" />
          <h3 className="font-serif font-black text-lg text-[#292019] dark:text-[#f0e6d6]">
            The Silent Shock Simulation
          </h3>
        </div>
        <span className="text-xs font-black uppercase tracking-wider text-[#a23b34] bg-[#a23b34]/15 px-2.5 py-0.5 rounded-full">
          Lab Model
        </span>
      </div>

      <p className="text-xs text-[#6b5f52] dark:text-[#a8b2a9] mb-4">
        Adjust routine antimicrobial usage intensity. Observe how persistent low-dose exposure accelerates selective resistance, shrinking the medicine’s effective zone of inhibition.
      </p>

      {/* Canvas */}
      <div className="flex justify-center my-2">
        <canvas
          ref={canvasRef}
          width={240}
          height={200}
          className="rounded-2xl shadow-inner border border-[#292019]/10 dark:border-[#f0e6d6]/10"
        />
      </div>

      {/* Dynamic Readouts */}
      <div className="grid grid-cols-2 gap-3 my-4">
        <div className="p-3 rounded-xl bg-[#a23b34]/10 border border-[#a23b34]/20 text-center">
          <span className="text-[11px] font-extrabold uppercase text-[#a23b34] block">
            Resistant Strain Prevalence
          </span>
          <span className="font-serif font-black text-2xl text-[#a23b34]">
            {resistantCount}%
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[#7d8f6c]/10 border border-[#7d8f6c]/20 text-center">
          <span className="text-[11px] font-extrabold uppercase text-[#67795a] dark:text-[#a9bd9e] block">
            Therapeutic Drug Efficacy
          </span>
          <span className="font-serif font-black text-2xl text-[#67795a] dark:text-[#a9bd9e]">
            {drugEfficacy}%
          </span>
        </div>
      </div>

      {/* Control Slider */}
      <div className="mt-4">
        <div className="flex justify-between text-xs font-extrabold text-[#3a3229] dark:text-[#d6dcd4] mb-1.5">
          <span>Targeted / Minimal Use (Prudent)</span>
          <span>Routine / Prophylactic Exposure</span>
        </div>
        <input
          type="range"
          min="10"
          max="95"
          value={doseFrequency}
          onChange={(e) => {
            setDoseFrequency(Number(e.target.value));
            audioController.playPop();
          }}
          className="w-full h-2 rounded-full bg-gradient-to-r from-[#7d8f6c] via-[#dd9f66] to-[#a23b34] cursor-pointer appearance-none"
        />
      </div>
    </div>
  );
};

// 2. INTENSITY LEVERBOX (Chapter 7)
export const IntensityLeverbox: React.FC = () => {
  const [reductionPercent, setReductionPercent] = useState(30);

  const baselineTonnes = 143481;
  const savedTonnes = Math.round(baselineTonnes * (reductionPercent / 100) * 0.88);
  const finalProjectedTonnes = baselineTonnes - savedTonnes;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#fbf7ee] dark:bg-[#16222c] border border-[#7d8f6c]/30 shadow-xl my-8">
      <div className="flex items-center gap-2 mb-2">
        <Sliders className="w-5 h-5 text-[#7d8f6c]" />
        <span className="text-xs font-black uppercase tracking-widest text-[#67795a] dark:text-[#a9bd9e]">
          Interactive Policy Throttle
        </span>
      </div>

      <h3 className="font-serif font-black text-2xl text-[#292019] dark:text-[#f0e6d6]">
        Adjust Use-Intensity Target by 2040
      </h3>
      <p className="text-sm text-[#6b5f52] dark:text-[#a8b2a9] mt-1">
        Drag the lever to simulate how global reductions in antimicrobial intensity counteract livestock growth projections.
      </p>

      {/* Range Slider */}
      <div className="my-6">
        <input
          type="range"
          min="0"
          max="60"
          step="5"
          value={reductionPercent}
          onChange={(e) => {
            setReductionPercent(Number(e.target.value));
            audioController.playPop();
          }}
          className="w-full h-3 rounded-full bg-gradient-to-r from-[#c8875a] via-[#7d8f6c] to-[#2c3745] cursor-pointer appearance-none"
        />
        <div className="flex justify-between text-xs font-black text-[#9c8e7c] mt-2">
          <span>0% (Status Quo)</span>
          <span className="text-[#a8734a]">30% (Achievable Shift)</span>
          <span className="text-[#2c3745] dark:text-[#8ea0e0]">50% (Deep Cut)</span>
          <span>60% (Max Bio-Reform)</span>
        </div>
      </div>

      {/* Interactive Metric Breakdown */}
      <div className="p-5 rounded-2xl bg-[#ffffff] dark:bg-[#0f1620] border border-[#292019]/10 dark:border-[#f0e6d6]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#6b5f52] dark:text-[#a8b2a9]">
            Simulated Global Livestock AMU
          </span>
          <span className="font-serif font-black text-3xl sm:text-4xl text-[#292019] dark:text-[#f0e6d6]">
            {finalProjectedTonnes.toLocaleString()} <span className="text-lg font-sans font-bold text-[#67795a]">tonnes</span>
          </span>
          <span className="text-xs text-[#9c8e7c] mt-0.5">
            vs. 143,481 t on the unconstrained business-as-usual pathway
          </span>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-[#7d8f6c]/15 text-[#55663f] dark:text-[#a9bd9e] text-center flex-shrink-0">
          <span className="text-xs font-black block">Avoided Chemical Burden</span>
          <span className="font-serif font-black text-xl">
            -{savedTonnes.toLocaleString()} t
          </span>
        </div>
      </div>
    </div>
  );
};

// 3. REGIONAL BREAKDOWN VISUALIZER (Chapter 5)
export const RegionalBars: React.FC = () => {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const regions = [
    {
      name: 'Asia & the Pacific',
      percent: 65,
      color: '#dd9f66',
      description: 'Driven by massive domestic protein demand and rapid industrial intensification across pig and poultry sectors.'
    },
    {
      name: 'South America',
      percent: 19,
      color: '#a8734a',
      description: 'Significant global beef and poultry export hub with growing feedlot operations.'
    },
    {
      name: 'Rest of the World (Africa, Europe, N. America)',
      percent: 16,
      color: '#7d8f6c',
      description: 'Africa exhibits rapid percentage growth from a low baseline; North America declines and Europe stabilizes under strict veterinary oversight.'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto my-6 p-6 rounded-3xl bg-[#fbf7ee] dark:bg-[#16222c] border border-[#dd9f66]/30 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Globe2 className="w-5 h-5 text-[#dd9f66]" />
        <h4 className="font-serif font-black text-lg text-[#292019] dark:text-[#f0e6d6]">
          Geographic Concentration (2040 Forecast)
        </h4>
      </div>

      <div className="space-y-4">
        {regions.map((reg) => (
          <div
            key={reg.name}
            onMouseEnter={() => setActiveRegion(reg.name)}
            onMouseLeave={() => setActiveRegion(null)}
            className="p-3 rounded-2xl hover:bg-white/60 dark:hover:bg-[#0f1620]/60 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="font-bold text-sm text-[#292019] dark:text-[#f0e6d6]">
                {reg.name}
              </span>
              <span className="font-serif font-black text-xl text-[#292019] dark:text-[#f0e6d6]">
                {reg.percent}%
              </span>
            </div>
            <div className="w-full h-3.5 rounded-full bg-[#ecdfc8] dark:bg-[#1f2c37] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${reg.percent}%`,
                  backgroundColor: reg.color
                }}
              />
            </div>
            {activeRegion === reg.name && (
              <p className="text-xs text-[#6b5f52] dark:text-[#a8b2a9] mt-2 animate-in fade-in leading-relaxed">
                {reg.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. YOUR PATH RECAP CARD (Epilogue)
export const YourPathRecap: React.FC<{ record: UserPathRecord }> = ({ record }) => {
  return (
    <div className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-[#ffffff] dark:bg-[#16222c] border border-[#a8734a]/30 shadow-2xl my-8">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#292019]/10 dark:border-[#f0e6d6]/10">
        <ShieldCheck className="w-5 h-5 text-[#67795a]" />
        <h4 className="font-serif font-black text-xl text-[#292019] dark:text-[#f0e6d6]">
          Your Journey Log
        </h4>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-start">
          <span className="font-bold text-xs uppercase tracking-wider text-[#9c8e7c]">
            Farm Perspective Chosen
          </span>
          <span className="font-semibold text-right max-w-[280px] text-[#292019] dark:text-[#f0e6d6]">
            {record.choice || 'Default Prudent Path'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-bold text-xs uppercase tracking-wider text-[#9c8e7c]">
            Theme Setting
          </span>
          <span className="font-semibold text-[#292019] dark:text-[#f0e6d6] capitalize">
            {record.theme} Mode
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-bold text-xs uppercase tracking-wider text-[#9c8e7c]">
            Terms Explored
          </span>
          <span className="font-semibold text-[#a8734a]">
            {record.termsExplored.length > 0
              ? record.termsExplored.join(', ')
              : 'One Health, AMU, AMR'}
          </span>
        </div>
      </div>

      <div className="mt-5 p-3.5 rounded-2xl bg-[#7d8f6c]/15 text-[#55663f] dark:text-[#a9bd9e] text-center text-xs font-bold leading-relaxed">
        "Acting early safeguards global health, sustains livestock equity, and ensures antibiotics remain potent for generations."
      </div>
    </div>
  );
};
