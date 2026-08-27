import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CHAPTER_DECISIONS } from '../data/decisionsData';
import { audioController } from '../utils/sound';
import {
  GitBranch,
  TrendingUp,
  ShieldCheck,
  HeartPulse,
  DollarSign,
  Award,
  Sparkles,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Info,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

interface VisualImpactMapProps {
  userDecisions: Record<string, 'A' | 'B'>;
  onUpdateDecision: (chapterId: string, choice: 'A' | 'B') => void;
  onSelectChapter?: (chapterId: string) => void;
}

export const VisualImpactMap: React.FC<VisualImpactMapProps> = ({
  userDecisions,
  onUpdateDecision,
  onSelectChapter
}) => {
  const [inspectedChapterId, setInspectedChapterId] = useState<string | null>('prologue');

  const chapterKeys = ['prologue', 'ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7'];

  // Calculate Cumulative Outcomes
  const calculateCumulativeImpact = () => {
    let totalAmuReduction = 0;
    let totalSolvencyScore = 70; // Baseline 70/100
    let totalHealthSavingsBillion = 0;
    let consumerPriceShift = 0;

    chapterKeys.forEach((cid) => {
      const decision = CHAPTER_DECISIONS[cid];
      if (!decision) return;
      const choice = userDecisions[cid] || 'B';
      const opt = choice === 'A' ? decision.optionA : decision.optionB;

      totalAmuReduction += opt.impact.amuReduction;
      totalSolvencyScore += opt.impact.farmSolvency;
      totalHealthSavingsBillion += opt.impact.publicHealthSavingsBillion;
      consumerPriceShift += opt.impact.consumerPriceShiftPct;
    });

    // Normalize AMU reduction to realistic maximum cap (78%)
    const normalizedAmu = Math.min(78, Math.max(5, Math.round(totalAmuReduction / 4.2)));
    const normalizedSolvency = Math.min(99, Math.max(25, totalSolvencyScore));
    const normalizedHealthSavings = totalHealthSavingsBillion;
    const normalizedPrice = Math.max(-1.5, Math.min(18.0, Number((consumerPriceShift / 4).toFixed(1))));

    // Determine Archetype
    let archetype = {
      title: 'The One Health Handshake Accord',
      tagline: 'Balanced Public Health Preservation & High Farm Viability',
      color: 'text-emerald-700 dark:text-emerald-300',
      bg: 'bg-emerald-500/15 border-emerald-500/30',
      summary: 'Your choices successfully aligned farm-level transition subsidies with strict therapeutic veterinary oversight. Global AMU falls dramatically while livestock producers remain highly solvent.'
    };

    if (normalizedSolvency < 55 && normalizedAmu > 40) {
      archetype = {
        title: 'The Producer Squeeze Scenario',
        tagline: 'High Compliance Stringency but Crippling Farm Insolvency',
        color: 'text-amber-700 dark:text-amber-300',
        bg: 'bg-amber-500/15 border-amber-500/30',
        summary: 'While AMU dropped, the lack of co-financed capital grants and fair contract premiums created severe farm foreclosures and industry consolidation.'
      };
    } else if (normalizedAmu < 25 && normalizedHealthSavings < 100) {
      archetype = {
        title: 'The Superbug Inaction Trajectory',
        tagline: 'Status Quo Preservation Leading to Severe Macroeconomic Drag',
        color: 'text-red-700 dark:text-red-300',
        bg: 'bg-red-500/15 border-red-500/30',
        summary: 'Relying on status quo preventative medication and voluntary guidelines allowed resistance genes to compound, accelerating the $1.2T annual global burden.'
      };
    } else if (normalizedPrice > 6.0) {
      archetype = {
        title: 'The Unilateral Trade Friction Path',
        tagline: 'Piecemeal Regulation and Elevated Food Inflation',
        color: 'text-orange-700 dark:text-orange-300',
        bg: 'bg-orange-500/15 border-orange-500/30',
        summary: 'Unilateral trade restrictions and lack of global coordination triggered supply chain bottlenecks and retail meat price inflation.'
      };
    }

    return {
      amuReduction: normalizedAmu,
      farmSolvency: normalizedSolvency,
      healthSavings: normalizedHealthSavings,
      consumerPrice: normalizedPrice,
      archetype
    };
  };

  const impact = calculateCumulativeImpact();

  const handlePreset = (presetType: 'renofarm' | 'statusQuo' | 'unfunded') => {
    audioController.playPop();
    chapterKeys.forEach((cid) => {
      if (presetType === 'renofarm') {
        onUpdateDecision(cid, 'B');
      } else if (presetType === 'statusQuo') {
        onUpdateDecision(cid, 'A');
      } else if (presetType === 'unfunded') {
        // High bans, no subsidies
        onUpdateDecision(cid, cid === 'ch3' || cid === 'ch4' ? 'A' : 'B');
      }
    });
  };

  const inspectedDecision = inspectedChapterId ? CHAPTER_DECISIONS[inspectedChapterId] : null;
  const currentInspectedChoice = inspectedChapterId ? userDecisions[inspectedChapterId] || 'B' : 'B';

  return (
    <div className="space-y-6">
      {/* Top Archetype Banner */}
      <div className={`p-5 rounded-3xl border-2 ${impact.archetype.bg} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#292019] text-[#dda070] dark:bg-[#dda070] dark:text-[#182430]">
              Simulated 10-Year Horizon Trajectory
            </span>
            <span className="text-xs font-bold text-[#8a7b6d] dark:text-[#8ea0b2]">
              {Object.keys(userDecisions).length} Decisions Calibrated
            </span>
          </div>
          <h3 className={`font-serif font-black text-2xl ${impact.archetype.color}`}>
            {impact.archetype.title}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-[#4a3f35] dark:text-[#c4cec2] mt-0.5">
            {impact.archetype.tagline}
          </p>
          <p className="text-xs text-[#6b5f52] dark:text-[#a8b2a9] mt-2 max-w-2xl leading-relaxed">
            {impact.archetype.summary}
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => handlePreset('renofarm')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> All RENOFARM Accord (B)
          </button>
          <button
            onClick={() => handlePreset('statusQuo')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-700/80 hover:bg-amber-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Inaction Baseline (A)
          </button>
        </div>
      </div>

      {/* 4 Cumulative Macro Outcome KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#182430] border border-[#a8734a]/30 shadow-sm text-center">
          <span className="text-[10px] font-black uppercase text-[#8a5b38] dark:text-[#dda070] block">
            Livestock AMU Reduction
          </span>
          <span className="font-serif font-black text-3xl text-[#a8734a] dark:text-[#dda070] mt-1 block">
            -{impact.amuReduction}%
          </span>
          <span className="text-[10px] text-[#8a7b6d] mt-1 block">
            Target: 30–50% by 2030
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#182430] border border-[#7d8f6c]/30 shadow-sm text-center">
          <span className="text-[10px] font-black uppercase text-[#55663f] dark:text-[#a9bd9e] block">
            Farm Solvency Score
          </span>
          <span className={`font-serif font-black text-3xl mt-1 block ${impact.farmSolvency >= 70 ? 'text-[#7d8f6c] dark:text-[#a9bd9e]' : 'text-red-600 dark:text-red-400'}`}>
            {impact.farmSolvency}/100
          </span>
          <span className="text-[10px] text-[#8a7b6d] mt-1 block">
            {impact.farmSolvency >= 70 ? 'High Resilience' : 'Severe Distress'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#182430] border border-[#6d80c4]/30 shadow-sm text-center">
          <span className="text-[10px] font-black uppercase text-[#54679f] dark:text-[#8ea0e0] block">
            Global Health Savings
          </span>
          <span className="font-serif font-black text-3xl text-[#6d80c4] dark:text-[#8ea0e0] mt-1 block">
            {impact.healthSavings >= 0 ? `+$${(impact.healthSavings).toLocaleString()}B` : `-$${Math.abs(impact.healthSavings).toLocaleString()}B`}
          </span>
          <span className="text-[10px] text-[#8a7b6d] mt-1 block">
            Preserved Antimicrobial Efficacy
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#182430] border border-[#c8875a]/30 shadow-sm text-center">
          <span className="text-[10px] font-black uppercase text-[#c8875a] block">
            Consumer Grocery Shift
          </span>
          <span className="font-serif font-black text-3xl text-[#c8875a] mt-1 block">
            {impact.consumerPrice >= 0 ? `+${impact.consumerPrice}%` : `${impact.consumerPrice}%`}
          </span>
          <span className="text-[10px] text-[#8a7b6d] mt-1 block">
            {impact.consumerPrice <= 3.5 ? 'Moderate & Absorbable' : 'High Consumer Squeeze'}
          </span>
        </div>
      </div>

      {/* Interactive 8-Node Decision Flow Canvas */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#16222c] border-2 border-[#292019]/15 dark:border-white/10 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#292019]/10 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-[#a8734a]" />
            <h4 className="font-serif font-black text-lg text-[#292019] dark:text-[#f0e6d6]">
              Interactive Story Decision Nodes & Macro Pathways
            </h4>
          </div>
          <span className="text-xs text-[#8a7b6d]">
            Click any chapter node to inspect its local impact or toggle choices:
          </span>
        </div>

        {/* Horizontal / Grid Node Sequence */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {chapterKeys.map((cid, index) => {
            const dec = CHAPTER_DECISIONS[cid];
            if (!dec) return null;
            const userChoice = userDecisions[cid] || 'B';
            const isInspected = inspectedChapterId === cid;
            const isChoiceA = userChoice === 'A';
            const activeOpt = isChoiceA ? dec.optionA : dec.optionB;

            return (
              <div
                key={cid}
                onClick={() => {
                  audioController.playPop();
                  setInspectedChapterId(cid);
                }}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isInspected
                    ? 'border-[#a8734a] bg-[#fbf7ee] dark:bg-[#1f2d3a] shadow-md ring-2 ring-[#a8734a]/30'
                    : isChoiceA
                    ? 'border-amber-400/40 bg-amber-50/40 dark:bg-amber-950/10 hover:border-amber-500'
                    : 'border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/10 hover:border-emerald-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-black uppercase text-[#8a7b6d] font-mono">
                      Scene {dec.chapterNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      isChoiceA ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300' : 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                    }`}>
                      Path {userChoice}
                    </span>
                  </div>

                  <h5 className="font-serif font-bold text-xs sm:text-sm text-[#292019] dark:text-[#f0e6d6] leading-tight line-clamp-1">
                    {dec.chapterTitle}
                  </h5>
                  <p className="text-[11px] text-[#6b5f52] dark:text-[#a8b2a9] mt-1 line-clamp-2 leading-snug">
                    {activeOpt.shortTitle}
                  </p>
                </div>

                {/* Quick Switch Button */}
                <div className="mt-3 pt-2 border-t border-[#292019]/10 dark:border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#a8734a]">
                    AMU: {activeOpt.impact.amuReduction > 0 ? `-${activeOpt.impact.amuReduction}%` : '0%'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      audioController.playPop();
                      onUpdateDecision(cid, isChoiceA ? 'B' : 'A');
                    }}
                    className="text-[10px] font-bold text-[#8a7b6d] hover:text-[#292019] dark:hover:text-white px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 hover:bg-black/10 transition-colors"
                  >
                    Toggle {isChoiceA ? '→ B' : '→ A'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inspected Node Detail Drawer */}
        {inspectedDecision && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf7ee] dark:bg-[#1c2936] border border-[#a8734a]/30 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#a8734a] block">
                  Detailed Node Inspection · Scene {inspectedDecision.chapterNumber}
                </span>
                <h5 className="font-serif font-black text-lg text-[#292019] dark:text-[#f0e6d6]">
                  {inspectedDecision.chapterTitle}: {inspectedDecision.dilemmaQuestion}
                </h5>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    audioController.playPop();
                    onUpdateDecision(inspectedDecision.chapterId, 'A');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentInspectedChoice === 'A'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white dark:bg-[#121c26] text-[#8a7b6d] border border-[#292019]/10'
                  }`}
                >
                  Choose Path A
                </button>
                <button
                  onClick={() => {
                    audioController.playPop();
                    onUpdateDecision(inspectedDecision.chapterId, 'B');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentInspectedChoice === 'B'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white dark:bg-[#121c26] text-[#8a7b6d] border border-[#292019]/10'
                  }`}
                >
                  Choose Path B
                </button>
              </div>
            </div>

            {/* Side-by-side comparison inside detail card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className={`p-3 rounded-xl border ${currentInspectedChoice === 'A' ? 'bg-white dark:bg-[#15212c] border-amber-500/50' : 'bg-black/5 dark:bg-white/5 border-transparent opacity-70'}`}>
                <div className="font-bold text-amber-700 dark:text-amber-400 mb-1">
                  Option A: {inspectedDecision.optionA.label}
                </div>
                <p className="text-[#6b5f52] dark:text-[#a8b2a9] mb-2 leading-relaxed">
                  {inspectedDecision.optionA.description}
                </p>
                <div className="font-mono text-[10px] text-[#8a7b6d]">
                  Solvency: {inspectedDecision.optionA.impact.farmSolvency}% · Health: +${inspectedDecision.optionA.impact.publicHealthSavingsBillion}B
                </div>
              </div>

              <div className={`p-3 rounded-xl border ${currentInspectedChoice === 'B' ? 'bg-white dark:bg-[#15212c] border-emerald-500/50' : 'bg-black/5 dark:bg-white/5 border-transparent opacity-70'}`}>
                <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                  Option B: {inspectedDecision.optionB.label}
                </div>
                <p className="text-[#6b5f52] dark:text-[#a8b2a9] mb-2 leading-relaxed">
                  {inspectedDecision.optionB.description}
                </p>
                <div className="font-mono text-[10px] text-[#8a7b6d]">
                  Solvency: +{inspectedDecision.optionB.impact.farmSolvency}% · Health: +${inspectedDecision.optionB.impact.publicHealthSavingsBillion}B
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
