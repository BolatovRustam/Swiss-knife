import { useEffect, useState } from "react";
import { API_KEY } from "./key"

interface ForecastItem {
    dt: number
    dt_txt: string
    main: { temp: number, humidity: number }
    weather: { description: string, icon: string } []
}

interface ForecastResponse {
    list: ForecastItem[]
}

export default function useHourlyForecast () {
    const [ forecast, setForecast ] = useState<ForecastResponse | null>(null)

    useEffect(() => {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Astana&appid=${API_KEY}&units=metric&lang=ru`)
        .then(res => res.json())
        .then(res => {
            console.log(res)
            setForecast(res)
        })
        
    }, [])

    return forecast
}