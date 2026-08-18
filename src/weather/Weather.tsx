import { useEffect, useState, useRef } from "react"
import { API_KEY } from "./key"

import { iconMap } from "./iconMap"

import { LocationFill, starFill } from "@/assets/icons"
import { Delete, LocationOutline, Cross, humidity, humidity2 , windy, visible, barometr, thermometer, sunrise, star } from "@/assets/icons"
import { useForecast } from "./useForecast"
import { useDailyForeCast, useHourlyForecast } from "./weatherHooks"
import { useGeocoding } from "./useGeocoding"
import { useFavortites } from "./useFavorites"
import { useSearchHistory } from "./useSearchHistory"


import Modal from "./Modal"
import { HistoryCard } from "./HistoryCard"
import { FavoriteCard } from "./FavoriteCard"
import { useLiveWeatherList } from "./useLiveWeatherList"
import { Loader2 } from "lucide-react"


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
    const [query, setQuery] = useState("")
    const [selectedCity, setSelectedCity] = useState<{ lat: number; lon: number; name: string } | null>( {lat: 51.1801, lon: 71.446, name: "Astana"} )
    const [ showSuggestions, setShowSuggestions ] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null) 

    const [ activeModal, setActiveModal ] = useState<"favorites" | "history" | null>(null)

    const [weather, setWeather] = useState<Weather | null>(null)

    const { favorites, addFavorite, removeFavorite } = useFavortites()
    const { results: favWeather, loading: favLoading } = useLiveWeatherList(favorites)
    const { history, addToHistory, clearHistory } = useSearchHistory()

    const suggestions = useGeocoding(query)

    const forecast = useForecast( selectedCity?.lat, selectedCity?.lon )

    const hours = forecast ? useHourlyForecast( forecast ) : []
    const days = forecast ? useDailyForeCast( forecast ) : []

    const starFav = favorites.some(el => el.city === weather?.name)
    

    useEffect(() => {
        if (!selectedCity) return

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}&appid=${API_KEY}&units=metric&lang=ru`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setWeather(data)
        })

    }, [selectedCity])

    useEffect(() => {
        function handleClickOutside (e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)

    }, [])

    const handleSelectedCity = (city: {lat: number; lon: number; name: string; country: string}) => {
        setSelectedCity(city)
        setQuery(city.name)
        setShowSuggestions(false)

        addToHistory(city.name, city.country, city.lat, city.lon)
    }

    return(
        <div className="flex flex-col h-full overflow-auto items-end pt-12.5 pb-3.5 px-21.5">

            
            <div ref={wrapperRef} className="relative flex w-1/4 items-center gap-4">
                <div className="flex items-center w-full gap-1.5 py-2.5 px-4 bg-white rounded-[10px] shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]">
                    <LocationOutline/>

                    <input 
                        type="text" 
                        className=" w-full outline-none placeholder:text-[#9797A0]" 
                        value={query}
                        placeholder="Введите город"
                        onChange={(e) => {
                            setQuery(e.target.value)
                            setShowSuggestions(true)
                        }} 
                    />

                    {query && (
                        <button 
                            onClick={() => {
                                setQuery("")
                                setShowSuggestions(false)
                            }}
                            className="shrink-0 text-[#9797A0] hover:text-black active:scale-90 transition-all duration-150 cursor-pointer"
                        >
                            <Cross 
                                width={20}
                                height={20}
                                className="fill-current"
                            />
                        </button>
                    )}  



                    { showSuggestions && suggestions.length > 0 && (
                        <ul 
                            className={`absolute top-full left-0 w-full bg-white rounded-[10px] shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)] mt-1 overflow-hidden z-10 `}>
                            { suggestions.map((c, i) => (
                                <li
                                    key={i}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelectedCity( {lat: c.lat, lon: c.lon, name: c.name, country: c.country} )}
                                >
                                    { `${c.name}, ${c.country}` }
                                </li>
                            )) }
                        </ul>
                    ) }
                </div>

            </div>


            {/* Основная часть */}
            <div className="w-full flex-1 flex flex-col gap-5 mt-4 mb-4">

                {
                    !weather ? (
                            <div className="w-full flex items-center justify-center bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)] min-h-[275px]">
                                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                            </div>
                    ) : (
                        
                /* Погода на текущий день с показателями */
                <div className="w-full flex justify-between px-10 py-9 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]">

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

                            {
                                weather && selectedCity && (
                                    <button 
                                        className="self-start shrink-0 p-2.5 bg-white hover:bg-[#F5F5F5] active:bg-[#E7E7E7] rounded-[10px] outline-[1.5px] outline-offset-[-1px] outline-neutral-500/40 cursor-pointer"
                                        onClick={  () => {
                                                            const fav = favorites.find(el => el.city === weather.name)
                                                                if ( fav ) removeFavorite( fav.id )   
                                                            else {
                                                                addFavorite( weather.name, weather?.sys.country, selectedCity.lat, selectedCity.lon )                                                                
                                                            }         
                                                        }}
                                    >
                                        <img 
                                            src={ starFav ? starFill : star} 
                                            alt="img" 

                                        />
                                    </button>
                                )
                            }


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
                            <div key={el.title} className="flex w-full gap-2.5 p-2.5 bg-[#ECECEC]/25 border border-[#777777]/40 rounded-[10px]">
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
                )}

                {/* Почасовой прогноз */}
                <div className="flex flex-col w-full gap-2">
                    {weather ? (
                        <p className="font-medium">Почасовой прогноз</p>
                    ) : "" }
                    <div className="flex-1 flex w-full gap-6">
                            {
                                hours.map((el, i) => (
                                    <div className="flex flex-col px-8 py-2.5 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]" key={i}>
                                        <p className="font-medium text-center">{el.dt_txt.slice(11, 16)}</p>
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

                </div>

                
                {/* Прогноз на 5 дней */}
                <div className="flex flex-col w-full gap-2">

                    {weather ? (
                        <p className="font-medium">Прогноз на 5 дней</p>
                    ) : "" }

                    <div className="flex flex-2 w-full gap-2">
                            {
                                days.map( (el, i) => (
                                    <div className="flex-1 flex flex-col items-center px-4 pt-2 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]" key={i}>

                                        <div className="flex flex-col items-center border-b-2 border-[#777777]/20 w-full">
                                            <p className="font-medium">
                                                {new Date(el.date).toLocaleDateString('ru-RU', { weekday: "long" }).at(0)?.toUpperCase() + new Date(el.date).toLocaleDateString('ru-RU', { weekday: "long" }).slice(1)}
                                            </p>
                                            <p className="font-medium text-[#9797A0] text-[14px]">{new Date(el.date).toLocaleDateString('ru-RU', { day: "numeric", month: "long" }) }</p>


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

            </div>
            
            {/* Кнопки */}
            <div className="flex w-full justify-end gap-4">
                <button 
                    className="bg-white py-2 px-4 border border-[#777777]/40 hover:bg-[#F5F5F5] active:bg-[#E7E7E7] rounded-[10px] cursor-pointer"
                    onClick={() => setActiveModal("favorites")}
                >
                    Избранные
                </button>

                <button 
                    className="bg-white  py-2 px-4 border border-[#777777]/40 hover:bg-[#F5F5F5] active:bg-[#E7E7E7] rounded-[10px] cursor-pointer"
                    onClick={() => setActiveModal("history")}
                >
                    История
                </button>
            </div>

            
            <Modal 
                isOpen={activeModal === "favorites"} 
                onClose={() => setActiveModal(null)}
                title="Избранные города"
            >
                {
                favLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                )
                : favorites.length === 0 ? ( 
                    <p>История пока пуста</p> 
                )
                    : (
                        <div className="flex flex-col gap-2">
                            {favorites.map(fav => (
                                <FavoriteCard 
                                    key={fav.id}
                                    live={favWeather.get(fav) ?? null}
                                    entry={fav}
                                    onRemove={() => removeFavorite(fav.id)}
                                    onSelect={() => {
                                        setSelectedCity({ lat: fav.lat, lon:fav.lon, name:fav.city})
                                        setActiveModal(null)
                                        addToHistory(fav.city, fav.country, fav.lat, fav.lon)
                                    }}
                                />
                            ))}

                        </div>
                    )
                }
            </Modal>

            <Modal 
                isOpen={activeModal === "history"} 
                onClose={() => setActiveModal(null)}
                title="История поиска"
            >
                {history.length === 0 ? ( 
                    <p>История пока пуста</p> 
                )
                    : (
                        <div className="flex flex-col gap-2">
                            {history.map(h => (
                                <HistoryCard 
                                key={h.id}
                                entry={h}
                                onSelect={() => {
                                    setSelectedCity({ lat: h.lat, lon: h.lon, name: h.city })
                                    setActiveModal(null)
                                }}
                                />
                            ))}

                            <button 
                                onClick={clearHistory}
                                className="flex justify-center gap-2 py-2 mt-2 text-[#E84545] font-medium border border-[#E84545]/50 hover:bg-[#E84545] hover:text-[#FFFF] rounded-[10px] transition cursor-pointer"
                            >
                                <Delete 
                                    className="fill-[#8E381D]" 
                                    width={22}
                                    height={22}    
                                />
                                <span>Очистить историю</span>
                            </button>
                        </div>
                    )
                }
            </Modal>
        </div>
    )
}

export default Weather