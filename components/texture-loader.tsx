"use client"

import { useState, useEffect } from "react"
import * as THREE from "three"

// This component preloads all textures and ensures they're ready before rendering
export function useTexturePreloader() {
  const [texturesLoaded, setTexturesLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Create a default texture to use as fallback
    const createDefaultTexture = (color = "#CCCCCC") => {
      const canvas = document.createElement("canvas")
      canvas.width = 2
      canvas.height = 2
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.fillStyle = color
        ctx.fillRect(0, 0, 2, 2)
      }
      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      return texture
    }

    // Store default textures for each type
    const defaultTextures: Record<string, THREE.Texture> = {
      wood: createDefaultTexture("#8B4513"),
      leather: createDefaultTexture("#8B2500"),
      cork: createDefaultTexture("#D2B48C"),
      paper: createDefaultTexture("#F5F5DC"),
      metal: createDefaultTexture("#A9A9A9"),
      floor: createDefaultTexture("#5D4037"),
      wallpaper: createDefaultTexture("#2C3E50"),
    }

    // Set up texture loader with better error handling
    const textureLoader = new THREE.TextureLoader()

    // Define texture paths with fallbacks
    const texturesToLoad = [
      { name: "wood", path: "/textures/wood.jpg" },
      { name: "leather", path: "/textures/leather.jpg" },
      { name: "cork", path: "/textures/cork.jpg" },
      { name: "paper", path: "/textures/paper.jpg" },
      { name: "metal", path: "/textures/metal.jpg" },
      { name: "floor", path: "/textures/floor.jpg" },
      { name: "wallpaper", path: "/textures/wallpaper.jpg" },
    ]

    // Track loading progress
    let loadedCount = 0
    const totalCount = texturesToLoad.length

    // Store loaded textures
    const textureCache: Record<string, THREE.Texture> = {}

    // Update progress and check if all textures are loaded
    const updateProgress = () => {
      loadedCount++
      const progressValue = Math.round((loadedCount / totalCount) * 100)
      setProgress(progressValue)

      // If all textures have been processed (either loaded or failed)
      if (loadedCount === totalCount) {
        console.log("All textures processed, proceeding with available textures")
        setTexturesLoaded(true)
      }
    }

    // Load each texture with error handling
    texturesToLoad.forEach(({ name, path }) => {
      // Assign default texture first
      textureCache[name] = defaultTextures[name]

      // Try to load the actual texture
      textureLoader.load(
        path,
        (texture) => {
          console.log(`Successfully loaded texture: ${path}`)
          textureCache[name] = texture
          updateProgress()
        },
        // Progress callback
        (event) => {
          // Optional progress tracking per texture
        },
        // Error callback
        (error) => {
          console.warn(`Failed to load texture ${path}, using fallback. Error:`, error)
          // We already have the default texture assigned, so just update progress
          updateProgress()
        },
      )
    })

    // Expose the texture cache to the window for debugging
    if (typeof window !== "undefined") {
      ;(window as any).__textureCache = textureCache
    }

    // Cleanup
    return () => {
      // Dispose textures to prevent memory leaks
      Object.values(textureCache).forEach((texture) => {
        texture.dispose()
      })
    }
  }, [])

  return { texturesLoaded, progress, error }
}

// Export a function to get textures from anywhere
export const getTexture = (name: string): THREE.Texture | null => {
  if (typeof window === "undefined") return null
  const cache = (window as any).__textureCache
  return cache && cache[name] ? cache[name] : null
}
