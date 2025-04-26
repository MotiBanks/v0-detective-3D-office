"use client"

import { useEffect, useState } from "react"
import * as THREE from "three"

export function DebugInfo() {
  const [threeVersion, setThreeVersion] = useState<string>("")

  useEffect(() => {
    setThreeVersion(THREE.REVISION)
    console.log("Three.js Version:", THREE.REVISION)
  }, [])

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded-md text-xs z-50">
      <div>Three.js Version: {threeVersion}</div>
      <div className={threeVersion === "154" ? "text-green-400" : "text-yellow-400"}>
        {threeVersion === "154" ? "✓ Using compatible version" : "Warning: Use Three.js v0.154.0 for compatibility"}
      </div>
    </div>
  )
}
