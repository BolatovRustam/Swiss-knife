import { useState } from "react"
import { evaluate } from "mathjs"

const BTN_TEXT = "text-base md:text-xl lg:text-[28px]"
const BTN_TEXT_WIDE = "text-lg md:text-2xl lg:text-3xl"
const BTN_SPAN = "h-9 md:h-11 lg:h-12"

const buttons = [
        {label: "MC", bg: "bg-[#ADD8E6]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "MR", bg: "bg-[#ADD8E6]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "M-", bg: "bg-[#ADD8E6]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "M+", bg: "bg-[#ADD8E6]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "√", bg: "bg-[#ADD8E6]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "Xʸ", bg: "bg-[#ADD8E6]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "←", bg: "bg-[#ADD8E6]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "7", bg: "bg-[#F8F8FF]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "8", bg: "bg-[#F8F8FF]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "9", bg: "bg-[#F8F8FF]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "÷", bg: "bg-[#ADD8E6]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "%", bg: "bg-[#ADD8E6]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "+/-", bg: "bg-[#ADD8E6]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "4", bg: "bg-[#F8F8FF]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "5", bg: "bg-[#F8F8FF]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "6", bg: "bg-[#F8F8FF]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "x", bg: "bg-[#ADD8E6]", text: BTN_TEXT_WIDE, span: BTN_SPAN},
        {label: "-", bg: "bg-[#ADD8E6]", text: BTN_TEXT_WIDE, span: BTN_SPAN},
        {label: "AC", bg: "bg-[#ADD8E6]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "1", bg: "bg-[#F8F8FF]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "2", bg: "bg-[#F8F8FF]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "3", bg: "bg-[#F8F8FF]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "+", bg: "bg-[#ADD8E6]", text: BTN_TEXT_WIDE, span: "row-span-2"},
        {label: "=", bg: "bg-[#ADD8E6]", text: BTN_TEXT_WIDE, span: "row-span-2"},
        {label: "C", bg: "bg-[#ADD8E6]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "0", bg: "bg-[#F8F8FF]", text: BTN_TEXT, span: BTN_SPAN},
        {label: "00", bg: "bg-[#F8F8FF]", text: BTN_TEXT, span: BTN_SPAN},
        {label: ".", bg: "bg-[#F8F8FF]", text: BTN_TEXT, span: BTN_SPAN},
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
            <div className="w-full max-w-[380px] md:max-w-[460px] lg:max-w-none lg:w-155 lg:h-110 px-4 pt-4 pb-4.5 md:px-4.5 md:pt-4 md:pb-5 lg:px-6 lg:pt-5 lg:pb-6 bg-[#333333] flex flex-col gap-2 rounded-2xl mx-auto">
                <div className="bg-[#EEEEEE] text-2xl md:text-3xl lg:text-5xl pr-1.5 py-0.5 md:py-1 lg:py-0 flex-2 items-center flex justify-end rounded-md">{display}</div>

                
                <p className="flex-1 flex text-white text-sm md:text-base lg:text-xl pl-2.5 justify-between">
                    <span>Mem: {memory}</span>
                    <span className="pr-2.5">{expression}</span>
                </p>

                <div className="flex-4 grid grid-cols-6 gap-y-2 gap-x-1 md:gap-y-2.5 md:gap-x-1.5 lg:gap-y-3 lg:gap-x-2">
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
