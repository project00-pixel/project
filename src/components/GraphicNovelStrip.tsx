import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IMAGES } from '../data/chaptersData';
import { audioController } from '../utils/sound';
import {
  Sparkles,
  Maximize2,
  Volume2,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Eye,
  MessageSquare,
  Play,
  RotateCcw,
  CheckCircle2,
  Info,
  ZoomIn,
  ZoomOut,
  Search,
  Move,
  Crosshair
} from 'lucide-react';

export interface ComicPanelData {
  id: string;
  panelNumber: number;
  badge: string;
  title: string;
  art: string;
  soundEffect?: string;
  narrativeCaption?: string;
  speaker?: 'a' | 's' | 'vet' | 'consensus' | 'narrator';
  speakerRole?: string;
  dialogue?: string;
  thoughtBubble?: string;
  insightCallout?: string;
  cameraAngle: 'Wide Cinematic Splash' | 'Character Dialogue' | 'Close-Up Diagnostic' | 'Dynamic Climax';
  panelLayoutType?: 'wide-splash' | 'standard' | 'tall-focus';
}

interface GraphicNovelStripProps {
  chapterId: string;
  chapterTitle: string;
  chapterNumber: string;
  accentColor: string;
  onExploreTerm?: (term: string) => void;
}

export const GraphicNovelStrip: React.FC<GraphicNovelStripProps> = ({
  chapterId,
  chapterTitle,
  chapterNumber,
  accentColor,
  onExploreTerm
}) => {
  // Mode: 'flowing-page' (Continuous graphic novel layout) | 'cinematic-reader' (Panel-by-panel slide walkthrough)
  const [viewMode, setViewMode] = useState<'flowing-page' | 'cinematic-reader'>('flowing-page');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [selectedPanel, setSelectedPanel] = useState<ComicPanelData | null>(null);

  // Lightbox Zoom & Loupe States
  const [lightboxZoom, setLightboxZoom] = useState<number>(1.0);
  const [isLoupeActive, setIsLoupeActive] = useState<boolean>(false);
  const [loupeCoords, setLoupeCoords] = useState<{ x: number; y: number; pctX: number; pctY: number; inside: boolean }>({
    x: 0,
    y: 0,
    pctX: 50,
    pctY: 50,
    inside: false
  });
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const resetLightboxView = () => {
    setLightboxZoom(1.0);
    setPanOffset({ x: 0, y: 0 });
    setIsLoupeActive(false);
  };

  // Chapter-specific rich story panels (6 distinct panels per chapter with unique art)
  const getChapterPanels = (): ComicPanelData[] => {
    switch (chapterId) {
      case 'prologue':
        return [
          {
            id: 'prologue-1',
            panelNumber: 1,
            badge: 'ESTABLISHING · DAWN AT AL-WADI',
            title: 'Sunrise Over the Feedlot',
            art: IMAGES.prologueDawnFeedlot,
            soundEffect: 'RUMBLE...',
            narrativeCaption: '05:45 AM. Dawn mist rolls across 800 feedlot cattle. Margins are razor-thin, and sudden seasonal temperature swings threaten respiratory outbreaks.',
            speaker: 's',
            speakerRole: 'Feedlot Operator',
            dialogue: 'One sick steer in pen four means twenty more by Thursday. If pneumonia takes hold, my entire season profit vanishes before the weekend.',
            thoughtBubble: 'Without preventative feed buffers, how do I protect my family’s solvency against an invisible airborne wave?',
            insightCallout: 'Farm Solvency Horizon: A 72-hour window separates a single infection from a barn-wide outbreak.',
            cameraAngle: 'Wide Cinematic Splash',
            panelLayoutType: 'wide-splash'
          },
          {
            id: 'prologue-2',
            panelNumber: 2,
            badge: 'GLOBAL SYSTEMS · GENEVA FORUM',
            title: 'The Macroeconomic Horizon',
            art: IMAGES.prologueGenevaForum,
            soundEffect: 'CHIME',
            narrativeCaption: 'FAO Global Directorate. Epidemiologists map the unseen accumulation of sub-therapeutic antimicrobial exposure across global supply chains.',
            speaker: 'a',
            speakerRole: 'One Health Science Lead',
            dialogue: 'Every unmeasured preventative dose compounds into resistant pathogen strains. Microbes do not carry passports; they cross oceans on commercial flights.',
            thoughtBubble: 'We cannot treat antibiotics as a cheap substitute for basic barn ventilation and clean water infrastructure.',
            insightCallout: 'Negative Externality: Sub-therapeutic livestock dosing generates unpriced clinical costs for human hospitals.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'prologue-3',
            panelNumber: 3,
            badge: 'DIAGNOSTIC TEST · FIELD CHUTE',
            title: 'Pen-Side Microbial Culture',
            art: IMAGES.vetDiagnostic,
            soundEffect: 'BEEP · SCANNING',
            narrativeCaption: 'Veterinary technicians prepare rapid luminescence sensitivity assays directly at the pen gate to isolate specific bacterial strains.',
            speaker: 'vet',
            speakerRole: 'Field Veterinarian',
            dialogue: 'Test results in 18 minutes. We can target the exact strain with a narrow-spectrum prescription instead of blanket-dosing the entire herd.',
            thoughtBubble: 'Precision diagnostics turn empirical guessing into targeted, life-saving clinical medicine.',
            insightCallout: 'Pen-side diagnostics reduce overall broad-spectrum antibiotic consumption by 68%.',
            cameraAngle: 'Close-Up Diagnostic',
            panelLayoutType: 'standard'
          },
          {
            id: 'prologue-4',
            panelNumber: 4,
            badge: 'FARM GATE · THE DIALOGUE',
            title: 'The Tension at the Fence Line',
            art: IMAGES.prologueFenceTension,
            soundEffect: 'WIND IN THE RIDGE',
            narrativeCaption: 'Dr. Amira arrives at Al-Wadi Farm. Science policy confronts frontline production realities at the paddock fence.',
            speaker: 's',
            speakerRole: 'Mohamed (Livestock Producer)',
            dialogue: 'If policymakers ban our tools without funding our biosecurity retrofits, you leave family farmers holding 100% of the biological risk.',
            thoughtBubble: 'She sees the global epidemiological curve; I see the mortgage payment due on the 1st.',
            insightCallout: 'Producer Adoption Hurdle: Transitioning to stewardship requires upfront capital and technical de-risking.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'wide-splash'
          },
          {
            id: 'prologue-5',
            panelNumber: 5,
            badge: 'POLICY MECHANISM · RENOFARM',
            title: 'The Co-Financed Solution',
            art: IMAGES.prologueAmiraBlueprint,
            soundEffect: 'CLICK',
            narrativeCaption: 'Dr. Amira lays out the 10-year RENOFARM framework: subsidizing rapid diagnostic cartridges and barn ventilation upgrades.',
            speaker: 'a',
            speakerRole: 'Dr. Amira (Science Lead)',
            dialogue: 'We do not ask you to absorb this transition alone. Transition grants buffer your cash flow while precision testing safeguards human medicine.',
            thoughtBubble: 'A policy that bankrupts the farmer is a policy that fails the world.',
            insightCallout: 'RENOFARM 4 Pillars: Good Husbandry, Diagnostics, Stewardship, and Transition Subsidies.',
            cameraAngle: 'Close-Up Diagnostic',
            panelLayoutType: 'standard'
          },
          {
            id: 'prologue-6',
            panelNumber: 6,
            badge: 'THE COVENANT · THE HANDSHAKE',
            title: 'The Handshake Accord',
            art: IMAGES.handshake2d,
            soundEffect: '✨ COVENANT RATIFIED',
            narrativeCaption: 'Science and husbandry unite. A shared covenant between veterinary stewardship and farm livelihood.',
            speaker: 'consensus',
            speakerRole: 'The One Health Accord',
            dialogue: 'Protecting farm solvency and preserving human medicine are not opposing goals — they are the two hands of the exact same future.',
            thoughtBubble: 'The covenant is forged: science-backed agriculture feeding humanity safely.',
            insightCallout: 'The Handshake Principle: Safeguarding human medicine while securing livestock producer prosperity.',
            cameraAngle: 'Dynamic Climax',
            panelLayoutType: 'wide-splash'
          }
        ];

      case 'chapter1':
      case 'ch1':
        return [
          {
            id: 'ch1-1',
            panelNumber: 1,
            badge: 'MOLECULAR SCALE · FEED MILL',
            title: 'Molecules That Feed the World',
            art: IMAGES.ch1Art,
            soundEffect: 'HUMMM · ROTOR SPIN',
            narrativeCaption: 'Inside industrial feed hoppers, low-dose antimicrobial compounds historically served as an invisible crutch to accelerate animal weight gain.',
            speaker: 'a',
            speakerRole: 'Dr. Amira',
            dialogue: 'We turned miracle human therapeutics into routine feed additives to compress livestock fattening cycles by a mere matter of days.',
            thoughtBubble: 'Decades of low-dose usage created a quiet biological selection pressure worldwide.',
            insightCallout: 'Historical Growth Promotion: Accounted for up to 32% of unmanaged global antibiotic volume.',
            cameraAngle: 'Wide Cinematic Splash',
            panelLayoutType: 'wide-splash'
          },
          {
            id: 'ch1-2',
            panelNumber: 2,
            badge: 'FARM GATE · HOUSING STRESS',
            title: 'The Density Paradox',
            art: IMAGES.ch1CrowdedDensity,
            soundEffect: 'CREAK',
            narrativeCaption: 'High stocking densities create pathogen transmission corridors unless offset by expensive positive-pressure ventilation and slotted dry flooring.',
            speaker: 's',
            speakerRole: 'Mohamed',
            dialogue: 'Without prophylactic buffering or modern barn airflow, a single cold front can trigger pen-wide shipping fever within 48 hours.',
            thoughtBubble: 'I didn’t use antibiotics to be reckless; I used them because my barn’s ventilation wasn’t built for 800 head.',
            insightCallout: 'Housing Retrofit Cost: Biosecurity upgrades require $14-$25/head in initial capital expenditures.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch1-3',
            panelNumber: 3,
            badge: 'MICROBIOME · INTESTINAL WALL',
            title: 'The Gut Shield Erosion',
            art: IMAGES.comicAmrTransfer,
            soundEffect: 'BIO-DISRUPTION',
            narrativeCaption: 'Continuous prophylactic drug exposure disrupts the native livestock gut microbiome, clearing natural competitors and leaving room for resistant strains.',
            speaker: 'a',
            speakerRole: 'Dr. Amira',
            dialogue: 'Blanket antibiotics do not just kill bad bacteria; they destroy the animal’s natural immunological barrier, creating long-term chemical dependence.',
            thoughtBubble: 'A healthy gut microbiome is the animal’s first line of natural defense.',
            insightCallout: 'Dysbiosis Risk: Chronic sub-therapeutic dosing degrades natural mucosal immunity.',
            cameraAngle: 'Close-Up Diagnostic',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch1-4',
            panelNumber: 4,
            badge: 'IMMUNOLOGY · MODERN VACCINES',
            title: 'Targeted Biological Shielding',
            art: IMAGES.ch1AmrCultureLab,
            soundEffect: 'CLICK · PIPETTE',
            narrativeCaption: 'Modern mucosal vaccines train bovine antibody production without applying antibiotic selection pressure to commensal bacteria.',
            speaker: 'a',
            speakerRole: 'Dr. Amira',
            dialogue: 'Vaccines train the calf’s own immune system. They do not trigger drug resistance, and they eliminate the need for preventative flock medicating.',
            thoughtBubble: 'Immunology replaces chemotherapy as our first line of preventative care.',
            insightCallout: 'Vaccination Efficacy: Modern viral-bacterial combo vaccines drop antibiotic need by 74%.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch1-5',
            panelNumber: 5,
            badge: 'FARM UPGRADE · AIRFLOW FANS',
            title: 'The Ventilation Conversion',
            art: IMAGES.comicFarmBiosecurity,
            soundEffect: 'WHIRR · FRESH BREEZE',
            narrativeCaption: 'Al-Wadi Farm installs HEPA-filtered positive-pressure intake fans, dropping barn humidity by 40% and eliminating airborne ammonia buildup.',
            speaker: 's',
            speakerRole: 'Mohamed',
            dialogue: 'The calves are breathing crisp, dry air. In three months, our respiratory treatment cases fell by more than 80%.',
            thoughtBubble: 'Good engineering and clean airflow did what chemicals were only masking.',
            insightCallout: 'Air Quality Metric: Lowering ammonia below 10ppm reduces respiratory lesions by 92%.',
            cameraAngle: 'Wide Cinematic Splash',
            panelLayoutType: 'wide-splash'
          },
          {
            id: 'ch1-6',
            panelNumber: 6,
            badge: 'STEWARDSHIP · PRUDENT USE',
            title: 'The Clinical Protocol',
            art: IMAGES.ch1ClinicalProtocol,
            soundEffect: 'VERIFIED',
            narrativeCaption: 'Therapeutic antibiotic treatments are reserved solely for clinically verified sick animals under strict veterinary oversight.',
            speaker: 'consensus',
            speakerRole: 'Responsible Use Standard',
            dialogue: 'Use as little as possible, as much as necessary. Preserving life-saving medicines while raising robust, resilient herds.',
            thoughtBubble: 'A sustainable production model where animal welfare and human medicine protect each other.',
            insightCallout: 'Global Benchmark: Target 30% reduction in agricultural antimicrobial use by 2030.',
            cameraAngle: 'Dynamic Climax',
            panelLayoutType: 'standard'
          }
        ];

      case 'chapter2':
      case 'ch2':
        return [
          {
            id: 'ch2-1',
            panelNumber: 1,
            badge: 'GENOMICS · PLASMID CONJUGATION',
            title: 'The Silent Evolution',
            art: IMAGES.ch2Art,
            soundEffect: 'MUTATION...',
            narrativeCaption: 'Inside the bovine intestine, sub-inhibitory antimicrobial residues create extreme evolutionary pressure. Resistant bacteria exchange survival code.',
            speaker: 'a',
            speakerRole: 'Dr. Amira',
            dialogue: 'When low doses fail to kill bacteria completely, surviving cells build genetic shields and share them across species via plasmid conjugation.',
            thoughtBubble: 'A single resistance gene on a transposon can jump between bovine E. coli and human pathogens.',
            insightCallout: 'Horizontal Gene Transfer: Enables bacteria to acquire multidrug resistance in hours.',
            cameraAngle: 'Wide Cinematic Splash',
            panelLayoutType: 'wide-splash'
          },
          {
            id: 'ch2-2',
            panelNumber: 2,
            badge: 'EPIDEMIOLOGY · RUNOFF & VECTORS',
            title: 'Breaching the Farm Gate',
            art: IMAGES.ch2SlurryRunoff,
            soundEffect: 'SPLASH · RAIN',
            narrativeCaption: 'Heavy rain carries agricultural slurry into nearby groundwater channels, carrying mobile resistance genes into the wider ecosystem.',
            speaker: 'a',
            speakerRole: 'Dr. Amira',
            dialogue: 'Untreated farm runoff carries resistant genetic material into municipal waterways, where wild birds and irrigation canals spread it for miles.',
            thoughtBubble: 'The environment acts as a massive reservoir amplifying resistant genetic markers.',
            insightCallout: 'Environmental Route: Over 70% of administered antibiotics are excreted active in manure.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch2-3',
            panelNumber: 3,
            badge: 'CLINICAL ALERT · INTENSIVE CARE',
            title: 'The Hospital Alarm',
            art: IMAGES.comicHospitalAlert,
            soundEffect: 'HEART MONITOR BEEP',
            narrativeCaption: 'Regional General Hospital. Doctors battle a severe bloodstream infection in a patient that fails to respond to third-generation cephalosporins.',
            speaker: 'a',
            speakerRole: 'Dr. Amira',
            dialogue: 'The ICU isolation lab identified a blaNDM-1 resistance plasmid in a human patient — genetically identical to isolates from local livestock waste.',
            thoughtBubble: 'When last-line hospital antibiotics fail, simple infections turn fatal.',
            insightCallout: 'Human Health Toll: Over 1.27 million annual direct deaths globally attributed to AMR.',
            cameraAngle: 'Close-Up Diagnostic',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch2-4',
            panelNumber: 4,
            badge: 'REVELATION · THE LAB LEDGER',
            title: 'Facing the Evidence',
            art: IMAGES.ch2DnaMatchTest,
            soundEffect: 'HEAVY SIGH',
            narrativeCaption: 'Mohamed views the genomic fingerprint report in the laboratory. The reality of cross-sectoral transmission becomes undeniably personal.',
            speaker: 's',
            speakerRole: 'Mohamed',
            dialogue: 'I thought my feed trough was my business alone. Seeing this DNA match makes me realize my farm is directly tied to the ICU down the road.',
            thoughtBubble: 'My own family visits that clinic. I cannot be part of the chain that breaks penicillin.',
            insightCallout: 'One Health Realization: Human, animal, and environmental health are indivisible.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch2-5',
            panelNumber: 5,
            badge: 'SLURRY MANAGEMENT · BIOGAS',
            title: 'Neutralizing the Runoff',
            art: IMAGES.ch2BiogasDigester,
            soundEffect: 'PRESSURE GAUGE HUM',
            narrativeCaption: 'Al-Wadi Farm installs high-temperature anaerobic biogas digestion, destroying 99.4% of pathogenic bacteria and active antibiotic residues before field application.',
            speaker: 's',
            speakerRole: 'Mohamed',
            dialogue: 'We heat-treat the manure through thermophilic digestion. We capture clean methane power and neutralize resistant bacteria at the source.',
            thoughtBubble: 'Turning a biological hazard into renewable farm energy and safe organic fertilizer.',
            insightCallout: 'Manure Biosecurity: Thermophilic digestion degrades 95%+ of active beta-lactam molecules.',
            cameraAngle: 'Wide Cinematic Splash',
            panelLayoutType: 'wide-splash'
          },
          {
            id: 'ch2-6',
            panelNumber: 6,
            badge: 'ONE HEALTH · PROTOCOL SHIFT',
            title: 'Closing the Transmission Loop',
            art: IMAGES.ch2OneHealthShield,
            soundEffect: 'SHIELD ACTIVE',
            narrativeCaption: 'Continuous genomic surveillance, farm runoff barriers, and rapid hospital alerting form an impenetrable defense against resistant superbugs.',
            speaker: 'consensus',
            speakerRole: 'One Health Pact',
            dialogue: 'By sealing the gaps between pen, stream, and hospital ward, we protect the biological effectiveness of modern medicine.',
            thoughtBubble: 'Stewardship is humanity’s shared immunological armor.',
            insightCallout: 'Integrated Surveillance: Quadripartite global tracking stops outbreaks before they become pandemics.',
            cameraAngle: 'Dynamic Climax',
            panelLayoutType: 'standard'
          }
        ];

      case 'chapter3':
      case 'ch3':
        return [
          {
            id: 'ch3-1',
            panelNumber: 1,
            badge: 'FARM OFFICE · MIDNIGHT LEDGER',
            title: 'The Solvency Dilemma',
            art: IMAGES.ch3Art,
            soundEffect: 'CALCULATOR TAPPING',
            narrativeCaption: 'Midnight at Al-Wadi Farm. Mohamed calculates livestock feed costs, veterinary pharmaceutical bills, and bank loan interest rates.',
            speaker: 's',
            speakerRole: 'Mohamed',
            dialogue: 'My profit margin is just $34 per steer. A 3% bump in disease mortality wipes out my entire net income for the year.',
            thoughtBubble: 'How do I invest $15,000 into new barn floors when grain prices just spiked 20%?',
            insightCallout: 'Producer Economics: Feed and debt service account for 78% of total feedlot operating costs.',
            cameraAngle: 'Wide Cinematic Splash',
            panelLayoutType: 'wide-splash'
          },
          {
            id: 'ch3-2',
            panelNumber: 2,
            badge: 'PEN INSPECTION · FIELD REALITY',
            title: 'Walking the Pens Together',
            art: IMAGES.ch3WalkingCleanPens,
            soundEffect: 'BOOTS IN MUD',
            narrativeCaption: 'Dr. Amira visits Al-Wadi in work boots, walking the pens to assess actual pen humidity, draft corridors, and watering troughs.',
            speaker: 'a',
            speakerRole: 'Dr. Amira',
            dialogue: 'Stewardship isn’t about lecturing from an office. We have to identify low-cost, high-leverage fixes right here in the pen.',
            thoughtBubble: 'Fixing that leaky waterer will cut bacterial load by 60% with almost zero capital cost.',
            insightCallout: 'Environmental Auditing: 3 simple pen fixes eliminate 80% of routine pathogen exposure points.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch3-3',
            panelNumber: 3,
            badge: 'BIOSECURITY ROADMAP · 3 TIERS',
            title: 'The Staged Investment Plan',
            art: IMAGES.ch3BiosecurityChalkboard,
            soundEffect: 'CHALK ON BOARD',
            narrativeCaption: 'Breaking the transition into three manageable tiers: Stage 1 Sanitation, Stage 2 Ventilation & Vaccines, Stage 3 Precision Biometrics.',
            speaker: 'vet',
            speakerRole: 'Veterinary Advisor',
            dialogue: 'Start with boot sanitation dips and water chlorination ($4/head). That alone cuts baseline sickness by half in 60 days.',
            thoughtBubble: 'Show the producer fast financial returns on Stage 1 to build confidence for Stage 2.',
            insightCallout: 'Staged Adoption: Tiered biosecurity provides immediate cash-flow stabilization.',
            cameraAngle: 'Close-Up Diagnostic',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch3-4',
            panelNumber: 4,
            badge: 'FINANCIAL BRIDGE · TRANSITION GRANTS',
            title: 'De-Risking the Pivot',
            art: IMAGES.ch3GrantApproval,
            soundEffect: 'STAMP · APPROVED',
            narrativeCaption: 'National agricultural transition subsidies cover 60% of the ventilation installation costs, preventing producer cash insolvency.',
            speaker: 'a',
            speakerRole: 'Dr. Amira',
            dialogue: 'Government transition grants de-risk your investment. You improve herd health today, and the public protects its healthcare future.',
            thoughtBubble: 'Public investment in farm biosecurity saves 18x that amount in national hospital expenditures.',
            insightCallout: 'Economic Multiplier: $1 in farm biosecurity subsidy yields $18 in avoided healthcare costs.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch3-5',
            panelNumber: 5,
            badge: 'HARVEST RESULTS · THE NEW BALANCE',
            title: 'The Profit Breakthrough',
            art: IMAGES.ch3HarvestProfit,
            soundEffect: 'REGISTER CHIME',
            narrativeCaption: 'Six months later. Mortality is down to 1.1%, veterinary drug bills dropped 78%, and average steer weight gain improved by 8%.',
            speaker: 's',
            speakerRole: 'Mohamed',
            dialogue: 'Our net margin increased to $58 per head! Cleaner air and targeted vaccines didn’t cost us money — they made our farm more profitable.',
            thoughtBubble: 'We replaced emergency drug panic with predictable, healthy herd growth.',
            insightCallout: 'Long-Term ROI: Stewardship farms demonstrate higher feed-conversion efficiency and lower mortality.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch3-6',
            panelNumber: 6,
            badge: 'COMMUNITY IMPACT · REGIONAL MODEL',
            title: 'The Blueprint Spreads',
            art: IMAGES.ch3FarmerStudyTour,
            soundEffect: 'CHEERS · HANDSHAKE',
            narrativeCaption: 'Neighboring livestock producers visit Al-Wadi to study Mohamed’s biosecurity layout, launching a county-wide transition network.',
            speaker: 'consensus',
            speakerRole: 'Farmer Network Accord',
            dialogue: 'When farmers lead the change with proven economic numbers, the entire agricultural valley transforms together.',
            thoughtBubble: 'Sustainable farming is contagious when the economics work.',
            insightCallout: 'Peer-to-Peer Scaling: Farmer-led demonstration farms drive 4x higher regional adoption rates.',
            cameraAngle: 'Dynamic Climax',
            panelLayoutType: 'wide-splash'
          }
        ];

      case 'chapter4':
      case 'ch4':
        return [
          {
            id: 'ch4-1',
            panelNumber: 1,
            badge: 'RETAIL PROCUREMENT · SUPERMARKET',
            title: 'The Buyer’s Dilemma',
            art: IMAGES.ch4Art,
            soundEffect: 'BARCODE BEEP',
            narrativeCaption: 'Major supermarket chains face mounting consumer demand for antibiotic-responsible meat, but fear supply disruptions.',
            speaker: 'a',
            speakerRole: 'Dr. Amira',
            dialogue: 'Retail buyers hold enormous purchasing power. If procurement specs reward responsible stewardship, farm gates follow overnight.',
            thoughtBubble: 'Supermarkets dictate farm practices through their purchasing contracts.',
            insightCallout: 'Procurement Power: Retail supermarkets purchase over 68% of commercial poultry and pork volume.',
            cameraAngle: 'Wide Cinematic Splash',
            panelLayoutType: 'wide-splash'
          },
          {
            id: 'ch4-2',
            panelNumber: 2,
            badge: 'FARM GATE · THE CONTRACT TENSION',
            title: 'Fair Pricing for Clean Husbandry',
            art: IMAGES.ch4DockNegotiation,
            soundEffect: 'PAPER FLIP',
            narrativeCaption: 'Mohamed meets with wholesale meat aggregators to demand fair contract pricing for certified antibiotic-prudent livestock.',
            speaker: 's',
            speakerRole: 'Mohamed',
            dialogue: 'If processors pay the exact same price for clean biosecure beef as unmonitored baseline cattle, they penalize the farmers doing it right.',
            thoughtBubble: 'Quality and stewardship must be recognized on the purchase invoice.',
            insightCallout: 'Value Chain Alignment: Contracts must guarantee farm-gate price premiums for verified stewardship.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch4-3',
            panelNumber: 3,
            badge: 'DIGITAL TRACEABILITY · BLOCKCHAIN QR',
            title: 'Verified Electronic Scripts',
            art: IMAGES.ch4DigitalRfidScripts,
            soundEffect: 'QR CODE SCAN',
            narrativeCaption: 'Cloud-synced veterinary prescription databases link every ear-tag RFID directly to retail consumer pack QR codes.',
            speaker: 'vet',
            speakerRole: 'Traceability Officer',
            dialogue: 'Every veterinary prescription and withdrawal time is electronically logged. Consumers scan the pack and see verified stewardship history.',
            thoughtBubble: 'Radical transparency builds unshakeable consumer trust and commands premium shelf space.',
            insightCallout: 'Traceability Systems: Electronic logging cuts unapproved off-label medication by 94%.',
            cameraAngle: 'Close-Up Diagnostic',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch4-4',
            panelNumber: 4,
            badge: 'CONSUMER AISLE · THE CHOICE',
            title: 'Empowering the Shopper',
            art: IMAGES.comicSupermarket,
            soundEffect: 'SHELF RUSTLE',
            narrativeCaption: 'Certified "One Health Responsible" packaging hits retail shelves, accompanied by clear transparent origin badges.',
            speaker: 'a',
            speakerRole: 'Dr. Amira',
            dialogue: 'Consumer surveys show 76% of shoppers willingly pay a 5-8% premium when verified that animal welfare and human medicine are protected.',
            thoughtBubble: 'The consumer’s daily grocery basket becomes an engine of farm sustainability.',
            insightCallout: 'Consumer Premium: Eco-certified animal welfare labels unlock 6-12% higher retail margins.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch4-5',
            panelNumber: 5,
            badge: 'WHOLESALE AGREEMENT · 3-YEAR PACT',
            title: 'The Long-Term Purchase Accord',
            art: IMAGES.ch4ContractSigning,
            soundEffect: 'STAMP · RATIFIED',
            narrativeCaption: 'Processors sign 3-year guaranteed off-take contracts with Mohamed’s cooperative, securing a guaranteed 6% stewardship margin.',
            speaker: 's',
            speakerRole: 'Mohamed',
            dialogue: 'With guaranteed 3-year purchase pricing, we can confidently invest in renewable solar barn heating and automated water monitors.',
            thoughtBubble: 'Stable multi-year contracts turn farm stewardship into a durable business asset.',
            insightCallout: 'Contract Stability: Multi-year off-take agreements lower farm borrowing interest rates by 1.8%.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch4-6',
            panelNumber: 6,
            badge: 'WHOLE CHAIN · THE SHARED RESPONSIBILITY',
            title: 'The Unified Value Chain',
            art: IMAGES.ch4UnifiedChain,
            soundEffect: 'HARMONY',
            narrativeCaption: 'From grain supplier and livestock breeder to retailer and consumer, every link in the food chain shares the responsibility of clean food.',
            speaker: 'consensus',
            speakerRole: 'Supply Chain Covenant',
            dialogue: 'When farmers, processors, retailers, and consumers unite, safe medicine and secure food become self-sustaining.',
            thoughtBubble: 'A complete food ecosystem working in harmony.',
            insightCallout: 'Whole-Chain Architecture: Aligns market incentives with global public health goals.',
            cameraAngle: 'Dynamic Climax',
            panelLayoutType: 'wide-splash'
          }
        ];

      case 'chapter5':
      case 'ch5':
        return [
          {
            id: 'ch5-1',
            panelNumber: 1,
            badge: 'GLOBAL FORECAST · 2040 TRAJECTORY',
            title: 'The 143,481 Tonne Wave',
            art: IMAGES.ch5SurgeMap,
            soundEffect: 'ALARM · DATA SPIKE',
            narrativeCaption: 'Global epidemiological projections show business-as-usual livestock antimicrobial demand surging toward 143,481 tonnes annually by 2040.',
            speaker: 'a',
            speakerRole: 'Dr. Amira',
            dialogue: 'Nearly 65% of global usage growth will concentrate in low- and middle-income nations experiencing rapid livestock intensification.',
            thoughtBubble: 'We cannot simply copy European mandates into developing agrarian regions without local infrastructure investment.',
            insightCallout: 'Global Demand Driver: Middle-class protein consumption in developing markets drives 82% of net antimicrobial growth.',
            cameraAngle: 'Wide Cinematic Splash',
            panelLayoutType: 'wide-splash'
          },
          {
            id: 'ch5-2',
            panelNumber: 2,
            badge: 'LATIN AMERICA · EXPORT CORRIDOR',
            title: 'The Southern Hemisphere Engine',
            art: IMAGES.ch5SouthernRangelands,
            soundEffect: 'CARGO SHIP WHISTLE',
            narrativeCaption: 'South American pastoral and feedlot sectors represent 19% of global antimicrobial usage as beef and poultry exports scale up.',
            speaker: 's',
            speakerRole: 'Mohamed',
            dialogue: 'When you feed millions across continents, scale matters. But international buyers now demand verified antibiotic-prudent certifications.',
            thoughtBubble: 'Global trade agreements are enforcing biosecurity standards across borders.',
            insightCallout: 'Trade Standards: Exporting nations must meet stringent antimicrobial residue limits.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch5-3',
            panelNumber: 3,
            badge: 'EUROPEAN BENCHMARK · THE PROOF',
            title: 'Stabilization Without Output Loss',
            art: IMAGES.ch5EuropeanBenchmark,
            soundEffect: 'DATA DOWNTREND',
            narrativeCaption: 'Denmark and the Netherlands proved that eliminating routine growth promoters and preventative flock dosing did NOT reduce meat yield.',
            speaker: 'a',
            speakerRole: 'Dr. Amira',
            dialogue: 'European herds cut veterinary antimicrobial sales by 47% while meat production grew by 12%. Sound husbandry outperforms chemical crutches.',
            thoughtBubble: 'The empirical proof is undeniable: productivity thrives on hygiene and management.',
            insightCallout: 'European Data: Decoupled agricultural production from antibiotic consumption.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch5-4',
            panelNumber: 4,
            badge: 'MOBILE CLINICS · PASTORAL RANGELANDS',
            title: 'Bridging the Remote Divide',
            art: IMAGES.ch5MobileVetTruck,
            soundEffect: 'ENGINE HUM · DUST',
            narrativeCaption: 'Solar-powered mobile veterinary diagnostic vans reach remote pastoralist herders across drylands, providing point-of-care disease testing.',
            speaker: 'vet',
            speakerRole: 'Mobile Vet Team',
            dialogue: 'Pastoral herders don’t need bans; they need solar cold-chains for vaccines and rapid test kits to treat only sick camels and goats.',
            thoughtBubble: 'Inclusion is the only path to global biosecurity.',
            insightCallout: 'Last-Mile Delivery: Mobile vet clinics prevent 85% of empirical over-medicating in remote rangelands.',
            cameraAngle: 'Close-Up Diagnostic',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch5-5',
            panelNumber: 5,
            badge: 'GLOBAL SUMMIT · QUADRIPARTITE PACT',
            title: 'Tailored Regional Roadmaps',
            art: IMAGES.ch5QuadripartiteSummit,
            soundEffect: 'GAVEL STRIKE',
            narrativeCaption: 'FAO, UNEP, WHO, and WOAH convene ministerial delegations to ratify differentiated, equity-based national reduction pathways.',
            speaker: 'a',
            speakerRole: 'Dr. Amira',
            dialogue: 'One size does not fit all. High-income nations fund global transition endowments; emerging producers receive technology leapfrogging access.',
            thoughtBubble: 'Global solidarity makes disease surveillance universal and durable.',
            insightCallout: 'Quadripartite Framework: Joint action across animal, human, and environmental domains.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch5-6',
            panelNumber: 6,
            badge: 'GLOBAL HORIZON · 2030 VISION',
            title: 'The Sustainable Feeding Compact',
            art: IMAGES.ch5SustainableFeeding,
            soundEffect: 'WORLD ACCORD',
            narrativeCaption: 'A synchronized global agricultural horizon: feeding 9.7 billion people while preserving the antimicrobial efficacy of modern medicine.',
            speaker: 'consensus',
            speakerRole: 'Global One Health Accord',
            dialogue: 'From African drylands to European barns and Asian aquaculture, humanity shares one resilient biological future.',
            thoughtBubble: 'A planetary covenant honoring human health and animal husbandry.',
            insightCallout: '2030 Horizon: 30% global reduction in agricultural antimicrobial consumption achieved safely.',
            cameraAngle: 'Dynamic Climax',
            panelLayoutType: 'wide-splash'
          }
        ];

      case 'chapter6':
      case 'ch6':
        return [
          {
            id: 'ch6-1',
            panelNumber: 1,
            badge: 'MACRO SIMULATION · INACTION CRISIS',
            title: 'The $1.2 Trillion Compounding Loss',
            art: IMAGES.ch6MacroLoss,
            soundEffect: 'SIREN · ECONOMIC SHOCK',
            narrativeCaption: 'World Bank economic modeling reveals that unchecked antimicrobial resistance will cost the global economy over $1.2 trillion per year by 2050.',
            speaker: 'a',
            speakerRole: 'Dr. Amira',
            dialogue: 'Untreatable hospital infections, prolonged worker sickness, and livestock cullings will drag global GDP down by 3.8% annually.',
            thoughtBubble: 'Inaction is not free; it is the most expensive catastrophe humanity could choose.',
            insightCallout: 'Macroeconomic Impact: AMR unchecked triggers global losses exceeding the 2008 financial crisis.',
            cameraAngle: 'Wide Cinematic Splash',
            panelLayoutType: 'wide-splash'
          },
          {
            id: 'ch6-2',
            panelNumber: 2,
            badge: 'INVESTMENT PARITY · ACTION TIMELINE',
            title: 'The $28 Billion Solution',
            art: IMAGES.ch6GreenInvestRoi,
            soundEffect: 'CASH FLOW SURGE',
            narrativeCaption: 'Global investments of $28 billion annually in livestock biosecurity, farmer training, and rapid diagnostics completely avert the $1.2T catastrophe.',
            speaker: 's',
            speakerRole: 'Mohamed',
            dialogue: 'Investing $28 billion per year globally is peanuts compared to what agriculture loses in minor mortality every six months.',
            thoughtBubble: 'Prevention costs pennies; failure costs trillions.',
            insightCallout: 'Cost-Benefit Analysis: Every $1 invested in stewardship generates $18 in avoided economic destruction.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch6-3',
            panelNumber: 3,
            badge: 'FINANCIAL BUFFER · REVENUE BACKSTOP',
            title: 'State-Backed Transition Insurance',
            art: IMAGES.ch6TransitionInsurance,
            soundEffect: 'GREEN CHECK',
            narrativeCaption: 'State-backed biological transition insurance policies protect farmers against unexpected disease losses during the 2-year conversion window.',
            speaker: 'a',
            speakerRole: 'Dr. Amira',
            dialogue: 'We provide financial insurance guarantees so no producer is forced back to chemical dependencies out of fear of insolvency.',
            thoughtBubble: 'When public policy removes fear, farmers innovate fearlessly.',
            insightCallout: 'Transition Insurance: Removes the downside volatility of phasing out preventative antimicrobials.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch6-4',
            panelNumber: 4,
            badge: 'GENERATIONAL HERITAGE · THE PASTURE',
            title: 'Protecting the Next Generation',
            art: IMAGES.ch6SunsetPastureDaughter,
            soundEffect: 'BIRDSONG · SUNSET',
            narrativeCaption: 'Mohamed walks the pasture with his young daughter, teaching her the fundamentals of biosecure, healthy calf rearing.',
            speaker: 's',
            speakerRole: 'Mohamed',
            dialogue: 'I want my daughter to inherit fertile soil, healthy cattle, and working antibiotics that can save her life if she ever gets sick.',
            thoughtBubble: 'Our farming practices today determine the medicine cabinet of our grandchildren tomorrow.',
            insightCallout: 'Generational Stewardship: Preserving life-saving medical efficacy for the next century.',
            cameraAngle: 'Wide Cinematic Splash',
            panelLayoutType: 'wide-splash'
          },
          {
            id: 'ch6-5',
            panelNumber: 5,
            badge: 'THE MEDICAL MIRACLE · PRESERVATION',
            title: 'The Century-Old Covenant',
            art: IMAGES.ch6PenicillinMiracle,
            soundEffect: 'HEARTBEAT',
            narrativeCaption: 'Alexander Fleming’s discovery of penicillin revolutionized human surgery and child survival. Preserving that miracle is our collective duty.',
            speaker: 'a',
            speakerRole: 'Dr. Amira',
            dialogue: 'Antimicrobials were the greatest discovery of the 20th century. Responsible stewardship ensures they survive the 21st century.',
            thoughtBubble: 'We hold the lifeline of modern medicine in our hands.',
            insightCallout: 'Public Health Heritage: Preserving antibiotics enables modern oncology, surgery, and neonatology.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch6-6',
            panelNumber: 6,
            badge: 'DECISION HORIZON · THE PLEDGE',
            title: 'The Generational Covenant',
            art: IMAGES.ch6GenerationalCovenant,
            soundEffect: '✨ PLEDGE RATIFIED',
            narrativeCaption: 'Action is not a burden; it is the highest-return investment humanity can make in its food security and public health.',
            speaker: 'consensus',
            speakerRole: 'The Generational Accord',
            dialogue: 'Acting today preserves our farms, our children, and the sacred efficacy of life-saving medicine.',
            thoughtBubble: 'The choice is clear: proactive stewardship creates an enduring legacy.',
            insightCallout: 'The RENOFARM Promise: Zero unmanaged preventative use; 100% precision diagnostics.',
            cameraAngle: 'Dynamic Climax',
            panelLayoutType: 'standard'
          }
        ];

      case 'chapter7':
      case 'ch7':
      default:
        return [
          {
            id: 'ch7-1',
            panelNumber: 1,
            badge: 'SMART BIOSECURITY · 2030 FARMSTEAD',
            title: 'The Modern Resilient Farmstead',
            art: IMAGES.ch7SmartFarm,
            soundEffect: 'WHIRR · PURE AIR',
            narrativeCaption: 'Equipped with positive-pressure HEPA filtration, IoT biometric sensors, and automated moisture extractors, modern farms thrive without chemical crutches.',
            speaker: 's',
            speakerRole: 'Mohamed',
            dialogue: 'Our herd vitality is at an all-time peak, and our veterinary medicine bills fell by more than 85%.',
            thoughtBubble: 'Smart environmental engineering delivers the health and profit margins chemicals never could.',
            insightCallout: 'Smart Infrastructure: Continuous acoustic respiratory monitoring detects illness 48 hours before visible symptoms.',
            cameraAngle: 'Wide Cinematic Splash',
            panelLayoutType: 'wide-splash'
          },
          {
            id: 'ch7-2',
            panelNumber: 2,
            badge: 'PRECISION GENOMICS · PEN-SIDE DNA',
            title: 'Microfluidic Diagnostics at Barn Gate',
            art: IMAGES.ch7MicrofluidicDna,
            soundEffect: 'BEEP · 30 SEC READOUT',
            narrativeCaption: 'Handheld DNA sequencers identify bacterial species and antibiotic sensitivity profiles in 45 seconds at the chute, ending empirical guessing.',
            speaker: 'vet',
            speakerRole: 'Field Diagnostician',
            dialogue: 'No more blanket herd treatments. We administer targeted narrow-spectrum precision therapy only to the single calf that needs it.',
            thoughtBubble: 'Point-of-care precision diagnostics represent the future of veterinary clinical excellence.',
            insightCallout: 'Point-of-Care Efficacy: Rapid microfluidic testing reduces broad-spectrum drug usage by 88%.',
            cameraAngle: 'Close-Up Diagnostic',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch7-3',
            panelNumber: 3,
            badge: 'GLOBAL SUMMIT · FAO HEADQUARTERS',
            title: 'The Ten-Year Action Agenda',
            art: IMAGES.ch7FaoAccord,
            soundEffect: 'APPLAUSE · ACCORD',
            narrativeCaption: 'Representatives from 140 nations assemble in Rome under the RENOFARM banner to ratify binding commitments to agricultural stewardship.',
            speaker: 'a',
            speakerRole: 'Dr. Amira',
            dialogue: 'We manage the biological continuum as One Health. Soil, livestock, water, and human clinics are inextricably bound together.',
            thoughtBubble: 'Global multilateral solidarity turning scientific consensus into permanent international policy.',
            insightCallout: 'RENOFARM Global Initiative: Empowering 100 million producers with biosecurity technology.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch7-4',
            panelNumber: 4,
            badge: 'FARMER LEADERSHIP · PEER EDUCATION',
            title: 'Producers Leading Producers',
            art: IMAGES.ch7ProducersMasterclass,
            soundEffect: 'ENGAGED AUDIENCE',
            narrativeCaption: 'Mohamed conducts a national masterclass for 300 young livestock producers, sharing financial blueprints and biosecurity plans.',
            speaker: 's',
            speakerRole: 'Mohamed',
            dialogue: 'Don’t wait for disease to force your hand. Upgrading your barn and partnering with your vet is the smartest investment you will ever make.',
            thoughtBubble: 'Farmers listen to fellow farmers who have walked in their mud and proven the bottom line.',
            insightCallout: 'Peer Education: Producer-led extension networks achieve 89% voluntary conversion rates.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch7-5',
            panelNumber: 5,
            badge: 'PUBLIC ENGAGEMENT · OPEN FARM DAY',
            title: 'The Urban-Rural Bridge',
            art: IMAGES.ch7OpenFarmBridge,
            soundEffect: 'CHILDREN LAUGHTER',
            narrativeCaption: 'Urban families visit Al-Wadi Farm on National Agriculture Day, witnessing clean, antibiotic-prudent livestock production firsthand.',
            speaker: 'a',
            speakerRole: 'Dr. Amira',
            dialogue: 'When consumers meet the farmers who produce their food, mutual trust replaces cynicism, and fair stewardship pricing becomes second nature.',
            thoughtBubble: 'Connecting city tables directly with farm stewardship creates enduring social solidarity.',
            insightCallout: 'Consumer Trust: Transparent farm visits boost local branded meat sales by 35%.',
            cameraAngle: 'Character Dialogue',
            panelLayoutType: 'standard'
          },
          {
            id: 'ch7-6',
            panelNumber: 6,
            badge: 'EPILOGUE · THE LIVING COVENANT',
            title: 'The Ratified Handshake',
            art: IMAGES.ch7LivingHandshake,
            soundEffect: '✨ THE LIVING COVENANT',
            narrativeCaption: 'Science and farming standing united. Preserving life-saving medicine, empowering family producers, and feeding humanity safely.',
            speaker: 'consensus',
            speakerRole: 'The Final Handshake',
            dialogue: 'The handshake is made. The path forward is proven, profitable, and shared for all generations to come.',
            thoughtBubble: 'Science and farming standing together to protect our global future.',
            insightCallout: 'Permanent Accord: Healthy animals, resilient farmers, preserved human medicine.',
            cameraAngle: 'Dynamic Climax',
            panelLayoutType: 'wide-splash'
          }
        ];
    }
  };

  const panels = getChapterPanels();
  const currentSlide = panels[currentSlideIndex] || panels[0];

  const handlePrevSlide = () => {
    audioController.playPop();
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : panels.length - 1));
  };

  const handleNextSlide = () => {
    audioController.playPop();
    setCurrentSlideIndex((prev) => (prev < panels.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation for panel cycling in slides and lightbox
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (selectedPanel) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          audioController.playPop();
          const currentIdx = panels.findIndex((p) => p.id === selectedPanel.id);
          const nextIdx = currentIdx < panels.length - 1 ? currentIdx + 1 : 0;
          resetLightboxView();
          setSelectedPanel(panels[nextIdx]);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          audioController.playPop();
          const currentIdx = panels.findIndex((p) => p.id === selectedPanel.id);
          const prevIdx = currentIdx > 0 ? currentIdx - 1 : panels.length - 1;
          resetLightboxView();
          setSelectedPanel(panels[prevIdx]);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          audioController.playPop();
          resetLightboxView();
          setSelectedPanel(null);
        }
      } else if (viewMode === 'cinematic-reader') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextSlide();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevSlide();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPanel, viewMode, panels, currentSlideIndex]);

  return (
    <div className="my-8 max-w-5xl mx-auto px-2 sm:px-4">
      {/* Graphic Novel Top Navigation & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-white/95 dark:bg-[#16222c]/95 border-2 border-[#292019] dark:border-white/20 shadow-[5px_5px_0px_0px_rgba(41,32,25,0.8)] dark:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.8)] backdrop-blur-xl mb-6">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-2xl flex items-center justify-center text-white shadow-md border-2 border-[#292019]"
            style={{ backgroundColor: accentColor || '#a8734a' }}
          >
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-base sm:text-lg text-[#292019] dark:text-[#f0e6d6]">
                Graphic Novel Storybook
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#a8734a]/15 text-[#a8734a] dark:text-[#dda070] text-[10px] font-black uppercase border border-[#a8734a]/30">
                {panels.length} Story Panels
              </span>
            </div>
            <p className="text-xs text-[#8a7b6d] dark:text-[#8ea0b2] font-medium">
              {chapterNumber} · {chapterTitle}
            </p>
          </div>
        </div>

        {/* View Mode Switcher: Flowing Graphic Novel Page vs Cinematic Slide Reader */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#f4ead8] dark:bg-[#101720] border-2 border-[#292019]/20 dark:border-white/15">
          <button
            onClick={() => {
              audioController.playPop();
              setViewMode('flowing-page');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'flowing-page'
                ? 'bg-[#292019] text-[#dda070] shadow-xs'
                : 'text-[#6b5f52] dark:text-[#a8b2a9] hover:text-[#292019]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Flowing Story Page
          </button>
          <button
            onClick={() => {
              audioController.playPop();
              setViewMode('cinematic-reader');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'cinematic-reader'
                ? 'bg-[#292019] text-[#dda070] shadow-xs'
                : 'text-[#6b5f52] dark:text-[#a8b2a9] hover:text-[#292019]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Cinematic Slide Reader
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: FLOWING GRAPHIC NOVEL PAGE (Continuous organic story flow)        */}
      {/* ========================================================================= */}
      {viewMode === 'flowing-page' && (
        <motion.div
          className="flex flex-col gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.16,
                delayChildren: 0.05
              }
            }
          }}
        >
          {panels.map((panel, idx) => {
            const isWide = panel.panelLayoutType === 'wide-splash';
            const isAmira = panel.speaker === 'a';
            const isMohamed = panel.speaker === 's';
            const isConsensus = panel.speaker === 'consensus';
            const isVet = panel.speaker === 'vet';

            return (
              <motion.div
                key={panel.id}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 35,
                    scale: 0.98
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1]
                    }
                  }
                }}
                whileHover={{
                  y: -3,
                  transition: { duration: 0.2 }
                }}
                onClick={() => {
                  audioController.playPop();
                  setSelectedPanel(panel);
                }}
                className={`group relative rounded-3xl overflow-hidden border-3 border-[#292019] dark:border-white/20 bg-white dark:bg-[#15202b] shadow-[6px_6px_0px_0px_rgba(41,32,25,0.85)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.85)] hover:border-[#a8734a] dark:hover:border-[#dda070] transition-colors duration-300 cursor-pointer flex flex-col justify-between ${
                  isWide ? 'w-full' : ''
                }`}
              >
                {/* Comic Book Panel Top Header */}
                <div className="p-3.5 sm:p-4 bg-[#fbf7ee] dark:bg-[#192634] border-b-2 border-[#292019] dark:border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="h-7 w-7 rounded-xl bg-[#292019] text-[#dda070] dark:bg-[#dda070] dark:text-[#16222c] font-mono font-black text-xs flex items-center justify-center border border-[#292019] shadow-xs">
                      #{panel.panelNumber}
                    </span>
                    <span className="comic-sound-badge bg-[#dda070]/20 text-[#292019] dark:text-[#dda070] text-[10px] font-black uppercase px-2 py-0.5">
                      {panel.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#8a7b6d] dark:text-[#8ea0b2] hidden sm:inline">
                      {panel.cameraAngle}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (panel.dialogue) {
                          audioController.speakText(
                            panel.dialogue,
                            isAmira ? 'a' : isMohamed ? 's' : 'a'
                          );
                        }
                      }}
                      className="p-1.5 rounded-lg text-[#8a7b6d] hover:text-[#a8734a] hover:bg-[#a8734a]/10 transition-colors"
                      title="Play voice audio"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <div className="p-1.5 rounded-lg text-[#8a7b6d] group-hover:text-[#292019] dark:group-hover:text-white">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Artwork Container with Comic Shading & SFX */}
                <div
                  className={`relative overflow-hidden bg-black/5 dark:bg-black/40 ${
                    isWide ? 'aspect-[16/10] sm:aspect-[2.4/1]' : 'aspect-[16/10]'
                  }`}
                >
                  <img
                    src={panel.art}
                    alt={panel.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Comic Vignette Shading */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  {/* Dynamic Sound Effect Badge (Comic SFX) */}
                  {panel.soundEffect && (
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-[#f5e5a3] text-[#292019] font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-lg transform rotate-3 border sm:border-2 border-[#292019] group-hover:scale-110 group-hover:-rotate-3 transition-transform pointer-events-none">
                      💥 {panel.soundEffect}
                    </div>
                  )}

                  {/* Panel Title on Bottom Gradient */}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between text-white pointer-events-none">
                    <div className="min-w-0 pr-2">
                      <h4 className="font-serif font-black text-base sm:text-lg drop-shadow-md truncate">
                        {panel.title}
                      </h4>
                      {panel.speakerRole && (
                        <span className="text-[10px] sm:text-[11px] font-mono text-[#f5e5a3] opacity-90 block">
                          {panel.speakerRole}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-xs border border-white/20 hidden sm:inline flex-shrink-0">
                      Click to Inspect
                    </span>
                  </div>
                </div>

                {/* Comic Story, Speech Balloon & Thought Area (No Artwork Overlap) */}
                <div className="p-4 sm:p-5 bg-white dark:bg-[#16222c] space-y-3 sm:space-y-3.5 flex-1 flex flex-col justify-between border-t-2 border-[#292019]/15">
                  
                  {/* Classic Comic Strip Narrator Box (Yellow/Parchment style) */}
                  {panel.narrativeCaption && (
                    <div className="p-3 rounded-xl bg-[#fefce8] dark:bg-[#20271e] border-2 border-[#292019] dark:border-[#dda070]/30 text-xs font-serif text-[#292019] dark:text-[#fef08a] leading-relaxed shadow-xs">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#292019] text-[#dda070] dark:bg-[#dda070] dark:text-[#182430]">
                          Scene Narration
                        </span>
                      </div>
                      <p className="font-medium italic">
                        {panel.narrativeCaption}
                      </p>
                    </div>
                  )}

                  {panel.dialogue && (
                    <div
                      className={`relative p-3.5 sm:p-4 rounded-2xl border-2 border-[#292019] dark:border-white/20 text-xs sm:text-sm leading-relaxed font-serif ${
                        isAmira
                          ? 'bg-[#fdf9f5] dark:bg-[#1e2a36] text-[#292019] dark:text-[#f0e6d6]'
                          : isMohamed
                          ? 'bg-[#f8faf6] dark:bg-[#192723] text-[#292019] dark:text-[#f0e6d6]'
                          : isConsensus
                          ? 'bg-[#fdfbf7] dark:bg-[#1e2730] text-[#292019] dark:text-[#f0e6d6] font-bold'
                          : 'bg-[#f4f7fb] dark:bg-[#1c2633] text-[#292019] dark:text-[#f0e6d6]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#292019]/10">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isAmira
                              ? 'bg-[#a8734a] text-white'
                              : isMohamed
                              ? 'bg-[#7d8f6c] text-white'
                              : isConsensus
                              ? 'bg-[#292019] text-[#dda070]'
                              : 'bg-[#6d80c4] text-white'
                          }`}
                        >
                          💬 {panel.speakerRole || 'Speaker'}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (panel.dialogue) {
                              audioController.speakText(
                                panel.dialogue,
                                isAmira ? 'a' : isMohamed ? 's' : 'a'
                              );
                            }
                          }}
                          className="text-[11px] font-bold text-[#a8734a] dark:text-[#dda070] flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" /> Listen
                        </button>
                      </div>

                      <p className="font-serif italic text-sm sm:text-base">
                        “{panel.dialogue}”
                      </p>
                    </div>
                  )}

                  {/* Thought Bubble (Inner Reflection) */}
                  {panel.thoughtBubble && (
                    <div className="p-3 rounded-xl bg-[#292019]/5 dark:bg-white/5 border border-dashed border-[#292019]/30 dark:border-white/20 text-xs text-[#523722] dark:text-[#dda070] italic">
                      <span className="font-sans font-bold text-[10px] uppercase text-[#a8734a] dark:text-[#dda070] block not-italic mb-0.5">
                        💭 Inner Strategic Consideration:
                      </span>
                      "{panel.thoughtBubble}"
                    </div>
                  )}

                  {/* Panel Footer One Health Insight */}
                  {panel.insightCallout && (
                    <div className="pt-3 border-t border-[#292019]/10 dark:border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-[#8a7b6d] dark:text-[#8ea0b2]">
                        <Info className="w-3.5 h-3.5 text-[#a8734a] flex-shrink-0" />
                        <span className="font-medium text-[11px]">{panel.insightCallout}</span>
                      </div>

                      {onExploreTerm && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onExploreTerm('One Health');
                          }}
                          className="text-[10px] font-black uppercase text-[#a8734a] hover:underline"
                        >
                          Glossary
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: CINEMATIC SLIDE READER (Panel-by-Panel Presentation)             */}
      {/* ========================================================================= */}
      {viewMode === 'cinematic-reader' && currentSlide && (
        <div className="rounded-3xl border-3 border-[#292019] dark:border-white/20 bg-white dark:bg-[#15202b] shadow-[8px_8px_0px_0px_rgba(41,32,25,0.85)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col">
          {/* Reader Top Bar */}
          <div className="p-4 bg-[#fbf7ee] dark:bg-[#192634] border-b-2 border-[#292019] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-[#292019] text-[#dda070] font-mono font-black text-xs">
                PANEL {currentSlideIndex + 1} OF {panels.length}
              </span>
              <span className="comic-sound-badge bg-[#dda070]/20 text-[#292019] dark:text-[#dda070] text-xs font-black uppercase px-2 py-0.5">
                {currentSlide.badge}
              </span>
            </div>

            {/* Progress Dots */}
            <div className="flex items-center gap-1.5">
              {panels.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    audioController.playPop();
                    setCurrentSlideIndex(i);
                  }}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    i === currentSlideIndex
                      ? 'w-8 bg-[#a8734a] dark:bg-[#dda070]'
                      : 'w-2.5 bg-[#292019]/20 dark:bg-white/20 hover:bg-[#292019]/50'
                  }`}
                  title={`Go to panel ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Reader Artwork Screen */}
          <div className="relative aspect-[16/9] sm:aspect-[2/1] w-full bg-black overflow-hidden group">
            <img
              src={currentSlide.art}
              alt={currentSlide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

            {/* Sound Effect Callout */}
            {currentSlide.soundEffect && (
              <div className="absolute top-5 right-5 px-3 py-1.5 rounded-xl bg-[#f5e5a3] text-[#292019] font-black text-sm uppercase tracking-wider shadow-xl transform rotate-3 border-2 border-[#292019]">
                💥 {currentSlide.soundEffect}
              </div>
            )}

            {/* Slide Title */}
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white pointer-events-none">
              <div className="min-w-0 pr-3">
                <h3 className="font-serif font-black text-xl sm:text-3xl drop-shadow-md">
                  {currentSlide.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#f5e5a3] font-mono mt-1">
                  Camera: {currentSlide.cameraAngle} · Speaker: {currentSlide.speakerRole || 'Narration'}
                </p>
              </div>

              <button
                onClick={() => setSelectedPanel(currentSlide)}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold pointer-events-auto flex-shrink-0"
              >
                <Maximize2 className="w-4 h-4" /> Full View
              </button>
            </div>
          </div>

          {/* Reader Dialogue, Narrative & Thought Box (Clean Layout) */}
          <div className="p-5 sm:p-6 bg-white dark:bg-[#16222c] space-y-4">
            {/* Cinematic Narrator Caption Box */}
            {currentSlide.narrativeCaption && (
              <div className="p-4 rounded-2xl bg-[#fefce8] dark:bg-[#1e2820] border-2 border-[#292019] dark:border-[#dda070]/30 shadow-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#292019] text-[#dda070] dark:bg-[#dda070] dark:text-[#182430]">
                    Scene Narrative
                  </span>
                </div>
                <p className="font-serif text-sm sm:text-base text-[#292019] dark:text-[#fef08a] leading-relaxed italic">
                  {currentSlide.narrativeCaption}
                </p>
              </div>
            )}
            {currentSlide.dialogue && (
              <div className="p-5 rounded-2xl bg-[#fdfbf7] dark:bg-[#1a2530] border-2 border-[#292019] dark:border-white/20 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#292019] text-[#dda070]">
                    💬 Spoken Line: {currentSlide.speakerRole}
                  </span>

                  <button
                    onClick={() => {
                      if (currentSlide.dialogue) {
                        audioController.speakText(
                          currentSlide.dialogue,
                          currentSlide.speaker === 'a' ? 'a' : currentSlide.speaker === 's' ? 's' : 'a'
                        );
                      }
                    }}
                    className="px-3 py-1 rounded-lg bg-[#a8734a] text-white font-bold text-xs flex items-center gap-1.5 hover:bg-[#8f5e39] transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" /> Play Voice Line
                  </button>
                </div>
                <p className="font-serif italic text-base sm:text-lg text-[#292019] dark:text-[#f0e6d6]">
                  “{currentSlide.dialogue}”
                </p>
              </div>
            )}

            {currentSlide.thoughtBubble && (
              <div className="p-4 rounded-xl bg-[#a8734a]/10 border-2 border-dashed border-[#a8734a]/40 text-xs sm:text-sm text-[#523722] dark:text-[#dda070]">
                <span className="font-bold uppercase text-[10px] text-[#a8734a] block mb-1">
                  💭 Inner Strategic Calculation:
                </span>
                <p className="italic font-medium">"{currentSlide.thoughtBubble}"</p>
              </div>
            )}

            {/* Navigation Bottom Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t-2 border-[#292019]/10">
              <button
                onClick={handlePrevSlide}
                className="px-4 sm:px-5 py-2.5 rounded-2xl bg-[#f4ead8] dark:bg-[#1e2a36] text-[#292019] dark:text-[#f0e6d6] font-black text-xs border-2 border-[#292019] hover:bg-[#a8734a] hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(41,32,25,0.7)] active:translate-y-0.5"
                title="Previous Panel (← key)"
              >
                <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Previous</span> Panel
              </button>

              {/* Interactive Panel Dots */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4ead8]/80 dark:bg-[#101720]/80 border border-[#292019]/15">
                {panels.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      audioController.playPop();
                      setCurrentSlideIndex(idx);
                    }}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === currentSlideIndex
                        ? 'w-7 bg-[#a8734a] dark:bg-[#dda070]'
                        : 'w-2.5 bg-[#292019]/25 dark:bg-white/20 hover:bg-[#292019]/60'
                    }`}
                    title={`Go to Panel ${idx + 1}: ${p.title}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#8a7b6d] hidden md:inline">
                  (Use ← / → keys)
                </span>
                <button
                  onClick={handleNextSlide}
                  className="px-4 sm:px-5 py-2.5 rounded-2xl bg-[#292019] text-[#dda070] font-black text-xs border-2 border-[#292019] hover:bg-[#a8734a] hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(41,32,25,0.7)] active:translate-y-0.5"
                  title="Next Panel (→ key)"
                >
                  <span className="hidden sm:inline">Next</span> Panel <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HIGH RESOLUTION LIGHTBOX MODAL WITH MAGNIFYING LOUPE & GESTURE ZOOM       */}
      {/* ========================================================================= */}
      {selectedPanel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => {
            resetLightboxView();
            setSelectedPanel(null);
          }}
        >
          <div
            className="relative max-w-4xl w-full max-h-[94vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#15202b] border-3 border-[#292019] dark:border-white/20 shadow-2xl p-5 sm:p-7 space-y-4 text-[#292019] dark:text-[#f0e6d6]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => {
                audioController.playPop();
                resetLightboxView();
                setSelectedPanel(null);
              }}
              className="absolute top-5 right-5 p-2.5 rounded-full bg-[#292019] text-white hover:bg-[#a8734a] transition-all cursor-pointer z-20 shadow-md"
              title="Close Lightbox (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="comic-sound-badge bg-[#dda070] text-[#292019] text-xs font-black uppercase px-2 py-0.5">
                  PANEL #{selectedPanel.panelNumber} · {selectedPanel.badge}
                </span>
                <span className="text-xs text-[#8a7b6d] dark:text-[#8ea0b2] font-mono">
                  {selectedPanel.cameraAngle}
                </span>
              </div>
              <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#292019] dark:text-[#f0e6d6]">
                {selectedPanel.title}
              </h3>
            </div>

            {/* ZOOM & LOUPE TOOLBAR */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#f4ead8]/70 dark:bg-[#1b2632] border border-[#292019]/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                {/* Loupe Mode Toggle Button */}
                <button
                  onClick={() => {
                    audioController.playPop();
                    setIsLoupeActive(!isLoupeActive);
                    if (!isLoupeActive) {
                      setLightboxZoom(1.0);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isLoupeActive
                      ? 'bg-[#a8734a] text-white shadow-xs'
                      : 'bg-white dark:bg-[#15202b] text-[#292019] dark:text-[#f0e6d6] hover:bg-[#a8734a]/10 border border-[#292019]/10'
                  }`}
                  title="Toggle 2.5x Ink Magnifying Loupe"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isLoupeActive ? 'Loupe Active 🔍' : 'Magnifying Loupe'}</span>
                </button>

                {/* Reset View Button */}
                {(lightboxZoom > 1.0 || panOffset.x !== 0 || panOffset.y !== 0) && (
                  <button
                    onClick={() => {
                      audioController.playPop();
                      resetLightboxView();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#15202b] text-xs font-bold text-[#8a7b6d] hover:text-[#292019] dark:hover:text-white border border-[#292019]/10 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset 1.0x
                  </button>
                )}
              </div>

              {/* Zoom Slider Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    audioController.playPop();
                    setIsLoupeActive(false);
                    setLightboxZoom((prev) => Math.max(1.0, Number((prev - 0.25).toFixed(2))));
                  }}
                  disabled={lightboxZoom <= 1.0}
                  className="p-1.5 rounded-lg bg-white dark:bg-[#15202b] border border-[#292019]/10 text-xs font-bold disabled:opacity-40 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1.5">
                  <input
                    type="range"
                    min="1.0"
                    max="3.5"
                    step="0.1"
                    value={lightboxZoom}
                    onChange={(e) => {
                      setIsLoupeActive(false);
                      setLightboxZoom(Number(e.target.value));
                    }}
                    className="w-20 sm:w-28 accent-[#a8734a] cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold w-10 text-right">
                    {Math.round(lightboxZoom * 100)}%
                  </span>
                </div>

                <button
                  onClick={() => {
                    audioController.playPop();
                    setIsLoupeActive(false);
                    setLightboxZoom((prev) => Math.min(3.5, Number((prev + 0.25).toFixed(2))));
                  }}
                  disabled={lightboxZoom >= 3.5}
                  className="p-1.5 rounded-lg bg-white dark:bg-[#15202b] border border-[#292019]/10 text-xs font-bold disabled:opacity-40 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* HIGH-RES ARTWORK CANVAS WITH LOUPE & PAN GESTURE */}
            <div
              className={`relative rounded-2xl overflow-hidden border-2 border-[#292019] dark:border-white/20 aspect-[16/9] bg-black select-none ${
                lightboxZoom > 1.0 ? 'cursor-grab active:cursor-grabbing' : isLoupeActive ? 'cursor-crosshair' : 'cursor-default'
              }`}
              onWheel={(e) => {
                e.preventDefault();
                setIsLoupeActive(false);
                const delta = e.deltaY > 0 ? -0.15 : 0.15;
                setLightboxZoom((prev) => Math.min(3.5, Math.max(1.0, Number((prev + delta).toFixed(2)))));
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const pctX = Math.max(0, Math.min(100, (x / rect.width) * 100));
                const pctY = Math.max(0, Math.min(100, (y / rect.height) * 100));
                setLoupeCoords({ x, y, pctX, pctY, inside: true });

                if (isPanning && lightboxZoom > 1.0) {
                  setPanOffset({
                    x: panOffset.x + (e.clientX - panStart.x),
                    y: panOffset.y + (e.clientY - panStart.y)
                  });
                  setPanStart({ x: e.clientX, y: e.clientY });
                }
              }}
              onMouseEnter={() => setLoupeCoords((prev) => ({ ...prev, inside: true }))}
              onMouseLeave={() => {
                setLoupeCoords((prev) => ({ ...prev, inside: false }));
                setIsPanning(false);
              }}
              onMouseDown={(e) => {
                if (lightboxZoom > 1.0) {
                  setIsPanning(true);
                  setPanStart({ x: e.clientX, y: e.clientY });
                }
              }}
              onMouseUp={() => setIsPanning(false)}
            >
              {/* Main Image with Zoom Scale & Pan Transform */}
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-75"
                style={{
                  transform: `scale(${lightboxZoom}) translate(${panOffset.x / lightboxZoom}px, ${panOffset.y / lightboxZoom}px)`
                }}
              >
                <img
                  src={selectedPanel.art}
                  alt={selectedPanel.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>

              {/* Sound Effect Badge */}
              {selectedPanel.soundEffect && lightboxZoom === 1.0 && (
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-[#f5e5a3] text-[#292019] font-black text-sm uppercase tracking-wider border-2 border-[#292019] shadow-lg pointer-events-none">
                  💥 {selectedPanel.soundEffect}
                </div>
              )}

              {/* MAGNIFYING LOUPE LENS (2.5x Magnification Circle) */}
              {isLoupeActive && loupeCoords.inside && (
                <div
                  className="absolute pointer-events-none w-36 h-36 rounded-full border-3 border-white dark:border-[#dda070] shadow-[0_0_20px_rgba(0,0,0,0.8)] overflow-hidden"
                  style={{
                    left: `${loupeCoords.x}px`,
                    top: `${loupeCoords.y}px`,
                    transform: 'translate(-50%, -50%)',
                    backgroundImage: `url(${selectedPanel.art})`,
                    backgroundPosition: `${loupeCoords.pctX}% ${loupeCoords.pctY}%`,
                    backgroundSize: '320%'
                  }}
                >
                  {/* Crosshair indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-40">
                    <Crosshair className="w-8 h-8 text-white stroke-[1.5]" />
                  </div>
                  <div className="absolute bottom-1 right-2 text-[9px] font-black text-white/90 bg-black/60 px-1.5 py-0.5 rounded">
                    2.5×
                  </div>
                </div>
              )}

              {/* Gesture Instruction Overlay */}
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono pointer-events-none flex items-center gap-1.5">
                <Move className="w-3 h-3" />
                <span>Mouse Wheel: Zoom · Click & Drag: Pan</span>
              </div>
            </div>

            {/* Narrative & Dialogue Transcript */}
            <div className="space-y-3 pt-1">
              {selectedPanel.narrativeCaption && (
                <div className="p-3.5 rounded-xl bg-[#fbf7ee] dark:bg-[#1e2a36] border border-[#292019]/10 text-xs sm:text-sm text-[#292019] dark:text-[#f0e6d6]">
                  <strong>Scene Note:</strong> {selectedPanel.narrativeCaption}
                </div>
              )}

              {selectedPanel.dialogue && (
                <div className="p-4 rounded-2xl bg-[#fdfbf7] dark:bg-[#1a2530] border-2 border-[#292019] dark:border-white/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#a8734a] dark:text-[#dda070]">
                      💬 {selectedPanel.speakerRole || 'Speaker'}
                    </span>
                    <button
                      onClick={() => {
                        audioController.speakText(
                          selectedPanel.dialogue!,
                          selectedPanel.speaker === 'a' ? 'a' : 's'
                        );
                      }}
                      className="text-xs font-bold text-[#a8734a] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Play Voice
                    </button>
                  </div>
                  <p className="font-serif italic text-base sm:text-lg text-[#292019] dark:text-[#f0e6d6]">
                    “{selectedPanel.dialogue}”
                  </p>
                </div>
              )}

              {selectedPanel.insightCallout && (
                <div className="p-3 rounded-xl bg-[#7d8f6c]/10 border border-[#7d8f6c]/30 text-xs text-[#3c4a2c] dark:text-[#a9bd9e] flex items-center gap-2">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>{selectedPanel.insightCallout}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
