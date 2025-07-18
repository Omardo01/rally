"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  Phone,
  Calendar,
  Loader2,
  RefreshCw,
  Edit,
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowLeft,
  LogOut,
  Crown,
} from "lucide-react"
import { supabase, type Participante, type Equipo } from "@/lib/supabase"
import { EditParticipanteModal } from "@/components/edit-participante-modal"
import type { UsuarioEquipo } from "@/hooks/use-auth"
import Link from "next/link"

interface EquipoViewProps {
  currentUser: UsuarioEquipo
  onLogout: () => void
}

const getThemeClasses = (colorClass: string) => {
  const themes = {
    red: {
      bg: "from-red-50 to-red-100",
      cardBg: "bg-red-50",
      accent: "text-red-600",
      button: "bg-red-600 hover:bg-red-700",
      border: "border-red-200",
      badge: "bg-red-100 text-red-800",
    },
    blue: {
      bg: "from-blue-50 to-blue-100",
      cardBg: "bg-blue-50",
      accent: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
      border: "border-blue-200",
      badge: "bg-blue-100 text-blue-800",
    },
    gray: {
      bg: "from-gray-50 to-gray-100",
      cardBg: "bg-gray-50",
      accent: "text-gray-600",
      button: "bg-gray-600 hover:bg-gray-700",
      border: "border-gray-200",
      badge: "bg-gray-100 text-gray-800",
    },
    yellow: {
      bg: "from-yellow-50 to-yellow-100",
      cardBg: "bg-yellow-50",
      accent: "text-yellow-600",
      button: "bg-yellow-600 hover:bg-yellow-700",
      border: "border-yellow-200",
      badge: "bg-yellow-100 text-yellow-800",
    },
    purple: {
      bg: "from-purple-50 to-purple-100",
      cardBg: "bg-purple-50",
      accent: "text-purple-600",
      button: "bg-purple-600 hover:bg-purple-700",
      border: "border-purple-200",
      badge: "bg-purple-100 text-purple-800",
    },
  }
  return themes[colorClass as keyof typeof themes] || themes.blue
}

