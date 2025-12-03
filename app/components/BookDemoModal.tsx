"use client"

import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface BookDemoModalProps {
  open: boolean
  onClose: () => void
}

export default function BookDemoModal({ open, onClose }: BookDemoModalProps) {
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    // Step 1
    email: "",
    phone: "",
    company: "",
    role: "",
    teamSize: "",
    // Step 2
    workflow: "",
    volume: "",
    markets: "",
    // Step 3
    dataSources: "",
    tools: "",
    constraints: "",
    // Step 4
    timeline: "",
    notes: "",
  })

  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    console.log("[v0] Demo form submitted:", formData)
    onClose()
  }

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="flex h-full w-full items-center justify-center p-0 md:p-4">
        <div
          className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-none md:rounded-2xl bg-background text-foreground md:flex-row md:h-auto h-full max-h-screen"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="hidden md:flex w-full md:w-5/12 bg-gray-50 px-8 py-10 flex-col space-y-4">
            <div className="mb-1 text-sm font-semibold text-gray-900">RealFlow</div>
            <h3 className="mb-1 text-2xl font-serif text-black">AI Engine for Real Estate Deals</h3>
            <p className="mb-8 text-base text-gray-700">
              Source, qualify, and book high-intent meetings automatically.
            </p>

            <div className="space-y-6">
              <div>
                <div className="mb-1 flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                    1
                  </span>
                  <div>
                    <h4 className="text-base font-semibold text-black">Never Miss Momentum</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Outreach scales instantly across calls, SMS, email, and voicemail.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                    2
                  </span>
                  <div>
                    <h4 className="text-base font-semibold text-black">More Quality Meetings</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Decision-makers matched to your mandate and criteria.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                    3
                  </span>
                  <div>
                    <h4 className="text-base font-semibold text-black">Grow Revenue</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Meetings that move deals forward, not just fill the calendar.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                    4
                  </span>
                  <div>
                    <h4 className="text-base font-semibold text-black">Free Your Team</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      We handle sourcing, outreach, and scheduling so your team can focus on deals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-7/12 bg-white text-black px-4 py-4 md:px-8 md:py-10 flex flex-col overflow-y-auto">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 md:top-4 md:right-4 p-2.5 md:p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10 shadow-sm"
              aria-label="Close"
            >
              <X className="w-5 h-5 md:w-5 md:h-5" />
            </button>

            <div className="md:hidden mb-4 pr-10">
              <div className="text-xs font-semibold text-gray-900 mb-1">RealFlow</div>
              <h2 className="text-lg font-serif text-black">Schedule a Demo</h2>
            </div>

            <h2 className="hidden md:block text-2xl lg:text-3xl font-semibold">Schedule a Demo</h2>
            <p className="text-xs md:text-sm lg:text-base text-gray-600 mb-3 md:mb-6">
              We currently prioritize CRE teams (brokers, lenders, investors, developers/GCs, title/insurance).
            </p>

            <div className="mt-2 flex-1 space-y-3 md:space-y-6 pb-4">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                        step === currentStep
                          ? "bg-black text-white"
                          : step < currentStep
                            ? "bg-gray-400 text-white"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 4 && <div className="mx-2 h-0.5 w-8 bg-gray-200" />}
                  </div>
                ))}
              </div>

              {/* Step 1 - Company & Contact */}
              {currentStep === 1 && (
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1.5 text-gray-700">
                      Company Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-black placeholder-gray-400 focus:border-black focus:outline-none"
                      placeholder="you@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1.5 text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-black placeholder-gray-400 focus:border-black focus:outline-none"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1.5 text-gray-700">
                      Firm / Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      className="w-full rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-black placeholder-gray-400 focus:border-black focus:outline-none"
                      placeholder="Your Company"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1.5 text-gray-700">Role / Title</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => handleChange("role", e.target.value)}
                      className="w-full rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-black placeholder-gray-400 focus:border-black focus:outline-none"
                      placeholder="e.g. Acquisitions Manager"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1.5 text-gray-700">Team Size</label>
                    <select
                      value={formData.teamSize}
                      onChange={(e) => handleChange("teamSize", e.target.value)}
                      className="w-full rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-black focus:border-black focus:outline-none"
                    >
                      <option value="">Select...</option>
                      <option value="1-5">1-5 people</option>
                      <option value="6-20">6-20 people</option>
                      <option value="21-50">21-50 people</option>
                      <option value="50+">50+ people</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2 - Workflows & Volume */}
              {currentStep === 2 && (
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1.5 text-gray-700">
                      Primary workflow
                    </label>
                    <select
                      value={formData.workflow}
                      onChange={(e) => handleChange("workflow", e.target.value)}
                      className="w-full rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-black focus:border-black focus:outline-none"
                    >
                      <option value="">Select...</option>
                      <option value="outbound">Outbound owners</option>
                      <option value="inbound">Inbound leads</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1.5 text-gray-700">
                      Monthly outreach volume (approx)
                    </label>
                    <input
                      type="text"
                      value={formData.volume}
                      onChange={(e) => handleChange("volume", e.target.value)}
                      className="w-full rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-black placeholder-gray-400 focus:border-black focus:outline-none"
                      placeholder="e.g. 1,000 calls/month"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1.5 text-gray-700">
                      Markets you care about
                    </label>
                    <textarea
                      value={formData.markets}
                      onChange={(e) => handleChange("markets", e.target.value)}
                      className="w-full rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-black placeholder-gray-400 focus:border-black focus:outline-none resize-none"
                      rows={4}
                      placeholder="e.g. Southeast multifamily, Texas industrial..."
                    />
                  </div>
                </div>
              )}

              {/* Step 3 - Data & Tools */}
              {currentStep === 3 && (
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1.5 text-gray-700">
                      Current data sources
                    </label>
                    <input
                      type="text"
                      value={formData.dataSources}
                      onChange={(e) => handleChange("dataSources", e.target.value)}
                      className="w-full rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-black placeholder-gray-400 focus:border-black focus:outline-none"
                      placeholder="e.g. CoStar, ListSource, proprietary..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1.5 text-gray-700">
                      CRMs or tools you use
                    </label>
                    <input
                      type="text"
                      value={formData.tools}
                      onChange={(e) => handleChange("tools", e.target.value)}
                      className="w-full rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-black placeholder-gray-400 focus:border-black focus:outline-none"
                      placeholder="e.g. Salesforce, HubSpot..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1.5 text-gray-700">
                      Any compliance / domain constraints?
                    </label>
                    <textarea
                      value={formData.constraints}
                      onChange={(e) => handleChange("constraints", e.target.value)}
                      className="w-full rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-black placeholder-gray-400 focus:border-black focus:outline-none resize-none"
                      rows={4}
                      placeholder="e.g. TCPA compliance, specific call time windows..."
                    />
                  </div>
                </div>
              )}

              {/* Step 4 - Timeline & Notes */}
              {currentStep === 4 && (
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1.5 text-gray-700">
                      When are you looking to start?
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => handleChange("timeline", e.target.value)}
                      className="w-full rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-black focus:border-black focus:outline-none"
                    >
                      <option value="">Select...</option>
                      <option value="asap">ASAP</option>
                      <option value="1-3">1–3 months</option>
                      <option value="3+">3+ months</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1.5 text-gray-700">
                      Anything else we should know?
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      className="w-full rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-black placeholder-gray-400 focus:border-black focus:outline-none resize-none"
                      rows={6}
                      placeholder="Tell us more about your needs, goals, or any questions..."
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2 md:pt-4">
                {currentStep > 1 && (
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="rounded-full px-6 py-2 border-gray-300 text-black hover:bg-gray-100 bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                )}
                {currentStep < 4 ? (
                  <Button onClick={handleNext} className="rounded-full px-6 py-2 bg-black text-white hover:bg-gray-800">
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="rounded-full px-6 py-2 bg-black text-white hover:bg-gray-800"
                  >
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
