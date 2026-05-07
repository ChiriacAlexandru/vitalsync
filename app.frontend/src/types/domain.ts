export type UserRole = 'medic' | 'pacient' | 'admin'

export type VitalStatus = 'stabil' | 'atentie' | 'critic'

export type Patient = {
  id: string
  recordId?: string
  name: string
  age: number
  diagnosis: string
  doctor: string
  room: string
  pulse: number
  oxygen: number
  temperature: number
  bloodPressure: string
  status: VitalStatus
  lastSync: string
}

export type Doctor = {
  id: string
  name: string
  specialty: string
  patients: number
  alerts: number
  availability: string
}

export type Alarm = {
  id: string
  patient: string
  patientId?: string
  type: string
  severity: VitalStatus
  time: string
  message: string
  resolved?: boolean
}

export type ChartPoint = {
  label: string
  value: number
  ecg?: number
  pulse?: number
  temperature?: number
  oxygen?: number
}

export type AppUser = {
  id: string
  email: string
  role: 'Medic' | 'Pacient'
  name: string
  specialty?: string
}
