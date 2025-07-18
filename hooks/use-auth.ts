"use client"

import { useState, useEffect } from "react"

export interface UsuarioEquipo {
  usuario: string
  contraseña: string
  equipo: string
  color: string
  colorClass: string
}

const usuariosEquipos: UsuarioEquipo[] = [
  { usuario: "admin", contraseña: "omar6284", equipo: "Administrador", color: "admin", colorClass: "blue" },
  { usuario: "rojo", contraseña: "rojo", equipo: "Equipo Rojo", color: "red", colorClass: "red" },
  { usuario: "azul", contraseña: "azul", equipo: "Equipo Azul", color: "blue", colorClass: "blue" },
  { usuario: "gris", contraseña: "gris", equipo: "Equipo Gris", color: "gray", colorClass: "gray" },
  { usuario: "amarillo", contraseña: "amarillo", equipo: "Equipo Amarillo", color: "yellow", colorClass: "yellow" },
  { usuario: "blanco", contraseña: "blanco", equipo: "Equipo Blanco", color: "white", colorClass: "purple" },
]

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<UsuarioEquipo | null>(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      const authStatus = localStorage.getItem("admin_authenticated")
      const loginTime = localStorage.getItem("admin_login_time")
      const userData = localStorage.getItem("current_user")

      if (authStatus === "true" && loginTime && userData) {
        // Verificar si la sesión no ha expirado (24 horas)
        const loginTimestamp = Number.parseInt(loginTime)
        const currentTime = Date.now()
        const twentyFourHours = 24 * 60 * 60 * 1000

        if (currentTime - loginTimestamp < twentyFourHours) {
          setIsAuthenticated(true)
          setCurrentUser(JSON.parse(userData))
        } else {
          // Sesión expirada
          logout()
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = (user: UsuarioEquipo) => {
    setIsAuthenticated(true)
    setCurrentUser(user)
    localStorage.setItem("admin_authenticated", "true")
    localStorage.setItem("admin_login_time", Date.now().toString())
    localStorage.setItem("current_user", JSON.stringify(user))
  }

  const logout = () => {
    localStorage.removeItem("admin_authenticated")
    localStorage.removeItem("admin_login_time")
    localStorage.removeItem("current_user")
    setIsAuthenticated(false)
    setCurrentUser(null)
  }

  return {
    isAuthenticated,
    isLoading,
    currentUser,
    usuariosEquipos,
    login,
    logout,
  }
}
