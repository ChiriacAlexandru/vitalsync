const getFullName = (patient) => `${patient.nume ?? ''} ${patient.prenume ?? ''}`.trim()

const getStatus = (measurement, patient) => {
  if (!measurement) {
    return 'stabil'
  }

  if (
    measurement.spo2 < (patient.thresholds?.spo2Min ?? 94) ||
    measurement.puls > (patient.thresholds?.pulsMax ?? 100) + 20 ||
    measurement.temperatura >= (patient.thresholds?.tempMax ?? 37.5) + 0.7
  ) {
    return 'critic'
  }

  if (
    measurement.spo2 < (patient.thresholds?.spo2Min ?? 94) ||
    measurement.puls > (patient.thresholds?.pulsMax ?? 100) ||
    measurement.temperatura > (patient.thresholds?.tempMax ?? 37.5)
  ) {
    return 'atentie'
  }

  return 'stabil'
}

const relativeSync = (date) => {
  if (!date) {
    return 'fara masuratori'
  }

  const diffMinutes = Math.max(0, Math.round((Date.now() - new Date(date).getTime()) / 60000))
  if (diffMinutes < 1) {
    return 'acum cateva sec'
  }

  if (diffMinutes === 1) {
    return 'acum 1 min'
  }

  return `acum ${diffMinutes} min`
}

export const mapPatient = ({ patient, medic, latestMeasurement }) => ({
  id: String(patient.userId),
  recordId: String(patient._id),
  name: getFullName(patient),
  age: patient.varsta ?? 0,
  diagnosis: patient.istoricMedical || patient.consultatiiCardiologice || 'Monitorizare generala',
  doctor: medic?.name || medic?.email || 'Medic nealocat',
  room: patient.camera || patient.adresa || 'Nespecificat',
  pulse: latestMeasurement?.puls ?? 0,
  oxygen: latestMeasurement?.spo2 ?? patient.spo2 ?? 98,
  temperature: latestMeasurement?.temperatura ?? 36.7,
  bloodPressure: latestMeasurement?.tensiune ?? patient.tensiune ?? '120/80',
  status: getStatus(latestMeasurement, patient),
  lastSync: relativeSync(latestMeasurement?.timestamp),
})

export const mapDoctor = ({ doctor, patientCount, alertCount }) => ({
  id: String(doctor._id),
  name: doctor.name || doctor.email,
  specialty: doctor.specialty || 'Medicina generala',
  patients: patientCount,
  alerts: alertCount,
  availability: doctor.availability || 'Disponibil',
})

export const mapAlarm = ({ alarm, patient }) => ({
  id: String(alarm._id),
  patient: patient ? getFullName(patient) : 'Pacient necunoscut',
  patientId: String(alarm.patientId),
  type: alarm.type,
  severity: alarm.severity || 'atentie',
  time: new Intl.DateTimeFormat('ro-RO', { hour: '2-digit', minute: '2-digit' }).format(alarm.timestamp),
  message: alarm.message || alarm.patientNote || 'Alarma generata automat.',
  resolved: Boolean(alarm.resolved),
})

export const mapChartPoint = (measurement) => ({
  label: new Intl.DateTimeFormat('ro-RO', { hour: '2-digit', minute: '2-digit' }).format(measurement.timestamp),
  value: measurement.puls ?? measurement.ecg ?? 0,
  ecg: measurement.ecg ?? 0,
  pulse: measurement.puls ?? 0,
  temperature: measurement.temperatura ?? 0,
  oxygen: measurement.spo2 ?? 0,
})
