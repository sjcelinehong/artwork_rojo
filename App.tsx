import React, { useEffect, useMemo, useState } from "react";
import { ArtPiece, Page, SectionType } from "./types";
import { ARTWORKS } from "./constants/index";
import GalleryBackground from "./components/GalleryBackground";
import ArtCard from "./components/ArtCard";
import ArtDetail from "./components/ArtDetail";
import { ArrowRight, ArrowLeft } from "lucide-react";
import LoveSection from "./components/LoveSection";

type NovelArtPiece = Extract<ArtPiece, { section: "Novel" }>;

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>("INDEX");
  const [selectedSection, setSelectedSection] = useState<SectionType | null>(null);
  const [selectedArt, setSelectedArt] = useState<ArtPiece | null>(null);

  // ✅ Novel 전용: 선택된 콘텐츠(풀스크린 모드) id
  const [novelSelectedId, setNovelSelectedId] = useState<string | null>(null);

  // 섹션 이동 시: Novel 풀스크린 상태 초기화 + ArtDetail 선택 초기화
  useEffect(() => {
    setNovelSelectedId(null);
    setSelectedArt(null);
  }, [selectedSection]);

  // ✅ 섹션 데이터
  const sectionArt = useMemo(() => {
    if (!selectedSection) return [];
    return ARTWORKS.filter((art) => art.section === selectedSection);
  }, [selectedSection]);

  const novelArt = useMemo(
    () => sectionArt.filter((art): art is NovelArtPiece => art.section === "Novel"),
    [sectionArt],
  );

  // ✅ Novel 풀스크린에서 보여줄 단일 작품
  const selectedNovel = useMemo(() => {
    if (!novelSelectedId) return null;
    return novelArt.find((a) => String(a.id) === novelSelectedId) ?? null;
  }, [novelSelectedId, novelArt]);

  const navigateToIntro = () => setCurrentPage("INTRO");

  const navigateToSection = (section: SectionType) => {
    setSelectedSection(section);
    setCurrentPage("SECTION");
  };

  // Art/Love는 기존대로 DETAIL 사용
  const navigateToDetail = (art: ArtPiece) => {
    setSelectedArt(art);
    setCurrentPage("DETAIL");
  };

  // ✅ Back 정책:
  // - DETAIL이면 SECTION으로
  // - SECTION에서 Novel + 풀스크린이면: 목록으로(SECTION 유지, novelSelectedId만 null)
  // - 그 외 SECTION이면 INTRO로
  // - INTRO이면 INDEX로
  const goBack = () => {
    if (currentPage === "DETAIL") {
      setCurrentPage("SECTION");
      return;
    }

    if (currentPage === "SECTION") {
      if (selectedSection === "Novel" && novelSelectedId) {
        setNovelSelectedId(null);
        return;
      }
      setCurrentPage("INTRO");
      return;
    }

    if (currentPage === "INTRO") {
      setCurrentPage("INDEX");
      return;
    }
  };

  return (
    <div className="min-h-screen relative font-sans text-slate-900 bg-[#fdfcfb] selection:bg-blue-100">
      <GalleryBackground />

      {/* Navigation Header */}
      {currentPage !== "INDEX" && (
        <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between bg-white/40 backdrop-blur-md border-b border-slate-100">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentPage("INDEX")}
          >
            <span className="text-xl font-bold playfair tracking-tight text-slate-900">
              THE CANVAS OF <span className="text-red-600 italic">LOVE</span>
            </span>
          </div>

          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              <button
                onClick={() => setCurrentPage("INTRO")}
                className="hover:text-blue-600 transition-colors"
              >
                Portals
              </button>
              <button
                onClick={() => setCurrentPage("INDEX")}
                className="hover:text-blue-600 transition-colors"
              >
                Exhibition
              </button>
            </nav>

            {currentPage !== "INTRO" && (
              <button
                onClick={goBack}
                className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-900 border-b border-slate-900 flex items-center gap-2"
              >
                <ArrowLeft className="w-3 h-3" /> Back
              </button>
            )}
          </div>
        </header>
      )}

      <main className="relative z-10">
        {/* PAGE 1: INDEX */}
        {currentPage === "INDEX" && (
          <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black">
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1541450805268-4822a3a774ca?auto=format&fit=crop&q=100&w=2000"
                className="w-full h-full object-cover opacity-80 mix-blend-normal transition-transform duration-[10s] hover:scale-105"
                alt="Watercolor Clouds Landscape"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
            </div>

            <div className="relative z-10 text-center space-y-12 max-w-5xl px-6">
              <div className="space-y-4">
                <span className="block text-xs font-bold tracking-[0.5em] text-white/50 uppercase animate-in fade-in slide-in-from-top duration-1000">
                  A Digital Exhibition
                </span>
                <h1 className="text-7xl md:text-9xl font-bold playfair text-white tracking-tighter leading-none animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
                  The Canvas of <br />{" "}
                  <span className="text-blue-400 italic font-light">Love</span>
                </h1>
              </div>

              <button
                onClick={navigateToIntro}
                className="group relative px-16 py-6 bg-white text-black text-xs font-bold uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-105 active:scale-95 animate-in fade-in duration-1000 delay-500"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Discover the Work{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-blue-100 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
              </button>
            </div>
          </div>
        )}

        {/* PAGE 2: INTRO */}
        {currentPage === "INTRO" && (
          <div className="max-w-7xl mx-auto px-8 py-40 min-h-screen flex flex-col justify-center">
            <div className="mb-24 text-center space-y-4">
              <h2 className="text-5xl md:text-8xl font-bold playfair text-slate-900 tracking-tight">
                Expressions of{" "}
                <span className="italic text-blue-600 font-light underline decoration-blue-100 underline-offset-8">
                  Love
                </span>
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto text-lg font-light">
                Enter one of our curated emotional archives. Each represents a distinct narrative path.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  id: "Novel",
                  image:
                    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800",
                  subTitle: "Explorations of human connection and heart.",
                },
                {
                  id: "Art",
                  image:
                    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
                  subTitle: "Stories caught in the ink of imagination.",
                },
                {
                  id: "Love",
                  image:
                    "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=800",
                  subTitle: "The pure expression of form and color.",
                },
              ].map((cat, i) => (
                <div
                  key={cat.id}
                  onClick={() => navigateToSection(cat.id as SectionType)}
                  className="group cursor-pointer space-y-8 animate-in fade-in slide-in-from-bottom duration-1000"
                  style={{ animationDelay: `${i * 200}ms` }}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-slate-100 rounded-sm relative shadow-sm group-hover:shadow-2xl transition-all duration-700">
                    <img
                      src={cat.image}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      alt={cat.id}
                    />
                    <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors duration-700" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold playfair text-slate-900">{cat.id}</h3>
                    <p className="text-slate-500 font-light leading-relaxed">{cat.subTitle}</p>
                    <div className="pt-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                      Enter Gallery{" "}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 3: SECTION */}
        {currentPage === "SECTION" && (
          <div className="max-w-7xl mx-auto px-8 py-40">
            {/* ✅ Novel 풀스크린일 때는 헤더(섹션 타이틀 영역)를 간소화 */}
            {!(selectedSection === "Novel" && novelSelectedId && selectedNovel) && (
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 border-b border-slate-100 pb-12 animate-in fade-in duration-1000">
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-[0.4em] text-blue-600">
                    Curated Archive
                  </span>
                  <h2 className="text-7xl font-bold playfair text-slate-900">
                    {selectedSection}
                  </h2>
                </div>
                <div className="text-slate-400 font-light italic text-lg max-w-sm">
                  "Capturing the essence of {selectedSection?.toLowerCase()} through the lens of modern and classic techniques."
                </div>
              </div>
            )}

            {/* ✅ Love */}
            {selectedSection === "Love" ? (
              <LoveSection artworks={sectionArt} onOpenDetail={navigateToDetail} />
            ) : selectedSection === "Novel" ? (
              <>
                {/* ✅ Novel: 목록 */}
                {!novelSelectedId && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
                    {novelArt.map((art, idx) => (
                      <div
                        key={art.id}
                        className="animate-in fade-in slide-in-from-bottom duration-1000"
                        style={{ animationDelay: `${idx * 150}ms` }}
                      >
                        <ArtCard
                          art={art}
                          onClick={(a) => setNovelSelectedId(String(a.id))}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* ✅ Novel: 풀스크린 콘텐츠 뷰 */}
                {novelSelectedId && selectedNovel && (
                  <div className="min-h-[calc(100vh-160px)]">
                    <button
                      type="button"
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="fixed bottom-8 right-8 z-[60] px-5 py-3 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.25em] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition"
                      aria-label="Scroll to top"
                    >
                      Top
                    </button>

                    {/* 상단 타이틀/메타 */}
                    <div className="mb-10">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {selectedNovel.artist}
                      </div>
                      <h2 className="text-5xl md:text-7xl font-bold playfair text-slate-900 mt-3">
                        {selectedNovel.title}
                      </h2>
                      {selectedNovel.subTitle && (
                        <p className="mt-4 text-slate-500 text-lg font-light max-w-3xl leading-relaxed">
                          {selectedNovel.subTitle}
                        </p>
                      )}
                    </div>

                    {/* ✅ 좌: 에세이 / 우: 정보 */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
                      <article className="text-slate-800 text-lg leading-relaxed whitespace-pre-wrap font-light">
                        {selectedNovel.story}
                      </article>

                      <aside className="lg:sticky lg:top-28 self-start rounded-3xl border border-slate-100 bg-white/70 backdrop-blur p-8">
                        <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                          Information
                        </div>

                        <div className="mt-6 space-y-4 text-sm text-slate-600">
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              Artist
                            </div>
                            <div className="mt-1">{selectedNovel.artist}</div>
                          </div>

                          {selectedNovel.subTitle && (
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                subTitle
                              </div>
                              <div className="mt-1 leading-relaxed">{selectedNovel.subTitle}</div>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setNovelSelectedId(null)}
                          className="mt-8 w-full text-[10px] uppercase tracking-[0.2em] font-bold text-slate-900 border border-slate-200 rounded-2xl py-3 hover:bg-white transition"
                        >
                          Back to List
                        </button>
                      </aside>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* ✅ Art */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
                {sectionArt.map((art, idx) => (
                  <div
                    key={art.id}
                    className="animate-in fade-in slide-in-from-bottom duration-1000"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <ArtCard art={art} onClick={navigateToDetail} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PAGE 4: DETAIL (Art/Love만 사용) */}
        {currentPage === "DETAIL" && selectedArt && (
          <ArtDetail art={selectedArt} onBack={goBack} />
        )}
      </main>

      {/* Footer */}
      {currentPage !== "INDEX" && (
        <footer className="py-20 border-t border-slate-100 mt-20 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">
            © 2026 All rights reserved by MAGIO (@rizza____)
          </p>
        </footer>
      )}
    </div>
  );
};

export default App;
