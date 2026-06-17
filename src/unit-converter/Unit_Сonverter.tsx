import length from "../assets/icons/length.svg"
import weight from "../assets/icons/weigth.svg"
import temperature from "../assets/icons/temperature.svg"
import volume from "../assets/icons/volume.svg"
import square from "../assets/icons/square.svg"
import speed from "../assets/icons/speed.svg"
import pressure from "../assets/icons/pressure.svg"
import time from "../assets/icons/time.svg"
import button from "../assets/icons/change button.svg"
import change from "../assets/icons/change.svg"
import Info from "../assets/icons/info.svg?react"
import unitConvPng from "../assets/png/unitConverterPng.png"
import { useMemo, useState } from "react"
import { unitCategories, type CategoryName } from "../types/units"
import { convertor } from "../utils/converter"


const categories = [
    { img: length, title: "Длина" },
    { img: weight, title: "Масса" },
    { img: temperature, title: "Температура" },
    { img: volume, title: "Объём" },
    { img: square, title: "Площадь" },
    { img: speed, title: "Скорость" },
    { img: pressure, title: "Давление" },
    { img: time, title: "Время" },
]

const popular_conversions = [
    { img: length, title: "Км → М", category: "Длина", from: "km", to: "m"  },
    { img: weight, title: "Килограмм → Грамм", category: "Масса",  from: "kg", to: "g" },
    { img: temperature, title: "°C → °F", category: "Температура", from: "c", to: "f" },
    { img: speed, title: "км/ч → м/с", category: "Скорость", from: "kmh", to: "ms" },
    { img: volume, title: "Литр → Миллилитр", category: "Объём", from: "l", to: "ml" },
    { img: time, title: "Час → Минута", category: "Время", from: "h", to: "min" },
    { img: square, title: "м² → км²", category: "Площадь", from: "m2", to: "km2" },
]

function Unit_Converter () {
    const [ activeCategory, setActiveCategory ] = useState<CategoryName>("Длина")
    const [ inputValue, setInputValue ] = useState("")
    const [ fromUnit, setFromUnit ] = useState<string>( unitCategories["Длина"][0].value )
    const [ toUnit, setToUnit ] = useState<string>( unitCategories["Длина"][1].value )
    const [ result, setResult ] = useState("")

    const units = unitCategories[activeCategory]

    const handleClick = () => {
        const num = parseFloat(inputValue)

        if (isNaN(num) || inputValue === "") return ""

        const converted = convertor(num, fromUnit, toUnit, activeCategory)
        const res = parseFloat(converted.toPrecision(8)).toString()

        setResult(res)
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
    }

    const infoText = useMemo(() => {
        const f = units.find( u => u.value === fromUnit)
        const t = units.find( u => u.value === toUnit )

        if (!f || !t) return ""

        const rate = convertor(1, f.value, t.value, activeCategory)

        return `1 ${f.label} = ${parseFloat(rate.toPrecision(6))} ${t.label}`
    }, [fromUnit, toUnit, activeCategory, units])





    return (
    <div className="flex h-full flex-col pt-12.75 pb-12.25 px-21.5"> 

        {/* Верхняя часть */}
        <div className="flex flex-col h-[490px] mb-8 px-8 py-7 gap-8.5 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]">
            
            {/* Инпуты и кнопка */}
            <div className="flex items-end">

                {/* Из */}
                <div className="flex flex-1 flex-col gap-6.5">
                    <p className="text-[18px] font-semibold">Из</p>
                    <div className="flex items-center h-[95px] px-4  bg-white/10 rounded-2xl outline-[1.5px]  outline-neutral-500/40 focus-within:outline-2 transition focus-within:outline-indigo-400 focus-within:shadow-[0px_1px_8px_0px_rgba(123,123,246,0.80)]">
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
                    className="h-11 mx-7.5 mb-5.5 p-2.5 shrink-0 bg-white hover:bg-[#F5F5F5] active:bg-[#E7E7E7] rounded-[10px] outline-[1.5px] outline-offset-[-1px] outline-neutral-500/40 justify-center items-center cursor-pointer"
                    onClick={() => handleClick()}
                >
                    <img src={button} alt="img" />
                </button>

                {/* В */}
                <div className="flex flex-1 flex-col gap-6.5"> 
                    <p className="flex items-end justify-between text-[18px] font-semibold">
                        <span>В</span>
                        <button 
                            className="p-2.5 bg-white hover:bg-[#F5F5F5] active:bg-[#E7E7E7] rounded-[10px] outline-[1.5px] outline-offset-[-1px] outline-neutral-500/40 cursor-pointer"
                            onClick={() => handleSwap()}
                        >
                            <img src={change} alt="img" />
                        </button>
                    </p>

                    <div className="flex items-center h-[95px] px-4 bg-gray-200/50 rounded-2xl outline-[1.5px] outline-neutral-500/40">
                            <input 
                                type="text"
                                value={result} 
                                placeholder="Результат" 
                                className="flex-3 rounded-2xl outline-none text-[26px] font-semibold placeholder:font-medium placeholder:text-[20px]"
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
            <div className="flex h-18 px-4 gap-2.5 items-center bg-[#F1F2FB] rounded-2xl">
                <Info className="stroke-[#5885EA]"/>
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
                            className={`relative flex w-full px-8 py-5.5 gap-2 rounded-[10px] text-[16px] font-medium justify-center items-center transition cursor-pointer
                                ${obj.title === activeCategory 
                                    ? "outline-indigo-400 outline-2 shadow-[0px_1px_8px_0px_rgba(123,123,246,0.80)]" 
                                    : "bg-[#ECECEC]/25 hover:bg-[#ECECEC]/5  outline-[1.5px] outline-neutral-500/40"} `}
                        >
                            {obj.title === activeCategory && (
                                <img 
                                    src={unitConvPng} 
                                    alt="" 
                                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                                />
                            )}
                            <img 
                                src={obj.img} 
                                alt="img" 
                                className="relative z-10 w-7.5 h-7.5"
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
            <div className="flex font-medium gap-4.5">
                {popular_conversions.map( obj => (
                    <div 
                        className="flex w-full gap-2 px-4 py-3 bg-white/40 rounded-[10px] shadow-[0px_1px_5px_0px_rgba(0,0,0,0.25)] transition hover:-translate-y-2.5 active:translate-y-0 justify-center items-center cursor-pointer"
                        onClick={() => handlePopularCategory(obj.category as CategoryName, obj.from, obj.to)}
                    >
                        <div className="flex items-center justify-center h-10 w-10 rounded-4xl bg-[#ECECFD]">
                            <img src={obj.img} alt="img" />
                        </div>
                        <p className="whitespace-nowrap select-none">{obj.title}</p>
                    </div>
                ))}
            </div>
        </div>


        {/* История конверсии */}
        <div className="flex h-58 px-8 pt-3 pb-1 bg-white rounded-2xl shadow-[0px_1px_6.599999904632568px_0px_rgba(0,0,0,0.25)] flex-col justify-center items-center">

        </div>
    </div>
    )
}

export default Unit_Converter