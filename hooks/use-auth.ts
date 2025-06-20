"use client"

import { useState, useEffect } from "react"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      const authStatus = localStorage.getItem("admin_authenticated")
      const loginTime = localStorage.getItem("admin_login_time")

      if (authStatus === "true" && loginTime) {
        // Verificar si la sesión no ha expirado (24 horas)
        const loginTimestamp = Number.parseInt(loginTime)
        const currentTime = Date.now()
        const twentyFourHours = 24 * 60 * 60 * 1000

        if (currentTime - loginTimestamp < twentyFourHours) {
          setIsAuthenticated(true)
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

  const login = () => {
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("admin_authenticated")
    localStorage.removeItem("admin_login_time")
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  }
}
