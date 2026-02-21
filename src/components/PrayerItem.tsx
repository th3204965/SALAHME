"use client";

import type { Prayer } from "@/lib/types";
import { motion, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
import { Sunrise, Sun, Moon, Sunset, CloudSun, Stars } from "lucide-react";
import { useEffect, useState } from "react";

const getIconForPrayer = (name: string, isSpecial: boolean) => {
    const props = { className: `w-5 h-5 md:w-8 md:h-8 ${isSpecial ? 'text-teal-400' : 'text-slate-400'}` };
    switch (name.toLowerCase()) {
        case 'fajr': return <CloudSun {...props} />;
        case 'sunrise': return <Sunrise {...props} />;
        case 'dhuhr': return <Sun {...props} />;
        case 'asr': return <Sun {...props} />;
        case 'maghrib': return <Sunset {...props} />;
        case 'isha': return <Moon {...props} />;
        case 'qiyam': return <Stars {...props} />;
        default: return <Stars {...props} />;
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9, rotateX: 10 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 12
        }
    }
};

export function PrayerItem({ prayer }: { prayer: Prayer }) {
    const isHighlight = prayer.isSpecial;

    // 3D Tilt Physics
    const x = useMotionValue(0.5); // Start at center 0 to 1
    const y = useMotionValue(0.5);

    const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        setIsMobile(window.matchMedia("(hover: none)").matches);
    }, []);

    // Rotate up to 15 degrees in any direction
    const rotateX = useTransform(mouseYSpring, [0, 1], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [0, 1], ["-15deg", "15deg"]);

    // Dynamic shadow depending on where the mouse is
    const dropShadow = useTransform(
        mouseYSpring,
        [0, 1],
        ["0 25px 50px -12px rgba(0,0,0,0.6)", "0 5px 15px -5px rgba(0,0,0,0.2)"]
    );

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (isMobile) return;
        // We calculate position directly on the non-rotated wrapper!
        // This ensures the mouse stays perfectly tracked, as the bounding rect never distorts.
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / rect.width);
        y.set(mouseY / rect.height);
    };

    const handleMouseLeave = () => {
        // Reset to center
        x.set(0.5);
        y.set(0.5);
    };

    // Mobile fallback check - disable 3D on small static touches if needed, but framer motion handles it well
    const rowClass = isHighlight ? "card-3d-special" : "card-3d group-hover:bg-white/[0.04]";
    const nameClass = isHighlight ? "text-teal-400 font-bold text-glow-accent-soft" : "text-slate-300 font-medium";
    const timeClass = isHighlight ? "text-slate-50 font-bold" : "text-white";
    const periodClass = isHighlight ? "text-teal-200" : "text-slate-400";

    return (
        <motion.div
            variants={itemVariants}
            className="relative w-full h-full cursor-crosshair group perspective-1000 z-0"
            style={{ perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.02, zIndex: 10 }}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    boxShadow: dropShadow,
                    transformStyle: "preserve-3d"
                }}
                className={`flex flex-col justify-between w-full h-full min-h-[130px] md:min-h-[180px] p-4 md:p-6 rounded-2xl md:rounded-3xl transition-colors duration-500 ${rowClass}`}
            >
                {/* Glossy inner reflection layer */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Content layers */}
                <div
                    className="flex items-start justify-between w-full mb-6 relative z-10"
                    style={{ transform: "translateZ(30px)" }}
                >
                    <div className={`text-base md:text-2xl font-bold md:font-medium tracking-widest uppercase ${nameClass}`}>
                        {prayer.displayName}
                    </div>
                    <div className="opacity-70 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
                        {getIconForPrayer(prayer.name, isHighlight)}
                    </div>
                </div>

                <div
                    className="flex items-baseline gap-2 relative z-10"
                    style={{ transform: "translateZ(50px)" }}
                >
                    <span className={`text-3xl md:text-5xl tracking-tighter ${timeClass}`}>
                        {prayer.time}
                    </span>
                    <span className={`text-xs md:text-lg font-bold tracking-[0.2em] uppercase ${periodClass}`}>
                        {prayer.period}
                    </span>
                </div>

                {isHighlight && (
                    <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-teal-400/50 rounded-t-full shadow-[0_-2px_10px_rgba(45,212,191,0.5)]"
                        style={{ transform: "translateZ(20px)" }}
                    />
                )}
            </motion.div>
        </motion.div>
    );
}
