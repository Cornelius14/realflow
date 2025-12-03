"use client"

import { useEffect, useState, useCallback } from "react"
import { VapiClient } from "@/lib/vapi/client"

export function useVapi() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [vapiClient, setVapiClient] = useState<VapiClient | null>(null)

  useEffect(() => {
    // Initialize Vapi client with environment variables
    // Note: These are INTENTIONALLY public keys meant for client-side use
    // NEXT_PUBLIC_VAPI_PUBLIC_KEY is Vapi's "Public API Key" - safe for browsers
    // NEXT_PUBLIC_VAPI_ASSISTANT_ID is a public assistant identifier
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID

    if (publicKey && assistantId) {
      const client = new VapiClient({
        publicKey,
        assistantId,
      })

      client.onCallStart(() => {
        setIsCallActive(true)
        setIsLoading(false)
      })

      client.onCallEnd(() => {
        setIsCallActive(false)
      })

      client.onError((err) => {
        setError(err.message || "An error occurred")
        setIsLoading(false)
        setIsCallActive(false)
      })

      setVapiClient(client)
    } else {
      console.warn(
        "Vapi credentials not found. Please add NEXT_PUBLIC_VAPI_PUBLIC_KEY and NEXT_PUBLIC_VAPI_ASSISTANT_ID to your environment variables.",
      )
    }
  }, [])

  const startCall = useCallback(async () => {
    if (!vapiClient) {
      setError("Vapi not initialized")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      await vapiClient.startCall()
    } catch (err: any) {
      setError(err.message || "Failed to start call")
      setIsLoading(false)
    }
  }, [vapiClient])

  const endCall = useCallback(async () => {
    if (!vapiClient) return

    try {
      await vapiClient.endCall()
      setIsCallActive(false)
    } catch (err: any) {
      setError(err.message || "Failed to end call")
    }
  }, [vapiClient])

  return {
    isCallActive,
    isLoading,
    error,
    startCall,
    endCall,
  }
}
