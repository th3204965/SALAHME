/** Display names for prayers */
export const PRAYER_DISPLAY_NAMES: Record<string, string> = {
    fajr: "Fajr",
    sunrise: "Sunrise",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    qiyam: "Qiyam",
};

/** Default location to load instantly on initial visit without network requests */
export const DEFAULT_LOCATION = {
    cityName: "Bissau",
    displayName: "Bissau, RJ",
    latitude: 28.2469,
    longitude: 75.0765,
    state: "Rajasthan",
    stateCode: "RJ",
    country: "India",
};

/** Calculation method display name */
export const CALCULATION_METHOD = "University of Islamic Sciences, Karachi";

/** Local storage key for persisting last searched city */
export const STORAGE_KEY = "salahme-last-city";

/** Auto-refresh interval in milliseconds (1 minute) */
export const AUTO_REFRESH_INTERVAL = 60000;
