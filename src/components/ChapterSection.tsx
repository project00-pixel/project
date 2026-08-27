import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChapterMeta, UserPathRecord, CharacterMood } from '../types';
import { CharacterStage } from './CharacterStage';
import { ChapterSceneBriefing } from './ChapterSceneBriefing';
import { GraphicNovelStrip } from './GraphicNovelStrip';
import { ChapterDecisionBranch } from './ChapterDecisionBranch';
import { CHAPTER_DECISIONS } from '../data/decisionsData';
import { CHAPTERS, IMAGES } from '../data/chaptersData';
import { AMRSimulation, IntensityLeverbox, RegionalBars, YourPathRecap } from './InteractiveSimulations';
import { audioController } from '../utils/sound';
import { Shield, Award, Stethoscope, Building2, Store, Utensils, AlertOctagon, CheckCircle, Sparkles, HelpCircle, ArrowRight, ArrowLeft, Compass, ChevronDown } from 'lucide-react';

interface ChapterSectionProps {
  chapter: ChapterMeta;
  userRecord: UserPathRecord;
  onExploreTerm: (term: string) => void;
  onSelectChoice: (choice: string) => void;
  onUpdateDecision?: (chapterId: string, choice: 'A' | 'B') => void;
  onOpenPolicySimulator?: () => void;
  onSelectChapter?: (chapterId: string) => void;
}

// Framer Motion Staggered Variants for Cinematic Entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.04
    }
  }
};

const panelVariants = {
  hidden: {
    opacity: 0,
    y: 18
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] // Apple-grade ultra-smooth cubic-bezier deceleration curve
    }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

/**
 * Computes reactive character poses, portrait illustrations, and narrative tone
 * dynamically based on the active chapter narrative tone and user's userRecord state.
 */
