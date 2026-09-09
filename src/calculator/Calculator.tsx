import DefaultCalculator from "./var/DefaultCalculator"
import SegmentedCalculator from "./var/SegmentedCalculator"
import { useState } from "react"

function Calculator() {
    const [currentVar, setCurrentVar] = useState("default")

    return (
        <div className="flex h-full flex-col items-center gap-4 md:gap-4.5 lg:gap-6.5 pt-10">
            <div className="flex gap-2 md:gap-2 lg:gap-4">
                <button 
                    className={`${currentVar === 'default' ? 'bg-[#575757]' : 'bg-[#7C7C7C] hover:bg-[#BABABA]'} text-[10px] md:text-[12px] lg:text-[16px] text-white font-medium rounded-md md:rounded-lg py-1.5 md:py-2 px-2.5 cursor-pointer select-none`}
                    onClick={() => setCurrentVar("default")}>
                        Обычный
                    </button>
                <button 
                    className={`${currentVar === 'segmented' ? 'bg-[#2d7b59]' : 'bg-[#49B989] hover:bg-[#60D5A3]'} text-[10px] md:text-[12px] lg:text-[16px] text-white font-medium rounded-md md:rounded-lg py-1.5 md:py-2 px-2.5  cursor-pointer select-none`}
                    onClick={() => setCurrentVar("segmented")}>
                    Сегментированный
                </button>
            </div>

            { currentVar === "default" ? <DefaultCalculator /> : <SegmentedCalculator/>}


        </div>
    )
}

export default Calculator