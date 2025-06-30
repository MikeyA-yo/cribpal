import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { Engine } from "@tsparticles/engine";
import { loadFull } from "tsparticles";

const BlueParticlesBg = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadFull(engine);
    }).then(() => setInit(true));
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="blue-particles-bg"
      options={{
        fullScreen: { enable: false },
        background: { color: "transparent" },
        style: {
          position: "fixed",
          top: "0",
          left: "0",
          width: "100vw",
          height: "100vh",
          zIndex: "0",
          pointerEvents: "none",
        },
        particles: {
          number: { value: 100, density: { enable: true } },
          color: { value: "#000099" },
          shape: { type: "circle" },
          opacity: { value: 0.48 },
          size: { value: 2 },
          move: {
            enable: true,
            speed: 0.8,
            direction: "none",
            random: true,
            straight: false,
            outModes: { default: "out" },
          },
          links: { enable: false },
        },
        detectRetina: true,
      }}
    />
  );
};

export default BlueParticlesBg; 