export function EquipoView({ currentUser, onLogout }: EquipoViewProps) {
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [equipo, setEquipo] = useState<Equipo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [editingParticipante, setEditingParticipante] = useState<Participante | null>(null)
  const { toast } = useToast()

  const theme = getThemeClasses(currentUser.colorClass)

  const cargarDatos = async () => {
    try {
      setIsLoading(true)

      // Buscar el equipo por color
      const { data: equipoData, error: equipoError } = await supabase
        .from("equipos")
        .select("*")
        .eq("color", currentUser.color)
        .single()

      if (equipoError && equipoError.code !== "PGRST116") {
        console.error("Error al cargar equipo:", equipoError)
        toast({
          title: "Error",
          description: "No se pudo cargar la información del equipo",
          variant: "destructive",
        })
        return
      }

      setEquipo(equipoData)

      if (equipoData) {
        // Cargar participantes del equipo
        const { data: participantesData, error: participantesError } = await supabase
          .from("participantes")
          .select("*")
          .eq("equipo_id", equipoData.id)
          .order("fecha_registro", { ascending: false })

        if (participantesError) {
          console.error("Error al cargar participantes:", participantesError)
          toast({
            title: "Error",
            description: "No se pudieron cargar los participantes del equipo",
            variant: "destructive",
          })
          return
        }

        setParticipantes(participantesData || [])
      }
    } catch (error) {
      console.error("Error inesperado al cargar datos:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al cargar los datos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [currentUser])

  const togglePagado = async (participanteId: string, pagado: boolean) => {
    try {
      const { error } = await supabase.from("participantes").update({ pagado }).eq("id", participanteId)

      if (error) {
        console.error("Error al actualizar estado de pago:", error)
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado de pago",
          variant: "destructive",
        })
        return
      }

      // Actualizar estado local
      const participantesActualizados = participantes.map((p) => (p.id === participanteId ? { ...p, pagado } : p))
      setParticipantes(participantesActualizados)

      const participante = participantes.find((p) => p.id === participanteId)
      toast({
        title: "Estado actualizado",
        description: `${participante?.nombre} marcado como ${pagado ? "PAGADO" : "NO PAGADO"}`,
      })
    } catch (error) {
      console.error("Error inesperado:", error)
      toast({
        title: "Error",
        description: "Hubo un problema inesperado",
        variant: "destructive",
      })
    }
  }

  const participantesPagados = participantes.filter((p) => p.pagado).length

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center p-4`}>
        <div className="text-center space-y-4">
          <Loader2 className={`w-8 h-8 animate-spin mx-auto ${theme.accent}`} />
          <p className="text-gray-600">Cargando información del equipo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} py-4 sm:py-8`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Registro
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full bg-${currentUser.color}-500`}></div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{currentUser.equipo}</h1>
                <p className="text-gray-600">Panel de Gestión</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={cargarDatos} disabled={isLoading} className="bg-white hover:bg-gray-50">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </Button>
            <Button
              variant="outline"
              onClick={onLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>

        {/* Estadísticas del equipo */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className={`bg-white ${theme.border}`}>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Users className={`w-6 h-6 sm:w-8 sm:h-8 ${theme.accent} mx-auto sm:mx-0`} />
                <div className="text-center sm:text-left">
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{participantes.length}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Miembros</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-white ${theme.border}`}>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <DollarSign className={`w-6 h-6 sm:w-8 sm:h-8 ${theme.accent} mx-auto sm:mx-0`} />
                <div className="text-center sm:text-left">
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{participantesPagados}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Pagados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-white ${theme.border} col-span-2 sm:col-span-1`}>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Crown className={`w-6 h-6 sm:w-8 sm:h-8 ${theme.accent} mx-auto sm:mx-0`} />
                <div className="text-center sm:text-left">
                  <p className="text-sm sm:text-base font-bold text-gray-900 truncate">
                    {equipo?.lider || "Sin líder"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Líder</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información del equipo */}
        {equipo && (
          <Card className={`bg-white ${theme.border} mb-6 sm:mb-8`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full bg-${currentUser.color}-500`}></div>
                <div>
                  <CardTitle className="text-gray-900">{equipo.nombre}</CardTitle>
                  <CardDescription className="text-gray-600">
                    Creado el {new Date(equipo.fecha_creacion).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Lista de miembros */}
        <Card className={`bg-white ${theme.border}`}>
          <CardHeader>
            <CardTitle className="text-gray-900">Miembros del Equipo ({participantes.length})</CardTitle>
            <CardDescription className="text-gray-600">
              Gestiona la información de los miembros de tu equipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {participantes.length > 0 ? (
              <div className="space-y-4">
                {participantes.map((participante) => (
                  <div
                    key={participante.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 ${theme.cardBg} rounded-lg gap-4`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                        <h4 className="font-medium text-gray-900">{participante.nombre}</h4>
                        <Badge
                          variant={participante.pagado ? "default" : "destructive"}
                          className={participante.pagado ? theme.badge : ""}
                        >
                          {participante.pagado ? "PAGADO" : "NO PAGADO"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {participante.telefono}
                        </span>
                        <span>{participante.edad} años</span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(participante.fecha_registro).toLocaleDateString()}
                        </span>
                      </div>
                      {participante.alergias && (
                        <p className="text-sm text-red-600">
                          <strong>Alergias/Enfermedades:</strong> {participante.alergias}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      {/* Toggle Pagado */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePagado(participante.id, !participante.pagado)}
                        className={
                          participante.pagado
                            ? "text-green-600 border-green-200 hover:bg-green-50"
                            : "text-red-600 border-red-200 hover:bg-red-50"
                        }
                      >
                        {participante.pagado ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        <span className="ml-2 sm:hidden">{participante.pagado ? "Pagado" : "No Pagado"}</span>
                      </Button>

                      {/* Editar participante */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingParticipante(participante)}
                        className={`${theme.accent} border-current hover:bg-current hover:bg-opacity-10 flex-1 sm:flex-none`}
                      >
                        <Edit className="w-4 h-4" />
                        <span className="ml-2 sm:hidden">Editar</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay miembros asignados a este equipo aún.</p>
                <p className="text-sm">Los participantes aparecerán aquí cuando sean asignados por el administrador.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de edición */}
        <EditParticipanteModal
          participante={editingParticipante}
          isOpen={!!editingParticipante}
          onClose={() => setEditingParticipante(null)}
          onUpdate={(updatedParticipante) => {
            setParticipantes(participantes.map((p) => (p.id === updatedParticipante.id ? updatedParticipante : p)))
          }}
        />
      </div>
    </div>
  )
}
