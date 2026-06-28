import type { Option } from "../components/Select"

export const options: Option[] = [
    {value: "Высокий", label: "Высокий"},
    {value: "Средний", label: "Средний"},
    {value: "Низкий", label: "Низкий"},
]

export const defaultTasks = [
        {id: crypto.randomUUID(), completed: false, title: "Подготовить презентацию", priority: "Высокий", date: "24.05.2024"},
        {id: crypto.randomUUID(), completed: true, title: "Сделать покупку", priority: "Средний", date: "24.05.2024"},
        {id: crypto.randomUUID(), completed: false, title: "Отремонтировать", priority: "Низкий", date: "24.05.2024"},
]