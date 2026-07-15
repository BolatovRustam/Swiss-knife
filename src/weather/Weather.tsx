import { useEffect, useState } from "react"

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY

interface City {
    name: string
    lat: number
    lon: number
    country: string
}

function Weather () {
    const [weather, setWeather] = useState<City[] | null>(null)
    

    useEffect(() => {
        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=Astana&limit=5&appid=${API_KEY}`)
        .then(res => res.json())
        .then(setWeather)
    }, [])

    return(
        <div className="flex flex-col h-full max-h-full items-end pt-12.5 pb-3.5 px-21.5">

            

            <input type="text" className="w-1/3 bg-white rounded-[10px] shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]" />

            {/* Основная часть */}
            <div className="w-full flex-1 flex flex-col gap-5 mt-4 mb-4">

                <div className="w-full flex-1 flex px-11 py-8 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]">

                    {/* Сама погода */}
                    <div className="flex flex-col">
                        <div>
                            <p className="flex flex-col">
                                {weather?.[0].country}
                            </p>
                        </div>  

                        <div className="flex">

                            <p className="flex flex-col">
                                <span>Астана, Казахстан</span>
                                <span>Понедельник, 13 июля, 09:30</span>
                            </p>
                        </div>

                    </div>

                    {/* Данные о погоде */}
                    <div>

                    </div>

                </div>

                <div className="w-full flex-1 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]">

                </div>
                
                <div className="w-full flex-1 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]">

                </div>
            </div>

            <div className="flex w-full justify-end gap-4">
                <button className="bg-white py-2 px-4 border border-[#777777]/40 rounded-[10px]">
                    Избранные
                </button>

                <button className="bg-white  py-2 px-4 border border-[#777777]/40 rounded-[10px]">
                    История
                </button>
            </div>
        </div>
    )
}

export default Weather