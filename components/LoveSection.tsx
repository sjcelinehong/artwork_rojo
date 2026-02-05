import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { ArtPiece } from "../types";
import STORY_OVERRIDE_BY_ID, { getOverrideForArtwork } from "../constants/overrides";

type DialogueItem = { text: string };

// inView
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, options);

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}

const Typewriter: React.FC<{
  text: string;
  speed?: number;
  start?: boolean;
  completed?: boolean;
  onDone?: () => void;
}> = ({ text, speed = 18, start = true, completed = false, onDone }) => {
  const [displayedText, setDisplayedText] = useState("");
  const timerRef = useRef<number | null>(null);
  const typingRef = useRef(false);
  const doneCalledRef = useRef(false);
  const prevTextRef = useRef<string>("");
  const displayedRef = useRef<string>("");

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    typingRef.current = false;
  };

  // displayedText 동기화(렌더용 state + 로직용 ref 분리)
  useEffect(() => {
    displayedRef.current = displayedText;
  }, [displayedText]);

  useEffect(() => {
    const prevText = prevTextRef.current;
    const textChanged = prevText !== text;

    // 완료 상태면 즉시 전체 출력 + 중단
    if (completed) {
      clearTimer();
      setDisplayedText(text);
      displayedRef.current = text;
      prevTextRef.current = text;
      doneCalledRef.current = true;
      return;
    }

    // start=false면 타이핑 시작하지 않음
    if (!start) {
      if (textChanged) {
        clearTimer();
        setDisplayedText("");
        displayedRef.current = "";
        prevTextRef.current = text;
        doneCalledRef.current = false;
      }
      return;
    }

    // start=true + completed=false
    if (textChanged) {
      clearTimer();
      setDisplayedText("");
      displayedRef.current = "";
      prevTextRef.current = text;
      doneCalledRef.current = false;
    }

    // 이미 타이핑 중이면 유지(재시작 방지)
    if (typingRef.current && !textChanged) return;

    // 이미 끝까지 출력된 경우 onDone 보장
    if (displayedRef.current === text && text.length > 0) {
      if (!doneCalledRef.current) {
        doneCalledRef.current = true;
        onDone?.();
      }
      return;
    }

    doneCalledRef.current = false;
    typingRef.current = true;

    timerRef.current = window.setInterval(() => {
      setDisplayedText((prev) => {
        const nextIndex = prev.length;
        if (nextIndex < text.length) return prev + text.charAt(nextIndex);

        clearTimer();
        if (!doneCalledRef.current) {
          doneCalledRef.current = true;
          onDone?.();
        }
        return prev;
      });
    }, speed);

    return () => clearTimer();
    // ✅ displayedText를 deps에서 제거 (핵심)
  }, [text, speed, start, completed, onDone]);

  return (
    <>
      {displayedText}
      {start && !completed && <span className="inline-block ml-0.5 animate-pulse opacity-70">▍</span>}
    </>
  );
};

type BubbleLineProps = {
  text: string;
  lineIdx: number;
  phase: "done" | "active";
  onDone: () => void;
};

const BubbleLine: React.FC<BubbleLineProps> = ({ text, lineIdx, phase, onDone }) => {
  const isLeft = lineIdx % 3 !== 1;

  const bubbleClass = isLeft
    ? "bg-white text-slate-800 rounded-bl-none shadow-sm border border-slate-100"
    : "bg-blue-600 text-white rounded-br-none shadow-md";

  return (
    <div className={`flex ${isLeft ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom duration-500`}>
      <div
        className={[
          "max-w-[720px] w-fit",
          "relative px-6 py-4 md:px-7 md:py-5",
          "rounded-3xl text-lg md:text-xl font-light leading-relaxed whitespace-pre-wrap",
          bubbleClass,
        ].join(" ")}
      >
        <span className="opacity-80">&quot;</span>
        {phase === "done" ? (
          <>{text}</>
        ) : (
          <Typewriter text={text} speed={80} start={true} completed={false} onDone={onDone} />
        )}
        <span className="opacity-80">&quot;</span>
      </div>
    </div>
  );
};

type LoveBubbleItemProps = {
  art: ArtPiece & { dialogue?: DialogueItem[] };
  idx: number;
  isActiveArtwork: boolean;
  doneArtwork: boolean;
  onClick: () => void;
  onArtworkDone: () => void;
};

