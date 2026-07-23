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
