/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { alarms as initialAlarms, doctors as initialDoctors, patients as initialPatients } from '../data/mock'
import type { Alarm, Doctor, Patient, UserRole, VitalStatus } from '../data/mock'

type PatientDraft = Omit<Patient, 'id' | 'lastSync'>
type DoctorDraft = Omit<Doctor, 'id' | 'patients' | 'alerts'>
type AlarmDraft = Omit<Alarm, 'id' | 'time' | 'resolved'>

type AppDataContextValue = {
  role: Extract<UserRole, 'medic' | 'pacient'>
  currentPatient: Patient
  patients: Patient[]
  doctors: Doctor[]
  alarms: Alarm[]
  activeAlarms: Alarm[]
  setRole: (role: Extract<UserRole, 'medic' | 'pacient'>) => void
  setCurrentPatientId: (patientId: string) => void
  addPatient: (draft: PatientDraft) => void
  addDoctor: (draft: DoctorDraft) => void
  addAlarm: (draft: AlarmDraft) => void
  matchAlarm: (alarmId: string, patientId: string) => void
  resolveAlarm: (alarmId: string) => void
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

const nextId = (prefix: string, count: number) => `${prefix}-${String(count + 1).padStart(4, '0')}`

const getPatientStatus = (pulse: number, oxygen: number, temperature: number): VitalStatus => {
  if (oxygen < 92 || pulse > 120 || temperature >= 38.2) {
    return 'critic'
  }

  if (oxygen < 96 || pulse > 100 || temperature >= 37.6) {
    return 'atentie'
  }

  return 'stabil'
}

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Extract<UserRole, 'medic' | 'pacient'>>('medic')
  const [currentPatientId, setCurrentPatientId] = useState(initialPatients[0].id)
  const [patients, setPatients] = useState<Patient[]>(initialPatients)
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors)
  const [alarms, setAlarms] = useState<Alarm[]>(initialAlarms)

  const activeAlarms = useMemo(() => alarms.filter((alarm) => !alarm.resolved), [alarms])
  const currentPatient = useMemo(
    () => patients.find((patient) => patient.id === currentPatientId) ?? patients[0],
    [currentPatientId, patients],
  )

  const enrichedDoctors = useMemo(
    () =>
      doctors.map((doctor) => ({
        ...doctor,
        patients: patients.filter((patient) => patient.doctor === doctor.name).length || doctor.patients,
        alerts: activeAlarms.filter((alarm) => {
          const patient = patients.find((item) => item.id === alarm.patientId || item.name === alarm.patient)
          return patient?.doctor === doctor.name
        }).length,
      })),
    [activeAlarms, doctors, patients],
  )

  const addPatient = (draft: PatientDraft) => {
    setPatients((current) => [
      {
        ...draft,
        id: nextId('P', current.length + 1027),
        status: getPatientStatus(draft.pulse, draft.oxygen, draft.temperature),
        lastSync: 'acum cateva sec',
      },
      ...current,
    ])
  }

  const addDoctor = (draft: DoctorDraft) => {
    setDoctors((current) => [
      {
        ...draft,
        id: `M-${String(current.length + 1).padStart(2, '0')}`,
        patients: 0,
        alerts: 0,
      },
      ...current,
    ])
  }

  const addAlarm = (draft: AlarmDraft) => {
    const matchedPatient = patients.find((patient) => patient.id === draft.patientId || patient.name === draft.patient)
    setAlarms((current) => [
      {
        ...draft,
        patient: matchedPatient?.name ?? draft.patient,
        patientId: matchedPatient?.id ?? draft.patientId,
        id: nextId('A', current.length + 303),
        time: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
        resolved: false,
      },
      ...current,
    ])
  }

  const matchAlarm = (alarmId: string, patientId: string) => {
    const patient = patients.find((item) => item.id === patientId)
    if (!patient) {
      return
    }

    setAlarms((current) =>
      current.map((alarm) => (alarm.id === alarmId ? { ...alarm, patient: patient.name, patientId: patient.id } : alarm)),
    )
  }

  const resolveAlarm = (alarmId: string) => {
    setAlarms((current) => current.map((alarm) => (alarm.id === alarmId ? { ...alarm, resolved: true } : alarm)))
  }

  const value = {
    role,
    currentPatient,
    patients,
    doctors: enrichedDoctors,
    alarms,
    activeAlarms,
    setRole,
    setCurrentPatientId,
    addPatient,
    addDoctor,
    addAlarm,
    matchAlarm,
    resolveAlarm,
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export const useAppData = () => {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error('useAppData must be used inside AppDataProvider')
  }

  return context
}
