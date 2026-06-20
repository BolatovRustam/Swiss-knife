import plus from "../assets/icons/plus.svg"
import delet from "../assets/icons/delete.svg"
import todoImg from "../assets/png/todoPngButton.png"
import cross from "../assets/icons/cross.svg"
import calendar from "../assets/icons/calendar.svg"
import Select, { type Option } from "../components/Select"
import { useState } from "react"
import CheckboxOn from "../assets/icons/checkbox-on.svg?react"
import CheckboxOff from "../assets/icons/checkbox-off.svg?react"
import List from "../assets/icons/list.svg?react"
import RectangleCheckboxOn from "../assets/icons/rectangle_checkbox-on.svg?react"
import RectangleCheckboxOff from "../assets/icons/rectangle_checkbox-off.svg?react"

type Task = {
    id: string,
    completed: boolean,
    title: string,
    priority: string,
    date: string
}

const options: Option[] = [
    {value: "Высокий", label: "Высокий"},
    {value: "Средний", label: "Средний"},
    {value: "Низкий", label: "Низкий"},
]


function Todo_List() {
    const [data, setData] = useState<Task[]>([
        {id: crypto.randomUUID(), completed: false, title: "Подготовить презентацию", priority: "Высокий", date: "24.05.2024"},
        {id: crypto.randomUUID(), completed: true, title: "Сделать покупку", priority: "Средний", date: "24.05.2024"},
        {id: crypto.randomUUID(), completed: false, title: "Отремонтировать", priority: "Низкий", date: "24.05.2024"},
    ])

    const [currentData, setCurrentData] = useState({title: "", priority: "Низкий"})
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

    const filtetedData = data.filter(el => {
        if (filter === "active") return !el.completed
        if (filter === "completed") return el.completed
        return true
    })

    const handleCreate  = () => {
        if (!currentData.title.trim()) {
            return
        }

        const today = new Date().toLocaleDateString('ru-RU')

        setData([...data, {...currentData, id: crypto.randomUUID(), completed: false ,date: today}])
        setCurrentData({ ...currentData, title: ""})
    }

    const handleDelete = (id:string) => {
        const newData = data.filter(el => el.id !== id)
        setData(newData)
    }

    const handleAllDelete = () => {
        return setData([])
    }

    const handleCompleted = (id:string) => {
        setData(data.map(el => el.id === id ? {...el, completed: !el.completed} : el))
    }


    return (
        <div className="flex justify-between h-full flex-col pt-12.75 pb-12 px-21.5">

            {/* Верхняя часть */}
            <div className="flex flex-col gap-7">

                {/* Инпут + селект + кнопка */}
                <div className="flex w-full gap-7">
                        <input 
                            className="flex-10 h-15 px-4 bg-white rounded-2xl shadow-[0px_4px_10px_1px_rgba(0,0,0,0.25)] outline-1 outline-neutral-500/40 placeholder-stone-300 text-xl" 
                            type="text" 
                            placeholder="Новая задача..." 
                            value={currentData.title}
                            onChange={(e) => {
                              if (e.target.value.length <= 30) {
                                setCurrentData({...currentData, title: e.target.value})
                                }
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        />

                        <Select 
                            value={ options.find(o => o.value === currentData.priority) ?? options[0]} 
                            options={options}
                            onChange={(val) => setCurrentData({...currentData, priority: val.value})}
                        />

                    <button 
                        className="h-15 px-10 rounded-lg flex items-center gap-5 transition hover:brightness-110 active:brightness-85 text-white text-xl font-semibold cursor-pointer"
                        /* Надо добавить через enter */
                        style={{ backgroundImage: `url(${todoImg})` }}
                        onClick={handleCreate}
                    >
                        <span>Добавить</span>
                        <img className="w-6 h-6 invert"src={plus} alt="img" />
                    </button>
                </div>

                {/* Фильтры */}
                <div className="h-10 flex gap-5 text-[18px]">
                    <button 
                        className={`flex items-center h-full px-6 gap-2.5 rounded-lg cursor-pointer transition ${filter=== "all" ? "text-white" : "bg-white/40 hover:bg-white text-[#4C4C4C] outline-1 outline-neutral-500/40"} `}
                        style={filter === "all" ? { backgroundImage: `url(${todoImg})`}: {}}
                        onClick={() => setFilter("all")}
                    >
                        <List className={filter==="all" ?"fill-" : "fill-[#4C4C4C]"} />
                        Все
                    </button>
                    <button 
                        className={`flex items-center h-full px-6 gap-2.5 rounded-lg cursor-pointer transition ${filter=== "active" ? "text-white" : "bg-white/40 hover:bg-white text-[#4C4C4C] outline-1 outline-neutral-500/40"}`}
                        style={filter === "active" ? { backgroundImage: `url(${todoImg})`}: {}}
                        onClick={() => setFilter("active")}
                    >
                        <CheckboxOff className={filter==="active" ?"stroke-white" : "stroke-[#4C4C4C]"} />
                        Активные
                    </button>
                    <button 
                        className={`flex items-center h-full px-6 gap-2.5 rounded-lg cursor-pointer transition ${filter=== "completed" ? "text-white" : "bg-white/40 hover:bg-white text-[#4C4C4C] outline-1 outline-neutral-500/40"}`}
                        style={filter === "completed" ? { backgroundImage: `url(${todoImg})`}: {}}
                        onClick={() => setFilter("completed")}
                    >
                        <CheckboxOn className={filter==="completed" ?"stroke-white" : "stroke-[#4C4C4C]"} />
                        Выполненные
                    </button>
                </div>

                {/* Список задач */}
                { filtetedData.length > 0 && <div className="flex flex-1 shadow-[0px_4px_10px_1px_rgba(0,0,0,0.25)] rounded-2xl outline outline-neutral-500/40 overflow-auto max-h-115.5">
                    <table className="w-full bg-white border-collapse overflow-scroll transform ">
                        <tbody>
                            {filtetedData.map((obj, i)=> (
                                <tr 
                                    key={obj.id}
                                    className={`[&>td:not(:last-child)]:px-9 [&>td]:py-6 animate-fade-slide-in text-neutral-700 text-xl ${i !== data.length - 1 ? 'border-b border-neutral-500/40' : ''}`}
                                >
                                    <td>
                                        <div className="flex gap-3 items-center">
                                            <div className="cursor-pointer relative" onClick={() => handleCompleted(obj.id)}>
                                                {
                                                    obj.completed 
                                                    ? <RectangleCheckboxOn />
                                                    : <RectangleCheckboxOff />
                                                }

                                            </div>
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

                                    <td className="px-2">
                                        <button 
                                            className="flex cursor-pointer "
                                            onClick={() => handleDelete(obj.id)}
                                        > 
                                            <img src={cross} alt="img" />
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> }

            </div>

            {/* Нижняя панель */}
            <div className="flex w-full h-15 justify-between">

                <div className="flex h-full px-8 items-center gap-6 bg-[#EFF4EF] outline-1 outline-[#C3D9C3] rounded-2xl">
                    <List className="fill-amber-600"/>

                    <p className="flex gap-5 text-[20px] text-[#385538]">
                        <p>Всего: <span className="font-bold text-black">{data.length}</span></p>
                        <p>Активных: <span className="font-bold text-black">{data.filter(el=> !el.completed).length}</span></p>
                        <p>Выполненных: <span className="font-bold text-black">{data.filter(el=> el.completed).length}</span></p>
                    </p>
                </div>

                <button 
                    className="flex h-full px-8 items-center gap-5 transition bg-[#FDEDE8] hover:bg-[#FFF2EE] active:bg-[#FFD8CC] active:outline-[#8E381D] text-[#8E381D] text-[20px] font-semibold outline-1 outline-[#E3CAC2] rounded-2xl cursor-pointer"
                    onClick={handleAllDelete}
                >
                    <img src={delet} alt="img" />
                    <p>Очистить список</p>
                </button>
            </div>
        </div>
    )
}

export default Todo_List