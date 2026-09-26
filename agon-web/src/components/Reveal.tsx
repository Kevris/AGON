import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
};

/**
 * Splits text into words, each masked inside an overflow-hidden span, and
 * reveals them with a staggered upward slide the first time the element
 * scrolls into view. Falls back to a static, fully-visible render when the
 * user prefers reduced motion.
 */
export default function Reveal({ children, as = "h2", className = "" }: RevealProps) {
  const Tag = as as unknown as "h2";
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = el.querySelectorAll<HTMLElement>(".reveal-word");

    if (reduce) {
      words.forEach((w) => {
        w.style.opacity = "1";
        w.style.transform = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.045,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const words = children.split(" ");

  return (
    <Tag ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
          <span className="reveal-word" style={{ display: "inline-block", opacity: 0 }}>
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
