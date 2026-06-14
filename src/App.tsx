import calculatorImg from "./assets/png/calculator.png"
import convertImg1 from "./assets/png/converter 1.png"
import convertImg2 from "./assets/png/converter 2.png"
import cookiesImg from "./assets/png/fortune cookies.png"
import todoImg from "./assets/png/todo.png"
import { useState } from "react"
import Calculator from "./calcuator/Calculator"
import Todo_List from "./todo-list/Todo_List"
import Unit_Converter from "./unit-converter/Unit_Сonverter"
import Currency_Converter from "./currency-converter/Currency_Сonverter"
import Cookies from "./cookies/Cookies"

function App() {
  const  [activePage, setActivePage] = useState("calculator")

  const menuItems = [
    { id: 'calculator', label: 'Калькулятор', img: calculatorImg },
    { id: 'todo', label: 'Todo-лист', img: todoImg },
    { id: 'converter1', label: 'Конвертер единиц', img: convertImg1 },
    { id: 'converter2', label: 'Конвертер валют', img: convertImg2 },
    { id: 'cookies', label: 'Предсказания', img: cookiesImg },
  ]


  return (
    <div className="flex h-screen">
      <aside className="w-82 border-r-2 border-[#777777] bg-[#F4F4F4]">
        <div className="border-b-2 border-[#777777] pl-7 py-7">
          <h1 className="text-[22px] text-[#4D4E51] font-bold">SWISS KNIFE</h1>
          <p className="text-lg text-[#76787B] font-medium">{menuItems.length} инструментов</p>
        </div>

        <div>
          {menuItems.map(el => (
            <div
            key={el.id}
            onClick={() => setActivePage(el.id)}
            className={`cursor-pointer flex items-center py-5 ${activePage === el.id ? 'bg-[#DDDDDD]' : 'hover:bg-[#EEEEEE]'}`}
            >
              <div className={`w-1.5 h-10 rounded-r mr-5 ${activePage === el.id ? 'bg-[#7F77DD]' : ''}`}></div>
              <img className="w-8 h-8" src={el.img} alt="img" />
              <span className="ml-4 text-lg font-medium">{el.label}</span>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b-2 border-[#777777] bg-[#F4F4F4] px-7 py-4">
          <h2 className="text-2xl font-semibold">{menuItems.find(el => el.id === activePage)?.label}</h2>
        </div>

        <div className="flex-1 overflow-hidden">
          { activePage  === "calculator" && <Calculator /> }
          { activePage === "todo" && <Todo_List  /> }
          { activePage === "converter1" && <Unit_Converter /> }
          { activePage === "converter2" && <Currency_Converter /> } 
          { activePage === "cookies" && <Cookies /> } 
        </div>
        
      </main>
    </div>
  )
}

export default App