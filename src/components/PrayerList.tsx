import type { Prayer } from "@/lib/types";
import { PrayerItem } from "./PrayerItem";
import { motion } from "framer-motion";

const gridContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        }
    }
};

export function PrayerList({ prayers }: { prayers: Prayer[] }) {
    return (
        <motion.div
            variants={gridContainer}
            initial="hidden"
            animate="show"
            className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 preserve-3d"
            style={{ transformStyle: "preserve-3d" }}
        >
            {prayers.map((prayer) => (
                <PrayerItem
                    key={prayer.name}
                    prayer={prayer}
                />
            ))}
        </motion.div>
    );
}
