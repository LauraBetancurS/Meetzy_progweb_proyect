import { useAuth } from "../context/AuthContext"
import type { FormEvent } from "react"

export function RegisterPage() {

    const { register } = useAuth()

    const handleRegister = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.target as HTMLFormElement
        const formData = new FormData(form)

        const userName = formData.get("userName") as string
        const password = formData.get("password") as string
        const fullName = formData.get("fullName") as string
        const email = formData.get("email") as string

        const newUser = {
            userName,
            email,
            password,
            fullName,
        }

        register(newUser)        
    }

    return (
        <form onSubmit={handleRegister}>
            <input type="text" placeholder="fullName" name="fullName" />
            <input type="email" placeholder="email" name="email" />
            <input type="text" placeholder="userName" name="userName" />
            <input type="password" placeholder="password" name="password" />
            <button type="submit">register</button>
        </form>
    )
}