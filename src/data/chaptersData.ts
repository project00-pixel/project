import { SpeakerProfile, ChapterMeta, TermDefinition } from '../types';

// Stylized 2D Graphic Novel Editorial Art paths
export const IMAGES = {
  // Character portraits & expressions (One unified signature portrait each)
  amiraPortrait: '/src/assets/images/amira_portrait_1787785531763.jpg',
  amiraSpeaking: '/src/assets/images/amira_portrait_1787785531763.jpg',
  amiraField: '/src/assets/images/amira_portrait_1787785531763.jpg',
  amiraLab: '/src/assets/images/amira_portrait_1787785531763.jpg',
  amiraThinking: '/src/assets/images/amira_portrait_1787785531763.jpg',
  amira2dSpeaking: '/src/assets/images/amira_portrait_1787785531763.jpg',
  amira2dPortrait: '/src/assets/images/amira_portrait_1787785531763.jpg',
  amiraVector: '/src/assets/images/amira_portrait_1787785531763.jpg',
  amiraSpeakingAlt: '/src/assets/images/amira_portrait_1787785531763.jpg',
  amiraPortraitAlt: '/src/assets/images/amira_portrait_1787785531763.jpg',

  mohamedPortrait: '/src/assets/images/mohamed_portrait_1787785545624.jpg',
  mohamedSpeaking: '/src/assets/images/mohamed_portrait_1787785545624.jpg',
  mohamedPasture: '/src/assets/images/mohamed_portrait_1787785545624.jpg',
  mohamedFarm: '/src/assets/images/mohamed_portrait_1787785545624.jpg',
  mohamedLedger: '/src/assets/images/mohamed_portrait_1787785545624.jpg',
  mohamedThoughtful: '/src/assets/images/mohamed_portrait_1787785545624.jpg',
  mohamed2dSpeaking: '/src/assets/images/mohamed_portrait_1787785545624.jpg',
  mohamed2dPortrait: '/src/assets/images/mohamed_portrait_1787785545624.jpg',
  mohamedVector: '/src/assets/images/mohamed_portrait_1787785545624.jpg',
  mohamedSpeakingAlt: '/src/assets/images/mohamed_portrait_1787785545624.jpg',
  mohamedPortraitAlt: '/src/assets/images/mohamed_portrait_1787785545624.jpg',
  mohamedPastureHerd: '/src/assets/images/mohamed_portrait_1787785545624.jpg',

  // Dedicated scene artwork assets for panels
  ch1AmrCultureLab: '/src/assets/images/lab_amr_culture_1787777984944.jpg',
  ch3WalkingCleanPens: '/src/assets/images/ch3_walking_clean_pens_1787778829248.jpg',
  ch6AmiraBlueprints: '/src/assets/images/amira_blueprints_barn_1787778658595.jpg',
  ch7FarmerSummitStudy: '/src/assets/images/ch7_producers_masterclass_1787786378250.jpg',
  ch7SunsetDaughterAccord: '/src/assets/images/ch7_open_farm_bridge_1787786391077.jpg',

  // Accord & Story Assets
  jointDialogue: '/src/assets/images/fence_tension_prologue_1787778641492.jpg',
  handshakeMacro: '/src/assets/images/handshake_accord_comic_1787786943036.jpg',
  handshake2d: '/src/assets/images/handshake_accord_comic_1787786943036.jpg',
  handshakeVector: '/src/assets/images/handshake_accord_comic_1787786943036.jpg',
  handshakeMacroAlt: '/src/assets/images/handshake_accord_comic_1787786943036.jpg',
  comicHeroSplash: '/src/assets/images/hero_cover_splash_comic_1787787462043.jpg',
  comicAmrTransfer: '/src/assets/images/ch1_gut_microbiome_shield_1787778707829.jpg',
  comicFarmBiosecurity: '/src/assets/images/ch1_barn_ventilation_retrofit_1787778723350.jpg',
  comicSupermarket: '/src/assets/images/ch4_supermarket_choice_1787786141170.jpg',
  comicHospitalAlert: '/src/assets/images/hospital_one_health_1787778069859.jpg',
  comicVetRapidTest: '/src/assets/images/vet_rapid_test_1787777999154.jpg',
  comicGlobalSummit: '/src/assets/images/global_summit_accord_1787785589245.jpg',
  comicMohamedPens: '/src/assets/images/prologue_panel_1_dawn_comic_1787787446279.jpg',
  comicMohamedLedger: '/src/assets/images/ch3_mohamed_late_ledger_1787778811890.jpg',
  
  // Bespoke prologue panels (100% unique)
  prologueDawnFeedlot: '/src/assets/images/prologue_panel_1_dawn_comic_1787787446279.jpg',
  prologueGenevaForum: '/src/assets/images/global_summit_accord_1787785589245.jpg',
  prologueFenceTension: '/src/assets/images/fence_tension_prologue_1787778641492.jpg',
  prologueAmiraBlueprint: '/src/assets/images/amira_blueprints_barn_1787778658595.jpg',

  // Bespoke chapter 1 panels (100% unique)
  ch1Art: '/src/assets/images/ch1_antibiotic_molecules_1787778672882.jpg',
  ch1CrowdedDensity: '/src/assets/images/ch1_crowded_storm_pens_1787778690281.jpg',
  ch1ClinicalProtocol: '/src/assets/images/ch1_clinical_dosing_tablet_1787778737778.jpg',

  // Bespoke chapter 2 panels (100% unique)
  ch2Art: '/src/assets/images/ch2_bacterial_evolution_petri_1787778752781.jpg',
  ch2SlurryRunoff: '/src/assets/images/ch2_storm_runoff_creek_1787778767520.jpg',
  ch2DnaMatchTest: '/src/assets/images/ch2_dna_gel_match_evidence_1787778782841.jpg',
  ch2BiogasDigester: '/src/assets/images/biogas_green_farm_1787778012245.jpg',
  ch2OneHealthShield: '/src/assets/images/ch2_one_health_infographic_cycle_1787778797516.jpg',

  // Bespoke chapter 3 panels (100% unique)
  ch3Art: '/src/assets/images/ch3_mohamed_late_ledger_1787778811890.jpg',
  ch3BiosecurityChalkboard: '/src/assets/images/ch3_biosecurity_chalkboard_1787778844405.jpg',
  ch3GrantApproval: '/src/assets/images/ch3_grant_approval_check_1787778858935.jpg',
  ch3HarvestProfit: '/src/assets/images/ch3_harvest_profit_1787786111796.jpg',
  ch3FarmerStudyTour: '/src/assets/images/ch3_farmer_study_tour_1787778872025.jpg',

  // Bespoke chapter 4 panels (100% unique)
  ch4Art: '/src/assets/images/ch4_buyer_dilemma_office_1787778886460.jpg',
  ch4DockNegotiation: '/src/assets/images/dock_export_rfid_1787778026568.jpg',
  ch4DigitalRfidScripts: '/src/assets/images/ch4_digital_scripts_1787786128402.jpg',
  ch4ContractSigning: '/src/assets/images/ch4_contract_signing_1787786157329.jpg',
  ch4UnifiedChain: '/src/assets/images/ch4_unified_chain_1787786172446.jpg',

  // Bespoke chapter 5 panels (100% unique comic style)
  ch5Art: '/src/assets/images/ch5_surge_map_1787786187909.jpg',
  ch5SurgeMap: '/src/assets/images/ch5_surge_map_1787786187909.jpg',
  ch5SouthernRangelands: '/src/assets/images/ch5_southern_rangelands_1787786201591.jpg',
  ch5EuropeanBenchmark: '/src/assets/images/ch5_european_benchmark_1787786214710.jpg',
  ch5MobileVetTruck: '/src/assets/images/rangeland_vet_truck_1787778040994.jpg',
  ch5QuadripartiteSummit: '/src/assets/images/ch5_quadripartite_summit_1787786228889.jpg',
  ch5SustainableFeeding: '/src/assets/images/ch5_sustainable_feeding_1787786243574.jpg',

  // Bespoke chapter 6 panels (100% unique comic style)
  ch6Art: '/src/assets/images/ch6_macro_loss_1787786257668.jpg',
  ch6MacroLoss: '/src/assets/images/ch6_macro_loss_1787786257668.jpg',
  ch6GreenInvestRoi: '/src/assets/images/ch6_green_invest_roi_1787786271642.jpg',
  ch6TransitionInsurance: '/src/assets/images/ch6_transition_insurance_1787786285642.jpg',
  ch6SunsetPastureDaughter: '/src/assets/images/sunset_farm_daughter_1787778056032.jpg',
  ch6PenicillinMiracle: '/src/assets/images/ch6_fleming_miracle_1787786298767.jpg',
  ch6GenerationalCovenant: '/src/assets/images/ch6_generational_covenant_1787786314781.jpg',

  // Bespoke chapter 7 & Epilogue panels (100% unique comic style)
  ch7Art: '/src/assets/images/ch7_smart_farmstead_1787786328474.jpg',
  ch7SmartFarm: '/src/assets/images/ch7_smart_farmstead_1787786328474.jpg',
  ch7MicrofluidicDna: '/src/assets/images/ch7_microfluidic_dna_1787786344326.jpg',
  ch7FaoAccord: '/src/assets/images/ch7_fao_rome_accord_1787786361930.jpg',
  ch7ProducersMasterclass: '/src/assets/images/ch7_producers_masterclass_1787786378250.jpg',
  ch7OpenFarmBridge: '/src/assets/images/ch7_open_farm_bridge_1787786391077.jpg',
  ch7LivingHandshake: '/src/assets/images/ch7_living_handshake_1787786405227.jpg',
  epilogueArt: '/src/assets/images/ch7_living_handshake_1787786405227.jpg',
  vetDiagnostic: '/src/assets/images/vet_rapid_test_1787777999154.jpg',
  faoSummit: '/src/assets/images/global_summit_accord_1787785589245.jpg',
};

