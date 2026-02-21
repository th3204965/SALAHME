"use client";

import type { Prayer } from "@/lib/types";
import { motion, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
import { Sunrise, Sun, Moon, Sunset, CloudSun, Stars } from "lucide-react";

const getIconForPrayer = (name: string, isSpecial: boolean) => {
    const props = { className: `w-6 h-6 md:w-8 md:h-8 ${isSpecial ? 'text-teal-400' : 'text-slate-400'}` };
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
    hidden: { opacity: 0, y: 30, scale: 0.9, rotateX: 15 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 14
        }
    }
};

export function PrayerItem({ prayer }: { prayer: Prayer }) {
    const isHighlight = prayer.isSpecial;

    // 3D Tilt Physics
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
    const dropShadow = useTransform(
        mouseYSpring,
        [-0.5, 0.5],
        ["0 25px 50px -12px rgba(0,0,0,0.8)", "0 5px 15px -5px rgba(0,0,0,0.3)"]
    );

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const rowClass = isHighlight ? "card-3d-special" : "card-3d hover:bg-white/[0.04]";
    const nameClass = isHighlight ? "text-teal-400 font-bold text-glow-accent-soft" : "text-slate-300 font-medium";
    const timeClass = isHighlight ? "text-slate-50 font-bold" : "text-white";
    const periodClass = isHighlight ? "text-teal-200" : "text-slate-400";

    return (
        <motion.div
            variants={itemVariants}
            style={{ rotateX, rotateY, boxShadow: dropShadow, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.05, zIndex: 10 }}
            className={`relative flex flex-col justify-between w-full p-5 md:p-6 rounded-3xl transition-colors duration-500 cursor-crosshair ${rowClass} group`}
        >
            {/* Glossy inner reflection layer */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Content layered with translation for depth */}
            <div
                className="flex items-start justify-between w-full mb-6 relative z-10"
                style={{ transform: "translateZ(30px)" }}
            >
                <div className={`text-xl md:text-2xl tracking-widest uppercase ${nameClass}`}>
                    {prayer.displayName}
                </div>
                <div className="opacity-70 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
                    {getIconForPrayer(prayer.name, isHighlight)}
                </div>
            </div>

            <div
                className="flex items-baseline gap-2 relative z-10"
                style={{ transform: "translateZ(50px)" }} // Pops out more than the title
            >
                <span className={`text-4xl md:text-5xl tracking-tighter ${timeClass}`}>
                    {prayer.time}
                </span>
                <span className={`text-base md:text-lg font-bold tracking-[0.2em] uppercase ${periodClass}`}>
                    {prayer.period}
                </span>
            </div>

            {/* Subtle bottom indicator */}
            {isHighlight && (
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-teal-400/50 rounded-t-full shadow-[0_-2px_10px_rgba(45,212,191,0.5)]"
                    style={{ transform: "translateZ(20px)" }}
                />
            )}
        </motion.div>
    );
}
