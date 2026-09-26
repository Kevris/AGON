import { motion } from "framer-motion";
import TieDemo from "./TieDemo";
import ModelJourney from "./ModelJourney";

export default function HowItWorks() {
  return (
    <section id="como-funciona">
      <div className="mx-auto max-w-3xl px-6 pt-28">
        <h2 className="font-display text-3xl font-bold text-chalk sm:text-4xl">
          Una liga de Haxball, de principio a fin
        </h2>
        <p className="mt-5 text-chalk-dim">
          AGON gestiona inscripciones, plantillas, fichajes, competencias y premios
          desde un solo bot de Discord. Está construida multi-liga desde el modelo:
          sumar una segunda liga el día de mañana es agregar una fila, no reescribir
          el sistema. Toma del fútbol real lo que ayuda a modelar una competencia y
          descarta lo que no aplica a una liga virtual — no hay estadios ni árbitros
          con carnet, la identidad vive en Discord.
        </p>
      </div>

      <div className="px-6">
        <ModelJourney />
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-28">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
          <div>
            <h3 className="font-display text-2xl font-bold text-chalk">Por qué Tie importa</h3>
            <p className="mt-4 text-sm text-chalk-dim">
              Sin una entidad propia para el cruce, "qué toca ahora en esta llave" se
              recalculaba en tres lugares distintos del bot — y se calculaba mal las
              tres veces. Con <code className="rounded bg-turf-2 px-1.5 py-0.5 font-mono text-chalk">Tie</code> como
              fila real, ese estado vive en un solo sitio: el bracket, el anuncio y el
              siguiente paso lo consultan, no lo adivinan.
            </p>
            <p className="mt-4 text-sm text-chalk-dim">
              Pruébalo: jugá la ida, jugá la vuelta, mirá cómo se resuelve el agregado.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <TieDemo />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
