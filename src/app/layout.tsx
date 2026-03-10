import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "SalahMe - Prayer Times",
    description:
        "Accurate Islamic prayer times for any location. Get prayer times based on your city with the Karachi calculation method.",
    keywords: [
        "prayer times",
        "salah",
        "islamic",
        "muslim",
        "adhan",
        "fajr",
        "dhuhr",
        "asr",
        "maghrib",
        "isha",
    ],
    icons: {
        icon: "/img/favicon.svg",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
    themeColor: "#020617",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="dns-prefetch" href="https://nominatim.openstreetmap.org" />
                <link
                    rel="preconnect"
                    href="https://nominatim.openstreetmap.org"
                    crossOrigin="anonymous"
                />
            </head>
            <body className={outfit.className}>
                <ErrorBoundary>{children}</ErrorBoundary>
            </body>
        </html>
    );
}
