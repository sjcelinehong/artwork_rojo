export const STORY_OVERRIDE_BY_ID: Record<string, { artist?: string; story?: string }> = {
  "n1": { artist: "MAGIO", story: "굉장히 힘든 구조였지만 어떻게든 해냈습니다. 모두 화이팅!" },
  "n2": { artist: "Isobel Grey", story: "나는 로장을 사랑해요" },
  "n3": { artist: "MAGIO", story : "아 로장 보고싶다"},
  "l1": { artist: "Sofia Rossi", story: "사랑은 아침빛처럼 밝고 따뜻합니다. 매 순간이 기적이에요." },
  "l2": { artist: "Marcus Grey", story: "당신과 함께라면 모든 순간이 특별해집니다. 사랑해요." },
  "l3": { artist: "Elena Vasquez", story: "우리의 정원에서 피어난 사랑. 이것이 영원할 거예요." },
};

export function getOverrideForArtwork(
  { id, section }: { id: string | number; section: string },
  overrides: Record<string, { artist?: string; story?: string }>
): { artist?: string; story?: string } | null {
  const key = String(id);
  return overrides[key] ?? null;
}

export default STORY_OVERRIDE_BY_ID;
