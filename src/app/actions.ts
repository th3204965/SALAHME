"use server";

import type { GeocodeResult } from "@/lib/types";

interface NominatimResult {
    lat: string;
    lon: string;
    display_name: string;
    address: {
        city?: string;
        town?: string;
        village?: string;
        hamlet?: string;
        municipality?: string;
        state?: string;
        "ISO3166-2-lvl4"?: string;
        country?: string;
    };
}

/** Extract city, state, stateCode from Nominatim address */
function parseAddress(address: NominatimResult["address"], fallbackCity: string) {
    const cityName =
        address.city ||
        address.town ||
        address.village ||
        address.hamlet ||
        address.municipality ||
        fallbackCity;

    let stateCode = address["ISO3166-2-lvl4"];
    if (stateCode?.includes("-")) {
        stateCode = stateCode.split("-")[1];
    }

    return {
        cityName,
        state: address.state,
        stateCode,
        country: address.country,
    };
}

export async function searchCityAction(cityName: string): Promise<GeocodeResult> {
    const trimmed = cityName?.trim();
    if (!trimmed || trimmed.length < 2) {
        return { success: false, error: "Please enter a valid city name" };
    }

    try {
        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("q", trimmed);
        url.searchParams.set("format", "json");
        url.searchParams.set("limit", "1");
        url.searchParams.set("addressdetails", "1");

        const response = await fetch(url.toString(), {
            headers: {
                "User-Agent": "SalahMe-App/1.0 (Prayer Times Application)",
                Accept: "application/json",
            },
            next: { revalidate: 86400 },
        });

        if (!response.ok) {
            return {
                success: false,
                error: "Failed to connect to geocoding service.",
            };
        }

        const data = (await response.json()) as NominatimResult[];
        if (!Array.isArray(data) || data.length === 0) {
            return {
                success: false,
                error: `Location "${trimmed}" not found.`,
            };
        }

        const result = data[0];
        const latitude = Number.parseFloat(result.lat);
        const longitude = Number.parseFloat(result.lon);
        if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
            return {
                success: false,
                error: "Invalid coordinates from geocoding service.",
            };
        }

        const addr = parseAddress(result.address, trimmed);
        return {
            success: true,
            latitude,
            longitude,
            displayName: result.display_name,
            ...addr,
        };
    } catch {
        return { success: false, error: "An unexpected error occurred." };
    }
}

export async function reverseGeocodeAction(
    latitude: number,
    longitude: number,
): Promise<GeocodeResult> {
    try {
        const url = new URL("https://nominatim.openstreetmap.org/reverse");
        url.searchParams.set("lat", latitude.toString());
        url.searchParams.set("lon", longitude.toString());
        url.searchParams.set("format", "json");
        url.searchParams.set("addressdetails", "1");

        const response = await fetch(url.toString(), {
            headers: {
                "User-Agent": "SalahMe-App/1.0 (Prayer Times Application)",
                Accept: "application/json",
            },
            next: { revalidate: 86400 },
        });

        if (!response.ok) {
            return { success: false, error: "Failed to get location name." };
        }

        const data = (await response.json()) as NominatimResult;
        if (!data?.display_name) {
            return { success: false, error: "Could not determine location." };
        }

        const addr = parseAddress(data.address, data.display_name.split(",")[0]);
        return {
            success: true,
            latitude,
            longitude,
            displayName: data.display_name,
            ...addr,
        };
    } catch {
        return { success: false, error: "An unexpected error occurred." };
    }
}
