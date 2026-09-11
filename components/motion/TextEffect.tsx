"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

interface TextEffectProps {
  children: string;
  className?: string;
  delay?: number;
  per?: "word" | "char";
  as?: keyof React.JSX.IntrinsicElements;
}

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: delay,
    },
  }),
};

const defaultChildVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 24,
      stiffness: 300,
    },
  },
};

export function TextEffect({
  children,
  className = "",
  delay = 0,
  per = "word",
  as: Component = "span",
}: TextEffectProps) {
  const items = per === "word" ? children.split(" ") : Array.from(children);

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={defaultContainerVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={defaultChildVariants}
          className="inline-block"
        >
          {item}
          {per === "word" && index < items.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
