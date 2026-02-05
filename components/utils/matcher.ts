// src/utils/matcher.ts

export type OverrideValue = { artist?: string; story?: string };
export type OverrideMap = Record<string, OverrideValue>;

export type ArtworkLike = {
  id: string | number;
  section?: string | null;
};

function normalizeKey(key: string) {
  return key.trim().toLowerCase();
}

function sectionPrefix(section?: string | null) {
  const s = String(section ?? "").trim().toLowerCase();
  if (s === "love") return "l";
  if (s === "novel") return "n";
  if (s === "art") return "a";
  return "";
}

function digitsOnly(str: string) {
  const m = str.match(/\d+/g);
  return m ? m.join("") : "";
}

/**
 * overrides에서 특정 artwork에 해당하는 override key를 찾아준다.
 *
 * 매칭 우선순위:
 * 1) String(id) 그대로
 * 2) 특수문자 제거한 id
 * 3) sectionPrefix + id / sectionPrefix + digits
 * 4) 일반 prefix(l/n/a) + id / + digits
 * 5) digits 단독
 * 6) 느슨 매칭 (끝이 digits로 끝나는 키 등)
 */
export function findOverrideKeyForArtwork(
  artwork: ArtworkLike,
  overrides: OverrideMap
): string | null {
  const overrideKeys = Object.keys(overrides);
  if (overrideKeys.length === 0) return null;

  const keySet = new Set(overrideKeys.map(normalizeKey));

  const rawId = String(artwork.id);
  const id = normalizeKey(rawId);
  const alnum = id.replace(/[^a-z0-9]/g, "");
  const digits = digitsOnly(id);
  const pref = sectionPrefix(artwork.section);

  const candidates: string[] = [];

  // 1) id 그대로
  candidates.push(id);

  // 2) 특수문자 제거
  if (alnum && alnum !== id) candidates.push(alnum);

  // 3) 섹션 prefix 기반
  if (pref) {
    candidates.push(`${pref}${id}`);
    if (alnum) candidates.push(`${pref}${alnum}`);
    if (digits) candidates.push(`${pref}${digits}`);
  }

  // 4) 일반 prefix 조합
  for (const p of ["l", "n", "a"]) {
    candidates.push(`${p}${id}`);
    if (alnum) candidates.push(`${p}${alnum}`);
    if (digits) candidates.push(`${p}${digits}`);
  }

  // 5) digits 단독
  if (digits) candidates.push(digits);

  // 후보 중 첫 매칭
  const seen = new Set<string>();
  for (const c of candidates.map(normalizeKey)) {
    if (!c || seen.has(c)) continue;
    seen.add(c);
    if (keySet.has(c)) return c;
  }

  // 6) 느슨 매칭 (최후의 수단)
  // - digits가 있으면: endsWith(digits), `${pref}${digits}` 포함 등
  // - id가 들어있는 키 찾기
  const normKeys = overrideKeys.map((k) => normalizeKey(k));

  if (digits) {
    // 섹션 prefix + digits 우선
    if (pref) {
      const target = `${pref}${digits}`;
      const idx = normKeys.indexOf(target);
      if (idx >= 0) return normKeys[idx];
    }

    // digits로 끝나는 키
    for (const k of normKeys) {
      if (k.endsWith(digits)) return k;
    }
  }

  // id 포함
  for (const k of normKeys) {
    if (id && k.includes(id)) return k;
    if (alnum && k.includes(alnum)) return k;
  }

  return null;
}

/**
 * artwork에 대한 override 객체를 반환한다.
 * - 매칭 실패 시 undefined
 */
export function getOverrideForArtwork(
  artwork: ArtworkLike,
  overrides: OverrideMap
): OverrideValue | undefined {
  const key = findOverrideKeyForArtwork(artwork, overrides);
  if (!key) return undefined;

  // overrides 키는 원본 키로 접근해야 하므로 normalize 매핑 필요
  // (대소문자/공백 차이가 있는 키도 지원하기 위해)
  // 가장 안전: 원본 키를 찾는다.
  const originalKey = Object.keys(overrides).find(
    (k) => normalizeKey(k) === normalizeKey(key)
  );

  return originalKey ? overrides[originalKey] : overrides[key];
}
