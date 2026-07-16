import { useEffect, useState } from "react"
import { LocationFill } from "@/assets/icons"

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY


interface Weather {
    sys: { country: string }
    main: { temp: number }
    weather: { description: string } []
    name: string
    dt: number 
}




function Weather () {
    const [weather, setWeather] = useState<Weather | null>(null)
    

    useEffect(() => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=Astana&appid=${API_KEY}&units=metric&lang=ru`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setWeather(data)
        })

    }, [])

    return(
        <div className="flex flex-col h-full max-h-full items-end pt-12.5 pb-3.5 px-21.5">

            

            <input type="text" className="w-1/3 h-[32px] bg-white rounded-[10px] shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]" />

            {/* Основная часть */}
            <div className="w-full flex-1 flex flex-col gap-5 mt-4 mb-4">

                {/* Погода на текущий день с показателями */}
                <div className="w-full flex-3 flex px-11 py-8 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]">

                    {/* Сама погода */}
                    <div className="flex flex-col gap-8">
                        <div>

                            <p className="flex flex-col">
                                <span className="text-[52px] font-semibold ">{weather ? Math.floor(weather?.main.temp) : ""}</span>
                                <span className="text-[22px] font-medium">
                                    { weather?.weather[0].description
                                        .split("")
                                        .map( (w, i) => (
                                            i === 0 ? w.toUpperCase() : w
                                        )) 
                                        .join("")
                                    }</span>
                            </p>
                        </div>  

                        <div className="flex gap-4 items-center">
                            
                            <LocationFill className="w-6 h-6"/>        
                            
                            <p className="flex flex-col">
                                <span className="font-medium text-[18px]">{ `${weather?.name}, ${ weather?.sys.country} `  }</span>
                                <span className="font-medium text-[16px] text-[#919191] ">{ weather && new Date(weather.dt * 1000).toLocaleDateString('ru-RU', {
                                                                                                            weekday: 'long',
                                                                                                            day: 'numeric',
                                                                                                            month: 'long'
                                                                                                        }) }
                                </span>
                            </p>
                        </div>

                    </div>

                    {/* Данные о погоде */}
                    <div>

                    </div>

                </div>

                {/* Почасовой прогноз */}
                <div className="w-full flex-1 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]">

                </div>
                
                {/* Почасовой на 5 дней */}
                <div className="w-full flex-2 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]">

                </div>
            </div>
            
            {/* Кнопки */}
            <div className="flex w-full justify-end gap-4">
                <button className="bg-white py-2 px-4 border border-[#777777]/40 rounded-[10px] cursor-pointer">
                    Избранные
                </button>

                <button className="bg-white  py-2 px-4 border border-[#777777]/40 rounded-[10px] cursor-pointer">
                    История
                </button>
            </div>
        </div>
    )
}

export default Weather