
import { ArtPiece } from './types';

export const ARTWORKS: ArtPiece[] = [
  // LOVE SECTION
 {
    id: 'l1',
    section: 'Love',
    artist: 'Elena Rossi',
    dialogue: [
      { sender: 'A', text: "Do you remember the morning at the shore?" },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'l2',
    section: 'Love',
    artist: 'Julian Thorne',
    dialogue: [
      { sender: 'A', text: "Do you remember the morning at the shore?" },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'l3',
    section: 'Love',
    artist: 'Elena Vasquez',
    dialogue: [
      { sender: 'A', text: "Our love is a garden in bloom." },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=800'
  },
  // NOVEL SECTION
  {
    id: 'n1',
    section: 'Novel',
    title: '만화가가 마을을 떠났다.',
    artist: 'MAGIO (@rizza____)',
    description: '로한과 죠스케가 사랑을 확인하는 내용을 쓰고 싶었습니다.',
    story: '마을을 떠난 키시베 로한. 자신과는 아무 상관없을 거라고 생각했지만 어쩐지 계속해서 신경이 쓰인다. 알고있니, 죠스케? 신경쓰인다는 말은 관심이 있다는 의미란다.',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'n2',
    section: 'Novel',
    title: 'Midnight Chapter',
    artist: 'Isobel Grey',
    description: 'Moody blues and sharp whites depicting a desk illuminated only by a single candle.',
    story: 'The moment of inspiration that comes at 3 AM, when the world is asleep and the boundary between fiction and reality is at its thinnest.',
    thumbnail: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'n3',
    section: 'Novel',
    title: 'Untitled',
    artist: 'MAGIO',
    description: 'A story about longing.',
    story: 'I miss Rohan.',
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800'
  },
  // ART SECTION
  {
    id: 'a1',
    section: 'Art',
    title: 'Chromatic Silence',
    artist: 'Marcus Klein',
    description: 'A study of texture and void, featuring heavy impasto and minimalist composition.',
    story: 'Art doesn\'t always need to speak; sometimes it just needs to exist. This piece is a meditation on the physical presence of paint on canvas and the emotions it evokes without imagery.',
    thumbnail: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'a2',
    section: 'Art',
    title: 'The Sculptor\'s Dream',
    artist: 'Ava Moretti',
    description: 'A surrealist piece showing stone hands carving themselves out of a mountain.',
    story: 'A tribute to the act of creation itself—the struggle to bring form out of chaos and the realization that the artist is shaped by the work as much as the work is shaped by them.',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800'
  }
];
