import React, { useState } from 'react';
import { Upload, Sparkles, Sliders, RefreshCw, Check, Camera } from 'lucide-react';
import { PRESET_AVATARS, getPresetAvatarDataUrl, applyCyberFilter } from '../utils/avatars';
import { sfx } from '../utils/audio';

export default function PhotoUploader({ currentAvatar, onAvatarChange }) {
  const [activeTab, setActiveTab] = useState('preset'); // 'preset' | 'upload'
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [rawUploadedImage, setRawUploadedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('cyber-dither');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePresetSelect = (index) => {
    sfx.click();
    setSelectedPresetIndex(index);
    const dataUrl = getPresetAvatarDataUrl(index);
    onAvatarChange(dataUrl);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sfx.click();
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result;
      setRawUploadedImage(src);
      setActiveTab('upload');
      processFilter(src, activeFilter);
    };
    reader.readAsDataURL(file);
  };

  const processFilter = (src, filterType) => {
    if (!src) return;
    setIsProcessing(true);
    sfx.scan();
    if (filterType === 'pristine') {
      onAvatarChange(src);
      setIsProcessing(false);
      return;
    }
    applyCyberFilter(src, filterType, (filteredUrl) => {
      onAvatarChange(filteredUrl);
      setIsProcessing(false);
    });
  };

  const handleFilterChange = (filterType) => {
    sfx.click();
    setActiveFilter(filterType);
    if (rawUploadedImage) {
      processFilter(rawUploadedImage, filterType);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono-tech uppercase tracking-wider text-white/70 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-[#FF4B2B]" />
          <span>BIOMETRIC IDENTITY / AVATAR</span>
        </label>

        {/* Tab switch */}
        <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10 text-[10px] font-mono-tech">
          <button
            type="button"
            onClick={() => {
              sfx.click();
              setActiveTab('preset');
              handlePresetSelect(selectedPresetIndex);
            }}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'preset' ? 'bg-[#FF4B2B] text-white font-bold' : 'text-white/50 hover:text-white'
            }`}
          >
            CYBER PRESETS
          </button>
          <button
            type="button"
            onClick={() => {
              sfx.click();
              setActiveTab('upload');
            }}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'upload' ? 'bg-[#FF4B2B] text-white font-bold' : 'text-white/50 hover:text-white'
            }`}
          >
            CUSTOM PHOTO
          </button>
        </div>
      </div>

      {activeTab === 'preset' ? (
        /* Presets Grid */
        <div className="grid grid-cols-4 gap-2">
          {PRESET_AVATARS.map((preset, idx) => {
            const isSelected = selectedPresetIndex === idx;
            return (
              <button
                type="button"
                key={preset.id}
                onClick={() => handlePresetSelect(idx)}
                className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'border-[#FF4B2B] bg-[#FF4B2B]/15 shadow-[0_0_12px_rgba(255,75,43,0.4)]'
                    : 'border-white/10 bg-[#12131F] hover:border-white/30'
                }`}
              >
                <div
                  className="w-full aspect-square rounded-lg overflow-hidden border border-white/10 mb-1"
                  dangerouslySetInnerHTML={{ __html: preset.svg }}
                />
                <div className="text-[8px] font-mono-tech text-white/70 truncate group-hover:text-white">
                  {preset.tag}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Photo Upload & Filter Controls */
        <div className="space-y-3">
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/20 hover:border-[#FF4B2B] rounded-2xl cursor-pointer bg-[#12131F]/50 transition-all group">
            <div className="flex flex-col items-center justify-center pt-2 pb-2">
              <Upload className="w-6 h-6 text-white/50 group-hover:text-[#FF4B2B] mb-1 transition-colors" />
              <p className="text-xs text-white/80 font-mono-tech font-bold">
                {rawUploadedImage ? "Replace Identity Photo" : "Upload Face / Portrait"}
              </p>
              <p className="text-[9px] text-white/40 font-mono-tech">JPG, PNG (Auto-Dithered into Hologram)</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>

          {rawUploadedImage && (
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono-tech text-white/40 uppercase">
                HOLOGRAPHIC SHADER FILTER:
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-[9px] font-mono-tech">
                {[
                  { id: 'cyber-dither', label: 'RUST DITHER' },
                  { id: 'holographic', label: 'HOLO CYAN' },
                  { id: 'monochrome', label: 'CYBER NOIR' },
                  { id: 'pristine', label: 'PRISTINE' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleFilterChange(f.id)}
                    className={`py-1 px-1 rounded-md border text-center transition-all cursor-pointer ${
                      activeFilter === f.id
                        ? 'bg-[#FF4B2B] border-[#FF4B2B] text-white font-bold'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
