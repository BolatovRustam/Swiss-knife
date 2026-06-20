import { useState } from "react"
import down from "../assets/icons/down.svg"

export type Option = {
    value: string
    label: string
    img?: string
}

type SelectProps = {
    value: Option
    onChange: (value: Option) => void
    options: Option[] 

    renderButton?: (option: Option) => React.ReactNode
    renderOption?: (option: Option) => React.ReactNode
    buttonClassName?: string
    menuClassName?: string
    optionClassName?: string
}

function Select ({value, onChange, options, renderButton, renderOption, buttonClassName, menuClassName, optionClassName}:SelectProps) {
    const [open, setOpen] = useState(false)

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={`
                    h-15 px-4 bg-white rounded-2xl shadow-[0px_4px_10px_1px_rgba(0,0,0,0.25)] 
                    outline-1 outline-neutral-500/40 text-xl flex items-center gap-3 w-38 cursor-pointer
                    ${buttonClassName ?? ""}
                    `}
            >
                <span className="flex-1 text-left">
                    {renderButton ? renderButton(value) : value.label}
                </span>
                <img src={down} alt="▾" className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className={`
                    max-h-63.5 overflow-y-auto
                    absolute top-[calc(100%+8px)] left-0 w-full transi 
                    bg-white rounded-2xl shadow-[0px_4px_10px_2px_rgba(0,0,0,0.25)] 
                    outline-1 outline-neutral-500/40 overflow-hidden z-10
                    ${menuClassName ?? ""}
                    `}>
                    {options.map(opt => (
                        <div
                            key={opt.value}
                            onClick={() => { onChange(opt); setOpen(false) }}
                            className={`
                                px-4 py-3 text-xl cursor-pointer hover:bg-gray-100 
                                ${value.value === opt.value ? 'bg-gray-100 font-medium' : ''}
                                ${optionClassName ?? ""}
                                `}
                        >
                            {renderOption ? renderOption(opt) : opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Select