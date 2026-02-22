"use client";

import { useEffect, useState } from "react";
import { LocationSelector } from "@/components/location-selector";
import { PrayerList } from "@/components/prayer-list";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { CALCULATION_METHOD } from "@/lib/constants";

export default function Home() {
    const { location, prayers, isLoading, error, searchCity, clearError } = usePrayerTimes();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Block all document-level scrolling on mobile
    useEffect(() => {
        const preventScroll = (e: TouchEvent) => {
            if ((e.target as HTMLElement)?.closest("input, textarea, select")) return;
            if (e.touches.length > 1) return;
            e.preventDefault();
        };
        const preventScrollEvent = (e: Event) => {
            e.preventDefault();
        };
        document.addEventListener("touchmove", preventScroll, { passive: false });
        document.addEventListener("scroll", preventScrollEvent, { passive: false });
        document.documentElement.style.overflow = "hidden";
        document.documentElement.style.position = "fixed";
        document.documentElement.style.width = "100%";
        document.documentElement.style.height = "100dvh";
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        document.body.style.height = "100dvh";
        return () => {
            document.removeEventListener("touchmove", preventScroll);
            document.removeEventListener("scroll", preventScrollEvent);
        };
    }, []);

    // Desktop parallax mouse tracking
    useEffect(() => {
        const checkDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        if (!checkDesktop) return;

        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            setMousePos({ x, y });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 w-full max-w-[100vw] h-[100dvh] overflow-hidden flex flex-col items-center selection:bg-teal-500/30">
            {/* Background */}
            <div className="bg-mesh" />

            {/* Desktop Parallax Typography */}
            <div
                className="massive-bg-text transition-transform duration-200 ease-out hidden md:block"
                style={{
                    transform: `translate(calc(-50% + ${mousePos.x * -50}px), calc(-50% + ${mousePos.y * -50}px)) rotateX(${mousePos.y * 15}deg) rotateY(${mousePos.x * 15}deg)`,
                }}
            >
                SALAH
            </div>
            {/* Mobile Vertical Typography */}
            <div className="massive-bg-text massive-bg-text-mobile md:hidden">SALAH</div>

            {/* Content Grid */}
            <div
                className="relative z-10 grid grid-rows-[auto_1fr_auto] h-full w-full max-w-4xl mx-auto px-4 md:px-8 py-4 md:py-8 overflow-hidden transition-transform duration-200 ease-out"
                style={
                    mousePos.x !== 0 || mousePos.y !== 0
                        ? {
                              perspective: 1000,
                              transform: `rotateX(${mousePos.y * 5}deg) rotateY(${mousePos.x * 5}deg)`,
                          }
                        : undefined
                }
            >
                {/* Top Nav */}
                <nav className="flex items-center justify-between pt-1 md:pt-2 pb-2 md:pb-6 flex-shrink-0">
                    <div
                        className="text-[10px] md:text-sm font-semibold tracking-[0.3em] text-slate-400 uppercase drop-shadow-md"
                        style={{ animation: "fadeInDown 1s ease-out both" }}
                    >
                        SalahMe
                    </div>
                    <div
                        className="flex items-center gap-2 bg-slate-800/90 md:bg-slate-800/60 md:backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10"
                        style={{ animation: "fadeInScale 0.5s ease-out 0.5s both" }}
                    >
                        <div className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.8)] animate-pulse" />
                        <span className="text-[9px] uppercase tracking-widest text-slate-200 font-medium">
                            Live
                        </span>
                    </div>
                </nav>

                {/* Prayer Cards */}
                <div className="w-full flex flex-col justify-center relative min-h-0">
                    {error && (
                        <div
                            className="absolute top-0 left-0 right-0 z-50 bg-rose-950/95 md:bg-rose-950/80 md:backdrop-blur-xl border border-rose-500/30 rounded-2xl p-4 text-rose-200 text-sm shadow-2xl"
                            style={{ animation: "fadeInDown 0.3s ease-out both" }}
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
                        </div>
                    )}

                    <div className="w-full flex flex-col justify-center py-2 md:py-6 relative min-h-0">
                        {prayers.length > 0 ? (
                            <PrayerList prayers={prayers} />
                        ) : (
                            <div className="opacity-0 pointer-events-none">
                                <PrayerList prayers={[]} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div
                    className="w-full flex-shrink-0 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 pt-2 md:pt-4"
                    style={{ animation: "fadeInUp 0.5s ease-out 0.4s both" }}
                >
                    <div className="w-full md:w-auto md:flex-1 max-w-sm mx-auto md:mx-0">
                        <LocationSelector
                            location={location}
                            onSearch={searchCity}
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="flex items-center justify-center gap-3 text-[10px] md:text-xs text-slate-400 uppercase tracking-[0.1em] px-4 py-3 bg-slate-900/95 md:bg-slate-900/60 rounded-2xl border border-white/5 md:backdrop-blur-md">
                        <span className="opacity-50">Method</span>
                        <div className="h-3 w-px bg-white/10" />
                        <span className="text-teal-400 font-medium">{CALCULATION_METHOD}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
