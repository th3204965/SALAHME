import { CalculationMethod, Coordinates, HighLatitudeRule, PrayerTimes } from "adhan";
import { PRAYER_DISPLAY_NAMES } from "@/lib/constants";
import type { Prayer as PrayerType } from "@/lib/types";

const SPECIAL_PRAYERS = new Set(["sunrise", "qiyam"]);

/** Format Date to "5:30 AM" style in the user's local timezone */
function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
}

/** Parse "5:30 AM" into { time: "5:30", period: "AM" } */
function parseTime(timeStr: string): { time: string; period: string } {
    const parts = timeStr.split(" ");
    return parts.length === 2
        ? { time: parts[0], period: parts[1] }
        : { time: timeStr, period: "" };
}

/** Calculate Qiyam: start of the last third of the night (⅔ from Isha toward Fajr) */
function calculateQiyam(fajrTime: Date, ishaTime: Date): Date {
    const ishaMs = ishaTime.getTime();
    let fajrMs = fajrTime.getTime();
    if (fajrMs < ishaMs) fajrMs += 24 * 60 * 60 * 1000;
    return new Date(ishaMs + (2 * (fajrMs - ishaMs)) / 3);
}

export interface PrayerTimesResult {
    prayers: PrayerType[];
    date: string;
    timezone: string;
}

export function calculatePrayerTimes(latitude: number, longitude: number): PrayerTimesResult {
    const today = new Date();
    const coordinates = new Coordinates(latitude, longitude);
    const params = CalculationMethod.Karachi();
    params.highLatitudeRule = HighLatitudeRule.TwilightAngle;

    const pt = new PrayerTimes(coordinates, today, params);
    const qiyamTime = calculateQiyam(pt.fajr, pt.isha);

    const prayerEntries: Record<string, Date> = {
        fajr: pt.fajr,
        sunrise: pt.sunrise,
        dhuhr: pt.dhuhr,
        asr: pt.asr,
        maghrib: pt.maghrib,
        isha: pt.isha,
        qiyam: qiyamTime,
    };

    const prayers: PrayerType[] = Object.entries(prayerEntries).map(([name, date]) => {
        const formatted = formatTime(date);
        const { time, period } = parseTime(formatted);
        return {
            name,
            displayName: PRAYER_DISPLAY_NAMES[name] || name,
            time,
            period,
            isSpecial: SPECIAL_PRAYERS.has(name),
        };
    });

    return {
        prayers,
        date: today.toISOString().split("T")[0],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
}
