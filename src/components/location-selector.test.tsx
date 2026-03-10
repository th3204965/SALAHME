import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LocationData } from "@/lib/types";
import { LocationSelector } from "./location-selector";

const mockLocation: LocationData = {
    cityName: "Jaipur",
    displayName: "Jaipur, Rajasthan, India",
    latitude: 26.9124,
    longitude: 75.7873,
    stateCode: "RJ",
    country: "India",
};

describe("LocationSelector", () => {
    it("should display the short location name", () => {
        render(<LocationSelector location={mockLocation} onSearch={vi.fn()} />);

        expect(screen.getByText("Jaipur, RJ")).toBeTruthy();
    });

    it('should show "Set Location" when location is null', () => {
        render(<LocationSelector location={null} onSearch={vi.fn()} />);

        expect(screen.getByText("Set Location")).toBeTruthy();
    });

    it("should switch to editing mode on click", () => {
        render(<LocationSelector location={mockLocation} onSearch={vi.fn()} />);

        const button = screen.getByText("Jaipur, RJ").closest("button");
        expect(button).toBeTruthy();

        if (button) fireEvent.click(button);

        expect(screen.getByPlaceholderText("Type city name...")).toBeTruthy();
    });

    it("should call onSearch when form is submitted", () => {
        const onSearch = vi.fn();
        render(<LocationSelector location={mockLocation} onSearch={onSearch} />);

        // Enter editing mode
        const editButton = screen.getByText("Jaipur, RJ").closest("button");
        if (editButton) fireEvent.click(editButton);

        const input = screen.getByPlaceholderText("Type city name...");
        fireEvent.change(input, { target: { value: "London" } });

        const form = input.closest("form");
        if (form) fireEvent.submit(form);

        expect(onSearch).toHaveBeenCalledWith("London");
    });

    it("should cancel editing on Escape key", () => {
        render(<LocationSelector location={mockLocation} onSearch={vi.fn()} />);

        // Enter editing mode
        const editButton = screen.getByText("Jaipur, RJ").closest("button");
        if (editButton) fireEvent.click(editButton);

        const input = screen.getByPlaceholderText("Type city name...");
        fireEvent.keyDown(input, { key: "Escape" });

        // Should revert to display mode
        expect(screen.getByText("Jaipur, RJ")).toBeTruthy();
    });

    it("should show loading spinner when isLoading is true", () => {
        const { container } = render(
            <LocationSelector location={mockLocation} onSearch={vi.fn()} isLoading />,
        );

        const spinner = container.querySelector(".animate-spin");
        expect(spinner).toBeTruthy();
    });
});
