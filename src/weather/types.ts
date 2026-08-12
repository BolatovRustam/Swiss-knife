export interface ForecastItem {
    dt: number
    dt_txt: string
    main: { temp: number, humidity: number }
    weather: { description: string, icon: string } []
    wind: { speed: number }
}

export interface ForecastResponse {
    list: ForecastItem[]
}


export interface FavoriteCity {
    id: string
    city: string
    country: string
    lat: number
    lon: number
    created_at: string
}

export interface HistoryEntry {
    id: string
    city: string
    country: string
    lat: number
    lon: number
    searched_at: string
}