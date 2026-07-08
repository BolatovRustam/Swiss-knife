import { useState } from 'react'
import logo from "../../public/favicon.png"

import LoginForm from './LoginForm'
import RegistrationForm from './RegistrationForm'

function AuthPage () {
  const [isLogin, setIsLogin] = useState(true)


    return (
        <div className='relative min-h-screen overflow-hidden'>

            {/* Анимированный фон */}
            <div className='absolute inset-0 bg-gradient-to-br from-[#EBE6DC] via-[#E8956D] to-[#D4A574] animate-gradient bg-[length:400%_400%]'>
                
              {/* Центрирование */}
              <div className='relative min-h-screen flex items-center justify-center'>


                <div className='flex flex-col w-full max-w-119.5 px-11 py-7 bg-white gap-6 rounded-[18px]'>

                  {/* Логотип + верхний текст */}
                  <div className='flex flex-col items-center text-center gap-2'>

                    <div className='flex items-center text-[30px] font-bold gap-2'>
                      <img src={logo} alt="png" className='w-[38px] h-[38px]' />
                      <p><span className='text-[#2E86FA]'>SWISS </span>KNIFE</p>
                    </div>                      

                    <p className='flex flex-col text-[24px] gap-1'>
                      <span >Добро пожаловать !</span>
                      <span className='text-[#878FA0] text-[14px]'>Войдите в свой аккаунт, чтобы продолжить</span>
                    </p>

                  </div>

                  {/* Табы */}
                  <div className="flex mb-1.5 border-b border-gray-200 hover:border-gray-300">
                    <button
                      onClick={() => setIsLogin(true)}
                      className={`flex-1 pb-2 text-sm font-medium transition-colors cursor-pointer ${isLogin ? 'border-b-2 border-[#2E86FA] text-[#2E86FA]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Вход
                    </button>
                    <button
                      onClick={() => setIsLogin(false)}
                      className={`flex-1 pb-2 text-sm font-medium transition-colors cursor-pointer ${!isLogin ? 'border-b-2 border-[#2E86FA] text-[#2E86FA]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Регистрация
                    </button>
                  </div>

                  {isLogin ? <LoginForm /> : <RegistrationForm />}
                </div>
              </div>

            </div>
        </div>
    )
}

export default AuthPage