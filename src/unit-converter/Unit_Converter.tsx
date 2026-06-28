import { useEffect, useMemo, useState } from "react"
import { categories, popular_conversions } from "./data/constants"
import { unitCategories, type CategoryName } from "./data/units"
import { convertor } from "../utils/converter"

import button from "../assets/icons/change button.svg"
import change from "../assets/icons/change.svg"
import eraser from "../assets/icons/eraser.svg"
import recent from "../assets/icons/recent.svg"
import checkbox from "../assets/icons/checkbox-on ( var 2 ).svg"
import Delete from "../assets/icons/delete.svg?react"
import Info from "../assets/icons/info.svg?react"
import unitConvPng from "../assets/png/unitConverterPng.png"

type Data = {
    id: string
    title: string
    time: string  
}

function Unit_Converter () {
    const [ activeCategory, setActiveCategory ] = useState<CategoryName>("Длина")
    const [ inputValue, setInputValue ] = useState("")
    const [ fromUnit, setFromUnit ] = useState<string>( unitCategories["Длина"][0].value )
    const [ toUnit, setToUnit ] = useState<string>( unitCategories["Длина"][1].value )
    const [ result, setResult ] = useState("")

    const [data, setData] = useState<Data[]>(() => {
        const saved = localStorage.getItem("unitData")
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem("unitData", JSON.stringify(data))
    }, [data])

    const units = unitCategories[activeCategory]

    const handleClick = () => {
        const num = parseFloat(inputValue)

        if (isNaN(num) || inputValue === "") return ""

        const converted = convertor(num, fromUnit, toUnit, activeCategory)
        const res = parseFloat(converted.toPrecision(8)).toString()

        setResult(res)

        const time = new Date().toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })

        setData(prev => [...prev, {
            id:crypto.randomUUID(),
            title: `${inputValue} ${fromUnit} → ${res} ${toUnit}`,
            time
        }])
    }

    const handleClearInput = () => {
        setInputValue("")
        setResult("")
    }

    const handleDataClear = () => {
        setData([])
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

        return `1 ${f.label} = ${parseFloat(rate.toPrecision(6))} ${t.label}`
    }, [fromUnit, toUnit, activeCategory, units])


    return (
    <div className="flex h-full max-h-full overflow-y-auto flex-col pt-12.5 pb-3.5 px-21.5"> 

        {/* Верхняя часть */}
        <div className="flex flex-col h-[490px]  mb-8 px-8 py-7 gap-8.5 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]">
            
            {/* Инпуты и кнопка */}
            <div className="flex items-end">

                {/* Из */}
                <div className="flex flex-1 flex-col gap-6.5">
                    <p className="text-[18px] font-semibold">Из</p>
                    <div className="flex items-center h-[90px] px-4  bg-white/10 rounded-2xl outline-[1.5px]  outline-neutral-500/40 focus-within:outline-2 transition focus-within:outline-indigo-400 focus-within:shadow-[0px_1px_8px_0px_rgba(123,123,246,0.80)]">
                        <input 
                            type="number" 
                            value={inputValue}
                            placeholder="Введите значение" 
                            className="flex-3 outline-none text-[26px] font-semibold placeholder:font-medium placeholder:text-[20px]"  
                            onChange={e => {
                                if (e.target.value.length <= 10)  setInputValue(e.target.value)
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handleClick()}
                        />
                        <select 
                            value={fromUnit}
                            className="flex-1 outline-none text-[16px] font-medium cursor-pointer"
                            onChange={e => setFromUnit(e.target.value)}
                        >
                            {units.map(u => (
                                <option value={u.value} key={u.value}>{u.label}</option>
                            ))}
                        </select>
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
                                className="flex-3 outline-none text-[26px] font-semibold placeholder:font-medium placeholder:text-[20px]"
                                readOnly
                            />
                            <select 
                                value={toUnit}
                                className="flex-1 outline-none text-[16px] font-medium cursor-pointer"
                                onChange={e => setToUnit(e.target.value)}
                            >
                                {units.map(u => (
                                    <option value={u.value} key={u.value}>{u.label}</option>
                                ))}
                            </select>
                    </div>
                </div>

            </div>

            {/* Информация */}
            <div className="flex h-18 text-[16px] px-4 gap-2.5 items-center bg-[#F1F2FB] rounded-2xl">
                <Info className="text-[#5885EA]"/>
                <span>{infoText}</span>
            </div>

            {/* Категории */}
            <div className="flex flex-col gap-4">
                <p className="text-[18px] font-bold">Категории</p>
                <div className="flex gap-4">
                    {categories.map(obj => (
                        <div
                            key={obj.title} 
                            onClick={() => handleCategoryChange(obj.title as CategoryName)}
                            className={`relative flex w-full px-8 py-5.5 gap-2 rounded-[10px] text-[16px] font-medium justify-center items-center transition select-none cursor-pointer
                                ${obj.title === activeCategory 
                                    ? "outline-indigo-400 outline-2 shadow-[0px_1px_8px_0px_rgba(123,123,246,0.80)]" 
                                    : "bg-[#ECECEC]/25 hover:bg-[#ECECEC]/5  outline-[1.5px] outline-neutral-500/40"} `}
                        >
                            {obj.title === activeCategory && (
                                <img 
                                    src={unitConvPng} 
                                    alt="" 
                                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                                    draggable = "false"
                                />
                            )}
                            <img 
                                src={obj.img} 
                                alt="img" 
                                className="relative z-10 w-7.5 h-7.5"
                                draggable="false"
                            />
                            <p className="relative z-10 whitespace-nowrap select-none">{obj.title}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>

        {/* Блок с популярными преобразованиями */}
        <div className="flex flex-col mb-13 gap-4.5">
            <p className="text-[18px] font-bold">Популярные преобразования</p>
            <div 
                className="flex font-medium gap-4.5"
                draggable = "false"
            >
                {popular_conversions.map( obj => (
                    <div 
                        key={obj.title}
                        className={`
                            flex w-full gap-2 px-4 py-3 bg-white/40 rounded-[10px] group shadow-[0px_1px_5px_0px_rgba(0,0,0,0.25)] 
                            transition hover:-translate-y-2.5 active:translate-y-0 active:bg-[#7B7BF6]/40 active:shadow-[0px_1px_8px_0px_rgba(123,123,246,0.80)] 
                            justify-center items-center cursor-pointer
                        `}
                        onClick={() => handlePopularCategory(obj.category as CategoryName, obj.from, obj.to)}
                        draggable = "false"
                    >
                        <div 
                            className="flex items-center justify-center h-10 w-10 rounded-4xl bg-[#ECECFD] group-active:bg-transparent group-active:transition"
                            draggable = "false"
                        >
                            <img src={obj.img} alt="img" className="select-none" draggable="false" />
                        </div>
                        <p className="whitespace-nowrap select-none">{obj.title}</p>
                    </div>
                ))}
            </div>
        </div>


        {/* История конверсии */}
        <div className="flex flex-col px-8 pt-3 pb-2 bg-white rounded-2xl shadow-[0px_1px_6.599999904632568px_0px_rgba(0,0,0,0.25)] justify-center items-center">
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
                    {data.map((obj, i) => (
                        <div
                            key={obj.id}
                            className={`flex w-full justify-between items-center py-4 px-3.5 text-[16px] ${i !== data.length - 1 ? "border-b border-[#777777]/40" : ""}`}
                        >
                            <div className="flex items-center gap-2.5 font-medium">
                                <img src={checkbox} alt="img" className="h-6 w-6" />
                                <span>{obj.title}</span>
                            </div>
                            <span className="text-[#777777]/80 text-[16px] font-medium">{obj.time}</span>
                        </div>
                    ))}
                </div>
        </div>
    </div>
    )
}

export default Unit_Converter