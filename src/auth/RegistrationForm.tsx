import { useForm } from "react-hook-form" 
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { supabase } from "../lib/supabase"

import Mail from "../../src/assets/icons/email.svg?react"
import Password from "../../src/assets/icons/password.svg?react"
import User from "../assets/icons/user.svg?react"

const registerSchema = z.object({
  user: z.string().min(2, 'Введите имя'),
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Минимусс 6 символов'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword']
})

type RegisterFormData = z.infer<typeof registerSchema>

function RegistrationForm () {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterFormData) => {
    const {error} = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {name: data.user}
      }
    })

    if(error) {
      setError('root', {message: error.message})
    }
  }

    return (
        <div className="flex flex-col">
                  <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>

                    <div className='flex flex-col'>
                      <label htmlFor="text" className='mb-2 font-medium text-[14px]'>Имя</label>
                      <div className='relative'>
                        <User className='absolute left-3 top-3 text-[#9797A0]'/>
                        <input 
                          type="text" 
                          {...register('user')}
                          className='w-full pl-11 pr-4.5 py-3 outline-[#777777]/40 outline-1 rounded-[10px]'
                          placeholder='Введите ваше имя' 
                        />
                      </div>
                      { errors.user && <p className='text-red-500 text-xs mt-1'>{errors.user.message}</p> }
                    </div>  

                    <div className='flex flex-col'>
                      <label htmlFor="email" className='mb-2 font-medium text-[14px]'>Email</label>
                      <div className='relative'>
                        <Mail className='absolute left-3 top-3 text-[#9797A0]'/>
                        <input 
                          type="email" 
                          {...register('email')}
                          className='w-full pl-11 pr-4.5 py-3 outline-[#777777]/40 outline-1 rounded-[10px]'
                          placeholder='Введите ваш email' 
                        />
                      </div>
                      { errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p> }
                    </div>  

                    <div className='flex flex-col'>
                      <label htmlFor="password" className='mb-2 font-medium text-[14px]'>Пароль</label>
                      <div className='relative'>
                        <Password className='absolute left-3 top-3 text-[#9797A0]'/>
                        <input 
                          type="password"
                          {...register('password')}
                          className='w-full pl-11 pr-4.5 py-3 outline-[#777777]/40 outline-1 rounded-[10px]' 
                          placeholder='Введите ваш пароль' 
                        />
                      </div>
                      { errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p> }
                    </div>

                    <div className='flex flex-col'>
                      <label htmlFor="password" className='mb-2 font-medium text-[14px]'>Подтвердить пароль</label>
                      <div className='relative'>
                        <Password className='absolute left-3 top-3 text-[#9797A0]'/>
                        <input 
                          type="password"
                          {...register('confirmPassword')}
                          className='w-full pl-11 pr-4.5 py-3 outline-[#777777]/40 outline-1 rounded-[10px]' 
                          placeholder='Повторите пароль' 
                        />
                      </div>
                      { errors.confirmPassword && <p className='text-red-500 text-xs mt-1'>{errors.confirmPassword.message}</p> }
                    </div>
                    {errors.root && <p className='text-red-500 text-sm text-center'>{ errors.root.message }</p>}

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className='mt-6 px-21.5 py-2.5 bg-[#2E86FA]  rounded-lg text-white font-semibold cursor-pointer'
                    >
                      {isSubmitting ? 'Загрузка...' : 'Зарегистрироваться'}
                    </button>

                  </form>

        </div>
                
    )
}

export default RegistrationForm