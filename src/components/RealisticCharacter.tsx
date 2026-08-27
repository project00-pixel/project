import React, { useState, useEffect, useRef } from 'react';
import { IMAGES } from '../data/chaptersData';
import { audioController } from '../utils/sound';
import { CharacterMood } from '../types';
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Activity,
  Volume2,
  HelpCircle,
  Eye,
  CheckCircle2,
  BarChart2,
  Flame,
  Lightbulb,
  Sun,
  Leaf,
  ScanLine,
  Zap,
  Shield,
  HelpCircle as QuestionIcon
} from 'lucide-react';

interface RealisticCharacterProps {
  speakerId: 'a' | 's';
  isSpeaking: boolean;
  isListening?: boolean;
  currentDialogueText?: string;
  className?: string;
  explicitMood?: CharacterMood;
  customPortraitImg?: string;
  onTriggerReaction?: (reactionType: string) => void;
}

export const RealisticCharacter: React.FC<RealisticCharacterProps> = ({
  speakerId,
  isSpeaking,
  isListening = false,
  currentDialogueText = '',
  className = '',
  explicitMood,
  customPortraitImg,
  onTriggerReaction
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; px: number; py: number; active: boolean }>({
    x: 0,
    y: 0,
    px: 50,
    py: 50,
    active: false
  });
  const [activeMood, setActiveMood] = useState<CharacterMood>('neutral');
  const [reactionBurst, setReactionBurst] = useState<{ label: string; icon: string } | null>(null);
  const [waveformLevels, setWaveformLevels] = useState<number[]>([15, 35, 60, 40, 20, 35, 18]);
  const [isBlinking, setIsBlinking] = useState(false);

  const isAmira = speakerId === 'a';

  // Periodic natural eye blink cycle
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
    }, 4200 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Compute dynamic mood from explicit prop or dialogue context
  useEffect(() => {
    if (explicitMood) {
      setActiveMood(explicitMood);
      return;
    }

    if (isSpeaking) {
      const lower = currentDialogueText.toLowerCase();
      if (lower.includes('risk') || lower.includes('mortality') || lower.includes('threat') || lower.includes('crisis') || lower.includes('shock') || lower.includes('alarm')) {
        setActiveMood('alarmed');
      } else if (lower.includes('doubt') || lower.includes('skeptical') || lower.includes('untested') || lower.includes('cost') || lower.includes('burden')) {
        setActiveMood('skeptical');
      } else if (lower.includes('protect') || lower.includes('safeguard') || lower.includes('must') || lower.includes('ensure') || lower.includes('stand')) {
        setActiveMood('determined');
      } else if (lower.includes('solution') || lower.includes('opportunity') || lower.includes('yield') || lower.includes('improve') || lower.includes('progress')) {
        setActiveMood('optimistic');
      } else if (lower.includes('model') || lower.includes('data') || lower.includes('percent') || lower.includes('return') || lower.includes('invest')) {
        setActiveMood('thinking');
      } else if (lower.includes('agree') || lower.includes('consensus') || lower.includes('handshake') || lower.includes('balance') || lower.includes('together') || lower.includes('shared')) {
        setActiveMood('consensus');
      } else {
        setActiveMood('speaking');
      }
    } else if (isListening) {
      setActiveMood('thinking');
    } else {
      setActiveMood('neutral');
    }
  }, [isSpeaking, isListening, currentDialogueText, explicitMood]);

  // Dynamic audio waveform simulation during speech
  useEffect(() => {
    if (!isSpeaking) {
      setWaveformLevels([12, 16, 20, 16, 12, 18, 14]);
      return;
    }
    const interval = setInterval(() => {
      setWaveformLevels([
        Math.floor(25 + Math.random() * 55),
        Math.floor(40 + Math.random() * 60),
        Math.floor(55 + Math.random() * 45),
        Math.floor(70 + Math.random() * 30),
        Math.floor(50 + Math.random() * 50),
        Math.floor(35 + Math.random() * 60),
        Math.floor(20 + Math.random() * 50)
      ]);
    }, 110);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  const mouseRafRef = useRef<number | null>(null);

  // 3D Parallax Tilt & Dynamic Spotlight Handler (rAF-Throttled)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (mouseRafRef.current) cancelAnimationFrame(mouseRafRef.current);
    mouseRafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
      const y = ((clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
      const px = ((clientX - rect.left) / rect.width) * 100;
      const py = ((clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y, px, py, active: true });
    });
  };

  const handleMouseLeave = () => {
    if (mouseRafRef.current) cancelAnimationFrame(mouseRafRef.current);
    setMousePos({ x: 0, y: 0, px: 50, py: 50, active: false });
  };

  const handleManualReaction = (type: string, label: string, icon: string = '✨') => {
    audioController.playPop();
    setReactionBurst({ label, icon });
    if (onTriggerReaction) onTriggerReaction(type);
    setTimeout(() => setReactionBurst(null), 2500);
  };

  // Determine active 2D illustration (Unified signature portrait for Dr. Amira and Mohamed)
  const getActiveImage = () => {
    if (isAmira) {
      return IMAGES.amiraPortrait;
    } else {
      return IMAGES.mohamedPortrait;
    }
  };

  const activeImage = getActiveImage();
  const accentColor = isAmira ? '#a8734a' : '#7d8f6c';
  const name = isAmira ? 'Dr. Amira' : 'Mohamed';
  const role = isAmira ? 'One Health Economist' : 'Innovative Livestock Producer';
  const perspective = isAmira ? 'Macro Policy & Risk Foresight' : 'Herd Health & Farm-Gate Margins';

  const getMoodBadge = (mood: CharacterMood) => {
    switch (mood) {
      case 'celebratory':
        return { label: 'Celebratory 🎉', bg: 'bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 border-emerald-500/50 ring-2 ring-emerald-400/30 font-black' };
      case 'thoughtful':
        return { label: 'Thoughtful 🤔', bg: 'bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border-indigo-500/40 font-black' };
      case 'concerned':
        return { label: 'Concerned ⚠️', bg: 'bg-amber-600/20 text-amber-800 dark:text-amber-300 border-amber-600/40 font-black' };
      case 'alarmed':
        return { label: 'Alarmed ⚡', bg: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/40 font-black' };
      case 'skeptical':
        return { label: 'Skeptical 🧐', bg: 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40 font-black' };
      case 'determined':
        return { label: 'Determined 🛡️', bg: 'bg-teal-600/20 text-teal-800 dark:text-teal-300 border-teal-500/40 font-black' };
      case 'optimistic':
        return { label: 'Optimistic 💡', bg: 'bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-500/40 font-black' };
      case 'consensus':
        return { label: 'Consensus 🤝', bg: 'bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-500/40 font-black' };
      case 'thinking':
        return { label: 'Reflecting 💭', bg: 'bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 border-indigo-500/30' };
      case 'passionate':
        return { label: 'Passionate 🔥', bg: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40' };
      default:
        return null;
    }
  };

  const moodBadge = getMoodBadge(activeMood);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex flex-col items-center select-none perspective-1000 ${className}`}
    >
      {/* Dynamic 3D Floating Stage Canvas */}
      <div
        style={{
          transform: mousePos.active
            ? `rotateY(${mousePos.x * 7}deg) rotateX(${-mousePos.y * 7}deg) scale3d(1.02, 1.02, 1.02)`
            : isSpeaking
            ? 'scale(1.02)'
            : 'scale(1.0)',
          transition: mousePos.active ? 'transform 0.08s ease-out' : 'transform 0.4s ease-out'
        }}
        className={`relative w-full max-w-[320px] rounded-2xl sm:rounded-3xl p-2 sm:p-4 transition-all duration-500 overflow-hidden shadow-xl sm:shadow-2xl ${
          isSpeaking
            ? 'bg-gradient-to-b from-[#ffffff] via-[#fbf7ee] to-[#f5ead8] dark:from-[#1b2733] dark:via-[#16212b] dark:to-[#0f1720] ring-2 sm:ring-4 ring-[#a8734a]/30 shadow-2xl'
            : isListening
            ? 'bg-gradient-to-b from-[#fbf7ee]/90 to-[#f4ead8]/90 dark:from-[#16222c] dark:to-[#121a22] ring-1 sm:ring-2 ring-[#292019]/10 opacity-95'
            : 'bg-white/85 dark:bg-[#16222c]/85 border border-[#292019]/10'
        }`}
      >
        {/* Living Breathing Ambient Lighting Aura */}
        <div
          className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl transition-opacity duration-700 pointer-events-none"
          style={{
            backgroundColor: accentColor,
            opacity: isSpeaking ? 0.45 : isListening ? 0.25 : 0.12
          }}
        />

        {/* Dynamic Interactive Cursor Light Flare */}
        {mousePos.active && (
          <div
            className="absolute w-40 h-40 rounded-full pointer-events-none blur-2xl opacity-35 transition-all duration-75 mix-blend-screen"
            style={{
              top: `${mousePos.py}%`,
              left: `${mousePos.px}%`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: isAmira ? '#f4b886' : '#b2cca0'
            }}
          />
        )}

        {/* Top Status HUD Badge */}
        <div className="relative z-10 flex items-center justify-between gap-1 mb-1.5 sm:mb-2.5 px-0.5 sm:px-1">
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
            <span
              className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full animate-pulse shadow-sm flex-shrink-0"
              style={{ backgroundColor: accentColor }}
            />
            <span className="font-serif font-black text-xs sm:text-sm text-[#292019] dark:text-[#f0e6d6] truncate">
              {name}
            </span>
          </div>

          {/* Live Action & Mood Badges */}
          <div className="flex items-center gap-1">
            {moodBadge && (
              <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider border truncate max-w-[65px] sm:max-w-none ${moodBadge.bg}`}>
                {moodBadge.label}
              </span>
            )}
            <div
              className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1 ${
                isSpeaking
                  ? 'bg-[#292019] text-[#fbf7ee] dark:bg-[#dda070] dark:text-[#18181b] shadow-sm'
                  : isListening
                  ? 'bg-[#292019]/10 dark:bg-white/10 text-[#6b5f52] dark:text-[#a8b2a9]'
                  : 'bg-transparent text-[#8a7b6d]'
              }`}
            >
              {isSpeaking ? (
                <>
                  <Volume2 className="w-2.5 h-2.5 text-[#a8734a] animate-bounce hidden sm:inline" /> Speak
                </>
              ) : isListening ? (
                <>
                  <Eye className="w-2.5 h-2.5 text-[#67795a] hidden sm:inline" /> Listen
                </>
              ) : (
                'Idle'
              )}
            </div>
          </div>
        </div>

        {/* Realistic 2D Graphic Portrait Frame with Live Animations */}
        <div className="relative w-full aspect-[3/4] max-h-[190px] sm:max-h-[340px] rounded-xl sm:rounded-2xl overflow-hidden border sm:border-2 border-[#292019]/10 dark:border-white/15 bg-[#12161b] shadow-inner group">
          
          {/* Natural Respiratory Sine Wave Motion & Speech Nodding */}
          <div
            className={`w-full h-full relative transition-transform duration-700 ${
              isSpeaking
                ? 'animate-[pulse_3.5s_ease-in-out_infinite]'
                : 'hover:scale-105'
            }`}
          >
            <img
              src={activeImage}
              alt={name}
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-cover object-top filter transition-all duration-500 group-hover:contrast-105 ${
                isSpeaking ? 'brightness-[1.03]' : ''
              }`}
            />

            {/* Subtle Eyelid Blink Simulation Overlay */}
            {isBlinking && (
              <div className="absolute top-[28%] inset-x-0 h-4 bg-[#2c1d14]/30 backdrop-blur-[0.5px] pointer-events-none transition-opacity duration-75 animate-in fade-in" />
            )}

            {/* Ambient Sunbeam Dust Motes / Sparkles floating */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
              <span className="absolute top-4 left-6 w-1 h-1 rounded-full bg-white/70 animate-ping duration-1000" />
              <span className="absolute top-16 right-8 w-1.5 h-1.5 rounded-full bg-[#fce7bb]/80 animate-pulse" />
              <span className="absolute bottom-20 left-10 w-1 h-1 rounded-full bg-[#e8d5b5]/60 animate-bounce duration-700" />
            </div>

            {/* Cinematic Gradient Vignette & Rim Light */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />

            {/* Speaking Audio Aura Rings */}
            {isSpeaking && (
              <div
                className="absolute inset-0 border-2 rounded-2xl animate-ping opacity-35 pointer-events-none"
                style={{ borderColor: accentColor }}
              />
            )}

            {/* Subtle Speech Ripple Overlay at Chest/Throat level */}
            {isSpeaking && (
              <div
                className="absolute bottom-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full opacity-30 animate-pulse pointer-events-none blur-xl"
                style={{ backgroundColor: accentColor }}
              />
            )}
          </div>

          {/* Floating Reaction Burst Badge */}
          {reactionBurst && (
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none bg-black/45 backdrop-blur-xs animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-2 rounded-2xl bg-white dark:bg-[#182430] border-2 border-[#a8734a] shadow-2xl text-xs font-black text-[#292019] dark:text-[#f0e6d6] flex items-center gap-2 animate-bounce">
                <span className="text-base">{reactionBurst.icon}</span>
                {reactionBurst.label}
              </div>
            </div>
          )}

          {/* Bottom In-Frame Telemetry & Audio Equalizer */}
          <div className="absolute bottom-0 inset-x-0 p-3 z-20 flex flex-col justify-end">
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold text-white/95 leading-tight flex items-center gap-1">
                  {role}
                </p>
                <p className="text-[9px] font-semibold text-white/75 tracking-tight">
                  {perspective}
                </p>
              </div>

              {/* Dynamic 7-Band Equalizer Bars */}
              {isSpeaking && (
                <div className="flex items-end gap-0.5 h-6 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-xs border border-white/20">
                  {waveformLevels.map((lvl, idx) => (
                    <div
                      key={idx}
                      className="w-1 rounded-full transition-all duration-100"
                      style={{
                        height: `${lvl}%`,
                        backgroundColor: accentColor
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Context & Quick Interactive Reaction Prompts */}
        <div className="mt-2 space-y-1.5">
          {/* Dynamic Insight Banner */}
          <div
            className={`w-full py-1 sm:py-1.5 px-2 sm:px-3 rounded-lg sm:rounded-xl border text-[10px] sm:text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-center ${
              isSpeaking
                ? 'bg-[#a8734a]/15 dark:bg-[#a8734a]/25 border-[#a8734a]/40 text-[#8a5b38] dark:text-[#f3b58e]'
                : isListening
                ? 'bg-[#fbf7ee] dark:bg-[#16222c] border-[#292019]/10 text-[#6b5f52] dark:text-[#a8b2a9]'
                : 'bg-transparent border-transparent text-[#9c8e7c]'
            }`}
          >
            {isAmira ? (
              <TrendingUp className="w-3 h-3 text-[#a8734a] flex-shrink-0" />
            ) : (
              <ShieldCheck className="w-3 h-3 text-[#7d8f6c] flex-shrink-0" />
            )}
            <span className="truncate text-[10px] sm:text-[11px]">
              {isSpeaking
                ? isAmira
                  ? 'Macroeconomic Spillover'
                  : 'Farm Operations & Margins'
                : isAmira
                ? 'Reflecting on Herd Realities'
                : 'Evaluating Policy Transition'}
            </span>
          </div>

          {/* Quick Reaction Emote Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1 pt-0.5">
            {isAmira ? (
              <>
                <button
                  onClick={() => handleManualReaction('data', 'Macro Model Verified', '📊')}
                  className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-[#292019]/5 dark:bg-white/5 hover:bg-[#a8734a]/20 text-[9px] sm:text-[10px] font-bold text-[#6b5f52] dark:text-[#a8b2a9] hover:text-[#a8734a] transition-all cursor-pointer flex items-center gap-1 min-h-[26px]"
                  title="Query Dr. Amira's Economic Model"
                >
                  <BarChart2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Data
                </button>
                <button
                  onClick={() => handleManualReaction('foresight', '10-Year Horizon Evaluated', '💡')}
                  className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-[#292019]/5 dark:bg-white/5 hover:bg-[#a8734a]/20 text-[9px] sm:text-[10px] font-bold text-[#6b5f52] dark:text-[#a8b2a9] hover:text-[#a8734a] transition-all cursor-pointer flex items-center gap-1 min-h-[26px]"
                  title="Explore Long-Term AMR Horizon"
                >
                  <Lightbulb className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Insight
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleManualReaction('herd', 'Herd Biosecurity Checked', '🛡️')}
                  className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-[#292019]/5 dark:bg-white/5 hover:bg-[#7d8f6c]/20 text-[9px] sm:text-[10px] font-bold text-[#6b5f52] dark:text-[#a8b2a9] hover:text-[#7d8f6c] transition-all cursor-pointer flex items-center gap-1 min-h-[26px]"
                  title="Check Farm Herd Health Protocol"
                >
                  <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Bio
                </button>
                <button
                  onClick={() => handleManualReaction('margins', 'Farm-Gate Cashflow Assessed', '📈')}
                  className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-[#292019]/5 dark:bg-white/5 hover:bg-[#7d8f6c]/20 text-[9px] sm:text-[10px] font-bold text-[#6b5f52] dark:text-[#a8b2a9] hover:text-[#7d8f6c] transition-all cursor-pointer flex items-center gap-1 min-h-[26px]"
                  title="Review Farm Working Capital"
                >
                  <Activity className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Cost
                </button>
              </>
            )}
            <button
              onClick={() => handleManualReaction('consensus', 'Handshake Agreement', '🤝')}
              className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-[#292019]/5 dark:bg-white/5 hover:bg-[#c8875a]/20 text-[9px] sm:text-[10px] font-bold text-[#6b5f52] dark:text-[#a8b2a9] hover:text-[#c8875a] transition-all cursor-pointer flex items-center gap-1 min-h-[26px]"
              title="Test Collaborative Agreement"
            >
              <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
