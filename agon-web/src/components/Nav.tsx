import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { scrollToHash } from "../lib/smoothScroll";

const links = [
  { href: "#origen", label: "Origen" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#principios", label: "Principios" },
  { href: "#estado", label: "Estado" },
];

export default function Nav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter((el): el is HTMLElement => !!el);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const go = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToHash(hash);
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 backdrop-blur-sm">
      <a
        href="#top"
        onClick={go("#top")}
        data-magnetic
        className="font-display text-lg font-bold tracking-tight text-chalk"
      >
        AGON
      </a>
      <div className="hidden gap-8 text-sm text-chalk-dim sm:flex">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={go(l.href)}
            data-magnetic
            className={`relative pb-1 transition-colors ${active === l.href ? "text-chalk" : "hover:text-chalk"}`}
          >
            {l.label}
            {active === l.href && (
              <motion.span
                layoutId="nav-underline"
                className="absolute -bottom-0.5 left-0 right-0 h-px bg-flood"
                transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              />
            )}
          </a>
        ))}
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
