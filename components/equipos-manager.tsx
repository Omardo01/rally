"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Users, Plus, UserCheck, Phone, Calendar, Loader2, RefreshCw } from "lucide-react"
import { supabase, type Participante, type Equipo } from "@/lib/supabase"

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
      const { error } = await supabase.from("participantes").update({ equipo_id: equipoId }).eq("id", participanteId)

      if (error) {
        console.error("Error al asignar participante:", error)
        toast({
          title: "Error",
          description: "No se pudo asignar el participante al equipo",
          variant: "destructive",
        })
        return
      }

      // Actualizar estado local
      const participantesActualizados = participantes.map((p) =>
        p.id === participanteId ? { ...p, equipo_id: equipoId } : p,
      )
      setParticipantes(participantesActualizados)

      const participante = participantes.find((p) => p.id === participanteId)
      const equipo = equipos.find((e) => e.id === equipoId)

      toast({
        title: "Asignación exitosa",
        description: `${participante?.nombre} ha sido asignado al equipo ${equipo?.nombre}`,
      })
    } catch (error) {
      console.error("Error inesperado al asignar participante:", error)
      toast({
        title: "Error",
        description: "Hubo un problema inesperado al asignar el participante",
        variant: "destructive",
      })
    }
  }

  const participantesSinEquipo = participantes.filter((p) => !p.equipo_id)

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
    <div className="space-y-8">
      {/* Botón de actualizar */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={cargarDatos} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Actualizar Datos
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{participantes.length}</p>
                <p className="text-sm text-gray-600">Participantes Registrados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{equipos.length}</p>
                <p className="text-sm text-gray-600">Equipos Creados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Plus className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{participantesSinEquipo.length}</p>
                <p className="text-sm text-gray-600">Sin Asignar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crear Nuevo Equipo */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestión de Equipos</CardTitle>
              <CardDescription>Crea equipos y asigna participantes</CardDescription>
            </div>
            <Button onClick={() => setMostrarFormEquipo(!mostrarFormEquipo)} disabled={isCreatingTeam}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Equipo
            </Button>
          </div>
        </CardHeader>

        {mostrarFormEquipo && (
          <CardContent>
            <form onSubmit={crearEquipo} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreEquipo">Nombre del Equipo</Label>
                  <Input
                    id="nombreEquipo"
                    placeholder="Ej: Los Tigres"
                    value={nuevoEquipo.nombre}
                    onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, nombre: e.target.value })}
                    required
                    disabled={isCreatingTeam}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colorEquipo">Color del Equipo</Label>
                  <Select
                    value={nuevoEquipo.color}
                    onValueChange={(value) => setNuevoEquipo({ ...nuevoEquipo, color: value })}
                    disabled={isCreatingTeam}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un color" />
                    </SelectTrigger>
                    <SelectContent>
                      {coloresDisponibles.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
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
                  <Label htmlFor="liderEquipo">Líder del Equipo</Label>
                  <Input
                    id="liderEquipo"
                    placeholder="Nombre del líder"
                    value={nuevoEquipo.lider}
                    onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, lider: e.target.value })}
                    required
                    disabled={isCreatingTeam}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isCreatingTeam}>
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
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Lista de Equipos */}
      {equipos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Equipos Creados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {equipos.map((equipo) => {
              const miembros = getParticipantesPorEquipo(equipo.id)
              return (
                <Card key={equipo.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full ${getColorClass(equipo.color)}`}></div>
                      <div>
                        <CardTitle className="text-lg">{equipo.nombre}</CardTitle>
                        <CardDescription>Líder: {equipo.lider}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">Miembros ({miembros.length}):</p>
                      {miembros.length > 0 ? (
                        <div className="space-y-1">
                          {miembros.map((miembro) => (
                            <div
                              key={miembro.id}
                              className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                            >
                              <span>{miembro.nombre}</span>
                              <span className="text-gray-500">{miembro.edad} años</span>
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

      {/* Participantes Sin Asignar */}
      {participantesSinEquipo.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Participantes Sin Asignar ({participantesSinEquipo.length})</CardTitle>
            <CardDescription>Asigna estos participantes a un equipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {participantesSinEquipo.map((participante) => (
                <div key={participante.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{participante.nombre}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
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

                  {equipos.length > 0 && (
                    <Select onValueChange={(equipoId) => asignarParticipanteAEquipo(participante.id, equipoId)}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Asignar a equipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipos.map((equipo) => (
                          <SelectItem key={equipo.id} value={equipo.id}>
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${getColorClass(equipo.color)}`}></div>
                              <span>{equipo.nombre}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {participantes.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay participantes registrados aún.</p>
              <p className="text-sm">Los participantes aparecerán aquí cuando se registren.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
