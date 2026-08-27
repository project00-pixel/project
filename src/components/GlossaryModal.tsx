import React, { useState } from 'react';
import { GLOSSARY } from '../data/chaptersData';
import { BookOpen, Search, X, Sparkles, Filter, ExternalLink, HelpCircle } from 'lucide-react';
import { audioController } from '../utils/sound';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearch?: string;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  onClose,
  initialSearch = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Terms' },
    { id: 'clinical', label: 'Biological & Clinical' },
    { id: 'economic', label: 'Economics & Trade' },
    { id: 'governance', label: 'Global Governance' }
  ];

  const glossaryEntries = Object.entries(GLOSSARY);

  const filteredEntries = glossaryEntries.filter(([key, item]) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === 'clinical') {
      return ['AMU', 'AMR', 'AGP', 'MIC', 'COLISTIN', 'ESBL', 'MCR', 'METAPHYLAXIS', 'PROPHYLAXIS'].some(k => key.toUpperCase().includes(k));
    }
    if (activeCategory === 'economic') {
      return ['BIOSECURITY', 'VALUECHAIN', 'PRICEPREMIUM', 'COSTOFACTION', 'ROI'].some(k => key.toUpperCase().includes(k));
    }
    if (activeCategory === 'governance') {
      return ['ONEHEALTH', 'RENOFARM', 'WOAH', 'FAO', 'WHO', 'QUADRIPARTITE'].some(k => key.toUpperCase().includes(k));
    }

    return true;
  });

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          audioController.playPop();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 smooth-layer"
    >
      <div className="relative w-full max-w-3xl max-h-[88vh] flex flex-col rounded-3xl bg-[#fbf7ee] dark:bg-[#121c26] border-2 border-[#a8734a]/30 shadow-2xl overflow-hidden text-[#292019] dark:text-[#f0e6d6] smooth-layer">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#292019]/10 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#16222c]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#a8734a]/15 text-[#a8734a] dark:text-[#dda070] flex items-center justify-center shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-black text-lg sm:text-xl leading-none">
                One Health & FAO Lexicon
              </h3>
              <p className="text-xs text-[#6b5f52] dark:text-[#a8b2a9] mt-0.5">
                Authoritative glossary of veterinary epidemiology, farm economics, and AMR governance.
              </p>
            </div>
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

        {/* Search & Category Tabs */}
        <div className="p-4 bg-[#f4ead8]/70 dark:bg-[#0f1720] border-b border-[#292019]/10 dark:border-white/5 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7b6d]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search terms: 'Metaphylaxis', 'RENOFARM', 'MIC', 'One Health'..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#1a2632] border border-[#292019]/15 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#a8734a]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  audioController.playPop();
                  setActiveCategory(cat.id);
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#a8734a] text-white shadow-sm'
                    : 'bg-white dark:bg-[#1a2632] text-[#6b5f52] dark:text-[#a8b2a9] hover:text-[#292019]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Term List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12 text-[#8a7b6d]">
              <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="font-bold text-sm">No matching terms found.</p>
              <p className="text-xs">Try searching for AMR, Biosecurity, or FAO.</p>
            </div>
          ) : (
            filteredEntries.map(([key, item]) => (
              <div
                key={key}
                className="p-4 rounded-2xl bg-white dark:bg-[#182430] border border-[#292019]/10 shadow-sm hover:border-[#a8734a]/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#a8734a]/15 text-[#8a5b38] dark:text-[#dda070] text-xs font-black">
                      {item.term}
                    </span>
                    <h4 className="font-serif font-black text-base text-[#292019] dark:text-[#f0e6d6]">
                      {item.fullTitle}
                    </h4>
                  </div>
                  <button
                    onClick={() => audioController.speakText(`${item.term}. ${item.fullTitle}. ${item.description}`, 'a')}
                    className="p-1 rounded-md text-[#8a7b6d] hover:text-[#a8734a] cursor-pointer"
                    title="Pronounce term & definition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-[#6b5f52] dark:text-[#cbd5e1] leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
