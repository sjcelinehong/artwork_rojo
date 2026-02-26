import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { ArtPiece } from "../types"; // 경로는 네 프로젝트 구조에 맞게

type Props = {
  art: ArtPiece;
  onBack: () => void;
};

const ArtDetail: React.FC<Props> = ({ art, onBack }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // ✅ 원본 URL 우선, 없으면 thumbnail
  const imageSrc = useMemo(() => {
    // 네 ArtPiece 필드명에 맞춰 조정: image / fullImage / src 등
    const anyArt = art as any;
    return anyArt.image || anyArt.fullImage || anyArt.src || art.thumbnail;
  }, [art]);

  const openLightbox = () => setIsLightboxOpen(true);
  const closeLightbox = () => setIsLightboxOpen(false);

  // ✅ ESC 닫기 + 모달 열릴 때 body 스크롤 잠금
  useEffect(() => {
    if (!isLightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isLightboxOpen]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <button
        onClick={onBack}
        className="fixed top-6 right-6 z-20 flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-600 backdrop-blur-sm transition-colors hover:bg-white/80 hover:text-slate-800"
        aria-label="Go back"
      >
        <X className="h-4 w-4" />
        <span>Close</span>
      </button>

      <div className="grid md:grid-cols-2 md:gap-12 lg:gap-16">
        <div className="order-2 flex flex-col justify-center pt-8 md:order-1 md:pt-0">
          <div className="rounded-xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm lg:p-8">
            <h1 className="text-2xl font-bold text-slate-800 lg:text-3xl">{(art as any).title ?? "Untitled"}</h1>
            <h2 className="mt-1 text-lg font-light text-slate-600 lg:text-xl">{(art as any).artist ?? "Unknown Artist"}</h2>

            <div className="mt-4 font-mono text-xs text-slate-500">
              {(art as any).year && <span>{(art as any).year}</span>}
              {(art as any).medium && <span className="ml-4 border-l border-slate-300 pl-4">{(art as any).medium}</span>}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200/80">
              <p className="font-light leading-relaxed text-slate-700 whitespace-pre-wrap">{(art as any).subTitle || (art as any).story || "No subtitle available."}</p>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <button
            type="button"
            onClick={openLightbox}
            className="block w-full text-left"
            aria-label="Open image lightbox"
          >
            <img
              src={imageSrc}
              alt={(art as any).title ?? ""}
              className="h-auto w-full cursor-zoom-in rounded-xl shadow-lg"
            />
          </button>
        </div>
      </div>

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6">
            <div className="text-white/80 text-xs font-bold uppercase tracking-[0.25em]">
              Original Size
            </div>
            <button
              type="button"
              onClick={closeLightbox}
              className="text-white/90 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em]"
              aria-label="Close lightbox"
            >
              <X className="w-4 h-4" />
              Close
            </button>
          </div>

          <div className="absolute inset-0 pt-16 pb-8 px-6">
            <div className="w-full h-full overflow-auto rounded-xl border border-white/10 bg-black/30">
              <div className="p-6 flex justify-center">
                <img
                  src={imageSrc}
                  alt={(art as any).title ?? ""}
                  className="max-w-none h-auto select-none"
                  draggable={false}
                />
              </div>
            </div>

            <div className="mt-3 text-center text-white/60 text-[11px] font-medium">
              스크롤로 원본 크기를 탐색할 수 있어요 · ESC로 닫기
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtDetail;
