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
    { img: length, title: "Км → М" },
    { img: weight, title: "Килограмм → Грамм" },
    { img: temperature, title: "°C → °F" },
    { img: speed, title: "км/ч → м/с" },
    { img: volume, title: "Литр → Миллилитр" },
    { img: time, title: "Час → Минута" },
    { img: square, title: "м² → км²" },
]

function Unit_Converter () {
    return (
    <div className="flex h-full flex-col pt-12.75 pb-12.25 px-21.5"> 

        {/* Верхеяя часть */}
        <div className="flex flex-col h-[490px] mb-8 px-8 py-7 gap-8.5 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]">
            
            {/* Инпуты и кнопка */}
            <div className="flex items-end">

                {/* Из */}
                <div className="flex flex-1 flex-col gap-6.5">
                    <p className="text-[18px] font-semibold">Из</p>
                    <div className="flex items-center h-[95px] px-4  bg-white/10 rounded-2xl outline-[1.5px]  outline-neutral-500/40 focus-within:outline-2 focus-within:outline-indigo-400 focus-within:shadow-[0px_1px_8px_0px_rgba(123,123,246,0.80)]">
                        <input 
                            type="number" 
                            placeholder="Введите значение" 
                            className="flex-3 outline-none text-[26px] font-semibold placeholder:font-[500] placeholder:text-[20px]"  
                            maxLength={10}  
                        />
                        <select className="flex-1 outline-none text-[16px] font-medium cursor-pointer ">
                            <option>Километр (km)</option>
                            <option>Метр (m)</option>
                        </select>
                    </div>
                </div>

                {/* Кнопка посередине */}
                <button className="h-11 mx-7.5 mb-5.5 p-2.5 shrink-0 bg-white rounded-[10px] outline-[1.5px] outline-offset-[-1px] outline-neutral-500/40 justify-center items-center cursor-pointer">
                    <img src={button} alt="img" />
                </button>

                {/* В */}
                <div className="flex flex-1 flex-col gap-6.5"> 
                    <p className="flex items-end justify-between text-[18px] font-semibold">
                        <span>В</span>
                        <button className="p-2.5 bg-white rounded-[10px] outline-[1.5px] outline-offset-[-1px] outline-neutral-500/40 cursor-pointer">
                            <img src={change} alt="img" />
                        </button>
                    </p>

                    <div className="flex items-center h-[95px] px-4 bg-gray-200/50 rounded-2xl outline-[1.5px] outline-neutral-500/40">
                            <input 
                                type="text" 
                                placeholder="Итоговое значение" 
                                className="flex-3 rounded-2xl outline-none text-[26px] font-semibold placeholder:font-[500] placeholder:text-[20px]"
                                readOnly
                            />
                            <select className="flex-1 outline-none text-[16px] font-medium cursor-pointer">
                                <option>Километр (km)</option>
                                <option>Метр (m)</option>
                            </select>
                    </div>
                </div>

            </div>

            {/* Информация */}
            <div className="flex h-18 px-4 gap-2.5 items-center bg-[#F1F2FB] rounded-2xl">
                <Info className="stroke-[#5885EA]"/>
                <span>1 километр (km) = 1000 метров (m)</span>
            </div>

            {/* Категории */}
            <div className="flex flex-col gap-4">
                <p className="text-[18px] font-bold">Категории</p>
                <div className="flex gap-4">
                    {categories.map(obj => (
                        <div className="flex w-full px-8 py-5.5 bg-[#ECECEC]/25 rounded-[10px] text-[16px] font-medium outline-[1.5px] outline-neutral-500/40 justify-center items-center gap-2">
                            <img 
                                src={obj.img} 
                                alt="img" 
                                className="w-7.5 h-7.5"
                            />
                            <p className="whitespace-nowrap select-none">{obj.title}</p>
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
                    <div className="flex w-full px-4 py-3 bg-white/40 rounded-[10px] shadow-[0px_1px_5px_0px_rgba(0,0,0,0.25)] justify-center items-center gap-2">
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