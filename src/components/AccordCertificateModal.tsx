import React, { useState, useRef } from 'react';
import { Award, ShieldCheck, CheckCircle2, Download, Printer, X, Sparkles, Handshake, HeartPulse, Leaf } from 'lucide-react';
import { audioController } from '../utils/sound';
import { UserPathRecord } from '../types';

interface AccordCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRecord: UserPathRecord;
}

export const AccordCertificateModal: React.FC<AccordCertificateModalProps> = ({
  isOpen,
  onClose,
  userRecord
}) => {
  const [signatoryName, setSignatoryName] = useState<string>('Omar Sayed');
  const [organization, setOrganization] = useState<string>('Sustainable Agriculture & Public Health Initiative');
  const [isSigned, setIsSigned] = useState<boolean>(true);
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    audioController.playPop();
    window.print();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          audioController.playPop();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-[#fbf7ee] dark:bg-[#121c26] border-2 border-[#a8734a]/30 shadow-2xl overflow-hidden text-[#292019] dark:text-[#f0e6d6]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#292019]/10 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#16222c]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#a8734a]/15 text-[#a8734a] dark:text-[#dda070] flex items-center justify-center shadow-inner">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-black text-lg sm:text-xl leading-none">
                One Health Stewardship Accord
              </h3>
              <p className="text-xs text-[#6b5f52] dark:text-[#a8b2a9] mt-0.5">
                Official Ratification Certificate of The Handshake (FAO 2026 Framework)
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

        {/* Modal Body & Customization Form */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Signatory Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white dark:bg-[#182430] border border-[#292019]/10 shadow-sm">
            <div>
              <label className="text-[11px] font-black uppercase text-[#8a7b6d] block mb-1">
                Signatory Name / Representative:
              </label>
              <input
                type="text"
                value={signatoryName}
                onChange={(e) => setSignatoryName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 rounded-xl bg-[#fbf7ee] dark:bg-[#0f1720] border border-[#292019]/15 text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-[#8a7b6d] block mb-1">
                Farm / Institution / Organization:
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Enter organization or farm name"
                className="w-full px-3 py-2 rounded-xl bg-[#fbf7ee] dark:bg-[#0f1720] border border-[#292019]/15 text-xs font-bold"
              />
            </div>
          </div>

          {/* Certificate Canvas */}
          <div
            ref={certRef}
            className="p-6 sm:p-10 rounded-3xl bg-[#fefcf8] dark:bg-[#15202b] border-4 border-double border-[#a8734a]/50 shadow-2xl relative overflow-hidden text-center space-y-6"
          >
            {/* Corner Decorative Rosettes */}
            <div className="absolute top-3 left-3 text-[#a8734a]/40 font-serif text-lg">❖</div>
            <div className="absolute top-3 right-3 text-[#a8734a]/40 font-serif text-lg">❖</div>
            <div className="absolute bottom-3 left-3 text-[#a8734a]/40 font-serif text-lg">❖</div>
            <div className="absolute bottom-3 right-3 text-[#a8734a]/40 font-serif text-lg">❖</div>

            {/* Emblem */}
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-[#a8734a]/15 text-[#a8734a] flex items-center justify-center border-2 border-[#a8734a]/40 shadow-inner">
                <Handshake className="w-8 h-8" />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#a8734a] block mb-1">
                United Nations FAO & WOAH Aligned Accord
              </span>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#292019] dark:text-[#f0e6d6]">
                The Handshake Covenant
              </h2>
              <p className="font-serif italic text-xs sm:text-sm text-[#6b5f52] dark:text-[#a8b2a9] mt-1">
                For Prudent Antimicrobial Stewardship & Livestock Health Security
              </p>
            </div>

            <div className="max-w-lg mx-auto py-2 border-y border-[#292019]/15 dark:border-white/15">
              <p className="text-xs sm:text-sm text-[#3a3229] dark:text-[#cbd5e1] leading-relaxed">
                This document certifies that <strong className="font-bold text-[#a8734a] dark:text-[#dda070]">{signatoryName || 'The Signatory'}</strong> representing <strong className="font-bold">{organization || 'General Agriculture'}</strong> has ratified the 4 pillars of the One Health Livestock Accord:
              </p>
            </div>

            {/* 4 Pillars Ratified */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
              <div className="p-2.5 rounded-xl bg-[#a8734a]/10 border border-[#a8734a]/20">
                <ShieldCheck className="w-4 h-4 text-[#a8734a] mb-1" />
                <span className="font-bold text-[11px] block leading-tight">1. Biosecurity First</span>
                <span className="text-[9px] text-[#8a7b6d]">Housing & hygiene upgrades</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#7d8f6c]/10 border border-[#7d8f6c]/20">
                <CheckCircle2 className="w-4 h-4 text-[#7d8f6c] mb-1" />
                <span className="font-bold text-[11px] block leading-tight">2. Rapid Testing</span>
                <span className="text-[9px] text-[#8a7b6d]">Pen-side diagnostic validation</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#6d80c4]/10 border border-[#6d80c4]/20">
                <HeartPulse className="w-4 h-4 text-[#6d80c4] mb-1" />
                <span className="font-bold text-[11px] block leading-tight">3. Transition Capital</span>
                <span className="text-[9px] text-[#8a7b6d]">Fair smallholder subsidies</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#dd9f66]/10 border border-[#dd9f66]/20">
                <Leaf className="w-4 h-4 text-[#dd9f66] mb-1" />
                <span className="font-bold text-[11px] block leading-tight">4. Market Trust</span>
                <span className="text-[9px] text-[#8a7b6d]">Verified green-label premiums</span>
              </div>
            </div>

            {/* Signatures & Official Stamp */}
            <div className="pt-4 flex items-end justify-between gap-4 border-t border-[#292019]/10 text-left">
              <div>
                <span className="font-serif italic text-sm text-[#a8734a] block font-bold">
                  Dr. Amira
                </span>
                <span className="text-[10px] text-[#8a7b6d]">One Health Economist</span>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#a8734a] flex items-center justify-center mx-auto text-[#a8734a] text-[9px] font-black uppercase rotate-12">
                  RATIFIED<br />2026
                </div>
              </div>

              <div className="text-right">
                <span className="font-serif italic text-sm text-[#7d8f6c] block font-bold">
                  Mohamed
                </span>
                <span className="text-[10px] text-[#8a7b6d]">Livestock Producer</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#292019] text-[#fbf7ee] dark:bg-[#dda070] dark:text-[#16222c] text-xs font-black hover:bg-[#a8734a] transition-all cursor-pointer shadow-lg"
            >
              <Printer className="w-4 h-4" /> Print / Save Certificate PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
