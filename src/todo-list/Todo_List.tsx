import plus from "../assets/icons/plus.svg"

function Todo_List() {
    return (
        <div className="flex flex-col gap-50 pt-12.75 pb-13.25 px-21.5 h-screen">

            {/* Верхняя часть */}
            <div className="flex flex-col flex-1 gap-11.25">

                {/* Инпут + селект + кнопка */}
                <div className="flex flex-1 w-full gap-10">
                    <div className="flex flex-4 gap-7">
                        <input className="bg-white flex-3" type="text" placeholder="Новая задача..." />

                        <select className="bg-white flex-1">
                            <option value="">Высокий</option>
                            <option value="">Средний</option>
                            <option value="">Низкий</option>
                        </select>
                    </div>
                    
                    <button className="bg-[#49B988] flex-1">
                        <span>Добавить</span>
                        <img className=" w-[24px] h=[24px] "src={plus} alt="img" />
                    </button>
                </div>

                {/* Фильтры */}
                <div className="flex flex-1">
                    <button className=""></button>
                    <button className=""></button>
                    <button className="bg"></button>
                </div>

                {/* Список задач */}
                <div className="flex flex-1">
                    
                </div>

            </div>

            {/* Нижняя панель */}
            <div className="bg-black w-full h-15">

            </div>
        </div>
    )
}

export default Todo_List