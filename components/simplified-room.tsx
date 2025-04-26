"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

// This is a simplified room component that can be used as a fallback
// if the main room component fails to load
export default function SimplifiedRoom() {
  const roomRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (roomRef.current) {
      roomRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group ref={roomRef}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#3D2C27" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2, -5]} castShadow receiveShadow>
        <boxGeometry args={[10, 4, 0.2]} />
        <meshStandardMaterial color="#1C1C24" roughness={0.7} />
      </mesh>

      <mesh position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 4, 0.2]} />
        <meshStandardMaterial color="#1C1C24" roughness={0.7} />
      </mesh>

      <mesh position={[5, 2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 4, 0.2]} />
        <meshStandardMaterial color="#1C1C24" roughness={0.7} />
      </mesh>

      {/* Desk */}
      <mesh position={[0, 0.5, -3]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#5B3513" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Chair */}
      <mesh position={[0, 0.4, -3.8]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial color="#3D2C27" roughness={0.6} />
      </mesh>

      {/* Light source */}
      <pointLight position={[0, 3, 0]} intensity={1} castShadow />
    </group>
  )
}
