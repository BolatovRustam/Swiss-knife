import { useState } from "react"
import { useAuthStore } from "../store/authStore"
import type { Task } from "./types"
import { options } from "./constants"
import Select from "../components/Select"
import { Loader2 } from "lucide-react"

import { CheckboxOff, CheckboxOn, Delete, List, RectangleCheckboxOn, 
            RectangleCheckboxOff, Cross, plus, calendar } from "@/assets/icons"
import { useSupabaseHistory } from "@/hooks/useSupabaseHistory"



function Todo_List() {
    const { session } = useAuthStore()
    const [currentData, setCurrentData] = useState({title: "", priority: "Низкий"})
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

    const { data, addEntry, clearAll,loading, removeEntry, updateEntry  } = useSupabaseHistory<Task>('todo-list', session?.user.id)


    const filtetedData = data.filter(el => {
        if (filter === "active") return !el.completed
        if (filter === "completed") return el.completed
        return true
    })

    const handleCreate  = () => {
        if (!currentData.title.trim() || !session) return

        const today = new Date().toLocaleDateString('ru-RU')

        const tempTask: Task = {
            id: crypto.randomUUID(),
            user_id: session.user?.id,
            title: currentData.title,
            priority: currentData.priority,
            completed: false,
            date: today,
            isTemp: true
        }

        setCurrentData({ ...currentData, title: "" })

        addEntry( tempTask, { title: currentData.title, priority: currentData.priority, completed: false, date: today, user_id: session.user.id } )
    }

    const handleDelete = (id:string) => {
        removeEntry(id)
    }

    const handleAllDelete = () => {
        clearAll()
    }

    const handleCompleted = (id:string) => {
        const task = data?.find(el => el.id === id)
        if (!task) return

        updateEntry(id, { completed: !task.completed })
    }


    return (
        <div className="flex justify-between h-full flex-col pt-9.5 lg:pt-12.5 pb-12 px-6.5 md:px-12 lg:px-21.5">

            {/* Верхняя часть */}
            <div className="flex flex-col gap-4 md:gap-5 lg:gap-7">

                {/* Инпут + селект + кнопка */}
                <div className="flex flex-col lg:flex-row w-full gap-3 lg:gap-7">
                        <input 
                            className="w-full lg:flex-10 h-12 md:h-13 lg:h-15 px-4 bg-white rounded-2xl shadow-[0px_4px_10px_1px_rgba(0,0,0,0.25)] outline-1 outline-neutral-500/40 placeholder-stone-300 text-base md:text-lg lg:text-xl" 
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
                        className="w-full lg:w-auto h-12 md:h-13 lg:h-15 px-6 lg:px-10 rounded-lg flex items-center justify-center gap-3 lg:gap-5 transition hover:brightness-110 active:brightness-85 text-white text-base md:text-lg lg:text-xl font-semibold cursor-pointer gradient-btn-green"
                        onClick={handleCreate}
                    >
                        <span>Добавить</span>
                        <img className="w-5 h-5 md:w-6 md:h-6 invert"src={plus} alt="img" />
                    </button>
                </div>

                {/* Фильтры */}
                <div className="h-9 md:h-9 lg:h-10 flex gap-2 md:gap-3 lg:gap-5 text-xs md:text-sm lg:text-[18px]">
                    <button 
                        className={`
                            flex-1 lg:flex-none flex items-center justify-center lg:justify-start h-full px-2 md:px-4 lg:px-6 gap-1.5 md:gap-2 lg:gap-2.5 rounded-lg cursor-pointer transition 
                            ${filter=== "all" 
                                ? "text-white gradient-btn-green" 
                                : "bg-white/40 hover:bg-white text-[#4C4C4C] outline-1 outline-neutral-500/40"} 
                        `}
                        onClick={() => setFilter("all")}
                    >
                        <List className={filter==="all" ?"text-white" : "text-[#4C4C4C]"} />
                        Все
                    </button>
                    <button 
                        className={`
                            flex-1 lg:flex-none flex items-center justify-center lg:justify-start h-full px-2 md:px-4 lg:px-6 gap-1.5 md:gap-2 lg:gap-2.5 rounded-lg cursor-pointer transition 
                            ${filter=== "active" 
                                ? "text-white gradient-btn-green" 
                                : "bg-white/40 hover:bg-white text-[#4C4C4C] outline-1 outline-neutral-500/40"}
                        `}
                        onClick={() => setFilter("active")}
                    >
                        <CheckboxOff className={filter==="active" ?"text-white" : "text-[#4C4C4C]"} />
                        Активные
                    </button>
                    <button 
                        className={`
                            flex-1 lg:flex-none flex items-center justify-center lg:justify-start h-full px-2 md:px-4 lg:px-6 gap-1.5 md:gap-2 lg:gap-2.5 rounded-lg cursor-pointer transition  
                            ${filter=== "completed" 
                                ? "text-white gradient-btn-green" 
                                : "bg-white/40 hover:bg-white text-[#4C4C4C] outline-1 outline-neutral-500/40"}
                        `}
                        onClick={() => setFilter("completed")}
                    >
                        <CheckboxOn className={filter==="completed" ?"text-white" : "text-[#4C4C4C]"} />
                        Выполненные
                    </button>
                </div>

                {/* Список задач */}
                { loading ? (
                    <div className="flex items-center justify-center h-20">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) :  
                    filtetedData.length > 0 && <div className="flex flex-1 shadow-[0px_4px_10px_1px_rgba(0,0,0,0.25)] rounded-2xl outline outline-neutral-500/40 overflow-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
                        <table className="w-full bg-white border-collapse overflow-scroll transform ">
                            <tbody>
                                {filtetedData.map((obj, i)=> (
                                    <tr 
                                        key={obj.id}
                                        className={`
                                            [&>td:not(:last-child)]:px-9 [&>td]:py-6 text-xl 
                                            ${i !== data.length - 1 ? 'border-b border-neutral-500/40' : ''}
                                            ${ obj.isTemp && "animate-fade-slide-in"}
                                             ${obj.completed ? "bg-neutral-200 text-neutral-500" : "text-neutral-700"}
                                            `}
                                    >
                                        <td>
                                            <div className={`flex gap-3 items-center `}>
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
                                                <Cross 
                                                    width={26}
                                                    height={26}
                                                    className="text-[#404040]"
                                                />
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div> 
                }

            </div>

            {/* Нижняя панель */}
            <div className="flex flex-col md:flex-row w-full gap-3 md:gap-4 lg:gap-0 md:h-13 lg:h-15 md:justify-between">

                <div className="flex h-11 md:h-full px-4 md:px-6 lg:px-8 items-center gap-3 md:gap-4 lg:gap-6 bg-[#EFF4EF] outline-1 outline-[#C3D9C3] rounded-2xl overflow-x-auto">
                    <List className="text-[#5F915F]"/>

                    <p className="flex gap-3 md:gap-4 lg:gap-5 text-xs md:text-sm lg:text-[20px] text-[#385538] whitespace-nowrap">
                        <p>Всего: <span className="font-bold text-black">{data.length}</span></p>
                        <p>Активных: <span className="font-bold text-black">{data.filter(el=> !el.completed).length}</span></p>
                        <p>Выполненных: <span className="font-bold text-black">{data.filter(el=> el.completed).length}</span></p>
                    </p>
                </div>

                <button 
                    className="flex h-11 md:h-full px-4 md:px-6 lg:px-8 items-center justify-center gap-3 lg:gap-5 transition bg-[#FDEDE8] hover:bg-[#FFF2EE] active:bg-[#FFD8CC] active:outline-[#8E381D] text-[#8E381D] text-xs md:text-sm lg:text-[20px] font-semibold outline-1 outline-[#E3CAC2] rounded-2xl cursor-pointer"
                    onClick={handleAllDelete}
                >
                    <Delete className="fill-[#8E381D] w-4 h-4 md:w-5 md:h-5" />
                    <p>Очистить список</p>
                </button>
            </div>
        </div>
    )
}

export default Todo_List