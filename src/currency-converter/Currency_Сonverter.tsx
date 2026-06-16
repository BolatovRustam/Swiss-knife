import Argentina from "../assets/flags/Argentina.svg"
import Britan from "../assets/flags/Britan.svg"
import Czech from "../assets/flags/Czech Republic.svg"
import Eur from "../assets/flags/European Union.svg"
import France from "../assets/flags/France.svg"
import Japan from "../assets/flags/Japan.svg"
import Kazakhstan from "../assets/flags/Kazakhstan.svg"
import Germany from "../assets/flags/Germany.svg"
import Russia from "../assets/flags/Russia.svg"
import USA from "../assets/flags/USA.svg"

const popular_conversions = [
    { country1:USA, country2:Eur, length, title: "USD / EUR" },
    { country1:USA, country2:Russia, title: "USD / RUB" },
    { country1:Russia, country2:Kazakhstan, title: "RUB / KAZ" },
    { country1:Eur, country2:USA, title: "EUR / USD" },
    { country1:USA, country2:Kazakhstan, title: "USD / KAZ" },
    { country1:Britan, country2:Eur, title: "GBP / EUR" },
    { country1:Kazakhstan, country2:Britan, title: "KAZ / GBP" },
]

function Currency_Converter () {
    return (
    <div className="flex justify-between h-full flex-col pt-12.75 pb-12.25 px-21.5 gap-13"> 

        {/* Верхеяя часть */}
        <div className="flex flex-4 px-8 py-7 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)] flex-col justify-center items-center">

        </div>

        {/* Блок с популярными преобразованиями */}
        <div className="flex flex-2 flex-col gap-4.5">
            <p className="text-[18px] font-bold">Популярные пары</p>
            <div className="flex gap-4">
                 {popular_conversions.map( obj => (
                    <div className="flex w-full px-4 py-5.5 bg-white/40 rounded-[10px] shadow-[0px_1px_5px_0px_rgba(0,0,0,0.25)] font-medium justify-center items-center gap-2">
                        <div className="flex gap-2">
                            <img src={obj.country1} alt="img" className="h-6 w-6" />
                            <img src={obj.country2} alt="img" className="h-6 w-6" />
                        </div>
                        <p className="whitespace-nowrap select-none">{obj.title}</p>
                    </div>
                ))}
            </div>
        </div>


        {/* История конверсии */}
        <div className="flex flex-1 px-8 pt-3 pb-1 bg-white rounded-2xl shadow-[0px_1px_6.599999904632568px_0px_rgba(0,0,0,0.25)] flex-col justify-center items-center">

        </div>
    </div>
    )
}

export default Currency_Converter