"use client";

import React from "react";
import { motion } from "framer-motion";

interface LeafProps {
  className?: string;
  style?: React.CSSProperties;
}

// Minimal elegant long fern frond SVG
export function LongFernLeaf({ className = "", style }: LeafProps) {
  return (
    <svg
      viewBox="0 0 180 720"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-auto h-full ${className}`}
      style={style}
    >
      {/* Central curving stem */}
      <path
        d="M90 720 C85 450 65 250 110 15"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Graceful paired fronds */}
      <path d="M88 640 C45 615 15 635 10 645 C45 605 85 625 88 640Z" fill="currentColor" opacity="0.85" />
      <path d="M90 625 C135 595 165 615 170 625 C135 585 95 610 90 625Z" fill="currentColor" opacity="0.85" />

      <path d="M86 570 C38 540 8 560 5 570 C42 530 83 555 86 570Z" fill="currentColor" opacity="0.9" />
      <path d="M90 550 C140 515 172 535 175 545 C138 505 95 535 90 550Z" fill="currentColor" opacity="0.9" />

      <path d="M84 495 C30 460 5 480 0 490 C36 445 81 480 84 495Z" fill="currentColor" />
      <path d="M89 475 C142 435 175 455 178 465 C138 425 94 460 89 475Z" fill="currentColor" />

      <path d="M83 420 C25 380 5 400 2 410 C34 365 80 405 83 420Z" fill="currentColor" />
      <path d="M89 400 C144 355 172 375 175 385 C138 345 93 385 89 400Z" fill="currentColor" />

      <path d="M83 345 C28 300 12 320 10 330 C38 285 80 330 83 345Z" fill="currentColor" />
      <path d="M90 325 C142 275 168 295 170 305 C136 265 94 310 90 325Z" fill="currentColor" />

      <path d="M84 270 C35 220 22 240 20 250 C44 208 81 255 84 270Z" fill="currentColor" />
      <path d="M92 250 C138 198 160 218 162 228 C132 190 96 235 92 250Z" fill="currentColor" />

      <path d="M87 195 C45 145 35 165 35 172 C54 135 84 180 87 195Z" fill="currentColor" />
      <path d="M95 175 C132 125 150 145 152 152 C125 118 98 160 95 175Z" fill="currentColor" />

      <path d="M92 125 C58 78 52 95 52 102 C66 70 89 110 92 125Z" fill="currentColor" />
      <path d="M99 105 C128 58 140 75 140 82 C118 52 101 92 99 105Z" fill="currentColor" />

      <path d="M98 62 C74 25 72 38 72 44 C82 20 95 48 98 62Z" fill="currentColor" />
      <path d="M104 45 C124 10 130 22 130 28 C115 8 106 35 104 45Z" fill="currentColor" />

      {/* Tapering Tip Leaf */}
      <path d="M110 15 C112 0 108 0 110 15Z" fill="currentColor" />
    </svg>
  );
}

// Sweeping long palm / tropical frond
export function LongPalmLeaf({ className = "", style }: LeafProps) {
  return (
    <svg
      viewBox="0 0 320 720"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-auto h-full ${className}`}
      style={style}
    >
      <path
        d="M20 720 C90 500 180 260 300 25"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Arching slender leaflets */}
      <path d="M45 650 Q150 540 250 575 Q135 510 52 630" fill="currentColor" opacity="0.8" />
      <path d="M72 565 Q180 455 285 485 Q160 425 80 545" fill="currentColor" opacity="0.85" />
      <path d="M105 480 Q210 370 305 390 Q185 340 112 460" fill="currentColor" opacity="0.9" />
      <path d="M138 395 Q238 285 315 295 Q208 260 148 375" fill="currentColor" />
      <path d="M175 310 Q260 200 312 205 Q225 180 182 290" fill="currentColor" />
      <path d="M212 225 Q282 120 305 120 Q238 108 220 208" fill="currentColor" />
      <path d="M250 140 Q298 55 302 50 Q258 48 255 128" fill="currentColor" />

      {/* Secondary softer inner foliage */}
      <path d="M68 590 Q22 530 5 555 Q35 520 72 570" fill="currentColor" opacity="0.65" />
      <path d="M96 510 Q42 450 20 475 Q55 438 102 490" fill="currentColor" opacity="0.7" />
      <path d="M126 430 Q68 365 45 390 Q80 352 132 410" fill="currentColor" opacity="0.75" />
      <path d="M160 350 Q98 282 75 302 Q110 270 168 330" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

// Side botanical watermark with motion primitives sway
export function BotanicalWatermark({
  variant = "left",
  className = "",
}: {
  variant?: "left" | "right";
  className?: string;
}) {
  const isRight = variant === "right";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-hidden absolute z-0 ${className}`}
    >
      <motion.div
        animate={{
          y: [0, -14, 0],
          rotate: isRight ? [0, -2, 0] : [0, 2, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`text-emerald-800/[0.07] transform ${
          isRight ? "scale-x-[-1]" : ""
        } filter drop-shadow-sm`}
      >
        <LongFernLeaf className="h-[480px] sm:h-[650px] lg:h-[820px]" />
      </motion.div>
    </div>
  );
}

// Side floating palm frond with motion
export function BotanicalPalmWatermark({
  side = "right",
  className = "",
}: {
  side?: "left" | "right";
  className?: string;
}) {
  const isRight = side === "right";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-hidden absolute z-0 ${className}`}
    >
      <motion.div
        animate={{
          y: [0, -18, 0],
          rotate: isRight ? [0, 2.5, 0] : [0, -2.5, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
        className={`text-emerald-900/[0.06] transform ${
          isRight ? "" : "scale-x-[-1]"
        }`}
      >
        <LongPalmLeaf className="h-[440px] sm:h-[600px] lg:h-[750px]" />
      </motion.div>
    </div>
  );
}

// Global Ambient Botanical Page Backdrop (Fills empty white space with minimal leafy shade prints)
export function BotanicalPageBackdrop() {
  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {/* Top Left Floating Frond */}
      <motion.div
        animate={{
          y: [0, -16, 0],
          rotate: [0, 1.8, 0],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-16 sm:-left-12 top-[35%] text-emerald-800/[0.055]"
      >
        <LongFernLeaf className="h-[600px] lg:h-[850px]" />
      </motion.div>

      {/* Mid Right Palm Frond */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, -2.2, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute -right-20 sm:-right-16 top-[55%] text-emerald-900/[0.05]"
      >
        <LongPalmLeaf className="h-[650px] lg:h-[900px]" />
      </motion.div>

      {/* Bottom Left Leaf Frond */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 2, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3.5,
        }}
        className="absolute -left-20 sm:-left-14 bottom-[10%] text-emerald-800/[0.055]"
      >
        <LongPalmLeaf className="h-[550px] lg:h-[800px] scale-x-[-1]" />
      </motion.div>
    </div>
  );
}
