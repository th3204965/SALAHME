import type { Prayer } from "@/lib/types";
import { motion, type Variants } from "framer-motion";

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20, filter: "blur(4px)" },
    show: {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20
        }
    }
};

export function PrayerItem({ prayer }: { prayer: Prayer }) {
    const isHighlight = prayer.isSpecial;

    // Aesthetic switch based on whether it's a "special" prayer
    const rowClass = isHighlight ? "premium-row-special" : "premium-row hover:bg-white/[0.04]";
    const nameClass = isHighlight ? "text-sky-400 font-medium text-glow-accent" : "text-white/80 font-light";
    const timeClass = isHighlight ? "text-white font-medium" : "text-white";
    const periodClass = isHighlight ? "text-sky-200" : "text-white/40";

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            className={`flex items-baseline justify-between w-full px-6 py-4 rounded-2xl transition-all duration-300 ${rowClass}`}
        >
            <div className={`text-xl md:text-2xl tracking-wide ${nameClass}`}>
                {prayer.displayName}
            </div>

            <div className="flex items-baseline gap-2">
                <span className={`text-3xl md:text-4xl tracking-tighter ${timeClass}`}>
                    {prayer.time}
                </span>
                <span className={`text-sm md:text-base font-medium tracking-widest uppercase ${periodClass}`}>
                    {prayer.period}
                </span>
            </div>
        </motion.div>
    );
}
