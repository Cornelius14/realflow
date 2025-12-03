"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const STAGES = [
  "Data Sources",
  "Ingestion & Enrichment",
  "Triggers",
  "Voice AI & Outreach",
  "Client Delivery",
  "Analytics",
]

export default function DemoPage() {
  const [activeStage, setActiveStage] = useState(0)
  const router = useRouter()

  // Check if user has access
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasAccess = window.localStorage.getItem("realflow-demo-access") === "true"
      if (!hasAccess) {
        router.push("/")
      }
    }
  }, [router])

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/design-mode/oblique-logo-new.png"
              alt="RealFlow Logo"
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
            />
            <div className="text-lg sm:text-xl md:text-2xl font-serif text-black">RealFlow</div>
          </Link>
          <Link href="/" className="text-sm text-gray-700 hover:text-black transition-colors">
            Back to Home
          </Link>
        </div>
      </header>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Realflow engine</p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900">
            From signal to warm conversation
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-neutral-600">
            A live view of how Realflow turns real-world events into real conversations: data flows in, campaigns spin
            up, and qualified opportunities land in your team&apos;s pipeline.
          </p>

          {/* Engine flow */}
          <div className="mt-10 rounded-3xl bg-white/90 p-4 sm:p-6 shadow-sm border border-neutral-200">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Engine flow</p>
            <h2 className="mt-2 text-lg sm:text-xl font-semibold text-neutral-900">
              Follow the pipeline from Data Sources to Analytics
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Each stage is a real part of the product — click through to see what the engine is doing for you at every
              step.
            </p>

            {/* Stage chips row (visual flow) */}
            <div className="mt-5 flex items-center gap-1 overflow-x-auto pb-1">
              {STAGES.map((stage, index) => {
                const isActive = index === activeStage
                return (
                  <div key={stage} className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveStage(index)}
                      className={[
                        "flex min-w-[140px] flex-col rounded-2xl border px-3 py-2 text-left text-xs sm:text-sm transition",
                        isActive
                          ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                          : "border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-neutral-400",
                      ].join(" ")}
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-70">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-1 font-medium">{stage}</span>
                    </button>
                    {index < STAGES.length - 1 && (
                      <span className="hidden sm:inline-block text-xs text-neutral-400">→</span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Stage content */}
            <div className="mt-6 rounded-3xl bg-neutral-50 p-4 sm:p-5 border border-neutral-200">
              {activeStage === 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Visual card */}
                  <div className="space-y-3 rounded-2xl bg-white p-3 border border-neutral-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Data sources
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        Live
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-neutral-900">Signals streaming into the engine</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-2 py-2">
                        <p className="font-semibold text-emerald-900">NOAA Weather</p>
                        <p className="mt-0.5 text-[11px] text-emerald-900/80">Hail, storms, flood risk by block</p>
                      </div>
                      <div className="rounded-xl border border-red-200 bg-red-50/80 px-2 py-2">
                        <p className="font-semibold text-red-900">Tax Liens</p>
                        <p className="mt-0.5 text-[11px] text-red-900/80">Unpaid state / federal taxes</p>
                      </div>
                      <div className="rounded-xl border border-orange-200 bg-orange-50/80 px-2 py-2">
                        <p className="font-semibold text-orange-900">Foreclosures</p>
                        <p className="mt-0.5 text-[11px] text-orange-900/80">Home or asset at risk of auction</p>
                      </div>
                      <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-2 py-2">
                        <p className="font-semibold text-amber-900">Code Violations</p>
                        <p className="mt-0.5 text-[11px] text-amber-900/80">Unsafe or neglected property</p>
                      </div>
                      <div className="rounded-xl border border-purple-200 bg-purple-50/80 px-2 py-2">
                        <p className="font-semibold text-purple-900">Judgments</p>
                        <p className="mt-0.5 text-[11px] text-purple-900/80">Court-ordered debts</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-2 py-2">
                        <p className="font-semibold text-slate-900">Criminal Records</p>
                        <p className="mt-0.5 text-[11px] text-slate-900/80">Owner recently arrested</p>
                      </div>
                      <div className="rounded-xl border border-sky-200 bg-sky-50/80 px-2 py-2">
                        <p className="font-semibold text-sky-900">Mechanic Liens</p>
                        <p className="mt-0.5 text-[11px] text-sky-900/80">Unpaid contractor or builder</p>
                      </div>
                      <div className="rounded-xl border border-pink-200 bg-pink-50/80 px-2 py-2">
                        <p className="font-semibold text-pink-900">Property Complaints</p>
                        <p className="mt-0.5 text-[11px] text-pink-900/80">Neighbor and nuisance complaints</p>
                      </div>
                      <div className="rounded-xl border border-teal-200 bg-teal-50/80 px-2 py-2">
                        <p className="font-semibold text-teal-900">Evictions</p>
                        <p className="mt-0.5 text-[11px] text-teal-900/80">Tenant removal / non-payment</p>
                      </div>
                      <div className="rounded-xl border border-indigo-200 bg-indigo-50/80 px-2 py-2">
                        <p className="font-semibold text-indigo-900">Permits & Construction</p>
                        <p className="mt-0.5 text-[11px] text-indigo-900/80">Stalled projects, stop-work</p>
                      </div>
                      <div className="col-span-2 rounded-xl border border-neutral-300 bg-white px-2 py-2">
                        <p className="font-semibold text-neutral-900">Custom Client Datasets</p>
                        <p className="mt-0.5 text-[11px] text-neutral-700">
                          Mandates, watchlists, internal CSVs & CRMs
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Explanatory text */}
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">Data Sources — where signals start</h3>
                    <p className="mt-2 text-sm text-neutral-700">
                      Realflow listens to public, paid, and client-owned data feeds. Each feed becomes a structured
                      signal the engine can act on — from weather events to tax liens to your own mandate files.
                    </p>
                  </div>
                </div>
              )}

              {activeStage === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Visual */}
                  <div className="space-y-3 rounded-2xl bg-white p-3 border border-neutral-200 shadow-sm text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Ingestion & Enrichment
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        Real time
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-neutral-900">Signals flowing through the engine</p>
                    <div className="mt-3 space-y-2">
                      {[
                        "Raw signal captured (event or rule fires)",
                        "Matched to properties & owners",
                        "Phones & emails attached",
                        "Context added (loans, permits, ownership history, portfolio flags)",
                        "Duplicates and noise removed → deal-ready record",
                      ].map((step, i) => (
                        <div
                          key={step}
                          className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-1.5"
                        >
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A227] text-[10px] font-semibold text-white">
                            {i + 1}
                          </div>
                          <p className="text-[11px] text-neutral-800">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">
                      Ingestion & Enrichment — preparing signals for action
                    </h3>
                    <p className="mt-2 text-sm text-neutral-700">
                      Realflow ingests signals in real time, ties them to real assets and owners, and enriches each
                      record with as much context as possible so the voice agent goes into the call already
                      understanding who the owner is, what happened, and why now — increasing conversion.
                    </p>
                  </div>
                </div>
              )}

              {activeStage === 2 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Visual */}
                  <div className="rounded-2xl bg-white p-3 shadow-sm border border-neutral-200 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Client-defined triggers
                      </span>
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                        Playbooks
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] text-neutral-600">During onboarding, clients choose rules like:</p>
                    <div className="mt-3 space-y-2">
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50/80 px-3 py-2">
                        <p className="text-[11px] font-semibold text-emerald-900">Hail storm over Broward County</p>
                        <p className="mt-0.5 text-[11px] text-emerald-900/80">
                          AND SFR AND equity &gt; 30% AND absentee owner
                        </p>
                      </div>
                      <div className="rounded-xl border border-amber-100 bg-amber-50/80 px-3 py-2">
                        <p className="text-[11px] font-semibold text-amber-900">Loan maturing in 3–6 months</p>
                        <p className="mt-0.5 text-[11px] text-amber-900/80">with stress on DSCR</p>
                      </div>
                      <div className="rounded-xl border border-red-100 bg-red-50/80 px-3 py-2">
                        <p className="text-[11px] font-semibold text-red-900">New tax lien / code violation</p>
                        <p className="mt-0.5 text-[11px] text-red-900/80">on a property inside the buy box</p>
                      </div>
                      <div className="rounded-xl border border-purple-100 bg-purple-50/80 px-3 py-2">
                        <p className="text-[11px] font-semibold text-purple-900">Listing withdrawn</p>
                        <p className="mt-0.5 text-[11px] text-purple-900/80">Removed in last 90 days</p>
                      </div>
                      <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
                        <p className="text-[11px] font-semibold text-neutral-900">Portfolio mandate match</p>
                        <p className="mt-0.5 text-[11px] text-neutral-700">Custom risk rules from client</p>
                      </div>
                    </div>
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">Triggers — when to reach out</h3>
                    <p className="mt-2 text-sm text-neutral-700">
                      Triggers are defined by the client. When a trigger condition is met, Realflow automatically pushes
                      that owner into the Voice AI & Outreach stage as a call job.
                    </p>
                  </div>
                </div>
              )}

              {activeStage === 3 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Visual */}
                  <div className="rounded-2xl bg-white p-3 shadow-sm border border-neutral-200 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Voice AI & outreach
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        Calling now
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-neutral-900">Choose voice, number and routing</p>

                    {/* Voices */}
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-2 text-[11px] cursor-pointer hover:border-[#C9A227] hover:bg-amber-50/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-neutral-900">Vanessa</p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 text-[#C9A227]"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-[10px] text-neutral-600">SF / NYC · upbeat, analytical</p>
                      </div>
                      <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-2 text-[11px] cursor-pointer hover:border-[#C9A227] hover:bg-amber-50/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-neutral-900">Marcus</p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 text-[#C9A227]"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-[10px] text-neutral-600">NYC · confident, straight to the point</p>
                      </div>
                      <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-2 text-[11px] cursor-pointer hover:border-[#C9A227] hover:bg-amber-50/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-neutral-900">Erin</p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 text-[#C9A227]"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-[10px] text-neutral-600">Midwest / Southern · calm, empathetic</p>
                      </div>
                    </div>

                    {/* Bullets */}
                    <div className="mt-4 space-y-2">
                      {[
                        "Local caller IDs available (e.g. 415 / 646 / 305)",
                        "Caller built using your preferred voice profile and script",
                        "Opens with context from the trigger (storm, loan, tax event, etc.)",
                        "Asks 4–6 smart questions on timing, condition, and price",
                        "If qualified → books a meeting or performs a live warm transfer",
                      ].map((step, i) => (
                        <div key={step} className="flex items-start gap-2">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#C9A227]" />
                          <p className="text-[11px] text-neutral-700">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">
                      Voice AI & Outreach — conversations at scale
                    </h3>
                    <p className="mt-2 text-sm text-neutral-700">
                      Realflow spins up callers that match the client's spec and automatically dials owners whenever a
                      trigger fires, so the team only handles conversations with owners who already engaged.
                    </p>
                  </div>
                </div>
              )}

              {activeStage === 4 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Visual */}
                  <div className="rounded-2xl bg-white p-3 shadow-sm border border-neutral-200 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Client delivery
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        Choose your mode
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] text-neutral-600">The client chooses the delivery mode:</p>
                    <div className="mt-3 grid gap-2">
                      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-semibold">
                          1
                        </div>
                        <p className="text-[11px] font-semibold text-emerald-900">Live warm transfer</p>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-semibold">
                          2
                        </div>
                        <p className="text-[11px] font-semibold text-amber-900">
                          Booked meeting with SMS/email confirmation
                        </p>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-500 text-white text-[10px] font-semibold">
                          3
                        </div>
                        <p className="text-[11px] font-semibold text-neutral-900">Detailed recap pushed into CRM</p>
                      </div>
                    </div>
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">
                      Client Delivery — how you receive qualified conversations
                    </h3>
                    <p className="mt-2 text-sm text-neutral-700">
                      The team only spends time on owners who have already had a full conversation.
                    </p>
                  </div>
                </div>
              )}

              {activeStage === 5 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Visual */}
                  <div className="rounded-2xl bg-white p-3 shadow-sm border border-neutral-200 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Analytics
                      </span>
                      <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-800">
                        Learning loop
                      </span>
                    </div>

                    {/* Top stats */}
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-neutral-50 px-3 py-2 text-center">
                        <p className="text-lg font-semibold text-neutral-900">1,822</p>
                        <p className="text-[10px] text-neutral-500">prospects in cohort</p>
                      </div>
                      <div className="rounded-xl bg-neutral-50 px-3 py-2 text-center">
                        <p className="text-lg font-semibold text-neutral-900">766</p>
                        <p className="text-[10px] text-neutral-500">contacted</p>
                      </div>
                      <div className="rounded-xl bg-emerald-50 px-3 py-2 text-center">
                        <p className="text-lg font-semibold text-emerald-700">44</p>
                        <p className="text-[10px] text-emerald-600">high-intent, ready to transact</p>
                      </div>
                    </div>

                    {/* Insights */}
                    <div className="mt-3 rounded-xl bg-neutral-50 px-3 py-2">
                      <p className="text-[11px] font-semibold text-neutral-900">Top performing</p>
                      <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px] text-neutral-700">
                        <li>Script A + Vanessa → 9 high-intent sellers</li>
                        <li>Storm-context opener outperforming generic by 32%</li>
                        <li>Best connect rate: 5–7pm</li>
                      </ul>
                    </div>
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">Analytics — continuous optimization</h3>
                    <p className="mt-2 text-sm text-neutral-700">
                      Analytics analyzes transcripts and compares scripts/voices, surfaces which triggers and markets
                      perform best, and feeds those learnings back into future campaigns.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
