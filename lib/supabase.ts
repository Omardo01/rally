import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript
export interface Participante {
  id: string
  nombre: string
  telefono: string
  edad: number
  alergias: string | null
  fecha_registro: string
  equipo_id: string | null
  pagado: boolean
}

export interface Equipo {
  id: string
  nombre: string
  color: string
  lider: string
  fecha_creacion: string
}

export interface EquipoConParticipantes extends Equipo {
  participantes?: Participante[]
}