function getChapterCharacterReactiveState(chapterId: string, userRecord: UserPathRecord) {
  const currentChoice = (userRecord.chapterDecisions?.[chapterId] as 'A' | 'B') || 'B';
  const intensity = userRecord.intensityLevel ?? 50;
  const isHighIntensity = intensity > 65;

  switch (chapterId) {
    case 'prologue':
      if (currentChoice === 'A') {
        return {
          moods: { amira: (isHighIntensity ? 'alarmed' : 'concerned') as CharacterMood, mohamed: 'thoughtful' as CharacterMood },
          portraits: { amira: IMAGES.amiraPortrait, mohamed: IMAGES.mohamedPortrait },
          amiraToneTag: isHighIntensity ? 'Alarmed ⚡ (Evolutionary Pressure)' : 'Concerned ⚠️ (Blanket Exposure)',
          mohamedToneTag: 'Thoughtful 🤔 (Feedlot Margins)',
          toneNarrative: 'Blanket antibiotic prophylaxis exposes healthy cattle to continuous selective pressure.'
        };
      } else {
        return {
          moods: { amira: 'optimistic' as CharacterMood, mohamed: 'determined' as CharacterMood },
          portraits: { amira: IMAGES.amiraPortrait, mohamed: IMAGES.mohamedPortrait },
          amiraToneTag: 'Optimistic 💡 (Diagnostic Baseline)',
          mohamedToneTag: 'Determined 🛡️ (Barn Biosecurity)',
          toneNarrative: 'RENOFARM precision diagnostics replace chemical buffers with environmental defense.'
        };
      }

    case 'ch1': // The Medical Foundation
      if (currentChoice === 'A') {
        return {
          moods: { amira: 'concerned' as CharacterMood, mohamed: 'concerned' as CharacterMood },
          portraits: { amira: IMAGES.amiraPortrait, mohamed: IMAGES.mohamedPortrait },
          amiraToneTag: 'Concerned ⚠️ (Mass Metaphylaxis)',
          mohamedToneTag: 'Concerned ⚠️ (Rising Drug Outlays)',
          toneNarrative: 'Routine mass injections deplete critical reserve antibiotics while inflating pharmacy bills.'
        };
      } else {
        return {
          moods: { amira: 'thoughtful' as CharacterMood, mohamed: 'determined' as CharacterMood },
          portraits: { amira: IMAGES.amiraPortrait, mohamed: IMAGES.mohamedPortrait },
          amiraToneTag: 'Thoughtful 🤔 (Thermal Diagnostics)',
          mohamedToneTag: 'Determined 🛡️ (Targeted Injections)',
          toneNarrative: 'Chute-side thermal imaging isolates only febrile cattle, preserving microbiome integrity.'
        };
      }

    case 'ch2': // The Environmental Shock
      if (currentChoice === 'A') {
        return {
          moods: { amira: (isHighIntensity ? 'alarmed' : 'concerned') as CharacterMood, mohamed: 'concerned' as CharacterMood },
          portraits: { amira: IMAGES.amiraPortrait, mohamed: IMAGES.mohamedPortrait },
          amiraToneTag: isHighIntensity ? 'Alarmed ⚡ (Aquifer Gene Transfer)' : 'Concerned ⚠️ (Slurry Runoff)',
          mohamedToneTag: 'Concerned ⚠️ (Environmental Liability)',
          toneNarrative: 'Unlined manure pits leach resistant plasmids directly into municipal drinking water.'
        };
      } else {
        return {
          moods: { amira: 'thoughtful' as CharacterMood, mohamed: 'optimistic' as CharacterMood },
          portraits: { amira: IMAGES.amiraPortrait, mohamed: IMAGES.mohamedPortrait },
          amiraToneTag: 'Thoughtful 🤔 (Genomic Validation)',
          mohamedToneTag: 'Optimistic 💡 (Biogas Circular Economy)',
          toneNarrative: 'Thermophilic biogas digesters destroy 99.4% of resistant environmental pathogens.'
        };
      }

    case 'ch3': // The Farmer's Ledger
      if (currentChoice === 'A') {
        return {
          moods: { amira: 'concerned' as CharacterMood, mohamed: 'thoughtful' as CharacterMood },
          portraits: { amira: IMAGES.amiraPortrait, mohamed: IMAGES.mohamedPortrait },
          amiraToneTag: 'Concerned ⚠️ (Unsubsidized Burden)',
          mohamedToneTag: 'Thoughtful 🤔 (Margin Squeeze)',
          toneNarrative: 'Expecting livestock producers to shoulder 100% of transition costs risks widespread insolvency.'
        };
      } else {
        return {
          moods: { amira: 'thoughtful' as CharacterMood, mohamed: 'determined' as CharacterMood },
          portraits: { amira: IMAGES.amiraPortrait, mohamed: IMAGES.mohamedPortrait },
          amiraToneTag: 'Thoughtful 🤔 (Transition Co-Financing)',
          mohamedToneTag: 'Determined 🛡️ (Barn Upgrades Funded)',
          toneNarrative: 'Targeted government capital subsidies protect family farm solvency and accelerate adoption.'
        };
      }

    case 'ch4': // The Unified Chain
      if (currentChoice === 'A') {
        return {
          moods: { amira: 'skeptical' as CharacterMood, mohamed: 'concerned' as CharacterMood },
          portraits: { amira: IMAGES.amiraPortrait, mohamed: IMAGES.mohamedPortrait },
          amiraToneTag: 'Skeptical 🧐 (Commodity Race)',
          mohamedToneTag: 'Concerned ⚠️ (Price Squeeze)',
          toneNarrative: 'Unchecked retail price wars penalize responsible producers who invest in animal welfare.'
        };
      } else {
        return {
          moods: { amira: 'determined' as CharacterMood, mohamed: 'determined' as CharacterMood },
          portraits: { amira: IMAGES.amiraPortrait, mohamed: IMAGES.mohamedPortrait },
          amiraToneTag: 'Determined 🛡️ (Traceable Audits)',
          mohamedToneTag: 'Determined 🛡️ (14% Price Premium)',
          toneNarrative: 'Retail contracts guarantee price premiums for verifiable, digital RFID-monitored livestock.'
        };
      }

    case 'ch5': // Global Economics
      if (currentChoice === 'A') {
        return {
          moods: { amira: 'concerned' as CharacterMood, mohamed: 'thoughtful' as CharacterMood },
          portraits: { amira: IMAGES.amiraPortrait, mohamed: IMAGES.mohamedPortrait },
          amiraToneTag: 'Concerned ⚠️ (Siloed Spending)',
          mohamedToneTag: 'Thoughtful 🤔 (Veterinary Deficit)',
          toneNarrative: 'Fragmented budgets treat animal health and human medicine as competing fiscal demands.'
        };
      } else {
        return {
          moods: { amira: 'thoughtful' as CharacterMood, mohamed: 'optimistic' as CharacterMood },
          portraits: { amira: IMAGES.amiraPortrait, mohamed: IMAGES.mohamedPortrait },
          amiraToneTag: 'Thoughtful 🤔 ($1.4T GDP Protection)',
          mohamedToneTag: 'Optimistic 💡 (Field Diagnostics Network)',
          toneNarrative: 'A unified One Health sovereign fund preserves multi-trillion dollar macroeconomic output.'
        };
      }

    case 'ch6': // Cost of Inaction
      if (currentChoice === 'A') {
        return {
          moods: { amira: 'alarmed' as CharacterMood, mohamed: 'alarmed' as CharacterMood },
          portraits: { amira: IMAGES.amiraPortrait, mohamed: IMAGES.mohamedPortrait },
          amiraToneTag: 'Alarmed ⚡ (10M Annual Mortality)',
          mohamedToneTag: 'Alarmed ⚡ (Untreatable Epidemics)',
          toneNarrative: 'Postponing antimicrobial stewardship locks in global hospital collapse and untreatable infections.'
        };
      } else {
        return {
          moods: { amira: 'determined' as CharacterMood, mohamed: 'determined' as CharacterMood },
          portraits: { amira: IMAGES.amiraPortrait, mohamed: IMAGES.mohamedPortrait },
          amiraToneTag: 'Determined 🛡️ (42:1 Economic Return)',
          mohamedToneTag: 'Determined 🛡️ (Generational Farm Future)',
          toneNarrative: 'Proactive upfront biosecurity delivers an astounding 42:1 return in averted healthcare crises.'
        };
      }

    case 'ch7': // The Living Accord
    default:
      if (currentChoice === 'A') {
        return {
          moods: { amira: 'skeptical' as CharacterMood, mohamed: 'skeptical' as CharacterMood },
          portraits: { amira: IMAGES.amiraPortrait, mohamed: IMAGES.mohamedPortrait },
          amiraToneTag: 'Skeptical 🧐 (Unenforced Declarations)',
          mohamedToneTag: 'Skeptical 🧐 (Unfair Playing Field)',
          toneNarrative: 'Voluntary guidelines without statutory backing historically collapse under market downturns.'
        };
      } else {
        return {
          moods: { amira: 'celebratory' as CharacterMood, mohamed: 'celebratory' as CharacterMood },
          portraits: { amira: IMAGES.amiraPortrait, mohamed: IMAGES.mohamedPortrait },
          amiraToneTag: 'Celebratory 🎉 (Historic One Health Accord)',
          mohamedToneTag: 'Celebratory 🎉 (Guardian of Public Health)',
          toneNarrative: 'The Handshake is codified: farmers and scientists united to defend human and animal health.'
        };
      }
  }
}

