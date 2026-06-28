import { unitCategories, type CategoryName } from "../unit-converter/data/units"

function convertTemperature(value: number, from: string, to:string): number {

    let celsius:number
    if (from === "c") celsius = value
    else if (from === "f") celsius = (value - 32) * 5 / 9
    else return celsius = value - 273.15
    
    if (to === "c") return celsius
    else if (to === "f") return celsius * 9 / 5 + 32
    else return celsius + 273.15
}

export function convertor (
    value: number,
    from: string,
    to: string,
    category: CategoryName
): number {
    if (from === to) return value

    if (category === "Температура") {
        return convertTemperature(value, from, to)
    }

    const units = unitCategories[category]
    const fromUnit = units.find( u => u.value === from )
    const toUnit = units.find(u => u.value === to)

    if(!fromUnit || !toUnit) return 0

    return (value * fromUnit.toBase) / toUnit.toBase
}

