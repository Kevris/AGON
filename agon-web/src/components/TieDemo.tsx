import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Leg = { home: number; away: number } | null;

function randomScore(): [number, number] {
  const a = Math.floor(Math.random() * 4);
  const b = Math.floor(Math.random() * 4);
  return [a, b];
}

const TEAM_A = "Norte FC";
const TEAM_B = "Cuadro Sur";

export default function TieDemo() {
  const [leg1, setLeg1] = useState<Leg>(null);
  const [leg2, setLeg2] = useState<Leg>(null);

  const aggA = (leg1?.home ?? 0) + (leg2?.away ?? 0);
  const aggB = (leg1?.away ?? 0) + (leg2?.home ?? 0);

  const status = !leg1 ? "pending" : !leg2 ? "first_leg_done" : "resolved";
  const winner = status === "resolved" ? (aggA === aggB ? "empate" : aggA > aggB ? TEAM_A : TEAM_B) : null;

  const playLeg1 = () => {
    const [h, a] = randomScore();
    setLeg1({ home: h, away: a });
    setLeg2(null);
  };
  const playLeg2 = () => {
    const [h, a] = randomScore();
    setLeg2({ home: h, away: a });
  };
  const reset = () => {
    setLeg1(null);
    setLeg2(null);
  };

  const statusLabel = {
    pending: "pendiente",
    first_leg_done: "ida jugada",
    resolved: "resuelto",
  }[status];

  return (
    <div className="rounded-md border border-chalk/10 bg-turf-2/60 p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-chalk-dim">Tie · cuartos de final</span>
        <span
          className={`font-mono text-xs rounded-full px-3 py-1 ${
            status === "resolved"
              ? "bg-flood/15 text-flood"
              : status === "first_leg_done"
                ? "bg-card/15 text-card"
                : "bg-chalk/10 text-chalk-dim"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="flex items-center justify-between font-display text-xl text-chalk sm:text-2xl">
        <span className={winner === TEAM_A ? "text-flood" : ""}>{TEAM_A}</span>
        <span className="font-mono text-sm text-chalk-dim">vs</span>
        <span className={winner === TEAM_B ? "text-flood" : ""}>{TEAM_B}</span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-sm border border-chalk/10 p-4 text-center">
          <p className="font-mono text-[11px] uppercase tracking-wider text-chalk-dim">Ida</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={leg1 ? `${leg1.home}-${leg1.away}` : "empty"}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-1 font-display text-2xl text-chalk"
            >
              {leg1 ? `${leg1.home} – ${leg1.away}` : "— · —"}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="rounded-sm border border-chalk/10 p-4 text-center">
          <p className="font-mono text-[11px] uppercase tracking-wider text-chalk-dim">Vuelta</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={leg2 ? `${leg2.home}-${leg2.away}` : "empty"}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-1 font-display text-2xl text-chalk"
            >
              {leg2 ? `${leg2.home} – ${leg2.away}` : "— · —"}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-chalk/10 pt-4">
        <span className="font-mono text-xs text-chalk-dim">agregado</span>
        <span className="font-display text-lg text-chalk">{aggA} – {aggB}</span>
      </div>

      <AnimatePresence>
        {winner && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 text-sm text-flood"
          >
            {winner === "empate" ? "Agregado igualado — define el reglamento de la competencia." : `${winner} avanza de ronda.`}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          data-magnetic
          onClick={playLeg1}
          disabled={status !== "pending"}
          className="rounded-sm bg-chalk px-4 py-2 text-sm font-medium text-turf transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        >
          Jugar ida
        </button>
        <button
          data-magnetic
          onClick={playLeg2}
          disabled={status !== "first_leg_done"}
          className="rounded-sm border border-chalk/25 px-4 py-2 text-sm font-medium text-chalk transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        >
          Jugar vuelta
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
