import length from "../../assets/icons/length.svg"
import weight from "../../assets/icons/weigth.svg"
import temperature from "../../assets/icons/temperature.svg"
import volume from "../../assets/icons/volume.svg"
import square from "../../assets/icons/square.svg"
import speed from "../../assets/icons/speed.svg"
import pressure from "../../assets/icons/pressure.svg"
import time from "../../assets/icons/time.svg"

export const categories = [
    { img: length, title: "Длина" },
    { img: weight, title: "Масса" },
    { img: temperature, title: "Температура" },
    { img: volume, title: "Объём" },
    { img: square, title: "Площадь" },
    { img: speed, title: "Скорость" },
    { img: pressure, title: "Давление" },
    { img: time, title: "Время" },
]

export const popular_conversions = [
    { img: length, title: "Км → М", category: "Длина", from: "km", to: "m"  },
    { img: weight, title: "Килограмм → Грамм", category: "Масса",  from: "kg", to: "g" },
    { img: temperature, title: "°C → °F", category: "Температура", from: "c", to: "f" },
    { img: speed, title: "км/ч → м/с", category: "Скорость", from: "kmh", to: "ms" },
    { img: volume, title: "Литр → Миллилитр", category: "Объём", from: "l", to: "ml" },
    { img: time, title: "Час → Минута", category: "Время", from: "h", to: "min" },
    { img: square, title: "м² → км²", category: "Площадь", from: "m2", to: "km2" },
]