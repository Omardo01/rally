"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  Plus,
  UserCheck,
  Phone,
  Calendar,
  Loader2,
  RefreshCw,
  Edit,
  Trash2,
  DollarSign,
  CheckCircle,
  XCircle,
  Settings,
} from "lucide-react"
import { supabase, type Participante, type Equipo } from "@/lib/supabase"
import { EditParticipanteModal } from "@/components/edit-participante-modal"
import { EditEquipoModal } from "@/components/edit-equipo-modal"

const coloresDisponibles = [
  { value: "red", label: "Rojo", class: "bg-red-500" },
  { value: "blue", label: "Azul", class: "bg-blue-500" },
  { value: "green", label: "Verde", class: "bg-green-500" },
  { value: "yellow", label: "Amarillo", class: "bg-yellow-500" },
  { value: "purple", label: "Morado", class: "bg-purple-500" },
  { value: "pink", label: "Rosa", class: "bg-pink-500" },
  { value: "orange", label: "Naranja", class: "bg-orange-500" },
  { value: "teal", label: "Verde Azulado", class: "bg-teal-500" },
]

export function EquiposManager() {
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombre: "",
    color: "",
    lider: "",
  })
  const [mostrarFormEquipo, setMostrarFormEquipo] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingTeam, setIsCreatingTeam] = useState(false)
  const [editingParticipante, setEditingParticipante] = useState<Participante | null>(null)
  const [editingEquipo, setEditingEquipo] = useState<Equipo | null>(null)
  const { toast } = useToast()

  const cargarDatos = async () => {
    try {
      setIsLoading(true)

      // Cargar participantes
      const { data: participantesData, error: participantesError } = await supabase
        .from("participantes")
        .select("*")
        .order("fecha_registro", { ascending: false })

      if (participantesError) {
        console.error("Error al cargar participantes:", participantesError)
        toast({
          title: "Error",
          description: "No se pudieron cargar los participantes",
          variant: "destructive",
        })
        return
      }

      // Cargar equipos
      const { data: equiposData, error: equiposError } = await supabase
        .from("equipos")
        .select("*")
        .order("fecha_creacion", { ascending: false })

      if (equiposError) {
        console.error("Error al cargar equipos:", equiposError)
        toast({
          title: "Error",
          description: "No se pudieron cargar los equipos",
          variant: "destructive",
        })
        return
      }

      setParticipantes(participantesData || [])
      setEquipos(equiposData || [])
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
  }, [])

  const crearEquipo = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nuevoEquipo.nombre || !nuevoEquipo.color || !nuevoEquipo.lider) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos del equipo",
        variant: "destructive",
      })
      return
    }

    setIsCreatingTeam(true)

    try {
      const { data, error } = await supabase
        .from("equipos")
        .insert([
          {
            nombre: nuevoEquipo.nombre,
            color: nuevoEquipo.color,
            lider: nuevoEquipo.lider,
          },
        ])
        .select()

      if (error) {
        console.error("Error al crear equipo:", error)
        toast({
          title: "Error",
          description: "No se pudo crear el equipo. Por favor intenta de nuevo.",
          variant: "destructive",
        })
        return
      }

      if (data && data[0]) {
        setEquipos([data[0], ...equipos])
        setNuevoEquipo({ nombre: "", color: "", lider: "" })
        setMostrarFormEquipo(false)

        toast({
          title: "¡Equipo creado!",
          description: `El equipo "${data[0].nombre}" ha sido creado exitosamente`,
        })
      }
    } catch (error) {
      console.error("Error inesperado al crear equipo:", error)
      toast({
        title: "Error",
        description: "Hubo un problema inesperado al crear el equipo",
        variant: "destructive",
      })
    } finally {
      setIsCreatingTeam(false)
    }
  }

  const asignarParticipanteAEquipo = async (participanteId: string, equipoId: string) => {
    try {
      const { error } = await supabase
        .from("participantes")
        .update({ equipo_id: equipoId || null })
        .eq("id", participanteId)

      if (error) {
        console.error("Error al asignar participante:", error)
        toast({
          title: "Error",
          description: "No se pudo actualizar la asignación del participante",
          variant: "destructive",
        })
        return
      }

      // Actualizar estado local
      const participantesActualizados = participantes.map((p) =>
        p.id === participanteId ? { ...p, equipo_id: equipoId || null } : p,
      )
      setParticipantes(participantesActualizados)

      const participante = participantes.find((p) => p.id === participanteId)

      if (equipoId) {
        const equipo = equipos.find((e) => e.id === equipoId)
        toast({
          title: "Asignación exitosa",
          description: `${participante?.nombre} ha sido asignado al equipo ${equipo?.nombre}`,
        })
      } else {
        toast({
          title: "Participante removido",
          description: `${participante?.nombre} ha sido removido del equipo`,
        })
      }
    } catch (error) {
      console.error("Error inesperado al asignar participante:", error)
      toast({
        title: "Error",
        description: "Hubo un problema inesperado al asignar el participante",
        variant: "destructive",
      })
    }
  }

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

  const eliminarParticipante = async (participanteId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este participante?")) return

    try {
      const { error } = await supabase.from("participantes").delete().eq("id", participanteId)

      if (error) {
        console.error("Error al eliminar participante:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el participante",
          variant: "destructive",
        })
        return
      }

      setParticipantes(participantes.filter((p) => p.id !== participanteId))
      toast({
        title: "Participante eliminado",
        description: "El participante ha sido eliminado exitosamente",
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

  const eliminarEquipo = async (equipoId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este equipo? Los participantes quedarán sin equipo.")) return

    try {
      const { error } = await supabase.from("equipos").delete().eq("id", equipoId)

      if (error) {
        console.error("Error al eliminar equipo:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el equipo",
          variant: "destructive",
        })
        return
      }

      setEquipos(equipos.filter((e) => e.id !== equipoId))
      // Actualizar participantes que estaban en este equipo
      const participantesActualizados = participantes.map((p) =>
        p.equipo_id === equipoId ? { ...p, equipo_id: null } : p,
      )
      setParticipantes(participantesActualizados)

      toast({
        title: "Equipo eliminado",
        description: "El equipo ha sido eliminado exitosamente",
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

  const participantesSinEquipo = participantes.filter((p) => !p.equipo_id)
  const participantesPagados = participantes.filter((p) => p.pagado).length

  const getColorClass = (color: string) => {
    const colorObj = coloresDisponibles.find((c) => c.value === color)
    return colorObj?.class || "bg-gray-500"
  }

  const getParticipantesPorEquipo = (equipoId: string) => {
    return participantes.filter((p) => p.equipo_id === equipoId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Botón de actualizar */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={cargarDatos} disabled={isLoading} className="bg-white hover:bg-gray-50">
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Actualizar Datos</span>
          <span className="sm:hidden">Actualizar</span>
        </Button>
      </div>

      {/* Estadísticas - Mejoradas para móvil */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mx-auto sm:mx-0" />
              <div className="text-center sm:text-left">
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{participantes.length}</p>
                <p className="text-xs sm:text-sm text-gray-600">Participantes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mx-auto sm:mx-0" />
              <div className="text-center sm:text-left">
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{equipos.length}</p>
                <p className="text-xs sm:text-sm text-gray-600">Equipos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 mx-auto sm:mx-0" />
              <div className="text-center sm:text-left">
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{participantesPagados}</p>
                <p className="text-xs sm:text-sm text-gray-600">Pagados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mx-auto sm:mx-0" />
              <div className="text-center sm:text-left">
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{participantesSinEquipo.length}</p>
                <p className="text-xs sm:text-sm text-gray-600">Sin Asignar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crear Nuevo Equipo */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-gray-900">Gestión de Equipos</CardTitle>
              <CardDescription className="text-gray-600">Crea equipos y asigna participantes</CardDescription>
            </div>
            <Button
              onClick={() => setMostrarFormEquipo(!mostrarFormEquipo)}
              disabled={isCreatingTeam}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Equipo
            </Button>
          </div>
        </CardHeader>

        {mostrarFormEquipo && (
          <CardContent>
            <form onSubmit={crearEquipo} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreEquipo" className="text-gray-700 font-medium">
                    Nombre del Equipo
                  </Label>
                  <Input
                    id="nombreEquipo"
                    placeholder="Ej: Los Tigres"
                    value={nuevoEquipo.nombre}
                    onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, nombre: e.target.value })}
                    required
                    disabled={isCreatingTeam}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colorEquipo" className="text-gray-700 font-medium">
                    Color del Equipo
                  </Label>
                  <Select
                    value={nuevoEquipo.color}
                    onValueChange={(value) => setNuevoEquipo({ ...nuevoEquipo, color: value })}
                    disabled={isCreatingTeam}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white">
                      <SelectValue placeholder="Selecciona un color" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      {coloresDisponibles.map((color) => (
                        <SelectItem key={color.value} value={color.value} className="hover:bg-gray-50">
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full ${color.class}`}></div>
                            <span>{color.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="liderEquipo" className="text-gray-700 font-medium">
                    Líder del Equipo
                  </Label>
                  <Input
                    id="liderEquipo"
                    placeholder="Nombre del líder"
                    value={nuevoEquipo.lider}
                    onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, lider: e.target.value })}
                    required
                    disabled={isCreatingTeam}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="submit"
                  disabled={isCreatingTeam}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                >
                  {isCreatingTeam ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear Equipo"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMostrarFormEquipo(false)}
                  disabled={isCreatingTeam}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Lista de Equipos - Mejorada para móvil */}
      {equipos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Equipos Creados</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {equipos.map((equipo) => {
              const miembros = getParticipantesPorEquipo(equipo.id)
              return (
                <Card key={equipo.id} className="bg-white border-gray-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full ${getColorClass(equipo.color)}`}></div>
                        <div>
                          <CardTitle className="text-lg text-gray-900">{equipo.nombre}</CardTitle>
                          <CardDescription className="text-gray-600">Líder: {equipo.lider}</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-1 sm:gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingEquipo(equipo)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 p-2"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => eliminarEquipo(equipo.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">Miembros ({miembros.length}):</p>
                      {miembros.length > 0 ? (
                        <div className="space-y-2">
                          {miembros.map((miembro) => (
                            <div
                              key={miembro.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between text-sm bg-gray-50 p-3 rounded gap-2"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                <span className="text-gray-900 font-medium">{miembro.nombre}</span>
                                <Badge variant={miembro.pagado ? "default" : "destructive"} className="text-xs w-fit">
                                  {miembro.pagado ? "PAGADO" : "NO PAGADO"}
                                </Badge>
                                <span className="text-gray-500 text-xs">{miembro.edad} años</span>
                              </div>

                              {/* Botones de acción - Optimizados para móvil */}
                              <div className="flex items-center space-x-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => togglePagado(miembro.id, !miembro.pagado)}
                                  className={
                                    miembro.pagado
                                      ? "text-green-600 border-green-200 hover:bg-green-50 h-8 w-8 p-0"
                                      : "text-red-600 border-red-200 hover:bg-red-50 h-8 w-8 p-0"
                                  }
                                  title={miembro.pagado ? "Marcar como NO PAGADO" : "Marcar como PAGADO"}
                                >
                                  {miembro.pagado ? (
                                    <CheckCircle className="w-3 h-3" />
                                  ) : (
                                    <XCircle className="w-3 h-3" />
                                  )}
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingParticipante(miembro)}
                                  className="text-blue-600 border-blue-200 hover:bg-blue-50 h-8 w-8 p-0"
                                  title="Editar participante"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => asignarParticipanteAEquipo(miembro.id, "")}
                                  className="text-orange-600 border-orange-200 hover:bg-orange-50 h-8 w-8 p-0"
                                  title="Quitar del equipo"
                                >
                                  <UserCheck className="w-3 h-3" />
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => eliminarParticipante(miembro.id)}
                                  className="text-red-600 border-red-200 hover:bg-red-50 h-8 w-8 p-0"
                                  title="Eliminar participante"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No hay miembros asignados</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Participantes Sin Asignar - Mejorado para móvil */}
      {participantesSinEquipo.length > 0 && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Participantes Sin Asignar ({participantesSinEquipo.length})</CardTitle>
            <CardDescription className="text-gray-600">Asigna estos participantes a un equipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {participantesSinEquipo.map((participante) => (
                <div
                  key={participante.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <h4 className="font-medium text-gray-900">{participante.nombre}</h4>
                      <Badge variant={participante.pagado ? "default" : "destructive"} className="w-fit">
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

                    {/* Asignar a equipo */}
                    {equipos.length > 0 && (
                      <Select onValueChange={(equipoId) => asignarParticipanteAEquipo(participante.id, equipoId)}>
                        <SelectTrigger className="w-full sm:w-48 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white">
                          <SelectValue placeholder="Asignar a equipo" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          {equipos.map((equipo) => (
                            <SelectItem key={equipo.id} value={equipo.id} className="hover:bg-gray-50">
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${getColorClass(equipo.color)}`}></div>
                                <span>{equipo.nombre}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    <div className="flex space-x-2">
                      {/* Editar participante */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingParticipante(participante)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 flex-1 sm:flex-none"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="ml-2 sm:hidden">Editar</span>
                      </Button>

                      {/* Eliminar participante */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => eliminarParticipante(participante.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50 flex-1 sm:flex-none"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="ml-2 sm:hidden">Eliminar</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {participantes.length === 0 && (
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay participantes registrados aún.</p>
              <p className="text-sm">Los participantes aparecerán aquí cuando se registren.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modales */}
      <EditParticipanteModal
        participante={editingParticipante}
        isOpen={!!editingParticipante}
        onClose={() => setEditingParticipante(null)}
        onUpdate={(updatedParticipante) => {
          setParticipantes(participantes.map((p) => (p.id === updatedParticipante.id ? updatedParticipante : p)))
        }}
      />

      <EditEquipoModal
        equipo={editingEquipo}
        participantes={participantes}
        isOpen={!!editingEquipo}
        onClose={() => setEditingEquipo(null)}
        onUpdate={(updatedEquipo) => {
          setEquipos(equipos.map((e) => (e.id === updatedEquipo.id ? updatedEquipo : e)))
        }}
      />
    </div>
  )
}