export const SPEAKERS: Record<string, SpeakerProfile> = {
  a: {
    id: 'a',
    name: 'Dr. Amira',
    role: 'One Health Economist',
    affiliation: 'Global Agricultural & Health Systems Policy',
    avatarLetter: 'A',
    accentColor: '#a8734a',
    accentBg: 'rgba(168, 115, 74, 0.15)',
    portraitImg: IMAGES.amiraPortrait,
    speakingImg: IMAGES.amiraSpeaking,
    description: 'Specializes in the macroeconomic and cross-border spillovers of agricultural antimicrobial usage.'
  },
  s: {
    id: 's',
    name: 'Mohamed',
    role: 'Innovative Livestock Producer',
    affiliation: 'Pasture & Modern Herd Operations',
    avatarLetter: 'M',
    accentColor: '#7d8f6c',
    accentBg: 'rgba(125, 143, 108, 0.15)',
    portraitImg: IMAGES.mohamedPortrait,
    speakingImg: IMAGES.mohamedSpeaking,
    description: 'A young forward-thinking commercial producer balancing herd health, livestock tech, and day-to-day farm-gate margins.'
  },
  n: {
    id: 'n',
    name: 'The Handshake',
    role: 'A Dialogue on Action vs. Inaction',
    affiliation: 'FAO Comprehensive Assessment Report',
    avatarLetter: '🤝',
    accentColor: '#2c3745',
    accentBg: 'rgba(44, 55, 69, 0.15)',
    portraitImg: IMAGES.handshakeMacro,
    speakingImg: IMAGES.handshakeMacro,
    description: 'Synthesizing global perspectives across science, farming, and policy.'
  }
};

