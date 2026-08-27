import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChapterDecision, CharacterMood } from '../types';
import { IMAGES } from '../data/chaptersData';
import { audioController } from '../utils/sound';
import {
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  TrendingUp,
  DollarSign,
  Sparkles,
  CheckCircle2,
  Sliders,
  ChevronRight,
  ArrowRight,
  Zap,
  Award
} from 'lucide-react';

interface ChapterDecisionBranchProps {
  decision: ChapterDecision;
  currentChoice: 'A' | 'B' | null;
  onMakeChoice: (choice: 'A' | 'B') => void;
  onOpenPolicySimulator?: () => void;
}

const getMoodBadge = (mood: CharacterMood) => {
  switch (mood) {
    case 'alarmed':
      return { label: 'Alarmed ⚡', bg: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30' };
    case 'skeptical':
      return { label: 'Skeptical 🧐', bg: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30' };
    case 'determined':
      return { label: 'Determined 🛡️', bg: 'bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30' };
    case 'optimistic':
      return { label: 'Optimistic 💡', bg: 'bg-blue-500/15 text-blue-800 dark:text-blue-300 border-blue-500/30' };
    case 'consensus':
      return { label: 'In Consensus 🤝', bg: 'bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-500/30' };
    case 'concerned':
      return { label: 'Concerned ⚠️', bg: 'bg-orange-500/15 text-orange-800 dark:text-orange-300 border-orange-500/30' };
    default:
      return { label: 'Thinking 💭', bg: 'bg-[#a8734a]/15 text-[#8a5b38] dark:text-[#dda070] border-[#a8734a]/30' };
  }
};

export const ChapterDecisionBranch: React.FC<ChapterDecisionBranchProps> = ({
  decision,
  currentChoice,
  onMakeChoice,
  onOpenPolicySimulator
}) => {
  // Default to B if unselected, or selected option
  const activeOption = currentChoice === 'A' ? decision.optionA : decision.optionB;
  const isSelectedA = currentChoice === 'A';
  const isSelectedB = currentChoice === 'B';

  const amiraReaction = activeOption.characterReactions.amira;
  const mohamedReaction = activeOption.characterReactions.mohamed;

  const amiraBadge = getMoodBadge(amiraReaction.mood);
  const mohamedBadge = getMoodBadge(mohamedReaction.mood);

  return (
    <div className="relative rounded-3xl bg-white dark:bg-[#15212c] border-3 border-[#292019] dark:border-white/20 shadow-[6px_6px_0px_0px_rgba(41,32,25,0.8)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] overflow-hidden my-8">
      {/* Header Bar */}
      <div className="p-4 sm:p-6 bg-[#fbf7ee] dark:bg-[#1a2836] border-b-2 border-[#292019]/15 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-[#a8734a] text-white flex items-center justify-center shadow-md flex-shrink-0">
            <GitBranch className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-[#292019] text-[#dda070] dark:bg-[#dda070] dark:text-[#182430]">
                Branching Dilemma · Scene {decision.chapterNumber}
              </span>
              <span className="text-[11px] sm:text-xs text-[#8a7b6d] dark:text-[#8ea0b2] font-mono">
                {decision.chapterTitle}
              </span>
            </div>
            <h3 className="font-serif font-black text-lg sm:text-2xl text-[#292019] dark:text-[#f0e6d6] mt-0.5">
              {decision.dilemmaQuestion}
            </h3>
          </div>
        </div>

        {onOpenPolicySimulator && (
          <button
            onClick={() => {
              audioController.playPop();
              onOpenPolicySimulator();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#6d80c4]/15 hover:bg-[#6d80c4]/25 text-[#54679f] dark:text-[#8ea0e0] border border-[#6d80c4]/30 text-xs font-bold transition-all cursor-pointer shadow-xs min-h-[36px]"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>View in Impact Map</span>
          </button>
        )}
      </div>

      {/* Main Choice Options Grid */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <p className="text-xs sm:text-sm text-[#6b5f52] dark:text-[#a8b2a9] italic">
          💡 <strong>Decision Context:</strong> {decision.contextSummary} Make your choice to steer the story and update the simulated macroeconomic horizon:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Option A Card */}
          <div
            onClick={() => {
              audioController.playPop();
              onMakeChoice('A');
            }}
            className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              isSelectedA
                ? 'bg-amber-50/70 dark:bg-amber-950/20 border-[#a8734a] shadow-[4px_4px_0px_0px_rgba(168,115,74,0.7)]'
                : 'bg-[#fcfbf9] dark:bg-[#182430] border-[#292019]/20 hover:border-[#a8734a]/60 hover:bg-white dark:hover:bg-[#1c2b3a]'
            }`}
          >
            {isSelectedA && (
              <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-[#a8734a] text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Selected Pathway
              </div>
            )}

            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="h-6 w-6 rounded-full bg-[#292019] text-[#fbf7ee] dark:bg-[#dda070] dark:text-[#182430] text-xs font-black flex items-center justify-center">
                  A
                </span>
                <span className="text-[10px] font-mono text-[#8a7b6d] uppercase font-bold">
                  {decision.optionA.tags.join(' · ')}
                </span>
              </div>

              <h4 className="font-serif font-black text-base sm:text-lg text-[#292019] dark:text-[#f0e6d6]">
                {decision.optionA.label}
              </h4>
              <p className="text-xs font-semibold text-[#8a5b38] dark:text-[#dda070] mt-0.5 mb-2">
                {decision.optionA.shortTitle}
              </p>
              <p className="text-xs text-[#6b5f52] dark:text-[#a8b2a9] leading-relaxed mb-4">
                {decision.optionA.description}
              </p>
            </div>

            {/* Impact Metric Chips */}
            <div className="pt-3 border-t border-[#292019]/10 dark:border-white/10 flex flex-wrap items-center gap-2 text-[11px] font-mono">
              <span className={`px-2 py-0.5 rounded font-bold ${decision.optionA.impact.amuReduction > 20 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/15 text-red-700 dark:text-red-300'}`}>
                AMU: {decision.optionA.impact.amuReduction > 0 ? `-${decision.optionA.impact.amuReduction}%` : '0%'}
              </span>
              <span className={`px-2 py-0.5 rounded font-bold ${decision.optionA.impact.farmSolvency >= 0 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/15 text-red-700 dark:text-red-300'}`}>
                Solvency: {decision.optionA.impact.farmSolvency >= 0 ? `+${decision.optionA.impact.farmSolvency}%` : `${decision.optionA.impact.farmSolvency}%`}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#6d80c4]/15 text-[#54679f] dark:text-[#8ea0e0] font-bold">
                Health: {decision.optionA.impact.publicHealthSavingsBillion >= 0 ? `+$${decision.optionA.impact.publicHealthSavingsBillion}B` : `-$${Math.abs(decision.optionA.impact.publicHealthSavingsBillion)}B`}
              </span>
            </div>
          </div>

          {/* Option B Card */}
          <div
            onClick={() => {
              audioController.playPop();
              onMakeChoice('B');
            }}
            className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              isSelectedB
                ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-[#7d8f6c] shadow-[4px_4px_0px_0px_rgba(125,143,108,0.7)]'
                : 'bg-[#fcfbf9] dark:bg-[#182430] border-[#292019]/20 hover:border-[#7d8f6c]/60 hover:bg-white dark:hover:bg-[#1c2b3a]'
            }`}
          >
            {isSelectedB && (
              <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-[#7d8f6c] text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Selected Pathway
              </div>
            )}

            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="h-6 w-6 rounded-full bg-[#7d8f6c] text-white text-xs font-black flex items-center justify-center">
                  B
                </span>
                <span className="text-[10px] font-mono text-[#8a7b6d] uppercase font-bold">
                  {decision.optionB.tags.join(' · ')}
                </span>
              </div>

              <h4 className="font-serif font-black text-base sm:text-lg text-[#292019] dark:text-[#f0e6d6]">
                {decision.optionB.label}
              </h4>
              <p className="text-xs font-semibold text-[#55663f] dark:text-[#a9bd9e] mt-0.5 mb-2">
                {decision.optionB.shortTitle}
              </p>
              <p className="text-xs text-[#6b5f52] dark:text-[#a8b2a9] leading-relaxed mb-4">
                {decision.optionB.description}
              </p>
            </div>

            {/* Impact Metric Chips */}
            <div className="pt-3 border-t border-[#292019]/10 dark:border-white/10 flex flex-wrap items-center gap-2 text-[11px] font-mono">
              <span className={`px-2 py-0.5 rounded font-bold ${decision.optionB.impact.amuReduction > 20 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/15 text-red-700 dark:text-red-300'}`}>
                AMU: -{decision.optionB.impact.amuReduction}%
              </span>
              <span className={`px-2 py-0.5 rounded font-bold ${decision.optionB.impact.farmSolvency >= 0 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/15 text-red-700 dark:text-red-300'}`}>
                Solvency: +{decision.optionB.impact.farmSolvency}%
              </span>
              <span className="px-2 py-0.5 rounded bg-[#6d80c4]/15 text-[#54679f] dark:text-[#8ea0e0] font-bold">
                Health: +${decision.optionB.impact.publicHealthSavingsBillion}B
              </span>
            </div>
          </div>
        </div>

        {/* Live Character Reaction Split Stage */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#f7f2e7] dark:bg-[#121c26] border border-[#292019]/10 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#a8734a] dark:text-[#dda070] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Character Real-Time Reaction to Choice {currentChoice || 'B'}:
            </span>
            <span className="text-[10px] text-[#8a7b6d]">
              Pathway: <strong>{activeOption.shortTitle}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dr. Amira Reaction Box */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#182430] border border-[#a8734a]/20 shadow-xs flex items-start gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#a8734a] flex-shrink-0">
                <img
                  src={IMAGES.amiraPortrait}
                  alt="Dr. Amira"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-serif font-black text-xs text-[#292019] dark:text-[#f0e6d6]">
                    Dr. Amira
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${amiraBadge.bg}`}>
                    {amiraBadge.label}
                  </span>
                </div>
                <p className="text-xs text-[#4a3f35] dark:text-[#c4cec2] italic leading-snug">
                  "{amiraReaction.reaction}"
                </p>
              </div>
            </div>

            {/* Mohamed Reaction Box */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#182430] border border-[#7d8f6c]/20 shadow-xs flex items-start gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#7d8f6c] flex-shrink-0">
                <img
                  src={IMAGES.mohamedPortrait}
                  alt="Mohamed"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-serif font-black text-xs text-[#292019] dark:text-[#f0e6d6]">
                    Mohamed
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${mohamedBadge.bg}`}>
                    {mohamedBadge.label}
                  </span>
                </div>
                <p className="text-xs text-[#4a3f35] dark:text-[#c4cec2] italic leading-snug">
                  "{mohamedReaction.reaction}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
