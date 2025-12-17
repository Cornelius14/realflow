"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ChevronRight, Clock, Menu, ChevronLeft, Check, Play, Pause, Star, LogIn, Phone, PhoneOff, Mic, MicOff } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import BookDemoModal from "./components/BookDemoModal"
import DealFinder from "../components/DealFinder"
import { useVapi } from "@/hooks/use-vapi"
import { usePathname, useRouter } from "next/navigation"

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)

  const [isLiveDemoModalOpen, setIsLiveDemoModalOpen] = useState(false)
  const [liveDemoPassword, setLiveDemoPassword] = useState("")
  const [liveDemoError, setLiveDemoError] = useState("")

  const DEMO_PASSWORD = "1409"

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1)

  type PersonaKey = "wholesalers" | "creOwners" | "lenders" | "mortgageLenders"
  const [activePersona, setActivePersona] = useState<PersonaKey>("wholesalers")

  const [currentSlide, setCurrentSlide] = useState(0)

  const [playingCallId, setPlayingCallId] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [showCallModal, setShowCallModal] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)
  const [callForm, setCallForm] = useState({ name: "", email: "", phone: "" })
  const {
    isCallActive,
    isLoading,
    isSpeaking,
    volumeLevel,
    transcript,
    isMuted,
    error: vapiError,
    startCall,
    endCall,
    toggleMute
  } = useVapi()

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      // Show floating button after scrolling 400px
      setShowFloatingButton(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToRealCalls = () => {
    document.getElementById("real-calls-happening-now")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleCloseDemo = () => {
    setDemoOpen(false)
    setIsMobileMenuOpen(false)
  }

  const handleLiveDemoClick = () => {
    if (typeof window !== "undefined" && window.localStorage.getItem("realflow-demo-access") === "true") {
      window.location.href = "/demo"
    } else {
      setIsLiveDemoModalOpen(true)
      setLiveDemoPassword("")
      setLiveDemoError("")
    }
  }

  const handleLiveDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (liveDemoPassword === DEMO_PASSWORD) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("realflow-demo-access", "true")
      }
      setIsLiveDemoModalOpen(false)
      window.location.href = "/demo"
    } else {
      setLiveDemoError("Incorrect code. Please try again.")
    }
  }

  function handleCallFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setCallForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleCallSubmit(e: React.FormEvent) {
    e.preventDefault()

    const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbzHRlsghBzHXJPcA_a6ynRXX1hGCUW26kbIdprgvpSlQFjDevpBJDwESbx40JWQSvmF/exec"

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: callForm.name,
          email: callForm.email,
          phone: callForm.phone,
          type: "call_request",
        }),
      })
    } catch (err) {
      console.error("Error sending call data to Google Sheet", err)
    }

    await startCall()
    setShowCallModal(false)
  }

  const calls = [
    {
      id: 1,
      type: "Inbound",
      city: "Chicago",
      region: "IL",
      role: "Borrower",
      context: "caller seeking an investment property loan for a $1M Chicago-based purchase and after qualification agrees to a follow-up call.",
      rating: "5 / 5",
      status: "Qualified",
      timeAgo: "8 minutes ago",
      duration: "4m 12s",
      audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/019a8dbd-b3ae-755f-8b33-0c9f5970128b-1763314784584-934f606d-0d10-4d50-8d5e-67f18ac85a2f-stereo-9lBDy10XxL1jTL9e9h2NbnsiJxWX6a.wav",
    },
    {
      id: 2,
      type: "Outbound",
      city: "Miami-Dade County",
      region: "FL",
      role: "Outreach",
      context: "agent cold calls owner regarding a property, identifies selling intent, incorporates all information and is able to set up a future call for sale.",
      rating: "5 / 5",
      status: "Qualified",
      timeAgo: "15 minutes ago",
      duration: "3m 47s",
      audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/019a84a6-32d0-700f-b32a-1a73573451ad-1763162313794-8c849572-c237-479a-8939-9285d9a89a07-stereo-uQVSiyYp98sYT4dHyxbAb1xGBoL21M.wav",
    },
    {
      id: 3,
      type: "Inbound",
      city: "Tampa",
      region: "FL",
      role: "Borrower",
      context: "caller seeking pre-approval for a primary home in Tampa, relocating from NYC, and books a follow-up with a loan officer.",
      rating: "5 / 5",
      status: "Qualified",
      timeAgo: "24 minutes ago",
      duration: "3m 21s",
      audioUrl: "/audio/call3.wav",
    },
  ]

  const handlePlayAudio = (callId: number, audioUrl: string) => {
    if (playingCallId === callId) {
      // Pause current audio
      audioRef.current?.pause()
      setPlayingCallId(null)
    } else {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      // Play new audio
      const audio = new Audio(audioUrl)
      audioRef.current = audio
      audio.play()
      setPlayingCallId(callId)

      // Reset playing state when audio ends
      audio.onended = () => {
        setPlayingCallId(null)
      }
    }
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const personas: { key: PersonaKey; title: string; subtext: string }[] = [
    {
      key: "wholesalers",
      title: "Wholesalers & Investors",
      subtext: "Find motivated sellers before they hit the market.",
    },
    {
      key: "creOwners",
      title: "CRE Owners & Brokers",
      subtext: "Surface off-market owners that match your mandate.",
    },
    {
      key: "lenders",
      title: "Lenders & Capital Providers",
      subtext: "Identify borrowers with real near-term financing needs.",
    },
    {
      key: "mortgageLenders",
      title: "Mortgage Lenders",
      subtext: "Convert inbound borrowers and reach owners with near-term maturities.",
    },
  ]

  const personaContent: Record<
    PersonaKey,
    {
      viewLabel: string
      prospected: { title: string; description: string }
      qualified: { title: string; description: string }
      booked: { title: string; description: string }
    }
  > = {
    wholesalers: {
      viewLabel: "Wholesaler View",
      prospected: {
        title: "Maria Lopez",
        description: "Tampa, FL — Divorce, needs fast close.",
      },
      qualified: {
        title: "Maria Lopez",
        description: "Accepted investor range; wants offer this week.",
      },
      booked: {
        title: "Maria Lopez",
        description: "Call booked Tue 3 PM — attorney looped in.",
      },
    },
    creOwners: {
      viewLabel: "Broker View",
      prospected: {
        title: "Retail Plaza Owner",
        description: "Phoenix, AZ — Exploring sale in 6–12 months.",
      },
      qualified: {
        title: "Retail Plaza Owner",
        description: "Willing to sell with right 1031 exchange timing.",
      },
      booked: {
        title: "Retail Plaza Owner",
        description: "Intro call booked with acquisitions team.",
      },
    },
    lenders: {
      viewLabel: "Lender View",
      prospected: {
        title: "Bridge Loan Prospect",
        description: "Dallas, TX — Repositioning 80-unit asset.",
      },
      qualified: {
        title: "Bridge Loan Prospect",
        description: "Meets DSCR and leverage requirements.",
      },
      booked: {
        title: "Bridge Loan Prospect",
        description: "Terms review call booked within 36 hours.",
      },
    },
    mortgageLenders: {
      viewLabel: "Mortgage Lender View",
      prospected: {
        title: "Homeowner",
        description: "Orlando, FL — Considering cash-out refi.",
      },
      qualified: {
        title: "Homeowner",
        description: "Credit + equity meet guidelines.",
      },
      booked: {
        title: "Homeowner",
        description: "Application call set for Thu 11 AM.",
      },
    },
  }

  const caseStudies = [
    {
      category: "STR Property Management",
      icon: "🏡",
      headline: "0 → 70 properties in 2 months",
      body: "Identified luxury homeowners in legal STR markets and scaled from zero to seventy units.",
      company: "The Solaire Collection",
      name: "Max Zheng",
    },
    // {
    //   category: "Residential Brokerage",
    //   icon: "🏘️",
    //   headline: "6,500 owners → 27 listing calls",
    //   body: "Shifted to proactive owner sourcing, qualified 320, booked 27 calls, and won three exclusives.",
    //   company: "Makras Real Estate",
    //   name: "Victor G. Makras"
    // },
    {
      category: "Industrial Acquisition",
      icon: "🏭",
      headline: "612 warehouses → 6 at target price",
      body: "Found Nashville warehouses, contacted 487, connected with 121, and secured six at target price.",
      company: "Southeast Industrial",
      name: "Industrial Acquisition Team",
    },
    {
      category: "Mortgage Lender",
      icon: "🏦",
      headline: "Missed leads → 3x more funded loans in 60 days",
      body: "Replaced missed inbound calls and web form leads with a 24/7 AI agent that responds immediately, qualifies borrowers, and books them directly to loan officers' calendars.",
      company: "National Mortgage Bank",
      name: "Head of Sales",
    },
    {
      category: "Lending",
      icon: "🏦",
      headline: "612 lender calls in 10 days; quotes in 36 hours",
      body: "Targeted owners with near-term maturities and achieved average quote turnaround of thirty-six hours.",
      company: "Lending Specialty",
      name: "Bar Shechter",
    },
    // {
    //   category: "Commercial Lending",
    //   icon: "🏢",
    //   headline: "Qualified borrowers across major metros",
    //   body: "Surfaced qualified borrowers, connecting us earlier with decision-makers and accelerating deal flow.",
    //   company: "Meridian Capital Group",
    //   name: "Commercial Lending Team",
    // },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % caseStudies.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + caseStudies.length) % caseStudies.length)
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <BookDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              handleCloseDemo()
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src="/images/design-mode/oblique-logo-new.png"
              alt="RealFlow Logo"
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
            />
            <div className="text-lg sm:text-xl md:text-2xl font-serif text-black">RealFlow</div>
          </button>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <a href="#product" className="text-sm md:text-base text-gray-700 hover:text-black transition-colors">
              Product
            </a>
            <a href="#how-it-works" className="text-sm md:text-base text-gray-700 hover:text-black transition-colors">
              How it Works
            </a>
            <a href="#workflows" className="text-sm md:text-base text-gray-700 hover:text-black transition-colors">
              Workflows
            </a>
            <a href="#case-studies" className="text-sm md:text-base text-gray-700 hover:text-black transition-colors">
              Case Studies
            </a>
            <a href="#pricing" className="text-sm md:text-base text-gray-700 hover:text-black transition-colors">
              Pricing
            </a>
            <button
              type="button"
              onClick={handleLiveDemoClick}
              className="flex items-center gap-1.5 text-sm md:text-base font-medium bg-black text-white px-4 py-1.5 rounded-full hover:bg-gray-800 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Live Demo
            </button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              className="hidden sm:flex items-center gap-2 text-sm text-gray-700 hover:text-black px-3"
              onClick={() => window.location.href = 'https://app.realflow.co/signup/'}
            >
              <LogIn className="w-4 h-4" />
              User Login
            </Button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden p-2 text-gray-700 hover:text-black"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-3 text-sm">
              <a href="#product" className="hover:text-gray-900 text-gray-700" onClick={handleCloseDemo}>
                Product
              </a>
              <a href="#how-it-works" className="hover:text-gray-900 text-gray-700" onClick={handleCloseDemo}>
                How it Works
              </a>
              <a href="#workflows" className="hover:text-gray-900 text-gray-700" onClick={handleCloseDemo}>
                Workflows
              </a>
              <a href="#case-studies" className="hover:text-gray-900 text-gray-700" onClick={handleCloseDemo}>
                Case Studies
              </a>
              <a href="#pricing" className="hover:text-gray-900 text-gray-700" onClick={handleCloseDemo}>
                Pricing
              </a>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  handleLiveDemoClick()
                }}
                className="flex items-center gap-1.5 font-medium bg-[#C9A227] text-white px-4 py-2 rounded-full hover:bg-[#B8911F] transition-colors justify-center mt-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Live Demo
              </button>
              <a
                href="#real-calls-happening-now"
                className="hover:text-gray-900 text-gray-700"
                onClick={handleCloseDemo}
              >
                Real Calls
              </a>
              <Button
                onClick={() => setDemoOpen(true)}
                className="bg-black text-white hover:bg-gray-900 rounded-full px-6 py-3 text-sm mt-2 w-full"
              >
                Book a Demo
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-2 sm:pt-8 pb-2 sm:pb-6 md:pb-8 px-4 sm:px-6 lg:px-8 border md:pt-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:pr-12 lg:py-10 relative overflow-hidden min-h-[550px] sm:min-h-[500px] md:min-h-[380px] border border-gray-200 lg:pt-10 lg:pl-0">
            <div className="pointer-events-none absolute inset-y-0 right-0 w-full md:w-[65%] overflow-hidden flex items-center">
              <img
                src="/images/design-mode/sadfa(1).jpeg"
                alt=""
                className="w-full h-full object-cover object-right opacity-40"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/40 to-gray-100/90 md:via-transparent md:to-gray-100/60 pointer-events-none" />

            <div className="max-w-full sm:max-w-md lg:max-w-lg relative z-10 flex flex-col items-center md:items-start text-center md:text-left md:ml-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-black mb-3 leading-tight text-balance md:text-left text-center sm:mb-4 ml-1">
                Voice AI Broker for Real Estate Deals
              </h1>
              <p className="text-base sm:text-lg text-gray-700 mb-5 sm:mb-5 md:mb-8 leading-relaxed">
                Source, qualify and book high intent meetings
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  onClick={() => setShowCallModal(true)}
                  className="bg-black text-white hover:bg-gray-900 rounded-full px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <img src="/images/design-mode/oblique-logo-new.png" alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
                  Talk to RealFlow
                </Button>
                <Button
                  onClick={() => setDemoOpen(true)}
                  variant="outline"
                  className="md:hidden rounded-full px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base border-gray-300 hover:bg-white w-full sm:w-auto bg-white flex items-center justify-center gap-2"
                >
                  Book a Demo
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button
                  onClick={() => setDemoOpen(true)}
                  variant="outline"
                  className="hidden md:inline-flex rounded-full px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base border-gray-300 hover:bg-white w-full sm:w-auto items-center justify-center gap-2"
                >
                  Book a Demo
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by Section */}
      <section className="py-2 sm:py-12 px-4 sm:px-6 lg:px-8"></section>

      {/* Automation Section - How It Works */}
      <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 mt-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-black mb-4 sm:mb-6 leading-tight text-balance px-4">
              How it Works
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-700 max-w-3xl mx-auto leading-snug md:leading-relaxed px-4 break-words">
              Make AI work for you by automating repetitive tasks that your real estate business encounters every single
              day.
            </p>
          </div>

          <DealFinder />

          {/* Desktop Layout - Hidden on mobile */}
          <div className="hidden md:grid gap-8 lg:grid-cols-2 lg:gap-12 mt-12 sm:mt-20">
            {/* LEFT SIDE - How It Works Steps */}
            <div className="lg:pr-4">
              <div className="space-y-5">
                <button
                  onClick={() => setActiveStep(1)}
                  className={`w-full text-left border-l-2 pl-6 pb-5 transition-all ${
                    activeStep === 1 ? "border-black bg-gray-50/50" : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="text-xs text-gray-500 mb-1.5">Step 01</div>
                  <h4
                    className={`text-base md:text-lg lg:text-xl font-serif text-black mb-2 break-words overflow-wrap-anywhere ${
                      activeStep === 1 ? "font-bold" : ""
                    }`}
                  >
                    Tell Us What You're Looking For
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600 leading-snug break-words overflow-wrap-anywhere max-w-none">
                    Describe the exact leads you want using natural language: market, price, property type, timing.
                  </p>
                </button>

                <button
                  onClick={() => setActiveStep(2)}
                  className={`w-full text-left border-l-2 pl-6 pb-5 transition-all ${
                    activeStep === 2 ? "border-black bg-gray-50/50" : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="text-xs text-gray-500 mb-1.5">Step 02</div>
                  <h4
                    className={`text-base md:text-lg lg:text-xl font-serif text-black mb-2 break-words overflow-wrap-anywhere ${
                      activeStep === 2 ? "font-bold" : ""
                    }`}
                  >
                    AI Sources Prospects and Captures Inbound Interest
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600 leading-snug break-words overflow-wrap-anywhere max-w-none">
                    System pulls thousands of matching properties from multiple sources and captures inbound calls,
                    texts, and forms.
                  </p>
                </button>

                <button
                  onClick={() => setActiveStep(3)}
                  className={`w-full text-left border-l-2 pl-6 pb-5 transition-all ${
                    activeStep === 3 ? "border-black bg-gray-50/50" : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="text-xs text-gray-500 mb-1.5">Step 03</div>
                  <h4
                    className={`text-base md:text-lg lg:text-xl font-serif text-black mb-2 break-words overflow-wrap-anywhere ${
                      activeStep === 3 ? "font-bold" : ""
                    }`}
                  >
                    Multi-Channel Outreach
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600 leading-snug break-words overflow-wrap-anywhere max-w-none">
                    AI calls, texts, emails, drops voicemail, and qualifies each owner across channels based on your
                    criteria.
                  </p>
                </button>

                <button
                  onClick={() => setActiveStep(4)}
                  className={`w-full text-left border-l-2 pl-6 transition-all ${
                    activeStep === 4 ? "border-black bg-gray-50/50" : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="text-xs text-gray-500 mb-1.5">Step 04</div>
                  <h4
                    className={`text-base md:text-lg lg:text-xl font-serif text-black mb-2 break-words overflow-wrap-anywhere ${
                      activeStep === 4 ? "font-bold" : ""
                    }`}
                  >
                    Qualified Meetings Booked
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600 leading-snug break-words overflow-wrap-anywhere max-w-none">
                    Only genuinely interested, qualified owners reach your calendar as scheduled meetings—no
                    tire-kickers.
                  </p>
                </button>
              </div>
            </div>

            {/* RIGHT SIDE - Deal Engine Component */}
            <div className="w-full max-w-md mx-auto lg:max-w-none lg:mx-0 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm lg:ml-4">
              <div className="flex items-center justify-between mb-6">
                <div className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-black">
                  Realflow Deal Engine
                </div>
                <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                  Live Pipeline
                </div>
              </div>

              <div className="deal-stage-visual space-y-3 md:grid md:grid-cols-3 md:gap-3 md:space-y-0">
                {/* Column 1: Prospected */}
                <div
                  className={`w-full space-y-3 transition-all ${
                    activeStep === 1 || activeStep === 2 || activeStep === 3 ? "opacity-100" : "opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Prospected</h5>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">127</span>
                  </div>

                  <div
                    className={`bg-gray-50 rounded-lg p-3 border transition-all ${
                      activeStep === 1 ? "border-gray-400 ring-1 ring-gray-300" : "border-gray-200"
                    }`}
                  >
                    <h6 className="text-xs md:text-sm font-semibold text-black mb-2">3400 Commerce Ave</h6>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Charlotte, NC · 32 units, 1990 build · Owner: Smith Capital · Requested rent roll, considering
                      sale this month.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h6 className="text-xs md:text-sm font-semibold text-black mb-2">2156 South Blvd</h6>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Charlotte, NC · 28 units, 1995 build · Owner: Park Properties · Curious about offers, reviewing
                      options.
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 text-center">+ 125 more</p>
                </div>

                {/* Column 2: Qualified */}
                <div
                  className={`w-full space-y-3 transition-all ${
                    activeStep === 2 || activeStep === 3 ? "opacity-100" : "opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Qualified</h5>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                      18
                    </span>
                  </div>

                  <div
                    className={`rounded-lg p-3 border transition-all ${
                      /* Increased background opacity and border saturation for step 2 */
                      activeStep === 2
                        ? "bg-orange-100/80 border-orange-400 ring-1 ring-orange-300"
                        : "bg-orange-50/60 border-orange-200"
                    }`}
                  >
                    <h6 className="text-xs md:text-sm font-semibold text-black mb-2">4850 Tryon Street</h6>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Charlotte, NC · 36 units, 1992 build · Owner: Tryon Holdings · Open to cash offer this week; wants
                      LOI before month-end.
                    </p>
                  </div>

                  <div className="bg-orange-50/50 rounded-lg p-3 border border-orange-100">
                    <h6 className="text-xs md:text-sm font-semibold text-black mb-2">1820 East Blvd</h6>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Charlotte, NC · 24 units, 1988 build · Owner: East Capital · Asked for LOI at ≥ 6.5% cap, ready to
                      close.
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 text-center">+ 16 more</p>
                </div>

                {/* Column 3: Booked */}
                <div
                  className={`w-full space-y-3 transition-all ${
                    activeStep === 3 || activeStep === 4 ? "opacity-100" : "opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Booked</h5>
                    <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded-full text-xs font-medium">5</span>
                  </div>

                  <div
                    className={`rounded-lg p-3 border transition-all ${
                      /* Increased background opacity and border saturation for step 4 */
                      activeStep === 4
                        ? "bg-green-100/80 border-green-500 ring-1 ring-green-400"
                        : "bg-green-50/70 border-green-200"
                    }`}
                  >
                    <h6 className="text-xs md:text-sm font-semibold text-black mb-2">7200 Park Road</h6>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Charlotte, NC · 40 units, 1985 build · Owner: Park Investors · Tour booked Thu 2 PM —
                      decision-maker attending.
                    </p>
                  </div>

                  <div className="bg-green-100/50 rounded-lg p-3 border border-green-100">
                    <h6 className="text-xs md:text-sm font-semibold text-black mb-2">3315 Monroe Road</h6>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Charlotte, NC · 22 units, 1998 build · Owner: Monroe LLC · Call booked Fri 11 AM — reviewing
                      offers same day.
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 text-center">+ 3 more</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:hidden space-y-8 mt-12">
            {/* Step 1 */}
            <div className="rounded-3xl bg-white shadow-sm border border-[#E5E5E5] px-4 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">Step 01</p>
              <h3 className="mt-2 text-lg font-semibold text-neutral-900">Tell Us What You're Looking For</h3>
              <p className="mt-1 text-sm text-neutral-700">
                Describe the exact leads you want using natural language: market, price, property type, timing.
              </p>
              <div className="mt-4 rounded-2xl bg-neutral-900/5 overflow-hidden p-4">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <h6 className="text-xs font-semibold text-black mb-2">3400 Commerce Ave</h6>
                  <p className="text-xs text-gray-600">Charlotte, NC · 32 units</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl bg-white shadow-sm border border-[#E5E5E5] px-4 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">Step 02</p>
              <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                AI Sources Prospects and Captures Inbound Interest
              </h3>
              <p className="mt-1 text-sm text-neutral-700">
                System pulls thousands of matching properties from multiple sources and captures inbound calls, texts,
                and forms.
              </p>
              <div className="mt-4 rounded-2xl bg-neutral-900/5 overflow-hidden p-4">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <h6 className="text-xs font-semibold text-black mb-2">Properties Found</h6>
                  <p className="text-xs text-gray-600">127 matching properties sourced</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl bg-white shadow-sm border border-[#E5E5E5] px-4 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">Step 03</p>
              <h3 className="mt-2 text-lg font-semibold text-neutral-900">Multi-Channel Outreach</h3>
              <p className="mt-1 text-sm text-neutral-700">
                AI calls, texts, emails, drops voicemail, and qualifies each owner across channels based on your
                criteria.
              </p>
              <div className="mt-4 rounded-2xl bg-neutral-900/5 overflow-hidden p-4">
                <div className="bg-orange-100/80 rounded-lg p-3 border border-orange-300">
                  <h6 className="text-xs font-semibold text-black mb-2">4850 Tryon Street</h6>
                  <p className="text-xs text-gray-600">Qualified · Open to offers</p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="rounded-3xl bg-white shadow-sm border border-[#E5E5E5] px-4 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">Step 04</p>
              <h3 className="mt-2 text-lg font-semibold text-neutral-900">Qualified Meetings Booked</h3>
              <p className="mt-1 text-sm text-neutral-700">
                Only genuinely interested, qualified owners reach your calendar as scheduled meetings—no tire-kickers.
              </p>
              <div className="mt-4 rounded-2xl bg-neutral-900/5 overflow-hidden p-4">
                <div className="bg-green-100/80 rounded-lg p-3 border border-green-400">
                  <h6 className="text-xs font-semibold text-black mb-2">7200 Park Road</h6>
                  <p className="text-xs text-gray-600">Tour booked Thu 2 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Calls Section */}
      <section
        id="real-calls-happening-now"
        className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F7F7F7] border-t border-[#E5E5E5]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 mt-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-black mb-4 sm:mb-6 leading-tight text-balance">
              Real Calls Happening Now
            </h2>
            <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed break-words">
              See how RealFlow AI is connecting with property owners and qualifying deals in real-time.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {calls.map((call) => (
              <button
                key={call.id}
                onClick={() => handlePlayAudio(call.id, call.audioUrl)}
                className={`rounded-2xl bg-white p-4 shadow-sm border overflow-hidden min-w-0 text-left transition-all hover:shadow-md ${
                  playingCallId === call.id ? "border-black ring-2 ring-black/20" : "border-neutral-100"
                }`}
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-4 gap-2 flex-wrap min-w-0">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        call.type === "Inbound" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                      }`}
                    >
                      {call.type}
                    </span>
                    {playingCallId === call.id ? (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black hover:bg-gray-800 transition-colors">
                        <Pause className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 transition-colors shadow-md hover:shadow-lg">
                        <Play className="w-4 h-4 text-white ml-0.5" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 break-words min-w-0">{call.timeAgo}</span>
                </div>

                {/* Middle */}
                <div className="mb-4 min-w-0">
                  <p className="text-xs text-gray-500 mb-1 break-words overflow-wrap-anywhere">
                    someone in {call.city}, {call.region}
                  </p>
                  <p className="text-lg font-serif text-black font-bold mb-2 break-words overflow-wrap-anywhere">
                    {call.role} call
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed break-words overflow-wrap-anywhere">
                    {call.context}
                  </p>
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 gap-2 flex-wrap min-w-0">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium flex-shrink-0">
                      {call.status}
                    </span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-700">{call.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 flex-shrink-0">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{call.duration}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Help Section */}
      <section id="workflows" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 mt-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-black mb-4 sm:mb-6 leading-tight text-balance px-4">
              Who We Help
            </h2>
          </div>

          {/* Desktop Layout - Hidden on mobile */}
          <div className="hidden md:grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* LEFT SIDE - Persona List */}
            <div className="space-y-4 lg:pr-4">
              {personas.map((persona) => (
                <button
                  key={persona.key}
                  onClick={() => setActivePersona(persona.key)}
                  className={`w-full text-left p-6 rounded-xl transition-all ${
                    activePersona === persona.key
                      ? "bg-white border-2 border-black shadow-sm"
                      : "bg-white border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h4
                    className={`text-base md:text-lg lg:text-xl font-serif text-black mb-2 ${
                      activePersona === persona.key ? "font-bold" : ""
                    }`}
                  >
                    {persona.title}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600 leading-snug md:leading-relaxed">{persona.subtext}</p>
                </button>
              ))}
            </div>

            {/* RIGHT SIDE - Dynamic View Card */}
            <div className="w-full max-w-md mx-auto lg:max-w-none lg:mx-0 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm lg:ml-4">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div className="px-4 py-2 bg-gray-100 rounded-full text-xs md:text-sm font-medium text-black">
                  {personaContent[activePersona].viewLabel}
                </div>
                <div className="px-4 py-2 bg-gray-100 rounded-full text-xs md:text-sm font-medium text-black">
                  Realflow Deal Engine
                </div>
              </div>

              <div className="deal-stage-visual space-y-3 md:grid md:grid-cols-3 md:gap-3 md:space-y-0">
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Prospected</h5>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">84</span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h6 className="text-xs md:text-sm font-semibold text-black mb-2">
                      {personaContent[activePersona].prospected.title}
                    </h6>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {personaContent[activePersona].prospected.description}
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 text-center">+ 83 more</p>
                </div>

                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Qualified</h5>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      12
                    </span>
                  </div>

                  <div className="bg-orange-50/50 rounded-lg p-3 border border-orange-100">
                    <h6 className="text-xs md:text-sm font-semibold text-black mb-2">
                      {personaContent[activePersona].qualified.title}
                    </h6>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {personaContent[activePersona].qualified.description}
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 text-center">+ 11 more</p>
                </div>

                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Booked</h5>
                    <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded-full text-xs font-medium">3</span>
                  </div>

                  <div className="bg-green-100/70 rounded-lg p-3 border border-green-300">
                    <h6 className="text-xs md:text-sm font-semibold text-black mb-2">
                      {personaContent[activePersona].booked.title}
                    </h6>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {personaContent[activePersona].booked.description}
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 text-center">+ 2 more</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:hidden space-y-6">
            {/* Wholesalers & Investors */}
            <div className="rounded-3xl bg-white shadow-sm border border-[#E5E5E5] px-4 py-5">
              <h3 className="text-base font-semibold text-neutral-900">Wholesalers & Investors</h3>
              <p className="mt-1 text-sm text-neutral-700">Find motivated sellers before they hit the market.</p>
              <div className="mt-4 rounded-2xl bg-neutral-900/5 overflow-hidden p-4 space-y-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <h6 className="text-xs font-semibold text-black mb-1">Maria Lopez</h6>
                  <p className="text-xs text-gray-600">Tampa, FL — Divorce, needs fast close</p>
                </div>
                <div className="bg-green-100/80 rounded-lg p-3 border border-green-400">
                  <h6 className="text-xs font-semibold text-black mb-1">Maria Lopez</h6>
                  <p className="text-xs text-gray-600">Call booked Tue 3 PM</p>
                </div>
              </div>
            </div>

            {/* CRE Owners & Brokers */}
            <div className="rounded-3xl bg-white shadow-sm border border-[#E5E5E5] px-4 py-5">
              <h3 className="text-base font-semibold text-neutral-900">CRE Owners & Brokers</h3>
              <p className="mt-1 text-sm text-neutral-700">Surface off-market owners that match your mandate.</p>
              <div className="mt-4 rounded-2xl bg-neutral-900/5 overflow-hidden p-4 space-y-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <h6 className="text-xs font-semibold text-black mb-1">Retail Plaza Owner</h6>
                  <p className="text-xs text-gray-600">Phoenix, AZ — Exploring sale</p>
                </div>
                <div className="bg-green-100/80 rounded-lg p-3 border border-green-400">
                  <h6 className="text-xs font-semibold text-black mb-1">Retail Plaza Owner</h6>
                  <p className="text-xs text-gray-600">Intro call booked</p>
                </div>
              </div>
            </div>

            {/* Lenders & Capital Providers */}
            <div className="rounded-3xl bg-white shadow-sm border border-[#E5E5E5] px-4 py-5">
              <h3 className="text-base font-semibold text-neutral-900">Lenders & Capital Providers</h3>
              <p className="mt-1 text-sm text-neutral-700">Identify borrowers with real near-term financing needs.</p>
              <div className="mt-4 rounded-2xl bg-neutral-900/5 overflow-hidden p-4 space-y-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <h6 className="text-xs font-semibold text-black mb-1">Bridge Loan Prospect</h6>
                  <p className="text-xs text-gray-600">Dallas, TX — Repositioning 80-unit</p>
                </div>
                <div className="bg-green-100/80 rounded-lg p-3 border border-green-400">
                  <h6 className="text-xs font-semibold text-black mb-1">Bridge Loan Prospect</h6>
                  <p className="text-xs text-gray-600">Terms review call booked</p>
                </div>
              </div>
            </div>

            {/* Mortgage Lenders */}
            <div className="rounded-3xl bg-white shadow-sm border border-[#E5E5E5] px-4 py-5">
              <h3 className="text-base font-semibold text-neutral-900">Mortgage Lenders</h3>
              <p className="mt-1 text-sm text-neutral-700">
                Convert inbound borrowers and reach owners with near-term maturities.
              </p>
              <div className="mt-4 rounded-2xl bg-neutral-900/5 overflow-hidden p-4 space-y-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <h6 className="text-xs font-semibold text-black mb-1">Homeowner</h6>
                  <p className="text-xs text-gray-600">Orlando, FL — Considering refi</p>
                </div>
                <div className="bg-green-100/80 rounded-lg p-3 border border-green-400">
                  <h6 className="text-xs font-semibold text-black mb-1">Homeowner</h6>
                  <p className="text-xs text-gray-600">Application call set Thu 11 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F7F7F7] border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 mt-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-black mb-4 sm:mb-6 leading-tight text-balance">
              Field-proven results across use cases
            </h2>
          </div>

          {/* FULL BACKGROUND VERSION - Active by default */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
              style={{
                backgroundImage: `url(${
                  currentSlide === 0
                    ? "/images/image3.png"
                    : currentSlide === 1
                      ? "/images/image.jpeg"
                      : currentSlide === 2
                        ? "/images/image7.jpeg"
                        : currentSlide === 3
                          ? "/images/image1.jpeg"
                          : currentSlide === 4
                            ? "/images/image8.jpeg"
                            : "/images/image11.png"
                })`,
                opacity: 0.2,
              }}
            />

            <div className="relative z-10">
              <div className="mb-4">
                <p className="text-base font-semibold text-gray-700 mb-6">
                  {caseStudies[currentSlide].icon} {caseStudies[currentSlide].category}
                </p>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-black mb-8 sm:mb-12 leading-tight text-balance">
                {caseStudies[currentSlide].headline}
              </h2>

              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 sm:mb-12 leading-relaxed max-w-4xl">
                {caseStudies[currentSlide].body}
              </p>

              <div className="mb-8">
                <p className="text-sm text-gray-600">{caseStudies[currentSlide].company}</p>
                <p className="text-base font-semibold text-black">{caseStudies[currentSlide].name}</p>
              </div>

              {/* Navigation Arrows - Bottom Right */}
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Previous case study"
                >
                  <ChevronLeft className="w-5 h-5 text-black" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-gray-900 transition-colors"
                  aria-label="Next case study"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* PARTIAL BACKGROUND VERSION - Commented out, uncomment to use instead */}
          {/*
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div
              className="absolute top-0 right-0 bottom-0 w-1/2 bg-cover bg-center transition-opacity duration-500"
              style={{
                backgroundImage: `url(${
                  currentSlide === 0 ? '/images/image3.png' :
                  currentSlide === 1 ? '/images/image.jpeg' :
                  currentSlide === 2 ? '/images/image7.jpeg' :
                  currentSlide === 3 ? '/images/image1.jpeg' :
                  currentSlide === 4 ? '/images/image8.jpeg' :
                  '/images/image11.png'
                })`,
                opacity: 0.2
              }}
            />

            <div className="relative z-10">
              <div className="mb-4">
                <p className="text-base font-semibold text-gray-700 mb-6">
                  {caseStudies[currentSlide].icon}  {caseStudies[currentSlide].category}
                </p>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-black mb-8 sm:mb-12 leading-tight text-balance">
                {caseStudies[currentSlide].headline}
              </h2>

              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 sm:mb-12 leading-relaxed max-w-4xl">
                {caseStudies[currentSlide].body}
              </p>

              <div className="mb-8">
                <p className="text-sm text-gray-600">{caseStudies[currentSlide].company}</p>
                <p className="text-base font-semibold text-black">{caseStudies[currentSlide].name}</p>
              </div>

              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Previous case study"
                >
                  <ChevronLeft className="w-5 h-5 text-black" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-gray-900 transition-colors"
                  aria-label="Next case study"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
          */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-4 sm:mb-6 leading-tight text-balance">
            Ready to close more deals?
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-10 leading-relaxed">
            Hop on a 30-minute demo call with our team to learn how RealFlow can start generating qualified meetings in
            just days.
          </p>
          <Button
            onClick={() => setDemoOpen(true)}
            className="w-full bg-white text-black hover:bg-gray-100 rounded-full px-8 sm:px-10 py-6 sm:py-7 text-base"
          >
            Book a Demo
          </Button>
        </div>
      </section>

      {/* Why RealFlow */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 mt-6">
            <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">Why RealFlow?</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-black mb-4 sm:mb-6 leading-tight text-balance">
              Why It Pays Off
            </h2>
            <p className="text-base sm:text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Built for real estate professionals who refuse to settle, RealFlow's AI outperforms the rest—smarter,
              faster, and more reliable than any alternative.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
              <svg
                className="w-10 h-10 mb-4 text-black"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="24" cy="26" r="14" />
                <path d="M24 18v8l5 3" />
                <path d="M8 8l6 6M40 8l-6 6" />
                <path d="M7 14L4 17M41 14l3 3" />
              </svg>
              <h3 className="text-lg sm:text-xl font-serif text-black mb-2 sm:mb-3">20-30 Hours Saved Weekly</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Reclaim time from manual list-building and follow-up.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
              <svg
                className="w-10 h-10 mb-4 text-black"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M29.4 12.6a2 2 0 0 0 0 2.8l3.2 3.2a2 2 0 0 0 2.8 0l7.54-7.54a12 12 0 0 1-15.88 15.88l-13.82 13.82a4.24 4.24 0 0 1-6-6l13.82-13.82a12 12 0 0 1 15.88-15.88l-7.52 7.52z" />
              </svg>
              <h3 className="text-lg sm:text-xl font-serif text-black mb-2 sm:mb-3">1 Tool, Lower Stack Cost</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Replace your 8-tool outbound routine with one engine.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
              <svg
                className="w-10 h-10 mb-4 text-black"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M26 4L12 26h12L22 44L36 22H24z" />
              </svg>
              <h3 className="text-lg sm:text-xl font-serif text-black mb-2 sm:mb-3">First-to-Market Speed</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Detect new sell signals and reach owners before competitors.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
              <svg
                className="w-10 h-10 mb-4 text-black"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 6h32v28l-10 10H8V6z" />
                <path d="M30 34v10l10-10h-10z" />
                <path d="M14 14h20M14 20h20M14 26h12" />
              </svg>
              <h3 className="text-lg sm:text-xl font-serif text-black mb-2 sm:mb-3">AI-Powered Instant Follow-Up</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                AI responds to calls, texts, forms, and emails in seconds.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
              <svg
                className="w-10 h-10 mb-4 text-black"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 4h20c2 0 4 2 4 4v32c0 2-2 4-4 4H14c-2 0-4-2-4-4V8c0-2 2-4 4-4z" />
                <path d="M10 36h28M10 12h28" />
                <circle cx="24" cy="40" r="1.5" fill="currentColor" />
              </svg>
              <h3 className="text-lg sm:text-xl font-serif text-black mb-2 sm:mb-3">Omnichannel Communications</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Automate voice and SMS interactions, unlike single-channel competitor offerings.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
              <svg
                className="w-10 h-10 mb-4 text-black"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="24" cy="24" r="18" />
                <circle cx="24" cy="24" r="12" />
                <circle cx="24" cy="24" r="6" />
                <circle cx="24" cy="24" r="1.5" fill="currentColor" />
              </svg>
              <h3 className="text-lg sm:text-xl font-serif text-black mb-2 sm:mb-3">End-to-End Automation</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Automate tasks completely, reducing reliance on frequent human intervention.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-4 sm:mb-6 leading-tight text-balance">
              Teams & Enterprise pricing
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Custom pricing discussed on a call to scope your volumes, domains, and compliance needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* Teams Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 text-black">
              <h3 className="text-2xl sm:text-3xl font-serif mb-2">Teams</h3>

              <p className="text-gray-600 mb-8 leading-relaxed">
                For real estate deal finder teams ready to scale their operations.
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">10 queries per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Omnichannel outreach automation</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Advanced qualification logic</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Due diligence red flag detection</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Live handoff to calendar</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">CRM integrations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Analytics dashboard</span>
                </li>
              </ul>

              <Button
                onClick={() => setDemoOpen(true)}
                className="w-full bg-black text-white hover:bg-gray-900 rounded-full py-6 text-base"
              >
                Get a 30-minute demo
              </Button>
            </div>

            {/* Enterprise Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 text-black relative">
              <div className="absolute top-6 right-6 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                Most Popular
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif mb-2">Enterprise</h3>

              <p className="text-gray-600 mb-8 leading-relaxed">
                For large real estate organizations with complex deal finder needs.
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Everything in Teams</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Custom workflow automation</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Advanced compliance tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Dedicated infrastructure</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">White-label solutions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">24/7 premium support</span>
                </li>
              </ul>

              <Button
                onClick={() => setDemoOpen(true)}
                className="w-full bg-black text-white hover:bg-gray-900 rounded-full py-6 text-base"
              >
                Get a 30-minute demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F3F4F6] border-t border-gray-200 py-4 md:py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-4 md:mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <img
                  src="/images/design-mode/oblique-logo-new.png"
                  alt="RealFlow Logo"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
                <div className="text-xl sm:text-2xl font-serif text-black">RealFlow</div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                AI agents built for real estate professionals.
              </p>
              {/* CHANGE: Added 2cm spacing (mt-5) between tagline and email */}
              <p className="text-xs sm:text-sm text-gray-600 mt-5">
                <a href="mailto:tomer@realflow.co" className="hover:text-black transition-colors">
                  tomer@realflow.co
                </a>
              </p>
            </div>

            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-black mb-2 md:mb-3 uppercase tracking-wider">
                Product
              </h4>
              <ul className="space-y-1 md:space-y-2">
                <li>
                  <a href="#how-it-works" className="text-xs sm:text-sm text-gray-600 hover:text-black">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#case-studies" className="text-xs sm:text-sm text-gray-600 hover:text-black">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-xs sm:text-sm text-gray-600 hover:text-black">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-3 md:pt-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs sm:text-sm text-gray-500">© 2025 RealFlow. All rights reserved.</p>
            {/* CHANGE: Removed Twitter and GitHub icons, kept only LinkedIn */}
            <div className="flex gap-4 sm:gap-6">
              <a href="#" className="text-gray-400 hover:text-black" aria-label="LinkedIn">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Password Modal */}
      {isLiveDemoModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-neutral-900">Enter demo access code</h2>
            <p className="mt-1 text-sm text-neutral-600">
              This walkthrough is invite-only. Ask us for the code if you don&apos;t have it yet.
            </p>
            <form className="mt-4 space-y-3" onSubmit={handleLiveDemoSubmit}>
              <input
                type="password"
                value={liveDemoPassword}
                onChange={(e) => {
                  setLiveDemoPassword(e.target.value)
                  setLiveDemoError("")
                }}
                placeholder="Access code"
                className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/80"
              />
              {liveDemoError && <p className="text-sm text-red-500">{liveDemoError}</p>}
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLiveDemoModalOpen(false)}
                  className="text-sm text-neutral-500 hover:text-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-neutral-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-neutral-800"
                >
                  Enter demo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCallModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setShowCallModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCallModal(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-700 text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>

            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Before you start</p>
            <h3 className="text-2xl font-semibold text-neutral-900 mt-1">Share a few details</h3>
            <p className="mt-1 text-sm text-neutral-600">
              We'll use this so RealFlow can personalize the conversation.
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleCallSubmit}>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={callForm.name}
                  onChange={handleCallFormChange}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Alex Johnson"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={callForm.email}
                  onChange={handleCallFormChange}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={callForm.phone}
                  onChange={handleCallFormChange}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <p className="text-xs text-neutral-500">
                By clicking Start Call, you agree to receive a call from RealFlow AI to discuss your real estate needs.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-[#D4A574] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#C9A227] transition-colors disabled:opacity-50"
              >
                {isLoading ? "Connecting..." : "Start Call"}
              </button>

              {vapiError && <p className="text-xs text-red-600 text-center">{vapiError}</p>}
            </form>
          </div>
        </div>
      )}

      {showFloatingButton && !showCallModal && !isCallActive && (
        <button
          onClick={() => setShowCallModal(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 bg-black text-white hover:bg-gray-900 rounded-full px-4 py-3 md:px-5 md:py-3 text-xs md:text-sm font-medium shadow-lg flex items-center gap-2 transition-all hover:scale-105"
        >
          <img src="/images/design-mode/oblique-logo-new.png" alt="" className="w-4 h-4" />
          <span className="hidden sm:inline">Talk to RealFlow</span>
          <span className="sm:hidden">Talk</span>
        </button>
      )}

      {/* Custom Vapi Call UI - Only visible when call is active */}
      {isCallActive && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 bg-white rounded-2xl shadow-2xl border-2 border-black p-6 w-80 animate-in slide-in-from-bottom-5">
          <div className="flex flex-col items-center gap-4">
            {/* Header */}
            <div className="flex items-center gap-2 w-full justify-between">
              <div className="flex items-center gap-2">
                <img src="/images/design-mode/oblique-logo-new.png" alt="" className="w-5 h-5" />
                <span className="text-sm font-semibold text-black">RealFlow AI</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-700 font-medium">Live</span>
              </div>
            </div>

            {/* Visual indicator */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Animated rings */}
              <div className={`absolute inset-0 rounded-full border-4 border-green-500 ${isSpeaking ? 'animate-ping' : ''}`} />
              <div className={`absolute inset-2 rounded-full border-4 border-green-300 ${isSpeaking ? 'animate-pulse' : ''}`} />

              {/* Center icon - Green */}
              <div className="relative z-10 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <Phone className="w-8 h-8 text-white" />
              </div>

              {/* Volume indicator */}
              {volumeLevel > 0 && (
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 bg-green-500 rounded-full transition-all duration-100"
                  style={{ height: `${Math.min(volumeLevel * 100, 40)}px` }}
                />
              )}
            </div>

            {/* Status text */}
            <div className="text-center">
              <p className="text-sm font-medium text-black">
                {isSpeaking ? "AI is speaking..." : "Listening..."}
              </p>
            </div>

            {/* Controls */}
            <div className="flex gap-3 w-full justify-center">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-all ${
                  isMuted
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-black'
                }`}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={endCall}
                className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all"
                aria-label="End call"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>

            {/* Error display */}
            {vapiError && (
              <div className="w-full p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700 text-center">{vapiError}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
