"use client";

import { MapPin, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { LocationData } from "@/lib/types";
import { getShortLocation } from "@/lib/utils";

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
        <div className="w-full relative h-[60px]">
            {!isEditing ? (
                <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="absolute inset-0 flex items-center justify-between px-6 bg-slate-900/95 md:bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 rounded-2xl transition-colors duration-300 w-full md:backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.3)] cursor-pointer overflow-hidden"
                    style={{ animation: "fadeInScale 0.3s ease-out both" }}
                >
                    <div className="flex items-center gap-4 overflow-hidden">
                        <MapPin className="w-5 h-5 text-teal-400 flex-shrink-0" />
                        <span className="text-sm md:text-base text-slate-300 truncate tracking-widest font-medium uppercase">
                            {locationText}
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="h-5 w-5 rounded-full border-2 border-teal-500/50 border-t-teal-400 animate-spin flex-shrink-0" />
                    ) : (
                        <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-slate-500 font-bold flex-shrink-0">
                            Change
                        </div>
                    )}
                </button>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="absolute inset-0 flex items-center bg-slate-900 border border-teal-500/50 rounded-2xl px-5 shadow-[0_15px_40px_rgba(45,212,191,0.2)] w-full z-20 overflow-hidden"
                    style={{ animation: "fadeInScale 0.2s ease-out both" }}
                >
                    <Search className="w-5 h-5 text-teal-400 mr-4 flex-shrink-0" />
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
                        className="flex-1 bg-transparent border-none outline-none text-white text-base md:text-lg placeholder-slate-500/50 disabled:opacity-50 font-bold tracking-widest uppercase min-w-0"
                    />

                    {isLoading ? (
                        <div className="h-5 w-5 rounded-full border-2 border-teal-500/50 border-t-teal-400 animate-spin flex-shrink-0 ml-3" />
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                setCityName("");
                            }}
                            className="ml-3 p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                        >
                            <X className="w-5 h-5 text-slate-400 hover:text-rose-400 transition-colors" />
                        </button>
                    )}
                    <button type="submit" className="sr-only" tabIndex={-1}>
                        Search
                    </button>
                </form>
            )}
        </div>
    );
}
