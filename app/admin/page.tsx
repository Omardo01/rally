"use client"

import { EquiposManager } from "@/components/equipos-manager"
import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { ArrowLeft, LogOut, Loader2 } from "lucide-react"

export default function AdminPage() {
  const { isAuthenticated, isLoading, login, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Registro
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mini Rally - Panel de Administración</h1>
          </div>

          <Button
            variant="outline"
            onClick={logout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        <EquiposManager />
      </div>
    </div>
  )
}
