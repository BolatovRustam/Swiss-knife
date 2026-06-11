import plus from "../assets/icons/plus.svg"
import list from "../assets/icons/list.svg"
import delet from "../assets/icons/delete.svg"
import checkboxOn from "../assets/icons/checkbox-on.svg"
import checkboxOff from "../assets/icons/checkbox-off.svg"
import todoImg from "../assets/png/todoPngButton.png"
import cross from "../assets/icons/cross.svg"
import calendar from "../assets/icons/calendar.svg"


const data = [
    {id: crypto.randomUUID(), title: "Подготовить презентацию", priority: "Высокий", date: "24.05.2024"},
    {id: crypto.randomUUID(), title: "Сделать покупку", priority: "Средний", date: "24.05.2024"},
    {id: crypto.randomUUID(), title: "Отремонтировать", priority: "Низкий", date: "24.05.2024"},
    {id: crypto.randomUUID(), title: "Сходить за покупками", priority: "Низкий", date: "24.05.2024"},
    {id: crypto.randomUUID(), title: "Сходить за покупками", priority: "Низкий", date: "24.05.2024"},
    
    
]

function Todo_List() {
    return (
        <div className="flex flex-col pt-12.75 px-21.5">

            {/* Верхняя часть */}
            <div className="flex flex-col gap-7">

                {/* Инпут + селект + кнопка */}
                <div className="flex w-full gap-7">
                        <input 
                            className="flex-10 h-15 px-4 bg-white rounded-2xl shadow-[0px_4px_10px_1px_rgba(0,0,0,0.25)] outline outline-1 outline-neutral-500/40 placeholder-stone-300 text-xl" 
                            type="text" 
                            placeholder="Новая задача..." 
                        />

                        <select className="h-15 px-4 bg-white rounded-2xl shadow-[0px_4px_10px_1px_rgba(0,0,0,0.25)] outline outline-1 outline-neutral-500/40 text-xl flex-1 cursor-pointer">
                            <option value="high">Высокий</option>
                            <option value="medium">Средний</option>
                            <option value="low">Низкий</option>
                        </select>

                    
                    <button 
                        className="h-15 px-10 rounded-lg flex items-center gap-5 text-white text-xl font-semibold cursor-pointer"
                        style={{ backgroundImage: `url(${todoImg})` }}
                    >
                        <span>Добавить</span>
                        <img className="w-6 h-6 invert"src={plus} alt="img" />
                    </button>
                </div>

                {/* Фильтры */}
                <div className="h-10 flex gap-5 text-[18px]">
                    <button 
                        className="flex items-center h-full px-6 gap-2.5 rounded-lg text-white"
                        style={{ backgroundImage: `url(${todoImg})` }}
                    >
                        <img className="invert" src={list} alt="img" />
                        Все
                    </button>
                    <button className="flex items-center h-full px-6 gap-2.5 rounded-lg bg-white/40 text-[#4C4C4C] outline outline-1 outline-neutral-500/40">
                        <img src={checkboxOff} alt="img" />
                        Активные
                    </button>
                    <button className="flex items-center h-full px-6 gap-2.5 rounded-lg bg-white/40 text-[#4C4C4C] outline outline-1 outline-neutral-500/40">
                        <img src={checkboxOn} alt="img" />
                        Выполненные
                    </button>
                </div>

                {/* Список задач */}
                <div className="flex flex-1 shadow-[0px_4px_10px_1px_rgba(0,0,0,0.25)] rounded-2xl outline outline-neutral-500/40 overflow-hidden">
                    <table className="w-full bg-white border-collapse">
                        <tbody>
                            {data.map((obj, i)=> (
                                <tr 
                                    key={obj.id}
                                    className={`[&>td]:px-9 [&>td]:py-6 text-neutral-700 text-xl ${i !== data.length - 1 ? 'border-b border-neutral-500/40' : ''}`}
                                >
                                    <td >
                                        <div className="flex gap-3 items-center">
                                            <input type="checkbox" className="cursor-pointer w-5 h-5" />
                                            {obj.title}
                                        </div>
                                    </td>

                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full shrink-0 ${
                                                obj.priority === "Высокий" ? "bg-[#FE3D3D]" :
                                                obj.priority === "Средний" ? "bg-[#FE960A]" :
                                                "bg-[#04B214]"
                                            }`}></div>
                                            {obj.priority}
                                        </div>
                                    </td>

                                    <td >
                                        <div className="flex gap-3">
                                            <img src={calendar} alt="img" />
                                            {obj.date}
                                        </div>
                                    </td>

                                    <td>
                                        <img src={cross} alt="img" />
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* Нижняя панель */}
            <div className="flex mt-22 w-full h-15 justify-between">

                <div className="flex h-full px-8 items-center gap-9 bg-[#EFF4EF] outline outline-1 outline-[#C3D9C3] rounded-2xl">
                    <img src={list} alt="img" />

                    <p className="flex gap-8 text-[20px] text-[#385538]">
                        <p>Всего: <span className="font-bold text-black">6</span></p>
                        <p>Активных: <span className="font-bold text-black">5</span></p>
                        <p>Выполненных: <span className="font-bold text-black">1</span></p>
                    </p>
                </div>

                <div className="flex h-full px-8 items-center gap-5 bg-[#FDEDE8] text-[#8E381D] text-[20px] font-semibold outline outline-1 outline-[#E3CAC2] rounded-2xl cursor-pointer">
                    <img src={delet} alt="img" />
                    <p>Очистить выделенные</p>
                </div>
            </div>
        </div>
    )
}

export default Todo_List