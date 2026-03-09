import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { PRAYER_DISPLAY_NAMES } from "./constants";
import { calculatePrayerTimes } from "./prayer-service";

describe("prayer-service", () => {
    // Mock the system time so that tests don't fail based on the current day
    beforeAll(() => {
        vi.useFakeTimers();
        // Set date to a known fixed date (e.g. 2026-03-09T10:00:00.000Z)
        vi.setSystemTime(new Date(2026, 2, 9, 10, 0, 0));
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    it("should calculate all 7 prayer times correctly for a given coordinate", () => {
        // Bissau coordinates from constants
        const lat = 28.2469;
        const lng = 75.0765;

        const result = calculatePrayerTimes(lat, lng);

        expect(result.date).toBe("2026-03-09");
        // The timezone returned depends on the execution environment so we just check it exists
        expect(result.timezone).toBeTruthy();
        expect(result.prayers).toHaveLength(7);

        const expectedPrayerNames = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha", "qiyam"];

        expectedPrayerNames.forEach((name, idx) => {
            const prayer = result.prayers[idx];
            expect(prayer.name).toBe(name);
            expect(prayer.displayName).toBe(PRAYER_DISPLAY_NAMES[name]);
            // check structure of formatted times
            expect(typeof prayer.time).toBe("string");
            expect(prayer.time.length).toBeGreaterThan(0);
            expect(["AM", "PM", ""]).toContain(prayer.period);
        });

        const specialPrayers = result.prayers.filter((p) => p.isSpecial);
        expect(specialPrayers).toHaveLength(2);
        expect(specialPrayers.map((p) => p.name)).toEqual(["sunrise", "qiyam"]);
    });
});
