import React from "react";
import { ArtPiece } from "../types";

interface Props {
  art: ArtPiece;
  onClick: (a: ArtPiece) => void;
}

const ArtCard: React.FC<Props> = ({ art, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(art)}
      className="group w-full text-left cursor-pointer space-y-4"
      aria-label={`Open ${((art as any).title ?? "art") as string}`}
    >
      <div className="aspect-[4/5] overflow-hidden bg-slate-100 rounded-sm shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-2">
        <img
          src={art.thumbnail}
          alt={(art as any).title ?? ""}
          className="h-full w-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
        />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-medium text-slate-900 playfair">
          {(art as any).title ?? ""}
        </h3>
        <p className="text-sm text-slate-500 font-light uppercase tracking-widest">
          • {art.artist}
        </p>
      </div>
    </button>
  );
};

export default ArtCard;
