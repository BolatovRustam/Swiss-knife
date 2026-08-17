import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { HistoryEntry } from "./types"

export function useSearchHistory () {
    const [history, setHistory] = useState<HistoryEntry[]>([])

    const fetchHistory = async () => {
        const { data, error } = await supabase
            .schema("weather")
            .from("search_history")
            .select("*")
            .order("searched_at", { ascending: false })
            .limit(20)

        if ( error ) {
            console.log(error)
            return
        }

        setHistory(data)
    }

    useEffect(() => {
        fetchHistory()
    }, [])

    const addToHistory = async (city: string, country: string, lat: number, lon: number) => {
        const { data: { user } } = await supabase.auth.getUser()
        if(!user) return


        const { error } = await supabase
            .schema("weather")
            .from("search_history")
            .insert({ user_id: user.id, city, country, lat, lon })

        if (error) {
            console.error(error)
            return
        }

        fetchHistory()
    }

    const clearHistory = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .schema("weather")
            .from("search_history")
            .delete()
            .eq("user_id", user.id)

        if (error) {
            console.error(error)
            return
        }

        setHistory([])
    }

    return { history, addToHistory, clearHistory }
}