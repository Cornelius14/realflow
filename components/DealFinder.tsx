"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useVapi } from "@/hooks/use-vapi"

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzHRlsghBzHXJPcA_a6ynRXX1hGCUW26kbIdprgvpSlQFjDevpBJDwESbx40JWQSvmF/exec"

const QUERIES = [
  "Find value-add multifamily, 20–40 units, in Charlotte, built 1980–2005, cap ≥ 6.5%, ≤ $180k/door.",
  "Find 18–22k SF retail for lease in Miami Beach, $180–$220 PSF, frontage ≥ 60 ft.",
  "Find Dallas multifamily owners with loans maturing in 3–6 months, 50–150 units, LTV ≥ 60%.",
  "Find Travis County, TX properties with recent deed filings.",
]

export default function DealFinder() {
  const [queryIndex, setQueryIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    fullName: "",
    workEmail: "",
    company: "",
    role: "",
    markets: "",
    targetMeetingsPerMonth: "",
    description: "",
  })

  const { isCallActive, isLoading, error: vapiError, startCall, endCall } = useVapi()

  useEffect(() => {
    const current = QUERIES[queryIndex]
    let delay = isDeleting ? 35 : 55

    if (!isDeleting && charIndex === current.length) delay = 1500
    if (isDeleting && charIndex === 0) delay = 700

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < current.length) {
          setDisplayText(current.slice(0, charIndex + 1))
          setCharIndex((c) => c + 1)
        } else {
          setIsDeleting(true)
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(current.slice(0, charIndex - 1))
          setCharIndex((c) => c - 1)
        } else {
          setIsDeleting(false)
          setQueryIndex((i) => (i + 1) % QUERIES.length)
        }
      }
    }, delay)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, queryIndex])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      setSubmitted(true)
      setForm({
        fullName: "",
        workEmail: "",
        company: "",
        role: "",
        markets: "",
        targetMeetingsPerMonth: "",
        description: "",
      })
      setIsOpen(false)
    } catch (err) {
      console.error("Error sending to Google Sheet", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="deal-finder" className="bg-gray-50 py-6 sm:py-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4">
        <h2 className="text-xl sm:text-2xl font-serif font-semibold tracking-tight text-black text-center">
          Deal Finder
        </h2>

        <div className="w-full max-w-2xl rounded-2xl bg-white border border-gray-300 px-3 py-3 sm:px-4 sm:py-4 shadow-sm">
          <textarea
            value={displayText}
            readOnly
            className="h-16 sm:h-20 w-full resize-none bg-transparent text-sm sm:text-base text-gray-700 placeholder:text-gray-400 focus:outline-none font-sans"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
        >
          Tell us what you're looking for
        </button>

        <button
          type="button"
          onClick={isCallActive ? endCall : startCall}
          disabled={isLoading}
          className={`inline-flex items-center justify-center gap-2 rounded-full border-2 px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
            isCallActive
              ? "border-red-500 bg-red-50 text-red-700 hover:bg-red-100"
              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Connecting...
            </>
          ) : isCallActive ? (
            <>
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
              End Call
            </>
          ) : (
            <>
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call RealFlow
            </>
          )}
        </button>

        {vapiError && <p className="text-xs text-red-600">{vapiError}</p>}

        {submitted && (
          <p className="mt-3 text-sm text-gray-500">
            Thanks! We've received your request and will configure a live Deal Finder demo for you.
          </p>
        )}

        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-700 text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>

              <h3 className="text-xl font-semibold text-neutral-900">Tell us what you're looking for</h3>
              <p className="mt-1 text-sm text-neutral-600">
                Answer a few questions and we'll configure a live RealFlow Deal Finder demo for you.
              </p>

              <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Full name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Work email</label>
                  <input
                    type="email"
                    name="workEmail"
                    required
                    value={form.workEmail}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Company</label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={form.company}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Role</label>
                  <input
                    type="text"
                    name="role"
                    required
                    value={form.role}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    What markets / asset types are you focused on?
                  </label>
                  <input
                    type="text"
                    name="markets"
                    required
                    value={form.markets}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    How many new deals/meetings per month are you aiming for?
                  </label>
                  <input
                    type="text"
                    name="targetMeetingsPerMonth"
                    required
                    value={form.targetMeetingsPerMonth}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Describe what you're looking for
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    value={form.description}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send to RealFlow"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
