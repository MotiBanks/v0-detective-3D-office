"use client"

import { useEffect, useState } from "react"

export default function FallbackScene() {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Reload the page after countdown
          window.location.reload()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Detective Office</h1>
      <div className="w-24 h-24 bg-gray-700 animate-pulse mb-6"></div>
      <p className="mb-2">Initializing 3D environment...</p>
      <p className="text-sm text-gray-400 mb-4">
        If you continue to see this screen, your browser may have limited WebGL support.
      </p>
      <p className="text-sm text-gray-500">Retrying in {countdown} seconds...</p>
    </div>
  )
}
