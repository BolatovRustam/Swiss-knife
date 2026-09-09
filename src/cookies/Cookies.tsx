import predictions from "./predictions"
import React, { useState } from "react"

import { cookie, arrow, glithers } from "@/assets/icons"
import { cookiePng, cookiePaper } from "@/assets/png"


function Cookies () {
    const [prediction, setPrediction] = useState<string|null>(null)

    const openCookie = () => {

        const random = Math.floor(Math.random() * predictions.length)

        setPrediction(predictions[random])
    }

    return (
        <div className="flex flex-col items-center h-full px-4 pt-8 pb-8 gap-2.5 md:px-12 md:pt-10 md:pb-10 md:gap-3 lg:px-56.5 lg:pt-12.75 lg:pb-12 lg:gap-3.5 overflow-y-auto">

            <div className="flex flex-col items-center py-4 md:py-5 lg:py-6 w-full max-w-[710px] gap-4 md:gap-5 lg:gap-6 rounded-[15px] outline-2 outline-[#777777]/40">
                <img 
                    src={cookiePng} 
                    alt="img" 
                    className="h-auto w-[70%] max-w-[400px] md:max-w-[550px] lg:w-[710px] lg:h-[340px] lg:max-w-none" 
                />
                <div className="flex flex-col gap-2.5 md:gap-3 lg:gap-3.5 items-center px-4 text-center">
                    <span className="text-[#919191] font-semibold text-sm md:text-base">Нажмите на кнопку, что бы узнать свое предсказание</span>
                    <button 
                        className="flex gap-2 rounded-[10px] px-4 py-2.5 md:p-3 lg:p-3.5 text-white text-sm md:text-base font-bold cursor-pointer transition hover:brightness-110 active:brightness-85 gradient-btn-orange"
                        onClick={() => openCookie()}
                    >
                        <img 
                            src={cookie} 
                            alt="img" 
                            className="w-5 h-5 md:w-6 md:h-6"
                        />
                        <span>Открыть печенье</span>
                    </button>
                </div>
            </div>

            {prediction && (
                <React.Fragment key={prediction}>
                    <img 
                        src={arrow} 
                        alt="img" 
                        className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rotate-90 arrow-anim" 
                    />

                    <div 
                    className="flex flex-col w-full max-w-[670px] h-auto min-h-[160px] lg:h-[204px] px-6 py-5 md:px-12 md:py-6 lg:px-[74px] lg:py-[24px] gap-3 md:gap-4 lg:gap-4.5 rounded-[15px] outline-2 outline-[#777777]/40 animate-unfold">

                        <p className="flex items-center justify-center gap-2 md:gap-3 lg:gap-3.5 text-[#CE9638] font-bold text-sm md:text-base">
                            <img 
                                src={glithers} 
                                alt="img" 
                                className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" 
                            />
                            <span>Ваше предсказание</span>
                        </p>

                        <div className="flex relative justify-center items-center text-center text-sm md:text-base lg:text-[18px] text-[#77655B] font-medium">
                            <img 
                                src={cookiePaper} 
                                alt="img"
                                className="w-full h-auto" 
                            />
                            <p className="absolute px-4 md:px-8 max-w-full lg:max-w-[345px]">{prediction}</p>
                        </div>
                    
                    </div>
                </React.Fragment>
            )}
            
                

        </div>
    )
}

export default Cookies