import { createContext } from "react";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import usersMock from "../mocks/users.json"

interface AuthContextType {
    user: UserType | null
    login: (userName: string, password: string) => void
    logout: () => void
    register: (user: UserType) => void | boolean
}

interface UserType {
    fullName: string,
    email: string,
    password: string,
    userName: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const loggedUser = localStorage.getItem("loggedUser")
    const [user, setUser] = useState<UserType | null>(loggedUser ? JSON.parse(loggedUser) : null)
    const navigate = useNavigate()

    useEffect(() => {
        const users = localStorage.getItem("users")
        if (!users) {
            localStorage.setItem("users", JSON.stringify(usersMock))
        }
    }, [])

    const login = (userName: string, password: string) => {
        const storedUsers = localStorage.getItem("users")
        const users: UserType[] = storedUsers ? JSON.parse(storedUsers) : []

        const loggedUser = users.find(existingUser =>
            existingUser.userName === userName &&
            existingUser.password === password
        )

        if (loggedUser) {
            setUser(loggedUser)
            localStorage.setItem("loggedUser", JSON.stringify(loggedUser))
            navigate("/")
        }

    }


    const logout = () => {
        setUser(null)
        localStorage.removeItem("loggedUser")
    }

    const register = (newUser: UserType): void => {
        const storedUsers = localStorage.getItem("users")
        const users: UserType[] = storedUsers ? JSON.parse(storedUsers) : []

        const userExists = users.some(existingUser =>
            existingUser.userName === newUser.userName ||
            existingUser.email === newUser.email
        )

        if (userExists) {
            window.alert("User Already Exists")
        }

        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))
        localStorage.setItem("loggedUser", JSON.stringify(newUser))

        return login(newUser.userName, newUser.password)
    }


    const value: AuthContextType = {
        user,
        login,
        logout,
        register
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext)

    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider')
    }

    return context
}