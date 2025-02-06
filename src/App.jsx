/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

const COLORS = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#008000", "#FF1493"];

const IntroSequence = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timings = [1000, 2000, 3000];

    timings.forEach((timing, index) => {
      setTimeout(() => {
        setStep(index + 1);
      }, timing);
    });

    setTimeout(() => {
      onComplete();
    }, 4500);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-center">
        {step >= 1 && <div className={`text-6xl press-start-2p-regular text-yellow-400 mb-8 ${step === 1 ? "scale-in" : ""}`}>WELCOME TO</div>}

        {step >= 2 && <div className={`text-8xl press-start-2p-regular text-green-400 mb-8 ${step === 2 ? "scale-in" : ""}`}>COLOR QUEST</div>}

        {step >= 3 && <div className={`text-xl press-start-2p-regular text-red-400 mt-4 ${step === 3 ? "animate-pulse" : ""}`}>Art by Midas</div>}
      </div>
    </div>
  );
};

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [targetColorIndex, setTargetColorIndex] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [isHighlighting, setIsHighlighting] = useState(true);

  const initializeGame = () => {
    const shuffledColors = [...COLORS].sort(() => 0.5 - Math.random());
    const selectedColors = shuffledColors.slice(0, 6);

    const highlightIndex = Math.floor(Math.random() * 6);

    setOptions(selectedColors);
    setHighlightedIndex(highlightIndex);
    setTargetColorIndex(highlightIndex);
    setGameStatus("");
    setIsAnimating(false);
    setIsHighlighting(true);
  };

  useEffect(() => {
    if (!showIntro) {
      initializeGame();
    }
  }, [showIntro]);

  useEffect(() => {
    let highlightTimer, shuffleTimer;

    if (isHighlighting) {
      highlightTimer = setTimeout(() => {
        setIsHighlighting(false);

        const shuffledColors = [...options].sort(() => 0.5 - Math.random());
        setOptions(shuffledColors);
      }, 2000);
    }

    return () => {
      if (highlightTimer) clearTimeout(highlightTimer);
      if (shuffleTimer) clearTimeout(shuffleTimer);
    };
  }, [isHighlighting, options]);

  const handleColorClick = (index) => {
    if (isAnimating || isHighlighting) return;

    setIsAnimating(true);

    if (index === targetColorIndex) {
      setScore((prev) => prev + 1);
      setGameStatus("Correct! You remembered! 🏆");
      setTimeout(() => {
        initializeGame();
      }, 1500);
    } else {
      setGameStatus("Wrong! Try again! 👾");
      setTimeout(() => {
        setGameStatus("");
        setIsAnimating(false);
      }, 1500);
    }
  };

  if (showIntro) {
    return <IntroSequence onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center justify-center font-mono">
      <h1 className="text-4xl mb-8 text-yellow-400 animate-pulse press-start-2p-regular">COLOR QUEST</h1>

      <div data-testid="gameInstructions" className="text-center mb-6 px-4 py-2 border-2 border-blue-500 rounded-lg bg-blue-900">
        Memorize the Highlighted Box, Then Select it After Shuffling!
      </div>

      <div data-testid="score" className="text-2xl mb-6 text-green-400">
        SCORE: {score}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {options.map((color, index) => (
          <button
            key={index}
            data-testid="colorOption"
            className={`w-24 h-24 rounded-lg border-4 border-white shadow-lg transform hover:scale-110 transition-transform 
              ${isAnimating ? "opacity-50" : ""}
              ${isHighlighting && index === highlightedIndex ? "animate-pulse border-yellow-400" : ""}
            `}
            style={{ backgroundColor: color }}
            onClick={() => handleColorClick(index)}
            disabled={isAnimating || isHighlighting}
          />
        ))}
      </div>

      <div data-testid="gameStatus" className={`h-8 text-xl mb-6 ${gameStatus.includes("Correct") ? "text-green-400" : "text-red-400"} ${isAnimating ? "animate-bounce" : ""}`}>
        {gameStatus}
      </div>

      <button
        data-testid="newGameButton"
        onClick={() => {
          setScore(0);
          setShowIntro(true);
        }}
        className="px-6 py-3 bg-red-600 text-white rounded-lg border-4 border-red-400 hover:bg-red-700 transform hover:scale-105 transition-transform active:translate-y-1"
      >
        NEW GAME
      </button>
    </div>
  );
};

export default App;
