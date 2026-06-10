import DefaultCalculator from "./var/DefaultCalculator"
import SegmentedCalculator from "./var/segmentedCalculator"
import { useState } from "react"

function Calculator() {
    const [currentVar, setCurrentVar] = useState("default")

    return (
        <div className="flex flex-col items-center gap-6.5 pt-10">
            <div className="flex gap-4">
                <button 
                    className={`${currentVar === 'default' ? 'bg-[#575757]' : 'bg-[#7C7C7C] hover:bg-[#BABABA]'} text-white font-medium rounded-lg py-2 px-2.5 cursor-pointer select-none`}
                    onClick={() => setCurrentVar("default")}>
                        Обычный
                    </button>
                <button 
                    className={`${currentVar === 'segmented' ? 'bg-[#2d7b59]' : 'bg-[#49B989] hover:bg-[#60D5A3]'} text-white font-medium rounded-lg py-2 px-2.5 cursor-pointer select-none`}
                    onClick={() => setCurrentVar("segmented")}>
                    Сегментированный
                </button>
            </div>

            { currentVar === "default" ? <DefaultCalculator /> : <SegmentedCalculator/>}


        </div>
    )
}

export default Calculator