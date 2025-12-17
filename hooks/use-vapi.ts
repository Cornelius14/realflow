"use client"

import { useEffect, useState, useCallback } from "react"
import { vapi } from "@/lib/vapi/client"

export function useVapi() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [volumeLevel, setVolumeLevel] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Call start event
    vapi.on("call-start", () => {
      console.log("Call started")
      setIsCallActive(true)
      setIsLoading(false)
      setError(null)
    })

    // Call end event
    vapi.on("call-end", () => {
      console.log("Call ended")
      setIsCallActive(false)
      setIsSpeaking(false)
      setVolumeLevel(0)
      setTranscript("")
      setError(null) // Clear any error state
      setIsLoading(false)
    })

    // Speech events
    vapi.on("speech-start", () => {
      console.log("AI started speaking")
      setIsSpeaking(true)
    })

    vapi.on("speech-end", () => {
      console.log("AI stopped speaking")
      setIsSpeaking(false)
    })

    // Volume level
    vapi.on("volume-level", (level: number) => {
      setVolumeLevel(level)
    })

    // Message/transcript events
    vapi.on("message", (message: any) => {
      console.log("Vapi message:", message)
      if (message.type === "transcript" && message.transcript) {
        setTranscript(prev => prev + (prev ? " " : "") + message.transcript)
      }
    })

    // Error events
    vapi.on("error", (err: any) => {
      console.log("Vapi error:", err)

      // Ignore empty error objects (these happen on normal call end)
      const errorString = JSON.stringify(err)
      if (errorString === '{}') {
        console.log("Call ended - ignoring empty error")
        return
      }

      const errorMessage = err?.message || err?.error || (typeof err === 'string' ? err : "Call ended")
      setError(errorMessage)
      setIsLoading(false)
      setIsCallActive(false)
    })

    // Cleanup
    return () => {
      vapi.removeAllListeners()
    }
  }, [])

  const startCall = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID) {
      setError("Missing assistant ID")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setTranscript("")
      console.log("Starting call...")

      await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID)
    } catch (err: any) {
      console.error("Failed to start call:", err)
      const errorMessage = err?.message || err?.error || (typeof err === 'string' ? err : "Failed to start call")
      setError(errorMessage)
      setIsLoading(false)
    }
  }, [])

  const endCall = useCallback(async () => {
    try {
      console.log("Ending call...")
      await vapi.stop()
      setIsCallActive(false)
      setIsSpeaking(false)
      setVolumeLevel(0)
    } catch (err: any) {
      console.error("Failed to end call:", err)
      const errorMessage = err?.message || err?.error || (typeof err === 'string' ? err : "Failed to end call")
      setError(errorMessage)
    }
  }, [])

  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted
    vapi.setMuted(newMutedState)
    setIsMuted(newMutedState)
    console.log("Muted:", newMutedState)
  }, [isMuted])

  return {
    isCallActive,
    isLoading,
    isSpeaking,
    volumeLevel,
    transcript,
    isMuted,
    error,
    startCall,
    endCall,
    toggleMute,
  }
}
