import type { Prayer } from "@/lib/types";
import { PrayerItem } from "./PrayerItem";

/**
 * Container for the list of prayer times
 */
export function PrayerList({ prayers }: { prayers: Prayer[] }) {
    return (
        <dl className="overflow-hidden mt-[60px] mb-[45px]">
            {prayers.map((prayer) => (
                <PrayerItem key={prayer.name} prayer={prayer} />
            ))}
        </dl>
    );
}
