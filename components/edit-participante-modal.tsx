"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { supabase, type Participante } from "@/lib/supabase"

interface EditParticipanteModalProps {
  participante: Participante | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (participante: Participante) => void
}

export function EditParticipanteModal({ participante, isOpen, onClose, onUpdate }: EditParticipanteModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    edad: "",
    alergias: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (participante) {
      setFormData({
        nombre: participante.nombre,
        telefono: participante.telefono,
        edad: participante.edad.toString(),
        alergias: participante.alergias || "",
      })
    }
  }, [participante])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!participante) return

    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from("participantes")
        .update({
          nombre: formData.nombre,
          telefono: formData.telefono,
          edad: Number.parseInt(formData.edad),
          alergias: formData.alergias || null,
        })
        .eq("id", participante.id)
        .select()

      if (error) {
        console.error("Error al actualizar participante:", error)
        toast({
          title: "Error",
          description: "No se pudo actualizar el participante",
          variant: "destructive",
        })
        return
      }

      if (data && data[0]) {
        onUpdate(data[0])
        toast({
          title: "¡Actualizado!",
          description: "La información del participante ha sido actualizada",
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle>Editar Participante</DialogTitle>
          <DialogDescription className="text-gray-600">Modifica la información del participante</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-nombre" className="text-gray-700">
              Nombre Completo
            </Label>
            <Input
              id="edit-nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-telefono" className="text-gray-700">
              Teléfono
            </Label>
            <Input
              id="edit-telefono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-edad" className="text-gray-700">
              Edad
            </Label>
            <Input
              id="edit-edad"
              type="number"
              min="1"
              max="120"
              value={formData.edad}
              onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-alergias" className="text-gray-700">
              Alergias/Enfermedades
            </Label>
            <Textarea
              id="edit-alergias"
              value={formData.alergias}
              onChange={(e) => setFormData({ ...formData, alergias: e.target.value })}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
              disabled={isLoading}
            />
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
