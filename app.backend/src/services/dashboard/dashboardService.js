import bcrypt from 'bcrypt'
import { env } from '../../config/env.js'
import Alarm from '../../models/Alarm.js'
import Measurement from '../../models/Measurement.js'
import Patient from '../../models/Patient.js'
import User from '../../models/User.js'
import { mapAlarm, mapChartPoint, mapDoctor, mapPatient } from '../../utils/mappers/dataMappers.js'

const splitName = (name) => {
  const parts = name.trim().split(/\s+/)
  return {
    prenume: parts.at(0) || 'Pacient',
    nume: parts.slice(1).join(' ') || 'Nou',
  }
}

const getLatestMeasurementMap = async (patientUserIds) => {
  const entries = await Promise.all(
    patientUserIds.map(async (patientId) => {
      const measurement = await Measurement.findOne({ patientId }).sort({ timestamp: -1 })
      return [String(patientId), measurement]
    }),
  )

  return new Map(entries)
}

const mapAlarmPatients = async (alarms) => {
  const patientUserIds = [...new Set(alarms.map((alarm) => String(alarm.patientId)))]
  const patients = await Patient.find({ userId: { $in: patientUserIds } })
  return new Map(patients.map((patient) => [String(patient.userId), patient]))
}

export const getBootstrap = async (user) => {
  const userDoc = await User.findById(user.id)
  const allDoctors = await User.find({ role: 'Medic' }).sort({ createdAt: 1 })
  const patientQuery = user.role === 'Pacient' ? { userId: user.id } : {}
  const patientDocs = await Patient.find(patientQuery).populate('medicId').sort({ createdAt: -1 })
  const patientUserIds = patientDocs.map((patient) => patient.userId)
  const latestMeasurements = await getLatestMeasurementMap(patientUserIds)
  const alarmQuery = user.role === 'Pacient' ? { patientId: user.id } : {}
  const alarmDocs = await Alarm.find(alarmQuery).sort({ timestamp: -1 })
  const alarmPatientMap = await mapAlarmPatients(alarmDocs)

  const allPatientDocs = await Patient.find()
  const allActiveAlarms = await Alarm.find({ resolved: false })
  const doctors = allDoctors.map((doctor) =>
    mapDoctor({
      doctor,
      patientCount: allPatientDocs.filter((patient) => String(patient.medicId) === String(doctor._id)).length,
      alertCount: allActiveAlarms.filter((alarm) => {
        const patient = allPatientDocs.find((item) => String(item.userId) === String(alarm.patientId))
        return patient && String(patient.medicId) === String(doctor._id)
      }).length,
    }),
  )

  return {
    user: {
      id: String(userDoc._id),
      email: userDoc.email,
      role: userDoc.role,
      name: userDoc.name || userDoc.email,
      specialty: userDoc.specialty,
    },
    patients: patientDocs.map((patient) =>
      mapPatient({
        patient,
        medic: patient.medicId,
        latestMeasurement: latestMeasurements.get(String(patient.userId)),
      }),
    ),
    doctors,
    alarms: alarmDocs.map((alarm) => mapAlarm({ alarm, patient: alarmPatientMap.get(String(alarm.patientId)) })),
  }
}

export const getCharts = async (patientId, user) => {
  const queryPatientId = user.role === 'Pacient' ? user.id : patientId
  const measurements = await Measurement.find({ patientId: queryPatientId }).sort({ timestamp: -1 }).limit(50)
  return measurements.reverse().map(mapChartPoint)
}

export const createDoctor = async (draft) => {
  const email = (draft.email || `${draft.name.toLowerCase().replace(/\s+/g, '.')}@vitalsync.ro`).toLowerCase()
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    const error = new Error('Exista deja un medic cu acest email.')
    error.status = 400
    throw error
  }

  const password = await bcrypt.hash(draft.password || 'VitalSync123!', 10)
  const doctor = await User.create({
    email,
    password,
    role: 'Medic',
    name: draft.name,
    specialty: draft.specialty,
    availability: draft.availability,
  })

  return mapDoctor({ doctor, patientCount: 0, alertCount: 0 })
}

export const createPatient = async (draft, medicId) => {
  const { nume, prenume } = splitName(draft.name)
  const email = (draft.email || `${prenume}.${nume}.${Date.now()}@pacient.vitalsync.ro`).toLowerCase()
  const password = await bcrypt.hash(draft.password || 'Pacient1234!', 10)
  const user = await User.create({
    email,
    password,
    role: 'Pacient',
    name: draft.name,
  })
  const patient = await Patient.create({
    userId: user._id,
    medicId,
    nume,
    prenume,
    cnp: draft.cnp || `${Date.now()}`.slice(0, 13).padEnd(13, '0'),
    varsta: draft.age,
    istoricMedical: draft.diagnosis,
    camera: draft.room,
    thresholds: {
      pulsMax: 100,
      pulsMin: 50,
      tempMax: 37.5,
      spo2Min: 94,
    },
  })
  const measurement = await Measurement.create({
    patientId: user._id,
    puls: draft.pulse ?? 75,
    spo2: draft.oxygen ?? 98,
    temperatura: draft.temperature ?? 36.6,
    tensiune: draft.bloodPressure ?? '120/80',
    ecg: draft.pulse ?? 75,
  })
  const medic = await User.findById(medicId)

  return mapPatient({ patient, medic, latestMeasurement: measurement })
}

export const createAlarm = async (draft) => {
  const alarm = await Alarm.create({
    patientId: draft.patientId,
    type: draft.type,
    severity: draft.severity,
    message: draft.message,
    sensorValue: draft.sensorValue,
    patientNote: draft.patientNote,
  })
  const patient = await Patient.findOne({ userId: alarm.patientId })
  return mapAlarm({ alarm, patient })
}

export const matchAlarm = async (alarmId, patientId) => {
  const alarm = await Alarm.findByIdAndUpdate(alarmId, { patientId }, { new: true })
  const patient = await Patient.findOne({ userId: alarm.patientId })
  return mapAlarm({ alarm, patient })
}

export const resolveAlarm = async (alarmId) => {
  const alarm = await Alarm.findByIdAndUpdate(alarmId, { resolved: true }, { new: true })
  const patient = await Patient.findOne({ userId: alarm.patientId })
  return mapAlarm({ alarm, patient })
}

export const ensureDemoDoctor = async () => {
  const password = await bcrypt.hash(env.demoDoctorPassword, 10)
  await User.findOneAndUpdate(
    { email: env.demoDoctorEmail },
    {
      email: env.demoDoctorEmail,
      password,
      role: 'Medic',
      name: 'Dr. Ana Ionescu',
      specialty: 'Cardiologie',
      availability: 'Garda activa',
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  )
}
