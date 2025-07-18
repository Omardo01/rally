"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Lock, User, Loader2 } from "lucide-react"
import { useAuth, type UsuarioEquipo } from "@/hooks/use-auth"

interface LoginFormProps {
  onLogin: (user: UsuarioEquipo) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [credentials, setCredentials] = useState({
    usuario: "",
    contraseña: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { usuariosEquipos } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular un pequeño delay para mejor UX
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Buscar usuario válido
    const usuarioValido = usuariosEquipos.find(
      (user) => user.usuario === credentials.usuario && user.contraseña === credentials.contraseña,
    )

    if (usuarioValido) {
      toast({
        title: "¡Acceso concedido!",
        description: `Bienvenido ${usuarioValido.equipo}`,
      })

      onLogin(usuarioValido)
    } else {
      toast({
        title: "Credenciales incorrectas",
        description: "Usuario o contraseña incorrectos. Por favor intenta de nuevo.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-gray-200 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Acceso al Sistema</CardTitle>
          <CardDescription className="text-gray-600">Ingresa tus credenciales para acceder a tu panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usuario" className="text-gray-700 font-medium">
                Usuario
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="usuario"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                  value={credentials.usuario}
                  onChange={(e) => setCredentials({ ...credentials, usuario: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contraseña" className="text-gray-700 font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="contraseña"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                  value={credentials.contraseña}
                  onChange={(e) => setCredentials({ ...credentials, contraseña: e.target.value })}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">Usuarios disponibles:</p>
            <div className="text-xs text-blue-700 space-y-1">
              <div>
                • <strong>admin</strong> - Panel completo de administración
              </div>
              <div>
                • <strong>rojo</strong> - Vista del Equipo Rojo
              </div>
              <div>
                • <strong>azul</strong> - Vista del Equipo Azul
              </div>
              <div>
                • <strong>gris</strong> - Vista del Equipo Gris
              </div>
              <div>
                • <strong>amarillo</strong> - Vista del Equipo Amarillo
              </div>
              <div>
                • <strong>blanco</strong> - Vista del Equipo Blanco
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
