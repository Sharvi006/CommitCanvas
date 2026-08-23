import { useState } from "react";
import "./Playground.css";

function Playground() {
  const [started, setStarted] = useState(false);
  const [fading, setFading] = useState(false);

  const handlePlayClick = () => {
    setStarted(true);
    setFading(false);

    // Start fading out shattered cubes after 1.5 seconds
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 1500);

    // Trigger smooth auto-scroll to terminal section
    const scrollTimer = setTimeout(() => {
      const terminalElem = document.querySelector(".playground-main-grid");
      if (terminalElem) {
        terminalElem.scrollIntoView({ behavior: "smooth" });
      }
    }, 1200);

    // Reset state after fade out completes
    const resetTimer = setTimeout(() => {
      setStarted(false);
      setFading(false);
    }, 2700);
  };

  const handleScrollDown = () => {
    const terminalElem = document.querySelector(".playground-main-grid");
    if (terminalElem) {
      terminalElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const cubes = Array.from({ length: 100 }, (_, index) => ({
    id: index,

    left: Math.random() * 96,
    top: Math.random() * 92,

    size: Math.random() * 7 + 5,

    delay: Math.random() * 1.5,
    duration: Math.random() * 4 + 3,

    moveX: (Math.random() - 0.5) * 180,
    moveY: (Math.random() - 0.5) * 180,

    rotation: Math.random() * 360,
  }));

  return (
    <div className="playground-page">

      <div className={`playground-box ${started ? "game-started" : ""}`}>

        {/* LET'S PLAY & SCROLL DOWN */}
        {!started && (
          <div className="play-center-content">
            <button
              className="lets-play"
              onClick={handlePlayClick}
            >
              LET'S PLAY
            </button>

            <button 
              className="scroll-down-btn"
              onClick={handleScrollDown}
            >
              <span>SCROLL DOWN</span>
              <span className="arrow-icon">↓</span>
            </button>
          </div>
        )}

        {/* SHATTERED CUBES WITH AUTO-FADE */}
        {started && (
          <div className={`cube-area ${fading ? "fading-out" : ""}`}>

            {cubes.map((cube) => (
              <span
                key={cube.id}
                className="cube"
                style={{
                  left: `${cube.left}%`,
                  top: `${cube.top}%`,
                  width: `${cube.size}px`,
                  height: `${cube.size}px`,
                  animationDelay: `${cube.delay}s`,
                  animationDuration: `${cube.duration}s`,
                  "--move-x": `${cube.moveX}px`,
                  "--move-y": `${cube.moveY}px`,
                  "--rotation": `${cube.rotation}deg`,
                }}
              />
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Playground;
