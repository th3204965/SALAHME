"use client";

import { useEffect, useRef, useState } from "react";
import type { LocationData } from "@/lib/types";
import { getShortLocation } from "@/lib/utils";
import { MapPin, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LocationSelector({
    location,
    onSearch,
    isLoading = false,
}: {
    location: LocationData | null;
    onSearch: (cityName: string) => void;
    isLoading?: boolean;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [cityName, setCityName] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cityName.trim() && !isLoading) {
            onSearch(cityName.trim());
            setCityName("");
            setIsEditing(false);
        }
    };

    const locationText = location
        ? getShortLocation(
            location.displayName,
            location.cityName,
            location.state,
            location.stateCode,
            location.country,
        )
        : "Set Location";

    return (
        <div className="w-full relative h-[52px]">
            <AnimatePresence mode="wait">
                {!isEditing ? (
                    <motion.button
                        key="button"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="group absolute inset-0 flex items-center justify-between px-6 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-2xl transition-all duration-300 w-full"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
                            <span className="text-sm md:text-base text-white/70 group-hover:text-white truncate tracking-wide font-light">
                                {locationText}
                            </span>
                        </div>

                        {isLoading ? (
                            <div className="h-4 w-4 rounded-full border-2 border-sky-500/50 border-t-sky-400 animate-spin flex-shrink-0" />
                        ) : (
                            <div className="text-[10px] uppercase tracking-[0.2em] text-white/20 group-hover:text-white/40 font-semibold transition-colors">
                                Change
                            </div>
                        )}
                    </motion.button>
                ) : (
                    <motion.form
                        key="form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleSubmit}
                        className="absolute inset-0 flex items-center bg-zinc-900 border border-sky-500/30 rounded-2xl px-4 shadow-[0_0_20px_rgba(56,189,248,0.15)] w-full z-20"
                    >
                        <Search className="w-4 h-4 text-sky-400 mr-3 flex-shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={cityName}
                            onChange={(e) => setCityName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                    setIsEditing(false);
                                    setCityName("");
                                }
                            }}
                            disabled={isLoading}
                            placeholder="Type city name..."
                            className="flex-1 bg-transparent border-none outline-none text-white text-sm md:text-base placeholder-white/30 disabled:opacity-50 font-light w-full min-w-0"
                        />

                        {isLoading ? (
                            <div className="h-4 w-4 rounded-full border-2 border-sky-500/50 border-t-sky-400 animate-spin flex-shrink-0 ml-2" />
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setCityName("");
                                }}
                                className="ml-2 p-1.5 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                            >
                                <X className="w-4 h-4 text-white/50 hover:text-white" />
                            </button>
                        )}
                        <button type="submit" className="sr-only" tabIndex={-1}>Search</button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}
