import React from 'react'
import { motion } from 'framer-motion'

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      {/* Ambient glow */}
      <div className="ambient-orb ambient-orb-1" style={{ opacity: 0.1 }} />
      <div className="ambient-orb ambient-orb-2" style={{ opacity: 0.08 }} />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col items-center"
      >
        {/* Brand icon */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple via-neon-violet to-neon-blue flex items-center justify-center shadow-neon">
            <span className="text-white font-display font-bold text-2xl">RM</span>
          </div>
          <motion.div
            className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 blur-xl"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Brand name */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-display font-bold text-xl tracking-tight text-white mb-1"
        >
          RAYANA MARIA
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-body text-xs tracking-[0.3em] uppercase text-white/50"
        >
          Fitness Premium
        </motion.p>
      </motion.div>

      {/* Loading bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="loading-bar mt-10"
      >
        <motion.div
          className="loading-bar-fill"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        />
      </motion.div>
    </div>
  )
}

export default LoadingScreen
