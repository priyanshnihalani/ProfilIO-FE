import React, { useEffect } from "react";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onComplete?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAFAFC]">
      <div className="flex flex-col items-center max-w-sm w-full px-6">
        
        {/* Animated Brand Logo Icon */}
        <div className="relative mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <img src="/logo.png" alt="ProfilIO" className="h-22 w-auto object-contain" />
          </motion.div>
          
          {/* Radial glow effect */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-3xl blur-xl -z-10"
          />
        </div>

      </div>
    </div>
  );
};

export default WelcomeScreen;
