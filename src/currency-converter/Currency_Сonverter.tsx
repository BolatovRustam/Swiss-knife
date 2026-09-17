import { useCallback, useEffect, useState } from "react"
import { useAuthStore } from "../store/authStore"
import { popular_conversions } from "./data/constant"
import { type Currency } from "./data/currencies"
import { currencies } from "./data/currencies"
import Select, { type Option } from "../components/Select"
import type { Data } from './types'
import { Loader2 } from 'lucide-react'

import { Info, Delete, change, button, eraser, recent } from "@/assets/icons"
import { useSupabaseHistory } from "@/hooks/useSupabaseHistory"

interface Error {
    title: string
    from: string
    fromV: string
    to: string
    toV: string
}

const renderButton = (opt: Option) => (
    <div className="flex items-center gap-3">
        <img src={opt.img} alt={opt.value} className="w-6 h-6 md:w-7.5 md:h-7.5 lg:w-9 lg:h-9 rounded-full object-cover shrink-0" />
        <div className="flex flex-col items-start">
            <span className="text-[16px] md:text-[18px] lg:text-[20px] font-semibold">{opt.value}</span>
            <span className="text-[9px] md:text-[11px] lg:text-[13px] text-gray-400">{opt.label}</span>
        </div>
    </div>
)

const renderOption = (opt: Option) => (
    <div className="flex items-center gap-3">
        <img src={opt.img} alt={opt.value} className="w-4.5 h-4.5 md:w-6.5 md:h-6.5 lg:w-7 lg:h-7 rounded-full object-cover shrink-0" />
        <div className="flex flex-col">
            <span className="text-[12px] md:text-[14px] lg:text-[16px] font-semibold">{opt.value}</span>
            <span className="text-[8px] md:text-[10px] lg:text-[12px] text-gray-400">{opt.label}</span>
        </div>
    </div>
)


