"use client"

import { useEffect, useState, useRef } from "react"
import { X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

type PhoneCallModalProps = {
  onClose: () => void
}

export default function PhoneCallModal({ onClose }: PhoneCallModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isRinging, setIsRinging] = useState(true)
  const [callAnswered, setCallAnswered] = useState(false)
  const [message, setMessage] = useState("")
  const ringingSoundRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Animate in
    setIsVisible(true)

    // Zoom in effect
    setTimeout(() => {
      setIsZoomed(true)
    }, 100)

    // Add escape key listener
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }

    window.addEventListener("keydown", handleEscKey)

    // Try to set up ringing sound
    try {
      if (!ringingSoundRef.current) {
        ringingSoundRef.current = new Audio()
        ringingSoundRef.current.volume = 0.3
        ringingSoundRef.current.loop = true
        ringingSoundRef.current.src = "/sounds/click.mp3" // Using click sound as a substitute
      }

      const playSound = async () => {
        try {
          if (ringingSoundRef.current) {
            await ringingSoundRef.current.play().catch(() => {
              console.log("Browser prevented autoplay, continuing without sound")
            })
          }
        } catch (err) {
          console.log("Failed to play ringing sound, continuing without sound")
        }
      }

      playSound()
    } catch (error) {
      console.log("Could not initialize ringing sound, continuing without sound")
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey)

      // Safely stop ringing sound
      if (ringingSoundRef.current) {
        try {
          ringingSoundRef.current.pause()
          ringingSoundRef.current = null
        } catch (error) {
          console.log("Error cleaning up ringing sound")
        }
      }
    }
  }, [])

  const handleClose = () => {
    // Safely stop ringing sound
    if (ringingSoundRef.current) {
      try {
        ringingSoundRef.current.pause()
      } catch (error) {
        console.log("Error stopping ringing sound")
      }
    }

    setIsZoomed(false)
    setIsVisible(false)
    setTimeout(onClose, 500) // Wait for animation to complete
  }

  const handleAnswer = () => {
    // Stop ringing sound
    if (ringingSoundRef.current) {
      try {
        ringingSoundRef.current.pause()
      } catch (error) {
        console.log("Error stopping ringing sound")
      }
    }

    setIsRinging(false)
    setCallAnswered(true)

    // Simulate typing message
    const fullMessage =
      "This is the SEC. We've been monitoring your investigation into these presales. Continue your work, but be careful. These people have powerful connections. We'll be in touch."
    let index = 0

    const typeInterval = setInterval(() => {
      if (index < fullMessage.length) {
        setMessage((prev) => prev + fullMessage.charAt(index))
        index++
      } else {
        clearInterval(typeInterval)
      }
    }, 30)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-all duration-500 ${
        isVisible ? "bg-black/70 opacity-100" : "bg-black/0 opacity-0"
      }`}
      onClick={handleClose}
    >
      <Card
        className={`w-full max-w-md border-red-900/50 bg-red-50/95 transition-all duration-500 ${
          isZoomed ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="relative border-b border-red-900/20 bg-red-100/50">
          <Button variant="ghost" size="icon" className="absolute right-2 top-2 text-red-900" onClick={handleClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          <CardTitle className="font-serif text-red-900">Incoming Call</CardTitle>
          <CardDescription className="font-mono text-red-700">
            {isRinging ? "UNKNOWN CALLER" : "SEC ENFORCEMENT DIVISION"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {isRinging ? (
            <div className="flex flex-col items-center justify-center space-y-6 p-6">
              <div className="h-20 w-20 rounded-full bg-red-200 flex items-center justify-center animate-pulse">
                <Phone className="h-10 w-10 text-red-700" />
              </div>
              <p className="text-center text-red-700 text-lg font-semibold">Phone is ringing...</p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="border-red-700/30 text-red-900 hover:bg-red-200/50"
                  onClick={handleClose}
                >
                  Decline
                </Button>
                <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAnswer}>
                  Answer
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-red-100/50 p-4 rounded-lg min-h-[200px] flex flex-col">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-red-200 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-red-700" />
                </div>
                <span className="font-semibold text-red-900">SEC Agent</span>
              </div>
              <div className="font-mono text-sm leading-relaxed text-red-900 flex-grow">
                {message}
                {message.length < 100 && <span className="inline-block w-2 h-4 bg-red-900 ml-1 animate-pulse"></span>}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-red-900/20 bg-red-100/30 px-6 py-3">
          <span className="flex items-center gap-2 text-xs font-mono text-red-800">
            {callAnswered ? "Call in progress..." : "Call waiting..."}
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
