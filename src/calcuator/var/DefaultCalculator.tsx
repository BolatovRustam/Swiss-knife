import { useState } from "react"
import { evaluate } from "mathjs"

const buttons = [
        {label: "MC", bg: "bg-[#ADD8E6]", text: "text-[28px]", span: "h-12"},
        {label: "MR", bg: "bg-[#ADD8E6]", text: "text-[28px]", span: "h-12"},
        {label: "M-", bg: "bg-[#ADD8E6]", text: "text-[28px]", span: "h-12"},
        {label: "M+", bg: "bg-[#ADD8E6]", text: "text-[28px]", span: "h-12"},
        {label: "√", bg: "bg-[#ADD8E6]", text: "text-[28px]", span: "h-12"},
        {label: "Xʸ", bg: "bg-[#ADD8E6]", text: "text-[28px]", span: "h-12"},
        {label: "←", bg: "bg-[#ADD8E6]", text: "text-[28px]", span: "h-12"},
        {label: "7", bg: "bg-[#F8F8FF]", text: "text-[28px]", span: "h-12"},
        {label: "8", bg: "bg-[#F8F8FF]", text: "text-[28px]", span: "h-12"},
        {label: "9", bg: "bg-[#F8F8FF]", text: "text-[28px]", span: "h-12"},
        {label: "÷", bg: "bg-[#ADD8E6]", text: "text-[28px]", span: "h-12"},
        {label: "%", bg: "bg-[#ADD8E6]", text: "text-[28px]", span: "h-12"},
        {label: "+/-", bg: "bg-[#ADD8E6]", text: "text-[28px]", span: "h-12"},
        {label: "4", bg: "bg-[#F8F8FF]", text: "text-[28px]", span: "h-12"},
        {label: "5", bg: "bg-[#F8F8FF]", text: "text-[28px]", span: "h-12"},
        {label: "6", bg: "bg-[#F8F8FF]", text: "text-[28px]", span: "h-12"},
        {label: "x", bg: "bg-[#ADD8E6]", text: "text-3xl", span: "h-12"},
        {label: "-", bg: "bg-[#ADD8E6]", text: "text-3xl", span: "h-12"},
        {label: "AC", bg: "bg-[#ADD8E6]", text: "text-[28px]", span: "h-12"},
        {label: "1", bg: "bg-[#F8F8FF]", text: "text-[28px]", span: "h-12"},
        {label: "2", bg: "bg-[#F8F8FF]", text: "text-[28px]", span: "h-12"},
        {label: "3", bg: "bg-[#F8F8FF]", text: "text-[28px]", span: "h-12"},
        {label: "+", bg: "bg-[#ADD8E6]", text: "text-3xl", span: "row-span-2"},
        {label: "=", bg: "bg-[#ADD8E6]", text: "text-3xl", span: "row-span-2"},
        {label: "C", bg: "bg-[#ADD8E6]", text: "text-[28px]", span: "h-12"},
        {label: "0", bg: "bg-[#F8F8FF]", text: "text-[28px]", span: "h-12"},
        {label: "00", bg: "bg-[#F8F8FF]", text: "text-[28px]", span: "h-12"},
        {label: ".", bg: "bg-[#F8F8FF]", text: "text-[28px]", span: "h-12"},
]

const operators = ["+", "-", "x", "÷"]

