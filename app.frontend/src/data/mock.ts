export type UserRole = 'medic' | 'pacient' | 'admin'

export type VitalStatus = 'stabil' | 'atentie' | 'critic'

export type Patient = {
  id: string
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
}

export const currentUser = {
  name: 'Dr. Ana Ionescu',
  role: 'medic' as UserRole,
  email: 'ana.ionescu@vitalsync.ro',
  department: 'Cardiologie',
}

export const patients: Patient[] = [
  {
    id: 'P-1024',
    name: 'Mihai Popescu',
    age: 58,
    diagnosis: 'Aritmie supraventriculara',
    doctor: 'Dr. Ana Ionescu',
    room: 'Cardio 204',
    pulse: 112,
    oxygen: 94,
    temperature: 37.8,
    bloodPressure: '145/92',
    status: 'atentie',
    lastSync: 'acum 2 min',
  },
  {
    id: 'P-1025',
    name: 'Elena Stan',
    age: 43,
    diagnosis: 'Monitorizare post-operatorie',
    doctor: 'Dr. Matei Radu',
    room: 'Recuperare 12',
    pulse: 74,
    oxygen: 98,
    temperature: 36.7,
    bloodPressure: '118/76',
    status: 'stabil',
    lastSync: 'acum 4 min',
  },
  {
    id: 'P-1026',
    name: 'Andrei Dima',
    age: 67,
    diagnosis: 'Insuficienta cardiaca',
    doctor: 'Dr. Ana Ionescu',
    room: 'ATI 03',
    pulse: 128,
    oxygen: 89,
    temperature: 38.3,
    bloodPressure: '162/98',
    status: 'critic',
    lastSync: 'acum 30 sec',
  },
  {
    id: 'P-1027',
    name: 'Ioana Munteanu',
    age: 51,
    diagnosis: 'Hipertensiune esentiala',
    doctor: 'Dr. Sorin Pavel',
    room: 'Cardio 118',
    pulse: 82,
    oxygen: 97,
    temperature: 36.9,
    bloodPressure: '132/84',
    status: 'stabil',
    lastSync: 'acum 8 min',
  },
]

export const doctors: Doctor[] = [
  { id: 'M-01', name: 'Dr. Ana Ionescu', specialty: 'Cardiologie', patients: 18, alerts: 3, availability: 'Garda activa' },
  { id: 'M-02', name: 'Dr. Matei Radu', specialty: 'Chirurgie vasculara', patients: 11, alerts: 1, availability: 'Disponibil' },
  { id: 'M-03', name: 'Dr. Sorin Pavel', specialty: 'Medicina interna', patients: 14, alerts: 0, availability: 'Consultatii' },
  { id: 'M-04', name: 'Dr. Irina Costea', specialty: 'Pneumologie', patients: 9, alerts: 2, availability: 'In interventie' },
]

export const alarms: Alarm[] = [
  {
    id: 'A-301',
    patient: 'Andrei Dima',
    patientId: 'P-1026',
    type: 'SpO2 scazut',
    severity: 'critic',
    time: '15:02',
    message: 'Saturatia a coborat sub pragul de 90% pentru 3 minute consecutive.',
  },
  {
    id: 'A-302',
    patient: 'Mihai Popescu',
    patientId: 'P-1024',
    type: 'Puls ridicat',
    severity: 'atentie',
    time: '14:56',
    message: 'Puls peste 110 bpm in ultimele doua masuratori.',
  },
  {
    id: 'A-303',
    patient: 'Irina Costache',
    type: 'Sincronizare intarziata',
    severity: 'atentie',
    time: '14:41',
    message: 'Dispozitivul wearable nu a mai trimis date de 18 minute.',
  },
]

export const ecgSeries: ChartPoint[] = [
  { label: '00', value: 58 },
  { label: '02', value: 82 },
  { label: '04', value: 46 },
  { label: '06', value: 118 },
  { label: '08', value: 52 },
  { label: '10', value: 76 },
  { label: '12', value: 48 },
  { label: '14', value: 124 },
  { label: '16', value: 56 },
  { label: '18', value: 84 },
  { label: '20', value: 50 },
  { label: '22', value: 108 },
]

export const pulseSeries: ChartPoint[] = [
  { label: '08:00', value: 76 },
  { label: '09:00', value: 82 },
  { label: '10:00', value: 91 },
  { label: '11:00', value: 88 },
  { label: '12:00', value: 104 },
  { label: '13:00', value: 97 },
  { label: '14:00', value: 112 },
]
