export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 backdrop-blur-sm">
      <a href="#top" className="font-display text-lg font-bold tracking-tight text-chalk">
        AGON
      </a>
      <div className="hidden gap-8 text-sm text-chalk-dim sm:flex">
        <a href="#como-funciona" data-magnetic className="transition-colors hover:text-chalk">Cómo funciona</a>
        <a href="#principios" data-magnetic className="transition-colors hover:text-chalk">Principios</a>
        <a href="#estado" data-magnetic className="transition-colors hover:text-chalk">Estado</a>
      </div>
      <a
        href="https://github.com/Kevris/AGON"
        target="_blank"
        rel="noopener"
        data-magnetic
        className="text-sm text-chalk border-b border-chalk/30 pb-px transition-colors hover:border-flood hover:text-flood"
      >
        Código
      </a>
    </nav>
  );
}
