import { useEffect, useState } from "react";
import { API_KEY } from "./key"

import type { ForecastResponse } from "./types"

export function useForecast ( lat?: number, lon?: number ) {
    const [ forecast, setForecast ] = useState< ForecastResponse | null > (null)

    useEffect( () => {
        if ( lat === undefined || lon === undefined ) return

        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`)
        .then(res => res.json())
        .then( data => {
            console.log(data)
            setForecast(data)
            }
        )
    }, [lat, lon])

    return forecast
}