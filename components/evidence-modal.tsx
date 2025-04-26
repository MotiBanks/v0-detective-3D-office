"use client"

import { useEffect, useState, useRef } from "react"
import { X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import type { Evidence } from "./detective-room"

type EvidenceModalProps = {
  evidence: Evidence
  onClose: () => void
}

export default function EvidenceModal({ evidence, onClose }: EvidenceModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isTyping, setIsTyping] = useState(true)
  const [typedText, setTypedText] = useState("")
  const [audioEnabled, setAudioEnabled] = useState(false)
  const typewriterRef = useRef<HTMLAudioElement | null>(null)
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Animate in
    setIsVisible(true)

    // Zoom in effect
    setTimeout(() => {
      setIsZoomed(true)
    }, 100)

    // Typewriter effect
    let index = 0
    typingTimerRef.current = setInterval(() => {
      if (index < evidence.description.length) {
        setTypedText((prev) => prev + evidence.description.charAt(index))
        index++
      } else {
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current)
          typingTimerRef.current = null
        }
        setIsTyping(false)
      }
    }, 20)

    // Add escape key listener
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }

    window.addEventListener("keydown", handleEscKey)

    // Initialize audio but don't play automatically
    try {
      if (!typewriterRef.current) {
        typewriterRef.current = new Audio("/sounds/typewriter.mp3")
        typewriterRef.current.volume = 0.2
        typewriterRef.current.loop = true

        // Remove the error event listener to avoid console errors
        typewriterRef.current.onerror = null
      }
    } catch (error) {
      console.log("Could not initialize typewriter sound, continuing without sound")
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey)

      // Clear typing timer
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current)
        typingTimerRef.current = null
      }

      // Safely stop typewriter sound
      if (typewriterRef.current) {
        try {
          if (audioEnabled) {
            typewriterRef.current.pause()
          }
          typewriterRef.current = null
        } catch (error) {
          console.log("Error cleaning up typewriter sound")
        }
      }
    }
  }, [evidence.description, audioEnabled])

  const handleClose = () => {
    // Safely stop typewriter sound
    if (typewriterRef.current && audioEnabled) {
      try {
        typewriterRef.current.pause()
      } catch (error) {
        console.log("Error stopping typewriter sound")
      }
    }

    // Clear typing timer
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current)
      typingTimerRef.current = null
    }

    setIsZoomed(false)
    setIsVisible(false)
    setTimeout(onClose, 500) // Wait for animation to complete
  }

  const toggleAudio = () => {
    if (!typewriterRef.current) return

    try {
      if (audioEnabled) {
        typewriterRef.current.pause()
        setAudioEnabled(false)
      } else {
        // Play with user interaction (this should work)
        const playPromise = typewriterRef.current.play()

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setAudioEnabled(true)
            })
            .catch((error) => {
              console.log("Audio playback prevented by browser", error)
            })
        }
      }
    } catch (error) {
      console.log("Error toggling audio", error)
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-all duration-500 ${
        isVisible ? "bg-black/70 opacity-100" : "bg-black/0 opacity-0"
      }`}
      onClick={handleClose}
    >
      <Card
        className={`w-full max-w-md border-amber-900/50 bg-amber-50/95 transition-all duration-500 ${
          isZoomed ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="relative border-b border-amber-900/20 bg-amber-100/50">
          <Button variant="ghost" size="icon" className="absolute right-2 top-2 text-amber-900" onClick={handleClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          <CardTitle className="font-serif text-amber-900">{evidence.title}</CardTitle>
          <CardDescription className="font-mono text-amber-700">CONFIDENTIAL EVIDENCE</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="overflow-hidden rounded-md border-2 border-amber-900/30 shadow-lg">
            <img
              src={evidence.imageUrl || "/placeholder.svg"}
              alt={evidence.title}
              className="aspect-video w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="font-mono text-sm leading-relaxed text-amber-900 min-h-[120px]">
            {typedText}
            {isTyping && <span className="inline-block w-2 h-4 bg-amber-900 ml-1 animate-pulse"></span>}
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xs font-mono text-amber-700/70">
              Case #: 42-B-7
              <br />
              Date: April 14, 1947
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="border-amber-900/30 text-amber-900 hover:bg-amber-200/50"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleAudio()
                }}
              >
                {audioEnabled ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </svg>
                )}
                <span className="sr-only">{audioEnabled ? "Mute" : "Unmute"}</span>
              </Button>
              <Button
                variant="outline"
                className="border-amber-900/30 text-amber-900 hover:bg-amber-200/50"
                onClick={handleClose}
              >
                Close File
              </Button>
            </div>
          </div>
        </CardContent>
        {evidence.blockchainLink && (
          <CardFooter className="border-t border-amber-900/20 bg-amber-100/30 px-6 py-3">
            <span className="flex items-center gap-2 text-xs font-mono text-amber-800">
              <ExternalLink size={12} />
              Evidence Reference #{evidence.blockchainLink.slice(-6)}
            </span>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
