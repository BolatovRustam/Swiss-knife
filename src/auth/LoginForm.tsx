import Mail from "../../src/assets/icons/email.svg?react"
import Password from "../../src/assets/icons/password.svg?react"

function LoginForm () {
    return (
        <div className="flex flex-col">
                  <form className='flex flex-col gap-4'>

                    <div className='flex flex-col'>
                      <label htmlFor="email" className='mb-2 font-medium text-[14px]'>Email</label>
                      <div className='relative'>
                        <Mail className='absolute left-3 top-3 text-[#9797A0]'/>
                        <input 
                          type="email" 
                          className='w-full pl-11 pr-4.5 py-3 outline-[#777777]/40 outline-1 rounded-[10px]'
                          placeholder='Введите ваш email' 
                        />
                      </div>

                    </div>  

                    <div className='flex flex-col'>
                      <label htmlFor="password" className='mb-2 font-medium text-[14px]'>Пароль</label>
                      <div className='relative'>
                        <Password className='absolute left-3 top-3 text-[#9797A0]'/>
                        <input 
                          type="password"
                          className='w-full pl-11 pr-4.5 py-3 outline-[#777777]/40 outline-1 rounded-[10px]' 
                          placeholder='Введите ваш пароль' 
                        />
                      </div>

                    </div>

                  </form>

                  <button className='mt-6 px-21.5 py-2.5 bg-[#2E86FA]  rounded-lg text-white font-semibold cursor-pointer'>Войти</button>
        </div>
                
    )
}

export default LoginForm