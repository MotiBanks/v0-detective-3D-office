"use client"

import { Suspense, useState, useEffect, useRef, useCallback } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei"
import { Howl } from "howler"
import * as THREE from "three"
import Room from "./room"
import EvidenceModal from "./evidence-modal"
import RainEffect from "./rain-effect"
import CityBackdrop from "./city-backdrop"
import DayNightCycle from "./day-night-cycle"
import TimeControl from "./time-control"
import "../styles/magnifying-glass-cursor.css"

import CryptoEvidenceModal from "./crypto-evidence-modal"
import FileDrawerModal from "./file-drawer-modal"
import PhoneCallModal from "./phone-call-modal"
import SimplifiedRoom from "./simplified-room"

export type Evidence = {
  title: string
  description: string
  imageUrl: string
  blockchainLink?: string
}

export type CryptoEvidence = {
  title: string
  description: string
  imageUrl: string
  token: string
  articleUrl?: string
}

export type FileDrawer = {
  title: string
  token: string
  articleUrl: string
}

export default function DetectiveRoom() {
  const [renderFailed, setRenderFailed] = useState(false)
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null)
  const [selectedCryptoEvidence, setSelectedCryptoEvidence] = useState<CryptoEvidence | null>(null)
  const [selectedFileDrawer, setSelectedFileDrawer] = useState<FileDrawer | null>(null)
  const [showPhoneCall, setShowPhoneCall] = useState(false)
  const [backgroundMusic, setBackgroundMusic] = useState<Howl | null>(null)
  const [rainSound, setRainSound] = useState<Howl | null>(null)
  const [citySound, setCitySound] = useState<Howl | null>(null)
  const [tickingClockSound, setTickingClockSound] = useState<Howl | null>(null)
  const [soundsEnabled, setSoundsEnabled] = useState(false)
  const [soundsLoaded, setSoundsLoaded] = useState(false)
  const [cameraPosition, setCameraPosition] = useState([0, 1.5, 4])
  const [cameraTarget, setCameraTarget] = useState([0, 1, 0])
  const [timeOfDay, setTimeOfDay] = useState(22) // Start at 10 PM for noir feel
  const [cycleSpeed, setCycleSpeed] = useState(0) // 0 = manual, >0 = automatic cycle
  const [isTogglingSound, setIsTogglingSound] = useState(false)
  const [useSimplifiedRoom, setUseSimplifiedRoom] = useState(false)
  const [rendererInitialized, setRendererInitialized] = useState(false)
  const controlsRef = useRef<any>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const audioVolumesRef = useRef({
    music: 0.3,
    rain: 0.2,
    city: 0.1,
    clock: 0.15,
  })

  // Initialize sounds only once
  useEffect(() => {
    let isMounted = true
    let bgMusic: Howl | null = null
    let rSound: Howl | null = null
    let cSound: Howl | null = null
    let tClock: Howl | null = null

    const initSounds = async () => {
      try {
        // Create audio instances with proper error handling
        bgMusic = new Howl({
          src: ["/sounds/noir-jazz.mp3"],
          loop: true,
          volume: 0.3,
          autoplay: false,
          html5: true,
          preload: false,
          onloaderror: () => console.log("Error loading background music"),
        })

        rSound = new Howl({
          src: ["/sounds/rain-ambience.mp3"],
          loop: true,
          volume: 0.2,
          autoplay: false,
          html5: true,
          preload: false,
          onloaderror: () => console.log("Error loading rain sound"),
        })

        cSound = new Howl({
          src: ["/sounds/city-ambience.mp3"],
          loop: true,
          volume: 0.1,
          autoplay: false,
          html5: true,
          preload: false,
          onloaderror: () => console.log("Error loading city sound"),
        })

        tClock = new Howl({
          src: ["/sounds/ticking-clock.mp3"],
          loop: true,
          volume: 0.15,
          autoplay: false,
          html5: true,
          preload: false,
          onload: () => {
            console.log("Ticking clock sound loaded successfully")
          },
          onloaderror: (id, error) => {
            console.log("Error loading ticking clock sound:", error)
          },
        })

        if (isMounted) {
          setBackgroundMusic(bgMusic)
          setRainSound(rSound)
          setCitySound(cSound)
          setTickingClockSound(tClock)
        }
      } catch (error) {
        console.error("Error initializing sounds:", error)
      }
    }

    initSounds()

    // Cleanup function
    return () => {
      isMounted = false

      // Safely unload sounds
      const safeUnload = (sound: Howl | null) => {
        if (sound) {
          try {
            sound.fade(sound.volume(), 0, 300)
            setTimeout(() => {
              try {
                sound.stop()
                sound.unload()
              } catch (e) {
                console.error("Error unloading sound:", e)
              }
            }, 300)
          } catch (e) {
            console.error("Error fading sound:", e)
          }
        }
      }

      safeUnload(bgMusic)
      safeUnload(rSound)
      safeUnload(cSound)
      safeUnload(tClock)
    }
  }, [])

  // Calculate audio volumes based on time of day - without triggering state updates
  useEffect(() => {
    // Calculate new volumes based on time of day
    if (timeOfDay >= 18 || timeOfDay < 6) {
      // Night
      audioVolumesRef.current = {
        music: 0.3,
        rain: 0.3,
        city: 0.05,
        clock: 0.15,
      }
    } else if (timeOfDay >= 6 && timeOfDay < 10) {
      // Morning
      audioVolumesRef.current = {
        music: 0.2,
        rain: 0.2,
        city: 0.1,
        clock: 0.12,
      }
    } else {
      // Day
      audioVolumesRef.current = {
        music: 0.15,
        rain: 0.1,
        city: 0.15,
        clock: 0.1,
      }
    }

    // Only update actual volumes if sounds are enabled and loaded
    if (soundsEnabled && soundsLoaded) {
      try {
        if (backgroundMusic) backgroundMusic.volume(audioVolumesRef.current.music)
        if (rainSound) rainSound.volume(audioVolumesRef.current.rain)
        if (citySound) citySound.volume(audioVolumesRef.current.city)
        if (tickingClockSound) tickingClockSound.volume(audioVolumesRef.current.clock)
      } catch (error) {
        console.error("Error adjusting audio volumes:", error)
      }
    }
  }, [timeOfDay, soundsEnabled, soundsLoaded, backgroundMusic, rainSound, citySound, tickingClockSound])

  // Memoize time change handler to prevent recreation on every render
  const handleTimeChange = useCallback((newTime: number) => {
    // Ensure time is within 0-24 range
    const normalizedTime = ((newTime % 24) + 24) % 24
    setTimeOfDay(normalizedTime)
  }, [])

  // Memoize cycle speed change handler
  const handleCycleSpeedChange = useCallback((speed: number) => {
    setCycleSpeed(speed)
  }, [])

  // Prevent rapid toggling of sounds
  const toggleSounds = useCallback(async () => {
    // Prevent multiple rapid toggles
    if (isTogglingSound) return
    setIsTogglingSound(true)

    try {
      const newSoundsEnabled = !soundsEnabled
      setSoundsEnabled(newSoundsEnabled)

      if (newSoundsEnabled) {
        // Load sounds if needed
        const loadPromises = []

        if (backgroundMusic && !backgroundMusic.state()) {
          loadPromises.push(
            new Promise<void>((resolve) => {
              backgroundMusic.once("load", () => resolve())
              backgroundMusic.once("loaderror", () => {
                console.log("Failed to load background music")
                resolve()
              })
              backgroundMusic.load()
            }),
          )
        }

        if (rainSound && !rainSound.state()) {
          loadPromises.push(
            new Promise<void>((resolve) => {
              rainSound.once("load", () => resolve())
              rainSound.once("loaderror", () => {
                console.log("Failed to load rain sound")
                resolve()
              })
              rainSound.load()
            }),
          )
        }

        if (citySound && !citySound.state()) {
          loadPromises.push(
            new Promise<void>((resolve) => {
              citySound.once("load", () => resolve())
              citySound.once("loaderror", () => {
                console.log("Failed to load city sound")
                resolve()
              })
              citySound.load()
            }),
          )
        }

        if (tickingClockSound && !tickingClockSound.state()) {
          loadPromises.push(
            new Promise<void>((resolve) => {
              tickingClockSound.once("load", () => resolve())
              tickingClockSound.once("loaderror", () => {
                console.log("Failed to load ticking clock sound")
                resolve()
              })
              tickingClockSound.load()
            }),
          )
        }

        // Wait for all sounds to load
        await Promise.all(loadPromises).catch(() => {
          console.log("Some sounds failed to load")
        })

        setSoundsLoaded(true)

        // Play sounds with proper error handling and sequencing
        const playSound = (sound: Howl | null, delay: number, volume: number) => {
          if (!sound) return

          setTimeout(() => {
            try {
              if (sound.state() === "loaded") {
                sound.volume(volume)
                sound.play()
              }
            } catch (e) {
              console.error("Error playing sound:", e)
            }
          }, delay)
        }

        playSound(backgroundMusic, 0, audioVolumesRef.current.music)
        playSound(rainSound, 300, audioVolumesRef.current.rain)
        playSound(citySound, 600, audioVolumesRef.current.city)
        playSound(tickingClockSound, 900, audioVolumesRef.current.clock)
      } else {
        // Stop sounds with proper error handling and sequencing
        const stopSound = (sound: Howl | null, delay: number) => {
          if (!sound) return

          setTimeout(() => {
            try {
              sound.fade(sound.volume(), 0, 300)
              setTimeout(() => {
                try {
                  if (sound.playing()) {
                    sound.pause()
                  }
                } catch (e) {
                  console.error("Error pausing sound:", e)
                }
              }, 300)
            } catch (e) {
              console.error("Error fading sound:", e)
            }
          }, delay)
        }

        stopSound(backgroundMusic, 0)
        stopSound(rainSound, 100)
        stopSound(citySound, 200)
        stopSound(tickingClockSound, 300)
      }
    } catch (error) {
      console.error("Error toggling sounds:", error)
    } finally {
      // Allow toggling again after a short delay
      setTimeout(() => {
        setIsTogglingSound(false)
      }, 1000)
    }
  }, [isTogglingSound, soundsEnabled, backgroundMusic, rainSound, citySound, tickingClockSound])

  // Play desk interaction sounds (paper rustle + typewriter click)
  const playDeskInteractionSounds = useCallback(() => {
    // Sound functionality removed to fix loading errors
    console.log("Desk interaction - sound disabled")
  }, [])

  const handleShowEvidence = useCallback(
    (evidence: Evidence) => {
      // Play desk interaction sounds instead of click sound
      playDeskInteractionSounds()
      setSelectedEvidence(evidence)
    },
    [playDeskInteractionSounds],
  )

  // Update the handleShowEvidence function to pass the crypto evidence to the Room component
  const handleShowCryptoEvidence = useCallback(
    (evidence: CryptoEvidence) => {
      // Play desk interaction sounds instead of click sound
      playDeskInteractionSounds()
      setSelectedCryptoEvidence(evidence)
    },
    [playDeskInteractionSounds],
  )

  // Add these handler functions
  const handleOpenFileDrawer = useCallback(
    (title: string, token: string, articleUrl: string) => {
      // Play desk interaction sounds instead of click sound
      playDeskInteractionSounds()
      setSelectedFileDrawer({ title, token, articleUrl })
    },
    [playDeskInteractionSounds],
  )

  const handleShowPhoneCall = useCallback(() => {
    // Play desk interaction sounds instead of click sound
    playDeskInteractionSounds()
    setShowPhoneCall(true)
  }, [playDeskInteractionSounds])

  const handleCloseEvidence = useCallback(() => {
    // Play desk interaction sounds instead of click sound
    playDeskInteractionSounds()
    setSelectedEvidence(null)
  }, [playDeskInteractionSounds])

  const focusOnObject = useCallback((position: [number, number, number], target: [number, number, number]) => {
    setCameraPosition(position)
    setCameraTarget(target)

    if (controlsRef.current) {
      controlsRef.current.target.set(target[0], target[1], target[2])
    }
  }, [])

  const resetCamera = useCallback(() => {
    setCameraPosition([0, 1.5, 4])
    setCameraTarget([0, 1, 0])

    if (controlsRef.current) {
      controlsRef.current.target.set(0, 1, 0)
    }
  }, [])

  // Simple fallback component for Suspense
  const FallbackComponent = () => (
    <mesh position={[0, 1, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="white" />
    </mesh>
  )

  // Toggle between full and simplified room
  const toggleRoomMode = useCallback(() => {
    setUseSimplifiedRoom((prev) => !prev)
  }, [])

  if (renderFailed) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Detective Office</h1>
        <div className="w-24 h-24 bg-gray-700 animate-pulse mb-6"></div>
        <p className="mb-2">Failed to initialize 3D environment</p>
        <p className="text-sm text-gray-400 mb-4">Your browser may have limited WebGL support.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <>
      <div ref={canvasRef} className="fixed inset-0 bg-black magnifying-glass-cursor">
        <Canvas
          shadows
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
            preserveDrawingBuffer: true,
          }}
          onCreated={({ gl, scene }) => {
            // Force pixel ratio to 1 for better performance
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

            // Set clear color to ensure background isn't transparent
            gl.setClearColor("#000000", 1)

            // Set scene background to black
            scene.background = new THREE.Color("#000000")

            console.log("Canvas created successfully")
            setRendererInitialized(true)
          }}
          onError={(error) => {
            console.error("Three.js error:", error)
            setRenderFailed(true)
          }}
        >
          {/* Add strong ambient and directional lights */}
          <ambientLight intensity={1.0} /> {/* Increased from 0.5 */}
          <directionalLight position={[5, 10, 7.5]} intensity={2} castShadow /> {/* Increased from 1 */}
          <directionalLight position={[-5, 10, -7.5]} intensity={1} castShadow /> {/* Added second light */}
          <fog attach="fog" args={["#0a0a0f", 8, 30]} />
          <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
          <Suspense fallback={<FallbackComponent />}>
            {useSimplifiedRoom ? (
              <SimplifiedRoom />
            ) : (
              <>
                <Room
                  onShowEvidence={handleShowEvidence}
                  onShowCryptoEvidence={handleShowCryptoEvidence}
                  onOpenFileDrawer={handleOpenFileDrawer}
                  onShowPhoneCall={handleShowPhoneCall}
                  focusOnObject={focusOnObject}
                  resetCamera={resetCamera}
                  timeOfDay={timeOfDay}
                />
                <RainEffect timeOfDay={timeOfDay} />
                <CityBackdrop timeOfDay={timeOfDay} />
                <DayNightCycle timeOfDay={timeOfDay} cycleSpeed={cycleSpeed} onTimeChange={handleTimeChange} />
              </>
            )}
            <Environment preset="night" />
          </Suspense>
          <OrbitControls
            ref={controlsRef}
            target={cameraTarget}
            maxPolarAngle={Math.PI / 2}
            minDistance={2}
            maxDistance={8}
            enableDamping
            dampingFactor={0.05}
          />
        </Canvas>
      </div>

      {selectedEvidence && <EvidenceModal evidence={selectedEvidence} onClose={handleCloseEvidence} />}

      {/* Time control UI */}
      <TimeControl
        timeOfDay={timeOfDay}
        onTimeChange={handleTimeChange}
        cycleSpeed={cycleSpeed}
        onCycleSpeedChange={handleCycleSpeedChange}
      />

      {/* Sound controls */}
      <div className="fixed bottom-4 right-4 z-10 flex space-x-2">
        <button
          className={`rounded-full bg-gray-800/70 p-2 text-white hover:bg-gray-700/70 transition-colors ${
            isTogglingSound ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={toggleSounds}
          disabled={isTogglingSound}
        >
          <span className="sr-only">Toggle Sounds</span>
          {soundsEnabled ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
      </div>

      {/* Camera reset button */}
      <button
        className="fixed top-4 right-4 z-10 rounded-full bg-gray-800/70 p-2 text-white hover:bg-gray-700/70 transition-colors"
        onClick={resetCamera}
      >
        <span className="sr-only">Reset Camera</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </button>

      {/* Toggle room mode button */}
      <button
        className="fixed top-4 left-4 z-10 rounded-full bg-gray-800/70 p-2 text-white hover:bg-gray-700/70 transition-colors"
        onClick={toggleRoomMode}
        title={useSimplifiedRoom ? "Switch to detailed room" : "Switch to simplified room"}
      >
        <span className="sr-only">Toggle Room Mode</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>

      {selectedCryptoEvidence && (
        <CryptoEvidenceModal evidence={selectedCryptoEvidence} onClose={() => setSelectedCryptoEvidence(null)} />
      )}
      {selectedFileDrawer && (
        <FileDrawerModal
          title={selectedFileDrawer.title}
          token={selectedFileDrawer.token}
          articleUrl={selectedFileDrawer.articleUrl}
          onClose={() => setSelectedFileDrawer(null)}
        />
      )}
      {showPhoneCall && <PhoneCallModal onClose={() => setShowPhoneCall(false)} />}
    </>
  )
}
