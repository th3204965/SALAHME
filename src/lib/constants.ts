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

/** Default city to load on initial visit */
export const DEFAULT_CITY = "Karachi";

/** Calculation method display name */
export const CALCULATION_METHOD = "University of Islamic Sciences, Karachi";

/** Local storage key for persisting last searched city */
export const STORAGE_KEY = "salahme-last-city";

/** Auto-refresh interval in milliseconds (1 minute) */
export const AUTO_REFRESH_INTERVAL = 60000;
