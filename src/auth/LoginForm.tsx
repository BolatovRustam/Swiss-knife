import { useForm } from "react-hook-form" 
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { supabase } from "../lib/supabase"

import Mail from "../../src/assets/icons/email.svg?react"
import Password from "../../src/assets/icons/password.svg?react"

const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов')
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm () {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })

    if ( error ) {
      setError('root', { message: error.message })
    }
  }

    return (
        <div className="flex flex-col">
                  <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>

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
                      { errors.email && <p className="text-red-500 text-xs mt-1" >{errors.email.message}</p> }
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
                    {errors.root && <p className='text-red-500 text-sm text-center'>{ errors.root.message }</p>}
                    
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className='mt-6 px-21.5 py-2.5 bg-[#2E86FA]  rounded-lg text-white font-semibold cursor-pointer'
                    >
                      {isSubmitting ? 'Загрузка...' : 'Войти'}
                    </button>
                  </form>




        </div>
                
    )
}

export default LoginForm