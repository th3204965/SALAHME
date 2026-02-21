"use client";

import { useMotionValue, useSpring, useTransform, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LocationSelector } from "@/components/LocationSelector";
import { PrayerList } from "@/components/PrayerList";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { CALCULATION_METHOD } from "@/lib/constants";

export default function Home() {
    const { location, prayers, isLoading, error, searchCity, clearError } = usePrayerTimes();

    // Mouse Parallax Setup
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring physics for the parallax
    const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
    const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

    useEffect(() => {
        // Only run parallax if motion is ok and it's a desktop.
        if (window.matchMedia("(hover: none)").matches) return;

        const handleMouseMove = (e: MouseEvent) => {
            // Normalize mouse position between -1 and 1
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            mouseX.set(x);
            mouseY.set(y);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="relative h-[100dvh] w-full overflow-hidden flex flex-col items-center selection:bg-teal-500/30">
            {/* Background elements */}
            <div className="bg-mesh" />

            {/* Massive Parallax Typography */}
            <motion.div
                className="massive-bg-text"
                style={{
                    translateX: "-50%",
                    translateY: "-50%",
                    rotateX: smoothY,
                    rotateY: smoothX,
                    marginLeft: useTransform(smoothX, value => value * -50),
                    marginTop: useTransform(smoothY, value => value * -50),
                }}
            >
                SALAH
            </motion.div>

            {/* Foreground Content Wrapper */}
            <motion.div
                className="relative z-10 flex flex-col h-[100dvh] w-full max-w-4xl mx-auto px-4 md:px-8 py-2 md:py-8"
                style={{
                    perspective: 1000,
                    rotateX: smoothY,
                    rotateY: smoothX,
                }}
            >
                {/* Top Nav */}
                <nav className="flex items-center justify-between pt-1 md:pt-2 pb-2 md:pb-6 flex-shrink-0">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[10px] md:text-sm font-semibold tracking-[0.3em] text-slate-400 uppercase drop-shadow-md"
                    >
                        SalahMe
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 1, type: "spring" }}
                        className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10"
                    >
                        <div className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.8)] animate-pulse" />
                        <span className="text-[9px] uppercase tracking-widest text-slate-200 font-medium">Live</span>
                    </motion.div>
                </nav>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col w-full justify-center relative">
                    {/* Error Banner */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, rotateX: -90 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            className="absolute top-0 left-0 right-0 z-50 bg-rose-950/80 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-4 text-rose-200 text-sm shadow-2xl transform-origin-top"
                        >
                            <div className="flex items-center justify-between">
                                <p>{error}</p>
                                <button
                                    type="button"
                                    onClick={clearError}
                                    className="text-xs uppercase tracking-wider font-semibold opacity-70 hover:opacity-100 transition-opacity bg-rose-500/20 px-4 py-2 rounded-full"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Prayer List Grid */}
                    <div className="w-full flex-1 flex flex-col justify-center py-6">
                        {prayers.length > 0 && <PrayerList prayers={prayers} />}
                    </div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full flex-shrink-0 flex flex-col md:flex-row items-center justify-between gap-4 pt-4"
                >
                    <div className="w-full md:w-auto flex-1 max-w-sm mx-auto md:mx-0">
                        <LocationSelector
                            location={location}
                            onSearch={searchCity}
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="flex items-center justify-center gap-3 text-[10px] md:text-xs text-slate-400 uppercase tracking-[0.1em] px-4 py-3 bg-slate-900/60 rounded-2xl border border-white/5 backdrop-blur-md">
                        <span className="opacity-50">Method</span>
                        <div className="h-3 w-px bg-white/10" />
                        <span className="text-teal-400 font-medium">{CALCULATION_METHOD}</span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
