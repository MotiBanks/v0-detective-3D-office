"use client"

import { useEffect, useState } from "react"
import { X, ExternalLink, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

type FileDrawerModalProps = {
  title: string
  token: string
  articleUrl: string
  onClose: () => void
}

export default function FileDrawerModal({ title, token, articleUrl, onClose }: FileDrawerModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

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

    return () => {
      window.removeEventListener("keydown", handleEscKey)
    }
  }, [])

  const handleClose = () => {
    setIsZoomed(false)
    setIsVisible(false)
    setTimeout(onClose, 500) // Wait for animation to complete
  }

  const handleArticleClick = () => {
    if (articleUrl) {
      window.open(articleUrl, "_blank", "noopener,noreferrer")
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
        className={`w-full max-w-md border-gray-700/50 bg-gray-100/95 transition-all duration-500 ${
          isZoomed ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="relative border-b border-gray-700/20 bg-gray-200/50">
          <Button variant="ghost" size="icon" className="absolute right-2 top-2 text-gray-700" onClick={handleClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          <CardTitle className="font-serif text-gray-900">{title}</CardTitle>
          <CardDescription className="font-mono text-gray-700">CASE FILE: {token}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-gray-200/50 rounded-md">
            <FileText className="h-16 w-16 text-gray-700" />
            <p className="text-center text-gray-700">
              This file contains detailed information about the {token} presale investigation.
            </p>
            <Button
              variant="outline"
              className="border-gray-700/30 text-gray-900 hover:bg-gray-200/50"
              onClick={handleArticleClick}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Medium Article
            </Button>
          </div>
        </CardContent>
        <CardFooter className="border-t border-gray-700/20 bg-gray-200/30 px-6 py-3">
          <span className="flex items-center gap-2 text-xs font-mono text-gray-700">
            <ExternalLink size={12} />
            Evidence Reference #
            {Math.floor(Math.random() * 1000000)
              .toString()
              .padStart(6, "0")}
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
