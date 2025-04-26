"use client"

import { useRef } from "react"
import type * as THREE from "three"

type CityBackdropProps = {
  timeOfDay?: number
}

export default function CityBackdrop({ timeOfDay = 0 }: CityBackdropProps) {
  const cityRef = useRef<THREE.Group>(null)

  // Determine if it's day or night
  const isNight = timeOfDay >= 18 || timeOfDay < 6
  const isEvening = timeOfDay >= 16 && timeOfDay < 18
  const isMorning = timeOfDay >= 6 && timeOfDay < 8

  // Window light colors and intensity based on time
  const getWindowColor = () => {
    if (isNight) return "#ffcc77" // Warm yellow at night
    if (isEvening) return "#ffeecc" // Soft warm light in evening
    return "#ffffff" // White during day
  }

  const getWindowIntensity = () => {
    if (isNight) return 0.8
    if (isEvening) return 0.5
    if (isMorning) return 0.3
    return 0 // No window lights during day
  }

  const windowColor = getWindowColor()
  const windowIntensity = getWindowIntensity()

  // Adjust city appearance based on time of day
  const getCityColor = () => {
    if (isNight) return "#0a0a1f" // Dark blue at night
    if (isEvening) return "#4a3b55" // Purple-ish in evening
    if (isMorning) return "#5d6b85" // Blue-gray in morning
    return "#667788" // Gray during day
  }

  const cityColor = getCityColor()

  return (
    <group ref={cityRef} position={[0, 1, -15]}>
      {/* City silhouette */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[30, 6, 1]} />
        <meshStandardMaterial color={cityColor} roughness={0.8} />
      </mesh>

      {/* Buildings */}
      {Array.from({ length: 15 }).map((_, i) => (
        <group key={i} position={[-14 + i * 2, 0, 0]}>
          {/* Main building */}
          <mesh position={[0, 3 + Math.sin(i * 0.5) * 2, 0]}>
            <boxGeometry args={[1.5, 6 + Math.sin(i * 0.5) * 4, 0.5]} />
            <meshStandardMaterial color={cityColor} roughness={0.8} />
          </mesh>

          {/* Windows */}
          {Array.from({ length: 5 }).map((_, j) => (
            <mesh key={j} position={[0, 1 + j * 1.2, 0.3]}>
              <boxGeometry args={[1, 0.8, 0.1]} />
              <meshStandardMaterial
                color={windowColor}
                emissive={windowColor}
                emissiveIntensity={windowIntensity * (Math.random() * 0.5 + 0.5)}
                roughness={0.5}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}
