"use client"

import { useState } from "react"

type TimeControlProps = {
  timeOfDay: number
  onTimeChange: (time: number) => void
  cycleSpeed: number
  onCycleSpeedChange: (speed: number) => void
}

export default function TimeControl({ timeOfDay, onTimeChange, cycleSpeed, onCycleSpeedChange }: TimeControlProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Format time as HH:MM
  const formatTime = (time: number) => {
    const hours = Math.floor(time)
    const minutes = Math.floor((time - hours) * 60)
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  }

  // Get time of day description
  const getTimeDescription = () => {
    if (timeOfDay >= 5 && timeOfDay < 10) return "Morning"
    if (timeOfDay >= 10 && timeOfDay < 17) return "Day"
    if (timeOfDay >= 17 && timeOfDay < 21) return "Evening"
    return "Night"
  }

  // Get preset times
  const setPresetTime = (preset: string) => {
    switch (preset) {
      case "morning":
        onTimeChange(7)
        break
      case "day":
        onTimeChange(13)
        break
      case "evening":
        onTimeChange(19)
        break
      case "night":
        onTimeChange(23)
        break
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-10">
      <div className="bg-gray-900/80 text-white rounded-lg p-2 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Time icon based on time of day */}
            {timeOfDay >= 5 && timeOfDay < 17 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
            <span className="font-medium">{formatTime(timeOfDay)}</span>
            <span className="text-sm text-gray-300">{getTimeDescription()}</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2 p-1 hover:bg-gray-700/50 rounded-full transition-colors"
          >
            {isExpanded ? (
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
                <polyline points="18 15 12 9 6 15" />
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
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3 space-y-3">
            {/* Time slider */}
            <div className="space-y-1">
              <label htmlFor="time-slider" className="text-xs text-gray-300">
                Time of Day
              </label>
              <input
                id="time-slider"
                type="range"
                min="0"
                max="24"
                step="0.1"
                value={timeOfDay}
                onChange={(e) => onTimeChange(Number.parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Cycle speed slider */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label htmlFor="cycle-speed" className="text-xs text-gray-300">
                  Cycle Speed
                </label>
                <span className="text-xs text-gray-300">
                  {cycleSpeed === 0 ? "Manual" : `${cycleSpeed.toFixed(1)}x`}
                </span>
              </div>
              <input
                id="cycle-speed"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={cycleSpeed}
                onChange={(e) => onCycleSpeedChange(Number.parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Preset buttons */}
            <div className="grid grid-cols-4 gap-1">
              <button
                onClick={() => setPresetTime("morning")}
                className="bg-blue-500/30 hover:bg-blue-500/50 rounded py-1 text-xs transition-colors"
              >
                Morning
              </button>
              <button
                onClick={() => setPresetTime("day")}
                className="bg-yellow-500/30 hover:bg-yellow-500/50 rounded py-1 text-xs transition-colors"
              >
                Day
              </button>
              <button
                onClick={() => setPresetTime("evening")}
                className="bg-orange-500/30 hover:bg-orange-500/50 rounded py-1 text-xs transition-colors"
              >
                Evening
              </button>
              <button
                onClick={() => setPresetTime("night")}
                className="bg-indigo-900/50 hover:bg-indigo-900/70 rounded py-1 text-xs transition-colors"
              >
                Night
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
