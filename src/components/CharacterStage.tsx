import React, { useState, useEffect } from 'react';
import { SPEAKERS, GLOSSARY, IMAGES } from '../data/chaptersData';
import { CharacterMood, DialogueLine, SpeakerId } from '../types';
import { audioController } from '../utils/sound';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  HelpCircle,
  BookOpen,
  SplitSquareVertical,
  Volume2,
  VolumeX,
  TrendingUp,
  ShieldCheck,
  Building,
  HeartPulse,
  Layers,
  ChevronRight,
  MessageSquare,
  Sparkle,
  Activity,
  Handshake
} from 'lucide-react';
import { RealisticCharacter } from './RealisticCharacter';

interface CharacterStageProps {
  dialogues: DialogueLine[];
  chapterTitle?: string;
  chapterNumber?: string;
  artPanelImg?: string;
  artCaption?: string;
  characterMoods?: { amira?: CharacterMood; mohamed?: CharacterMood };
  characterPortraits?: { amira?: string; mohamed?: string };
  onExploreTerm?: (term: string) => void;
  onSelectChoice?: (choiceLabel: string) => void;
}

export const CharacterStage: React.FC<CharacterStageProps> = ({
  dialogues,
  chapterTitle,
  chapterNumber,
  artPanelImg,
  artCaption,
  characterMoods,
  characterPortraits,
  onExploreTerm,
  onSelectChoice
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeLines, setActiveLines] = useState<DialogueLine[]>(dialogues);
  const [hoveredGlossaryTerm, setHoveredGlossaryTerm] = useState<{ term: string; x: number; y: number } | null>(null);
  const [narrativeMode, setNarrativeMode] = useState<'stage' | 'panels' | 'debate' | 'transcript'>('stage');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [stageNotification, setStageNotification] = useState<string | null>(null);

  useEffect(() => {
    setActiveLines(dialogues);
    setCurrentIndex(0);
  }, [dialogues]);

  const currentLine = activeLines[currentIndex] || activeLines[0];
  const isChoiceLine = currentLine.speaker === 'choices';
  const isNarratorLine = currentLine.speaker === 'n';
  const currentSpeaker = SPEAKERS[currentLine.speaker as SpeakerId] || SPEAKERS.n;
  const isAmiraSpeaking = currentLine.speaker === 'a';
  const isMohamedSpeaking = currentLine.speaker === 's';

  // Speak line on change if unmuted
  useEffect(() => {
    if (currentLine.text && !isChoiceLine && !isAudioMuted) {
      audioController.speakText(currentLine.text, currentLine.speaker as 'a' | 's' | 'n');
    }
  }, [currentIndex, currentLine, isChoiceLine, isAudioMuted]);

  // Keyboard navigation (Left / Right / Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (!isChoiceLine) {
          e.preventDefault();
          handleNext();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, activeLines, isChoiceLine]);

  const handleNext = () => {
    audioController.playPop();
    if (currentIndex >= activeLines.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    audioController.playPop();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSelectBranch = (branchLines?: DialogueLine[], label?: string) => {
    audioController.playPop();
    if (label && onSelectChoice) {
      onSelectChoice(label);
    }
    if (branchLines && branchLines.length > 0) {
      setActiveLines(branchLines);
      setCurrentIndex(0);
    } else {
      handleNext();
    }
  };

  const handleTriggerReaction = (reactionType: string) => {
    audioController.playPop();
    let text = 'Reaction noted';
    if (reactionType === 'data') text = 'Dr. Amira: Recalibrating 10-year macroeconomic model';
    if (reactionType === 'foresight') text = 'Dr. Amira: Analyzing cross-border spillover risk';
    if (reactionType === 'herd') text = 'Mohamed: Running livestock biosecurity checklist';
    if (reactionType === 'margins') text = 'Mohamed: Calculating working capital & veterinary costs';
    if (reactionType === 'consensus') text = 'Common Ground: Aligning transition subsidies with stewardship';
    
    setStageNotification(text);
    setTimeout(() => setStageNotification(null), 3000);
  };

  // Helper to parse [[TERM]] tags in dialogue text
  const renderDialogueText = (text: string) => {
    const parts = text.split(/(\[\[\w+\]\])/g);
    return parts.map((part, i) => {
      const match = part.match(/^\[\[(\w+)\]\]$/);
      if (match && GLOSSARY[match[1]]) {
        const termKey = match[1];
        const termDef = GLOSSARY[termKey];
        return (
          <span
            key={i}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setHoveredGlossaryTerm({
                term: termKey,
                x: rect.left + rect.width / 2,
                y: rect.bottom + 8
              });
              if (onExploreTerm) onExploreTerm(termDef.fullTitle);
            }}
            onMouseLeave={() => setHoveredGlossaryTerm(null)}
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 mx-0.5 rounded-md font-black text-[#8a5b38] dark:text-[#dda070] bg-[#a8734a]/15 border-b-2 border-[#a8734a] cursor-pointer hover:bg-[#a8734a]/25 transition-colors"
          >
            {termDef.term}
            <HelpCircle className="w-3 h-3 inline opacity-70" />
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-2">
      {/* Top Presentation Bar & View Modes */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 rounded-2xl bg-[#fbf7ee]/90 dark:bg-[#16222c]/90 border border-[#292019]/10 shadow-sm backdrop-blur-md">
        
        {/* Chapter Title Badge */}
        <div className="flex items-center gap-2">
          {chapterTitle && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a8734a]/10 dark:bg-[#a8734a]/20 border border-[#a8734a]/30 text-xs font-black text-[#a8734a] dark:text-[#dda070] uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-[#a8734a] animate-pulse" />
              {chapterNumber ? `Act ${chapterNumber}: ` : ''}
              {chapterTitle}
            </span>
          )}
        </div>

        {/* Presentation Modes + Audio */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#f4ead8] dark:bg-[#1f2c37] border border-[#292019]/10">
            <button
              id="narrative-mode-stage"
              onClick={() => setNarrativeMode('stage')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                narrativeMode === 'stage'
                  ? 'bg-[#a8734a] text-white shadow-sm'
                  : 'text-[#6b5f52] dark:text-[#a8b2a9] hover:text-[#292019]'
              }`}
              title="Live Interactive Stage with Realistic Characters"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cinematic Stage</span>
              <span className="sm:hidden">Stage</span>
            </button>

            <button
              id="narrative-mode-panels"
              onClick={() => setNarrativeMode('panels')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                narrativeMode === 'panels'
                  ? 'bg-[#b45d38] text-white shadow-sm'
                  : 'text-[#6b5f52] dark:text-[#a8b2a9] hover:text-[#292019]'
              }`}
              title="Realistic Focus Portraits"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Focus Panels</span>
              <span className="sm:hidden">Panels</span>
            </button>

            <button
              id="narrative-mode-debate"
              onClick={() => setNarrativeMode('debate')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                narrativeMode === 'debate'
                  ? 'bg-[#5d7350] text-white shadow-sm'
                  : 'text-[#6b5f52] dark:text-[#a8b2a9] hover:text-[#292019]'
              }`}
              title="Dual Perspectives Debate Comparison"
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Perspectives</span>
              <span className="sm:hidden">Debate</span>
            </button>

            <button
              id="narrative-mode-transcript"
              onClick={() => setNarrativeMode('transcript')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                narrativeMode === 'transcript'
                  ? 'bg-[#2c3745] text-white shadow-sm'
                  : 'text-[#6b5f52] dark:text-[#a8b2a9] hover:text-[#292019]'
              }`}
              title="Full Story Screenplay"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Full Script</span>
              <span className="sm:hidden">Script</span>
            </button>
          </div>

          {/* Audio speech toggle */}
          <button
            id="audio-speech-toggle"
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isAudioMuted
                ? 'bg-red-50 dark:bg-red-950/40 border-red-200 text-red-500'
                : 'bg-[#f4ead8] dark:bg-[#1f2c37] border-[#292019]/10 text-[#6b5f52] dark:text-[#a8b2a9] hover:text-[#292019]'
            }`}
            title={isAudioMuted ? "Unmute Voice Narration" : "Mute Voice Narration"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Stage Action Notification Toast */}
      {stageNotification && (
        <div className="mb-4 p-3 rounded-2xl bg-[#292019] text-[#fbf7ee] dark:bg-[#dda070] dark:text-[#18181b] text-xs font-black flex items-center justify-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-[#a8734a] animate-spin" />
          {stageNotification}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: LIVE REALISTIC CINEMATIC STAGE                                    */}
      {/* ========================================================================= */}
      {narrativeMode === 'stage' && (
        <div className="relative rounded-3xl p-4 sm:p-8 bg-gradient-to-b from-[#ffffff] via-[#fbf7ee] to-[#f4ead8] dark:from-[#16222c] dark:via-[#121c26] dark:to-[#0f1620] border border-[#292019]/15 overflow-hidden shadow-2xl transition-all duration-500">
          
          {/* Ambient Lighting Accents */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#a8734a]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#7d8f6c]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Main Stage Grid: Two Realistic Living Characters Aligned on the EXACT SAME HORIZONTAL LEVEL */}
          <div className="relative grid grid-cols-2 gap-2 sm:gap-8 items-end justify-items-center pb-3 sm:pb-4 border-b-2 border-[#292019]/10 dark:border-white/10">
            
            {/* DR. AMIRA - One Health Economist */}
            <div className="w-full flex justify-center">
              <RealisticCharacter
                speakerId="a"
                isSpeaking={isAmiraSpeaking}
                isListening={isMohamedSpeaking}
                currentDialogueText={currentLine.text || ''}
                explicitMood={characterMoods?.amira}
                customPortraitImg={characterPortraits?.amira}
                onTriggerReaction={handleTriggerReaction}
                className="w-full"
              />
            </div>

            {/* MOHAMED - Livestock Producer */}
            <div className="w-full flex justify-center">
              <RealisticCharacter
                speakerId="s"
                isSpeaking={isMohamedSpeaking}
                isListening={isAmiraSpeaking}
                currentDialogueText={currentLine.text || ''}
                explicitMood={characterMoods?.mohamed}
                customPortraitImg={characterPortraits?.mohamed}
                onTriggerReaction={handleTriggerReaction}
                className="w-full"
              />
            </div>
          </div>

          {/* DYNAMIC SPEECH CARD ANCHORED BELOW STAGE BASELINE */}
          <div className="relative w-full mt-3 sm:mt-4">
            
            {/* Dynamic Directional Pointer Tail */}
            <div className="relative flex justify-center h-3 overflow-visible pointer-events-none">
              {isAmiraSpeaking && (
                <div className="w-0 h-0 border-l-[10px] sm:border-l-[14px] border-l-transparent border-r-[10px] sm:border-r-[14px] border-r-transparent border-b-[12px] sm:border-b-[16px] border-b-[#ffffff] dark:border-b-[#1c2734] -translate-x-16 sm:-translate-x-44 transition-transform duration-500 drop-shadow-sm" />
              )}
              {isMohamedSpeaking && (
                <div className="w-0 h-0 border-l-[10px] sm:border-l-[14px] border-l-transparent border-r-[10px] sm:border-r-[14px] border-r-transparent border-b-[12px] sm:border-b-[16px] border-b-[#ffffff] dark:border-b-[#1c2734] translate-x-16 sm:translate-x-44 transition-transform duration-500 drop-shadow-sm" />
              )}
            </div>

            {/* Main Interactive Dialogue Card */}
            <div
              id="live-stage-speech-bubble"
              onClick={!isChoiceLine ? handleNext : undefined}
              className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-8 border shadow-xl transition-all duration-500 ${
                !isChoiceLine ? 'cursor-pointer hover:shadow-2xl' : ''
              } ${
                isAmiraSpeaking
                  ? 'bg-white dark:bg-[#1b2733] border-[#a8734a]/40 ring-2 sm:ring-4 ring-[#a8734a]/10'
                  : isMohamedSpeaking
                  ? 'bg-white dark:bg-[#1b2733] border-[#7d8f6c]/40 ring-2 sm:ring-4 ring-[#7d8f6c]/10'
                  : isNarratorLine
                  ? 'bg-[#2c3745] text-white border-[#2c3745]'
                  : 'bg-white dark:bg-[#1b2733] border-[#a8734a]/40'
              }`}
            >
              {/* Active Color Accent Bar */}
              <div
                className="absolute left-0 top-6 bottom-6 w-2 rounded-r-full transition-colors duration-500"
                style={{ backgroundColor: currentSpeaker.accentColor }}
              />

              {/* Speaker Identity Header & Controls */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-black text-white shadow-md"
                    style={{ backgroundColor: currentSpeaker.accentColor }}
                  >
                    {currentSpeaker.avatarLetter}
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-lg text-[#292019] dark:text-[#f0e6d6] leading-none">
                      {currentSpeaker.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#6b5f52] dark:text-[#a8b2a9] mt-0.5">
                      {currentSpeaker.role}
                    </p>
                  </div>
                </div>

                {!isChoiceLine && (
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#292019]/5 dark:bg-white/5 text-[11px] font-black uppercase tracking-wider text-[#8a7b6d] dark:text-[#a8b2a9]">
                      Click anywhere to advance <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>

              {/* Dialogue Content or Interactive Decision Forks */}
              {isChoiceLine ? (
                <div className="my-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#a8734a]">
                    <Sparkles className="w-4 h-4" /> Steer the conversation & test outcomes:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                    {currentLine.options?.map((option, optIdx) => (
                      <button
                        key={optIdx}
                        id={`branch-choice-${optIdx}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectBranch(option.branchLines, option.label);
                        }}
                        className="flex items-start justify-between text-left p-4 rounded-2xl border-2 border-[#a8734a]/30 bg-[#fbf7ee] dark:bg-[#16222c] hover:bg-[#a8734a] hover:text-white transition-all shadow-md cursor-pointer group text-[#292019] dark:text-[#f0e6d6] font-bold text-sm"
                      >
                        <span className="leading-snug">{option.label}</span>
                        <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="min-h-[4.5rem] flex items-center">
                  <p className="font-serif text-lg sm:text-2xl leading-relaxed text-[#292019] dark:text-[#e2e8f0] font-medium tracking-tight">
                    {currentLine.text && renderDialogueText(currentLine.text)}
                  </p>
                </div>
              )}

              {/* Dialogue Progress Controller */}
              <div className="mt-6 pt-4 border-t border-[#292019]/10 dark:border-[#f0e6d6]/10 flex flex-wrap items-center justify-between gap-3">
                
                {/* Statement Progress Dots */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#8a7b6d] dark:text-[#a8b2a9] mr-1">
                    {currentIndex + 1} / {activeLines.length}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {activeLines.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentIndex(idx);
                        }}
                        className={`h-2.5 rounded-full transition-all cursor-pointer ${
                          idx === currentIndex
                            ? 'w-7 bg-[#292019] dark:bg-[#dda070]'
                            : 'w-2 bg-[#292019]/20 dark:bg-white/20 hover:bg-[#292019]/40'
                        }`}
                        title={`Jump to statement ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Back / Next / Replay Controls */}
                <div className="flex items-center gap-2">
                  {currentIndex > 0 && (
                    <button
                      id="stage-back-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                      }}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-[#292019]/20 dark:border-white/20 text-xs font-black text-[#292019] dark:text-[#f0e6d6] hover:bg-[#292019]/5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                  )}

                  <button
                    id="stage-advance-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full bg-[#292019] dark:bg-[#dda070] text-[#fbf7ee] dark:text-[#16222c] text-xs font-black hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
                  >
                    {currentIndex === activeLines.length - 1 ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" /> Replay Chapter
                      </>
                    ) : (
                      <>
                        Continue <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: REALISTIC FOCUS PANELS                                            */}
      {/* ========================================================================= */}
      {narrativeMode === 'panels' && (
        <div className="space-y-6 my-4">
          {/* Interactive Dialogue Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#16222c] border border-[#292019]/10 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-[#292019] dark:text-[#f0e6d6]">
                Interactive Dialogue Panels · {chapterTitle || 'Active Scene'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-[#8a7b6d]">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isAmiraSpeaking ? 'bg-[#a8734a]' : 'bg-[#8a7b6d]/40'}`} />
                Dr. Amira {isAmiraSpeaking && '(Speaking)'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isMohamedSpeaking ? 'bg-[#7d8f6c]' : 'bg-[#8a7b6d]/40'}`} />
                Mohamed {isMohamedSpeaking && '(Speaking)'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AMIRA'S REALISTIC PANEL */}
          <div
            onClick={() => {
              const amiraNext = activeLines.findIndex((l, i) => i > currentIndex && l.speaker === 'a');
              if (amiraNext !== -1) setCurrentIndex(amiraNext);
            }}
            className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${
              isAmiraSpeaking
                ? 'bg-white dark:bg-[#1b2733] border-2 border-[#a8734a] ring-4 ring-[#a8734a]/20 shadow-2xl scale-[1.01]'
                : 'bg-[#fbf7ee]/70 dark:bg-[#16222c]/70 border-[#292019]/10 opacity-80 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 aspect-[3/4] rounded-2xl overflow-hidden border border-[#a8734a]/30 flex-shrink-0 shadow-md">
                <img
                  src={IMAGES.amiraPortrait}
                  alt="Dr. Amira"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#a8734a] text-white text-[10px] font-black uppercase">
                  Policy & Foresight
                </span>
                <h4 className="font-serif font-black text-lg text-[#292019] dark:text-[#f0e6d6]">
                  Dr. Amira
                </h4>
                <p className="text-xs text-[#6b5f52] dark:text-[#a8b2a9]">
                  One Health Economist
                </p>
              </div>
            </div>

            {isAmiraSpeaking ? (
              <div className="p-4 rounded-2xl bg-[#fdf8f4] dark:bg-[#202e3c] border border-[#a8734a]/30 shadow-inner">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#a8734a] block mb-1">
                  Active Statement:
                </span>
                <p className="font-serif text-lg font-bold text-[#292019] dark:text-[#f0e6d6] leading-relaxed">
                  {currentLine.text && renderDialogueText(currentLine.text)}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#292019]/5 dark:bg-white/5 border border-dashed border-[#292019]/15 text-xs text-[#8a7b6d] dark:text-[#a8b2a9]">
                Listening to Mohamed's farm operations reality. Click to jump to Dr. Amira's response.
              </div>
            )}
          </div>

          {/* MOHAMED'S REALISTIC PANEL */}
          <div
            onClick={() => {
              const mohamedNext = activeLines.findIndex((l, i) => i > currentIndex && l.speaker === 's');
              if (mohamedNext !== -1) setCurrentIndex(mohamedNext);
            }}
            className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${
              isMohamedSpeaking
                ? 'bg-white dark:bg-[#1b2733] border-2 border-[#7d8f6c] ring-4 ring-[#7d8f6c]/20 shadow-2xl scale-[1.01]'
                : 'bg-[#fbf7ee]/70 dark:bg-[#16222c]/70 border-[#292019]/10 opacity-80 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 aspect-[3/4] rounded-2xl overflow-hidden border border-[#7d8f6c]/30 flex-shrink-0 shadow-md">
                <img
                  src={IMAGES.mohamedPortrait}
                  alt="Mohamed"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#7d8f6c] text-white text-[10px] font-black uppercase">
                  Farm Operations
                </span>
                <h4 className="font-serif font-black text-lg text-[#292019] dark:text-[#f0e6d6]">
                  Mohamed
                </h4>
                <p className="text-xs text-[#6b5f52] dark:text-[#a8b2a9]">
                  Livestock Producer
                </p>
              </div>
            </div>

            {isMohamedSpeaking ? (
              <div className="p-4 rounded-2xl bg-[#f6f9f4] dark:bg-[#202e3c] border border-[#7d8f6c]/30 shadow-inner">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#7d8f6c] block mb-1">
                  Active Statement:
                </span>
                <p className="font-serif text-lg font-bold text-[#292019] dark:text-[#f0e6d6] leading-relaxed">
                  {currentLine.text && renderDialogueText(currentLine.text)}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#292019]/5 dark:bg-white/5 border border-dashed border-[#292019]/15 text-xs text-[#8a7b6d] dark:text-[#a8b2a9]">
                Listening to Dr. Amira's economic evidence. Click to jump to Mohamed's response.
              </div>
            )}
          </div>

          {/* Navigation Bar for Panels Mode */}
          <div className="md:col-span-2 flex items-center justify-between p-4 rounded-2xl bg-[#fbf7ee] dark:bg-[#16222c] border border-[#292019]/10">
            <span className="text-xs font-bold text-[#6b5f52] dark:text-[#a8b2a9]">
              Statement {currentIndex + 1} of {activeLines.length}
            </span>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#292019] dark:bg-[#dda070] text-[#fbf7ee] dark:text-[#16222c] text-xs font-black hover:scale-105 transition-all cursor-pointer"
            >
              Advance Dialogue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: DUAL PERSPECTIVES DEBATE ARENA                                     */}
      {/* ========================================================================= */}
      {narrativeMode === 'debate' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
          {/* DR. AMIRA'S MACRO COLUMN */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1b2733] border border-[#a8734a]/30 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 aspect-[3/4] rounded-2xl overflow-hidden border border-[#a8734a]/30 flex-shrink-0 shadow-md">
                <img
                  src={SPEAKERS.a.portraitImg}
                  alt="Dr. Amira"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#a8734a] text-white text-[10px] font-black uppercase">
                  Macro Lens
                </span>
                <h4 className="font-serif font-black text-lg text-[#292019] dark:text-[#f0e6d6]">
                  Public Good & Stewardship
                </h4>
              </div>
            </div>

            <div className="space-y-3 text-sm text-[#4a3f35] dark:text-[#cbd5e1]">
              <div className="p-3 rounded-xl bg-[#a8734a]/10 border border-[#a8734a]/20 flex items-start gap-2.5">
                <HeartPulse className="w-4 h-4 text-[#a8734a] flex-shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed font-semibold">
                  <strong>Global Health Dividend:</strong> Action against AMR protects human and animal medicine effectiveness for future generations.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#a8734a]/10 border border-[#a8734a]/20 flex items-start gap-2.5">
                <TrendingUp className="w-4 h-4 text-[#a8734a] flex-shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed font-semibold">
                  <strong>Cost-Benefit Ratio:</strong> $1 in biosecurity and veterinary oversight returns $3+ in avoided loss and export market access.
                </span>
              </div>
            </div>
          </div>

          {/* MOHAMED'S LIVESTOCK PRODUCER COLUMN */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1b2733] border border-[#7d8f6c]/30 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 aspect-[3/4] rounded-2xl overflow-hidden border border-[#7d8f6c]/30 flex-shrink-0 shadow-md">
                <img
                  src={SPEAKERS.s.portraitImg}
                  alt="Mohamed"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#7d8f6c] text-white text-[10px] font-black uppercase">
                  Farm Reality
                </span>
                <h4 className="font-serif font-black text-lg text-[#292019] dark:text-[#f0e6d6]">
                  Herd Security & Margins
                </h4>
              </div>
            </div>

            <div className="space-y-3 text-sm text-[#4a3f35] dark:text-[#cbd5e1]">
              <div className="p-3 rounded-xl bg-[#7d8f6c]/10 border border-[#7d8f6c]/20 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#7d8f6c] flex-shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed font-semibold">
                  <strong>Herd Survival:</strong> Disease outbreaks can cause devastating herd mortality without prompt, therapeutic veterinary care.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#7d8f6c]/10 border border-[#7d8f6c]/20 flex items-start gap-2.5">
                <Building className="w-4 h-4 text-[#7d8f6c] flex-shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed font-semibold">
                  <strong>Capital Investment:</strong> Barn retrofits, vaccination schedules, and biosafety protocols require upfront liquidity.
                </span>
              </div>
            </div>
          </div>

          {/* Navigation bar for Debate Mode */}
          <div className="md:col-span-2 flex items-center justify-between p-4 rounded-2xl bg-[#fbf7ee] dark:bg-[#16222c] border border-[#292019]/10">
            <span className="text-xs font-bold text-[#6b5f52] dark:text-[#a8b2a9]">
              Active Statement: {currentSpeaker.name} ({currentIndex + 1}/{activeLines.length})
            </span>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#292019] dark:bg-[#dda070] text-[#fbf7ee] dark:text-[#16222c] text-xs font-black hover:scale-105 transition-all cursor-pointer"
            >
              Advance Discussion <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 4: FULL STORY SCRIPT FEED                                            */}
      {/* ========================================================================= */}
      {narrativeMode === 'transcript' && (
        <div className="my-4 space-y-4">
          {activeLines.map((line, idx) => {
            if (line.speaker === 'choices') {
              return (
                <div key={idx} className="p-4 rounded-2xl bg-[#a8734a]/10 border border-[#a8734a]/30">
                  <span className="text-xs font-black uppercase text-[#a8734a] block mb-2">
                    Decision Fork:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {line.options?.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectBranch(opt.branchLines, opt.label)}
                        className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#16222c] border border-[#a8734a]/40 text-xs font-bold hover:bg-[#a8734a] hover:text-white transition-colors cursor-pointer"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            const spk = SPEAKERS[line.speaker as SpeakerId] || SPEAKERS.n;
            const isActive = idx === currentIndex;

            return (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-[#1a2531] border-l-4 shadow-md'
                    : 'bg-[#fbf7ee]/60 dark:bg-[#16222c]/60 hover:bg-white/80 dark:hover:bg-[#1a2531]/80 border-[#292019]/10 opacity-80'
                }`}
                style={{
                  borderLeftColor: isActive ? spk.accentColor : 'transparent'
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-6 w-6 rounded-full text-[11px] font-black text-white flex items-center justify-center"
                      style={{ backgroundColor: spk.accentColor }}
                    >
                      {spk.avatarLetter}
                    </span>
                    <span className="font-serif font-black text-sm text-[#292019] dark:text-[#f0e6d6]">
                      {spk.name}
                    </span>
                    <span className="text-[11px] text-[#6b5f52] dark:text-[#a8b2a9]">
                      · {spk.role}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (line.text) {
                        audioController.speakText(line.text, line.speaker as 'a' | 's' | 'n');
                      }
                    }}
                    className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[#8a7b6d] cursor-pointer"
                    title="Play Audio"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="font-serif text-base text-[#292019] dark:text-[#e2e8f0] leading-relaxed">
                  {line.text && renderDialogueText(line.text)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Glossary Definition Tooltip */}
      {hoveredGlossaryTerm && GLOSSARY[hoveredGlossaryTerm.term] && (
        <div
          id="glossary-floating-card"
          style={{
            position: 'fixed',
            left: hoveredGlossaryTerm.x,
            top: hoveredGlossaryTerm.y,
            transform: 'translateX(-50%)',
            zIndex: 60
          }}
          className="w-72 p-4 rounded-2xl bg-[#ffffff] dark:bg-[#16222c] border border-[#a8734a]/40 shadow-2xl pointer-events-none text-left animate-in fade-in zoom-in-95 backdrop-blur-md"
        >
          <div className="flex items-center gap-1.5 text-xs font-black text-[#a8734a] uppercase tracking-wider mb-1">
            <Sparkle className="w-3.5 h-3.5" />
            {GLOSSARY[hoveredGlossaryTerm.term].term}
          </div>
          <h4 className="font-serif font-black text-sm text-[#292019] dark:text-[#f0e6d6]">
            {GLOSSARY[hoveredGlossaryTerm.term].fullTitle}
          </h4>
          <p className="text-xs text-[#6b5f52] dark:text-[#a8b2a9] mt-1.5 leading-snug">
            {GLOSSARY[hoveredGlossaryTerm.term].description}
          </p>
        </div>
      )}
    </div>
  );
};
