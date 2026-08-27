import React, { useState } from 'react';
import { Sliders, Activity, TrendingUp, ShieldCheck, HeartPulse, DollarSign, Award, X, Sparkles, RefreshCw, CheckCircle2, GitBranch, Map } from 'lucide-react';
import { audioController } from '../utils/sound';
import { VisualImpactMap } from './VisualImpactMap';

interface PolicySimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userDecisions?: Record<string, 'A' | 'B'>;
  onUpdateDecision?: (chapterId: string, choice: 'A' | 'B') => void;
  onSelectChapter?: (chapterId: string) => void;
  initialTab?: 'sandbox' | 'impactMap';
}

interface PolicyEvaluationResult {
  evaluationTitle: string;
  summary: string;
  amuReduction: string;
  farmSurvivalScore: string;
  humanHealthcareSavings: string;
  overallScore: number;
  recommendations: string[];
}

export const PolicySimulatorModal: React.FC<PolicySimulatorModalProps> = ({
  isOpen,
  onClose,
  userDecisions = {},
  onUpdateDecision = () => {},
  onSelectChapter,
  initialTab = 'impactMap'
}) => {
  const [activeTab, setActiveTab] = useState<'sandbox' | 'impactMap'>(initialTab);
  const [biosecuritySubsidy, setBiosecuritySubsidy] = useState<number>(30); // $/head
  const [prescriptionMandate, setPrescriptionMandate] = useState<number>(75); // % strictness
  const [diagnosticSpeed, setDiagnosticSpeed] = useState<number>(1); // Days (1, 2, 3, 4)
  const [pricePremium, setPricePremium] = useState<number>(8); // % retail markup
  const [globalAccordTier, setGlobalAccordTier] = useState<'Regional' | 'G20' | 'Global Accord'>('Global Accord');
  
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [result, setResult] = useState<PolicyEvaluationResult | null>(null);

  if (!isOpen) return null;

  const handleRunSimulation = async () => {
    audioController.playPop();
    setIsSimulating(true);

    try {
      const res = await fetch('/api/policy-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          biosecuritySubsidy,
          prescriptionMandate,
          diagnosticSpeed,
          pricePremium,
          globalAccordTier
        })
      });

      if (!res.ok) throw new Error('Simulation endpoint returned error');
      const data = await res.json();
      setResult(data);
      audioController.playStinger();
    } catch (err) {
      console.error('Simulation error:', err);
      // Fallback calculation
      const amu = Math.min(68, Math.max(12, Math.round(biosecuritySubsidy * 0.45 + prescriptionMandate * 0.35 + (5 - diagnosticSpeed) * 5)));
      const farm = Math.min(99, Math.max(55, Math.round(72 + biosecuritySubsidy * 0.4 + pricePremium * 2.2 - prescriptionMandate * 0.15)));
      
      setResult({
        evaluationTitle: "One Health Transition Trajectory",
        summary: `Under this policy mix, livestock AMU intensity decreases by ${amu}%, while the farm survival index remains strong at ${farm}/100. Proactive biosecurity subsidies prevent herd health shocks.`,
        amuReduction: `-${amu}%`,
        farmSurvivalScore: `${farm}/100`,
        humanHealthcareSavings: `$${(amu * 26).toLocaleString()} Billion`,
        overallScore: Math.round((amu + farm) / 2),
        recommendations: [
          "Prioritize penside diagnostic kit deployment to maintain turnarounds under 24 hours.",
          "Channel capital grants toward improved ventilation and isolation pens in high-density facilities.",
          "Establish national veterinary registries to oversee antimicrobials of critical human importance."
        ]
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          audioController.playPop();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 smooth-layer"
    >
      <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col rounded-2xl sm:rounded-3xl bg-[#fbf7ee] dark:bg-[#121c26] border-2 border-[#6d80c4]/30 shadow-2xl overflow-hidden text-[#292019] dark:text-[#f0e6d6] smooth-layer">
        
        {/* Modal Header */}
        <div className="p-3 sm:p-5 border-b border-[#292019]/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2.5 bg-white dark:bg-[#16222c]">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-[#6d80c4]/15 text-[#54679f] dark:text-[#8ea0e0] flex items-center justify-center shadow-inner flex-shrink-0">
              {activeTab === 'impactMap' ? <GitBranch className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="font-serif font-black text-base sm:text-xl leading-none truncate">
                National Livestock Policy & AMR Sandbox
              </h3>
              <p className="text-[11px] sm:text-xs text-[#6b5f52] dark:text-[#a8b2a9] mt-0.5 truncate">
                Simulate how farm decisions & economic levers shape the 2030 AMR burden.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-[#292019]/5 dark:bg-white/5 border border-[#292019]/10">
              <button
                onClick={() => {
                  audioController.playPop();
                  setActiveTab('impactMap');
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'impactMap'
                    ? 'bg-[#292019] text-[#dda070] dark:bg-[#dda070] dark:text-[#182430] shadow-xs'
                    : 'text-[#8a7b6d] hover:text-[#292019] dark:hover:text-white'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Story</span> Impact Map
              </button>
              <button
                onClick={() => {
                  audioController.playPop();
                  setActiveTab('sandbox');
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'sandbox'
                    ? 'bg-[#292019] text-[#dda070] dark:bg-[#dda070] dark:text-[#182430] shadow-xs'
                    : 'text-[#8a7b6d] hover:text-[#292019] dark:hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" /> <span className="hidden xs:inline">5 Levers</span> Sandbox
              </button>
            </div>

            <button
              onClick={() => {
                audioController.playPop();
                onClose();
              }}
              className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-[#8a7b6d] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: STORY DECISION IMPACT MAP */}
          {activeTab === 'impactMap' && (
            <VisualImpactMap
              userDecisions={userDecisions}
              onUpdateDecision={onUpdateDecision}
              onSelectChapter={onSelectChapter}
            />
          )}

          {/* TAB 2: 5 LEVERS MACROECONOMIC SANDBOX */}
          {activeTab === 'sandbox' && (
            <div className="space-y-6">
              {/* 5 Interactive Levers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Lever 1: Biosecurity Subsidy */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#182430] border border-[#292019]/10 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-[#292019] dark:text-[#f0e6d6]">
                      Biosecurity & Housing Subsidy
                    </span>
                    <span className="text-xs font-black text-[#a8734a] bg-[#a8734a]/10 px-2 py-0.5 rounded-md">
                      ${biosecuritySubsidy} / head
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    value={biosecuritySubsidy}
                    onChange={(e) => setBiosecuritySubsidy(Number(e.target.value))}
                    className="w-full accent-[#a8734a] cursor-pointer"
                  />
                  <p className="text-[11px] text-[#8a7b6d]">
                    Capital grants for ventilation, hygiene retrofits, and isolation pens.
                  </p>
                </div>

                {/* Lever 2: Veterinary Prescription Mandate */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#182430] border border-[#292019]/10 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-[#292019] dark:text-[#f0e6d6]">
                      Prescription Mandate Enforcement
                    </span>
                    <span className="text-xs font-black text-[#7d8f6c] bg-[#7d8f6c]/10 px-2 py-0.5 rounded-md">
                      {prescriptionMandate}% strict
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={prescriptionMandate}
                    onChange={(e) => setPrescriptionMandate(Number(e.target.value))}
                    className="w-full accent-[#7d8f6c] cursor-pointer"
                  />
                  <p className="text-[11px] text-[#8a7b6d]">
                    Bans OTC preventative antibiotics; requires licensed veterinary diagnostic oversight.
                  </p>
                </div>

                {/* Lever 3: Diagnostic Turnaround */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#182430] border border-[#292019]/10 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-[#292019] dark:text-[#f0e6d6]">
                      Diagnostic Turnaround Speed
                    </span>
                    <span className="text-xs font-black text-[#6d80c4] bg-[#6d80c4]/10 px-2 py-0.5 rounded-md">
                      {diagnosticSpeed === 1 ? '< 24h (Pen-Side)' : `${diagnosticSpeed} Days (Lab)`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="1"
                    value={diagnosticSpeed}
                    onChange={(e) => setDiagnosticSpeed(Number(e.target.value))}
                    className="w-full accent-[#6d80c4] cursor-pointer"
                  />
                  <p className="text-[11px] text-[#8a7b6d]">
                    Rapid point-of-care PCR tests vs. traditional bacterial culture shipping delays.
                  </p>
                </div>

                {/* Lever 4: Certified Consumer Price Premium */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#182430] border border-[#292019]/10 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-[#292019] dark:text-[#f0e6d6]">
                      Consumer Green-Label Premium
                    </span>
                    <span className="text-xs font-black text-[#c8875a] bg-[#c8875a]/10 px-2 py-0.5 rounded-md">
                      +{pricePremium}% retail
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="2"
                    value={pricePremium}
                    onChange={(e) => setPricePremium(Number(e.target.value))}
                    className="w-full accent-[#c8875a] cursor-pointer"
                  />
                  <p className="text-[11px] text-[#8a7b6d]">
                    Retail willingness-to-pay for independently certified "Responsible AMU" meat and dairy.
                  </p>
                </div>
              </div>

              {/* Accord Tier Selector */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#182430] border border-[#292019]/10 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <span className="font-serif font-bold text-sm text-[#292019] dark:text-[#f0e6d6]">
                  Global Policy Coordination Scope:
                </span>
                <div className="flex items-center gap-2">
                  {(['Regional', 'G20', 'Global Accord'] as const).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setGlobalAccordTier(tier)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        globalAccordTier === tier
                          ? 'bg-[#292019] text-white dark:bg-[#dda070] dark:text-[#182430] shadow-sm'
                          : 'bg-[#292019]/5 dark:bg-white/5 text-[#8a7b6d]'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Run Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#292019] text-[#fbf7ee] dark:bg-[#dda070] dark:text-[#16222c] text-sm font-black hover:bg-[#a8734a] transition-all shadow-xl cursor-pointer disabled:opacity-50"
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Evaluating FAO Matrix...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Run 10-Year Scenario Simulation
                    </>
                  )}
                </button>
              </div>

              {/* Simulation Output Card */}
              {result && (
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#16222c] border-2 border-[#a8734a]/40 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#292019]/10 dark:border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#a8734a]" />
                      <h4 className="font-serif font-black text-lg text-[#292019] dark:text-[#f0e6d6]">
                        {result.evaluationTitle}
                      </h4>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-xs">
                      Resilience Score: {result.overallScore} / 100
                    </div>
                  </div>

                  {/* KPI Score Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#a8734a]/10 border border-[#a8734a]/20 text-center">
                      <span className="text-[10px] font-black uppercase text-[#8a5b38] dark:text-[#dda070] block">
                        10-Yr AMU Reduction
                      </span>
                      <span className="font-serif font-black text-2xl text-[#a8734a] dark:text-[#dda070]">
                        {result.amuReduction}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#7d8f6c]/10 border border-[#7d8f6c]/20 text-center">
                      <span className="text-[10px] font-black uppercase text-[#55663f] dark:text-[#a9bd9e] block">
                        Farm Solvency Index
                      </span>
                      <span className="font-serif font-black text-2xl text-[#7d8f6c] dark:text-[#a9bd9e]">
                        {result.farmSurvivalScore}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#6d80c4]/10 border border-[#6d80c4]/20 text-center">
                      <span className="text-[10px] font-black uppercase text-[#54679f] dark:text-[#8ea0e0] block">
                        Global Health Savings
                      </span>
                      <span className="font-serif font-black text-2xl text-[#6d80c4] dark:text-[#8ea0e0]">
                        {result.humanHealthcareSavings}
                      </span>
                    </div>
                  </div>

                  {/* Synthesis Text */}
                  <p className="font-serif text-sm sm:text-base leading-relaxed text-[#3a3229] dark:text-[#d6dcd4]">
                    {result.summary}
                  </p>

                  {/* Policy Recommendations */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#a8734a]">
                      Key FAO Transition Recommendations:
                    </span>
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#6b5f52] dark:text-[#a8b2a9]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#7d8f6c] flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