const LoveBubbleItem: React.FC<LoveBubbleItemProps> = ({
  art,
  idx,
  isActiveArtwork,
  doneArtwork,
  onClick,
  onArtworkDone,
}) => {
  const inViewOptions = useMemo(() => ({ threshold: 0.25 }), []);
  const { ref, inView } = useInView(inViewOptions);

  const canStartArtwork = inView && isActiveArtwork && !doneArtwork;

  const anyArt = art as any;
  const dialogue: DialogueItem[] =
    (art.dialogue && art.dialogue.length > 0
      ? art.dialogue
      : anyArt.story
      ? [{ text: String(anyArt.story) }]
      : []) as DialogueItem[];

  const [activeLineIdx, setActiveLineIdx] = useState(0);
  const [doneLines, setDoneLines] = useState<Set<number>>(new Set());

  useEffect(() => {
    setActiveLineIdx(0);
    setDoneLines(new Set());
  }, [art.id]);

  useEffect(() => {
    if (!dialogue.length) return;
    if (doneArtwork) return;
    if (doneLines.size >= dialogue.length) onArtworkDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doneLines, dialogue.length, doneArtwork]);

  const handleLineDone = useCallback((lineIdx: number) => {
    setDoneLines((prev) => {
      const next = new Set(prev);
      next.add(lineIdx);
      return next;
    });
    setActiveLineIdx((prev) => (prev === lineIdx ? prev + 1 : prev));
  }, []);

  const isLeftArtwork = idx % 2 === 0;

  const visibleCount = doneArtwork
    ? dialogue.length
    : canStartArtwork
    ? Math.min(activeLineIdx + 1, dialogue.length)
    : 0;

  return (
    <div
      ref={ref}
      className={`flex flex-col animate-in fade-in slide-in-from-bottom duration-1000 ${
        isLeftArtwork ? "items-start" : "items-end"
      }`}
      style={{ animationDelay: `${idx * 150}ms` }}
    >
      <div className="w-full max-w-3xl">
        <div className={`flex items-start gap-4 ${isLeftArtwork ? "flex-row" : "flex-row-reverse"}`}>
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 shadow-sm">
            <img src={art.thumbnail} className="w-full h-full object-cover" alt="" />
          </div>
          <div className={`flex-grow ${isLeftArtwork ? "text-left" : "text-right"}`}>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{art.artist}</div>
            {art.description && (
              <div className="mt-2 text-sm text-slate-500 font-light leading-tight">{art.description}</div>
            )}
          </div>
        </div>

              <div className={`flex mt-4 ${isLeftArtwork ? "justify-start" : "justify-end"}`}>
                <div onClick={onClick} className="cursor-pointer">
                  <div className="space-y-4">
                    {!doneArtwork && isActiveArtwork && !inView && (
                      <div className="text-[11px] text-slate-400 font-light">스크롤하여 대화를 시작해요.</div>
                    )}
        
                    {dialogue.slice(0, visibleCount).map((line, lineIdx) => {
                      const isDone = doneArtwork ? true : doneLines.has(lineIdx);
                      return (
                        <BubbleLine
                          key={`${art.id}-${lineIdx}`}
                          text={line.text}
                          lineIdx={lineIdx}
                          phase={isDone ? "done" : "active"}
                          onDone={() => handleLineDone(lineIdx)}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>      </div>
    </div>
  );
};

function toDialogueFromOverrideStory(story?: string): DialogueItem[] {
  if (!story) return [];
  return String(story)
    .split(/\n+/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((text) => ({ text }));
}

export default function LoveSection({
  artworks,
  onOpenDetail,
}: {
  artworks: ArtPiece[];
  onOpenDetail: (art: ArtPiece) => void;
}) {
  const allArtworks = useMemo(() => artworks, [artworks]);
  const [overrides] = useState<Record<string, { artist?: string; story?: string }>>(STORY_OVERRIDE_BY_ID);

  const [activeArtworkIdx, setActiveArtworkIdx] = useState(0);
  const [doneArtworks, setDoneArtworks] = useState<Set<number>>(new Set());

  useEffect(() => {
    setActiveArtworkIdx(0);
    setDoneArtworks(new Set());
  }, [allArtworks.length]);

  const loveArt = useMemo(() => {
    return allArtworks.map((a) => {
      const override = getOverrideForArtwork({ id: a.id, section: a.section }, overrides);

      const baseDialogue: DialogueItem[] = (a as any).dialogue ?? [];
      const baseStory: string | null = (a as any).story != null ? String((a as any).story) : null;

      const derivedDialogue: DialogueItem[] =
        baseDialogue.length > 0
          ? baseDialogue
              .map((d: any) => ({ text: String(d.text ?? "") }))
              .filter((d: DialogueItem) => d.text.trim())
          : baseStory
          ? [{ text: baseStory }]
          : [];

      const overriddenDialogue = override?.story ? toDialogueFromOverrideStory(override.story) : derivedDialogue;

      return {
        ...(a as any),
        artist: override?.artist ?? a.artist,
        dialogue: overriddenDialogue,
      } as ArtPiece & { dialogue?: DialogueItem[] };
    });
  }, [allArtworks, overrides]);

  return (
    <div className="max-w-3xl mx-auto space-y-16">
      {loveArt.map((art, idx) => {
        const doneArtwork = doneArtworks.has(idx);
        const isActiveArtwork = idx === activeArtworkIdx;

        return (
          <LoveBubbleItem
            key={art.id}
            art={art}
            idx={idx}
            isActiveArtwork={isActiveArtwork}
            doneArtwork={doneArtwork}
            onClick={() => onOpenDetail(art)}
            onArtworkDone={() => {
              setDoneArtworks((prev) => {
                const next = new Set(prev);
                next.add(idx);
                return next;
              });
              setActiveArtworkIdx((prev) => (prev === idx ? prev + 1 : prev));
            }}
          />
        );
      })}
    </div>
  );
}
