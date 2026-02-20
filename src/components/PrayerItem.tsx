import type { Prayer } from "@/lib/types";

/**
 * Individual prayer row displaying name and time.
 * Special prayers (Sunrise, Qiyam) have cyan styling.
 */
export function PrayerItem({ prayer }: { prayer: Prayer }) {
    const textClass = prayer.isSpecial ? "text-[#7BF2FB]" : "text-white";
    const timeClass = prayer.isSpecial ? "text-[#48D9E4]" : "text-[#AAFFF4]";

    return (
        <div>
            <dt
                className={`w-[49%] float-left h-[57px] leading-[33px] text-[32px] font-light clear-both mr-2.5 text-right ${textClass}`}
            >
                {prayer.displayName}
            </dt>
            <dd
                className={`w-[49%] float-left h-[57px] leading-[33px] text-[32px] font-light overflow-hidden text-left ${textClass}`}
            >
                <span
                    className={`block float-left w-[100px] text-[38px] text-right pr-[25px] ${timeClass}`}
                >
                    {prayer.time}
                </span>
                {prayer.period}
            </dd>
        </div>
    );
}
