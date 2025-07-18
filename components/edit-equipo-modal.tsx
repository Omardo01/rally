"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { supabase, type Equipo, type Participante } from "@/lib/supabase"

interface EditEquipoModalProps {
  equipo: Equipo | null
  participantes: Participante[]
  isOpen: boolean
  onClose: () => void
  onUpdate: (equipo: Equipo) => void
}

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

export function EditEquipoModal({ equipo, participantes, isOpen, onClose, onUpdate }: EditEquipoModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    color: "",
    lider: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Filtrar participantes del equipo actual para la selección de líder
  const participantesDelEquipo = participantes.filter((p) => p.equipo_id === equipo?.id)

  useEffect(() => {
    if (equipo) {
      setFormData({
        nombre: equipo.nombre,
        color: equipo.color,
        lider: equipo.lider,
      })
    }
  }, [equipo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!equipo) return

    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from("equipos")
        .update({
          nombre: formData.nombre,
          color: formData.color,
          lider: formData.lider,
        })
        .eq("id", equipo.id)
        .select()

      if (error) {
        console.error("Error al actualizar equipo:", error)
        toast({
          title: "Error",
          description: "No se pudo actualizar el equipo",
          variant: "destructive",
        })
        return
      }

      if (data && data[0]) {
        onUpdate(data[0])
        toast({
          title: "¡Actualizado!",
          description: "La información del equipo ha sido actualizada",
        })
        onClose()
      }
    } catch (error) {
      console.error("Error inesperado:", error)
      toast({
        title: "Error",
        description: "Hubo un problema inesperado",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getColorClass = (color: string) => {
    const colorObj = coloresDisponibles.find((c) => c.value === color)
    return colorObj?.class || "bg-gray-500"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle>Editar Equipo</DialogTitle>
          <DialogDescription className="text-gray-600">Modifica la información del equipo</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-nombre-equipo" className="text-gray-700">
              Nombre del Equipo
            </Label>
            <Input
              id="edit-nombre-equipo"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-color-equipo" className="text-gray-700">
              Color del Equipo
            </Label>
            <Select
              value={formData.color}
              onValueChange={(value) => setFormData({ ...formData, color: value })}
              disabled={isLoading}
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
            <Label htmlFor="edit-lider-equipo" className="text-gray-700">
              Líder del Equipo
            </Label>
            <div className="space-y-2">
              <Input
                id="edit-lider-equipo"
                value={formData.lider}
                onChange={(e) => setFormData({ ...formData, lider: e.target.value })}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                placeholder="Escribe el nombre del líder"
                disabled={isLoading}
              />
              {participantesDelEquipo.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">O selecciona de los participantes del equipo:</p>
                  <Select
                    value=""
                    onValueChange={(value) => setFormData({ ...formData, lider: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white">
                      <SelectValue placeholder="Seleccionar participante como líder" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      {participantesDelEquipo.map((participante) => (
                        <SelectItem key={participante.id} value={participante.nombre} className="hover:bg-gray-50">
                          {participante.nombre} ({participante.edad} años)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
