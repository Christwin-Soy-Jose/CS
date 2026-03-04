import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

type VisionProfileKey = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia';

interface Plate {
  id: number;
  image: string;
  options: string[];
  expectedAnswers: Record<VisionProfileKey, string>;
}

const PLATES: Plate[] = [
  {
    id: 1,
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Ishihara_9.png", // Plate where red–green can see an alternate number
    options: ["74", "21", "None", "Unsure"],
    expectedAnswers: {
      normal: "74",
      protanopia: "21",
      deuteranopia: "21",
      tritanopia: "74",
    },
  },
  {
    id: 2,
    image: "https://www.colorlitelens.com/images/Ishihara/Ishihara_00.jpg", // Demonstration plate (12) - everyone should see this
    options: ["12", "None", "Unsure", "1"],
    expectedAnswers: {
      normal: "12",
      protanopia: "12",
      deuteranopia: "12",
      tritanopia: "12",
    },
  },
  {
    id: 3,
    image: "https://www.colorlitelens.com/images/Ishihara/Ishihara_03.jpg", 
    options: ["16", "None", "Unsure", "10"],
    expectedAnswers: {
      normal: "16",
      protanopia: "None",
      deuteranopia: "None",
      tritanopia: "16",
    },
  },
  {
    id: 4,
    image: "https://www.colorlitelens.com/images/Ishihara/Ishihara_11.jpg", 
    options: ["42", "2", "4", "None"],
    expectedAnswers: {
      normal: "42",
      protanopia: "2",
      deuteranopia: "2",
      tritanopia: "42",
    },
  },
];

export const ColorBlindTest = ({ onComplete, onCancel }: { onComplete: (type: string) => void, onCancel: () => void }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (step < PLATES.length - 1) {
      setStep(step + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: string[]) => {
    const scores: Record<VisionProfileKey, number> = {
      normal: 0,
      protanopia: 0,
      deuteranopia: 0,
      tritanopia: 0,
    };

    finalAnswers.forEach((ans, i) => {
      const plate = PLATES[i];
      (Object.keys(scores) as VisionProfileKey[]).forEach((profile) => {
        if (ans === plate.expectedAnswers[profile]) {
          scores[profile] += 1;
        }
      });
    });

    const totalPlates = PLATES.length;
    const { normal, protanopia, deuteranopia, tritanopia } = scores;

    let result: string;

    if (normal === totalPlates) {
      result = 'Normal Vision';
    } else {
      // Pick the non-normal profile with the highest score
      const profileScores: Array<{ key: VisionProfileKey; value: number }> = [
        { key: 'protanopia', value: protanopia },
        { key: 'deuteranopia', value: deuteranopia },
        { key: 'tritanopia', value: tritanopia },
      ];

      profileScores.sort((a, b) => b.value - a.value);
      const top = profileScores[0];

      if (top.value === 0) {
        result = 'Unspecified Color Vision Deficiency';
      } else if (top.key === 'protanopia') {
        result = 'Protanopia';
      } else if (top.key === 'deuteranopia') {
        result = 'Deuteranopia';
      } else {
        result = 'Tritanopia';
      }
    }

    setIsFinished(true);
    setTimeout(() => onComplete(result), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/95 backdrop-blur-xl p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      >
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div 
              key="test"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 md:p-12"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-brand-primary dark:text-white">Ishihara Test</h2>
                  <p className="text-sm text-stone-500">Plate {step + 1} of {PLATES.length}</p>
                </div>
                <button 
                  onClick={onCancel}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="w-64 h-64 rounded-full overflow-hidden border-8 border-stone-100 dark:border-stone-800 shadow-inner shrink-0 relative bg-stone-50 dark:bg-stone-800">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={step}
                      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 1.1, rotate: 10 }}
                      transition={{ duration: 0.5, ease: "circOut" }}
                      src={PLATES[step].image} 
                      alt={`Ishihara Plate ${step + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>
                </div>

                <div className="flex-grow w-full">
                  <p className="text-lg font-medium mb-6 text-brand-primary dark:text-white">What number do you see in the circle?</p>
                  <div className="grid grid-cols-2 gap-4">
                    {PLATES[step].options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(opt)}
                        className="py-4 rounded-xl border-2 border-stone-100 dark:border-stone-800 hover:border-brand-secondary hover:bg-brand-secondary/5 text-brand-primary dark:text-white font-bold transition-all active:scale-95"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 h-1.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-brand-secondary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((step + 1) / PLATES.length) * 100}%` }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-brand-primary dark:text-white">Analysis Complete</h2>
              <p className="text-stone-500 mb-8">We've identified your vision profile. Setting up your personalized experience...</p>
              
              <div className="flex items-center justify-center gap-3 text-brand-secondary font-bold">
                <RefreshCw className="w-5 h-5 animate-spin" />
                Processing Results
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
