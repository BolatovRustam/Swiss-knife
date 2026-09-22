import { useEffect, useState, useRef } from "react"
import { API_KEY } from "./key"

import { iconMap } from "./iconMap"

import { LocationFill, starFill } from "@/assets/icons"
import { Delete, LocationOutline, Cross, Star, humidity, humidity2 , windy, visible, barometr, thermometer, sunrise, star, recent } from "@/assets/icons"
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
        { title: "Ветер", icon: windy, value: (w: Weather) => `${Math.round(w.wind.speed * 3.6)} км/ч` },
        { title: "Видимость", icon: visible, value: ( w: Weather ) => `${parseFloat((w.visibility / 1000).toFixed(1))} км` }
    ],

    down: [
        { title: "Давление", icon: barometr, value: (w: Weather) => `${Math.round(w.main.pressure * 0.750062)} мм рт.ст.` },
        { title: "Ощущается", icon: thermometer, value: (w: Weather) => `${w.main.feels_like > 0 ? "+" : ""}${Math.round(w.main.feels_like)}°` },
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
        <div className="flex flex-col h-full overflow-auto items-end pt-9.5 lg:pt-12.5 pb-3.5 px-6.5 md:px-12 xl:px-21.5">

            
            <div ref={wrapperRef} className="relative flex w-full lg:w-1/3 items-center gap-4">
                <div className="flex items-center w-full gap-2 py-2.5 px-3.5 bg-white rounded-[10px] shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]">
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
                <div className="flex flex-col lg:flex-row between items-center xl:flex-nowrap w-full gap-8 lg:gap-28 xl:gap-44 px-8 lg:px-9 xl:px-10 py-7 lg:py-9 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]">

                    {/* Сама погода */}
                    <div className="flex flex-col w-full lg:w-fit md:flex-row lg:flex-col justify-between lg:justify-start gap-4.5 lg:gap-8">
                        <div className="flex gap-2.5 md:gap-3.5">
                            {   
                                weather && 
                                <img 
                                    src={ iconMap[weather.weather[0].icon] } 
                                    alt={ weather.weather[0].description }
                                    className="w-20 h-20 md:w-24 md:h-24 xl:w-30 xl:h-30"
                                />
                            }

                            <p className="flex flex-col">
                                <span className="text-[36px] md:text-[38px] lg:text-[40px] xl:text-[50px] font-semibold ">
                                    {weather 
                                        ? `${ weather?.main.temp > 0 ? "+" : "-"  }${Math.floor(weather?.main.temp)}°`
                                        : ""
                                    }
                                </span>
                                <span className="max-w-25 lg:max-w-none text-[14px] md:text-[16px] lg:text-[20px] font-medium">

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
                                        className="self-start ml-auto md:ml-0 shrink-0 p-2 lg:p-2.5 bg-white hover:bg-[#F5F5F5] active:bg-[#E7E7E7] rounded-[10px] outline-[1.5px] outline-offset-[-1px] outline-neutral-500/40 cursor-pointer"
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
                                            className="w-5.5 h-5.5 md:w-6 md:h-6" 
                                            
                                        />
                                    </button>
                                )
                            }


                        </div>  

                        <div className="flex gap-4 items-center">
                            
                            <LocationFill className="w-4.5 h-4.5 md:w-6 md:h-6 lg:w-6.5 lg:h-6.5 xl:w-7 xl:h-7"/>        
                            
                            <p className="flex flex-col">
                                <span className="font-medium text-[14px] md:text-[16px] xl:text-[18px]">{ `${weather?.name}, ${ weather?.sys.country} `  }</span>
                                <span className="font-medium text-[12px] md:text-[14px] xl:text-[16px] text-[#919191] ">{ weather && new Date(weather.dt * 1000).toLocaleDateString('ru-RU', {
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
                    <div className="grid grid-cols-2 md:flex md:flex-1 w-full  flex-col gap-5">

                        <div className="grid md:flex gap-4">
                        { weather_data.up.map(el => (
                            <div key={el.title} className="flex flex-1 items-center flex-nowra md:flex-wrap gap-1 md:gap-2.5 p-2.5  bg-[#ECECEC]/25 border border-[#777777]/40 rounded-[10px]">
                                <img 
                                    src={el.icon} 
                                    alt="icon"
                                    className="w-7.5 h-7.5 md:w-9 md:h-9  xl:w-11 xl:h-11"
                                />

                                <p className="flex flex-col gap-1">
                                    <span className="font-medium text-[12px] md:text-[14px] lg:text-[16px] text-[#9797A0]">{el.title}</span>
                                    <span className="font-semibold text-[14px] md:text-[16px] lg:text-[18px]">{weather ? el.value(weather) : "-"}</span>
                                </p>
                            </div>
                        )) }
                        </div>

                        <div className="grid md:flex gap-4">
                        { weather_data.down.map(el => (
                            <div key={el.title} className="flex flex-1 items-center flex-nowrap md:flex-wrap gap-1 md:gap-2.5  p-2.5 bg-[#ECECEC]/25 border border-[#777777]/40 rounded-[10px]">
                                <img 
                                    src={el.icon} 
                                    alt="icon"
                                    className="w-8 h-8 md:w-9 md:h-9  xl:w-11 xl:h-11"
                                />

                                <p className="flex flex-col gap-1">
                                    <span className="font-medium text-[12px] md:text-[14px] lg:text-[16px] text-[#9797A0]">{el.title}</span>
                                    <span className="font-semibold text-[14px] md:text-[16px] lg:text-[18px]">{weather ? el.value(weather) : "-"}</span>
                                </p>
                            </div>
                        )) }
                        </div>

                    </div>

                </div>
                )}

                {/* Почасовой прогноз */}
                <div className="flex flex-col w-full gap-2 lg:gap-2.5">
                    {weather ? (
                        <p className="font-medium text-[14px] md:text-[16px] lg:text-[18px]">Почасовой прогноз</p>
                    ) : "" }
                    <div className="flex w-full gap-3 lg:flex-wrap overflow-x-auto lg:overflow-visible py-1.5 px-1 lg:px-0 lg:py-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {
                                hours.map((el, i) => (
                                    <div 
                                        className="flex flex-1 flex-col items-center px-8 md:px-10 py-2.5 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]" 
                                        key={i}
                                    >
                                        <p className="font-medium text-center text-[13px] lg:text-[14px]">{el.dt_txt.slice(11, 16)}</p>
                                        <img 
                                            src={iconMap[el.weather[0].icon]} 
                                            alt={iconMap[el.weather[0].description]} 
                                            className="w-14 h-14 md:w-16 md:h-16 lg:w-17.5 lg:h-17.5"
                                        />

                                        <div className="flex flex-col mt-1 gap-1 md:gap-1.5">
                                            <p className="font-semibold text-center text-[14px] md:text-[15px] lg:text-[16px]">{
                                                `${el.main.temp > 0 ? "+" : "-"}${Math.floor(el.main.temp)}°`  
                                                }
                                            </p>
                                            <p className="flex justify-center items-center gap-0.5 md:gap-1 px-1.5 text-[12px] lg:text-[14px]">
                                                <img 
                                                    src={humidity2} 
                                                    alt="icon" 
                                                    className="w-3 h-3 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5"
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
                <div className="flex flex-col w-full gap-2 lg:gap-2.5">

                    {weather ? (
                        <p className="font-medium text-[14px] md:text-[16px] lg:text-[18px]">Прогноз на 5 дней</p>
                    ) : "" }

                    <div className="flex flex-2 flex-col lg:flex-row gap-2 md:gap-4.5 lg:flex-wrap w-full">
                            {
                                days.map( (el, i) => (
                                    <div className="flex-1 flex flex-row lg:flex-col justify-between items-center px-5.5 lg:px-4 py-2 md:pt-2 md:py-0 lg:gap-0 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]" key={i}>

                                        <div className="flex flex-row w-full items-center justify-between border-[#777777]/20 lg:contents">

                                        <div className=" lg:flex lg:flex-col lg:items-center lg:w-full lg:gap-0.5 lg:pb-2  lg:border-b-1 lg:border-[#777777]/20 contents">

                                            <div className="flex flex-col lg:contents">
                                                <p className="font-medium text-[12px] md:text-[14px] lg:text-[16px]">
                                                    {new Date(el.date).toLocaleDateString('ru-RU', { weekday: "long" }).at(0)?.toUpperCase() + new Date(el.date).toLocaleDateString('ru-RU', { weekday: "long" }).slice(1)}
                                                </p>
                                                <p className="font-medium text-[#9797A0] text-[11px] md:text-[12px] lg:text-[14px]">{new Date(el.date).toLocaleDateString('ru-RU', { day: "numeric", month: "long" }) }</p>
                                            </div>

                                            <div className="flex items-center gap-0.5 md:gap-2 lg:contents">
                                                <img 
                                                    src={iconMap[el.icon]} 
                                                    alt={iconMap[el.description]} 
                                                    className="w-13 h-13 md:w-21 md:h-21 lg:w-22.5 lg:h-22.5"
                                                />
                                            
                                                <p className="flex gap-1 flex-col items-center text-[12px] md:text-[14px] lg:text-[16px]">
                                                    <span className="font-semibold">{ `${el.temp > 0 ? "+" : ""}${el.min}° / ${el.max}°` }</span>
                                                    <span className="hidden lg:inline text-[#9797A0] font-medium">{el.description}</span>
                                                </p>
                                            </div>

                                        </div>

                                        <div className="flex gap-2 md:gap-4 lg:gap-11.5 py-2 text-[11px] md:text-[14px] lg:text-[16px]">
                                            <p className="flex gap-0.5 md:gap-1.5 items-center">
                                                <img 
                                                    src={humidity2} 
                                                    alt="icon" 
                                                    className="w-3.5 3.5 md:w-5 md:h-5 lg:w-5.5 lg:h-5.5"
                                                />
                                                <span className="text-[#9797A0] font-medium">{`${el.humidity}%`}</span>
                                            </p>

                                            <p className="flex gap-0.5 md:gap-1.5 items-center">
                                                <img 
                                                    src={windy} 
                                                    alt="icon" 
                                                    width={28}
                                                    height={28}
                                                    className="w-4.5 h-4.5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                                                />
                                                <span className="text-[#9797A0] font-medium">{`${Math.floor(el.windy)} км/ч`}</span>
                                            </p>
                                        </div>
                                        </div>
                                    </div>
                                ))
                            }
                    </div>

                </div>

            </div>
            
            {/* Кнопки */}
            <div className="flex w-full md:justify-end gap-4 text-[12px] md:text-[14px] lg:text-[16]">
                <button 
                    className="flex flex-1 md:flex-0 items-center justify-center gap-1.5 bg-white py-2 md:px-6 border border-[#777777]/40 hover:bg-[#F5F5F5] active:bg-[#E7E7E7] rounded-[10px] cursor-pointer"
                    onClick={() => setActiveModal("favorites")}
                >
                    <Star  
                        className="w-4 h-4 lg:w-5 lg:h-5 [&_path]:fill-black"
                    />
                    <span>Избранные</span>
                </button>

                <button 
                    className="flex flex-1 md:flex-0 items-center justify-center gap-1.5 bg-white  py-2 md:px-6 border border-[#777777]/40 hover:bg-[#F5F5F5] active:bg-[#E7E7E7] rounded-[10px] cursor-pointer"
                    onClick={() => setActiveModal("history")}
                >
                    <img 
                        src={recent} 
                        alt="recent" 
                        className="w-4 h-4 lg:w-5 lg:h-5"
                    />
                    <span>История</span>
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
                                className={`
                                    flex justify-center items-center gap-2 py-2 mt-2 text-[14px] md:text-[16px] text-[#E84545] font-medium border border-[#E84545]/50 
                                    hover:bg-[#E84545] hover:text-[#FFFF] rounded-[10px] transition cursor-pointer
                                `}
                            >
                                <Delete 
                                    className="w-4 h-4 md:w-5.5 md:h-5.5 fill-[#8E381D]" 
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