import USA from "../assets/flags/USA.svg"
import Eur from "../assets/flags/European Union.svg"
import Russia from "../assets/flags/Russia.svg"
import Kazakhstan from "../assets/flags/Kazakhstan.svg"
import Britan from "../assets/flags/Britan.svg"
import Japan from "../assets/flags/Japan.svg"
import Argentina from "../assets/flags/Argentina.svg"
import Czech from "../assets/flags/Czech Republic.svg"

export type Currency = {
    value: string
    label: string  
    img: string
}

export const currencies: Currency[] = [
    { value: "USD", label: "Доллар США", img: USA },
    { value: "EUR", label: "Евро", img: Eur },
    { value: "RUB", label: "Российский рубль", img: Russia },
    { value: "KZT", label: "Казахстанский тенге", img: Kazakhstan },
    { value: "GBP", label: "Фунт стерлингов", img: Britan },
    { value: "JPY", label: "Японская иена", img: Japan },
    { value: "ARS", label: "Аргентинское песо", img: Argentina },
    { value: "CZK", label: "Чешская крона", img: Czech },
]