import { useState } from "react"
import down from "../assets/icons/down.svg"

const options = [
    {value: "Высокий", label: "Высокий"},
    {value: "Средний", label: "Средний"},
    {value: "Низкий", label: "Низкий"},
]

type SelectProps = {
    value: string
    onChange: (value: string) => void
}

function Select ({value, onChange}:SelectProps) {
    const [open, setOpen] = useState(false)

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="h-15 px-4 bg-white rounded-2xl shadow-[0px_4px_10px_1px_rgba(0,0,0,0.25)] outline-1 outline-neutral-500/40 text-xl flex items-center gap-3 w-38 cursor-pointer"
            >
                <span className="flex-1 text-left">{value}</span>
                <img src={down} alt="▾" className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full transi bg-white rounded-2xl shadow-[0px_4px_10px_2px_rgba(0,0,0,0.25)] outline-1 outline-neutral-500/40 overflow-hidden z-10">
                    {options.map(opt => (
                        <div
                            key={opt.value}
                            onClick={() => { onChange(opt.value); setOpen(false) }}
                            className={`px-4 py-3 text-xl cursor-pointer hover:bg-gray-100 ${value === opt.value ? 'bg-gray-100 font-medium' : ''}`}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Select