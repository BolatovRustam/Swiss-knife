import change from "../assets/icons/change.svg"
import button from "../assets/icons/change button.svg"
import Info from "../assets/icons/info.svg?react"
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
        <div className="flex flex-col px-8 py-7 gap-6.5 bg-white rounded-2xl shadow-[0px_1px_9px_0px_rgba(0,0,0,0.25)]">
        
             {/* Инпуты и кнопка */}
            <div className="flex items-end">

                {/* Из */}
                <div className="flex flex-1 flex-col gap-6.5">
                    <p className="text-[18px] font-semibold">Из</p>
                    <div className="flex flex-col gap-3">
                            <input 
                                type="number" 
                                placeholder="Введите значение" 
                                className="w-full h-[95px] px-4 text-[26px] outline-[1.5px] rounded-2xl  outline-neutral-500/40 font-semibold placeholder:font-medium placeholder:text-[20px] focus-within:outline-2 focus-within:outline-indigo-400 focus-within:shadow-[0px_1px_8px_0px_rgba(123,123,246,0.80)]"  
                                maxLength={10}  
                            />

                            <input 
                                type="text" 
                                placeholder="SELECT" 
                                className="h-[95px] px-4 text-[26px] bg-gray-200/50 outline-[1.5px] outline-neutral-500/40 rounded-2xl font-semibold placeholder:font-medium placeholder:text-[20px]"
                                readOnly
                            />
                    </div>
                </div>

                {/* Кнопка посередине */}
                <button className="h-11 mx-7.5 mb-20 p-2.5 shrink-0 bg-white rounded-[10px] outline-[1.5px] outline-offset-[-1px] outline-neutral-500/40 justify-center items-center cursor-pointer">
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

                    <div className="flex flex-col gap-3">
                        <input 
                            type="text" 
                            placeholder="Результат" 
                            className="h-[95px] px-4 text-[26px] bg-gray-200/50 outline-[1.5px] outline-neutral-500/40 rounded-2xl font-semibold placeholder:font-medium placeholder:text-[20px]"
                            readOnly
                        />

                        <input 
                            type="text" 
                            placeholder="SELECT" 
                            className="h-[95px] px-4 text-[26px] bg-gray-200/50 outline-[1.5px] outline-neutral-500/40 rounded-2xl font-semibold placeholder:font-medium placeholder:text-[20px]"
                            readOnly
                        />
                    </div>
                </div>

            </div>

            {/* Информация */}
            <p className="flex gap-3 font-medium">
                <Info />
                <span>1 USD = 0,9236 EUR</span>
            </p>

        </div>

        {/* Блок с популярными преобразованиями */}
        <div className="flex flex-2 flex-col gap-4.5">
            <p className="text-[18px] font-bold">Популярные пары</p>
            <div className="flex gap-4">
                 {popular_conversions.map( obj => (
                    <div className="flex w-full px-4 py-5.5 bg-white/40 rounded-[10px] shadow-[0px_1px_5px_0px_rgba(0,0,0,0.25)] transition hover:-translate-y-2.5 active:translate-y-0 font-medium justify-center items-center gap-2">
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