"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { LocationData } from "@/lib/types";
import { getShortLocation } from "@/lib/utils";

/**
 * Location selector — clean conditional rendering.
 * Click location text → search input appears.
 * Spinner only on the geo icon during loading.
 */
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
        : "SELECT LOCATION";

    const spinner = (
        <div className="h-5 w-5 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
    );

    const geoIcon = <Image height={20} width={20} src="/img/geo.svg" alt="" />;

    if (!isEditing) {
        return (
            <div className="flex justify-center mt-4">
                <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="group flex items-center gap-2 text-[26px] text-white/90 hover:text-white font-light tracking-wide uppercase transition-colors duration-300"
                    aria-label="Change location"
                >
                    {locationText}
                    <div className="opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                        {isLoading ? spinner : geoIcon}
                    </div>
                </button>
            </div>
        );
    }

    return (
        <div className="flex justify-center mt-4">
            <h2 className="text-[26px] text-white border-b border-[#76EEF7] inline-block px-10 pb-2 relative">
                <button
                    type="button"
                    onClick={() => {
                        setIsEditing(false);
                        setCityName("");
                    }}
                    className="h-6 mt-1 cursor-pointer absolute right-0 transition-transform duration-200 hover:scale-110"
                    disabled={isLoading}
                    aria-label="Cancel search"
                >
                    {isLoading ? spinner : geoIcon}
                </button>

                <form onSubmit={handleSubmit} className="inline-block">
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
                        placeholder="Search City..."
                        className="location-input bg-transparent border-none outline-none text-white w-[250px] text-center placeholder-white/50 disabled:opacity-50 font-light uppercase"
                    />
                    {/* Hidden submit button — lets mobile keyboards show a "Go" action */}
                    <button
                        type="submit"
                        className="sr-only"
                        aria-hidden="true"
                        tabIndex={-1}
                    >
                        Search
                    </button>
                </form>
            </h2>
        </div>
    );
}
