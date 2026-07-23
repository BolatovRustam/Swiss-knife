import type { ForecastResponse, ForecastItem } from "./types"

export function useHourlyForecast ( forecast: ForecastResponse, count = 8 ) {
    return forecast.list.slice(0, count)
}

export function useDailyForeCast ( forecast: ForecastResponse ) {
    const grouped:Record < string,  ForecastItem[] > = {}

    forecast.list.forEach( el => {
        const day = el.dt_txt.split(" ")[0]

        if (!grouped[day]) grouped[day] = []
        
        grouped[day].push(el)
    })

    return Object.entries(grouped)
    .slice( 1 )
    .map( ([ date, items ]) => {
        const temps = items.map(t => t.main.temp)
        const midDay = items[Math.floor(items.length/2)]

        return {
            date,
            icon: midDay.weather[0].icon,
            temp: midDay.main.temp,
            min: Math.round(Math.min(...temps)),
            max: Math.round(Math.max(...temps)),
            description: midDay.weather[0].description,
            humidity: midDay.main.humidity,
            windy: midDay.wind.speed

        }
    } )
}