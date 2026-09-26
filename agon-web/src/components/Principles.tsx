import { motion } from "framer-motion";
import Reveal from "./Reveal";

const principles = [
  { title: "Dominio separado del bot", body: "La lógica de bracket, tabla y transferencias no sabe que existe Discord. Se puede probar sin levantar el bot." },
  {
    title: "Un solo punto de verdad",
    body: "Cada pregunta se responde en un solo lugar, no en tres funciones ligeramente distintas. Que un jugador no metiera goles ni tarjetas no significa que no jugó: todo partido registra quién estuvo en la cancha, no solo quién hizo algo destacado.",
  },
  { title: "Reglas como datos", body: "Wildcards, tiempos de espera y desempates son configuración por competencia, no constantes en el código." },
  { title: "Diseñar para cambiar", body: "Ningún plan sobrevive al primer uso real. Se dejan costuras baratas donde algo puede crecer." },
];

export default function Principles() {
  return (
    <section id="principios" className="border-t border-chalk/10 px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal as="h2" className="max-w-lg font-display text-3xl font-bold text-chalk sm:text-4xl">
          Cuatro reglas para no repetir los errores de antes
        </Reveal>

        <div className="mt-16 divide-y divide-chalk/10 border-t border-chalk/10">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="grid gap-2 py-7 sm:grid-cols-[16rem_1fr] sm:gap-8"
            >
              <h3 className="font-display text-lg font-medium text-chalk">{p.title}</h3>
              <p className="max-w-xl text-sm text-chalk-dim sm:text-base">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
