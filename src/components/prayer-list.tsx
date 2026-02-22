import type { Prayer } from "@/lib/types";
import { PrayerItem } from "./prayer-item";

export function PrayerList({ prayers }: { prayers: Prayer[] }) {
    return (
        <div className="w-full h-full grid grid-cols-2 lg:grid-cols-3 auto-rows-1fr gap-2 md:gap-5 overflow-hidden">
            {prayers.map((prayer, i) => (
                <PrayerItem key={prayer.name} prayer={prayer} index={i} />
            ))}
        </div>
    );
}
