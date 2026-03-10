import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Prayer } from "@/lib/types";
import { PrayerList } from "./prayer-list";

const mockPrayers: Prayer[] = [
    { name: "fajr", displayName: "Fajr", time: "5:30", period: "AM", isSpecial: false },
    { name: "sunrise", displayName: "Sunrise", time: "6:45", period: "AM", isSpecial: true },
    { name: "dhuhr", displayName: "Dhuhr", time: "12:15", period: "PM", isSpecial: false },
];

describe("PrayerList", () => {
    it("should render the correct number of prayer items", () => {
        render(<PrayerList prayers={mockPrayers} />);

        expect(screen.getByText("Fajr")).toBeTruthy();
        expect(screen.getByText("Sunrise")).toBeTruthy();
        expect(screen.getByText("Dhuhr")).toBeTruthy();
    });

    it("should render an empty grid when no prayers are provided", () => {
        const { container } = render(<PrayerList prayers={[]} />);

        const grid = container.firstChild as HTMLElement;
        expect(grid).toBeTruthy();
        expect(grid.children.length).toBe(0);
    });

    it("should render time values for each prayer", () => {
        render(<PrayerList prayers={mockPrayers} />);

        expect(screen.getByText("5:30")).toBeTruthy();
        expect(screen.getByText("6:45")).toBeTruthy();
        expect(screen.getByText("12:15")).toBeTruthy();
    });
});
