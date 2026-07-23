import { useEffect, useState } from "react";
import { API_KEY } from "./key"

import type { ForecastResponse } from "./types"

export function useForecast () {
    const [ forecast, setForecast ] = useState< ForecastResponse | null > (null)

    useEffect( () => {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Astana&appid=${API_KEY}&units=metric&lang=ru`)
        .then(res => res.json())
        .then( data => {
            console.log(data)
            setForecast(data)
            }
        )
    }, [])

    return forecast
}