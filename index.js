
import { GoogleGenAI } from "@google/genai";

// --- Constants & Data ---
const GARLANDS = [
  {
    id: 'jasmine-royal',
    name: 'Royal Jasmine Grandeur',
    description: 'Hand-picked premium Sambac jasmine with gold accents.',
    imageUrl: 'https://images.unsplash.com/photo-1596434451000-84c8a2cc143d?auto=format&fit=crop&q=80&w=800',
    price: 120,
    type: 'Jasmine'
  },
  {
    id: 'rose-velvet',
    name: 'Velvet Rose Ombre',
    description: 'Crimson and pink roses layered in a classic V-shape.',
    imageUrl: 'https://images.unsplash.com/photo-1548092372-0d1bd40894a3?auto=format&fit=crop&q=80&w=800',
    price: 150,
    type: 'Rose'
  },
  {
    id: 'marigold-sun',
    name: 'Golden Sunburst',
    description: 'Vibrant marigold blossoms for prosperity and joy.',
    imageUrl: 'https://images.unsplash.com/photo-1610443428287-43df874d6431?auto=format&fit=crop&q=80&w=800',
    price: 85,
    type: 'Marigold'
  },
  {
    id: 'mixed-divine',
    name: 'Divine Tapestry',
    description: 'A sophisticated blend of orchids and white lilies.',
    imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800',
    price: 195,
    type: 'Mixed'
  }
];

// --- State ---
let state = {
  selectedGarlandId: null,
  userPhoto: null,
  resultImage: null,
  isProcessing: false,
  error: null
};

// --- Utilities ---
const el = (id) => document.getElementById(id);

async function imageUrlToBase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(blob);
  });
}

// --- AI Core ---
async function runTryOn() {
  if (!state.userPhoto || !state.selectedGarlandId) return;
  
  updateState({ isProcessing: true, error: null, resultImage: null });
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const userBase64 = state.userPhoto.split(',')[1];
    const garland = GARLANDS.find(g => g.id === state.selectedGarlandId);
    const garlandBase64 = await imageUrlToBase64(garland.imageUrl);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: userBase64, mimeType: 'image/png' } },
          { inlineData: { data: garlandBase64, mimeType: 'image/png' } },
          { text: "Take the floral garland from the second image and place it realistically around the neck of the person in the first image. Ensure the lighting, shadows, and perspective match the person's portrait. The output should be a single image of the person wearing the garland." }
        ]
      }
    });

    const imagePart = response.candidates[0].content.parts.find(p => p.inlineData);
    if (imagePart) {
      updateState({ resultImage: `data:image/png;base64,${imagePart.inlineData.data}`, isProcessing: false });
    } else {
      throw new Error("Design engine returned no image.");
    }
  } catch (err) {
    console.error(err);
    updateState({ error: "Botanical AI Error: " + err.message, isProcessing: false });
  }
}

