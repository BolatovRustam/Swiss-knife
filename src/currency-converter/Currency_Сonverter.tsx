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



const renderButton = (opt: Option) => (
    <div className="flex items-center gap-3">
        <img src={opt.img} alt={opt.value} className="w-9 h-9 rounded-full object-cover shrink-0" />
        <div className="flex flex-col items-start">
            <span className="text-[20px] font-semibold">{opt.value}</span>
            <span className="text-[13px] text-gray-400">{opt.label}</span>
        </div>
    </div>
)

const renderOption = (opt: Option) => (
    <div className="flex items-center gap-3">
        <img src={opt.img} alt={opt.value} className="w-7 h-7 rounded-full object-cover shrink-0" />
        <div className="flex flex-col">
            <span className="text-[16px] font-semibold">{opt.value}</span>
            <span className="text-[12px] text-gray-400">{opt.label}</span>
        </div>
    </div>
)


function Currency_Converter () {
    const { session } = useAuthStore()
    const [fromCurrency, setFromCurrency] = useState<Currency>(currencies[0])
    const [toCurrency, setToCurrency] = useState<Currency>(currencies[1])
    const [inputValue, setInputValue] = useState("")
    const [result, setResult] = useState("")
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

        <div className="flex max-h-full overflow-y-auto flex-col pt-12.5 pb-11 px-21.5 gap-8"> 

            {/* Верхняя часть */}
            <div className="flex flex-col px-8 py-7 gap-6.5 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]">
            
                {/* Инпуты и кнопка */}
                <div className="flex items-end">

                    {/* Из */}
                    <div className="flex flex-1 flex-col gap-6.5">
                        <p className="text-[18px] font-semibold">Из</p>
                        <div className="flex flex-col gap-3">
                            <input 
                                type="number" 
                                value={inputValue}
                                placeholder="Введите значение" 
                                className={`
                                    flex items-center h-[90px] px-4 bg-white/10 rounded-2xl outline-[1.5px] 
                                    outline-neutral-500/40 focus-within:outline-2 transition focus-within:outline-indigo-400 
                                    focus-within:shadow-[0px_1px_8px_0px_rgba(123,123,246,0.80)]
                                    text-[26px] font-semibold placeholder:font-medium placeholder:text-[20px]
                                    `}  
                                onChange={e => {
                                    if (e.target.value.length <= 20)  setInputValue(e.target.value)
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
                                    flex items-center h-[90px] px-4 bg-gray-200/50 rounded-2xl outline-[1.5px] outline-neutral-500/40
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
                <p className="flex gap-3 font-medium">
                    <Info />
                    <span>{loading ? "Загрузка..." : infoText }</span>
                </p>

            </div>

            {/* Блок с популярными преобразованиями */}
            <div className="flex mb-5 flex-col gap-4.5">
                <p className="text-[18px] font-bold">Популярные пары</p>
                <div className="flex gap-4">
                    {popular_conversions.map( obj => {  
                        const from = currencies.find(c => c.value === obj.from)
                        const to = currencies.find(c => c.value === obj.to)

                        return (
                            <div 
                                key={`${obj.from}-${obj.to}`}
                                className={`
                                    flex w-full px-4 py-5.5 gap-2 bg-white/40 rounded-[10px] shadow-[0px_1px_5px_0px_rgba(0,0,0,0.25)] 
                                    transition hover:-translate-y-2.5 active:translate-y-0 font-medium 
                                    active:bg-[#7B7BF6]/40 active:shadow-[0px_1px_8px_0px_rgba(123,123,246,0.80)]
                                    justify-center items-center cursor-pointer
                                `}
                                onClick={() => {
                                    if (from && to) handlePopular(from, to)
                                }}
                                >
                                <div className="flex gap-2">
                                    <img src={from?.img} alt="img" className="h-6 w-6" />
                                    <img src={to?.img} alt="img" className="h-6 w-6" />
                                </div>
                                <p className="whitespace-nowrap select-none">{`${obj.from}/${obj.to}`}</p>
                            </div>
                        )})}
                </div>
            </div>


            {/* История конверсии */}
            <div className="flex  flex-col px-8 pt-3 pb-1 bg-white rounded-2xl shadow-[0px_1px_6.599999904632568px_0px_rgba(0,0,0,0.25)] justify-center items-center">
                <div 
                    className={`
                        flex w-full py-4 px-3.5 justify-between items-start 
                        ${ data.length > 0 ? "border-b border-[#777777]/40" : "" }
                        `}
                    >
                    <p className="flex gap-2.5 text-[18px] font-bold select-none">
                        <img src={recent} alt="img" className="h-6 w-6" />
                        <span>Недавние конверсии</span>
                    </p>
                    <Delete 
                    className="text-[#777777] cursor-pointer transition hover:text-[#E84545] active:text-[#9A1F1F]" 
                    onClick={() => handleDataClear()}
                    />
                </div>

                <div className="w-full">
                    { historyLoading 
                    ? 
                        <div className="flex justify-center items-center">
                            <Loader2 className="w-7 h-7 animate-spin text-gray-400" />
                        </div>

                    : data.map((obj, i) => (
                        <div
                            key={obj.id}
                            className={`flex w-full justify-between items-center py-4 px-3.5 text-[16px] ${i !== data.length - 1 ? "border-b border-[#777777]/40" : ""}`}
                        >
                            <div className="flex gap-2.5 font-medium">
                                <div className="w-2 h-2 mt-2 rounded-full bg-[#C4C4C4]"></div>
                                <p className="flex flex-col gap-2">
                                    <span>{obj.title}</span>
                                    <span className="text-[#919191]">{obj.time}</span>
                                </p>

                            </div>
                            <span className="text-black text-[16px] font-medium">{obj.info_text}</span>
                        </div>
                    ))}
                </div>
        </div>
        </div>
    )
}

export default Currency_Converter