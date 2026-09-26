import { useEffect, useRef } from "react";

export default function Ambient() {
  const embers = Array.from({ length: 14 }, (_, i) => i);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFine || reduce) return;

    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      raf: number;

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 26;
      ty = (e.clientY / window.innerHeight - 0.5) * 26;
    };
    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(calc(-50% + ${cx}px), ${cy}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        ref={glowRef}
        className="absolute left-1/2 top-[-20%] h-[140%] w-[140%] opacity-40"
        style={{ transform: "translate(-50%, 0px)" }}
      >
        <div
          className="h-full w-full"
          style={{
            background:
              "conic-gradient(from 200deg, transparent 0deg, rgba(226,168,63,0.16) 40deg, transparent 100deg, transparent 260deg, rgba(226,168,63,0.10) 300deg, transparent 340deg)",
            animation: "spin 26s linear infinite",
          }}
        />
      </div>
      {embers.map((i) => {
        const left = (i * 7.3) % 100;
        const duration = 9 + (i % 5) * 2.4;
        const delay = -(i * 1.7);
        const size = i % 3 === 0 ? 3 : 2;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-flood/70"
            style={{
              left: `${left}%`,
              bottom: "-5%",
              width: size,
              height: size,
              filter: "blur(0.5px)",
              animation: `rise ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes rise {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: .8; }
          90% { opacity: .3; }
          100% { transform: translateY(-115vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
