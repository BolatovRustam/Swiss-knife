export type Task = {
    id: string,
    user_id: string,
    completed: boolean,
    title: string,
    priority: string,
    date: string,
    isTemp?: boolean
}