import { useEffect, useState } from "react"
import { useAuthStore } from "../store/authStore"
import { supabase } from "../lib/supabase"
import type { Task } from "./types"
import { options } from "./constants"
import Select from "../components/Select"
import { Loader2 } from "lucide-react"

import { CheckboxOff, CheckboxOn, Delete, List, RectangleCheckboxOn, 
            RectangleCheckboxOff, plus, cross, calendar } from "@/assets/icons"



function Todo_List() {
    const { session } = useAuthStore()
    const [data, setData] = useState<Task[]>([])
    const [currentData, setCurrentData] = useState({title: "", priority: "Низкий"})
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
    const [loading, setLoading] = useState(true)

    useEffect(() =>{
        const fetchTodos = async () => {
            const { data: todos, error } = await supabase
                .from('todo-list')
                .select('*')
                .order('created_at', { ascending: true })

            if (error) console.error('Ошибка загрузки', error)
            else setData(todos as Task[])
            setLoading(false)
        }

        fetchTodos()
    }, [])

    const filtetedData = data.filter(el => {
        if (filter === "active") return !el.completed
        if (filter === "completed") return el.completed
        return true
    })

    const handleCreate  = async () => {
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

        setData(prev => [...prev, tempTask])
        setCurrentData({ ...currentData, title: "" })

        const { data: newTask, error } = await supabase
            .from('todo-list')
            .insert({
                title: currentData.title,
                priority: currentData.priority,
                completed: false,
                date: today,
                user_id: session.user.id
            })
            .select()
            .single()

            if (error) {
                console.error('Ошибка создания', error)
                setData( prev => prev.filter( t => t.id !== tempTask.id ) )
                return
            }

        setData(prev => prev.map( t => t.id === tempTask.id ? newTask : t ))
    }

    const handleDelete = async (id:string) => {
        const deletedTask = data.find(el => el.id === id)
        if (!deletedTask) return

        setData(data.filter(el => el.id !== id))
        

        const { error } = await supabase
            .from('todo-list')
            .delete()
            .eq('id', id)

        if ( error ) {
            console.error('Ошибка удаления', error)
            setData(prev => [...prev, deletedTask])
        }
    }

    const handleAllDelete = async () => {
        if (!session) return
        const prevData = data
        setData([])


        const { error } = await supabase
            .from('todo-list')
            .delete()
            .eq('user_id', session.user.id)

        if (error) {
            console.error('Ошибка очситки', error)
            setData(prevData)
        }
    }

    const handleCompleted = async (id:string) => {
        const task = data?.find(el => el.id === id)
        if (!task) return

        setData(prev => prev.map(el => el.id === id ? {...el, completed: !el.completed}: el ))

        const { error } = await supabase
            .from('todo-list')
            .update({ completed: !task.completed })
            .eq('id', id)

        if (error) {
            console.error('Ошибка обновления', error)
            setData(prev => prev.map(el => el.id === id ? {...el, completed: !el.completed}: el ))
        }
    }


    return (
        <div className="flex justify-between h-full flex-col pt-12.5 pb-12 px-21.5">

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
                        className="h-15 px-10 rounded-lg flex items-center gap-5 transition hover:brightness-110 active:brightness-85 text-white text-xl font-semibold cursor-pointer gradient-btn-green"
                        onClick={handleCreate}
                    >
                        <span>Добавить</span>
                        <img className="w-6 h-6 invert"src={plus} alt="img" />
                    </button>
                </div>

                {/* Фильтры */}
                <div className="h-10 flex gap-5 text-[18px]">
                    <button 
                        className={`
                            flex items-center h-full px-6 gap-2.5 rounded-lg cursor-pointer transition 
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
                            flex items-center h-full px-6 gap-2.5 rounded-lg cursor-pointer transition 
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
                            flex items-center h-full px-6 gap-2.5 rounded-lg cursor-pointer transition 
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
                    filtetedData.length > 0 && <div className="flex flex-1 shadow-[0px_4px_10px_1px_rgba(0,0,0,0.25)] rounded-2xl outline outline-neutral-500/40 overflow-auto max-h-115.5">
                        <table className="w-full bg-white border-collapse overflow-scroll transform ">
                            <tbody>
                                {filtetedData.map((obj, i)=> (
                                    <tr 
                                        key={obj.id}
                                        className={`
                                            [&>td:not(:last-child)]:px-9 [&>td]:py-6 text-neutral-700 text-xl 
                                            ${i !== data.length - 1 ? 'border-b border-neutral-500/40' : ''}
                                            ${ obj.isTemp && "animate-fade-slide-in"}
                                            `}
                                    >
                                        <td>
                                            <div className={`flex gap-3 items-center ${obj.completed && "line-through"}`}>
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
                    </div> 
                }

            </div>

            {/* Нижняя панель */}
            <div className="flex w-full h-15 justify-between">

                <div className="flex h-full px-8 items-center gap-6 bg-[#EFF4EF] outline-1 outline-[#C3D9C3] rounded-2xl">
                    <List className="text-[#5F915F]"/>

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
                    <Delete className="fill-[#8E381D]" />
                    <p>Очистить список</p>
                </button>
            </div>
        </div>
    )
}

export default Todo_List