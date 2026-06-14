import length from "../assets/icons/length.svg"
import weight from "../assets/icons/weigth.svg"
import temperature from "../assets/icons/temperature.svg"
import volume from "../assets/icons/volume.svg"
import square from "../assets/icons/square.svg"
import speed from "../assets/icons/speed.svg"
import pressure from "../assets/icons/pressure.svg"
import time from "../assets/icons/time.svg"


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
    <div className="flex justify-between h-full flex-col pt-12.75 pb-12.25 px-21.5 gap-13"> 

        {/* Верхеяя часть */}
        <div className="flex flex-4 px-8 py-7 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)] flex-col justify-center items-center">

        </div>

        {/* Блок с популярными преобразованиями */}
        <div className="flex-2 gap-4.5">
            <p className="text-[18px] font-bold">Популярные преобразования</p>
            <div className="flex">

            </div>
        </div>


        {/* История конверсии */}
        <div className="flex flex-1 px-8 pt-3 pb-1 bg-white rounded-2xl shadow-[0px_1px_6.599999904632568px_0px_rgba(0,0,0,0.25)] flex-col justify-center items-center">

        </div>
    </div>
    )
}

export default Unit_Converter