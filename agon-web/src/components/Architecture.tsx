import { motion } from "framer-motion";

const stats = [
  { value: "26 → 20", label: "modelos del schema real, tras recortar lo que resolvía un cliente que no existe" },
  { value: "1", label: "proceso desplegado — el bot llama al dominio directo, sin HTTP de por medio" },
  { value: "0", label: "JWT, roles con scope o segundo servicio que operar en esta versión" },
];

const layers = [
  { name: "bot/", desc: "discord.js — comandos y eventos. Lo único que sabe que existe Discord." },
  { name: "domain/", desc: "Bracket, tabla, transferencias. Cero imports de discord.js — se prueba sin levantar el bot." },
  { name: "db/", desc: "Cliente de Prisma sobre Postgres gestionado (Supabase o Neon)." },
];

export default function Architecture() {
  return (
    <section className="border-t border-chalk/10 px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-lg font-display text-3xl font-bold text-chalk sm:text-4xl">
          Un proceso, no un enjambre de servicios
        </h2>
        <p className="mt-5 max-w-xl text-chalk-dim">
          La versión anterior murió de peso: tres clientes imaginarios pidiendo JWT,
          un servicio de autenticación y una capa de roles con alcance. Con un solo
          cliente real — el bot — nada de eso hace falta todavía.
        </p>

        <div className="mt-16 grid gap-3 sm:grid-cols-3">
          {layers.map((l, i) => (
            <motion.div
              key={l.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="border border-chalk/10 p-5"
            >
              <code className="font-mono text-sm text-flood">{l.name}</code>
              <p className="mt-2 text-sm text-chalk-dim">{l.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 grid gap-10 border-t border-chalk/10 pt-12 sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <p className="font-display text-4xl font-bold text-chalk">{s.value}</p>
              <p className="mt-2 text-sm text-chalk-dim">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
