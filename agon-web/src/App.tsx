import { useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Architecture from "./components/Architecture";
import Principles from "./components/Principles";
import Roadmap from "./components/Roadmap";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import CustomCursor from "./components/CustomCursor";
import Grain from "./components/Grain";
import { useSmoothScroll } from "./lib/smoothScroll";

export default function App() {
  const [ready, setReady] = useState(false);
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-turf text-chalk-dim">
      <Preloader onDone={() => setReady(true)} />
      <CustomCursor />
      <Grain />
      <div style={{ opacity: ready ? 1 : 0, transition: "opacity .4s" }}>
        <Nav />
        <Hero />
        <HowItWorks />
        <Architecture />
        <Principles />
        <Roadmap />
        <Footer />
      </div>
    </div>
  );
}
