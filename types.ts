
// Defined types for the FlowerHub application to ensure module validity for TS components.
export interface Garland {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  type: string;
}

export interface TryOnState {
  userPhoto: string | null;
  selectedGarland: Garland | null;
  resultImage: string | null;
  isProcessing: boolean;
  error: string | null;
}
