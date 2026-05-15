import React, { useEffect, useRef } from 'react'

const MouseFollower = () => {
  const followerRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (followerRef.current) {
        followerRef.current.style.left = e.clientX + 'px'
        followerRef.current.style.top = e.clientY + 'px'
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return <div ref={followerRef} className="mouse-follower hidden lg:block" />
}

export default MouseFollower
