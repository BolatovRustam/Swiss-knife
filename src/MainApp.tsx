import { useState } from "react"
import { useAuthStore } from "./store/authStore"
import { supabase } from "./lib/supabase"
import Calculator from "./calculator"
import Todo_List from "./todo-list"
import Unit_Converter from "./unit-converter"
import Currency_Converter from "./currency-converter"
import Cookies from "./cookies"
import Weather from "./weather/Weather" 
import { Loader2 } from "lucide-react"

import { calculatorImg, convertImg1, convertImg2, cookiesImg, todoImg, weatherImg } from "@/assets/png"
import { Cross, List, LogOut } from "./assets/icons"


  const tools = [
    { id: 'calculator', label: 'Калькулятор', img: calculatorImg, component: <Calculator /> },
    { id: 'todo', label: 'Todo-лист', img: todoImg, component: <Todo_List /> },
    { id: 'weather', label: 'Погода', img: weatherImg, component: <Weather /> },
    { id: 'converter1', label: 'Конвертер единиц', img: convertImg1, component: <Unit_Converter /> },
    { id: 'converter2', label: 'Конвертер валют', img: convertImg2, component: <Currency_Converter /> },
    { id: 'cookies', label: 'Предсказания', img: cookiesImg, component: <Cookies /> },
  ]


function MainApp() {
  const  [activePage, setActivePage] = useState(() => {
    return localStorage.getItem("activePage") ?? "calculator"
  })

  const { session } = useAuthStore()
  const [loggingOut, setLoggingOut] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handlePageChange = (id:string) => {
    setActivePage(id)
    localStorage.setItem("activePage", id)
    setIsMenuOpen(false)
  }

  const handleLogOut = async () => {
    setLoggingOut(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    await supabase.auth.signOut()
  }

  const activeTool = tools.find(t => t.id === activePage)

  return (
    <div className="flex h-screen">

      {/* Затемнение — только мобилка/планшет */}
      { isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 hidden md:block lg:hidden" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Сайдбар — ОДИН элемент, но ведёт себя по-разному через классы */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 
          w-full md:w-82 border-r-2 md:rounded-r-3xl lg:rounded-none border-[#777777] bg-[#F4F4F4] select-none
          transition-transform duration-300
          ${ isMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}>
        <div className="flex items-center justify-between border-b-2 border-[#777777] pl-7 pr-5.5 py-7">
          <div>
            <h1 className="text-[20px] lg:text-[22px] text-[#4D4E51] font-bold">SWISS KNIFE</h1>
            <p className="text-[16px] lg:text-lg text-[#76787B] font-medium">{tools.length} инструментов</p>
          </div>

          <button 
            className="pb-8 md:hidden shrink-0 text-[#9797A0] hover:text-black active:scale-90 transition-all duration-150 cursor-pointer"
            onClick={() => setIsMenuOpen(false)}>
              <Cross 
                  className="fill-current w-5.5 h-5.5"
              />
          </button>
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
        
        {/* Мобильный хедер */}
        <div className="flex lg:hidden items-center justify-between border-b-2 border-[#777777] bg-[#F4F4F4] px-4 py-3">
          <button
            className="shrink-0 text-black hover:text-[#4D4E51] active:scale-90 transition-all duration-150 cursor-pointer"
            onClick={() => setIsMenuOpen(true)}
          >
            <List 
              className="w-5 h-5 md:w-6 md:h-6 fill-current"
            />
          </button>

          <h2 className="text-lg md:text-[20px] font-semibold">{activeTool?.label}</h2>
          <button
            className="shrink-0 text-black hover:text-[#4D4E51] active:scale-90 transition-all duration-150 cursor-pointer"
            onClick={handleLogOut}
          >
            {loggingOut ? (
              <Loader2  className="w-5 h-5 animate-spin"/>
            ) : (
              <LogOut 
                  className="w-5 h-5 md:w-6 md:h-6 fill-current"
              />
            )}
          </button>
        </div>

      
        {/* Десктопный хедер */}
        <div className=" hidden lg:flex items-center justify-between border-b-2 border-[#777777] bg-[#F4F4F4] px-7 py-4">
          <h2 className="text-2xl font-semibold">{activeTool?.label}</h2>
          <div className="flex items-center gap-4.5 font-medium">
            <p>Добро пожаловать {session?.user?.user_metadata?.name}!</p>
            <button 
              className={`
                flex items-center gap-2 px-2.5 py-2  
                ${loggingOut ? "bg-[#F55252] outline-none text-white" : "bg-white hover:bg-[#EDEDED]"}
                rounded-lg outline outline-black cursor-pointer transition-colors duration-300
              `}
              onClick={handleLogOut}
            >
              { loggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin"/>
                  Выходим...
                </>
              ): (
                'Выйти'
              )}
            </button>
          </div>
        </div>


      {/* Контент  */}
        <div className="flex-1 overflow-hidden">
          {activeTool?.component}
        </div>
        
      </main>
    </div>
  )
}

export default MainApp