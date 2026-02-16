
import React, { useState, useRef } from 'react';
import { GARLANDS } from '../constants';
import { Garland, TryOnState } from '../types';
import GarlandCard from './GarlandCard';
import { processVirtualTryOn } from '../services/geminiService';

const TryOnSection: React.FC = () => {
  const [state, setState] = useState<TryOnState>({
    userPhoto: null,
    selectedGarland: null,
    resultImage: null,
    isProcessing: false,
    error: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, userPhoto: reader.result as string, resultImage: null, error: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!state.userPhoto || !state.selectedGarland) return;

    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    try {
      const result = await processVirtualTryOn(state.userPhoto, state.selectedGarland.imageUrl);
      setState(prev => ({ ...prev, resultImage: result, isProcessing: false }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: 'Our botanical AI encountered an error. Please ensure your photo is clear and try again.' 
      }));
    }
  };

  const reset = () => {
    setState({
      userPhoto: null,
      selectedGarland: null,
      resultImage: null,
      isProcessing: false,
      error: null,
    });
  };

  return (
    <section id="try-on" className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#B76E79] font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Experience Excellence</span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#2D2D2D] mb-6">Virtual Bouquet Try-On</h2>
          <p className="max-w-2xl mx-auto text-[#2D2D2D]/60 text-lg leading-relaxed">
            Our proprietary AI engine seamlessly integrates our signature floral garlands with your personal portrait for a high-fidelity visual experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Step 1 & 2: Selection & Upload */}
          <div className="lg:col-span-8 space-y-12">
            <div>
              <h3 className="text-xl font-serif text-[#2D2D2D] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#B76E79]/10 text-[#B76E79] flex items-center justify-center text-sm font-bold">1</span>
                Select Your Garland
              </h3>
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {GARLANDS.map(g => (
                  <GarlandCard 
                    key={g.id} 
                    garland={g} 
                    isSelected={state.selectedGarland?.id === g.id}
                    onSelect={(selected) => setState(prev => ({ ...prev, selectedGarland: selected }))}
                  />
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#F5F5F4] p-8 rounded-3xl border border-[#B76E79]/10">
                <h3 className="text-xl font-serif text-[#2D2D2D] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#B76E79]/10 text-[#B76E79] flex items-center justify-center text-sm font-bold">2</span>
                  Upload Portrait
                </h3>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                    state.userPhoto ? 'border-[#B76E79] bg-white' : 'border-[#2D2D2D]/10 hover:border-[#B76E79]/50'
                  }`}
                >
                  {state.userPhoto ? (
                    <img src={state.userPhoto} className="w-full h-full object-cover rounded-2xl" alt="Preview" />
                  ) : (
                    <div className="text-center p-6">
                      <svg className="w-12 h-12 text-[#B76E79]/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm font-medium text-[#2D2D2D]/60">Click to upload photo</p>
                      <p className="text-[10px] text-[#2D2D2D]/40 mt-1 uppercase tracking-widest">JPG, PNG up to 5MB</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-[#B76E79]/5 rounded-xl border border-[#B76E79]/10">
                    <p className="text-xs font-bold text-[#B76E79] uppercase tracking-widest mb-1">Privacy Guarantee</p>
                    <p className="text-xs text-[#2D2D2D]/60">Your portrait is processed securely via Google Gemini and is never stored on our boutique servers.</p>
                  </div>
                  <button
                    disabled={!state.userPhoto || !state.selectedGarland || state.isProcessing}
                    onClick={handleGenerate}
                    className="w-full bg-[#2D2D2D] text-white py-5 rounded-full font-bold tracking-[0.2em] text-sm hover:bg-black transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-black/10 flex items-center justify-center gap-3"
                  >
                    {state.isProcessing ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        DESIGNING PORTRAIT...
                      </>
                    ) : (
                      'GENERATE PREVIEW'
                    )}
                  </button>
                  {state.error && (
                    <p className="text-red-500 text-xs text-center animate-pulse">{state.error}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Result Area */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <h3 className="text-xl font-serif text-[#2D2D2D] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#B76E79]/10 text-[#B76E79] flex items-center justify-center text-sm font-bold">3</span>
              Final Look
            </h3>
            <div className="relative aspect-[4/5] bg-[#F5F5F4] rounded-3xl overflow-hidden border border-[#B76E79]/20 shadow-2xl">
              {state.resultImage ? (
                <>
                  <img src={state.resultImage} className="w-full h-full object-cover animate-fade-in" alt="Result" />
                  <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = state.resultImage!;
                        link.download = 'flowerhub-tryon.png';
                        link.click();
                      }}
                      className="flex-1 bg-white/90 backdrop-blur text-[#2D2D2D] py-3 rounded-xl font-bold text-xs tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"
                    >
                      DOWNLOAD
                    </button>
                    <button 
                      onClick={reset}
                      className="p-3 bg-white/90 backdrop-blur text-[#2D2D2D] rounded-xl hover:bg-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center">
                   {state.isProcessing ? (
                     <div className="space-y-4">
                        <div className="w-16 h-16 border-t-2 border-[#B76E79] rounded-full animate-spin mx-auto" />
                        <p className="text-sm font-serif italic text-[#2D2D2D]/40">Gathering the finest blossoms...</p>
                     </div>
                   ) : (
                     <>
                        <div className="w-20 h-20 bg-[#B76E79]/5 rounded-full flex items-center justify-center mb-6">
                          <svg className="w-8 h-8 text-[#B76E79]/20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                        </div>
                        <p className="text-sm font-serif italic text-[#2D2D2D]/30">Your customized portrait will appear here</p>
                     </>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TryOnSection;
