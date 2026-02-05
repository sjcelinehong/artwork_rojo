import { ArtPiece } from '../types';
import { LOVE_ARTWORKS } from './loveArtworks';
import { NOVEL_ARTWORKS } from './novelArtworks';
import { ART_ARTWORKS } from './artArtworks';

export const ARTWORKS: ArtPiece[] = [
  ...LOVE_ARTWORKS,
  ...NOVEL_ARTWORKS,
  ...ART_ARTWORKS,
];
