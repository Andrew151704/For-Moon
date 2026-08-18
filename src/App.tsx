import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { config } from './config/personal';

export default function App() {
  const [view, setView] = useState<'intro' | 'experience' | 'final'>('intro');

  useEffect(() => {
    console.log(`%c${config.developerMessage}`, 'color: #8A8782; font-style: italic;');
  }, []);

  return (
    <main className="w-full h-[100dvh] flex flex-col relative overflow-hidden bg-night-900 text-night-300">
      <AnimatePresence mode="wait">
        {view === 'intro' && <Intro key="intro" onEnter={() => setView('experience')} />}
        {view === 'experience' && <PresenceExperience key="exp" onComplete={() => setView('final')} />}
        {view === 'final' && <Finaley key="final" />}
      </AnimatePresence>
    </main>
  );
}

// --- 1. INTRO ---
function Intro({ onEnter }: { onEnter: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step > 1) return;
    const timer = setTimeout(() => setStep(s => s + 1), 3000);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <motion.div exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute inset-0 flex flex-col items-center justify-center px-8">
      <div className="h-32 flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.p key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(4px)" }} transition={{ duration: 1.2 }} className="font-serif text-night-100 text-xl md:text-2xl font-light">
              It's late.
            </motion.p>
          )}
          {step === 1 && (
            <motion.p key="2" initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 1.2 }} className="font-serif text-night-100 text-xl md:text-2xl font-light">
              You don't have to carry it all right now.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {step >= 1 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1.5 }}
          onClick={onEnter}
          className="absolute bottom-24 text-xs font-sans tracking-[0.2em] text-night-300 uppercase hover:text-night-100 transition-colors p-4"
        >
          Just breathe
        </motion.button>
      )}
    </motion.div>
  );
}

// --- 2. SIGNATURE INTERACTION (THUMB REST) ---
function PresenceExperience({ onComplete }: { onComplete: () => void }) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentItem = config.theFiveThings[itemIndex];

  useEffect(() => {
    if (isHolding) {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
      holdTimerRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            if (holdTimerRef.current) clearInterval(holdTimerRef.current);
            return 100;
          }
          return p + 1.4;
        });
      }, 50);
    } else {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
      holdTimerRef.current = setInterval(() => {
        setProgress(p => {
          if (p <= 0) {
            if (holdTimerRef.current) clearInterval(holdTimerRef.current);
            return 0;
          }
          return p - 3;
        });
      }, 50);
    }
    return () => {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    };
  }, [isHolding]);

  useEffect(() => {
    if (progress >= 100) {
      setIsHolding(false);
      const timer = setTimeout(() => {
        setProgress(0);
        if (itemIndex < config.theFiveThings.length - 1) {
          setItemIndex(i => i + 1);
        } else {
          onComplete();
        }
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [progress, itemIndex, onComplete]);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  const handleStart = () => {
    if (progress >= 100) return;
    setIsHolding(true);
    triggerHaptic();
  };

  const handleEnd = () => {
    setIsHolding(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 2 } }} className="absolute inset-0 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pb-20">
        <span className="text-[10px] font-mono text-night-300/50 uppercase tracking-widest mb-6">
          {currentItem.label}
        </span>
        
        <div className="relative max-w-sm w-full min-h-[8rem] flex items-center justify-center">
          <span className="opacity-5 absolute inset-0 blur-[3px] font-serif text-xl md:text-2xl text-night-100 leading-relaxed flex items-center justify-center">
            {currentItem.text}
          </span>
          
          <span 
            style={{ 
              opacity: Math.min(1, progress / 75),
              filter: `blur(${Math.max(0, 5 - (progress / 15))}px)`
            }}
            className="font-serif text-xl md:text-2xl text-night-100 leading-relaxed relative z-10 transition-all duration-150"
          >
            {currentItem.text}
          </span>
        </div>
      </div>

      <div className="h-64 flex flex-col items-center justify-end pb-16 relative">
        <motion.span 
          animate={{ opacity: isHolding ? 0 : (progress > 0 ? 0.2 : 0.6) }}
          className="text-xs font-sans text-night-300 mb-8 tracking-widest uppercase pointer-events-none"
        >
          {progress > 0 ? "Keep resting here" : "Rest your thumb here"}
        </motion.span>

        <div 
          className="relative w-24 h-24 flex items-center justify-center cursor-pointer touch-none select-none"
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
        >
          <motion.div 
            className="absolute inset-0 rounded-full border border-night-300/30"
            animate={{ 
              scale: isHolding ? 1.4 : 1,
              opacity: isHolding ? 0.8 : 0.3,
              borderColor: isHolding ? '#E6E2D8' : '#8A8782'
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
            <circle 
              cx="48" cy="48" r="46" 
              fill="none" 
              stroke="#D97746" 
              strokeWidth="1.5"
              strokeDasharray="289"
              strokeDashoffset={289 - (289 * progress) / 100}
              className="transition-all duration-75 ease-linear opacity-80"
            />
          </svg>

          <motion.div 
            className="w-12 h-12 rounded-full bg-night-800 border border-night-300/20"
            animate={{ 
              scale: isHolding ? 0.9 : 1,
              backgroundColor: isHolding ? '#1C1B1A' : '#11100F'
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// --- 3. FINAL MESSAGE ---
function Finaley() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 3 }} 
      className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
    >
      <motion.p 
        initial={{ y: 10, filter: "blur(4px)" }} 
        animate={{ y: 0, filter: "blur(0px)" }} 
        transition={{ delay: 1, duration: 2.5 }}
        className="font-serif text-xl md:text-2xl text-night-100 italic"
      >
        {config.finalMessage}
      </motion.p>
    </motion.div>
  );
}
