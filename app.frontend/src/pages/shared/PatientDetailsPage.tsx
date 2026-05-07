import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Bell, HeartPulse, Thermometer, Waves } from 'lucide-react'
import { MiniChart, PageHeader, SectionCard, StatCard, StatusBadge } from '../../components/ui'
import { useAppData } from '../../contexts/AppDataContext'

const PatientDetailsPage = () => {
  const { patientId } = useParams()
  const { activeAlarms, chartPoints, patients } = useAppData()
  const patient = patients.find((item) => item.id === patientId)

  if (!patient) {
    return (
      <SectionCard>
        <h1 className="text-lg font-semibold text-slate-950">Pacient negasit</h1>
        <p className="mt-2 text-sm text-slate-500">Fisa ceruta nu exista in datele live incarcate din backend.</p>
      </SectionCard>
    )
  }

  const patientAlarms = activeAlarms.filter((alarm) => alarm.patientId === patient.id || alarm.patient === patient.name)

  return (
    <div className="space-y-6">
      <Link to="/pacienti" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f7f8b]">
        <ArrowLeft size={16} />
        Inapoi la pacienti
      </Link>

      <PageHeader
        title={patient.name}
        description={`${patient.id} · ${patient.age} ani · ${patient.diagnosis} · ${patient.room}`}
        action={<StatusBadge status={patient.status} />}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Puls" value={`${patient.pulse} bpm`} hint={`Ultima sincronizare ${patient.lastSync}`} tone={patient.pulse > 110 ? 'warning' : 'default'} />
        <StatCard label="SpO2" value={`${patient.oxygen}%`} hint="Prag critic sub 90%" tone={patient.oxygen < 92 ? 'danger' : 'default'} />
        <StatCard label="Temperatura" value={`${patient.temperature} C`} hint="Masurare axilara wearable" tone={patient.temperature > 38 ? 'warning' : 'default'} />
        <StatCard label="Tensiune" value={patient.bloodPressure} hint={`Medic: ${patient.doctor}`} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">ECG curatat</h2>
              <p className="mt-1 text-sm text-slate-500">Serie live dupa filtrarea anomaliilor in BFF.</p>
            </div>
            <Waves size={22} className="text-[#469ba8]" />
          </div>
          <MiniChart data={chartPoints.map((point) => ({ label: point.label, value: point.ecg ?? point.value }))} />
        </SectionCard>

        <SectionCard>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Puls pe ore</h2>
              <p className="mt-1 text-sm text-slate-500">Ultimele masuratori agregate.</p>
            </div>
            <HeartPulse size={22} className="text-[#469ba8]" />
          </div>
          <MiniChart data={chartPoints.map((point) => ({ label: point.label, value: point.pulse ?? point.value }))} color="#e11d48" />
        </SectionCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950">
            <Bell size={20} className="text-[#469ba8]" />
            Alarme pacient
          </h2>
          <div className="mt-4 space-y-3">
            {patientAlarms.length ? patientAlarms.map((alarm) => (
              <div key={alarm.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900">{alarm.type}</p>
                  <StatusBadge status={alarm.severity} />
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{alarm.message}</p>
              </div>
            )) : <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">Nu exista alarme active pentru acest pacient.</p>}
          </div>
        </SectionCard>

        <SectionCard>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950">
            <Thermometer size={20} className="text-[#469ba8]" />
            Plan de observatie
          </h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p className="rounded-lg bg-slate-50 p-3">Verificare praguri puls si SpO2 la fiecare 5 minute.</p>
            <p className="rounded-lg bg-slate-50 p-3">Confirmare manuala pentru alarme critice in consola medicului.</p>
            <p className="rounded-lg bg-slate-50 p-3">Export raport zilnic cu ECG si valori vitale agregate.</p>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

export default PatientDetailsPage
