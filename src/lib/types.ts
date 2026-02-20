// ============================================
// Core Types
// ============================================

/** Single prayer for display */
export interface Prayer {
    name: string;
    displayName: string;
    time: string;
    period: string;
    isSpecial: boolean;
}

/** Location data stored and displayed in the UI */
export interface LocationData {
    cityName: string;
    displayName: string;
    latitude: number;
    longitude: number;
    state?: string;
    stateCode?: string;
    country?: string;
}

/** Geocode result from server actions */
export type GeocodeResult =
    | {
          success: true;
          latitude: number;
          longitude: number;
          displayName: string;
          cityName: string;
          state?: string;
          stateCode?: string;
          country?: string;
      }
    | { success: false; error: string };

// ============================================
// Hook Types
// ============================================

export interface UsePrayerTimesState {
    location: LocationData | null;
    prayers: Prayer[];
    isLoading: boolean;
    error: string | null;
}

export interface UsePrayerTimesReturn extends UsePrayerTimesState {
    searchCity: (cityName: string) => Promise<void>;
    clearError: () => void;
}
