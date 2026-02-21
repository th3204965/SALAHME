import type { Prayer } from "@/lib/types";
import { PrayerItem } from "./PrayerItem";
import { motion } from "framer-motion";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        }
    }
};

export function PrayerList({ prayers }: { prayers: Prayer[] }) {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full flex flex-col gap-2.5"
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
