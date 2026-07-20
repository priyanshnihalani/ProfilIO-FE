import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface SetupWelcomeScreenProps {
  onComplete: () => void;
}

const greetings = [
  "Hello",      // English
  "Bonjour",    // French
  "Hola",       // Spanish
  "Ciao",       // Italian
  "Namaste",    // Hindi
  "Nǐ Hǎo",     // Chinese
  "Konnichiwa", // Japanese
  "Welcome"     // English final
];

const setupTexts = [
  "Hi",
  "We're getting things ready for you...",
  "Setting up your ProfilIo workspace...",
  "Optimizing ATS parser models...",
  "Almost there..."
];

const SetupWelcomeScreen: React.FC<SetupWelcomeScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<"greeting" | "setup" | "complete">("greeting");
  const [greetingIdx, setGreetingIdx] = useState(0);
  const [setupIdx, setSetupIdx] = useState(0);

  // Phase 1: Cycle through greetings
  useEffect(() => {
    if (phase !== "greeting") return;

    const interval = setInterval(() => {
      setGreetingIdx((prev) => {
        if (prev >= greetings.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setPhase("setup");
          }, 450); // Pause on "Welcome"
          return prev;
        }
        return prev + 1;
      });
    }, 380);

    return () => clearInterval(interval);
  }, [phase]);

  // Phase 2: Cycle through Windows-style setup prompts
  useEffect(() => {
    if (phase !== "setup") return;

    const interval = setInterval(() => {
      setSetupIdx((prev) => {
        if (prev >= setupTexts.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setPhase("complete");
            setTimeout(onComplete, 1200); // Wait for complete zoom out
          }, 1500); // Hold final text
          return prev;
        }
        return prev + 1;
      });
    }, 1800); // Show each setup text for 1.8s

    return () => clearInterval(interval);
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAFAFC] select-none overflow-hidden font-sans">
        
        {/* Step 1: Morphing Multi-language Greetings */}
        {phase === "greeting" && (
          <motion.div
            key="greetings-container"
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.h1
                key={greetings[greetingIdx]}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 1.02 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="text-5xl md:text-7xl font-black tracking-tight text-[#0F172A] font-display"
              >
                {greetings[greetingIdx]}.
              </motion.h1>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Step 2: Immersive Windows/Apple setup screen with gradient pulses */}
        {phase === "setup" && (
          <motion.div
            key="setup-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: "-100vh" }} // Swipe up iOS style
            transition={{ duration: 0.6, ease: [0.85, 0, 0.15, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-[#6D5DF6]/12 via-[#8B7CF8]/8 to-[#FAFAFC]"
          >
            {/* Spinning dotted setup circle in center */}
            <div className="relative mb-12 flex items-center justify-center">
              <motion.svg
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-20 h-20 text-[#6D5DF6]"
                viewBox="0 0 100 100"
              >
                {/* 6 Dots in a circle */}
                {[0, 60, 120, 180, 240, 300].map((angle, idx) => {
                  const rad = (angle * Math.PI) / 180;
                  const cx = 50 + 35 * Math.cos(rad);
                  const cy = 50 + 35 * Math.sin(rad);
                  return (
                    <motion.circle
                      key={idx}
                      cx={cx}
                      cy={cy}
                      r="4.5"
                      fill="currentColor"
                      animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.5, 1, 0.5] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        delay: idx * 0.15,
                        ease: "easeInOut"
                      }}
                    />
                  );
                })}
              </motion.svg>
            </div>

            {/* Pulsing backdrop blur blobs */}
            <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[#6D5DF6]/10 rounded-full blur-[80px] -z-10 animate-pulse" />
            <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-[#8B7CF8]/10 rounded-full blur-[70px] -z-10" />

            {/* Setup texts sequence */}
            <div className="h-16 flex items-center justify-center px-6">
              <AnimatePresence mode="wait">
                <motion.p
                  key={setupTexts[setupIdx]}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45 }}
                  className="text-lg md:text-xl font-medium text-slate-700 font-sans tracking-wide text-center"
                >
                  {setupTexts[setupIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Step 3: Complete checkmark & Swipe up transition */}
        {phase === "complete" && (
          <motion.div
            key="complete-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ y: "-100vh" }}
            transition={{ duration: 0.7, ease: [0.85, 0, 0.15, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-[#6D5DF6]/20 to-[#8B7CF8]/20"
          >
            {/* Morphing Unlock ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="w-24 h-24 rounded-full border-4 border-emerald-500 bg-white flex items-center justify-center shadow-lg shadow-emerald-500/10 mb-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 150 }}
              >
                <Check className="w-12 h-12 text-emerald-500 stroke-[3]" />
              </motion.div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-black text-[#0F172A] font-display"
            >
              Welcome to ProfilIo.
            </motion.h2>
          </motion.div>
        )}

      </div>
    </AnimatePresence>
  );
};

export default SetupWelcomeScreen;
