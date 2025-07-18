"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function RegistroForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    edad: "",
    alergias: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validaciones
      if (!formData.nombre || !formData.telefono || !formData.edad) {
        toast({
          title: "Error",
          description: "Por favor completa todos los campos obligatorios",
          variant: "destructive",
        })
        return
      }

      if (Number.parseInt(formData.edad) < 1 || Number.parseInt(formData.edad) > 120) {
        toast({
          title: "Error",
          description: "Por favor ingresa una edad válida",
          variant: "destructive",
        })
        return
      }

      // Insertar en Supabase
      const { data, error } = await supabase
        .from("participantes")
        .insert([
          {
            nombre: formData.nombre,
            telefono: formData.telefono,
            edad: Number.parseInt(formData.edad),
            alergias: formData.alergias || null,
          },
        ])
        .select()

      if (error) {
        console.error("Error al insertar participante:", error)
        toast({
          title: "Error",
          description: "Hubo un problema al registrar tu información. Por favor intenta de nuevo.",
          variant: "destructive",
        })
        return
      }

      setIsSuccess(true)
      toast({
        title: "¡Registro exitoso!",
        description: "Tu información ha sido guardada correctamente",
      })

      // Reset form
      setFormData({
        nombre: "",
        telefono: "",
        edad: "",
        alergias: "",
      })
    } catch (error) {
      console.error("Error inesperado:", error)
      toast({
        title: "Error",
        description: "Hubo un problema inesperado. Por favor intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-lg mx-auto bg-white border-gray-200 shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 sm:w-16 h-12 sm:h-16 text-green-500 mx-auto" />
            <h3 className="text-xl sm:text-2xl font-bold text-green-700">¡Registro Completado!</h3>
            <p className="text-gray-600 text-sm sm:text-base px-4">
              Tu información ha sido registrada exitosamente. Pronto recibirás más detalles sobre el evento.
            </p>
            <Button
              onClick={() => setIsSuccess(false)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
            >
              Registrar Otra Persona
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-lg mx-auto bg-white border-gray-200 shadow-lg">
      <CardHeader className="text-center sm:text-left">
        <CardTitle className="text-gray-900 text-lg sm:text-xl">Información del Participante</CardTitle>
        <CardDescription className="text-gray-600">
          Completa todos los campos para completar tu registro
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-gray-700 font-medium">
              Nombre Completo *
            </Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Ingresa tu nombre completo"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              disabled={isSubmitting}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono" className="text-gray-700 font-medium">
              Número Telefónico *
            </Label>
            <Input
              id="telefono"
              type="tel"
              placeholder="Ej: +52 55 1234 5678"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              required
              disabled={isSubmitting}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edad" className="text-gray-700 font-medium">
              Edad *
            </Label>
            <Input
              id="edad"
              type="number"
              placeholder="Ingresa tu edad"
              min="1"
              max="120"
              value={formData.edad}
              onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
              required
              disabled={isSubmitting}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alergias" className="text-gray-700 font-medium">
              Alergias o Enfermedades a Considerar
            </Label>
            <Textarea
              id="alergias"
              placeholder="Describe cualquier alergia, enfermedad o condición médica que debamos considerar (opcional)"
              className="min-h-[80px] sm:min-h-[100px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white resize-none"
              value={formData.alergias}
              onChange={(e) => setFormData({ ...formData, alergias: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Registrando...
              </>
            ) : (
              "Completar Registro"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
