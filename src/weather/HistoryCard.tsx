import { useLiveWeather } from "./useLiveWeather";
import type { HistoryEntry } from "./types";
import { Time } from "@/assets/icons";
import { formateRelativeDate } from "@/utils/dateUtils";

interface HistoryCardProps {
    entry: HistoryEntry
    onSelect: () => void
}


export function HistoryCard( { entry, onSelect }: HistoryCardProps) {
    const live = useLiveWeather(entry.lat, entry.lon)

    return (
        <div 
            className="flex justify-between items-center p-3 pr-4 border border-[#777777]/20 rounded-[10px] cursor-pointer hover:bg-gray-50"
            onClick={() => onSelect()}
        >
            <div className="flex items-center gap-3">
                <Time 
                className="text-[#777777]"
                width={30}
                height={30}
                />

                <p className="flex flex-col gap-1 font-medium">
                    <span>{`${entry.city}, ${entry.country}`}</span>
                    <span className="text-[14px] text-[#9797A0]">{formateRelativeDate(entry.searched_at)}</span>
                </p>
            </div>



            <p className="font-medium">{live ? `+${Math.round(live.temp)}°` : '...'}</p>
        </div>
    )
}