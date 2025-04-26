"use client"

import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useThree } from "@react-three/fiber"
import * as THREE from "three"

type DayNightCycleProps = {
  timeOfDay: number // 0-24 hours
  cycleSpeed: number // Speed of automatic cycle (0 for manual control)
  onTimeChange: (newTime: number) => void
}

export default function DayNightCycle({ timeOfDay, cycleSpeed, onTimeChange }: DayNightCycleProps) {
  const { scene } = useThree()
  const lastUpdate = useRef(0)
  const lastTimeUpdate = useRef(timeOfDay)
  const frameSkip = useRef(0)

  // Calculate sun position based on time of day
  const getSunPosition = (time: number): [number, number, number] => {
    // Convert time (0-24) to radians (0-2π)
    const angle = ((time - 6) / 24) * Math.PI * 2

    // Calculate position on a semicircle
    const radius = 20
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    // During night, keep sun below horizon
    const adjustedY = Math.max(y, -5)

    return [x, adjustedY, -10]
  }

  // Update fog based on time of day
  useEffect(() => {
    // Morning (5-10): Light blue fog
    // Day (10-17): Almost no fog
    // Evening (17-21): Orange/purple fog
    // Night (21-5): Dark blue dense fog

    let fogColor
    let fogDensity

    if (timeOfDay >= 5 && timeOfDay < 10) {
      // Morning - light blue
      const t = (timeOfDay - 5) / 5 // 0 to 1 transition through morning
      fogColor = new THREE.Color(0x8ba3c7)
      fogDensity = 0.03 - t * 0.02
    } else if (timeOfDay >= 10 && timeOfDay < 17) {
      // Day - clear
      fogColor = new THREE.Color(0xc8d8e8)
      fogDensity = 0.01
    } else if (timeOfDay >= 17 && timeOfDay < 21) {
      // Evening - orange/purple
      const t = (timeOfDay - 17) / 4 // 0 to 1 transition through evening
      const r = 0.78 - t * 0.5
      const g = 0.5 - t * 0.4
      const b = 0.6 + t * 0.2
      fogColor = new THREE.Color(r, g, b)
      fogDensity = 0.01 + t * 0.03
    } else {
      // Night - dark blue
      fogColor = new THREE.Color(0x0a0a1f)
      fogDensity = 0.04
    }

    // Update scene fog
    if (scene.fog) {
      ;(scene.fog as THREE.FogExp2).color = fogColor
      ;(scene.fog as THREE.FogExp2).density = fogDensity
    } else {
      scene.fog = new THREE.FogExp2(fogColor.getHex(), fogDensity)
    }

    // Update background color to match time of day
    scene.background = fogColor.clone()
    if (timeOfDay >= 21 || timeOfDay < 5) {
      // Darker at night
      scene.background.multiplyScalar(0.3)
    } else if (timeOfDay >= 17 && timeOfDay < 21) {
      // Slightly darker in evening
      scene.background.multiplyScalar(0.7)
    }
  }, [timeOfDay, scene])

  // Automatic time cycle - with rate limiting to prevent too many updates
  useFrame((_, delta) => {
    if (cycleSpeed <= 0) return // Skip if not in auto cycle mode

    // Increment frame counter to skip frames
    frameSkip.current += 1
    if (frameSkip.current < 10) return // Only update every 10 frames
    frameSkip.current = 0

    lastUpdate.current += delta

    // Only update time every 0.5 seconds to reduce state updates
    if (lastUpdate.current > 0.5) {
      lastUpdate.current = 0

      // Calculate new time (24-hour cycle)
      const newTime = (timeOfDay + delta * cycleSpeed * 5) % 24

      // Only update if time has changed significantly (0.1 hour)
      if (Math.abs(newTime - lastTimeUpdate.current) > 0.1) {
        lastTimeUpdate.current = newTime
        onTimeChange(newTime)
      }
    }
  })

  // Sun/moon light that changes position and color based on time
  const getSunColor = () => {
    if (timeOfDay >= 5 && timeOfDay < 10) {
      // Morning - warm yellow
      const t = (timeOfDay - 5) / 5
      return new THREE.Color(0xffcc88).lerp(new THREE.Color(0xffffff), t)
    } else if (timeOfDay >= 10 && timeOfDay < 17) {
      // Day - white
      return new THREE.Color(0xffffff)
    } else if (timeOfDay >= 17 && timeOfDay < 21) {
      // Evening - orange
      const t = (timeOfDay - 17) / 4
      return new THREE.Color(0xffffff).lerp(new THREE.Color(0xff9966), t)
    } else {
      // Night - blue moonlight
      return new THREE.Color(0x8888ff)
    }
  }

  const getSunIntensity = () => {
    if (timeOfDay >= 5 && timeOfDay < 10) {
      // Morning - increasing
      return 0.5 + ((timeOfDay - 5) / 5) * 1.5
    } else if (timeOfDay >= 10 && timeOfDay < 17) {
      // Day - full
      return 2
    } else if (timeOfDay >= 17 && timeOfDay < 21) {
      // Evening - decreasing
      return 2 - ((timeOfDay - 17) / 4) * 1.5
    } else {
      // Night - low
      return 0.3
    }
  }

  const sunPosition = getSunPosition(timeOfDay)
  const sunColor = getSunColor()
  const sunIntensity = getSunIntensity()

  return (
    <>
      {/* Main directional light (sun/moon) */}
      <directionalLight
        position={sunPosition}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Ambient light that changes with time of day */}
      <ambientLight
        intensity={timeOfDay >= 21 || timeOfDay < 5 ? 0.5 : 0.7}
        color={timeOfDay >= 21 || timeOfDay < 5 ? "#0a0a2f" : "#e0e8ff"}
      />
    </>
  )
}
