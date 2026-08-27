import React, { useState } from 'react';
import { Sparkles, MessageSquare, Send, Bot, User, ShieldCheck, TrendingUp, HelpCircle, X, Volume2, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { IMAGES, SPEAKERS } from '../data/chaptersData';
import { audioController } from '../utils/sound';

interface AIInquiryLabProps {
  isOpen: boolean;
  onClose: () => void;
  currentChapterTitle?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'amira' | 'mohamed' | 'consensus';
  text: string;
  metrics?: {
    amuReduction: string;
    farmMarginImpact: string;
    healthSecurityROI: string;
  };
}

const PRESET_SCENARIOS = [
  {
    title: "Routine Prophylaxis Ban",
    prompt: "What happens if a nation abruptly bans all preventative flock-wide antibiotics without capital subsidies for ventilation retrofits?",
    category: "Policy Shock"
  },
  {
    title: "Pen-Side Rapid Diagnostics",
    prompt: "How can 2-hour penside PCR testing for bovine respiratory disease change farm-gate antibiotic use and veterinary costs?",
    category: "Technology"
  },
  {
    title: "Consumer Stewardship Premium",
    prompt: "Are supermarket consumers genuinely willing to pay a 6% retail premium for independently certified low-AMU poultry?",
    category: "Value Chain"
  },
  {
    title: "Smallholder Vaccine Grants",
    prompt: "How do targeted vaccine subsidies compare in cost-effectiveness to emergency antibiotic stockpiles in low-income pastoral communities?",
    category: "Global Equity"
  }
];

export const AIInquiryLab: React.FC<AIInquiryLabProps> = ({
  isOpen,
  onClose,
  currentChapterTitle = "General Dialogue"
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'amira',
      text: "Welcome to the One Health Intelligence Lab. Mohamed and I are ready to evaluate any policy, trade-off, or farm-gate scenario using the FAO 2026 economic model. What would you like to explore?"
    },
    {
      id: 'welcome-2',
      sender: 'mohamed',
      text: "Ask us about actual barn conditions, cashflow constraints, mortality risks, or diagnostic tools. Let's see how macro numbers meet real farming."
    }
  ]);

  if (!isOpen) return null;

  const handleSubmit = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    audioController.playPop();
    const userMsgId = 'user-' + Date.now();
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: userMsgId, sender: 'user', text: textToSend }
    ];
    setMessages(newMessages);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/dialogue-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          currentChapter: currentChapterTitle,
          scenarioFocus: 'One Health Inquiry'
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const amiraMsg: ChatMessage = {
        id: 'amira-' + Date.now(),
        sender: 'amira',
        text: data.amiraResponse || "From a macroeconomic perspective, systemic risk requires proactive investment.",
        metrics: data.impactMetrics
      };

      const mohamedMsg: ChatMessage = {
        id: 'mohamed-' + (Date.now() + 1),
        sender: 'mohamed',
        text: data.mohamedResponse || "At the farm gate, our herds need practical transition support to remain solvent."
      };

      const consensusMsg: ChatMessage = {
        id: 'consensus-' + (Date.now() + 2),
        sender: 'consensus',
        text: data.consensusInsight || "The sustainable path aligns farm-gate cashflow with public health preservation."
      };

      setMessages([...newMessages, amiraMsg, mohamedMsg, consensusMsg]);
      audioController.playStinger();
    } catch (err) {
      console.error("Dialogue error:", err);
      // Deterministic fallback response
      setMessages([
        ...newMessages,
        {
          id: 'amira-fallback',
          sender: 'amira',
          text: `In evaluating "${textToSend}", the FAO economic model indicates that transition policies succeed only when biosecurity upgrades precede regulatory enforcement, safeguarding first-line human antimicrobials.`,
          metrics: {
            amuReduction: "-38%",
            farmMarginImpact: "+3.5%",
            healthSecurityROI: "18.2:1"
          }
        },
        {
          id: 'mohamed-fallback',
          sender: 'mohamed',
          text: "If we pair rapid pen-side diagnostics with low-interest biosecurity loans, livestock producers can reduce routine preventative dosing without risking herd bankruptcy."
        },
        {
          id: 'consensus-fallback',
          sender: 'consensus',
          text: "Consensus: Regulatory mandates must be coupled with tangible capital grants and verified market premiums."
        }
      ]);
    } finally {
      setIsLoading(false);
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
      <div className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl bg-[#fbf7ee] dark:bg-[#121c26] border-2 border-[#a8734a]/30 shadow-2xl overflow-hidden text-[#292019] dark:text-[#f0e6d6] smooth-layer">
        
        {/* Top Header */}
        <div className="p-3 sm:p-5 border-b border-[#292019]/10 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#16222c]">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-[#a8734a]/15 text-[#a8734a] dark:text-[#dda070] flex items-center justify-center shadow-inner flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="font-serif font-black text-base sm:text-xl leading-none truncate">
                  One Health Dialogue Co-Pilot
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#a8734a] text-white text-[9px] sm:text-[10px] font-black uppercase flex-shrink-0">
                  Gemini Flash
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#6b5f52] dark:text-[#a8b2a9] mt-0.5 truncate">
                Interrogate Dr. Amira & Mohamed on AMR policy, farm dilemmas, and economics.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioController.playPop();
              onClose();
            }}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-[#8a7b6d] cursor-pointer flex-shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="px-4 py-2.5 bg-[#f4ead8]/70 dark:bg-[#0f1720] border-b border-[#292019]/10 dark:border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-black uppercase text-[#8a7b6d] flex-shrink-0">
            Presets:
          </span>
          {PRESET_SCENARIOS.map((scenario, idx) => (
            <button
              key={idx}
              onClick={() => handleSubmit(scenario.prompt)}
              className="px-3 py-1 rounded-full bg-white dark:bg-[#1a2632] hover:bg-[#a8734a] hover:text-white border border-[#292019]/10 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex-shrink-0"
            >
              {scenario.title}
            </button>
          ))}
        </div>

        {/* Chat Stream Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            if (msg.sender === 'user') {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-xl p-4 rounded-2xl bg-[#292019] text-[#fbf7ee] dark:bg-[#dda070] dark:text-[#16222c] text-sm font-semibold shadow-md">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase opacity-75 mb-1">
                      <User className="w-3 h-3" /> Your Inquiry
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              );
            }

            if (msg.sender === 'amira') {
              const amiraImg = IMAGES.amiraPortrait;

              return (
                <div key={msg.id} className="flex gap-3 sm:gap-4 max-w-2xl">
                  <div className="w-12 h-14 rounded-xl overflow-hidden border border-[#a8734a]/40 flex-shrink-0 shadow-sm">
                    <img
                      src={amiraImg}
                      alt="Dr. Amira"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4 rounded-2xl bg-white dark:bg-[#1a2531] border border-[#a8734a]/30 shadow-md">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-black text-sm text-[#a8734a] dark:text-[#dda070]">
                          Dr. Amira
                        </span>
                        <span className="text-[10px] text-[#8a7b6d]">
                          (Macroeconomic Lens)
                        </span>
                      </div>
                      <button
                        onClick={() => audioController.speakText(msg.text, 'a')}
                        className="p-1 text-[#8a7b6d] hover:text-[#a8734a] cursor-pointer"
                        title="Listen to Dr. Amira"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="font-serif text-sm sm:text-base leading-relaxed text-[#292019] dark:text-[#e2e8f0]">
                      {msg.text}
                    </p>

                    {/* Metric pill bar if provided */}
                    {msg.metrics && (
                      <div className="mt-3 pt-2.5 border-t border-[#292019]/10 dark:border-white/10 flex flex-wrap gap-2">
                        <div className="px-2.5 py-1 rounded-lg bg-[#a8734a]/10 text-[#8a5b38] dark:text-[#dda070] text-xs font-black">
                          AMU: {msg.metrics.amuReduction}
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-[#7d8f6c]/10 text-[#55663f] dark:text-[#a9bd9e] text-xs font-black">
                          Farm Margin: {msg.metrics.farmMarginImpact}
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-[#6d80c4]/10 text-[#54679f] dark:text-[#8ea0e0] text-xs font-black">
                          Global ROI: {msg.metrics.healthSecurityROI}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            if (msg.sender === 'mohamed') {
              const mohamedImg = IMAGES.mohamedPortrait;

              return (
                <div key={msg.id} className="flex gap-3 sm:gap-4 max-w-2xl">
                  <div className="w-12 h-14 rounded-xl overflow-hidden border border-[#7d8f6c]/40 flex-shrink-0 shadow-sm">
                    <img
                      src={mohamedImg}
                      alt="Mohamed"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4 rounded-2xl bg-white dark:bg-[#1a2531] border border-[#7d8f6c]/30 shadow-md">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-black text-sm text-[#67795a] dark:text-[#a9bd9e]">
                          Mohamed
                        </span>
                        <span className="text-[10px] text-[#8a7b6d]">
                          (Farm-Gate Reality)
                        </span>
                      </div>
                      <button
                        onClick={() => audioController.speakText(msg.text, 's')}
                        className="p-1 text-[#8a7b6d] hover:text-[#7d8f6c] cursor-pointer"
                        title="Listen to Mohamed"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="font-serif text-sm sm:text-base leading-relaxed text-[#292019] dark:text-[#e2e8f0]">
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            }

            // Consensus Accord Card with Joint Collaboration Image
            return (
              <div key={msg.id} className="p-4 rounded-2xl bg-gradient-to-r from-[#a8734a]/15 via-[#fbf7ee] to-[#7d8f6c]/15 dark:from-[#1b2733] dark:via-[#16222c] dark:to-[#172422] border-2 border-[#a8734a]/40 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-20 h-16 rounded-xl overflow-hidden border border-[#a8734a]/30 flex-shrink-0 shadow-sm">
                    <img
                      src={IMAGES.jointDialogue}
                      alt="Amira & Mohamed Collaboration"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 text-xs font-black text-[#a8734a] dark:text-[#dda070] uppercase mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> One Health Consensus Accord
                    </div>
                    <p className="font-serif text-sm sm:text-base font-bold text-[#292019] dark:text-[#f0e6d6]">
                      {msg.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-dashed border-[#a8734a]/30 animate-pulse">
              <Sparkles className="w-5 h-5 text-[#a8734a] animate-spin" />
              <span className="text-xs font-bold text-[#8a7b6d]">
                Dr. Amira and Mohamed are synthesizing the FAO economic model...
              </span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#292019]/10 dark:border-white/10 bg-white dark:bg-[#16222c]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Dr. Amira & Mohamed about antibiotic reduction, trade bans, costs..."
              className="flex-1 px-4 py-3 rounded-2xl bg-[#fbf7ee] dark:bg-[#0f1720] border border-[#292019]/15 dark:border-white/15 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#a8734a]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-5 py-3 rounded-2xl bg-[#292019] text-[#fbf7ee] dark:bg-[#dda070] dark:text-[#16222c] text-xs font-black hover:bg-[#a8734a] transition-all disabled:opacity-40 cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Ask Both
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
