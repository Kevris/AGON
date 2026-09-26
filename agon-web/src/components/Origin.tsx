import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import Reveal from "./Reveal";

type Stage = {
  id: string;
  accent: "v3" | "v4" | "agon";
  tag: string;
  title: string;
  body: string;
  chips: string[];
  messy?: boolean;
  quote?: string;
  stat?: { value: string; label: string };
  footnote?: string;
};

const stages: Stage[] = [
  {
    id: "v3",
    accent: "v3",
    tag: "V3 · en producción",
    title: "Ya funciona",
    body: "Un bot que lleva temporadas reales gestionando una liga: equipos, mercado, partidos, estadísticas. No es el problema — es de donde se parte.",
    chips: ["equipos", "mercado", "temporadas", "stats por partido"],
  },
  {
    id: "v4",
    accent: "v4",
    tag: "V4 · abandonada",
    title: "Un diseño para tres clientes que no existían",
    body: "El bot, un panel de árbitros y una web pública — cada uno con su propia idea de quién puede hacer qué. Eso es lo único que obliga a todo lo demás.",
    chips: [
      "PostgREST aparte",
      "JWT + OAuth2 de Discord",
      "BOT_SERVICE_SECRET",
      "UserRole con scope",
      "10 rutas de API",
      "655 líneas de schema",
    ],
    messy: true,
    quote: "Diez rutas de API escritas y ni un solo comando de bot.",
    stat: { value: "0", label: "comandos de bot para cuando se dejó el intento" },
    footnote:
      "apps/api nunca corrió prisma generate contra una base real — compiló limpio solo porque Prisma cayó a un stub any. Esa mitad nunca se validó de verdad.",
  },
  {
    id: "agon",
    accent: "agon",
    tag: "AGON · alcance recortado",
    title: "El mismo modelo, sin el peso alrededor",
    body: "Un cliente real hoy — el bot — resuelve permisos mirando roles de Discord en vivo, como ya hacía V3. Nada de JWT ni de un segundo servicio hasta que exista alguien que lo necesite.",
    chips: ["20 modelos", "1 proceso", "0 JWT", "17 tests heredados"],
    footnote:
      "Antes del primer comando: una temporada completa simulada contra el schema — equipos, jugadores, 56 partidos, tabla, campeón — para encontrar los huecos ahí, no en producción.",
  },
];

const accent = {
  v3: { text: "text-chalk-dim", border: "border-chalk/20", bg: "bg-chalk-dim", quoteBorder: "border-chalk/40" },
  v4: { text: "text-card", border: "border-card/40", bg: "bg-card", quoteBorder: "border-card/60" },
  agon: { text: "text-flood", border: "border-flood/50", bg: "bg-flood", quoteBorder: "border-flood/70" },
};

export default function Origin() {
  const markers = useRef<(HTMLDivElement | null)[]>([]);
  const chipsRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const container = chipsRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!container || reduce) return;

    const chips = container.querySelectorAll<HTMLElement>(".origin-chip");
    const messy = stages[active].messy;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chips,
        {
          opacity: 0,
          y: 14,
          scale: 0.92,
          rotate: () => (messy ? gsap.utils.random(-6, 6) : 0),
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: () => (messy ? gsap.utils.random(-3, 3) : 0),
          duration: 0.5,
          ease: "power3.out",
          stagger: messy ? 0.05 : 0.07,
        },
      );
    }, container);

    return () => ctx.revert();
  }, [active]);

  const stage = stages[active];
  const a = accent[stage.accent];

  return (
    <section id="origen" className="border-t border-chalk/10">
      <div className="mx-auto max-w-3xl px-6 pb-16 pt-28">
        <Reveal as="h2" className="font-display text-3xl font-bold text-chalk sm:text-4xl">
          De dónde viene esto
        </Reveal>
        <p className="mt-5 text-chalk-dim">
          No arranca de una pizarra en blanco. Antes de AGON hubo un bot que ya lleva temporadas
          reales gestionando una liga — y un primer intento de rediseño que se abandonó a medio
          camino. Ese intento no falló por mal modelo de datos: falló por construir para tres
          clientes distintos cuando solo existía uno real.
        </p>
      </div>

      <div className="relative" style={{ height: `${stages.length * 85}vh` }}>
        {stages.map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              markers.current[i] = el;
            }}
            className="absolute w-full"
            style={{ top: `${(i / stages.length) * 100}%`, height: `${100 / stages.length}%` }}
          />
        ))}

        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-6">
          <div className="mx-auto grid w-full max-w-5xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="min-h-[18rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <p className={`font-mono text-xs tracking-[0.15em] ${a.text}`}>{stage.tag}</p>
                  <h3 className="mt-3 font-display text-3xl font-bold text-chalk sm:text-4xl">
                    {stage.title}
                  </h3>
                  <p className="mt-4 max-w-md text-sm text-chalk-dim sm:text-base">{stage.body}</p>

                  {stage.quote && (
                    <p className={`mt-6 max-w-md border-l-2 ${a.quoteBorder} pl-4 font-display text-lg italic text-chalk`}>
                      "{stage.quote}"
                    </p>
                  )}

                  {stage.stat && (
                    <div className="mt-6 flex items-baseline gap-3">
                      <span className={`font-display text-4xl font-bold ${a.text}`}>{stage.stat.value}</span>
                      <span className="max-w-[16rem] text-xs text-chalk-dim">{stage.stat.label}</span>
                    </div>
                  )}

                  {stage.footnote && (
                    <p className="mt-6 max-w-md font-mono text-[11px] leading-relaxed text-chalk-dim/60">
                      {stage.footnote}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-10 flex gap-2">
                {stages.map((s, i) => (
                  <span
                    key={s.id}
                    className={`h-px flex-1 transition-colors duration-500 ${
                      i <= active ? accent[s.accent].bg : "bg-chalk/10"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div ref={chipsRef} className="relative flex min-h-[14rem] flex-wrap content-center gap-2.5">
              {stage.chips.map((c) => (
                <span
                  key={c}
                  className={`origin-chip rounded-full border px-3.5 py-1.5 font-mono text-[11px] ${a.border} ${a.text}`}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
