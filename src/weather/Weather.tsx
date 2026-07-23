import { useEffect, useState } from "react"
import { API_KEY } from "./key"

import { iconMap } from "./iconMap"

import { LocationFill } from "@/assets/icons"
import { humidity, humidity2 , windy, visible, barometr, thermometer, sunrise } from "@/assets/icons"
import { useForecast } from "./useForecast"
import { useDailyForeCast, useHourlyForecast } from "./weatherHooks"


interface Weather {
    sys: { country: string; sunrise: number; sunset: number }
    main: { temp: number; humidity: number; pressure: number; feels_like: number }
    weather: { description: string, icon: string } []
    visibility: number
    wind: {speed: number}
    name: string
    dt: number 
}

const weather_data = {
    up: [
        { title: "Влажность", icon: humidity, value: (w: Weather) => `${w.main.humidity}%` },
        { title: "Ветер", icon: windy, value: (w: Weather) => `${w.wind.speed} м/с` },
        { title: "Видимость", icon: visible, value: ( w: Weather ) => `${(w.visibility / 1000).toFixed(1)}` }
    ],

    down: [
        { title: "Давление", icon: barometr, value: (w: Weather) => `${Math.round(w.main.pressure * 0.750062)} мм рт.ст.` },
        { title: "Ощущается", icon: thermometer, value: (w: Weather) => `${w.main.feels_like}°` },
        { 
            title: "Восход / Закат", 
            icon: sunrise,  
            value: (w: Weather) => 
                `${new Date(w.sys.sunrise * 1000).toLocaleString('ru-RU', { hour: "2-digit", minute: "2-digit" })} / 
                ${new Date(w.sys.sunset * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
        }
    ]
}



function Weather () {
    const [weather, setWeather] = useState<Weather | null>(null)

    const forecast = useForecast()

    const hours = forecast ? useHourlyForecast( forecast ) : []
    const days = forecast ? useDailyForeCast( forecast ) : []
    

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
                <div className="w-full flex-3 flex justify-between px-10 py-7 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]">

                    {/* Сама погода */}
                    <div className="flex flex-col gap-8">
                        <div className="flex gap-3.5">
                            {
                                weather && 
                                <img 
                                    src={ iconMap[weather.weather[0].icon] } 
                                    alt={ weather.weather[0].description }
                                    width={120}
                                    height={120} 
                                />
                            }

                            <p className="flex flex-col">
                                <span className="text-[50px] font-semibold ">
                                    {weather 
                                        ? `${ weather?.main.temp > 0 ? "+" : "-"  }${Math.floor(weather?.main.temp)}°`
                                        : ""
                                    }
                                </span>
                                <span className="text-[20px] font-medium">

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
                                                                                                            month: 'long',
                                                                                                            hour: "2-digit",
                                                                                                            minute: "2-digit"
                                                                                                        }) }
                                </span>
                            </p>
                        </div>

                    </div>

                    {/* Данные о погоде */}
                    <div className="flex flex-col gap-3">

                        <div className="flex gap-2">
                        { weather_data.up.map(el => (
                            <div key={el.title} className="flex gap-2.5 p-2.5 bg-[#ECECEC]/25 border border-[#777777]/40 rounded-[10px]">
                                <img 
                                    src={el.icon} 
                                    alt="icon"
                                    width="64"
                                    height="64" 
                                />

                                <p className="flex flex-col gap-1">
                                    <span className="font-medium text-[#9797A0]">{el.title}</span>
                                    <span className="font-semibold text-[18px]">{weather ? el.value(weather) : "-"}</span>
                                </p>
                            </div>
                        )) }
                        </div>

                        <div className="flex gap-2">
                        { weather_data.down.map(el => (
                            <div key={el.title} className="flex gap-2.5 p-2.5 bg-[#ECECEC]/25 border border-[#777777]/40 rounded-[10px]">
                                <img 
                                    src={el.icon} 
                                    alt="icon"
                                    width="64"
                                    height="64" 
                                />

                                <p className="flex flex-col gap-1">
                                    <span className="font-medium text-[#9797A0]">{el.title}</span>
                                    <span className="font-medium text-[18px]">{weather ? el.value(weather) : "-"}</span>
                                </p>
                            </div>
                        )) }
                        </div>

                    </div>

                </div>

                {/* Почасовой прогноз */}
                <div className="flex-1 flex w-full gap-6">
                        {
                            hours.map((el, i) => (
                                <div className="flex flex-col px-8 py-2.5 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]" key={i}>
                                    <p className="font-medium">{el.dt_txt.split("").splice(11).join("")}</p>
                                    <img 
                                        src={iconMap[el.weather[0].icon]} 
                                        alt={iconMap[el.weather[0].description]} 
                                        width={74}
                                        height={74} 
                                    />

                                    <div className="flex flex-col">
                                        <p className="font-semibold text-center">{
                                            `${el.main.temp > 0 ? "+" : "-"}${Math.floor(el.main.temp)}°`  
                                            }
                                        </p>
                                        <p className="flex items-center gap-1">
                                            <img 
                                                src={humidity2} 
                                                alt="icon" 
                                                width={24}
                                                height={24} 
                                            />
                                            <span className="text-[#9797A0] font-medium">{`${el.main.humidity}%`}</span>
                                        </p>
                                    </div>
                                </div>

                            ))
                        }
                </div>
                
                {/* Прогноз на 5 дней */}
                <div className="flex flex-2 w-full gap-2">
                        {
                            days.map( (el, i) => (
                                <div className="flex-1 flex flex-col items-center px-4 pt-2 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]" key={i}>

                                    <div className="flex flex-col items-center border-b-2 border-[#777777]/20 w-full">
                                        <p className="font-medium">{el.date}</p>

                                        <img 
                                            src={iconMap[el.icon]} 
                                            alt={iconMap[el.description]} 
                                            width={92}
                                            height={92} 
                                        />
                                        
                                        <p className="flex flex-col items-center">
                                            <span className="font-semibold">{ `${el.temp > 0 ? "+" : ""}${el.min}° / ${el.max}°` }</span>
                                            <span className="text-[#9797A0] font-medium">{el.description}</span>
                                        </p>
                                    </div>

                                    <div className="flex gap-10">
                                        <p className="flex gap-2">
                                            <img 
                                                src={humidity2} 
                                                alt="icon" 
                                                width={28}
                                                height={28}
                                            />
                                            <span className="text-[#9797A0] font-medium">{el.humidity}</span>
                                        </p>

                                        <p className="flex gap-2">
                                            <img 
                                                src={windy} 
                                                alt="icon" 
                                                width={28}
                                                height={28}
                                            />
                                            <span className="text-[#9797A0] font-medium">{el.windy}</span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        }
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