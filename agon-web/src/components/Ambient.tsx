export default function Ambient() {
  const embers = Array.from({ length: 14 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute left-1/2 top-[-20%] h-[140%] w-[140%] -translate-x-1/2 opacity-40"
        style={{
          background:
            "conic-gradient(from 200deg, transparent 0deg, rgba(226,168,63,0.16) 40deg, transparent 100deg, transparent 260deg, rgba(226,168,63,0.10) 300deg, transparent 340deg)",
          animation: "spin 26s linear infinite",
        }}
      />
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
        @keyframes spin { to { transform: translateX(-50%) rotate(360deg); } }
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
