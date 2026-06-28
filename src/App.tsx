import { useState } from "react"
import Calculator from "./calculator"
import Todo_List from "./todo-list"
import Unit_Converter from "./unit-converter"
import Currency_Converter from "./currency-converter"
import Cookies from "./cookies"

import calculatorImg from "./assets/png/calculator.png"
import convertImg1 from "./assets/png/converter 1.png"
import convertImg2 from "./assets/png/converter 2.png"
import cookiesImg from "./assets/png/fortune cookies.png"
import todoImg from "./assets/png/todo.png"


  const tools = [
    { id: 'calculator', label: 'Калькулятор', img: calculatorImg, component: <Calculator /> },
    { id: 'todo', label: 'Todo-лист', img: todoImg, component: <Todo_List /> },
    { id: 'converter1', label: 'Конвертер единиц', img: convertImg1, component: <Unit_Converter /> },
    { id: 'converter2', label: 'Конвертер валют', img: convertImg2, component: <Currency_Converter /> },
    { id: 'cookies', label: 'Предсказания', img: cookiesImg, component: <Cookies /> },
  ]


function App() {
  const  [activePage, setActivePage] = useState(() => {
    return localStorage.getItem("activePage") ?? "calculator"
  })

  const handlePageChange = (id:string) => {
    setActivePage(id)
    localStorage.setItem("activePage", id)
  }

  const activeTool = tools.find(t => t.id === activePage)

  return (
    <div className="flex h-screen">
      <aside 
        className="w-82 border-r-2 border-[#777777] bg-[#F4F4F4] select-none">
        <div className="border-b-2 border-[#777777] pl-7 py-7">
          <h1 className="text-[22px] text-[#4D4E51] font-bold">SWISS KNIFE</h1>
          <p className="text-lg text-[#76787B] font-medium">{tools.length} инструментов</p>
        </div>

        <div>
          {tools.map(el => (
            <div
            key={el.id}
            onClick={() => handlePageChange(el.id)}
            className={`cursor-pointer flex items-center py-5 ${activePage === el.id ? 'bg-[#DDDDDD]' : 'hover:bg-[#EEEEEE]'}`}
            >
              <div className={`w-1.5 h-10 rounded-r mr-5 ${activePage === el.id ? 'bg-[#7F77DD]' : ''}`}></div>
              <img 
                className="w-8 h-8" src={el.img} alt="img" 
                draggable="false"
              />
              <span className="ml-4 text-lg font-medium">{el.label}</span>
            </div>
          ))}
        </div>
      </aside>  

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b-2 border-[#777777] bg-[#F4F4F4] px-7 py-4">
          <h2 className="text-2xl font-semibold">{activeTool?.label}</h2>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeTool?.component}
        </div>
        
      </main>
    </div>
  )
}

export default App