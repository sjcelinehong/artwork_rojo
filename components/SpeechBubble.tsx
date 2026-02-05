import React from "react";

type SpeechBubbleProps = {
  /** p 태그 안에 들어갈 텍스트 */
  text: string;
  /** 말풍선 꼬리 위치 */
  tail?: "left" | "right";
  /** 추가 클래스(크기/여백 등 커스텀용) */
  className?: string;
};

export default function SpeechBubble({
  text,
  tail = "left",
  className = "",
}: SpeechBubbleProps) {
  const tailPosition =
    tail === "left"
      ? "left-6 -translate-x-1/2"
      : "right-6 translate-x-1/2";

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Bubble */}
      <div className="rounded-2xl border border-blue-300 bg-white px-4 py-3 shadow-sm">
        <p className="text-sm text-gray-800">{text}</p>
      </div>

      {/* Tail */}
      <div
        className={`absolute -bottom-2 ${tailPosition} h-4 w-4 rotate-45 border border-blue-300 bg-white`}
        aria-hidden="true"
      />
      {/* Tail border overlap fix (선 두께 균일하게) */}
      <div
        className={`absolute -bottom-[7px] ${tailPosition} h-4 w-4 rotate-45 bg-white`}
        aria-hidden="true"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%)",
        }}
      />
    </div>
  );
}