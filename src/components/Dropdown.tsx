    import { useEffect, useRef, useState } from "react";
    import { down } from "@/assets/icons"

    type Option = {
        value: string
        label: string
    }

    type DropdownProps = {
        value: Option
        onChange: (value: string) => void 
        options: readonly  Option[]

        buttonClassName?: string
        menuClassName?: string
        optionClassName?: string
    }


    function Dropdown ( { value, onChange, options, buttonClassName, menuClassName, optionClassName } : DropdownProps ) {
        const [open, setOpen] = useState(false)
        const [lastHovered, setLastHovered] = useState<string | null>(null)

        const ref = useRef<HTMLDivElement>(null)

        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {

                if (ref.current && !ref.current.contains(e.target as Node)) {
                    setOpen(false)
                }
            }

            document.addEventListener("mousedown", handleClickOutside)
            return () => document.removeEventListener("mousedown", handleClickOutside)
        }, [])

        return (
            <div className="relative" ref={ref}>
                <button
                onClick={() => {setOpen(!open); setLastHovered(null)}}
                className={`${buttonClassName}`}
                >
                    <span>{`${value.label}`}</span>
                    <img src={down} alt="▾" className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
            

            {open && (
                <div
                className={`${menuClassName}`}
                >
                {options.map(el => (
                    <div
                        key={el.value}
                        onClick={() => { onChange(el.value); setOpen(false)}}
                        onMouseEnter={() => setLastHovered(el.value)}
                        className={`${(lastHovered ? lastHovered === el.value : value.value === el.value) ? "bg-[#767676] text-white" : ""} ${optionClassName}`}
                    >
                        {`${el.label}`}
                    </div>
                ))}
                </div>
            )}

            </div>
            
        )
    }


export default Dropdown