import { useState } from "react"
import { evaluate } from "mathjs"

const BTN_SPAN = "h-9 md:h-11 lg:h-13"
const BTN_TEXT = "text-lg md:text-2xl lg:text-3xl"

const buttons = [
    {label: "AC", bg: "bg-[#2B85E4]", text: "text-white", span: BTN_SPAN, shadow: "shadow-[0_5px_0_#206DBE]" },
    {label: "C", bg: "bg-[#2B85E4]", text: "text-white", span: BTN_SPAN, shadow: "shadow-[0_5px_0_#206DBE]" },
    {label: "%", bg: "bg-[#35404D]", text: "text-white", span: BTN_SPAN, shadow: "shadow-[0_5px_0_#2C3743]" },
    {label: "÷", bg: "bg-[#35404D]", text: "text-white", span: BTN_SPAN, shadow: "shadow-[0_5px_0_#2C3743]" },
    {label: "7", bg: "bg-[#EBEBEB]", text: "text-[#343434]", span: BTN_SPAN, shadow: "shadow-[0_5px_0_#B7B7B7]" },
    {label: "8", bg: "bg-[#EBEBEB]", text: "text-[#343434]", span: BTN_SPAN, shadow: "shadow-[0_5px_0_#B7B7B7]" },
    {label: "9", bg: "bg-[#EBEBEB]", text: "text-[#343434]", span: BTN_SPAN, shadow: "shadow-[0_5px_0_#B7B7B7]" },
    {label: "x", bg: "bg-[#35404D]", text: "text-white", span: BTN_SPAN, shadow: "shadow-[0_5px_0_#2C3743]" },
    {label: "4", bg: "bg-[#EBEBEB]", text: "text-[#343434]", span: BTN_SPAN, shadow: "shadow-[0_5px_0_#B7B7B7]" },
    {label: "5", bg: "bg-[#EBEBEB]", text: "text-[#343434]", span: BTN_SPAN, shadow: "shadow-[0_5px_0_#B7B7B7]" },
    {label: "6", bg: "bg-[#EBEBEB]", text: "text-[#343434]", span: BTN_SPAN, shadow: "shadow-[0_5px_0_#B7B7B7]" },
    {label: "-", bg: "bg-[#35404D]", text: "text-white", span: BTN_SPAN, shadow: "shadow-[0_5px_0_#2C3743]" },
    {label: "1", bg: "bg-[#EBEBEB]", text: "text-[#343434]", span: BTN_SPAN, shadow: "shadow-[0_5px_0_#B7B7B7]" },
    {label: "2", bg: "bg-[#EBEBEB]", text: "text-[#343434]", span: BTN_SPAN, shadow: "shadow-[0_5px_0_#B7B7B7]" },
    {label: "3", bg: "bg-[#EBEBEB]", text: "text-[#343434]", span: BTN_SPAN, shadow: "shadow-[0_5px_0_#B7B7B7]" },
    {label: "+", bg: "bg-[#F55353]", text: "text-white", span: "row-span-2", shadow: "shadow-[0_5px_0_#C24343]" },
    {label: ".", bg: "bg-[#EBEBEB]", text: "text-[#343434]", span: BTN_SPAN, shadow: "shadow-[0_5px_0_#B7B7B7]" },
    {label: "0", bg: "bg-[#EBEBEB]", text: "text-[#343434]", span: BTN_SPAN, shadow: "shadow-[0_5px_0_#B7B7B7]" },
    {label: "=", bg: "bg-[#EBEBEB]", text: "text-[#343434]", span: BTN_SPAN, shadow: "shadow-[0_5px_0_#B7B7B7]" },
]

const operators = ["+", "-", "x", "÷"]


