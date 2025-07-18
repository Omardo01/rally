import { RegistroForm } from "@/components/registro-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Lock } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Imagen del evento - Responsiva */}
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
          <div className="relative w-full h-auto rounded-lg overflow-hidden shadow-2xl">
            <Image
              src="/images/rally.jpg"
              alt="Mini Rally - ¡Prepárate para la emoción del rally! 26 de Julio 2025 en Quinta America"
              width={1920}
              height={1080}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Mini Rally - Registro de Evento
          </h1>
          <p className="text-base sm:text-lg text-gray-600 px-4">
            Completa tu información para participar en la emoción del rally
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
          <RegistroForm />
        </div>

        {/* Información adicional del evento - Mejorada para móvil */}
        <div className="max-w-2xl mx-auto mb-6 sm:mb-8 bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="text-center space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Detalles del Evento</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col items-center p-3 sm:p-4 bg-yellow-50 rounded-lg">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-sm">⏰</span>
                </div>
                <p className="font-semibold text-gray-900">Horario</p>
                <p className="text-gray-600 text-center">12:00 PM - 6:30 PM</p>
              </div>
              <div className="flex flex-col items-center p-3 sm:p-4 bg-yellow-50 rounded-lg">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-sm">📅</span>
                </div>
                <p className="font-semibold text-gray-900">Fecha</p>
                <p className="text-gray-600 text-center">26 de Julio 2025</p>
              </div>
              <div className="flex flex-col items-center p-3 sm:p-4 bg-yellow-50 rounded-lg">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-sm">📍</span>
                </div>
                <p className="font-semibold text-gray-900">Ubicación</p>
                <p className="text-gray-600 text-center">Quinta America</p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <p className="text-red-800 font-semibold text-sm sm:text-base">⚠️ Información Importante</p>
              <ul className="text-red-700 text-sm mt-2 space-y-1 text-left">
                <li>• Acceso limitado - Solo con pulsera</li>
                <li>• Costo de pulsera: $50</li>
                <li>• A partir de 12 años</li>
                <li>• Regístrate ahora para asegurar tu lugar</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/admin">
            <Button variant="outline" className="bg-white text-gray-700 hover:bg-gray-50">
              <Lock className="w-4 h-4 mr-2" />
              Panel de Administración
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-2 px-4">Acceso restringido - Se requieren credenciales</p>
        </div>
      </div>
    </div>
  )
}
