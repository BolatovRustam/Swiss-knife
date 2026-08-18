import { useEffect, useState } from "react"
import { API_KEY } from "./key"

interface LiveWeather {
    temp: number
    icon: string
    description: string
}

export function useLiveWeatherList<T extends { lat:number, lon:number}> ( items: T[] ) {
    const [results, setResults] = useState<Map<T, LiveWeather>> (new Map()) 
    const [loading, setLoading ] = useState(true)

    useEffect(() =>{
        if(items.length === 0) {
            setResults(new Map())
            setLoading(false)
            return
        }

        setLoading(true)


        const promises = items.map(item => 
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${item.lat}&lon=${item.lon}&appid=${API_KEY}&units=metric&lang=ru`)
                .then(res => res.json())
                .then(data => [item, {
                    temp: data.main.temp,
                    icon: data.weather[0].icon,
                    description: data.weather[0].description
                }] as [T, LiveWeather] )
        )

        Promise.all(promises).then(enries => {
            setResults(new Map(enries))
            setLoading(false)
        })
    }, [items])

    return { results, loading }
}