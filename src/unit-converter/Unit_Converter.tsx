import { useMemo, useState } from "react"
import { useAuthStore } from "../store/authStore"
import { categories, popular_conversions } from "./data/constants"
import { unitCategories, type CategoryName } from "./data/units"
import { convertor } from "../utils/converter"
import type { Data } from "./types"
import { Loader2 } from 'lucide-react'

import { Delete, Info, button, change, eraser, recent, checkbox } from "@/assets/icons"
import { useSupabaseHistory } from "@/hooks/useSupabaseHistory"
import Dropdown from "@/components/Dropdown"

interface Error {
    title: string
    from?: string
    fromU?: string
    to?: string
    toU?: string
}



function Unit_Converter () {
    const { session } = useAuthStore()
    const [ activeCategory, setActiveCategory ] = useState<CategoryName>("Длина")
    const [ inputValue, setInputValue ] = useState("")
    const [error, setError] = useState<Error | null>(null)
    const [ fromUnit, setFromUnit ] = useState<string>( unitCategories["Длина"][0].value )
    const [ toUnit, setToUnit ] = useState<string>( unitCategories["Длина"][1].value )
    const [ result, setResult ] = useState("")

    const { data, addEntry, clearAll, loading } = useSupabaseHistory<Data>('unit-conversions', session?.user.id)

    const units = unitCategories[activeCategory]

    const handleClick = () => {
        if (!session) return

        const num = parseFloat(inputValue)

        if (isNaN(num) || inputValue === "") return ""

        const converted = convertor(num, fromUnit, toUnit, activeCategory)
        const res = parseFloat(converted.toPrecision(8)).toString()

        setResult(res)

        const title = `${inputValue} ${fromUnit} → ${res} ${toUnit}`

        const lastEntry = data[data.length - 1]
        if (lastEntry && lastEntry.title === title) {
            setError({  title: "Это преобразование уже выполнялось",
                        from: inputValue,
                        fromU: fromUnit,
                        to: res,
                        toU: toUnit,
             })
            return
        }

        if (inputValue === "") {
            setError({
                title:"Введите значение"
            })
        }

        setError(null)

        const time = new Date().toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })

        const tempUnitTask: Data = {
            id: crypto.randomUUID(),
            user_id: session?.user.id,
            title,
            time
        }

        addEntry(tempUnitTask, { user_id: session?.user.id, title, time })
    }

    const handleClearInput = () => {
        setInputValue("")
        setResult("")
    }

    const handleDataClear = () => {
        clearAll()
    }

    const handleCategoryChange = (cat: CategoryName) => {
        setActiveCategory(cat)
        setInputValue("")
        setResult("")
        setFromUnit(unitCategories[cat][0].value)
        setToUnit(unitCategories[cat][1].value)
  }

    const handlePopularCategory = (cat: CategoryName, from: string, to: string) => {
        setActiveCategory(cat)
        setFromUnit(from)
        setToUnit(to)
        setInputValue("")
        setResult("")
    }

    const handleSwap = () => {
        setFromUnit(toUnit)
        setToUnit(fromUnit)
        setInputValue(result)
        setResult(inputValue)
    }

    const infoText = useMemo(() => {
        const f = units.find( u => u.value === fromUnit)
        const t = units.find( u => u.value === toUnit )

        if (!f || !t) return ""

        const rate = convertor(1, f.value, t.value, activeCategory)

        return `1 ${f.label.toLowerCase()} = ${parseFloat(rate.toPrecision(6))} ${t.label.toLowerCase()}`
    }, [fromUnit, toUnit, activeCategory, units])
    

    return (
    <div className="flex h-full max-h-full overflow-y-auto flex-col pt-9.5 lg:pt-12.5 pb-3.5 px-6.5 md:px-12 xl:px-21.5"> 

        {/* Верхняя часть */}
        <div className="flex flex-col mb-8 px-8 py-7 gap-7.5 lg:gap-8.5 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]">

        {/* Мобильная/планшетная версия — вертикальная, eraser+swap сверху, круглая кнопка посередине */}
            <div className="flex flex-col lg:hidden gap-3">
                <div className="flex justify-between items-end">
                    <p className="text-[14px] md:text-[16px] font-semibold">Из</p>
                    <div className="flex gap-2 md:gap-3">
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

                <div className="flex items-center h-16 md:h-20 px-3 md:px-4 bg-white/10 rounded-2xl outline-[1.5px] outline-neutral-500/40 focus-within:outline-2 transition focus-within:outline-indigo-400 focus-within:shadow-[0px_1px_8px_0px_rgba(123,123,246,0.80)]">
                    <input 
                        type="number" 
                        value={inputValue}
                        placeholder="Введите значение" 
                        className="flex-1 min-w-0 outline-none text-lg md:text-[22px] font-semibold placeholder:font-medium placeholder:text-sm md:placeholder:text-base"  
                        onChange={e => {
                            if (e.target.value.length <= 10) {
                                setInputValue(e.target.value)
                                setError(null)
                            }
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleClick()}
                    />
                    <Dropdown 
                        value={units.find(u => u.value === fromUnit)!}
                        onChange={val => setFromUnit(val)}
                        options={units}
                        buttonClassName="flex justify-between items-center gap-2 font-medium text-[12px] md:text-[14px] cursor-pointer outline-none shrink-0"
                        menuClassName="absolute whitespace-nowrap top-7.5 bg-white outline outline-grey-50"
                        optionClassName="pl-[6px] pr-[14px] hover:bg-[#767676] text-[12px] md:text-[14px] hover:text-white cursor-pointer"
                    /> 
                </div>

                <div className="flex justify-center mt-3">
                    <button 
                        className="h-10 w-10 md:h-11 md:w-11 p-2 bg-white hover:bg-[#F9F9F9] rounded-[10px] outline-[1.5px] outline-offset-[-1px] outline-neutral-500/40 active:bg-white active:outline-2 active:outline-indigo-400 transition duration-200 ease-in-out flex justify-center items-center cursor-pointer"
                        onClick={() => handleClick()}
                    >
                        <img src={button} alt="img" className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>

                <p className="text-[14px] md:text-[16px] font-semibold">В</p>

                <div className="flex items-center h-16 md:h-20 px-3 md:px-4 bg-gray-200/50 rounded-2xl outline-[1.5px] outline-neutral-500/40">
                    <input 
                        type="text"
                        value={result} 
                        placeholder="Результат" 
                        className="flex-1 min-w-0 outline-none text-lg md:text-[22px] font-semibold placeholder:font-medium placeholder:text-sm md:placeholder:text-base"
                        readOnly
                    />
                    <Dropdown 
                        value={units.find(u => u.value === toUnit)!}
                        onChange={val => setToUnit(val)}
                        options={units}
                        buttonClassName="flex justify-between items-center gap-2 font-medium text-[12px] md:text-[14px] cursor-pointer outline-none shrink-0"
                        menuClassName="absolute whitespace-nowrap top-7.5 bg-white outline outline-grey-50"
                        optionClassName="pl-[6px] pr-[14px] hover:bg-[#767676] text-[12px] md:text-[14px] hover:text-white cursor-pointer"
                    /> 
                </div>
            </div>
            
            {/*Десктопная версия — горизонтальная, инпуты и кнопка */}
            <div className="hidden lg:flex flex-row  items-end">

                {/* Из */}
                <div className="flex flex-1 flex-col gap-6.5">
                    <p className="text-[18px] font-semibold">Из</p>
                    <div className="flex items-center h-[90px] px-4  bg-white/10 rounded-2xl outline-[1.5px]  outline-neutral-500/40 focus-within:outline-2 transition focus-within:outline-indigo-400 focus-within:shadow-[0px_1px_8px_0px_rgba(123,123,246,0.80)]">
                        <input 
                            type="number" 
                            value={inputValue}
                            placeholder="Введите значение" 
                            className="outline w-full outline-none text-[26px] font-semibold placeholder:font-medium placeholder:text-[20px]"  
                            onChange={e => {
                                if (e.target.value.length <= 10) {
                                    setInputValue(e.target.value)
                                    setError(null)
                                }
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handleClick()}
                        />

                        <Dropdown 
                            value={units.find(u => u.value === fromUnit)!}
                            onChange={val => setFromUnit(val)}
                            options={units}
                            buttonClassName="flex justify-between w-full gap-4 items-center font-medium cursor-pointer outline-none"
                            menuClassName="absolute whitespace-nowrap top-7.5 bg-white outline outline-grey-50"
                            optionClassName="hover:bg-[#767676] hover:text-white pl-[6px] pr-[14px] cursor-pointer"
                        /> 
                    </div>
                </div>

                {/* Кнопка посередине */}
                <button 
                    className={`
                        h-11 mx-7.5 mb-5.5 p-2.5 shrink-0 bg-white  hover:bg-[#F9F9F9]
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

                    <div className="flex items-center h-[90px] px-4 bg-gray-200/50 rounded-2xl outline-[1.5px] outline-neutral-500/40">
                            <input 
                                type="text"
                                value={result} 
                                placeholder="Результат" 
                                className="w-full outline-none text-[26px] font-semibold placeholder:font-medium placeholder:text-[20px]"
                                readOnly
                            />
                            
                            <Dropdown 
                                value={units.find(u => u.value === toUnit)!}
                                onChange={val => setToUnit(val)}
                                options={units}
                                buttonClassName="flex justify-between w-full gap-4 items-center font-medium cursor-pointer outline-none"
                                menuClassName="absolute whitespace-nowrap top-7.5 bg-white outline outline-grey-50"
                                optionClassName="hover:bg-[#767676] hover:text-white pl-[6px] pr-[14px] cursor-pointer"
                            /> 
                    </div>
                </div>

            </div>

            {/* Информация */}
            
            { !error ? ( 
                <div className="flex items-center h-13 md:h-16 lg:h-18 px-4 gap-2 md:gap-3 lg:gap-4 text-[12px] md:text-[14px] lg:text-[16px] bg-[#F1F2FB] rounded-xl md:rounded-2xl">
                    <Info className="w-4.5 h-4.5 md:w-5 h-5 lg:w-6 lg:h-6 text-[#5885EA]"/>
                    <span>{infoText}</span>
                </div> ) : (
                <div className="flex py-4 text-[12px] md:text-[14px] lg:text-[16px] px-4 gap-3 lg:gap-4 items-start bg-[#FFE4E4]/65 border border-[#FE9292] rounded-2xl">
                    <Info className="text-[#FF5E5E] mt-2"/>
                    <p className="flex flex-col gap-0.5">
                        <span className="font-semibold">
                            {error.title}
                        </span>
                        <span className="text-[11px] md:text-[13px] lg:text-[15px] text-[#505050]">
                            {`Вы уже конвертировали ${error.from} ${error.fromU} в ${error.to} ${error.toU}.`}
                            <br />
                            Попробуйте изменить значения или выберите другие единицы измерения.
                        </span>
                    </p>
                </div> 
            )}
            

            {/* Категории */}
            <div className="flex flex-col gap-4">
                <p className="text-[14px] md:text-[16px] lg:text-[18px] font-bold">Категории</p>
                <div className="grid grid-cols-2 md:grid-rows-2 md:grid-flow-col md:auto-cols-fr lg:flex lg:flex-wrap gap-4">
                    {categories.map(obj => (
                        <div
                            key={obj.title} 
                            onClick={() => handleCategoryChange(obj.title as CategoryName)}
                            className={`
                                relative flex w-full md:flex-1 py-3.5 md:py-4.5 lg:px-8 lg:py-5.5 gap-2 rounded-[10px] text-[12px] md:text-[14px] lg:text-[16px] font-medium justify-center items-center 
                                transition select-none cursor-pointer
                                ${obj.title === activeCategory 
                                    ? "outline-indigo-400 outline-2 gradient-btn-purple shadow-[0px_1px_8px_0px_rgba(123,123,246,0.80)]" 
                                    : "bg-[#ECECEC]/25 hover:bg-[#ECECEC]/5  outline-[1.5px] outline-neutral-500/40"} `}
                        >
                            <img 
                                src={obj.img} 
                                alt="img" 
                                className="relative z-10 w-4.5 h-4.5 md:w-6 md:h-6 lg:w-7.5 lg:h-7.5"
                                draggable="false"
                            />
                            <p className="relative z-10 whitespace-nowrap select-none">{obj.title}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>

        {/* Блок с популярными преобразованиями */}
        <div className="flex flex-col mb-9 md:mb-12 lg:mb-13 gap-1.5 md:gap-2 lg:gap-4.5">
            <p className="text-[14px] md:text-[16px] lg:text-[18px] font-bold">Популярные преобразования</p>
            <div 
                className="flex py-3 px-1 lg:px-0 lg:py-0 overflow-x-auto lg:overflow-visible lg:flex-wrap font-medium gap-3.5 md:gap-4.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                draggable = "false"
            >
                {popular_conversions.map( obj => (
                    <div 
                        key={obj.title}
                        className={`
                            flex flex-1 gap-2 px-4 py-2.5 md:px-4 md:py-2.5 lg:px-4 lg:py-3 text-[12px] md:text-[14px] lg:text-[16px] bg-white/40 rounded-[10px] group shadow-[0px_1px_5px_0px_rgba(0,0,0,0.25)] 
                            transition hover:-translate-y-2.5 active:translate-y-0 active:bg-[#7B7BF6]/40 active:shadow-[0px_1px_8px_0px_rgba(123,123,246,0.80)] 
                            justify-center items-center cursor-pointer
                        `}
                        onClick={() => handlePopularCategory(obj.category as CategoryName, obj.from, obj.to)}
                        draggable = "false"
                    >
                        <div 
                            className="flex items-center justify-center h-6.5 w-6.5 md:h-8 md:w-8 lg:h-10 lg:w-10 rounded-4xl bg-[#ECECFD] group-active:bg-transparent group-active:transition"
                            draggable = "false"
                        >
                            <img src={obj.img} alt="img" className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 select-none" draggable="false" />
                        </div>
                        <p className="whitespace-nowrap select-none">{obj.title}</p>
                    </div>
                ))}
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
                    className="h-5 w-5 md:h-5.5 md:w-5.5 lg:h-6 lg:w-6 text-[#777777] hover:text-[#E84545] active:text-[#9A1F1F] cursor-pointer transition" 
                    onClick={() => handleDataClear()}
                    />
                </div>

                <div className="w-full">
                    { loading 
                    ? 
                        <div className="flex justify-center items-center mb-2">
                            <Loader2 className="w-7 h-7 animate-spin text-gray-400" />
                        </div>
                        
                    : data.map((obj, i) => (
                        <div
                            key={obj.id}
                            className={`flex w-full justify-between items-center py-4 px-3.5 text-[12px] md:text-[14px] lg:text-[16px] ${i !== data.length - 1 ? "border-b border-[#777777]/40" : ""}`}
                        >
                            <div className="flex items-center max-w-28 md:max-w-none gap-1.5 md:gap-2 lg:gap-2.5 font-medium">
                                <img src={checkbox} alt="img" className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                                <span>{obj.title}</span>
                            </div>
                            <span className="text-[#777777]/80 text-[12px] md:text-[14px] lg:text-[16px] font-medium">{obj.time}</span>
                        </div>
                    ))}
                </div>
        </div>
    </div>
    )
}

export default Unit_Converter