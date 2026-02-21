"use client";

import { motion } from "framer-motion";
import { LocationSelector } from "@/components/LocationSelector";
import { PrayerList } from "@/components/PrayerList";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { CALCULATION_METHOD } from "@/lib/constants";

export default function Home() {
    const { location, prayers, isLoading, error, searchCity, clearError } = usePrayerTimes();

    return (
        <div className="flex flex-col h-full w-full max-w-lg mx-auto overflow-hidden px-6 py-4 relative z-10 selection:bg-sky-500/30">
            {/* Top Bar */}
            <nav className="flex items-center justify-between pt-4 pb-2 flex-shrink-0">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-semibold tracking-[0.2em] text-white/40 uppercase"
                >
                    Prayer Times
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                />
            </nav>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0 w-full mt-4">

                {/* Title Area */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} /* Custom fluid easing */
                    className="mb-8 flex-shrink-0"
                >
                    <h1 className="text-white text-6xl md:text-7xl font-light tracking-tight mb-3 text-glow">
                        Salah
                    </h1>
                    <div className="h-[1px] w-12 bg-gradient-to-r from-sky-400 to-transparent" />
                </motion.div>

                {/* Error Banner */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-red-950/40 border border-red-500/20 rounded-xl p-4 mb-6 text-red-200 text-sm overflow-hidden"
                    >
                        <div className="flex items-center justify-between">
                            <p>{error}</p>
                            <button
                                type="button"
                                onClick={clearError}
                                className="text-xs uppercase tracking-wider font-semibold opacity-70 hover:opacity-100 transition-opacity"
                            >
                                Dismiss
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Prayer List */}
                <div className="w-full flex-1 min-h-0 flex flex-col justify-center gap-3">
                    {prayers.length > 0 && <PrayerList prayers={prayers} />}
                </div>

                {/* Bottom Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="w-full flex-shrink-0 flex flex-col space-y-5 pt-8 pb-4"
                >
                    <LocationSelector
                        location={location}
                        onSearch={searchCity}
                        isLoading={isLoading}
                    />

                    <div className="flex justify-between items-center text-[10px] md:text-xs text-white/30 uppercase tracking-[0.1em] px-2">
                        <span>Method</span>
                        <span className="text-white/50">{CALCULATION_METHOD}</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
