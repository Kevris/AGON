export default function Footer() {
  return (
    <footer className="border-t border-chalk/10 px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 text-sm">
        <span className="font-display font-medium text-chalk">AGON <span className="text-chalk-dim font-normal">— en desarrollo</span></span>
        <a
          href="https://github.com/Kevris/AGON"
          target="_blank"
          rel="noopener"
          data-magnetic
          className="text-chalk-dim underline-offset-4 hover:text-chalk hover:underline"
        >
          github.com/Kevris/AGON
        </a>
      </div>
    </footer>
  );
}