export const GLOSSARY: Record<string, TermDefinition> = {
  AMU: {
    term: 'AMU',
    fullTitle: 'Antimicrobial Use (AMU)',
    description: 'The overall volume of antimicrobial drugs administered to livestock for therapeutic disease treatment, preventive prophylaxis, and historical growth promotion.'
  },
  AMR: {
    term: 'AMR',
    fullTitle: 'Antimicrobial Resistance (AMR)',
    description: 'The evolutionary mechanism where bacteria, viruses, and fungi mutate to survive standard antibiotic treatments, rendering critical medicines ineffective.'
  },
  AGP: {
    term: 'AGP',
    fullTitle: 'Antimicrobial Growth Promoters',
    description: 'Sub-therapeutic antibiotic dosages historically mixed into animal feed to artificially accelerate weight gain, now being globally phased out due to resistance risks.'
  },
  ONEHEALTH: {
    term: 'One Health',
    fullTitle: 'One Health Integrated Framework',
    description: 'The unified approach recognizing that human health, domestic animal welfare, plant ecosystems, and global environmental sustainability are inextricably linked.'
  },
  RENOFARM: {
    term: 'RENOFARM',
    fullTitle: 'FAO RENOFARM Initiative',
    description: 'A 10-year global flagship program initiated by the FAO to systematically reduce the need for antimicrobials on livestock farms through improved biosecurity and husbandry.'
  }
};

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 'prologue',
    number: '00',
    title: 'The Handshake',
    kicker: 'Prologue',
    theme: 'What are we actually talking about?',
    blurb: 'Two distinct perspectives meet at the intersection of veterinary science and agricultural livelihood.',
    accentColor: '#a8734a',
    gradient: 'from-[#a8734a]/20 via-[#c8875a]/10 to-transparent',
    artPanelImg: IMAGES.handshakeMacro,
    artCaption: 'The Handshake: Dr. Amira and Mohamed forging common ground between macroeconomic science and farm reality.',
    dialogues: [
      {
        speaker: 'n',
        text: 'A farm gate. A laboratory. A boardroom. The future of antibiotics runs through all three — and it rarely stops in any of them.'
      },
      {
        speaker: 'a',
        text: 'Antimicrobial use in livestock is set to rise roughly 30 percent by 2040. That volume would reshape food security, human health, and trade — and barely anyone has heard it. It is a fundamental [[AMU]] challenge.'
      },
      {
        speaker: 's',
        text: 'My herd is my savings. When an animal shows signs of respiratory disease, a course of antibiotics is often the cheapest, fastest safeguard I have.'
      },
      {
        speaker: 'a',
        text: 'And that is the whole puzzle, Mohamed. On the farm, that decision makes rational economic sense. The long-term costs, however, are paid elsewhere — and much later.'
      },
      {
        speaker: 's',
        text: 'So... what happens when those compounds stop working?'
      },
      {
        speaker: 'n',
        text: 'That is the question this journey walks through — eight chapters, two realistic voices, one shared handshake.'
      }
    ]
  },
  {
    id: 'ch1',
    number: '01',
    title: 'The Molecules That Feed the World',
    kicker: 'Chapter One',
    theme: 'A small molecule, a big job',
    blurb: 'Antimicrobials are compounds with enormous reach, quietly substituting for missing infrastructure.',
    accentColor: '#a8734a',
    gradient: 'from-[#a8734a]/25 to-transparent',
    artPanelImg: IMAGES.ch1Art,
    artCaption: 'Chapter 1 Visual Panel: Molecular compounds acting as economic shock absorbers across modern livestock systems.',
    dialogues: [
      {
        speaker: 's',
        text: 'It is not a choice about drugs, really. It is a choice about managing risk. If one calf gets pneumonia and I wait too long, it sweeps through the entire pen.'
      },
      {
        speaker: 'a',
        text: 'Antimicrobials step in where other assets are scarce — capital, skilled farm hands, climate-controlled housing, or a specialized veterinarian who can visit today.'
      },
      {
        speaker: 's',
        text: 'When my family\'s equity is on four legs, I will take the tool I can access today every single time.'
      },
      {
        speaker: 'a',
        text: 'And that is why policy cannot simply ban tools without building the bridges that replace their economic function.'
      }
    ]
  },
  {
    id: 'ch2',
    number: '02',
    title: 'The Silent Shock',
    kicker: 'Chapter Two',
    theme: 'Resistance that never announces itself',
    blurb: 'Every sub-optimal or routine dose quietly selects for bacterial survival, creating global resistance.',
    accentColor: '#a23b34',
    gradient: 'from-[#a23b34]/25 to-transparent',
    artPanelImg: IMAGES.ch2Art,
    artCaption: 'Chapter 2 Visual Panel: The microscopic accumulation of resistant pathogens quietly outracing therapeutic drug efficacy.',
    dialogues: [
      {
        speaker: 's',
        text: 'The medicine works on my herd today. Where is the "silent shock" you keep warning about?'
      },
      {
        speaker: 'a',
        text: 'Every time a dose is overused or applied routinely, it creates selective pressure for resistant pathogens. That is [[AMR]] — and bacteria do not respect farm borders.'
      },
      {
        speaker: 's',
        text: 'But that timeline takes years. An individual producer cannot feel that gradual shift day-to-day.'
      },
      {
        speaker: 'a',
        text: 'Exactly. It accumulates invisibly across millions of farms at once. When standard first-line therapies fail, the shock hits livestock mortality and human hospitals simultaneously.'
      }
    ]
  },
  {
    id: 'ch3',
    number: '03',
    title: "A Farmer's Dilemma",
    kicker: 'Chapter Three',
    theme: 'The economics of the farm gate',
    blurb: 'Balancing thin operating margins against long-term biosecurity investments.',
    accentColor: '#7d8f6c',
    gradient: 'from-[#7d8f6c]/25 to-transparent',
    artPanelImg: IMAGES.ch3Art,
    artCaption: 'Chapter 3 Visual Panel: Mohamed reviewing farm-gate balance sheets and biosecurity upgrades in the herd barn.',
    dialogues: [
      {
        speaker: 'a',
        text: 'Producers are not carelessly dosing animals; they are choosing the least-risky financial path they can realistically afford.'
      },
      {
        speaker: 's',
        text: 'I would love modernized ventilation, automated bio-filters, and tailored vaccines. But those require upfront capital that operating bank loans rarely cover.'
      },
      {
        speaker: 'a',
        text: 'So the chemical bottle acts as a surrogate for capital investment, biosecurity protocols, and space.'
      },
      {
        speaker: 'choices',
        options: [
          {
            label: 'What would make prevention viable on the ground?',
            branchLines: [
              {
                speaker: 'a',
                text: 'Accessible micro-financing, local diagnostic testing, and technical extension services that make prevention cheaper than routine medication.'
              },
              {
                speaker: 's',
                text: 'Give us practical alternatives that do not destroy operating margins, and we will adopt them tomorrow.'
              }
            ]
          },
          {
            label: 'Who bears the cost if market regulations tighten?',
            branchLines: [
              {
                speaker: 's',
                text: 'If buyers demand zero-antibiotic supply without paying a price premium, small family farms are the first to get squeezed out.'
              },
              {
                speaker: 'a',
                text: 'Which is why transition policies must provide technical and financial buffers during the initial conversion years.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ch4',
    number: '04',
    title: 'The Chain of Decisions',
    kicker: 'Chapter Four',
    theme: 'Who decides, and what nudges them',
    blurb: 'Supply chain contracts, retail certifications, and consumer expectations drive farm practices.',
    accentColor: '#6d80c4',
    gradient: 'from-[#6d80c4]/25 to-transparent',
    artPanelImg: IMAGES.ch4Art,
    artCaption: 'Chapter 4 Visual Panel: The multi-tiered value chain linking pasture protocols, cold-chain transport, and retail consumer choices.',
    dialogues: [
      {
        speaker: 's',
        text: 'If my regional meat processor offers a guaranteed contract premium for certified prudent-use livestock, that directly shifts how I manage herd protocols.'
      },
      {
        speaker: 'a',
        text: 'Market incentives further up the value chain — from wholesale processors to retail supermarkets — have immense leverage in shaping farm practices.'
      },
      {
        speaker: 's',
        text: 'And when standards are clear and verified, consumers can reward farms that invest in genuine animal welfare and biosecurity.'
      },
      {
        speaker: 'a',
        text: 'That alignment transforms responsible stewardship from a private regulatory burden into a competitive market asset.'
      }
    ]
  },
  {
    id: 'ch5',
    number: '05',
    title: 'The Numbers',
    kicker: 'Chapter Five',
    theme: 'The trajectory we are on',
    blurb: 'Projecting 143,481 tonnes of global livestock antimicrobial consumption by 2040.',
    accentColor: '#dd9f66',
    gradient: 'from-[#dd9f66]/25 to-transparent',
    artPanelImg: IMAGES.ch5Art,
    artCaption: 'Chapter 5 Visual Panel: Dr. Amira analyzing econometric projections and geospatial heatmaps of global AMU growth.',
    dialogues: [
      {
        speaker: 'a',
        text: 'The projected growth to 143,481 tonnes by 2040 is not geographically uniform. Nearly 65% of global volume will concentrate in Asia and the Pacific, with South America contributing roughly 19%.'
      },
      {
        speaker: 's',
        text: 'Because that is where consumer protein demand is expanding fastest and production is intensifying.'
      },
      {
        speaker: 'a',
        text: 'Precisely. Africa is growing rapidly from a lower baseline, while North America is declining and Europe is stabilizing thanks to targeted regulatory oversight.'
      },
      {
        speaker: 's',
        text: 'So the solution cannot be one-size-fits-all. Every region starts from a different operational baseline.'
      }
    ]
  },
  {
    id: 'ch6',
    number: '06',
    title: 'The Cost of Action or Inaction',
    kicker: 'Chapter Six',
    theme: 'A dilemma in two timelines',
    blurb: 'Comparing the immediate local transition costs against compounding multi-decade systemic losses.',
    accentColor: '#a23b34',
    gradient: 'from-[#a23b34]/25 to-transparent',
    artPanelImg: IMAGES.ch6Art,
    artCaption: 'Chapter 6 Visual Panel: The divergence between investing in early biosecurity vs facing compounded macroeconomic losses.',
    dialogues: [
      {
        speaker: 's',
        text: 'The math seems clear on paper — acting is cheaper than systemic collapse. Why is it still so politically difficult to implement?'
      },
      {
        speaker: 'a',
        text: 'Because the $28 billion transition investment is paid upfront in specific communities, while the trillions in preserved drug efficacy accrue globally across generations.'
      },
      {
        speaker: 's',
        text: 'No individual farmer can afford to finance a global public good alone out of their seasonal crop check.'
      },
      {
        speaker: 'a',
        text: 'Which is why national budgets and multilateral climate-health funds must co-invest in agricultural biosecurity as core infrastructure.'
      }
    ]
  },
  {
    id: 'ch7',
    number: '07',
    title: 'The Path Forward',
    kicker: 'Chapter Seven',
    theme: 'Treating it as a shared good',
    blurb: 'Integrating the One Health framework, RENOFARM initiatives, and smart technological monitoring.',
    accentColor: '#67795a',
    gradient: 'from-[#67795a]/25 to-transparent',
    artPanelImg: IMAGES.ch7Art,
    artCaption: 'Chapter 7 Visual Panel: Dr. Amira and Mohamed touring an innovative FAO RENOFARM biosecure facility.',
    dialogues: [
      {
        speaker: 's',
        text: 'If we commit to reducing use intensity by 30% or even 50%, what does that look like on an actual operating farm?'
      },
      {
        speaker: 'a',
        text: 'It means adopting the FAO [[RENOFARM]] model: optimized natural immunity, clean water filtration, precision vaccinations, and rapid on-farm diagnostic test kits.'
      },
      {
        speaker: 's',
        text: 'So healthy animals need fewer treatments, maintaining yield while slashing antibiotic dependence.'
      },
      {
        speaker: 'a',
        text: 'That is the [[ONEHEALTH]] promise — safeguarding the livestock economy without sacrificing human medicine.'
      }
    ]
  },
  {
    id: 'epilogue',
    number: '08',
    title: 'Act Early',
    kicker: 'Epilogue',
    theme: 'The point of the handshake',
    blurb: 'Closing the loop between agricultural reality and scientific stewardship.',
    accentColor: '#2c3745',
    gradient: 'from-[#2c3745]/30 to-transparent',
    artPanelImg: IMAGES.epilogueArt,
    artCaption: 'Epilogue Visual Panel: A collaborative horizon where science, policy, and farmers act together before crisis sets in.',
    dialogues: [
      {
        speaker: 's',
        text: 'So the goal is not to pit farmers against doctors or urban consumers against rural producers.'
      },
      {
        speaker: 'a',
        text: 'Never. The goal is to act early, together — before resistance turns from a manageable operational transition into a catastrophic economic crisis.'
      },
      {
        speaker: 's',
        text: 'I will do my part at the barn gate, provided science and policy meet us with real support.'
      },
      {
        speaker: 'a',
        text: 'And that mutual commitment is the essence of the handshake.'
      },
      {
        speaker: 'n',
        text: 'A handshake is an agreement to build a sustainable future — protecting human health, animal welfare, and global food security in one shared stroke.'
      }
    ]
  }
];
