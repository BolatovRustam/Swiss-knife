import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { FavoriteCity } from "./types"

export function useFavortites() {
    const [ favorites, setFavorites ] = useState<FavoriteCity[]>([])

    const fetchFavorites = async () => {
        const { data, error } = await supabase
            .schema("weather")
            .from("favorites")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) {
            console.error(error)
            return
        }

        setFavorites(data)
    }

    useEffect(() => {
        fetchFavorites()
    }, [])

    const addFavorite = async ( city:string, country:string, lat:number, lon:number ) => {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { error } = await supabase
            .schema("weather")
            .from("favorites")
            .insert({ user_id: user.id, city, country, lat, lon })

        if (error) {
            console.error(error)
            return
        }

        fetchFavorites()
    }

    const removeFavorite = async (id: string) => {
        const { error } = await supabase
            .schema("weather")
            .from("favorites")
            .delete()
            .eq("id", id)

        if (error) {
            console.error(error)
            return
        }
        fetchFavorites()
    }

    return { favorites, addFavorite, removeFavorite }
}