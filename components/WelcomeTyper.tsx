"use client";

import { useEffect, useState } from "react";

/* "welcome" in 10 languages — types in, holds, deletes faster, repeats. */
const GREETINGS = [
  { text: "Welcome", lang: "English" },
  { text: "Bienvenue", lang: "French" },
  { text: "Bienvenido", lang: "Spanish" },
  { text: "Bem-vindo", lang: "Portuguese" },
  { text: "مرحبا", lang: "Arabic" },
  { text: "ようこそ", lang: "Japanese" },
  { text: "خوش آمدید", lang: "Persian" },
  { text: "Willkommen", lang: "German" },
  { text: "欢迎", lang: "Chinese" },
  { text: "환영합니다", lang: "Korean" },
];

const TYPE_MS = 95; // typing speed
const DELETE_MS = 45; // deleting is faster
const HOLD_MS = 2000; // stay fully typed for 2s

export default function WelcomeTyper({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "deleting">("typing");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const full = GREETINGS[index].text;

    // Reduced motion: show whole word, just rotate languages on a timer.
    if (reduced) {
      setText(full);
      const timer = setTimeout(
        () => setIndex((i) => (i + 1) % GREETINGS.length),
        HOLD_MS + 600
      );
      return () => clearTimeout(timer);
    }

    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text.length < full.length) {
        timer = setTimeout(() => setText(full.slice(0, text.length + 1)), TYPE_MS);
      } else {
        timer = setTimeout(() => setPhase("deleting"), HOLD_MS);
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(
          () => setText(full.slice(0, text.length - 1)),
          DELETE_MS
        );
      } else {
        setIndex((i) => (i + 1) % GREETINGS.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timer);
  }, [text, phase, index, reduced]);

  return (
    <span
      className={`inline-flex items-baseline gap-1 ${className ?? ""}`}
      aria-label="Welcome"
    >
      <span dir="auto" aria-hidden="true" className="text-gradient">
        {text}
      </span>
      <span className="caret" aria-hidden="true" />
    </span>
  );
}
