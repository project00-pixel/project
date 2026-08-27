import { ChapterDecision } from '../types';

export const CHAPTER_DECISIONS: Record<string, ChapterDecision> = {
  prologue: {
    chapterId: 'prologue',
    chapterNumber: '00',
    chapterTitle: 'The Feedlot Baseline',
    dilemmaQuestion: 'How should Al-Wadi Farm manage sudden autumn respiratory risk across 800 feedlot cattle?',
    contextSummary: '05:45 AM. 800 steers arrive during seasonal chill. Margins are razor-thin, and sudden drafts risk shipping fever.',
    optionA: {
      id: 'A',
      label: 'Status Quo Preventative Medication',
      shortTitle: 'Blanket Low-Dose Water Prophylaxis',
      description: 'Continue standard practice of adding preventative low-dose tetracyclines to collective water troughs during temperature swings.',
      tags: ['Status Quo', 'Chemical Buffer', 'High AMR Risk'],
      impact: {
        amuReduction: 0,
        farmSolvency: 2,
        publicHealthSavingsBillion: 0,
        consumerPriceShiftPct: 0
      },
      characterReactions: {
        amira: {
          mood: 'alarmed',
          reaction: 'Sub-therapeutic exposure in 800 healthy animals creates the exact evolutionary pressure that selects for multi-drug resistant superbugs.'
        },
        mohamed: {
          mood: 'skeptical',
          reaction: 'It buys me short-term sleep tonight, but deep down I know if these drugs stop working, my entire feedlot has zero defense.'
        }
      }
    },
    optionB: {
      id: 'B',
      label: 'RENOFARM Transition Pilot',
      shortTitle: 'Co-Financed Ventilation & Pen-Side Rapid Tests',
      description: 'Adopt Dr. Amira’s 10-year RENOFARM pilot: install positive pressure barn ventilation and chute-side 30-second diagnostic cartridges.',
      tags: ['RENOFARM Pilot', 'Biosecurity First', 'Precision Health'],
      impact: {
        amuReduction: 32,
        farmSolvency: 6,
        publicHealthSavingsBillion: 340,
        consumerPriceShiftPct: 1.2
      },
      characterReactions: {
        amira: {
          mood: 'optimistic',
          reaction: 'This is the One Health foundation: replacing blind chemical prophylaxis with environmental biosecurity and rapid precision diagnostics.'
        },
        mohamed: {
          mood: 'determined',
          reaction: 'If the co-financed grant buffers the ventilation installation, my herd stays protected without relying on daily antibiotics.'
        }
      }
    }
  },

  ch1: {
    chapterId: 'ch1',
    chapterNumber: '01',
    chapterTitle: 'The Medical Foundation',
    dilemmaQuestion: 'When 4 steers in Pen 6 show early respiratory distress, which treatment protocol should be triggered?',
    contextSummary: 'A cold front causes initial coughing in pen 6. Feed intake drops 4%. Mohamed must decide how to medicate.',
    optionA: {
      id: 'A',
      label: 'Routine Mass Metaphylaxis',
      shortTitle: 'Mass Injectable Dosing for All 800 Cattle',
      description: 'Dose the entire herd with long-acting broad-spectrum macrolides to guarantee no secondary bacterial spread.',
      tags: ['Mass Metaphylaxis', 'High Drug Cost', 'Resistance Corridors'],
      impact: {
        amuReduction: 4,
        farmSolvency: -3,
        publicHealthSavingsBillion: -80,
        consumerPriceShiftPct: 0.2
      },
      characterReactions: {
        amira: {
          mood: 'alarmed',
          reaction: 'Mass metaphylaxis blankets healthy gut microbiomes with highest-priority critically important antimicrobials (HPCIAs).'
        },
        mohamed: {
          mood: 'concerned',
          reaction: 'It is the easiest fallback when staff is stretched, but veterinary pharmacy bills are eating 22% of my livestock margin.'
        }
      }
    },
    optionB: {
      id: 'B',
      label: 'Precision Thermal Scan & Individual Therapy',
      shortTitle: 'Thermal Camera Triage & Targeted Treatment',
      description: 'Use infrared thermal imaging at the chute to isolate only febrile cattle, dosing only confirmed bacterial cases under veterinary prescription.',
      tags: ['Precision Triage', 'Prescription Mandate', 'Microbiome Defense'],
      impact: {
        amuReduction: 44,
        farmSolvency: 9,
        publicHealthSavingsBillion: 420,
        consumerPriceShiftPct: 0.8
      },
      characterReactions: {
        amira: {
          mood: 'consensus',
          reaction: 'Clinical prudence in action! You treat the sick animal effectively while preserving the drug’s curative potency for human surgery.'
        },
        mohamed: {
          mood: 'determined',
          reaction: 'We only injected 6 animals instead of 800. The rest recovered naturally in clean, dry pens with zero mortality.'
        }
      }
    }
  },

  ch2: {
    chapterId: 'ch2',
    chapterNumber: '02',
    chapterTitle: 'The Environmental Vector',
    dilemmaQuestion: 'How should Al-Wadi Farm process 12 tons of daily agricultural slurry and runoff?',
    contextSummary: 'Spring storms threaten to flood raw manure lagoons into regional groundwater tables and nearby municipal reservoirs.',
    optionA: {
      id: 'A',
      label: 'Traditional Open Earthen Lagoon',
      shortTitle: 'Unlined Slurry Basin & Direct Pasture Spreading',
      description: 'Hold slurry in standard outdoor open basins and spray untreated manure across pasture lands as standard fertilizer.',
      tags: ['Unlined Lagoon', 'Groundwater Runoff', 'Plasmid Transmission'],
      impact: {
        amuReduction: 0,
        farmSolvency: 0,
        publicHealthSavingsBillion: -150,
        consumerPriceShiftPct: 0
      },
      characterReactions: {
        amira: {
          mood: 'alarmed',
          reaction: 'Untreated slurry acts as an open environmental bioreactor, spreading mobile resistance genes into wild birds, soil, and municipal water.'
        },
        mohamed: {
          mood: 'skeptical',
          reaction: 'Upgrading concrete holding tanks and digesters is impossible for an independent producer without shared infrastructure subsidies.'
        }
      }
    },
    optionB: {
      id: 'B',
      label: 'Thermophilic Anaerobic Biogas Digester',
      shortTitle: '55°C Biogas Digestion & Pathogen Destruction',
      description: 'Install a high-temperature anaerobic biogas plant that neutralizes 99.4% of resistant bacteria while producing clean heat and power.',
      tags: ['Circular Bioeconomy', '99.4% Pathogen Kill', 'Clean Energy Offset'],
      impact: {
        amuReduction: 20,
        farmSolvency: 14,
        publicHealthSavingsBillion: 510,
        consumerPriceShiftPct: -0.5
      },
      characterReactions: {
        amira: {
          mood: 'optimistic',
          reaction: 'Thermophilic digestion breaks the environmental transmission loop, neutralizing resistance plasmids before they reach the water table.'
        },
        mohamed: {
          mood: 'optimistic',
          reaction: 'The biogas generator cuts my monthly farm electric bill by $1,800 and gives us certified pathogen-free organic bio-fertilizer.'
        }
      }
    }
  },

  ch3: {
    chapterId: 'ch3',
    chapterNumber: '03',
    chapterTitle: "The Farmer's Dilemma",
    dilemmaQuestion: 'How should the national transition policy structure capital costs for farm biosecurity upgrades?',
    contextSummary: 'Mohamed faces a $45,000 quote for automated ventilation, quarantine pens, and digital RFID biometric monitoring.',
    optionA: {
      id: 'A',
      label: 'Unfunded Mandates / Producer Absorbs Risk',
      shortTitle: 'Strict Bans Without Capital Subsidies',
      description: 'Enforce strict antimicrobial bans with penalties but provide zero transition grants or insurance backstops for livestock farmers.',
      tags: ['Unfunded Mandate', 'Farm Insolvency Risk', 'Consolidation'],
      impact: {
        amuReduction: 15,
        farmSolvency: -24,
        publicHealthSavingsBillion: 110,
        consumerPriceShiftPct: 8.5
      },
      characterReactions: {
        amira: {
          mood: 'concerned',
          reaction: 'Punitive bans without financial bridges cause mass farm foreclosures. Desperate producers are forced into clandestine drug markets.'
        },
        mohamed: {
          mood: 'alarmed',
          reaction: 'A single unhedged disease wave under this policy wipes out Al-Wadi Farm. We cannot bear the entire global health burden alone.'
        }
      }
    },
    optionB: {
      id: 'B',
      label: 'National 60% Co-Financed Biosecurity Accord',
      shortTitle: 'Staged Transition Grants & Risk Insurance',
      description: 'Deploy public transition subsidies covering 60% of capital hardware, backed by a 2-year biological insurance loss backstop.',
      tags: ['60% Co-Financed', 'Staged 3-Tier Plan', 'Protected Solvency'],
      impact: {
        amuReduction: 52,
        farmSolvency: 18,
        publicHealthSavingsBillion: 680,
        consumerPriceShiftPct: 1.5
      },
      characterReactions: {
        amira: {
          mood: 'consensus',
          reaction: 'Every $1 of public biosecurity co-financing generates $3.20 in avoided animal mortality and preserved human healthcare efficacy.'
        },
        mohamed: {
          mood: 'determined',
          reaction: 'With 60% capital support, we completed the slotted flooring and ventilation retrofit. Our mortality rate plummeted to 1.1%!'
        }
      }
    }
  },

  ch4: {
    chapterId: 'ch4',
    chapterNumber: '04',
    chapterTitle: 'The Value Chain Horizon',
    dilemmaQuestion: 'How should livestock off-take contracts be structured with retail supermarket chains?',
    contextSummary: 'Wholesale meat aggregators demand high volume at rock-bottom prices, threatening to squeeze certified producers.',
    optionA: {
      id: 'A',
      label: 'Uncertified Spot Commodity Auctions',
      shortTitle: 'Volume Bidding with Zero Stewardship Premium',
      description: 'Sell cattle into opaque spot market auctions where antibiotic-prudent beef is mixed indistinguishably with routine-dosed cattle.',
      tags: ['Opaque Supply Chain', 'Race to Bottom', 'Thin Margin'],
      impact: {
        amuReduction: 8,
        farmSolvency: -6,
        publicHealthSavingsBillion: 60,
        consumerPriceShiftPct: -1.0
      },
      characterReactions: {
        amira: {
          mood: 'skeptical',
          reaction: 'Commodity opacity punishes responsible farmers and denies consumers the choice to support antibiotic stewardship.'
        },
        mohamed: {
          mood: 'concerned',
          reaction: 'If clean husbandry earns the exact same price per kilo as corner-cutting operations, no producer can afford to maintain biosecurity.'
        }
      }
    },
    optionB: {
      id: 'B',
      label: '3-Year Certified Off-Take Contract (+6% Margin)',
      shortTitle: 'Blockchain RFID Traceability & Guaranteed Premium',
      description: 'Sign multi-year supermarket contracts linking ear-tag electronic prescriptions to consumer QR labels with a guaranteed +6% price premium.',
      tags: ['Verified Traceability', '+6% Price Premium', 'Bankable Contract'],
      impact: {
        amuReduction: 48,
        farmSolvency: 22,
        publicHealthSavingsBillion: 590,
        consumerPriceShiftPct: 3.2
      },
      characterReactions: {
        amira: {
          mood: 'optimistic',
          reaction: 'Transparent value chains turn consumer grocery purchases into direct investments in global microbial security.'
        },
        mohamed: {
          mood: 'determined',
          reaction: 'A guaranteed 3-year off-take agreement gave our agricultural bank the collateral needed to approve low-interest expansion credit.'
        }
      }
    }
  },

  ch5: {
    chapterId: 'ch5',
    chapterNumber: '05',
    chapterTitle: 'The Global Landscape',
    dilemmaQuestion: 'How should international governance manage cross-border AMR surveillance and trade equity?',
    contextSummary: 'High-income countries push strict import bans that risk bankrupting smallholder pastoralists in low- and middle-income countries.',
    optionA: {
      id: 'A',
      label: 'Unilateral Import Tariffs & Border Restrictions',
      shortTitle: 'Piecemeal National Residue Embargoes',
      description: 'Wealthy regions impose strict residue testing bans at ports without providing technical assistance or cold-chain diagnostics to exporters.',
      tags: ['Unilateral Tariffs', 'Trade Disruption', 'Displaced Risk'],
      impact: {
        amuReduction: 12,
        farmSolvency: -15,
        publicHealthSavingsBillion: 140,
        consumerPriceShiftPct: 6.0
      },
      characterReactions: {
        amira: {
          mood: 'skeptical',
          reaction: 'AMR genes travel on migratory birds and global trade winds. Trade walls merely push unregulated drugs into domestic informal markets.'
        },
        mohamed: {
          mood: 'skeptical',
          reaction: 'Trade embargoes crush developing pastoralists who have no access to cold-chain vaccines or accredited veterinary testing labs.'
        }
      }
    },
    optionB: {
      id: 'B',
      label: 'Quadripartite Global Accord & Tech Transfer',
      shortTitle: 'Solar Mobile Vet Vans & Differentiated Timelines',
      description: 'FAO, UNEP, WHO, and WOAH deploy solar mobile testing vans to remote rangelands with open-source genomic sequencing and regional roadmaps.',
      tags: ['Quadripartite Pact', 'Mobile Diagnostics', 'Equitable Transition'],
      impact: {
        amuReduction: 61,
        farmSolvency: 16,
        publicHealthSavingsBillion: 890,
        consumerPriceShiftPct: 1.8
      },
      characterReactions: {
        amira: {
          mood: 'consensus',
          reaction: 'Global solidarity creates a true One Health defense. Differentiated pathways empower emerging livestock nations to lead the transition.'
        },
        mohamed: {
          mood: 'optimistic',
          reaction: 'Mobile diagnostic trucks mean pastoralist herders can test sick calves within 45 minutes instead of relying on counterfeit antibiotics.'
        }
      }
    }
  },

  ch6: {
    chapterId: 'ch6',
    chapterNumber: '06',
    chapterTitle: 'The Economics of Action',
    dilemmaQuestion: 'Should global finance fund proactive prevention ($28B/yr) or absorb the $1.2T annual crisis?',
    contextSummary: 'The macroeconomic balance sheet: $28 billion annual global preventative investment vs. $1.2 trillion annual GDP loss by 2040.',
    optionA: {
      id: 'A',
      label: 'Reactive Crisis Funding / Inaction Trajectory',
      shortTitle: 'Emergency Hospital Outbreak Bailouts ($1.2T Drag)',
      description: 'Postpone agricultural biosecurity investments; fund emergency ICU surge capacity and outbreak containment only after superbugs spread.',
      tags: ['Inaction Drag', '$1.2T Annual Loss', 'Medical Catastrophe'],
      impact: {
        amuReduction: 0,
        farmSolvency: -38,
        publicHealthSavingsBillion: -1200,
        consumerPriceShiftPct: 14.0
      },
      characterReactions: {
        amira: {
          mood: 'alarmed',
          reaction: 'Inaction is the most expensive choice in human history: $1.2 trillion in compounding economic drag and 10 million preventable deaths annually.'
        },
        mohamed: {
          mood: 'alarmed',
          reaction: 'When multi-drug resistant pneumonia hits a feedlot, you stand by helplessly watching 40% of your animals die because no antibiotic works.'
        }
      }
    },
    optionB: {
      id: 'B',
      label: 'Proactive $28B Global Biosecurity & Insurance Fund',
      shortTitle: '$28B Annual Investment Yielding 42:1 Return',
      description: 'Allocate $28 billion globally annually into farmer transition grants, diagnostic infrastructure, and biological insurance buffers.',
      tags: ['42:1 ROI', '$28B Prevention Fund', 'Averted Catastrophe'],
      impact: {
        amuReduction: 68,
        farmSolvency: 26,
        publicHealthSavingsBillion: 1180,
        consumerPriceShiftPct: 2.0
      },
      characterReactions: {
        amira: {
          mood: 'optimistic',
          reaction: 'A 42:1 economic return! Investing $28 billion completely shields the global economy from a trillion-dollar catastrophe.'
        },
        mohamed: {
          mood: 'determined',
          reaction: 'Investing in healthy barns, vaccines, and diagnostic tools preserves my farm for my daughter and protects human hospitals.'
        }
      }
    }
  },

  ch7: {
    chapterId: 'ch7',
    chapterNumber: '07',
    chapterTitle: 'The Living Accord',
    dilemmaQuestion: 'How should the RENOFARM One Health Accord be codified into permanent governance?',
    contextSummary: 'Geneva Summit Closing. Ministers, producers, and scientists convene to ratify the permanent global framework.',
    optionA: {
      id: 'A',
      label: 'Non-Binding Voluntary Guidelines',
      shortTitle: 'Advisory Recommendations Without Statutory Mandates',
      description: 'Publish voluntary best-practice handbooks with no statutory veterinary prescription tracking or independent audits.',
      tags: ['Voluntary Guidelines', 'Weak Compliance', 'Unequal Playing Field'],
      impact: {
        amuReduction: 10,
        farmSolvency: 2,
        publicHealthSavingsBillion: 90,
        consumerPriceShiftPct: 0
      },
      characterReactions: {
        amira: {
          mood: 'skeptical',
          reaction: 'Voluntary guidelines historically achieve less than 15% adoption when market margins tighten. We need enforceable accountability.'
        },
        mohamed: {
          mood: 'skeptical',
          reaction: 'Without uniform enforcement, farmers who spend money on biosecurity get undercut by high-density operators who cut corners.'
        }
      }
    },
    optionB: {
      id: 'B',
      label: 'Integrated Statutory Accord & Pen-Side DNA Surveillance',
      shortTitle: 'Digital Rx Registries & Real-Time Genomic Shield',
      description: 'Ratify the binding One Health Handshake: digitized veterinary prescription tracking, subsidized rapid diagnostics, and shared value chains.',
      tags: ['The Handshake Accord', 'Genomic Surveillance', 'Enduring Security'],
      impact: {
        amuReduction: 72,
        farmSolvency: 28,
        publicHealthSavingsBillion: 1340,
        consumerPriceShiftPct: 2.2
      },
      characterReactions: {
        amira: {
          mood: 'consensus',
          reaction: 'The covenant is forged! Science, public health, and livestock production united to preserve modern medicine forever.'
        },
        mohamed: {
          mood: 'consensus',
          reaction: 'The Handshake is real. When farmers are treated as essential partners rather than culprits, we feed the world and protect its future.'
        }
      }
    }
  }
};
