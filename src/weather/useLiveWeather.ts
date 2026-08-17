import { useEffect, useState } from "react"
import { API_KEY } from "./key"

interface LiveWeather {
    temp: number
    icon: string
    description: string
}

export function useLiveWeather( lat:number, lon: number ) {
    const [weather, setWeather] = useState<LiveWeather|null>(null)

    useEffect(() => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`)
        .then(res => res.json())
        .then(data => {
            setWeather({
                temp: data.main.temp,
                icon: data.weather[0].icon,
                description: data.weather[0].description
            })
        })
    }, [lat,lon])


    return weather
}

