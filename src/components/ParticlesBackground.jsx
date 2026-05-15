import React, { useMemo } from 'react'

const ParticlesBackground = () => {
  const particles = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const count = isMobile ? 12 : 30
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 10 + Math.random() * 20,
      size: 1 + Math.random() * 3,
      driftX: -50 + Math.random() * 100,
      opacity: 0.1 + Math.random() * 0.3,
      color: i % 3 === 0 ? 'rgba(168, 85, 247, VAR)' : i % 3 === 1 ? 'rgba(59, 130, 246, VAR)' : 'rgba(136, 19, 55, VAR)',
    }))
  }, [])

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color.replace('VAR', p.opacity.toString()),
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift-x': `${p.driftX}px`,
            boxShadow: `0 0 ${p.size * 3}px ${p.color.replace('VAR', (p.opacity * 0.5).toString())}`,
          }}
        />
      ))}
    </div>
  )
}

export default ParticlesBackground
