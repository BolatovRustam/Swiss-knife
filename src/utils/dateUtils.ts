export function formateRelativeDate(dateStringh: string): string {
    const date = new Date(dateStringh)
    const now = new Date()

    const dataOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const diffDays = Math.round( (nowOnly.getTime() - dataOnly.getTime()) / (1000 * 60 * 60 * 24) )

    const time = date.toLocaleTimeString('ru-RU', { hour:"2-digit", minute: "2-digit" })

    if (diffDays === 0) return `Сегодня, ${time}`
    if (diffDays === 1) return `Вчера, ${time}`
    if (diffDays < 7) {
        const weekday = date.toLocaleDateString('ru-RU', { weekday: 'long' })
        return `${weekday[0].toUpperCase() + weekday.slice(1)}, ${time} `
    }

    return `${date.toLocaleString('ru-RU', { day:"numeric", month:"long" })}  ${time}` 
}