import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(false);
      onDone();
      return;
    }
    const start = performance.now();
    const duration = 1400;
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setPct(Math.round(t * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        setTimeout(() => {
          setVisible(false);
          document.body.style.overflow = "";
          onDone();
        }, 220);
      }
    };
    raf = requestAnimationFrame(tick);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-turf"
        >
          <svg width="140" height="90" viewBox="0 0 140 90" fill="none">
            <motion.path
              d="M4 8 L64 45 L4 82"
              stroke="#e2a83f"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: pct / 100 }}
              transition={{ ease: "linear", duration: 0 }}
            />
            <motion.path
              d="M136 8 L76 45 L136 82"
              stroke="#e2a83f"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: pct / 100 }}
              transition={{ ease: "linear", duration: 0 }}
            />
          </svg>
          <p className="mt-6 font-mono text-xs text-chalk-dim">{pct}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
