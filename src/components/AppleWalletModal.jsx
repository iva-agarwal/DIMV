import React, { useState } from 'react';
import { X, Check, CreditCard, Sparkles, Shield, Wifi } from 'lucide-react';
import { sfx } from '../utils/audio';

export default function AppleWalletModal({ isOpen, onClose, userData, planetaryData }) {
  const [added, setAdded] = useState(false);

  if (!isOpen) return null;

  const handleAdd = () => {
    sfx.mint();
    setAdded(true);
    setTimeout(() => {
      // Keep state or auto close after a moment
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0F0F14] border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center">
              <span className="text-black text-xs font-bold font-sans"></span>
            </div>
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Apple Wallet Pass
            </h3>
          </div>
          <button
            onClick={() => {
              sfx.click();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Realistic Apple Wallet Pass Card */}
        <div className="w-full bg-[#181822] rounded-2xl border border-white/15 overflow-hidden shadow-2xl mb-6 relative">
          
          {/* Top Pass Strip */}
          <div className="bg-gradient-to-r from-[#FF4B2B] to-[#FF8C00] p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase font-mono-tech">
                  MARTIAN ID
                </span>
                <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full font-mono-tech">
                  OLYMPUS MONS
                </span>
              </div>
              <Wifi className="w-4 h-4 rotate-90 text-white/90" />
            </div>
            
            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-white/70 font-mono-tech block">OPERATOR</span>
                <span className="text-lg font-bold font-display-tech tracking-wide">
                  {(userData.name || 'Alex Chen').toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/70 font-mono-tech block">MARTIAN AGE</span>
                <span className="text-xl font-bold font-mono-tech">
                  {planetaryData?.marsAge || '12.7'} <span className="text-xs font-normal">YRS</span>
                </span>
              </div>
            </div>
          </div>

          {/* Pass Body Fields */}
          <div className="p-4 bg-[#12131D] space-y-4">
            <div className="grid grid-cols-3 gap-2 border-b border-white/10 pb-3">
              <div>
                <span className="text-[9px] font-mono-tech text-white/40 block">CLASS</span>
                <span className="text-xs font-mono-tech font-bold text-white">A-EXO</span>
              </div>
              <div>
                <span className="text-[9px] font-mono-tech text-white/40 block">PERMIT STATUS</span>
                <span className="text-xs font-mono-tech font-bold text-emerald-400">AUTHORIZED</span>
              </div>
              <div>
                <span className="text-[9px] font-mono-tech text-white/40 block">DONOR</span>
                <span className="text-xs font-mono-tech font-bold text-[#FF8C00]">CYBORG</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono-tech text-white/60">
              <span>SOLS SURVIVED:</span>
              <span className="text-white font-bold">{planetaryData?.marsSols || '8,512'} SOLS</span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono-tech text-white/60">
              <span>GRAVITY ACCLIMATION:</span>
              <span className="text-emerald-400 font-bold">0.376g CERTIFIED</span>
            </div>

            {/* Pass Barcode */}
            <div className="pt-2 flex flex-col items-center">
              <div className="w-full h-12 bg-white rounded p-1.5 flex items-center justify-center">
                <svg className="w-full h-full text-black" viewBox="0 0 200 40" fill="currentColor">
                  <rect x="0" y="0" width="4" height="40"/>
                  <rect x="6" y="0" width="2" height="40"/>
                  <rect x="10" y="0" width="6" height="40"/>
                  <rect x="18" y="0" width="2" height="40"/>
                  <rect x="22" y="0" width="4" height="40"/>
                  <rect x="28" y="0" width="8" height="40"/>
                  <rect x="38" y="0" width="2" height="40"/>
                  <rect x="42" y="0" width="4" height="40"/>
                  <rect x="48" y="0" width="6" height="40"/>
                  <rect x="56" y="0" width="2" height="40"/>
                  <rect x="60" y="0" width="4" height="40"/>
                  <rect x="66" y="0" width="8" height="40"/>
                  <rect x="76" y="0" width="2" height="40"/>
                  <rect x="80" y="0" width="4" height="40"/>
                  <rect x="86" y="0" width="6" height="40"/>
                  <rect x="94" y="0" width="2" height="40"/>
                  <rect x="98" y="0" width="4" height="40"/>
                  <rect x="104" y="0" width="8" height="40"/>
                  <rect x="114" y="0" width="2" height="40"/>
                  <rect x="118" y="0" width="4" height="40"/>
                  <rect x="124" y="0" width="6" height="40"/>
                  <rect x="132" y="0" width="2" height="40"/>
                  <rect x="136" y="0" width="4" height="40"/>
                  <rect x="142" y="0" width="8" height="40"/>
                  <rect x="152" y="0" width="2" height="40"/>
                  <rect x="156" y="0" width="4" height="40"/>
                  <rect x="162" y="0" width="6" height="40"/>
                  <rect x="170" y="0" width="4" height="40"/>
                  <rect x="176" y="0" width="8" height="40"/>
                  <rect x="186" y="0" width="4" height="40"/>
                  <rect x="192" y="0" width="6" height="40"/>
                </svg>
              </div>
              <span className="text-[8px] font-mono-tech text-white/30 tracking-widest mt-1">
                TAP TO OPEN AIRLOCK SCANNER
              </span>
            </div>

          </div>

        </div>

        {/* Action Button */}
        <button
          onClick={handleAdd}
          className={`w-full py-3.5 px-5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            added
              ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)]'
              : 'bg-white text-black hover:bg-white/90 shadow-xl'
          }`}
        >
          {added ? (
            <>
              <Check className="w-5 h-5 text-black stroke-[3]" />
              <span className="font-bold">ADDED TO APPLE WALLET</span>
            </>
          ) : (
            <>
              <span className="text-base"></span>
              <span className="font-bold">Add to Apple Wallet</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
}
