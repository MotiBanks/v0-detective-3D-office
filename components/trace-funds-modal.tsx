"use client"

import React from "react"
import { useEffect, useState } from "react"
import { X, ArrowRight, Wallet, Building, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

type TraceFundsModalProps = {
  onClose: () => void
}

export default function TraceFundsModal({ onClose }: TraceFundsModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  // Removed all Ethereum-related functionality
  const steps = [
    {
      title: "Investigation Ongoing",
      description: "This feature has been disabled",
      icon: Wallet,
      address: "Feature disabled",
    },
    {
      title: "No Blockchain Data",
      description: "Blockchain analysis not available",
      icon: ArrowRight,
      address: "No data available",
    },
    {
      title: "Investigation Paused",
      description: "Further analysis not available",
      icon: Building,
      address: "No data available",
    },
    {
      title: "Case Closed",
      description: "Investigation concluded",
      icon: DollarSign,
      address: "No data available",
    },
  ]

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

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
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
        className={`w-full max-w-md border-blue-900/50 bg-blue-50/95 transition-all duration-500 ${
          isZoomed ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="relative border-b border-blue-900/20 bg-blue-100/50">
          <Button variant="ghost" size="icon" className="absolute right-2 top-2 text-blue-900" onClick={handleClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          <CardTitle className="font-serif text-blue-900">Feature Disabled</CardTitle>
          <CardDescription className="font-mono text-blue-700">FUNCTIONALITY REMOVED</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentStep ? "bg-blue-600 h-3 w-3" : index < currentStep ? "bg-blue-400" : "bg-blue-200"
                }`}
              />
            ))}
          </div>

          <div className="bg-blue-100/50 p-6 rounded-lg">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-blue-200 flex items-center justify-center">
                {steps[currentStep].icon &&
                  React.createElement(steps[currentStep].icon, { className: "h-8 w-8 text-blue-700" })}
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-blue-900 mb-2">{steps[currentStep].title}</h3>
            <p className="text-center text-blue-700 mb-4">{steps[currentStep].description}</p>
            <div className="bg-blue-200/50 p-3 rounded font-mono text-sm text-blue-900 break-all text-center">
              {steps[currentStep].address}
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              className="border-blue-700/30 text-blue-900 hover:bg-blue-200/50"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button
                variant="outline"
                className="border-blue-700/30 text-blue-900 hover:bg-blue-200/50"
                onClick={nextStep}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-blue-700/30 text-blue-900 hover:bg-blue-200/50"
                onClick={handleClose}
              >
                Close
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t border-blue-900/20 bg-blue-100/30 px-6 py-3">
          <span className="flex items-center gap-2 text-xs font-mono text-blue-800">
            Step {currentStep + 1} of {steps.length}
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