function Currency_Converter () {
    const { session } = useAuthStore()
    const [fromCurrency, setFromCurrency] = useState<Currency>(currencies[0])
    const [toCurrency, setToCurrency] = useState<Currency>(currencies[1])
    const [inputValue, setInputValue] = useState("")
    const [result, setResult] = useState("")
    const [error, setError] = useState<Error | null>(null)
    const [rate, setRate] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)

    const { data, loading:historyLoading, addEntry, clearAll } = useSupabaseHistory<Data>('currency-conversions', session?.user.id)


    const infoText = rate !== null
        ? `1 ${fromCurrency.value} = ${parseFloat(rate.toPrecision(4))} ${toCurrency.value}`
        : "Загрузка..."


    const fetchRate = useCallback(async () => {
        
        if (fromCurrency.value === toCurrency.value) {
            setRate(1)
            return
        }
        setLoading(true)
        
        try {
            const from = fromCurrency.value.toLowerCase()
            const to = toCurrency.value.toLowerCase()
            const res = await fetch(
                `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from}.json`
            )
            const data = await res.json()
            
            setRate(data[from][to] ?? null)
        } catch (e) {
            console.error(e)
            setRate(null)
        } finally {
            setLoading(false)
        }

    }, [fromCurrency, toCurrency])

    useEffect(() => {
        fetchRate()
    }, [fetchRate])

   const handleClick = () => {
        if ( !session ) return

        const num = parseFloat(inputValue)
        if (isNaN(num) || inputValue === "" || rate === null) {
            setResult("")
            return
        }

        const res = parseFloat((num * rate).toFixed(2)).toString()
        const title = `${inputValue} ${fromCurrency.value} → ${res} ${toCurrency.value}`

        setResult(res)

        const lastEntry = data[data.length - 1]
        if (lastEntry && lastEntry.title === title) {
            setError({  title: "Это преобразование уже выполнялось",
                            from: inputValue,
                            fromV: fromCurrency.value,
                            to: res,
                            toV: toCurrency.value,
             })
            return
        }

        setError(null)

        const time = new Date().toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })

        const tempCurrencyTask: Data = {
            id: crypto.randomUUID(),
            user_id: session.user.id,
            title,
            time,
            info_text: infoText
        }

        addEntry(tempCurrencyTask, { user_id: session.user.id, title, time, info_text:infoText })
    }

    const handleClearInput = () => {
        setInputValue("")
        setResult("")
    }

    const handleDataClear = () => {

        clearAll()
    }


    const handleSwap = () => {
        setFromCurrency(toCurrency)
        setToCurrency(fromCurrency)
        setInputValue(result)
        setResult(inputValue)
    }

    const handlePopular = (fromCode: Currency, toCode: Currency) => {
            setFromCurrency(fromCode)
            setToCurrency(toCode)
            setInputValue("")
            setResult("")
    }


    return (

        <div className="flex max-h-full overflow-y-auto flex-col pt-9.5 lg:pt-12.5 pb-3.5 px-6.5 md:px-12 lg:px-12 xl:px-21.5"> 

            {/* Верхняя часть */}
            <div className="flex flex-col mb-8 px-8 py-7 gap-7.5 lg:gap-8.5 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]">
            
                {/* Мобильная/планшетная версия — вертикальная, eraser+swap сверху, круглая кнопка посередине */}
                <div className="flex flex-col lg:hidden gap-4">

                    <div className="flex flex-col gap-3">
                        <div className="flex items-end justify-between">
                            <p className="text-[14px] md:text-[16px] font-semibold">Из</p>

                            <div className="flex gap-2">
                                <button 
                                    className="p-2 md:p-2.5 bg-white hover:bg-[#F5F5F5] active:bg-[#E7E7E7] rounded-[10px] outline-[1.5px] outline-offset-[-1px] outline-neutral-500/40 cursor-pointer"
                                    onClick={() => handleClearInput()}
                                >
                                    <img src={eraser} alt="img" className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                                <button 
                                    className="p-2 md:p-2.5 bg-white hover:bg-[#F5F5F5] active:bg-[#E7E7E7] rounded-[10px] outline-[1.5px] outline-offset-[-1px] outline-neutral-500/40 cursor-pointer"
                                    onClick={() => handleSwap()}
                                >
                                    <img src={change} alt="img" className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            <input 
                                type="number" 
                                value={inputValue}
                                placeholder="Введите значение" 
                                className={`
                                    flex items-center w-full h-16 md:h-20 px-3 md:px-4 bg-white/10 rounded-2xl outline-[1.5px] 
                                    outline-neutral-500/40 focus-within:outline-2 transition focus-within:outline-indigo-400 
                                    focus-within:shadow-[0px_1px_8px_0px_rgba(123,123,246,0.80)]
                                    text-lg md:text-[22px] font-semibold placeholder:font-medium placeholder:text-sm md:placeholder:text-base
                                    `}  
                                onChange={e => {
                                    if (e.target.value.length <= 20) {
                                        setInputValue(e.target.value)
                                        setError(null)
                                    }
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleClick()}
                            />

                            <Select
                                value={fromCurrency}
                                onChange={(val) => setFromCurrency(val as Currency)}
                                options={currencies}
                                renderButton={renderButton}
                                renderOption={renderOption}
                                buttonClassName="w-full h-16 md:h-20 rounded-2xl shadow-none outline-[1.5px] outline-neutral-500/40"
                            />
                        </div>
                    </div>

                    <div className="flex justify-center mt-3">
                        <button 
                            className={`
                                h-10 w-10 md:h-11 md:w-11 p-2 bg-white hover:bg-[#F9F9F9] rounded-[10px] outline-[1.5px] outline-offset-[-1px] outline-neutral-500/40 active:bg-white active:outline-2 active:outline-indigo-400 transition duration-200 ease-in-out flex justify-center items-center cursor-pointer`}
                            onClick={() => handleClick()}
                        >
                            <img src={button} alt="img" className="w-5 h-5 md:w-6 md:h-6"/>
                        </button>
                    </div>


                    <div className="flex flex-col gap-3"> 
                        <p className="flex text-[14px] md:text-[16px] font-semibold">В</p>

                        <div className="flex flex-col gap-3">
                            <input 
                                type="text"
                                value={result} 
                                placeholder="Результат" 
                                className={`
                                    flex items-center w-full h-16 md:h-20 px-3 md:px-4 bg-gray-200/50 rounded-2xl outline-[1.5px] outline-neutral-500/40
                                    text-lg md:text-[22px] font-semibold placeholder:font-medium placeholder:text-sm md:placeholder:text-base
                                    `}
                                readOnly
                            />

                            <Select
                                value={toCurrency}
                                onChange={ (val) => setToCurrency(val as Currency)}
                                options={currencies}
                                renderButton={renderButton}
                                renderOption={renderOption}
                                buttonClassName="w-full h-16 md:h-20 rounded-2xl shadow-none outline-[1.5px] outline-neutral-500/40"
                            />
                        </div>
                    </div>

                </div>

                {/* Десктопная версия — горизонтальная, инпуты и кнопка */}
                <div className="hidden lg:flex flex-row  items-end">

                    {/* Из */}
                    <div className="flex flex-1 flex-col gap-6.5">
                        <p className="text-[18px] font-semibold">Из</p>
                        <div className="flex flex-col gap-3">
                            <input 
                                type="number" 
                                value={inputValue}
                                placeholder="Введите значение" 
                                className={`
                                    flex items-center w-full h-[90px] px-4 bg-white/10 rounded-2xl outline-[1.5px] 
                                    outline-neutral-500/40 focus-within:outline-2 transition focus-within:outline-indigo-400 
                                    focus-within:shadow-[0px_1px_8px_0px_rgba(123,123,246,0.80)]
                                    text-[26px] font-semibold placeholder:font-medium placeholder:text-[20px]
                                    `}  
                                onChange={e => {
                                    if (e.target.value.length <= 20) {
                                        setInputValue(e.target.value)
                                        setError(null)
                                    }
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleClick()}
                            />

                            <Select
                                value={fromCurrency}
                                onChange={(val) => setFromCurrency(val as Currency)}
                                options={currencies}
                                renderButton={renderButton}
                                renderOption={renderOption}
                                buttonClassName="w-full h-[90px] rounded-2xl shadow-none outline-[1.5px] outline-neutral-500/40"
                            />
                        </div>
                    </div>

                    {/* Кнопка посередине */}
                    <button 
                        className={`
                            h-11 mx-7.5 mb-20 p-2.5 shrink-0 bg-white  hover:bg-[#F9F9F9]
                            rounded-[10px] outline-[1.5px] outline-offset-[-1px] outline-neutral-500/40 
                            active:bg-white active:outline-2 active:outline-indigo-400
                            transition duration-200 ease-in-out
                            justify-center items-center cursor-pointer`}
                        onClick={() => handleClick()}
                    >
                        <img src={button} alt="img" />
                    </button>

                    {/* В */}
                    <div className="flex flex-1 flex-col gap-6.5"> 
                        <div className="flex items-end justify-between text-[18px] font-semibold">
                            <span>В</span>
                            <div className="flex gap-3">
                            <button 
                                className="p-2.5 bg-white hover:bg-[#F5F5F5] active:bg-[#E7E7E7] rounded-[10px] outline-[1.5px] outline-offset-[-1px] outline-neutral-500/40 cursor-pointer"
                                onClick={() => handleClearInput()}
                            >
                                <img src={eraser} alt="img" />
                            </button>

                            <button 
                                className="p-2.5 bg-white hover:bg-[#F5F5F5] active:bg-[#E7E7E7] rounded-[10px] outline-[1.5px] outline-offset-[-1px] outline-neutral-500/40 cursor-pointer"
                                onClick={() => handleSwap()}
                            >
                                <img src={change} alt="img" />
                            </button>
                        </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <input 
                                type="text"
                                value={result} 
                                placeholder="Результат" 
                                className={`
                                    flex items-center w-full h-[90px] px-4 bg-gray-200/50 rounded-2xl outline-[1.5px] outline-neutral-500/40
                                    text-[26px] font-semibold placeholder:font-medium placeholder:text-[20px]
                                    `}
                                readOnly
                            />

                            <Select
                                value={toCurrency}
                                onChange={ (val) => setToCurrency(val as Currency)}
                                options={currencies}
                                renderButton={renderButton}
                                renderOption={renderOption}
                                buttonClassName="w-full h-[90px] rounded-2xl shadow-none outline-[1.5px] outline-neutral-500/40"
                            />
                        </div>
                    </div>

                </div>

                {/* Информация */}

                { !error ? (
                    <p className="flex gap-3 text-[12px] md:text-[14px] lg:text-[16px] font-medium">
                        <Info className="w-4.5 h-4.5 md:w-5 h-5 lg:w-6 lg:h-6" />
                        <span>{loading ? "Загрузка..." : infoText }</span>
                    </p>
                ) : (
                    <div className="flex py-4 text-[12px] md:text-[14px] lg:text-[16px] px-4 gap-3 lg:gap-4 items-start bg-[#FFE4E4]/65 border border-[#FE9292] rounded-2xl">
                        <Info className="text-[#FF5E5E] mt-2"/>
                        <p className="flex flex-col gap-0.5">
                            <span className="font-semibold">
                                {error.title}
                            </span>
                            <span className="text-[11px] md:text-[13px] lg:text-[15px] text-[#505050]">
                                {`Вы уже конвертировали ${error.from} ${error.fromV} в ${error.to} ${error.toV}.`}
                                <br />
                                Попробуйте изменить сумму или выбрать другие валюты.
                            </span>
                        </p>
                    </div>
                )}




            </div>

            {/* Блок с популярными преобразованиями */}
            <div className="flex flex-col mb-9 md:mb-12 lg:mb-13 gap-1.5 md:gap-2 lg:gap-4.5">
                <p className="text-[14px] md:text-[16px] lg:text-[18px] font-bold">Популярные пары</p>
                <div className="flex lg:flex-wrap py-3 px-1 lg:px-0 lg:py-0 gap-4 overflow-x-auto lg:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {popular_conversions.map( obj => {  
                        const from = currencies.find(c => c.value === obj.from)
                        const to = currencies.find(c => c.value === obj.to)

                        return (
                            <div 
                                key={`${obj.from}-${obj.to}`}
                                className={`
                                    flex flex-1 gap-2 px-4 py-4.5 md:px-4 md:py-4.5 lg:px-4 lg:py-5.5 text-[12px] md:text-[14px] lg:text-[16px] bg-white/40 rounded-[10px] shadow-[0px_1px_5px_0px_rgba(0,0,0,0.25)] 
                                    transition hover:-translate-y-2.5 active:translate-y-0 font-medium 
                                    active:bg-[#7B7BF6]/40 active:shadow-[0px_1px_8px_0px_rgba(123,123,246,0.80)]
                                    justify-center items-center cursor-pointer
                                `}
                                onClick={() => {
                                    if (from && to) handlePopular(from, to)
                                }}
                                >
                                <div className="flex gap-1.5 md:gap-2">
                                    <img src={from?.img} alt="img" className="w-4.5 h-4.5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 select-none  shrink-0" />
                                    <img src={to?.img} alt="img" className="w-4.5 h-4.5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 select-none  shrink-0" />
                                </div>
                                <p className="whitespace-nowrap select-none">{`${obj.from}/${obj.to}`}</p>
                            </div>
                        )})}
                </div>
            </div>


            {/* История конверсии */}
            <div className="flex flex-col px-6 md:px-8 pt-3 pb-2 bg-white rounded-2xl shadow-[0px_1px_6.599999904632568px_0px_rgba(0,0,0,0.25)] justify-center items-center">
                <div 
                    className={`
                        flex w-full py-4 px-3.5 justify-between items-start 
                        ${ data.length > 0 ? "border-b border-[#777777]/40" : "" }
                        `}
                    >
                    <p className="flex items-center gap-2 md:gap-2.5 text-[14px] md:text-[16px] lg:text-[18px] font-bold select-none">
                        <img src={recent} alt="img" className="h-5 w-5 md:h-5.5 md:w-5.5 lg:h-6 lg:w-6" />
                        <span>Недавние конверсии</span>
                    </p>
                    <Delete 
                    className="h-5 w-5 md:h-5.5 md:w-5.5 lg:h-6 lg:w-6 text-[#777777] cursor-pointer transition hover:text-[#E84545] active:text-[#9A1F1F]" 
                    onClick={() => handleDataClear()}
                    />
                </div>

                <div className="w-full">
                    { historyLoading 
                    ? 
                        <div className="flex mb-6 justify-center items-center">
                            <Loader2 className="w-7 h-7 animate-spin text-gray-400" />
                        </div>

                    : data.map((obj, i) => (
                        <div
                            key={obj.id}
                            className={`flex w-full justify-between items-center py-4 px-3.5 text-[12px] md:text-[14px] lg:text-[16px] ${i !== data.length - 1 ? "border-b border-[#777777]/40" : ""}`}
                        >
                            <div className="flex gap-2.5 font-medium">
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 mt-2 rounded-full bg-[#C4C4C4]"></div>
                                <p className="flex flex-col gap-2">
                                    <span className="max-w-22 md:max-w-none">{obj.title}</span>
                                    <span className="text-[#919191]">{obj.time}</span>
                                </p>

                            </div>
                            <span className="text-black text-[12px] md:text-[14px] lg:text-[16px] font-medium">{obj.info_text}</span>
                        </div>
                    ))}
                </div>
        </div>
        </div>
    )
}


export default Currency_Converter