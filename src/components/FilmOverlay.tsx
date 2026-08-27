import React from 'react';
import { X, Award, RotateCcw } from 'lucide-react';
import { audioController } from '../utils/sound';

interface FilmOverlayProps {
  isFilmMode: boolean;
  isCreditsOpen: boolean;
  onCloseCredits: () => void;
  onRestartJourney: () => void;
}

export const FilmOverlay: React.FC<FilmOverlayProps> = ({
  isFilmMode,
  isCreditsOpen,
  onCloseCredits,
  onRestartJourney
}) => {
  return (
    <>
      {/* Film Letterbox Bars */}
      <div
        className={`fixed top-0 left-0 right-0 h-[6vh] bg-black z-50 transition-transform duration-500 pointer-events-none ${
          isFilmMode ? 'translate-y-0' : '-translate-y-full'
        }`}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 h-[6vh] bg-black z-50 transition-transform duration-500 pointer-events-none ${
          isFilmMode ? 'translate-y-0' : 'translate-y-full'
        }`}
      />

      {/* Credits Roll Modal */}
      {isCreditsOpen && (
        <div
          id="credits-modal"
          className="fixed inset-0 z-50 bg-[#0b0e12]/95 text-[#f4ead8] flex flex-col items-center justify-center p-6 text-center animate-in fade-in backdrop-blur-xl"
        >
          <button
            id="close-credits-btn"
            onClick={onCloseCredits}
            className="absolute top-6 right-6 h-10 w-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-[#f4ead8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-2xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#c8875a]/20 text-[#c8875a] text-xs font-black uppercase tracking-widest">
              <Award className="w-4 h-4" />
              Documentary Assessment
            </div>

            <h2 className="font-serif font-black text-4xl sm:text-5xl text-[#f4ead8]">
              The Handshake
            </h2>

            <p className="text-sm sm:text-base text-[#cfd6cd] leading-relaxed max-w-lg mx-auto">
              An educational and interactive exploration inspired by the United Nations Food and Agriculture Organization (FAO) report:
              <br />
              <em className="font-serif text-[#e8b170] not-italic font-bold block mt-1">
                "The future of antimicrobial use in livestock — the economic cost of action or inaction"
              </em>
            </p>

            <div className="pt-4 border-t border-white/15 grid grid-cols-2 gap-4 text-xs text-[#a8b2a9]">
              <div>
                <span className="font-black text-white block uppercase tracking-wider">Scientific Voice</span>
                <span>Dr. Amira · One Health Economist</span>
              </div>
              <div>
                <span className="font-black text-white block uppercase tracking-wider">Agricultural Voice</span>
                <span>Mohamed · Commercial Livestock Producer</span>
              </div>
            </div>

            <div className="pt-6 flex justify-center gap-3">
              <button
                id="restart-journey-btn"
                onClick={() => {
                  audioController.playPop();
                  onRestartJourney();
                  onCloseCredits();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#c8875a] text-[#1c120a] font-extrabold text-sm hover:bg-[#dd9f66] transition-colors cursor-pointer shadow-lg"
              >
                <RotateCcw className="w-4 h-4" /> Restart the Dialogue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
