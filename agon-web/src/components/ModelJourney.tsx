import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const steps = [
  { name: "League", note: "slug · discordGuildId", desc: "La liga. Techo de todo el sistema — hoy una fila, mañana una por comunidad." },
  { name: "Modality", note: "Futsal x4 · Real Soccer", desc: "Cada modalidad lleva sus propias temporadas, no al revés." },
  { name: "Team", note: "persistente", desc: "El club sobrevive al cambio de temporada; el plantel se ficha aparte." },
  { name: "Competition", note: "format · tier", desc: "Liga o copa según el formato; el tier resuelve las divisiones." },
  { name: "Tie", note: "nuevo en v1", desc: "El cruce a ida y vuelta como una sola entidad, no dos partidos sueltos." },
  { name: "MatchEvent", note: "inmutable", desc: "El acta del partido. Corregir un gol inserta un evento nuevo, nunca borra el anterior." },
];

export default function ModelJourney() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const markers = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = markers.current.findIndex((m) => m === e.target);
            if (i !== -1) setActive(i);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    markers.current.forEach((m) => m && obs.observe(m));
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="relative" style={{ height: `${steps.length * 70}vh` }}>
      {steps.map((_, i) => (
        <div
          key={i}
          ref={(el) => { markers.current[i] = el; }}
          className="absolute w-full"
          style={{ top: `${(i / steps.length) * 100}%`, height: `${100 / steps.length}%` }}
        />
      ))}

      <div className="sticky top-0 flex h-screen flex-col justify-center">
        <div className="grid gap-10 sm:grid-cols-[10rem_1fr]">
          <ol className="hidden gap-3 sm:flex sm:flex-col">
            {steps.map((s, i) => (
              <li
                key={s.name}
                className={`font-mono text-xs transition-colors ${i === active ? "text-flood" : "text-chalk-dim/50"}`}
              >
                {s.name}
              </li>
            ))}
          </ol>

          <div className="min-h-[10rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <p className="font-mono text-xs text-flood-ink">{steps[active].note}</p>
                <h3 className="mt-2 font-display text-5xl font-bold text-chalk sm:text-7xl">
                  {steps[active].name}
                </h3>
                <p className="mt-4 max-w-md text-chalk-dim">{steps[active].desc}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 h-px w-full max-w-md bg-chalk/10">
              <motion.div
                className="h-px bg-flood"
                animate={{ width: `${((active + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
