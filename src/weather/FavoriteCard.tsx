import type { FavoriteCity } from "./types";
import { star, starFill } from "@/assets/icons";
import { iconMap } from "./iconMap";
import { useState } from "react";


interface FavoriteCardProps {
    entry: FavoriteCity
    live: { temp:number; icon:string; description:string } | null
    onRemove: () => void
    onSelect: () => void
}

export function FavoriteCard({entry, live, onSelect, onRemove }: FavoriteCardProps) {
    const [ isRemoving, setIsRemoving ] = useState(false)

    const handleRemove = () => {
        setIsRemoving(true)
        setTimeout(() => onRemove(), 150)
    }

    return (
        <div 
            className="flex justify-between items-center p-3 border border-[#777777]/20 rounded-[10px] cursor-pointer hover:bg-gray-50"
        >
            <div 
                className="flex gap-1.5"
                onClick={() => onSelect()}
            >
                <img 
                    src={live ? iconMap[live.icon] : undefined} 
                    alt="icon" 
                    width={56}
                    height={56}
                />

                <p className="flex flex-col gap-1.5">
                <span className="font-medium">{`${entry.city}, ${entry.country}`}</span>
                <span className="text-[#9797A0] font-medium">{live?.description}</span>    
                </p> 
                
            </div>

            <div className="flex gap-3.5">
            <p className="font-medium">{live ? `${live.temp > 0 ? "+" : "-"}${Math.floor(live?.temp)}°` : " "}</p>
            <img 
                src={isRemoving ? star : starFill} 
                alt="remove" 
                onClick={() => handleRemove()}
                className="cursor-pointer"
            />
            </div>


        </div>
    )
}