function SegmentedCalculator() {
    const [display, setDisplay] = useState("0")
    const [expression, setExpression] = useState("0")
    const [afterOperator, setAfterOperator] = useState(false)
    const [resultPlus, setResultPlus] = useState(false)

    const handleClick = (label:string) => {
        const lastChar = expression.slice(-1)
        const newExpr = expression + label
        const isNull = display === '0'
        const currentNumber = expression.split(/[+\-x÷]/).pop() || ""  
        

      switch(label) {
        case "AC":
          setDisplay("0")
          setExpression("0")
          setAfterOperator(false)
          setResultPlus(false)
          break
        case "%":
          const percentResult = parseFloat(display) / 100
          setDisplay(String(percentResult))
          setExpression(String(percentResult))
          break
        case "C":
          setDisplay("0")
          setExpression("0")
          break
        case "x":
        case "-":
        case "+":
        case "÷":

          if ( operators.includes(lastChar) ) {
            setExpression(expression.slice(0, -1) + label)
            break
          }

          if(resultPlus) {
            setExpression(display + label)
            setResultPlus(false)
          } else {
            setExpression(newExpr)
          }
          
          setAfterOperator(true)
          break
        case "=":
          const hasOperator = operators.some(el => expression.includes(el))
          const hasLastOperator = operators.includes(lastChar)
          const hasEquals = expression.includes("=")
          
          if(!hasOperator || hasLastOperator  || hasEquals) break

          try {
            const notFormatted = evaluate(expression.replace(/x/g, '*').replace(/÷/g, '/'))
            const formatted = parseFloat(Number(notFormatted).toFixed(2))
            const result = String(formatted)
            setDisplay( result.length > 8 ? Number(result).toExponential(3) : result )
            setExpression(expression + label + formatted)
            setResultPlus(true)
          } catch {
              setDisplay("Error")
          }
          break
        default: 
          

          if(afterOperator) {
            
            setDisplay(label)
            setExpression(newExpr)
            setAfterOperator(false) 
          } else if (resultPlus) {
            setDisplay(label)
            setExpression(label)
            setResultPlus(false)
          } else {
            if (["0", "00", "."].includes(label) && display === "0") break
            if (currentNumber.length >= 8) break  
              setExpression(isNull ? label : newExpr)
              setDisplay (isNull ? label : display + label)
          }
      }
    }

    return(
          <div className="bg-[#575757] flex flex-col pt-5 px-4 md:pt-6 md:px-5 lg:pt-8 lg:px-6 w-full max-w-[280px]  md:max-w-[340px] lg:max-w-[400px] h-81 md:h-98 lg:w-100 lg:h-120 rounded-3xl gap-2 shadow-[0_12px_0_#424242] md:shadow-[0_13px_0_#424242] lg:shadow-[0_15px_0_#424242] mx-auto">
            
                  <div className="relative h-14 md:h-16 lg:h-20">
                      <div className="absolute inset-0 bg-[#4A4A4A] rounded-[10px] lg:rounded-xl"></div>
                      <div className="absolute flex pr-2 inset-0 mt-1 mb-3 mx-1 bg-[#BBD0BF] font-['DSEG7_Classic'] text-[28px] md:text-[36px] lg:text-[48px] rounded-[10px] lg:rounded-xl shadow-[0_4px_0_#96AE9E,0_-4px_0_#96AE9E] lg:shadow-[0_5px_0_#96AE9E,0_-5px_0_#96AE9E] overflow-hidden">
                        <div className="relative w-full flex justify-end">
                          <span className="absolute inset-0 flex md:hidden justify-end font-['DSEG7_Classic'] text-[#688271] opacity-30 select-none">888888888</span>
                          <span className="absolute inset-0 hidden md:flex lg:hidden justify-end font-['DSEG7_Classic'] text-[#688271] opacity-30 select-none">888888888</span>
                          <span className="absolute inset-0 hidden lg:flex justify-end font-['DSEG7_Classic'] text-[#688271] opacity-30 select-none">88888888</span>
                          <span className="absolute right-0 font-['DSEG7_Classic']">{display}</span>
                        </div>
                      </div>
                   </div>

                  <div className="grid grid-cols-4 gap-y-2.5 gap-x-1.5 md:gap-y-3 md:gap-x-2 lg:gap-y-4 lg:gap-x-2">
                    {buttons.map(btn => (
                      <div
                        key={btn.label}
                        className={`${btn.bg} ${btn.text} active:translate-y-0.75 active:shadow-none transition-all duration-75 rounded-[10px] md:rounded-xl lg:rounded-2xl flex items-center justify-center ${btn.span} ${BTN_TEXT} text-3xl font-medium cursor-pointer ${btn.shadow} select-none`}
                        onClick={() => handleClick(btn.label)}
                      >
                        {btn.label}
                      </div>
                    ))}
                  </div>

              </div>
    )
}

export default SegmentedCalculator