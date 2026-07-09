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
        <div className="flex flex-col items-center h-full px-56.5 pt-12.75 pb-12 gap-3.5">

            <div className="flex flex-col items-center py-6 w-full gap-6 rounded-[15px] outline-2 outline-[#777777]/40 ">
                <img src={cookiePng} alt="img" className="h-[340px] w-[710px]" />
                <div className="flex flex-col gap-3.5 items-center">
                    <span className="text-[#919191] font-semibold">Нажмите на кнопку, что бы узнать свое предсказание</span>
                    <button 
                        className="flex gap-2 rounded-[10px] p-3.5 text-white font-bold cursor-pointer transition hover:brightness-110 active:brightness-85 gradient-btn-orange"
                        onClick={() => openCookie()}
                    >
                        <img src={cookie} alt="img" />
                        <span>Открыть печенье</span>
                    </button>
                </div>
            </div>

            {prediction && (
                <React.Fragment key={prediction}>
                    <img 
                        src={arrow} 
                        alt="img" 
                        className="w-8 h-8 rotate-90 arrow-anim" 
                    />

                    <div 
                    className="flex flex-col h-[204px] w-[670px] px-[74px] py-[24px] gap-4.5 rounded-[15px] outline-2 outline-[#777777]/40 animate-unfold">

                        <p className="flex items-center justify-center gap-3.5 text-[#CE9638] font-bold">
                            <img src={glithers} alt="img" className="w-8 h-8" />
                            <span>Ваше предсказание</span>
                        </p>

                        <div className="flex  relative justify-center items-center text-center text-[18px] text-[#77655B] font-medium">
                            <img src={cookiePaper} alt="img" />
                            <p className="absolute max-w-[345px]">{prediction}</p>
                        </div>
                    
                    </div>
                </React.Fragment>
            )}
            
                

        </div>
    )
}

export default Cookies