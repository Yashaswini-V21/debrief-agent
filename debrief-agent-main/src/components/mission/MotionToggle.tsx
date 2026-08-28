import { useEffect, useState } from "react";
import { Sparkles, Zap } from "lucide-react";

const STORAGE_KEY = "debrief:reduce-motion";

function apply(reduced: boolean) {
  document.documentElement.classList.toggle("reduce-motion", reduced);
}

export function MotionToggle() {
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const initial = stored === null ? media.matches : stored === "true";
    setReduced(initial);
    apply(initial);

    const onChange = (event: MediaQueryListEvent) => {
      if (window.localStorage.getItem(STORAGE_KEY) !== null) return;
      setReduced(event.matches);
      apply(event.matches);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next = !reduced;
    setReduced(next);
    apply(next);
    window.localStorage.setItem(STORAGE_KEY, String(next));
  }

  const on = reduced === true;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Enable animations" : "Reduce animations"}
      title={on ? "Animations reduced — click to enable" : "Animations on — click to reduce"}
      className="press-btn inline-flex min-h-9 items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground hover:border-cyan/50 hover:text-cyan"
    >
      {on ? <Zap className="size-3.5" aria-hidden /> : <Sparkles className="size-3.5" aria-hidden />}
      <span>{on ? "Motion off" : "Motion on"}</span>
    </button>
  );
}
