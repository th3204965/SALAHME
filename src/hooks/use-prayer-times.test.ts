import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as actions from "@/app/actions";
import { DEFAULT_LOCATION } from "@/lib/constants";
import { usePrayerTimes } from "./use-prayer-times";

vi.mock("@/app/actions", () => ({
    reverseGeocodeAction: vi.fn(),
    searchCityAction: vi.fn(),
}));

describe("usePrayerTimes", () => {
    beforeEach(() => {
        // Clear mocked actions
        vi.clearAllMocks();
        // Clear local storage
        window.localStorage.clear();
        // Mock system time for predictable prayer calculations
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 2, 9, 10, 0, 0));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should initialize with default location when cache is empty", () => {
        const { result } = renderHook(() => usePrayerTimes());

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.location).toEqual(
            expect.objectContaining({
                cityName: DEFAULT_LOCATION.cityName,
                latitude: DEFAULT_LOCATION.latitude,
                longitude: DEFAULT_LOCATION.longitude,
            }),
        );
        expect(result.current.prayers.length).toBeGreaterThan(0);
    });

    it("should initialize with cached location when available", () => {
        const cachedLocation = {
            cityName: "Test City",
            displayName: "Test City, TS",
            latitude: 40.7128,
            longitude: -74.006,
        };
        // The hook uses "salahme-location-cache"
        window.localStorage.setItem("salahme-location-cache", JSON.stringify(cachedLocation));

        const { result } = renderHook(() => usePrayerTimes());

        expect(result.current.location).toEqual(cachedLocation);
        expect(result.current.prayers.length).toBeGreaterThan(0);
    });

    it("should clear error when clearError is called", async () => {
        const { result } = renderHook(() => usePrayerTimes());

        vi.mocked(actions.searchCityAction).mockResolvedValueOnce({
            success: false,
            error: "City not found",
        });

        await act(async () => {
            await result.current.searchCity("UnknownCity");
        });

        expect(result.current.error).toBe("City not found");

        act(() => {
            result.current.clearError();
        });

        expect(result.current.error).toBeNull();
    });
});
