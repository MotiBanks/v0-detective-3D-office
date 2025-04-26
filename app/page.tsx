"use client"

import { Suspense, useEffect, useState } from "react"
import DetectiveRoom from "@/components/detective-room"

export default function Home() {
  const [hasError, setHasError] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Check for WebGL support
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      if (!gl) {
        console.error("WebGL not supported")
        setHasError(true)
      }
    } catch (e) {
      console.error("Error checking WebGL:", e)
      setHasError(true)
    }
  }, [])

  if (!isClient) {
    return <div className="w-full h-screen bg-black flex items-center justify-center text-white">Loading...</div>
  }

  if (hasError) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center flex-col gap-4 p-4 text-center">
        <h1 className="text-white text-2xl">WebGL Support Issue Detected</h1>
        <p className="text-gray-300">Your browser may not support the required 3D features.</p>
        <p className="text-gray-400">Try using Chrome or Edge on a desktop computer.</p>
      </div>
    )
  }

  return (
    <main className="w-full h-screen">
      <Suspense
        fallback={
          <div className="w-full h-screen bg-black flex items-center justify-center">
            <div className="animate-pulse text-white">Loading Detective Office...</div>
          </div>
        }
      >
        <DetectiveRoom />
      </Suspense>
    </main>
  )
}