// --- Rendering ---
function render() {
  const app = el('app');
  app.innerHTML = `
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-[#F5F5F4]/80 backdrop-blur-md border-b border-[#B76E79]/20 px-6 py-4">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 bg-[#B76E79] rounded-full flex items-center justify-center text-white font-serif text-xl">F</div>
          <h1 class="text-2xl font-serif tracking-widest">FLOWERHUB</h1>
        </div>
        <nav class="hidden md:flex gap-8 text-sm font-medium tracking-widest opacity-60">
          <a href="#" class="hover:text-[#B76E79] transition-colors">COLLECTIONS</a>
          <a href="#try-on" class="hover:text-[#B76E79] transition-colors">VIRTUAL TRY-ON</a>
          <a href="#" class="hover:text-[#B76E79] transition-colors">BOUTIQUES</a>
        </nav>
        <button class="bg-[#B76E79] text-white px-6 py-2 rounded-full text-xs font-bold tracking-widest hover:bg-[#A65D68] transition-all luxury-shadow">
          SHOP NOW
        </button>
      </div>
    </header>

    <!-- Hero -->
    <section class="relative h-[70vh] flex items-center justify-center bg-white">
      <div class="absolute inset-0 opacity-40">
        <img src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=2000" class="w-full h-full object-cover">
      </div>
      <div class="relative text-center px-6 max-w-4xl animate-fade-in">
        <span class="text-[#B76E79] font-bold tracking-[0.4em] text-[10px] uppercase mb-6 block">Haute Floristry • London</span>
        <h2 class="text-6xl md:text-8xl font-serif mb-8 leading-tight">Artistry in <br/><span class="italic text-[#B76E79]">Bloom.</span></h2>
        <a href="#try-on" class="inline-block bg-[#2D2D2D] text-white px-10 py-5 rounded-full font-bold tracking-widest text-[10px] hover:bg-black transition-all luxury-shadow">
          EXPERIENCE TRY-ON
        </a>
      </div>
    </section>

    <!-- Try-On Engine -->
    <section id="try-on" class="py-32 px-6 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20">
          <h2 class="text-4xl font-serif mb-4">Virtual Boutique</h2>
          <p class="text-[#2D2D2D]/60 max-w-xl mx-auto">Select a bespoke piece and visualize it on your silhouette with our neural design engine.</p>
        </div>

        <div class="grid lg:grid-cols-12 gap-16">
          <!-- Step 1: Selection -->
          <div class="lg:col-span-8 space-y-16">
            <div>
              <div class="flex items-center gap-4 mb-8">
                <span class="text-xs font-bold tracking-[0.2em] text-[#B76E79]">01</span>
                <h3 class="font-serif text-xl uppercase tracking-widest">Select Garland</h3>
              </div>
              <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                ${GARLANDS.map(g => `
                  <div onclick="window.selectGarland('${g.id}')" class="group cursor-pointer">
                    <div class="aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all duration-500 ${state.selectedGarlandId === g.id ? 'border-[#B76E79] scale-[1.02] luxury-shadow' : 'border-transparent'}">
                      <img src="${g.imageUrl}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    </div>
                    <div class="mt-4 flex justify-between items-center">
                      <span class="font-serif text-sm">${g.name}</span>
                      <span class="text-[10px] text-[#B76E79] font-bold">$${g.price}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Step 2: Portrait -->
            <div>
              <div class="flex items-center gap-4 mb-8">
                <span class="text-xs font-bold tracking-[0.2em] text-[#B76E79]">02</span>
                <h3 class="font-serif text-xl uppercase tracking-widest">Portrait Upload</h3>
              </div>
              <div class="flex flex-col md:flex-row gap-12 items-center bg-[#F5F5F4] p-12 rounded-[2rem]">
                <div 
                  onclick="el('fileInput').click()"
                  class="w-64 aspect-square rounded-full border-2 border-dashed border-[#B76E79]/30 flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-all overflow-hidden"
                >
                  ${state.userPhoto ? 
                    `<img src="${state.userPhoto}" class="w-full h-full object-cover">` : 
                    `<div class="text-center p-6">
                      <svg class="w-8 h-8 text-[#B76E79] mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"></path></svg>
                      <span class="text-[10px] font-bold tracking-widest text-[#B76E79]">UPLOAD PHOTO</span>
                    </div>`
                  }
                  <input type="file" id="fileInput" class="hidden" accept="image/*">
                </div>
                <div class="flex-1 space-y-6">
                  <p class="text-sm text-[#2D2D2D]/50 italic">"Quality is the soul of every pixel. Please use a clear, well-lit portrait for the most realistic integration."</p>
                  <button 
                    onclick="window.handleGenerate()"
                    ${!state.userPhoto || !state.selectedGarlandId || state.isProcessing ? 'disabled' : ''}
                    class="w-full py-5 rounded-full bg-[#2D2D2D] text-white font-bold tracking-[0.3em] text-[10px] hover:bg-black disabled:opacity-20 transition-all luxury-shadow flex items-center justify-center gap-4"
                  >
                    ${state.isProcessing ? '<div class="loader w-4 h-4 border-2 border-white rounded-full"></div> PROCESSING' : 'DESIGN MY PREVIEW'}
                  </button>
                  ${state.error ? `<p class="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest animate-pulse">${state.error}</p>` : ''}
                </div>
              </div>
            </div>
          </div>

          <!-- Result Panel -->
          <div class="lg:col-span-4 lg:sticky lg:top-32">
            <div class="flex items-center gap-4 mb-8">
              <span class="text-xs font-bold tracking-[0.2em] text-[#B76E79]">03</span>
              <h3 class="font-serif text-xl uppercase tracking-widest">Result</h3>
            </div>
            <div class="aspect-[3/4] rounded-[2rem] bg-[#F5F5F4] overflow-hidden border border-[#B76E79]/10 luxury-shadow flex items-center justify-center relative">
              ${state.resultImage ? `
                <img src="${state.resultImage}" class="w-full h-full object-cover animate-fade-in">
                <div class="absolute bottom-8 left-8 right-8">
                  <button onclick="window.downloadResult()" class="w-full bg-white/90 backdrop-blur py-4 rounded-xl text-[10px] font-bold tracking-widest hover:bg-white transition-all">DOWNLOAD PORTRAIT</button>
                </div>
              ` : `
                <div class="text-center p-12 opacity-20">
                  <svg class="w-20 h-20 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  <p class="font-serif italic text-lg">Your curated preview will appear here</p>
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-[#2D2D2D] py-20 px-6 text-white/40">
      <div class="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-white/10 pt-12">
        <h2 class="text-white font-serif text-2xl tracking-widest">FLOWERHUB</h2>
        <p class="text-[10px] tracking-[0.3em]">© 2024 LUXURY RETAIL COLLECTIVE</p>
        <div class="flex gap-8 text-[10px] tracking-widest">
          <a href="#" class="hover:text-white transition-colors">PRIVACY</a>
          <a href="#" class="hover:text-white transition-colors">TERMS</a>
        </div>
      </div>
    </footer>
  `;

  // Attach dynamic event listeners after render
  const fileInput = el('fileInput');
  if (fileInput) {
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => updateState({ userPhoto: reader.result });
        reader.readAsDataURL(file);
      }
    };
  }
}

function updateState(newState) {
  state = { ...state, ...newState };
  render();
}

// --- Global Actions (attached to window for HTML event handlers) ---
window.selectGarland = (id) => updateState({ selectedGarlandId: id, resultImage: null });
window.handleGenerate = () => runTryOn();
window.downloadResult = () => {
  const link = document.createElement('a');
  link.href = state.resultImage;
  link.download = `flowerhub-custom-${Date.now()}.png`;
  link.click();
};

// --- Init ---
render();
