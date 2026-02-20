"use client";

import { LocationSelector } from "@/components/LocationSelector";
import { PrayerList } from "@/components/PrayerList";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { CALCULATION_METHOD } from "@/lib/constants";

/**
 * Main page — prayer times display matching salah.com
 */
export default function Home() {
    const { location, prayers, isLoading, error, searchCity, clearError } =
        usePrayerTimes();

    return (
        <>
            {/* Navigation */}
            <nav>
                <ul className="text-right p-5">
                    <li className="px-2.5 py-1.5 inline-block text-[#0284C8] font-bold">
                        Salah
                    </li>
                </ul>
            </nav>

            <div className="main-content text-center relative top-[20%]">
                <h1 className="text-white text-[60px] font-light">Salah</h1>

                {/* Error */}
                {error && (
                    <div className="mt-4 p-4 text-white normal-case">
                        <p>{error}</p>
                        <button
                            type="button"
                            onClick={clearError}
                            className="text-sm underline mt-2 hover:text-[#AAFFF4] transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Prayer list */}
                {prayers.length > 0 && <PrayerList prayers={prayers} />}

                <LocationSelector
                    location={location}
                    onSearch={searchCity}
                    isLoading={isLoading}
                />

                {/* Method badge */}
                <h4 className="text-[16px] text-[#AAFFF4] mt-2.5 font-light normal-case block text-center">
                    <span className="font-bold text-[#48D9E4] mr-1">
                        Method
                    </span>
                    {CALCULATION_METHOD}
                </h4>
            </div>
        </>
    );
}
