export type Page = 'INDEX' | 'INTRO' | 'SECTION' | 'DETAIL';
export type SectionType = 'Love' | 'Novel' | 'Art';

export type DialogueItem = {
  sender: string; // 필요하면 'A' | 'B' 등으로 더 좁혀도 됨
  text: string;
};

/** ✅ Love 섹션 전용 타입: dialogue 필수 + 최소 필드만 */
export type LoveArtPiece = {
  id: string;
  section: 'Love';
  artist: string;
  dialogue: DialogueItem[];

  // 선택: Love에서도 추가 필드 쓰고 싶으면 아래처럼 optional로 확장 가능
  text?: string;
  thumbnail?: string;
  story?: string;
  description?: string;
};

/** ✅ Novel/Art 공통(기존 구조 유지) */
export type NonLoveArtPiece = {
  id: string;
  section: 'Novel' | 'Art';
  title: string;
  artist: string;
  description: string;
  story: string;
  thumbnail: string;
};

export type ArtPiece = LoveArtPiece | NonLoveArtPiece;