import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Prayer } from "@/lib/types";
import { PrayerItem } from "./prayer-item";

const normalPrayer: Prayer = {
    name: "dhuhr",
    displayName: "Dhuhr",
    time: "12:15",
    period: "PM",
    isSpecial: false,
};

const specialPrayer: Prayer = {
    name: "sunrise",
    displayName: "Sunrise",
    time: "6:45",
    period: "AM",
    isSpecial: true,
};

describe("PrayerItem", () => {
    it("should render the prayer name and time", () => {
        render(<PrayerItem prayer={normalPrayer} />);

        expect(screen.getByText("Dhuhr")).toBeTruthy();
        expect(screen.getByText("12:15")).toBeTruthy();
        expect(screen.getByText("PM")).toBeTruthy();
    });

    it("should render a special prayer with accent styling", () => {
        const { container } = render(<PrayerItem prayer={specialPrayer} />);

        expect(screen.getByText("Sunrise")).toBeTruthy();
        // Special prayers get the card-3d-special class
        const specialCard = container.querySelector(".card-3d-special");
        expect(specialCard).toBeTruthy();
    });

    it("should render a normal prayer with standard styling", () => {
        const { container } = render(<PrayerItem prayer={normalPrayer} />);

        const normalCard = container.querySelector(".card-3d");
        expect(normalCard).toBeTruthy();
    });
});
