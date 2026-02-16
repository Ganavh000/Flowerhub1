
import { Garland } from './types';

// Bespoke floral garland collection shared across the application.
export const GARLANDS: Garland[] = [
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
