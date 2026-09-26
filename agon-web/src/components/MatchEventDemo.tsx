import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Ev = {
  id: number;
  team: "Norte FC" | "Cuadro Sur";
  minute: number;
  revertsId?: number;
};

const TEAM_A = "Norte FC";
const TEAM_B = "Cuadro Sur";

const initial: Ev[] = [
  { id: 1, team: TEAM_A, minute: 4 },
  { id: 2, team: TEAM_B, minute: 9 },
  { id: 3, team: TEAM_A, minute: 21 },
];

export default function MatchEventDemo() {
  const [events, setEvents] = useState<Ev[]>(initial);
  const [nextId, setNextId] = useState(4);

  const revertedIds = new Set(events.filter((e) => e.revertsId).map((e) => e.revertsId));
  const goals = events.filter((e) => !e.revertsId);
  const scoreA = goals.filter((e) => e.team === TEAM_A && !revertedIds.has(e.id)).length;
  const scoreB = goals.filter((e) => e.team === TEAM_B && !revertedIds.has(e.id)).length;

  const correctable = goals.find((e) => !revertedIds.has(e.id) && e.id === 2);

  const correct = (id: number) => {
    setEvents((prev) => [...prev, { id: nextId, team: goals.find((g) => g.id === id)!.team, minute: 0, revertsId: id }]);
    setNextId((n) => n + 1);
  };

  const reset = () => {
    setEvents(initial);
    setNextId(4);
  };

  return (
    <div className="rounded-md border border-chalk/10 bg-turf-2/60 p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-chalk-dim">MatchEvent · acta en vivo</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={`${scoreA}-${scoreB}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-lg text-chalk"
          >
            {TEAM_A.split(" ")[0]} {scoreA} – {scoreB} {TEAM_B.split(" ")[0]}
          </motion.span>
        </AnimatePresence>
      </div>

      <ol className="space-y-2">
        <AnimatePresence initial={false}>
          {events.map((e) => {
            const isRevert = !!e.revertsId;
            const target = isRevert ? events.find((x) => x.id === e.revertsId) : null;
            const isRevoked = revertedIds.has(e.id);
            return (
              <motion.li
                key={e.id}
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                className={`flex items-center justify-between rounded-sm border px-3.5 py-2.5 text-sm ${
                  isRevert
                    ? "border-flood/30 bg-flood/5 text-flood"
                    : isRevoked
                      ? "border-chalk/10 text-chalk-dim/50"
                      : "border-chalk/10 text-chalk"
                }`}
              >
                <span className={isRevoked ? "line-through decoration-chalk-dim/40" : ""}>
                  {isRevert
                    ? `event_reverted · anula el gol de ${target?.team} (min ${target?.minute})`
                    : `Gol · ${e.team} · min ${e.minute}`}
                </span>
                <span className="font-mono text-[10px] text-chalk-dim/60">#{e.id}</span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>

      <p className="mt-4 text-xs text-chalk-dim">
        Cada fila queda para siempre. Corregir no borra nada — agrega un evento que apunta al que anula, y el
        marcador arriba se recalcula sobre lo vigente.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          data-magnetic
          onClick={() => correctable && correct(correctable.id)}
          disabled={!correctable}
          className="rounded-sm bg-chalk px-4 py-2 text-sm font-medium text-turf transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        >
          Anular el gol del min 9
        </button>
        <button
          onClick={reset}
          className="ml-auto font-mono text-xs text-chalk-dim underline-offset-4 hover:text-chalk hover:underline"
        >
          reiniciar
        </button>
      </div>
    </div>
  );
}