function DefaultCalculator() {
    const [display, setDisplay] = useState("0")
    const [expression, setExpression] = useState("0")
    const [memory, setMemory] = useState("0")
    const [afterOperator, setAfterOperator] = useState(false)
    const [resultPlus, setResultPlus] = useState(false)

    const handleClick = (label: string) => {
        const lastChar = expression.slice(-1)
        const newExpr = expression + label
        const isNull = display === '0'
        const currentNumber = expression.split(/[+\-x÷]/).pop() || ""  

        switch(label) {
            case "√":
                const sqrtResult = Math.sqrt(parseFloat(display))
                setDisplay(String(sqrtResult))
                setExpression(String(sqrtResult))
                setResultPlus(true)
                break
            case "%":
                if (display === "0" || expression === "") break
                const percentResult = parseFloat(display) / 100
                setDisplay(String(percentResult))
                setExpression(String(percentResult))
                break
            case "+/-":
                const negResult = parseFloat(display) * -1
                setDisplay(String(negResult))
                setExpression(expression.slice(0, -display.length) + String(negResult))
                break
            case "Xʸ":
                if (operators.includes(lastChar) || expression === "") break
                setExpression(expression + "^")
                setAfterOperator(true)
                break
            case "AC":
                setExpression("0")
                setDisplay("0")
                setAfterOperator(false)
                setResultPlus(false)
                setMemory("0")
                break
            case "MC":
                setMemory("0")
                break
            case "MR":
                setDisplay(memory)
                setExpression(memory)
                setAfterOperator(false)
                break
            case "M-":
                const newMem = parseFloat(memory) - parseFloat(display)
                setMemory(String(newMem < 0 ? 0 : newMem))
                break
            case "M+":
                setMemory(String(parseFloat(memory) + parseFloat(display)))
                break
            case "←":
                const newDisplay = display.slice(0, -1) || "0"
                setDisplay(newDisplay)
                if(!operators.includes(lastChar)) {
                    setExpression(expression.slice(0,- 1))
                } 
                if(resultPlus) {
                    setDisplay("0")
                    setExpression("")
                    setResultPlus(false)
                }
                break
            case "x":
            case "-":
            case "+":
            case "÷":
                if ( operators.includes(lastChar) ) {
                    setExpression(expression.slice(0, -1) + label)
                    break
                }

                if (resultPlus) {
                    setExpression(display + label)
                    setResultPlus(false)
                } else {
                    setExpression(newExpr)
                }
                setAfterOperator(true)
                break
            case "C": 
                setExpression("0")
                setDisplay("0")
                break
            case "=": 
                    const hasOperator = operators.some(el => expression.includes(el))
                    const hasLastOpeator = operators.includes(lastChar)
                    const hasEquals = expression.includes("=")

                    if (!hasOperator || hasLastOpeator || hasEquals) break
                try {
                    const notFormatted = evaluate(expression.replace(/x/g, '*').replace(/÷/g, '/'))
                    const formatted = parseFloat(Number(notFormatted).toFixed(2))
                    const result = String(formatted)
                    setDisplay(result.length > 10 ? Number(result).toExponential(3) : result)
                    setExpression(expression + label + formatted)
                    setResultPlus(true)
                } catch {
                    setDisplay("Error")
                }
                break
            default: 
                if (afterOperator) {
                    setDisplay(label)
                    setExpression(newExpr)
                    setAfterOperator(false)
                } else if (resultPlus) {
                    setDisplay(label)
                    setExpression(label)
                    setResultPlus(false)
                }
                else {
                    if (["0", "00", "."].includes(label) && display === "0") break
                    if (currentNumber.length >= 10) break
                    setExpression(isNull ? label : newExpr)
                    setDisplay (isNull ? label : display + label)
                }
                
        }
    }


    return (
            <div className="h-110 w-155 px-6 pt-5 pb-6 bg-[#333333] flex flex-col gap-2 rounded-2xl">
                <div className="bg-[#EEEEEE] text-5xl pr-1.5 flex-2 items-center flex justify-end rounded-md">{display}</div>

                
                <p className="flex-1 flex text-white text-xl pl-2.5 justify-between">
                    <span>Mem: {memory}</span>
                    <span className="pr-2.5">{expression}</span>
                </p>

                <div className="flex-4 grid grid-cols-6 gap-y-3 gap-x-2">
                    {buttons.map(btn => (
                        <div
                            key={btn.label}
                            className={`${btn.bg} active:translate-y-0.5 active:shadow-none transition-all duration-75 text-black flex items-center justify-center ${btn.text} font-medium rounded-sm ${btn.span} cursor-pointer select-none`}
                            onClick={() => handleClick(btn.label)}
                        >
                            {btn.label}
                        </div>
                    ))}
                </div>
            </div>
    )
}

export default DefaultCalculator
