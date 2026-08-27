import React, { useState } from 'react';
import { ChapterMeta } from '../types';
import { IMAGES } from '../data/chaptersData';
import { audioController } from '../utils/sound';
import {
  Shield,
  DollarSign,
  Layers,
  Scale,
  Stethoscope,
  Microscope,
  Award,
  Truck,
  Store,
  FileCheck,
  Zap,
  Info,
  Volume2,
  Brain,
  Compass,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ChapterSceneBriefingProps {
  chapter: ChapterMeta;
  onExploreTerm?: (term: string) => void;
  onSelectChoice?: (choice: string) => void;
}

export const ChapterSceneBriefing: React.FC<ChapterSceneBriefingProps> = ({
  chapter,
  onExploreTerm
}) => {
  // Active perspective tab: 'both' | 'amira' | 'mohamed'
  const [activeFocus, setActiveFocus] = useState<'both' | 'amira' | 'mohamed'>('both');

  // Chapter 1 (ch1): Selected Compound Purpose
  const [selectedPurpose, setSelectedPurpose] = useState<'growth' | 'prophylaxis' | 'metaphylaxis' | 'therapeutic'>('prophylaxis');

  // Chapter 2 (ch2): AMR Mutation Dosage Mode
  const [dosageMode, setDosageMode] = useState<'low' | 'optimal'>('low');

  // Chapter 3 (ch3): Farm Economics Simulation Sliders
  const [herdCount, setHerdCount] = useState<number>(650);
  const [biosecurityLevel, setBiosecurityLevel] = useState<'basic' | 'moderate' | 'advanced'>('moderate');

  // Chapter 4 (ch4): Value Chain Node
  const [activeChainStep, setActiveChainStep] = useState<number>(0);

  // Chapter 5 (ch5): Regional Horizon
  const [selectedRegion, setSelectedRegion] = useState<'global' | 'asia' | 'americas' | 'africa' | 'europe'>('global');

  // Epilogue: Signed Pillars
  const [signedPillars, setSignedPillars] = useState<Record<string, boolean>>({
    subsidies: true,
    diagnostics: true,
    surveillance: true,
    labeling: false
  });

  // Calculate Farm Economics for Chapter 3
  const calculateFarmEconomics = () => {
    const revenuePerHead = 420;
    const baseFeedCost = 210;
    
    let amuCostPerHead = 18;
    let bioUpgradeCostPerHead = 0;
    let expectedMortalityRate = 0.04;

    if (biosecurityLevel === 'basic') {
      amuCostPerHead = 22;
      bioUpgradeCostPerHead = 3;
      expectedMortalityRate = 0.045;
    } else if (biosecurityLevel === 'moderate') {
      amuCostPerHead = 9;
      bioUpgradeCostPerHead = 14;
      expectedMortalityRate = 0.022;
    } else {
      amuCostPerHead = 3;
      bioUpgradeCostPerHead = 24;
      expectedMortalityRate = 0.011;
    }

    const grossRevenue = herdCount * revenuePerHead;
    const totalAmuCost = herdCount * amuCostPerHead;
    const totalBioCost = herdCount * bioUpgradeCostPerHead;
    const totalFeedCost = herdCount * baseFeedCost;
    const mortalityLoss = herdCount * expectedMortalityRate * revenuePerHead;
    const netMargin = grossRevenue - totalFeedCost - totalAmuCost - totalBioCost - mortalityLoss;
    const netMarginPerHead = Math.round(netMargin / herdCount);

    return {
      grossRevenue,
      totalAmuCost,
      totalBioCost,
      mortalityLoss,
      netMargin,
      netMarginPerHead,
      expectedMortalityRate: (expectedMortalityRate * 100).toFixed(1)
    };
  };

  const farmMetrics = calculateFarmEconomics();

  // Perspective content normalized across chapter IDs (supports 'prologue'|'ch1'|'ch2' etc.)
  const getPerspectives = () => {
    const cid = chapter.id;

    if (cid === 'prologue') {
      return {
        amira: {
          name: 'Dr. Amira',
          title: 'One Health Lead',
          badge: 'Macroeconomic & Global Health',
          dialogue: 'Every sub-optimal antimicrobial dose creates an unpriced health risk that compounds across hospitals for decades.',
          thought: 'If we deplete first-line antimicrobials, routine surgeries in human medicine become life-threatening.',
          horizon: '10–30 Years Horizon',
          avatar: IMAGES.amiraPortrait,
          accent: '#a8734a'
        },
        mohamed: {
          name: 'Mohamed',
          title: 'Livestock Producer',
          badge: 'Farm Solvency & Herd Security',
          dialogue: 'If a bacterial wave hits my feedlot, I can lose my entire season margin in 72 hours without transition buffers.',
          thought: 'Feed prices are up 14%. Without subsidized ventilation upgrades, cutting preventive treatments risks catastrophic mortality.',
          horizon: '30–90 Days Cash Cycle',
          avatar: IMAGES.mohamedPortrait,
          accent: '#7d8f6c'
        }
      };
    }

    if (cid === 'ch1' || cid === 'chapter1') {
      return {
        amira: {
          name: 'Dr. Amira',
          title: 'Researcher',
          badge: 'Microbial Stewardship',
          dialogue: 'Using human-critical antibiotics as cheap feed growth promoters is a dangerous shortcut for lacking infrastructure.',
          thought: 'Sub-therapeutic AGPs accelerate bacterial tolerance without providing genuine clinical treatment.',
          horizon: 'Global Efficacy Baseline',
          avatar: IMAGES.amiraPortrait,
          accent: '#a8734a'
        },
        mohamed: {
          name: 'Mohamed',
          title: 'Herd Manager',
          badge: 'Livestock Caretaker',
          dialogue: 'Prophylactic batch mixing protects against weaning stress. Give me affordable alternatives that keep calves alive.',
          thought: 'I want healthy animals, but high stocking densities make preventive dosing our primary safety net.',
          horizon: 'Weaning & Shipping Window',
          avatar: IMAGES.mohamedPortrait,
          accent: '#7d8f6c'
        }
      };
    }

    if (cid === 'ch2' || cid === 'chapter2') {
      return {
        amira: {
          name: 'Dr. Amira',
          title: 'Microbiologist',
          badge: 'Genomic Surveillance',
          dialogue: 'Under sub-lethal antibiotic pressure, bacteria don’t just survive—they trade resistance plasmids across species barriers.',
          thought: 'The colistin resistance genes identified in agricultural runoff are already appearing in human ICUs.',
          horizon: 'Molecular Mutation Clock',
          avatar: IMAGES.amiraPortrait,
          accent: '#a23b34'
        },
        mohamed: {
          name: 'Mohamed',
          title: 'Farm Operator',
          badge: 'Clinical Outbreak Risk',
          dialogue: 'When standard treatment failed on pen 3 last autumn, I watched 12 heifers succumb in two days. Drug failure is terrifying.',
          thought: 'We followed the label dosage exactly, yet it did nothing. The reliable medicines are losing their power.',
          horizon: 'Immediate Pen Outbreak',
          avatar: IMAGES.mohamedPortrait,
          accent: '#7d8f6c'
        }
      };
    }

    if (cid === 'ch3' || cid === 'chapter3') {
      return {
        amira: {
          name: 'Dr. Amira',
          title: 'Policy Economist',
          badge: 'Transition Finance',
          dialogue: 'It is unreasonable to demand farmers privately fund a global health transition without low-interest loans and subsidized tests.',
          thought: 'A $25/head transition grant produces an 18-fold societal return in avoided medical costs.',
          horizon: '5-Year Transition Arc',
          avatar: IMAGES.amiraPortrait,
          accent: '#a8734a'
        },
        mohamed: {
          name: 'Mohamed',
          title: 'Commercial Producer',
          badge: 'Operating Margins',
          dialogue: 'My net profit is $28 per head. Barn ventilation upgrades cost $14 per animal—half my yearly profit in one shot.',
          thought: 'With co-funding and guaranteed buyer contracts, I would install automated bedding drying tomorrow.',
          horizon: 'Annual Balance Sheet',
          avatar: IMAGES.mohamedPortrait,
          accent: '#7d8f6c'
        }
      };
    }

    if (cid === 'ch4' || cid === 'chapter4') {
      return {
        amira: {
          name: 'Dr. Amira',
          title: 'Value Chain Analyst',
          badge: 'Market Transmission',
          dialogue: 'Retailers and food processors hold immense leverage. Their procurement standards set the rules on the ground.',
          thought: 'Transparent certification programs shift antimicrobial stewardship from a regulatory cost to a market premium.',
          horizon: 'Retail Sourcing Cycles',
          avatar: IMAGES.amiraPortrait,
          accent: '#6d80c4'
        },
        mohamed: {
          name: 'Mohamed',
          title: 'Contract Producer',
          badge: 'Supply Chain Partner',
          dialogue: 'If the meat processor guarantees a price premium for certified prudent-use herds, my bank approves the barn retrofit.',
          thought: 'Clear standards and verified contracts let good farmers thrive while protecting consumers.',
          horizon: 'Processing Contracts',
          avatar: IMAGES.mohamedPortrait,
          accent: '#7d8f6c'
        }
      };
    }

    if (cid === 'ch5' || cid === 'chapter5') {
      return {
        amira: {
          name: 'Dr. Amira',
          title: 'Econometrician',
          badge: 'Global Trajectories',
          dialogue: 'By 2040, global livestock antimicrobial consumption will reach 143,481 tonnes—concentrating heavily in emerging markets.',
          thought: 'One-size-fits-all mandates fail because regional production systems operate from entirely different infrastructure baselines.',
          horizon: '2020–2040 Global Trend',
          avatar: IMAGES.amiraPortrait,
          accent: '#dd9f66'
        },
        mohamed: {
          name: 'Mohamed',
          title: 'Producer Leader',
          badge: 'Practical Application',
          dialogue: 'Fast-growing regions need scalable husbandry tools, not just export restrictions that punish local food security.',
          thought: 'Targeted support in expanding markets prevents the mistakes older agricultural models made decades ago.',
          horizon: 'Generational Food Supply',
          avatar: IMAGES.mohamedPortrait,
          accent: '#7d8f6c'
        }
      };
    }

    // Default / Epilogue
    return {
      amira: {
        name: 'Dr. Amira',
        title: 'One Health Lead',
        badge: 'Global Accord',
        dialogue: 'AMR requires systemic alignment—connecting animal welfare, human medicine, soil health, and international finance.',
        thought: 'RENOFARM bridges the gap between scientific consensus and realistic agricultural economics.',
        horizon: 'Planetary Security Horizon',
        avatar: IMAGES.amiraPortrait,
        accent: '#a8734a'
      },
      mohamed: {
        name: 'Mohamed',
        title: 'Producer Steward',
        badge: 'Sustainable Livelihood',
        dialogue: 'When policy respects the farmer’s reality and supports practical transitions, we protect both our herds and our shared medicines.',
        thought: 'Precision farming and transparent premiums allow our children to inherit a resilient, honorable livelihood.',
        horizon: 'Multi-Generational Legacy',
        avatar: IMAGES.mohamedPortrait,
        accent: '#7d8f6c'
      }
    };
  };

  const p = getPerspectives();

  return (
    <div className="mb-10 max-w-5xl mx-auto">
      {/* ========================================================================= */}
      {/* CLASSIC COMIC STRIP CANVAS CONTAINER                                      */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border-3 border-[#292019] dark:border-[#e6d7c3]/30 bg-[#fbf8f2] dark:bg-[#141d27] shadow-[6px_6px_0px_0px_rgba(41,32,25,0.85)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] overflow-hidden transition-all">
        
        {/* Comic Strip Header / Issue Banner */}
        <div className="px-4 sm:px-6 py-3 bg-[#292019] text-[#f4ead8] border-b-3 border-[#292019] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-md bg-[#dda070] text-[#1c140e] font-black text-[11px] uppercase tracking-wider shadow-sm">
              ISSUE // {chapter.number}
            </span>
            <h3 className="font-serif font-black text-base sm:text-lg tracking-wide text-[#f4ead8]">
              Perspective Dialogue Studio · <span className="text-[#dda070] italic">{chapter.kicker}</span>
            </h3>
          </div>

          {/* Quick Perspective Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#1a1410] p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => {
                audioController.playPop();
                setActiveFocus('both');
              }}
              className={`px-3 py-1 rounded-lg font-black transition-all cursor-pointer ${
                activeFocus === 'both'
                  ? 'bg-[#dda070] text-[#1c140e] shadow-sm'
                  : 'text-[#a89d91] hover:text-white'
              }`}
            >
              Dual Perspective
            </button>
            <button
              onClick={() => {
                audioController.playPop();
                setActiveFocus('amira');
              }}
              className={`px-3 py-1 rounded-lg font-black transition-all cursor-pointer ${
                activeFocus === 'amira'
                  ? 'bg-[#a8734a] text-white shadow-sm'
                  : 'text-[#a89d91] hover:text-white'
              }`}
            >
              Dr. Amira
            </button>
            <button
              onClick={() => {
                audioController.playPop();
                setActiveFocus('mohamed');
              }}
              className={`px-3 py-1 rounded-lg font-black transition-all cursor-pointer ${
                activeFocus === 'mohamed'
                  ? 'bg-[#7d8f6c] text-white shadow-sm'
                  : 'text-[#a89d91] hover:text-white'
              }`}
            >
              Mohamed
            </button>
          </div>
        </div>

        {/* Narrative Context Strip (Yellow Comic Caption Bar) */}
        <div className="px-5 py-2.5 bg-[#f5e5a3] dark:bg-[#2d2a1a] border-b-2 border-[#292019]/20 dark:border-white/10 flex items-center justify-between text-xs font-serif italic text-[#3d3215] dark:text-[#f3e5aa]">
          <span>
            <strong>Setting the Scene:</strong> Two real-world stakeholders deliberate on livestock welfare, economics, and microbial safety.
          </span>
          <span className="hidden sm:inline font-mono font-bold text-[11px] uppercase tracking-wider text-[#735d1f] dark:text-[#c4b370]">
            TAP AUDIO ICONS TO HEAR VOICES
          </span>
        </div>

        {/* ========================================================================= */}
        {/* COMIC PANELS ROW (DUAL CHARACTER PERSPECTIVES)                            */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#fbf8f2] dark:bg-[#141d27]">
          
          {/* PANEL 1: DR. AMIRA (SCIENCE & POLICY PERSPECTIVE) */}
          {(activeFocus === 'both' || activeFocus === 'amira') && (
            <div
              className={`relative rounded-2xl border-3 border-[#292019] dark:border-white/20 bg-white dark:bg-[#1b2735] p-5 shadow-[4px_4px_0px_0px_rgba(41,32,25,0.7)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] flex flex-col justify-between transition-all ${
                activeFocus === 'amira' ? 'md:col-span-2' : ''
              }`}
            >
              {/* Comic Panel Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#292019]/15 dark:border-white/10 mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#292019] shadow-sm flex-shrink-0">
                    <img
                      src={p.amira.avatar}
                      alt="Dr. Amira"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-black text-lg text-[#292019] dark:text-[#f0e6d6]">
                        {p.amira.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-[#a8734a]/15 text-[#8a5b38] dark:text-[#dda070] text-[10px] font-black uppercase">
                        {p.amira.title}
                      </span>
                    </div>
                    <p className="text-xs text-[#6b5f52] dark:text-[#a8b2a9] font-medium">
                      {p.amira.badge}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => audioController.speakText(p.amira.dialogue, 'a')}
                  className="p-2.5 rounded-xl bg-[#a8734a]/10 hover:bg-[#a8734a]/20 text-[#a8734a] transition-all cursor-pointer hover:scale-105"
                  title="Listen to Dr. Amira"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Comic Speech Balloon (Spoken Dialogue) */}
              <div className="space-y-4">
                <div className="relative p-4 rounded-2xl bg-[#fdfbf7] dark:bg-[#111923] border-2 border-[#292019] dark:border-white/20 shadow-xs text-xs sm:text-sm text-[#292019] dark:text-[#f0e6d6] font-serif leading-relaxed">
                  <span className="font-sans font-black text-[10px] uppercase text-[#a8734a] block mb-1 tracking-wider">
                    💬 What She Says:
                  </span>
                  “{p.amira.dialogue}”
                </div>

                {/* Comic Thought Cloud (Inner Strategic View) */}
                <div className="p-3.5 rounded-2xl bg-[#a8734a]/10 border-2 border-dashed border-[#a8734a]/40 text-xs text-[#523722] dark:text-[#dda070] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-[#a8734a]">
                    <Brain className="w-3.5 h-3.5" />
                    <span>💭 Internal Strategic Calculation:</span>
                  </div>
                  <p className="italic font-medium">"{p.amira.thought}"</p>
                </div>
              </div>

              {/* Panel Footer Horizon Tag */}
              <div className="mt-4 pt-3 border-t border-[#292019]/10 dark:border-white/10 flex items-center justify-between text-[11px] font-bold text-[#8a7b6d] dark:text-[#8ea0b2]">
                <span>Decision Horizon:</span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#292019] text-white dark:bg-white/10 text-[11px]">
                  {p.amira.horizon}
                </span>
              </div>
            </div>
          )}

          {/* PANEL 2: MOHAMED (FARM GATE & SOLVENCY PERSPECTIVE) */}
          {(activeFocus === 'both' || activeFocus === 'mohamed') && (
            <div
              className={`relative rounded-2xl border-3 border-[#292019] dark:border-white/20 bg-white dark:bg-[#1b2735] p-5 shadow-[4px_4px_0px_0px_rgba(41,32,25,0.7)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] flex flex-col justify-between transition-all ${
                activeFocus === 'mohamed' ? 'md:col-span-2' : ''
              }`}
            >
              {/* Comic Panel Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#292019]/15 dark:border-white/10 mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#292019] shadow-sm flex-shrink-0">
                    <img
                      src={p.mohamed.avatar}
                      alt="Mohamed"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-black text-lg text-[#292019] dark:text-[#f0e6d6]">
                        {p.mohamed.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-[#7d8f6c]/15 text-[#55663f] dark:text-[#a9bd9e] text-[10px] font-black uppercase">
                        {p.mohamed.title}
                      </span>
                    </div>
                    <p className="text-xs text-[#6b5f52] dark:text-[#a8b2a9] font-medium">
                      {p.mohamed.badge}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => audioController.speakText(p.mohamed.dialogue, 's')}
                  className="p-2.5 rounded-xl bg-[#7d8f6c]/10 hover:bg-[#7d8f6c]/20 text-[#7d8f6c] transition-all cursor-pointer hover:scale-105"
                  title="Listen to Mohamed"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Comic Speech Balloon (Spoken Dialogue) */}
              <div className="space-y-4">
                <div className="relative p-4 rounded-2xl bg-[#fdfbf7] dark:bg-[#111923] border-2 border-[#292019] dark:border-white/20 shadow-xs text-xs sm:text-sm text-[#292019] dark:text-[#f0e6d6] font-serif leading-relaxed">
                  <span className="font-sans font-black text-[10px] uppercase text-[#7d8f6c] block mb-1 tracking-wider">
                    💬 What He Says:
                  </span>
                  “{p.mohamed.dialogue}”
                </div>

                {/* Comic Thought Cloud (Inner Operational Reality) */}
                <div className="p-3.5 rounded-2xl bg-[#7d8f6c]/10 border-2 border-dashed border-[#7d8f6c]/40 text-xs text-[#3c4a2c] dark:text-[#a9bd9e] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-[#7d8f6c]">
                    <Shield className="w-3.5 h-3.5" />
                    <span>💭 Internal Farm-Gate Concern:</span>
                  </div>
                  <p className="italic font-medium">"{p.mohamed.thought}"</p>
                </div>
              </div>

              {/* Panel Footer Horizon Tag */}
              <div className="mt-4 pt-3 border-t border-[#292019]/10 dark:border-white/10 flex items-center justify-between text-[11px] font-bold text-[#8a7b6d] dark:text-[#8ea0b2]">
                <span>Decision Horizon:</span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#292019] text-white dark:bg-white/10 text-[11px]">
                  {p.mohamed.horizon}
                </span>
              </div>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE SCENARIO EXPERIMENT PANEL (CHAPTER SPECIFIC)                  */}
        {/* ========================================================================= */}
        {chapter.id !== 'prologue' && (
          <div className="p-4 sm:p-6 bg-[#f4ecd8] dark:bg-[#111821] border-t-3 border-[#292019] dark:border-white/20 space-y-4">
            
            {/* CHAPTER 1 (ch1): ANTIMICROBIAL COMPOUND PURPOSES */}
            {(chapter.id === 'ch1' || chapter.id === 'chapter1') && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#182330] border-2 border-[#292019] dark:border-white/10 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-serif font-black text-sm text-[#292019] dark:text-[#f0e6d6] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#a8734a]" />
                  Select Antimicrobial Application in the Production Cycle:
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'growth', label: 'Growth Promotion', share: '32%', color: '#a23b34' },
                  { id: 'prophylaxis', label: 'Prophylaxis (Preventive)', share: '41%', color: '#dd9f66' },
                  { id: 'metaphylaxis', label: 'Metaphylaxis (Batch)', share: '18%', color: '#6d80c4' },
                  { id: 'therapeutic', label: 'Targeted Clinical', share: '9%', color: '#7d8f6c' }
                ].map((item) => {
                  const isSelected = selectedPurpose === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        audioController.playPop();
                        setSelectedPurpose(item.id as any);
                      }}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#fbf8f2] dark:bg-[#202e3e] shadow-md scale-[1.02]'
                          : 'bg-white/60 dark:bg-[#131b24]/60 border-[#292019]/10'
                      }`}
                      style={{ borderColor: isSelected ? item.color : undefined }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-[#292019] dark:text-[#f0e6d6]">{item.label}</span>
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">{item.share}</span>
                      </div>
                      <span className="text-[10px] font-bold block" style={{ color: item.color }}>
                        {item.id === 'therapeutic' ? 'FAO Recommended' : 'Phase-Out Priority'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="p-3.5 rounded-xl bg-[#fbf8f2] dark:bg-[#0f1620] border border-[#292019]/10 text-xs text-[#292019] dark:text-[#f0e6d6]">
                {selectedPurpose === 'growth' && 'Sub-therapeutic feed additives used solely for weight gain are being completely phased out globally.'}
                {selectedPurpose === 'prophylaxis' && 'Routine preventive mass-dosing can be superseded by improved barn ventilation, bio-filters, and tailored vaccines.'}
                {selectedPurpose === 'metaphylaxis' && 'Treating an entire pen under transport stress is replaced by pre-transport electrolytes and local quarantine.'}
                {selectedPurpose === 'therapeutic' && 'Precision individual treatment following rapid pen-side laboratory diagnostics protects animal welfare with minimal volume.'}
              </div>
            </div>
          )}

          {/* CHAPTER 2 (ch2): AMR MUTATION PRESSURE SIMULATOR */}
          {(chapter.id === 'ch2' || chapter.id === 'chapter2') && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#182330] border-2 border-[#292019] dark:border-white/10 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-serif font-black text-sm text-[#292019] dark:text-[#f0e6d6] flex items-center gap-2">
                  <Microscope className="w-4 h-4 text-[#a23b34]" />
                  Microbial Selection Pressure Simulator
                </span>

                <div className="flex items-center gap-2 bg-[#f4ecd8] dark:bg-[#101720] p-1 rounded-xl border border-[#292019]/10">
                  <button
                    onClick={() => {
                      audioController.playPop();
                      setDosageMode('low');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      dosageMode === 'low' ? 'bg-[#a23b34] text-white shadow-xs' : 'text-[#6b5f52] dark:text-[#a8b2a9]'
                    }`}
                  >
                    Sub-Therapeutic Dose
                  </button>
                  <button
                    onClick={() => {
                      audioController.playPop();
                      setDosageMode('optimal');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      dosageMode === 'optimal' ? 'bg-[#7d8f6c] text-white shadow-xs' : 'text-[#6b5f52] dark:text-[#a8b2a9]'
                    }`}
                  >
                    Targeted Clinical Dose
                  </button>
                </div>
              </div>

              {/* 50-Dot Bacterial Simulation Matrix */}
              <div className="grid grid-cols-10 gap-2 p-3 rounded-xl bg-[#0f1720] border border-white/10">
                {Array.from({ length: 40 }).map((_, i) => {
                  const isResistant = dosageMode === 'low' ? i < 28 : i < 3;
                  return (
                    <div
                      key={i}
                      className={`h-4 rounded-md transition-all duration-300 ${
                        isResistant
                          ? 'bg-[#a23b34] shadow-[0_0_8px_rgba(162,59,52,0.8)] animate-pulse'
                          : 'bg-[#7d8f6c]'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-[#8a7b6d]">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#7d8f6c]" /> Susceptible Commensal Microbes</span>
                <span className="flex items-center gap-1.5 text-[#a23b34]"><span className="w-2.5 h-2.5 rounded bg-[#a23b34]" /> Resistant Mutants Surviving</span>
              </div>
            </div>
          )}

          {/* CHAPTER 3 (ch3): FARM-GATE ECONOMICS CALCULATOR */}
          {(chapter.id === 'ch3' || chapter.id === 'chapter3') && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#182330] border-2 border-[#292019] dark:border-white/10 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-serif font-black text-sm text-[#292019] dark:text-[#f0e6d6] flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#7d8f6c]" />
                  Herd Operating Margin vs. Biosecurity Upgrade Simulator
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#7d8f6c]/15 text-[#55663f] dark:text-[#a9bd9e]">
                  Net Margin: ${farmMetrics.netMarginPerHead} / Head
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[#292019] dark:text-[#f0e6d6]">
                    <span>Herd Size:</span>
                    <span>{herdCount} Head</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="1500"
                    step="50"
                    value={herdCount}
                    onChange={(e) => setHerdCount(Number(e.target.value))}
                    className="w-full h-2 bg-[#e8ddc7] dark:bg-[#253545] rounded-lg appearance-none cursor-pointer accent-[#7d8f6c]"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-[#292019] dark:text-[#f0e6d6] block">
                    Barn Biosecurity Investment:
                  </span>
                  <div className="flex gap-2">
                    {(['basic', 'moderate', 'advanced'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => {
                          audioController.playPop();
                          setBiosecurityLevel(lvl);
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                          biosecurityLevel === lvl
                            ? 'bg-[#292019] text-white dark:bg-[#dda070] dark:text-[#182430]'
                            : 'bg-[#f4ecd8] dark:bg-[#101720] text-[#6b5f52] dark:text-[#a8b2a9]'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#292019]/10 text-center text-xs">
                <div className="p-2 rounded-lg bg-[#fbf8f2] dark:bg-[#101720]">
                  <span className="text-[10px] text-[#8a7b6d] block">Medicine Spend</span>
                  <span className="font-bold text-[#a23b34]">${farmMetrics.totalAmuCost.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#fbf8f2] dark:bg-[#101720]">
                  <span className="text-[10px] text-[#8a7b6d] block">Facility Upgrade</span>
                  <span className="font-bold text-[#7d8f6c]">${farmMetrics.totalBioCost.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#fbf8f2] dark:bg-[#101720]">
                  <span className="text-[10px] text-[#8a7b6d] block">Expected Mortality</span>
                  <span className="font-bold text-[#292019] dark:text-[#f0e6d6]">{farmMetrics.expectedMortalityRate}%</span>
                </div>
              </div>
            </div>
          )}

          {/* CHAPTER 4 (ch4): VALUE CHAIN TRANSMISSION */}
          {(chapter.id === 'ch4' || chapter.id === 'chapter4') && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#182330] border-2 border-[#292019] dark:border-white/10 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-serif font-black text-sm text-[#292019] dark:text-[#f0e6d6] flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#6d80c4]" />
                  Value Chain Transmission of Financial Incentives
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { title: '1. Farm Gate', desc: 'Vaccines & Airflow' },
                  { title: '2. Processor', desc: 'Residue Testing' },
                  { title: '3. Retailer', desc: 'Certified Labels' },
                  { title: '4. Consumer', desc: 'Trust & Premium' }
                ].map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      audioController.playPop();
                      setActiveChainStep(idx);
                    }}
                    className={`p-2.5 rounded-xl text-center border-2 transition-all cursor-pointer ${
                      activeChainStep === idx
                        ? 'bg-[#6d80c4] text-white border-[#292019] shadow-sm'
                        : 'bg-[#fbf8f2] dark:bg-[#101720] border-[#292019]/10 text-[#6b5f52] dark:text-[#a8b2a9]'
                    }`}
                  >
                    <span className="font-bold text-xs block">{step.title}</span>
                    <span className="text-[10px] block opacity-80">{step.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          </div>
        )}

      </div>
    </div>
  );
};
