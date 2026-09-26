import { motion } from "framer-motion";
import Ambient from "./Ambient";

const letters = "AGON".split("");

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <Ambient />

      <div className="relative">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 font-mono text-xs tracking-[0.2em] text-flood-ink"
        >
          ἀγών · el certamen
        </motion.p>

        <h1 className="flex select-none justify-center font-display text-[18vw] font-extrabold leading-[0.82] text-chalk sm:text-[13rem]">
          {letters.map((l, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 60, rotateX: 40 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.7, delay: 0.25 + i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ display: "inline-block", transformOrigin: "bottom" }}
            >
              {l}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mx-auto mt-8 max-w-md text-balance text-lg text-chalk-dim"
        >
          Una plataforma para llevar cualquier liga de Haxball de principio a fin:
          plantillas, mercado, competencias y estadísticas, desde un solo bot.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#como-funciona"
            data-magnetic
            className="rounded-sm bg-chalk px-6 py-3 text-sm font-medium text-turf transition-transform hover:-translate-y-0.5"
          >
            Cómo funciona
          </a>
          <a
            href="https://github.com/Kevris/AGON"
            target="_blank"
            rel="noopener"
            data-magnetic
            className="rounded-sm border border-chalk/25 px-6 py-3 text-sm font-medium text-chalk transition-colors hover:border-flood hover:text-flood"
          >
            Ver el código
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 h-10 w-px bg-gradient-to-b from-chalk/40 to-transparent"
      />
    </section>
  );
}
