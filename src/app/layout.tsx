import type { Metadata } from "next";
import { Outfit } from "next/font/google";
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
        icon: "/img/favicon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={outfit.className}>{children}</body>
        </html>
    );
}
