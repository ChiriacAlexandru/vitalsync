import { Link } from 'react-router-dom'
import { Activity, ArrowUpRight, Bell, HeartPulse, ShieldCheck, Thermometer, UsersRound } from 'lucide-react'
import { MiniChart, PageHeader, PrimaryButton, SectionCard, StatCard, StatusBadge } from '../../components/ui'
import { useAppData } from '../../contexts/AppDataContext'

const DashboardPage = () => {
  const { activeAlarms, chartPoints, currentPatient, patients, role } = useAppData()
  const critical = patients.filter((patient) => patient.status === 'critic').length
  const attention = patients.filter((patient) => patient.status === 'atentie').length
  const patientAlarms = currentPatient
    ? activeAlarms.filter((alarm) => alarm.patientId === currentPatient.id || alarm.patient === currentPatient.name)
    : []

  if (role === 'pacient') {
    if (!currentPatient) {
      return (
        <SectionCard>
          <h1 className="text-lg font-semibold text-slate-950">Nu exista fisa de pacient</h1>
          <p className="mt-2 text-sm text-slate-500">Contul autentificat nu are inca date medicale asociate in MongoDB.</p>
        </SectionCard>
      )
    }

    return (
      <div className="space-y-6">
        <PageHeader
          title={`Datele mele, ${currentPatient.name}`}
          description={`${currentPatient.id} · ${currentPatient.age} ani · ${currentPatient.diagnosis} · ultima sincronizare ${currentPatient.lastSync}.`}
          action={<StatusBadge status={currentPatient.status} />}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Puls" value={`${currentPatient.pulse} bpm`} hint="Valoare curenta din wearable" tone={currentPatient.pulse > 110 ? 'warning' : 'default'} />
          <StatCard label="SpO2" value={`${currentPatient.oxygen}%`} hint="Saturatie oxigen" tone={currentPatient.oxygen < 92 ? 'danger' : 'default'} />
          <StatCard label="Temperatura" value={`${currentPatient.temperature} C`} hint="Monitorizare continua" tone={currentPatient.temperature > 38 ? 'warning' : 'default'} />
          <StatCard label="Tensiune" value={currentPatient.bloodPressure} hint="Ultima masuratoare validata" />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <SectionCard>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Evolutie puls</h2>
                <p className="mt-1 text-sm text-slate-500">Date live afisate pentru contul de pacient.</p>
              </div>
              <HeartPulse className="text-rose-600" size={22} />
            </div>
            <MiniChart data={chartPoints.map((point) => ({ label: point.label, value: point.pulse ?? point.value }))} color="#e11d48" />
          </SectionCard>

          <SectionCard>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Status medical</h2>
                <p className="mt-1 text-sm text-slate-500">Informatii utile pentru pacient.</p>
              </div>
              <ShieldCheck className="text-[#469ba8]" size={22} />
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <p className="rounded-lg bg-slate-50 p-3">Medic responsabil: {currentPatient.doctor}</p>
              <p className="rounded-lg bg-slate-50 p-3">Salon: {currentPatient.room}</p>
              <p className="rounded-lg bg-slate-50 p-3">Alarme active pentru mine: {patientAlarms.length}</p>
            </div>
          </SectionCard>
        </div>

        <SectionCard>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950">
            <Thermometer size={20} className="text-[#469ba8]" />
            Alarmele mele
          </h2>
          <div className="mt-4 space-y-3">
            {patientAlarms.length ? (
              patientAlarms.map((alarm) => (
                <div key={alarm.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{alarm.type}</p>
                    <StatusBadge status={alarm.severity} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{alarm.message}</p>
                </div>
              ))
            ) : (
              <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">Nu ai alarme active in acest moment.</p>
            )}
          </div>
        </SectionCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard clinic"
        description="Privire de ansamblu asupra pacientilor monitorizati, alarmelor active si ultimelor valori primite prin BFF."
        action={<PrimaryButton>Raport zilnic</PrimaryButton>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pacienti activi" value={String(patients.length)} hint="Toti au dispozitive sincronizate" />
        <StatCard label="Alarme active" value={String(activeAlarms.length)} hint="Prioritizare dupa severitate" tone="warning" />
        <StatCard label="Cazuri critice" value={String(critical)} hint="Necesita interventie rapida" tone="danger" />
        <StatCard label="Sub observatie" value={String(attention)} hint="Praguri depasite temporar" tone="warning" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <SectionCard>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Flux ECG agregat</h2>
              <p className="mt-1 text-sm text-slate-500">Exemplu de date transformate pentru frontend.</p>
            </div>
            <Activity className="text-[#469ba8]" size={22} />
          </div>
          <MiniChart data={chartPoints.map((point) => ({ label: point.label, value: point.ecg ?? point.value }))} />
        </SectionCard>

        <SectionCard>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950">Alarme recente</h2>
            <Bell className="text-[#469ba8]" size={21} />
          </div>
          <div className="mt-4 space-y-3">
            {activeAlarms.map((alarm) => (
              <div key={alarm.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">{alarm.patient}</p>
                  <StatusBadge status={alarm.severity} />
                </div>
                <p className="mt-1 text-sm text-slate-500">{alarm.type}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Pacienti prioritari</h2>
            <p className="mt-1 text-sm text-slate-500">Lista compacta pentru triaj medical.</p>
          </div>
          <UsersRound className="text-[#469ba8]" size={22} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
              <tr>
                <th className="py-3 font-semibold">Pacient</th>
                <th className="py-3 font-semibold">Diagnostic</th>
                <th className="py-3 font-semibold">Puls</th>
                <th className="py-3 font-semibold">SpO2</th>
                <th className="py-3 font-semibold">Status</th>
                <th className="py-3 font-semibold">Actiune</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="py-4 font-medium text-slate-900">{patient.name}</td>
                  <td className="py-4 text-slate-500">{patient.diagnosis}</td>
                  <td className="py-4 text-slate-700">{patient.pulse} bpm</td>
                  <td className="py-4 text-slate-700">{patient.oxygen}%</td>
                  <td className="py-4">
                    <StatusBadge status={patient.status} />
                  </td>
                  <td className="py-4">
                    <Link to={`/pacienti/${patient.id}`} className="inline-flex items-center gap-1 font-semibold text-[#2f7f8b]">
                      Detalii <ArrowUpRight size={15} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}

export default DashboardPage
