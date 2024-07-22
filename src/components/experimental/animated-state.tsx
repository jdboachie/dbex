'use client'

import { AnimatePresence, motion } from "framer-motion";

const variants = {
  initial: { opacity: 0, y: -5 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 5 },
};

export function AnimatedState({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        initial="initial"
        animate="visible"
        exit="exit"
        variants={variants}
        transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        key={children?.toLocaleString()}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}