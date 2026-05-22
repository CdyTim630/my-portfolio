"use client";

import { useEffect, useState } from "react";

interface TypingHeadlineProps {
  words: string[];
  className?: string;
}

interface TypingState {
  index: number;
  text: string;
  deleting: boolean;
}

export default function TypingHeadline({ words, className = "" }: TypingHeadlineProps) {
  const [state, setState] = useState<TypingState>({ index: 0, text: "", deleting: false });

  useEffect(() => {
    if (!words.length) return;
    const current = words[state.index % words.length];

    let delay = state.deleting ? 38 : 65;
    let next: TypingState = state;

    if (!state.deleting && state.text === current) {
      delay = 1600;
      next = { ...state, deleting: true };
    } else if (state.deleting && state.text === "") {
      delay = 280;
      next = { index: (state.index + 1) % words.length, text: "", deleting: false };
    } else {
      next = {
        ...state,
        text: state.deleting
          ? current.slice(0, state.text.length - 1)
          : current.slice(0, state.text.length + 1),
      };
    }

    const t = setTimeout(() => setState(next), delay);
    return () => clearTimeout(t);
  }, [state, words]);

  return (
    <span className={className}>
      {state.text}
      <span className="animate-blink-caret align-baseline" aria-hidden />
    </span>
  );
}
