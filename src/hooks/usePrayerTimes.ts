"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { reverseGeocodeAction, searchCityAction } from "@/app/actions";
import { AUTO_REFRESH_INTERVAL, DEFAULT_CITY } from "@/lib/constants";
import { calculatePrayerTimes } from "@/lib/prayer-service";
import type {
    LocationData,
    UsePrayerTimesReturn,
    UsePrayerTimesState,
} from "@/lib/types";
import { getStorageItem, setStorageItem } from "@/lib/utils";

// Single cache key — stores full LocationData (city name is derived from it)
const LOCATION_CACHE_KEY = "salahme-location-cache";

function cacheLocation(location: LocationData): void {
    setStorageItem(LOCATION_CACHE_KEY, JSON.stringify(location));
}

function getCachedLocation(): LocationData | null {
    const raw = getStorageItem(LOCATION_CACHE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as LocationData;
    } catch {
        return null;
    }
}

function getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
            return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
        });
    });
}

/**
 * Hook for prayer times. Cache-first: on reload, shows cached data instantly.
 * Geolocation only runs on first-ever visit (no cache). After that, only
 * explicit city search triggers network calls.
 */
export function usePrayerTimes(): UsePrayerTimesReturn {
    // Always start with empty state — identical on server and client.
    // Reading localStorage here would cause a hydration mismatch because
    // the server has no localStorage and would render different HTML.
    const [state, setState] = useState<UsePrayerTimesState>({
        location: null,
        prayers: [],
        isLoading: false,
        error: null,
    });
    const initializedRef = useRef(false);
    // Keep a ref to the current location so the auto-refresh interval
    // always reads the latest value without closing over stale state.
    const locationRef = useRef<LocationData | null>(null);

    useEffect(() => {
        locationRef.current = state.location;
    }, [state.location]);

    /** Calculate + update state. `silent` = no loader (for background refreshes). */
    const loadPrayers = useCallback(
        async (
            latitude: number,
            longitude: number,
            locationOverride?: Partial<LocationData>,
            silent = false,
        ) => {
            if (!silent) {
                setState((prev) => ({ ...prev, isLoading: true, error: null }));
            }

            try {
                const { prayers } = calculatePrayerTimes(latitude, longitude);

                let location: LocationData;
                if (locationOverride?.cityName) {
                    location = {
                        cityName: locationOverride.cityName,
                        displayName:
                            locationOverride.displayName ||
                            locationOverride.cityName,
                        latitude,
                        longitude,
                        state: locationOverride.state,
                        stateCode: locationOverride.stateCode,
                        country: locationOverride.country,
                    };
                } else {
                    const geo = await reverseGeocodeAction(latitude, longitude);
                    location = geo.success
                        ? {
                              cityName: geo.cityName || "Current Location",
                              displayName: geo.displayName,
                              latitude,
                              longitude,
                              state: geo.state,
                              stateCode: geo.stateCode,
                              country: geo.country,
                          }
                        : {
                              cityName: "Current Location",
                              displayName: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
                              latitude,
                              longitude,
                          };
                }

                cacheLocation(location);
                setState({ location, prayers, isLoading: false, error: null });
            } catch {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: "Failed to calculate prayer times.",
                }));
            }
        },
        [],
    );

    const searchCity = useCallback(
        async (cityName: string) => {
            setState((prev) => ({ ...prev, isLoading: true, error: null }));
            const geo = await searchCityAction(cityName);
            if (!geo.success) {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: geo.error,
                }));
                return;
            }
            await loadPrayers(geo.latitude, geo.longitude, {
                cityName: geo.cityName,
                displayName: geo.displayName,
                state: geo.state,
                stateCode: geo.stateCode,
                country: geo.country,
            });
        },
        [loadPrayers],
    );

    const clearError = useCallback(() => {
        setState((prev) => ({ ...prev, error: null }));
    }, []);

    // Initial load — runs only on the client (useEffect never runs on server).
    // Cache-first: if we have a cached location, apply it immediately so the
    // UI populates as fast as possible without a network call.
    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        const cached = getCachedLocation();
        if (cached) {
            // Restore from cache instantly — no network needed
            const { prayers } = calculatePrayerTimes(cached.latitude, cached.longitude);
            setState({ location: cached, prayers, isLoading: false, error: null });
            return;
        }

        // First-ever visit: try geolocation, then fall back to default city
        const init = async () => {
            try {
                const pos = await getCurrentPosition();
                await loadPrayers(pos.coords.latitude, pos.coords.longitude);
                return;
            } catch {
                // Geolocation unavailable or denied
            }
            await searchCity(DEFAULT_CITY);
        };
        init();
    }, [searchCity, loadPrayers]);

    // Auto-refresh: recalculate prayer times locally every minute (NO network)
    useEffect(() => {
        if (!state.location) return;
        const id = setInterval(() => {
            // Use ref — always the latest location, no stale closure
            const loc = locationRef.current;
            if (loc) {
                const { prayers } = calculatePrayerTimes(
                    loc.latitude,
                    loc.longitude,
                );
                setState((prev) => ({ ...prev, prayers }));
            }
        }, AUTO_REFRESH_INTERVAL);
        return () => clearInterval(id);
    }, [state.location]);

    return { ...state, searchCity, clearError };
}
