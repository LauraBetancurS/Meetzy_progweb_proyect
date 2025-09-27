import { useAuth } from "../context/AuthContext"
import type { FormEvent } from "react"

export function Login() {

    const { login } = useAuth()

    const handleLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.target as HTMLFormElement
        const formData = new FormData(form)

        const userName = formData.get("userName") as string
        const password = formData.get("password") as string

        login(userName, password)        
    }

    return (
        <form onSubmit={handleLogin}>
            <input type="text" placeholder="userName" name="userName" />
            <input type="password" placeholder="password" name="password" />
            <button type="submit">Login</button>
        </form>
    )
}