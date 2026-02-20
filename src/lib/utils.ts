/**
 * Extract short location name (e.g. "Jaipur, RJ")
 */
export function getShortLocation(
    displayName: string,
    city?: string,
    state?: string,
    stateCode?: string,
    country?: string,
): string {
    if (city) {
        if (stateCode) return `${city}, ${stateCode}`;
        if (state) return `${city}, ${state}`;
        if (country) return `${city}, ${country}`;
        return city;
    }
    const parts = displayName.split(",");
    if (parts.length >= 2) {
        return `${parts[0].trim()}, ${parts[1].trim()}`;
    }
    return displayName;
}

/** Safely get item from localStorage */
export function getStorageItem(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

/** Safely set item in localStorage */
export function setStorageItem(key: string, value: string): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(key, value);
    } catch {
        // Ignore storage errors
    }
}
