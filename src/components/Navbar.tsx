import React, { useState, useEffect } from 'react';
import { Menu, X, Volume2, VolumeX, Mic, MicOff, Film, Sun, Moon, Sparkles, Sliders, BookOpen, Award } from 'lucide-react';
import { CHAPTERS } from '../data/chaptersData';
import { audioController } from '../utils/sound';

interface NavbarProps {
  activeChapterId: string;
  theme: 'day' | 'night';
  onToggleTheme: () => void;
  isFilmMode: boolean;
  onToggleFilmMode: () => void;
  onSelectChapter: (id: string) => void;
  onOpenAILab?: () => void;
  onOpenPolicySimulator?: () => void;
  onOpenGlossary?: () => void;
  onOpenAccord?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeChapterId,
  theme,
  onToggleTheme,
  isFilmMode,
  onToggleFilmMode,
  onSelectChapter,
  onOpenAILab,
  onOpenPolicySimulator,
  onOpenGlossary,
  onOpenAccord
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [isVoiceOn, setIsVoiceOn] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 60) {
        // Near top of page: fully visible
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 60) {
        // Scrolling down: vanish header completely
        setIsVisible(false);
        setIsMenuOpen(false); // Close mobile drawer if open
      } else if (currentScrollY < lastScrollY - 25) {
        // Scrolling up noticeably: reveal header
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleToggleSound = () => {
    const state = audioController.toggleAmbientSound();
    setIsSoundOn(state);
    if (state) audioController.playPop();
  };

  const handleToggleVoice = () => {
    const state = audioController.toggleVoice();
    setIsVoiceOn(state);
    if (state) audioController.playPop();
  };

  const currentChapter = CHAPTERS.find((c) => c.id === activeChapterId) || CHAPTERS[0];

  return (
    <>
      <header
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-40 smooth-layer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isFilmMode || !isVisible
            ? '-translate-y-full opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100 pointer-events-auto'
        } bg-[#f9f2e6]/92 dark:bg-[#0f1620]/92 backdrop-blur-md border-b border-[#292019]/10 dark:border-white/10 shadow-xs`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between">
          {/* Brand */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              onSelectChapter('hero');
            }}
            id="nav-brand-btn"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#292019] text-[#f4ead8] text-base sm:text-lg shadow-md group-hover:rotate-[-8deg] transition-transform duration-300">
              🤝
            </span>
            <div className="flex flex-col">
              <span className="font-serif font-black text-lg sm:text-xl leading-none text-[#292019] dark:text-[#f0e6d6]">
                The Handshake
              </span>
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-[#a8734a] dark:text-[#dda070]">
                FAO Assessment 2026
              </span>
            </div>
          </a>

          {/* Center / Right controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* AI Inquiry Lab Trigger */}
            {onOpenAILab && (
              <button
                id="nav-ai-lab-btn"
                onClick={() => {
                  audioController.playPop();
                  onOpenAILab();
                }}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#292019] dark:bg-[#dda070] text-[#fbf7ee] dark:text-[#182430] text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer min-h-[36px]"
                title="Open One Health AI Inquiry Lab"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#fce7bb] dark:text-[#182430] animate-spin" />
                <span className="hidden sm:inline">AI Co-Pilot</span>
                <span className="sm:hidden text-[11px]">AI</span>
              </button>
            )}

            {/* Policy Sandbox Trigger */}
            {onOpenPolicySimulator && (
              <button
                id="nav-policy-sim-btn"
                onClick={() => {
                  audioController.playPop();
                  onOpenPolicySimulator();
                }}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fbf7ee]/90 dark:bg-[#16222c]/90 text-[#3a3229] dark:text-[#d6dcd4] border border-[#292019]/15 text-xs font-bold hover:border-[#a8734a] shadow-sm cursor-pointer min-h-[36px]"
                title="Open Policy Sandbox"
              >
                <Sliders className="w-3.5 h-3.5 text-[#6d80c4]" />
                <span>Policy Sandbox</span>
              </button>
            )}

            {/* Glossary Trigger */}
            {onOpenGlossary && (
              <button
                id="nav-glossary-btn"
                onClick={() => {
                  audioController.playPop();
                  onOpenGlossary();
                }}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fbf7ee]/90 dark:bg-[#16222c]/90 text-[#3a3229] dark:text-[#d6dcd4] border border-[#292019]/15 text-xs font-bold hover:border-[#a8734a] shadow-sm cursor-pointer min-h-[36px]"
                title="Open FAO Glossary & Lexicon"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#a8734a]" />
                <span>Lexicon</span>
              </button>
            )}

            {/* Accord Sign Trigger */}
            {onOpenAccord && (
              <button
                id="nav-accord-btn"
                onClick={() => {
                  audioController.playPop();
                  onOpenAccord();
                }}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fbf7ee]/90 dark:bg-[#16222c]/90 text-[#3a3229] dark:text-[#d6dcd4] border border-[#292019]/15 text-xs font-bold hover:border-[#a8734a] shadow-sm cursor-pointer min-h-[36px]"
                title="View & Sign One Health Accord"
              >
                <Award className="w-3.5 h-3.5 text-[#c8875a]" />
                <span>Sign Accord</span>
              </button>
            )}

            {/* Audio Toggle */}
            <button
              id="sound-toggle-btn"
              onClick={handleToggleSound}
              className={`inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer border min-h-[36px] min-w-[36px] ${
                isSoundOn
                  ? 'bg-[#292019] text-[#f4ead8] border-[#292019]'
                  : 'bg-[#fbf7ee]/90 dark:bg-[#16222c]/90 text-[#3a3229] dark:text-[#d6dcd4] border-[#292019]/15 dark:border-[#f0e6d6]/15 hover:border-[#a8734a]'
              }`}
              title={isSoundOn ? 'Mute ambient sound' : 'Enable ambient sound'}
            >
              {isSoundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-60" />}
              <span className="hidden sm:inline">{isSoundOn ? 'Sound' : 'Sound'}</span>
            </button>

            {/* Voice Narrator Toggle */}
            <button
              id="voice-toggle-btn"
              onClick={handleToggleVoice}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer border min-h-[36px] ${
                isVoiceOn
                  ? 'bg-[#a8734a] text-[#fbf7ee] border-[#a8734a]'
                  : 'bg-[#fbf7ee]/90 dark:bg-[#16222c]/90 text-[#3a3229] dark:text-[#d6dcd4] border-[#292019]/15 dark:border-[#f0e6d6]/15 hover:border-[#a8734a]'
              }`}
              title={isVoiceOn ? 'Disable speech narration' : 'Enable speech narration'}
            >
              {isVoiceOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5 opacity-60" />}
              <span className="hidden sm:inline">{isVoiceOn ? 'Voice' : 'Voice'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={() => {
                audioController.playPop();
                onToggleTheme();
              }}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-[#fbf7ee]/90 dark:bg-[#16222c]/90 border border-[#292019]/15 dark:border-[#f0e6d6]/15 text-[#3a3229] dark:text-[#d6dcd4] hover:text-[#c8875a] shadow-sm cursor-pointer transition-colors"
              title={theme === 'night' ? 'Switch to Day mode' : 'Switch to Night mode'}
            >
              {theme === 'night' ? <Sun className="w-4 h-4 text-[#e8b170]" /> : <Moon className="w-4 h-4 text-[#6d80c4]" />}
            </button>

            {/* Film Mode Toggle */}
            <button
              id="film-mode-btn"
              onClick={() => {
                audioController.playPop();
                onToggleFilmMode();
              }}
              className="hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-full bg-[#fbf7ee]/90 dark:bg-[#16222c]/90 border border-[#292019]/15 dark:border-[#f0e6d6]/15 text-[#3a3229] dark:text-[#d6dcd4] hover:text-[#c8875a] shadow-sm cursor-pointer transition-colors"
              title="Toggle Cinematic Film Mode"
            >
              <Film className="w-4 h-4" />
            </button>

            {/* Menu Trigger */}
            <button
              id="menu-trigger-btn"
              onClick={() => {
                audioController.playPop();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#292019] text-[#f4ead8] shadow-md hover:bg-[#a8734a] transition-colors cursor-pointer"
              aria-label="Toggle Chapter Navigation"
            >
              {isMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Chapters Overlay Modal */}
      {isMenuOpen && (
        <div
          id="chapters-menu-overlay"
          className="fixed inset-0 z-50 bg-[#f9f2e6]/95 dark:bg-[#0f1620]/95 backdrop-blur-xl flex flex-col justify-start sm:justify-center px-4 sm:px-12 py-6 sm:py-10 overflow-y-auto transition-opacity animate-in fade-in"
        >
          <div className="max-w-4xl mx-auto w-full my-auto">
            <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-[#292019]/10 dark:border-[#f0e6d6]/10">
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#a8734a]">
                  Documentary Navigation & Modules
                </span>
                <h2 className="font-serif font-black text-xl sm:text-3xl text-[#292019] dark:text-[#f0e6d6]">
                  Table of Chapters & Interactive Tools
                </h2>
              </div>
              <button
                id="close-menu-btn"
                onClick={() => {
                  audioController.playPop();
                  setIsMenuOpen(false);
                }}
                className="h-10 w-10 min-w-[40px] rounded-full flex items-center justify-center bg-[#292019] text-[#f4ead8] cursor-pointer hover:bg-[#a8734a] active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick module launcher buttons in menu */}
            <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
              {onOpenAILab && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenAILab();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#a8734a] text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI Co-Pilot
                </button>
              )}
              {onOpenPolicySimulator && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenPolicySimulator();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#6d80c4] text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <Sliders className="w-3.5 h-3.5" /> Policy Sandbox
                </button>
              )}
              {onOpenGlossary && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenGlossary();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#16222c] border border-[#292019]/20 text-xs font-black flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#a8734a]" /> FAO Lexicon
                </button>
              )}
              {onOpenAccord && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenAccord();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#16222c] border border-[#292019]/20 text-xs font-black flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Award className="w-3.5 h-3.5 text-[#c8875a]" /> Sign Accord
                </button>
              )}
            </div>

            <nav className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 max-h-[55vh] overflow-y-auto pr-1">
              {CHAPTERS.map((ch) => (
                <button
                  key={ch.id}
                  id={`nav-chapter-${ch.id}`}
                  onClick={() => {
                    audioController.playPop();
                    setIsMenuOpen(false);
                    onSelectChapter(ch.id);
                  }}
                  className={`flex items-center text-left gap-3 p-3 rounded-2xl border transition-all cursor-pointer min-h-[52px] ${
                    activeChapterId === ch.id
                      ? 'bg-[#a8734a] text-[#fbf7ee] border-[#a8734a] shadow-lg scale-[1.01]'
                      : 'bg-[#fbf7ee]/70 dark:bg-[#16222c]/70 border-[#292019]/10 dark:border-[#f0e6d6]/10 hover:border-[#a8734a] hover:bg-[#fbf7ee] dark:hover:bg-[#16222c]'
                  }`}
                >
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-serif font-black text-sm flex-shrink-0 border ${
                      activeChapterId === ch.id
                        ? 'bg-white/20 text-white border-white/30'
                        : 'bg-[#a8734a]/10 dark:bg-[#dda070]/10 text-[#a8734a] dark:text-[#dda070] border-[#a8734a]/20'
                    }`}
                  >
                    {ch.number}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className={`font-serif font-bold text-sm leading-snug truncate ${activeChapterId === ch.id ? 'text-[#fbf7ee]' : 'text-[#292019] dark:text-[#f0e6d6]'}`}>
                      {ch.title}
                    </span>
                    <span className={`text-[11px] mt-0.5 truncate ${activeChapterId === ch.id ? 'text-[#fbf7ee]/80' : 'text-[#6b5f52] dark:text-[#a8b2a9]'}`}>
                      {ch.theme}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
