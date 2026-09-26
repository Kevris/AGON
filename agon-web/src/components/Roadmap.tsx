import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const steps = [
  { status: "done" as const, title: "Schema v1", body: "Modelo completo en Prisma: liga, competencia, cruce, partido, mercado y auditoría." },
  { status: "wip" as const, title: "Dominio puro", body: "Generación de fixtures, tabla de posiciones y avance de cruces. Lógica probada, sin Discord de por medio." },
  { status: "todo" as const, title: "Bot de Discord", body: "Comandos de staff, jugadores y directores técnicos. Único cliente de esta versión." },
  { status: "wip" as const, title: "Sitio de presentación", body: "Esto que estás viendo. La web con datos reales de la liga sigue pospuesta hasta que el bot exista." },
];

const dot = { done: "bg-flood border-flood", wip: "bg-turf border-flood", todo: "bg-turf border-chalk/30" };

export default function Roadmap() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.4"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  return (
    <section id="estado" className="border-t border-chalk/10 px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-3xl font-bold text-chalk sm:text-4xl">Dónde está el proyecto hoy</h2>

        <div ref={ref} className="relative mt-16 pl-8">
          <div className="absolute left-[3px] top-1 h-[calc(100%-1rem)] w-px bg-chalk/10" />
          <motion.div
            style={{ scaleY, transformOrigin: "top" }}
            className="absolute left-[3px] top-1 h-[calc(100%-1rem)] w-px bg-flood"
          />
          <ul className="space-y-12">
            {steps.map((s) => (
              <li key={s.title} className="relative">
                <span className={`absolute -left-8 top-1.5 h-2 w-2 rounded-full border-2 ${dot[s.status]}`} />
                <h3 className="font-display text-lg font-medium text-chalk">{s.title}</h3>
                <p className="mt-1 max-w-md text-sm text-chalk-dim">{s.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
