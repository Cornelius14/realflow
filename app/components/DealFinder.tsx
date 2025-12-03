"use client";

import { useState } from 'react';

export function DealFinder() {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  return (
    <div className="w-full max-w-md mx-auto lg:max-w-none lg:mx-0 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
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
        <div className="w-full space-y-3 transition-all opacity-100">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Prospected</h5>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">127</span>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h6 className="text-xs md:text-sm font-semibold text-black mb-2">3400 Commerce Ave</h6>
            <p className="text-xs text-gray-600 leading-relaxed">
              Charlotte, NC · 32 units, 1990 build · Owner: Smith Capital · Requested rent roll, considering sale this month.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h6 className="text-xs md:text-sm font-semibold text-black mb-2">2156 South Blvd</h6>
            <p className="text-xs text-gray-600 leading-relaxed">
              Charlotte, NC · 28 units, 1995 build · Owner: Park Properties · Curious about offers, reviewing options.
            </p>
          </div>

          <p className="text-xs text-gray-500 text-center">+ 125 more</p>
        </div>

        {/* Column 2: Qualified */}
        <div className="w-full space-y-3 transition-all opacity-100">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Qualified</h5>
            <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">18</span>
          </div>
          
          <div className="bg-orange-50/50 rounded-lg p-3 border border-orange-100">
            <h6 className="text-xs md:text-sm font-semibold text-black mb-2">4850 Tryon Street</h6>
            <p className="text-xs text-gray-600 leading-relaxed">
              Charlotte, NC · 36 units, 1992 build · Owner: Tryon Holdings · Open to cash offer this week; wants LOI before month-end.
            </p>
          </div>

          <div className="bg-orange-50/50 rounded-lg p-3 border border-orange-100">
            <h6 className="text-xs md:text-sm font-semibold text-black mb-2">1820 East Blvd</h6>
            <p className="text-xs text-gray-600 leading-relaxed">
              Charlotte, NC · 24 units, 1988 build · Owner: East Capital · Asked for LOI at ≥ 6.5% cap, ready to close.
            </p>
          </div>

          <p className="text-xs text-gray-500 text-center">+ 16 more</p>
        </div>

        {/* Column 3: Booked */}
        <div className="w-full space-y-3 transition-all opacity-100">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Booked</h5>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">5</span>
          </div>
          
          <div className="bg-green-50/50 rounded-lg p-3 border border-green-100">
            <h6 className="text-xs md:text-sm font-semibold text-black mb-2">7200 Park Road</h6>
            <p className="text-xs text-gray-600 leading-relaxed">
              Charlotte, NC · 40 units, 1985 build · Owner: Park Investors · Tour booked Thu 2 PM — decision-maker attending.
            </p>
          </div>

          <div className="bg-green-50/50 rounded-lg p-3 border border-green-100">
            <h6 className="text-xs md:text-sm font-semibold text-black mb-2">3315 Monroe Road</h6>
            <p className="text-xs text-gray-600 leading-relaxed">
              Charlotte, NC · 22 units, 1998 build · Owner: Monroe LLC · Call booked Fri 11 AM — reviewing offers same day.
            </p>
          </div>

          <p className="text-xs text-gray-500 text-center">+ 3 more</p>
        </div>
      </div>
    </div>
  );
}
