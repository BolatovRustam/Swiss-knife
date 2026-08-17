import { useEffect, useState } from "react"
import { API_KEY } from "./key"


export interface City {
    name: string
    lat: number
    lon: number
    country: string
    state?: string
}

export function useDebounced<T>( value: T, delay: number ): T {
    const [ debounced, setDebounced ] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [ value, delay ])

    return debounced
}

export function useGeocoding(query: string) {
    const [ cities, setCities ] = useState<City[]>([])

    const debouncedQuery = useDebounced(query, 400)

    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setCities([])
            return
        }

        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${debouncedQuery}&limit=5&appid=${API_KEY}`)
        .then(res => res.json())
        .then(setCities)  

    }, [debouncedQuery])

    return cities
}