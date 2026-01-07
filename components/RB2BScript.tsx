"use client"

import { useEffect } from 'react'
import { initRB2B } from '@/lib/reb2b'

/**
 * RB2B Tracking Component
 * Add this to your layout to enable visitor identification
 */
export default function RB2BScript() {
  useEffect(() => {
    // Initialize RB2B tracking when component mounts
    initRB2B()
  }, [])

  return null // This component doesn't render anything
}
