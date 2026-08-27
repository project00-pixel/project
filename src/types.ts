export type SpeakerId = 'a' | 's' | 'n';

export type CharacterMood = 
  | 'neutral' 
  | 'speaking' 
  | 'thinking' 
  | 'thoughtful'
  | 'passionate' 
  | 'concerned' 
  | 'consensus'
  | 'celebratory'
  | 'skeptical'
  | 'alarmed'
  | 'determined'
  | 'optimistic';

export interface SpeakerProfile {
  id: SpeakerId;
  name: string;
  role: string;
  affiliation: string;
  avatarLetter: string;
  accentColor: string;
  accentBg: string;
  portraitImg: string;
  speakingImg: string;
  description: string;
}

export interface ChoiceOption {
  label: string;
  targetChapterId?: string;
  branchLines?: DialogueLine[];
}

export interface DialogueLine {
  speaker: SpeakerId | 'choices';
  text?: string;
  options?: ChoiceOption[];
}

export interface TermDefinition {
  term: string;
  fullTitle: string;
  description: string;
}

export interface DecisionOption {
  id: 'A' | 'B';
  label: string;
  shortTitle: string;
  description: string;
  tags: string[];
  impact: {
    amuReduction: number; // e.g. 5 vs 28
    farmSolvency: number; // e.g. -12 vs +15
    publicHealthSavingsBillion: number; // e.g. 120 vs 680
    consumerPriceShiftPct: number; // e.g. 0 vs +4.5
  };
  characterReactions: {
    amira: {
      mood: CharacterMood;
      reaction: string;
    };
    mohamed: {
      mood: CharacterMood;
      reaction: string;
    };
  };
}

export interface ChapterDecision {
  chapterId: string;
  chapterNumber: string;
  chapterTitle: string;
  dilemmaQuestion: string;
  contextSummary: string;
  optionA: DecisionOption;
  optionB: DecisionOption;
}

export interface ChapterMeta {
  id: string;
  number: string;
  title: string;
  kicker: string;
  theme: string;
  blurb: string;
  accentColor: string;
  gradient: string;
  artPanelImg?: string;
  artCaption?: string;
  dialogues: DialogueLine[];
  decision?: ChapterDecision;
}

export interface UserPathRecord {
  choice: string;
  termsExplored: string[];
  theme: 'day' | 'night';
  filmMode: boolean;
  intensityLevel: number;
  chapterDecisions?: Record<string, 'A' | 'B'>;
}
