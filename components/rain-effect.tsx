"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

type RainEffectProps = {
  count?: number
  timeOfDay?: number
}

export default function RainEffect({ count = 1000, timeOfDay = 0 }: RainEffectProps) {
  const rainRef = useRef<THREE.Points>(null)

  // Adjust rain intensity based on time of day
  // More rain at night and early morning, less during day
  const getRainIntensity = () => {
    if (timeOfDay >= 22 || timeOfDay < 6) return 1.0 // Full rain at night
    if (timeOfDay >= 6 && timeOfDay < 10) return 0.7 // Moderate rain in morning
    if (timeOfDay >= 16 && timeOfDay < 22) return 0.5 // Light rain in evening
    return 0.3 // Very light rain during day
  }

  const rainIntensity = getRainIntensity()

  // Animate rain
  useFrame((_, delta) => {
    if (rainRef.current) {
      const positions = (rainRef.current.geometry as THREE.BufferGeometry).attributes.position.array as Float32Array

      for (let i = 0; i < positions.length; i += 3) {
        // Move rain down
        positions[i + 1] -= delta * 10 * rainIntensity

        // Reset rain drops that go below ground
        if (positions[i + 1] < -5) {
          positions[i + 1] = 15

          // Keep rain outside the office when resetting
          // Ensure rain is positioned outside the window (z < -4.8)
          positions[i + 2] = Math.min(positions[i + 2], -4.8)

          // Keep rain mostly in front of the window area
          if (Math.random() > 0.3) {
            // 70% of rain concentrated in window area
            positions[i] = (Math.random() - 0.5) * 4 // -2 to 2 (window width)
          } else {
            // 30% of rain spread wider
            positions[i] = (Math.random() - 0.5) * 15 // wider spread
          }
        }
      }
      ;(rainRef.current.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true
    }
  })

  // Create rain particles - ONLY OUTSIDE THE OFFICE
  const rainPositions = new Float32Array(count * 3)
  for (let i = 0; i < count * 3; i += 3) {
    // X position - spread horizontally, concentrated more in front of window
    if (Math.random() > 0.3) {
      // 70% of rain concentrated in window area
      rainPositions[i] = (Math.random() - 0.5) * 4 // -2 to 2 (window width)
    } else {
      // 30% of rain spread wider
      rainPositions[i] = (Math.random() - 0.5) * 15 // wider spread
    }

    // Y position - from above ground to high up
    rainPositions[i + 1] = Math.random() * 20 - 5 // -5 to 15

    // Z position - ONLY OUTSIDE THE OFFICE (z < -4.8, where -5 is the back wall)
    rainPositions[i + 2] = -4.8 - Math.random() * 10 // -4.8 to -14.8
  }

  // Adjust rain color and opacity based on time
  const getRainColor = () => {
    if (timeOfDay >= 22 || timeOfDay < 6) return "#8888ff" // Blueish at night
    if (timeOfDay >= 16 && timeOfDay < 22) return "#aabbcc" // Gray-blue in evening
    return "#cccccc" // Light gray during day
  }

  const rainColor = getRainColor()
  const rainOpacity = rainIntensity * 0.3

  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={rainPositions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={rainColor} size={0.1} transparent opacity={rainOpacity} depthWrite={false} />
    </points>
  )
}
