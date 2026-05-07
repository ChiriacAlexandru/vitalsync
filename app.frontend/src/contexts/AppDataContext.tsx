/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { api, setAuthToken } from '../services/api'
import type { Alarm, AppUser, ChartPoint, Doctor, Patient, UserRole, VitalStatus } from '../types/domain'

type PatientDraft = Omit<Patient, 'id' | 'lastSync' | 'pulse' | 'oxygen' | 'temperature' | 'bloodPressure' | 'status'> & {
  pulse?: number
  oxygen?: number
  temperature?: number
  bloodPressure?: string
  status?: VitalStatus
}
type DoctorDraft = Omit<Doctor, 'id' | 'patients' | 'alerts'>
type AlarmDraft = Omit<Alarm, 'id' | 'time' | 'resolved'>

type AppDataContextValue = {
  role: Extract<UserRole, 'medic' | 'pacient'>
  currentPatient?: Patient
  currentUser?: AppUser
  patients: Patient[]
  doctors: Doctor[]
  alarms: Alarm[]
  activeAlarms: Alarm[]
  chartPoints: ChartPoint[]
  isAuthenticated: boolean
  isLoading: boolean
  authError?: string
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setRole: (role: Extract<UserRole, 'medic' | 'pacient'>) => void
  setCurrentPatientId: (patientId: string) => void
  addPatient: (draft: PatientDraft) => Promise<void>
  addDoctor: (draft: DoctorDraft) => Promise<void>
  addAlarm: (draft: AlarmDraft) => Promise<void>
  matchAlarm: (alarmId: string, patientId: string) => Promise<void>
  resolveAlarm: (alarmId: string) => Promise<void>
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Extract<UserRole, 'medic' | 'pacient'>>('medic')
  const [currentPatientId, setCurrentPatientId] = useState('')
  const [currentUser, setCurrentUser] = useState<AppUser>()
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [chartPoints, setChartPoints] = useState<ChartPoint[]>([])
  const [token, setToken] = useState(() => localStorage.getItem('vitalsync_token') ?? '')
  const [isLoading, setIsLoading] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const [authError, setAuthError] = useState<string>()

  const activeAlarms = useMemo(() => alarms.filter((alarm) => !alarm.resolved), [alarms])
  const currentPatient = useMemo(() => patients.find((patient) => patient.id === currentPatientId) ?? patients[0], [currentPatientId, patients])

  const loadBootstrap = useCallback(async () => {
    const { data } = await api.get('/bff/bootstrap')
    setCurrentUser(data.user)
    setPatients(data.patients)
    setDoctors(data.doctors)
    setAlarms(data.alarms)
    setRole(data.user.role === 'Pacient' ? 'pacient' : 'medic')
    if (data.patients[0]) {
      setCurrentPatientId(data.patients[0].id)
    }
  }, [])

  const loadCharts = useCallback(async (patientId: string) => {
    const { data } = await api.get('/bff/charts', { params: { patientId } })
    setChartPoints(data)
  }, [])

  useEffect(() => {
    if (!token) {
      setAuthToken()
      return
    }

    setAuthToken(token)
    setIsLoading(true)
    loadBootstrap()
      .catch((error: unknown) => {
        setAuthError(error instanceof Error ? error.message : 'Nu am putut incarca datele live.')
        localStorage.removeItem('vitalsync_token')
        setToken('')
      })
      .finally(() => setIsLoading(false))

    intervalRef.current = setInterval(() => {
      loadBootstrap().catch(() => {})
    }, 30000)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [loadBootstrap, token])

  useEffect(() => {
    if (token && currentPatient?.id) {
      loadCharts(currentPatient.id).catch(() => setChartPoints([]))
    }
  }, [currentPatient?.id, loadCharts, token])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setAuthError(undefined)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('vitalsync_token', data.token)
      setAuthToken(data.token)
      setToken(data.token)
      await loadBootstrap()
    } catch (error) {
      setAuthError('Email sau parola invalide.')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    localStorage.removeItem('vitalsync_token')
    setToken('')
    setAuthToken()
    setCurrentUser(undefined)
    setPatients([])
    setDoctors([])
    setAlarms([])
    setChartPoints([])
  }

  const addPatient = async (draft: PatientDraft) => {
    const { data } = await api.post('/bff/medic/patients', draft)
    setPatients((current) => [data, ...current])
  }

  const addDoctor = async (draft: DoctorDraft) => {
    const { data } = await api.post('/bff/medic/doctors', draft)
    setDoctors((current) => [data, ...current])
  }

  const addAlarm = async (draft: AlarmDraft) => {
    const { data } = await api.post('/bff/alarms', draft)
    setAlarms((current) => [data, ...current])
  }

  const matchAlarm = async (alarmId: string, patientId: string) => {
    const { data } = await api.patch(`/bff/alarms/${alarmId}/match`, { patientId })
    setAlarms((current) => current.map((alarm) => (alarm.id === alarmId ? data : alarm)))
  }

  const resolveAlarm = async (alarmId: string) => {
    const { data } = await api.patch(`/bff/alarms/${alarmId}/resolve`)
    setAlarms((current) => current.map((alarm) => (alarm.id === alarmId ? data : alarm)))
  }

  const value = {
    role,
    currentPatient,
    currentUser,
    patients,
    doctors,
    alarms,
    activeAlarms,
    chartPoints,
    isAuthenticated: Boolean(token),
    isLoading,
    authError,
    login,
    logout,
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