export const ChapterSection: React.FC<ChapterSectionProps> = ({
  chapter,
  userRecord,
  onExploreTerm,
  onSelectChoice,
  onUpdateDecision = (_chapterId: string, _choice: 'A' | 'B') => {},
  onOpenPolicySimulator,
  onSelectChapter
}) => {
  const decisionData = CHAPTER_DECISIONS[chapter.id];
  const currentChoice = (userRecord.chapterDecisions?.[chapter.id] as 'A' | 'B') || 'B';

  // Compute dynamic character poses and portrait images matching userRecord + chapter tone
  const reactiveState = getChapterCharacterReactiveState(chapter.id, userRecord);

  // Chapter sequence index for smooth chapter-to-chapter transitions
  const currentIndex = CHAPTERS.findIndex((c) => c.id === chapter.id);
  const prevChapter = currentIndex > 0 ? CHAPTERS[currentIndex - 1] : null;
  const nextChapter = currentIndex < CHAPTERS.length - 1 ? CHAPTERS[currentIndex + 1] : null;

  const handleNavigateChapter = (targetId: string) => {
    audioController.playPop();
    if (onSelectChapter) {
      onSelectChapter(targetId);
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id={chapter.id} className="relative w-full py-16 sm:py-24 border-t border-[#292019]/10 dark:border-[#f0e6d6]/10 overflow-hidden chapter-viewport-optimized">
      {/* Background radial gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${chapter.gradient} pointer-events-none opacity-40`}
      />

      <motion.div
        className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 smooth-gpu"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {/* Chapter Header */}
        <motion.div variants={headerVariants} className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a8734a]/10 dark:bg-[#dda070]/10 border border-[#a8734a]/20 mb-3">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#a8734a] dark:text-[#dda070]">
              {chapter.kicker} · Scene {chapter.number}
            </span>
          </div>
          <h2 className="font-serif font-black text-3xl sm:text-5xl text-[#292019] dark:text-[#f0e6d6] mb-3 tracking-tight">
            {chapter.title}
          </h2>
          <p className="font-serif italic text-lg sm:text-xl text-[#a8734a] dark:text-[#dda070] mb-2">
            "{chapter.theme}"
          </p>
          <p className="text-sm sm:text-base text-[#6b5f52] dark:text-[#a8b2a9] leading-relaxed max-w-2xl mx-auto">
            {chapter.blurb}
          </p>
        </motion.div>

        {/* INTERACTIVE CHAPTER SCENE BRIEFING */}
        <motion.div variants={panelVariants}>
          <ChapterSceneBriefing
            chapter={chapter}
            onExploreTerm={onExploreTerm}
            onSelectChoice={onSelectChoice}
          />
        </motion.div>

        {/* DEDICATED GRAPHIC NOVEL STORY PANELS STRIP */}
        <motion.div variants={panelVariants} className="my-8">
          <GraphicNovelStrip
            chapterId={chapter.id}
            chapterTitle={chapter.title}
            chapterNumber={chapter.number}
            accentColor={chapter.accentColor}
            onExploreTerm={onExploreTerm}
          />
        </motion.div>

        {/* INTERACTIVE BRANCHING STORY DILEMMA */}
        {decisionData && (
          <motion.div variants={panelVariants} className="my-8">
            <ChapterDecisionBranch
              decision={decisionData}
              currentChoice={currentChoice}
              onMakeChoice={(choice) => onUpdateDecision(chapter.id, choice)}
              onOpenPolicySimulator={onOpenPolicySimulator}
            />
          </motion.div>
        )}

        {/* DYNAMIC CHARACTER REACTION HUD BAR */}
        <motion.div variants={panelVariants} className="my-3 px-4 py-3 rounded-2xl bg-white/80 dark:bg-[#16222c]/80 border border-[#a8734a]/25 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-[#8a7b6d] uppercase tracking-wider text-[10px]">
              Scene Reactive Poses:
            </span>
            <span className="font-serif text-[#292019] dark:text-[#f0e6d6] italic hidden sm:inline truncate max-w-md">
              "{reactiveState.toneNarrative}"
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black border bg-[#a8734a]/10 text-[#8a5b38] dark:text-[#dda070] border-[#a8734a]/30">
              Dr. Amira: {reactiveState.amiraToneTag}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black border bg-[#7d8f6c]/10 text-[#55663f] dark:text-[#a9bd9e] border-[#7d8f6c]/30">
              Mohamed: {reactiveState.mohamedToneTag}
            </span>
          </div>
        </motion.div>

        {/* Character Dialogue Stage */}
        <motion.div variants={panelVariants} className="my-6">
          <CharacterStage
            dialogues={chapter.dialogues}
            chapterTitle={chapter.title}
            chapterNumber={chapter.number}
            artPanelImg={chapter.artPanelImg}
            artCaption={chapter.artCaption}
            characterMoods={reactiveState.moods}
            characterPortraits={reactiveState.portraits}
            onExploreTerm={onExploreTerm}
            onSelectChoice={onSelectChoice}
          />
        </motion.div>

        {/* CHAPTER SPECIFIC COMPONENT ENRICHMENTS */}

        {/* Chapter 1: 3 Functions Cards */}
        {chapter.id === 'ch1' && (
          <motion.div variants={panelVariants} className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-3xl bg-[#fbf7ee]/90 dark:bg-[#16222c]/90 border border-[#a8734a]/20 shadow-md"
            >
              <div className="h-10 w-10 rounded-xl bg-[#a8734a]/15 text-[#8a5b38] dark:text-[#dda070] flex items-center justify-center mb-3">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-black text-base text-[#292019] dark:text-[#f0e6d6] mb-1">
                Treat Disease
              </h4>
              <p className="text-xs text-[#6b5f52] dark:text-[#a8b2a9] leading-relaxed">
                Targeting identified bacterial infections to protect individual animal welfare and prevent herd-wide mortality.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-3xl bg-[#fbf7ee]/90 dark:bg-[#16222c]/90 border border-[#7d8f6c]/20 shadow-md"
            >
              <div className="h-10 w-10 rounded-xl bg-[#7d8f6c]/15 text-[#55663f] dark:text-[#a9bd9e] flex items-center justify-center mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-black text-base text-[#292019] dark:text-[#f0e6d6] mb-1">
                Prevent Infection
              </h4>
              <p className="text-xs text-[#6b5f52] dark:text-[#a8b2a9] leading-relaxed">
                Prophylactic safeguarding in vulnerable windows, ideally superseded by improved sanitation and housing.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-3xl bg-[#fbf7ee]/90 dark:bg-[#16222c]/90 border border-[#6d80c4]/20 shadow-md"
            >
              <div className="h-10 w-10 rounded-xl bg-[#6d80c4]/15 text-[#54679f] dark:text-[#8ea0e0] flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-black text-base text-[#292019] dark:text-[#f0e6d6] mb-1">
                Historical Growth Promoters
              </h4>
              <p className="text-xs text-[#6b5f52] dark:text-[#a8b2a9] leading-relaxed">
                Sub-therapeutic feed additives used in previous decades, now phased out under modern global stewardship rules.
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Chapter 2: AMR Live Simulation */}
        {chapter.id === 'ch2' && (
          <motion.div variants={panelVariants} className="mt-12">
            <AMRSimulation />
          </motion.div>
        )}

        {/* Chapter 4: Value Chain Ribbon */}
        {chapter.id === 'ch4' && (
          <motion.div variants={panelVariants} className="mt-12 p-6 rounded-3xl bg-[#fbf7ee] dark:bg-[#16222c] border border-[#6d80c4]/30 shadow-lg">
            <h4 className="font-serif font-black text-lg text-center text-[#292019] dark:text-[#f0e6d6] mb-6">
              The Value Chain Transmission of Incentives
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center p-3 rounded-2xl bg-white/70 dark:bg-[#0f1620]/70 border border-[#292019]/10">
                <div className="h-10 w-10 rounded-full bg-[#a8734a]/15 text-[#a8734a] flex items-center justify-center mb-2">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="font-serif font-bold text-sm text-[#292019] dark:text-[#f0e6d6]">1. Farm Gate</span>
                <span className="text-[11px] text-[#6b5f52] dark:text-[#a8b2a9] mt-0.5">Husbandry & Dosing</span>
              </div>

              <div className="flex flex-col items-center p-3 rounded-2xl bg-white/70 dark:bg-[#0f1620]/70 border border-[#292019]/10">
                <div className="h-10 w-10 rounded-full bg-[#7d8f6c]/15 text-[#7d8f6c] flex items-center justify-center mb-2">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="font-serif font-bold text-sm text-[#292019] dark:text-[#f0e6d6]">2. Processor</span>
                <span className="text-[11px] text-[#6b5f52] dark:text-[#a8b2a9] mt-0.5">Testing & Premiums</span>
              </div>

              <div className="flex flex-col items-center p-3 rounded-2xl bg-white/70 dark:bg-[#0f1620]/70 border border-[#292019]/10">
                <div className="h-10 w-10 rounded-full bg-[#6d80c4]/15 text-[#6d80c4] flex items-center justify-center mb-2">
                  <Store className="w-5 h-5" />
                </div>
                <span className="font-serif font-bold text-sm text-[#292019] dark:text-[#f0e6d6]">3. Retailer</span>
                <span className="text-[11px] text-[#6b5f52] dark:text-[#a8b2a9] mt-0.5">Certifications</span>
              </div>

              <div className="flex flex-col items-center p-3 rounded-2xl bg-white/70 dark:bg-[#0f1620]/70 border border-[#292019]/10">
                <div className="h-10 w-10 rounded-full bg-[#dd9f66]/15 text-[#dd9f66] flex items-center justify-center mb-2">
                  <Utensils className="w-5 h-5" />
                </div>
                <span className="font-serif font-bold text-sm text-[#292019] dark:text-[#f0e6d6]">4. Consumer</span>
                <span className="text-[11px] text-[#6b5f52] dark:text-[#a8b2a9] mt-0.5">Safety & Trust</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Chapter 5: Regional Breakdown */}
        {chapter.id === 'ch5' && (
          <motion.div variants={panelVariants} className="mt-10">
            <RegionalBars />
          </motion.div>
        )}

        {/* Chapter 6: Action vs Inaction Dual Timelines */}
        {chapter.id === 'ch6' && (
          <motion.div variants={panelVariants} className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Act Now */}
            <div className="p-6 rounded-3xl bg-[#67795a] text-[#f4ead8] shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#e8dcc6] mb-3">
                  <CheckCircle className="w-4 h-4 text-[#e8dcc6]" />
                  Timeline A · Coordinated Action
                </div>
                <h4 className="font-serif font-black text-2xl mb-3">
                  Upfront Investment, Lasting Efficacy
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-[#f4ead8]/90 leading-relaxed">
                  <li>• $28B transition investment strengthens veterinary diagnostics and animal welfare.</li>
                  <li>• Global antimicrobial usage intensity falls by 30% to 50%, offsetting herd growth.</li>
                  <li>• First-line antimicrobials retain therapeutic potency for human medicine and livestock alike.</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#f4ead8]/20 text-xs font-bold text-[#e8dcc6]">
                Benefit: Broad, equitable, generational health security.
              </div>
            </div>

            {/* Wait & See */}
            <div className="p-6 rounded-3xl bg-[#7f2c26] text-[#f4ead8] shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#dd9f66] mb-3">
                  <AlertOctagon className="w-4 h-4 text-[#dd9f66]" />
                  Timeline B · Inaction / Status Quo
                </div>
                <h4 className="font-serif font-black text-2xl mb-3">
                  Short-Term Comfort, Compounding Shock
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-[#f4ead8]/90 leading-relaxed">
                  <li>• AMU climbs 30% by 2040 to 143,481 tonnes, accelerating resistant strains.</li>
                  <li>• Common veterinary treatments fail, causing severe livestock mortality and food supply shocks.</li>
                  <li>• Macroeconomic losses multiply into trillions as secondary health-care costs explode.</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#f4ead8]/20 text-xs font-bold text-[#dd9f66]">
                Risk: Disproportionate burden on lower-income import economies.
              </div>
            </div>
          </motion.div>
        )}

        {/* Chapter 7: Interactive Intensity Throttle */}
        {chapter.id === 'ch7' && (
          <motion.div variants={panelVariants} className="mt-12">
            <IntensityLeverbox />
          </motion.div>
        )}

        {/* Epilogue: Your Path Recap */}
        {chapter.id === 'epilogue' && (
          <motion.div variants={panelVariants} className="mt-12">
            <YourPathRecap record={userRecord} />
          </motion.div>
        )}

        {/* INTER-CHAPTER SMOOTH TRANSITION FOOTER & SCENE CONTINUATION */}
        <motion.div
          variants={panelVariants}
          className="mt-16 pt-8 border-t-2 border-dashed border-[#292019]/15 dark:border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#fbf7ee]/60 via-white/80 to-[#fbf7ee]/60 dark:from-[#16222c]/60 dark:via-[#1a2936]/80 dark:to-[#16222c]/60 p-5 sm:p-6 rounded-3xl border border-[#292019]/10 dark:border-white/10 shadow-sm"
        >
          {/* Previous Scene Button */}
          {prevChapter ? (
            <button
              onClick={() => handleNavigateChapter(prevChapter.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#121c24] text-[#292019] dark:text-[#d6dcd4] border border-[#292019]/15 dark:border-white/15 text-xs font-bold hover:bg-[#a8734a]/10 hover:border-[#a8734a]/40 active:scale-95 transition-all cursor-pointer shadow-xs group"
            >
              <ArrowLeft className="w-4 h-4 text-[#a8734a] dark:text-[#dda070] group-hover:-translate-x-0.5 transition-transform" />
              <span>Previous Scene: {prevChapter.kicker}</span>
            </button>
          ) : (
            <button
              onClick={() => handleNavigateChapter('hero')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#121c24] text-[#292019] dark:text-[#d6dcd4] border border-[#292019]/15 dark:border-white/15 text-xs font-bold hover:bg-[#a8734a]/10 active:scale-95 transition-all cursor-pointer shadow-xs group"
            >
              <Compass className="w-4 h-4 text-[#a8734a] dark:text-[#dda070]" />
              <span>Back to Cover</span>
            </button>
          )}

          {/* Chapter Scene Dots Indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {CHAPTERS.map((c, idx) => {
              const isActive = c.id === chapter.id;
              const isPast = idx < currentIndex;
              return (
                <button
                  key={c.id}
                  onClick={() => handleNavigateChapter(c.id)}
                  title={`${c.kicker}: ${c.title}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-7 bg-[#a8734a] dark:bg-[#dda070] shadow-xs'
                      : isPast
                      ? 'w-2.5 bg-[#7d8f6c] dark:bg-[#8e9f90] hover:scale-125 opacity-70'
                      : 'w-2.5 bg-[#292019]/20 dark:bg-white/20 hover:scale-125 opacity-50'
                  }`}
                  aria-label={`Jump to ${c.kicker}`}
                />
              );
            })}
          </div>

          {/* Next Scene Continuation Card / Action */}
          {nextChapter ? (
            <button
              onClick={() => handleNavigateChapter(nextChapter.id)}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#292019] dark:bg-[#dda070] text-[#f4ead8] dark:text-[#182430] text-xs sm:text-sm font-black hover:bg-[#a8734a] dark:hover:bg-[#c98e5e] hover:text-white active:scale-95 transition-all shadow-[4px_4px_0px_0px_rgba(41,32,25,0.8)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer group"
            >
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider block opacity-80 leading-none">
                  Next Chapter · Scene {nextChapter.number}
                </span>
                <span className="font-serif font-black">{nextChapter.title}</span>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={() => handleNavigateChapter('hero')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#a8734a] text-white text-xs sm:text-sm font-black hover:bg-[#8f5e39] active:scale-95 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] cursor-pointer group"
            >
              <span>The Journey Concludes · Return to Top</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

