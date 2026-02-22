"use client";

import { CloudSun, Moon, Stars, Sun, Sunrise, Sunset } from "lucide-react";
import { useState } from "react";
import type { Prayer } from "@/lib/types";

const getIconForPrayer = (name: string, isSpecial: boolean) => {
    const props = {
        className: `w-5 h-5 md:w-8 md:h-8 ${isSpecial ? "text-teal-400" : "text-slate-400"}`,
    };
    switch (name.toLowerCase()) {
        case "fajr":
            return <CloudSun {...props} />;
        case "sunrise":
            return <Sunrise {...props} />;
        case "dhuhr":
            return <Sun {...props} />;
        case "asr":
            return <Sun {...props} />;
        case "maghrib":
            return <Sunset {...props} />;
        case "isha":
            return <Moon {...props} />;
        case "qiyam":
            return <Stars {...props} />;
        default:
            return <Stars {...props} />;
    }
};

export function PrayerItem({ prayer, index = 0 }: { prayer: Prayer; index?: number }) {
    const isHighlight = prayer.isSpecial;

    // 3D Tilt Physics (desktop only — touch events are blocked on mobile)
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        setMousePos({
            x: mouseX / rect.width,
            y: mouseY / rect.height,
        });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setMousePos({ x: 0.5, y: 0.5 });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    // Derived transforms for Desktop
    const rotateX = (mousePos.y - 0.5) * -30; // -15 to 15 deg
    const rotateY = (mousePos.x - 0.5) * 30; // -15 to 15 deg
    const shadowOpacity = 0.2 + mousePos.y * 0.4;

    const rowClass = isHighlight ? "card-3d-special" : "card-3d group-hover:bg-white/[0.04]";
    const nameClass = isHighlight
        ? "text-teal-400 font-bold text-glow-accent-soft"
        : "text-slate-300 font-medium";
    const timeClass = isHighlight ? "text-slate-50 font-bold" : "text-white";
    const periodClass = isHighlight ? "text-teal-200" : "text-slate-400";

    return (
        <div
            role="presentation"
            className={`relative w-full h-full cursor-crosshair group z-0 ${isHovered ? "z-10" : ""}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            style={{ animation: `fadeSlideIn 0.5s ease-out ${0.3 + index * 0.1}s both` }}
        >
            <div
                style={
                    isHovered
                        ? {
                              transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
                              boxShadow: `0 25px 50px -12px rgba(0,0,0,${shadowOpacity})`,
                              transition: "transform 0.1s ease-out, box-shadow 0.1s ease-out",
                          }
                        : {
                              transform:
                                  "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
                              transition: "transform 0.5s ease-out, box-shadow 0.5s ease-out",
                          }
                }
                className={`flex flex-col justify-between w-full h-full md:min-h-[180px] p-3 md:p-6 rounded-2xl md:rounded-3xl ${rowClass}`}
            >
                {/* Glossy inner reflection layer */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Content layers */}
                <div
                    className="flex items-start justify-between w-full mb-2 md:mb-6 relative z-10 duration-200"
                    style={isHovered ? { transform: "translateZ(30px)" } : undefined}
                >
                    <div
                        className={`text-sm md:text-2xl font-bold md:font-medium tracking-widest uppercase ${nameClass}`}
                    >
                        {prayer.displayName}
                    </div>
                    <div className="opacity-70 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
                        {getIconForPrayer(prayer.name, isHighlight)}
                    </div>
                </div>

                <div
                    className="flex items-baseline gap-2 relative z-10 duration-200"
                    style={isHovered ? { transform: "translateZ(50px)" } : undefined}
                >
                    <span
                        className={`text-2xl md:text-5xl tracking-tighter font-black ${timeClass}`}
                    >
                        {prayer.time}
                    </span>
                    <span
                        className={`text-[10px] md:text-lg font-bold tracking-[0.2em] uppercase ${periodClass}`}
                    >
                        {prayer.period}
                    </span>
                </div>

                {isHighlight && (
                    <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-teal-400/50 rounded-t-full shadow-[0_-2px_10px_rgba(45,212,191,0.5)] duration-200"
                        style={isHovered ? { transform: "translateZ(20px)" } : undefined}
                    />
                )}
            </div>
        </div>
    );
}
