import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export function useSupabaseHistory<T extends {id: string}> ( 
    table: string,
    userId: string | undefined
 ) {

    const [data, setData] = useState<T[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const { data: rows, error } = await supabase
            .from(table)
            .select('*')
            .order('created_at', { ascending: true })

        if ( error ) console.error('Ошибка загрузки', error)
        else setData (rows as T[])
        setLoading(false)
        }

        
        fetchData()
    }, [])

    const addEntry = async ( tempEntry: T, insertPlayod: object ) => {
        setData(prev => [...prev, tempEntry])

        const { data: newEntry, error } = await supabase
        .from(table)
        .insert( insertPlayod )
        .select()
        .single()

        if (error) {
            console.error('Ошибка добавление', error)
            setData(prev => prev.filter( el => el.id !== tempEntry.id ))
        }
    }

    const removeEntry = async (id: string) => {
        const removed  = data.find(el => el.id === id)
        if (!removed) return

        setData(prev => prev.filter(el => el.id !== id))

        const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

        if ( error ) {
            console.error('Ошибка удаление', error)
            setData(prev => [...prev, removed ])
        }
    }

    const clearAll = async () => {
        const insertData = data

        setData([])

        const { error } = await supabase
        .from(table)
        .delete()
        .eq('user_id', userId)

        if (error) {
            console.error('Ошибка очистки', error)
            setData(insertData)
        }
    }

    const updateEntry = async (id: string, updates: Partial<T>) => {
        const element = data.find(el => el.id === id)
        if(!element) return

        setData(prev => prev.map(el => el.id === id ? {...el, ...updates} : el))

        const { error } = await supabase
        .from(table)
        .update(updates as never)
        .eq('id', id)

        if (error) {
            console.error('Ошибка обновления', error)
            setData(prev => prev.map(el => el.id === id ? element: el))   
        }

    }

    return { data, setData, loading, addEntry, clearAll, removeEntry, updateEntry }
 }