import type { FormEvent } from 'react'
import { BellRing, CheckCheck, Link2, Plus, Radio } from 'lucide-react'
import { PageHeader, SectionCard, StatusBadge } from '../../components/ui'
import { useAppData } from '../../contexts/AppDataContext'
import type { VitalStatus } from '../../data/mock'

const AlarmePage = () => {
  const { activeAlarms, addAlarm, alarms, matchAlarm, patients, resolveAlarm } = useAppData()

  const handleAddAlarm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const patientId = String(form.get('patientId'))
    const patient = patients.find((item) => item.id === patientId)

    addAlarm({
      patient: patient?.name ?? 'Nepotrivita',
      patientId,
      type: String(form.get('type')),
      severity: String(form.get('severity')) as VitalStatus,
      message: String(form.get('message')),
    })
    event.currentTarget.reset()
  }

  const handleMatchAlarm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    matchAlarm(String(form.get('alarmId')), String(form.get('patientId')))
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Alarme si notificari" description="Centru pentru evenimente asincrone venite prin WebSocket/SSE in implementarea reala." />

      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard>
          <p className="flex items-center gap-2 text-sm font-medium text-slate-500"><Radio size={16} className="text-[#469ba8]" /> Canal realtime</p>
          <p className="mt-3 text-2xl font-semibold text-slate-950">Conectat</p>
        </SectionCard>
        <SectionCard>
          <p className="flex items-center gap-2 text-sm font-medium text-slate-500"><BellRing size={16} className="text-[#469ba8]" /> Alarme active</p>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{activeAlarms.length}</p>
        </SectionCard>
        <SectionCard>
          <p className="flex items-center gap-2 text-sm font-medium text-slate-500"><CheckCheck size={16} className="text-[#469ba8]" /> SLA confirmare</p>
          <p className="mt-3 text-2xl font-semibold text-slate-950">2 min</p>
        </SectionCard>
      </div>

      <SectionCard>
        <h2 className="text-lg font-semibold text-slate-950">Adauga alarma</h2>
        <form onSubmit={handleAddAlarm} className="mt-4 grid gap-3 lg:grid-cols-4">
          <select required name="patientId" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#469ba8]">
            {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}
          </select>
          <input required name="type" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#469ba8]" placeholder="Tip alarma" />
          <select required name="severity" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#469ba8]">
            <option value="atentie">Atentie</option>
            <option value="critic">Critic</option>
            <option value="stabil">Informativa</option>
          </select>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#469ba8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#397f8a]">
            <Plus size={16} />
            Adauga
          </button>
          <textarea required name="message" className="min-h-24 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#469ba8] lg:col-span-4" placeholder="Descriere alarma" />
        </form>
      </SectionCard>

      <SectionCard>
        <h2 className="text-lg font-semibold text-slate-950">Evenimente recente</h2>
        <div className="mt-5 space-y-3">
          {alarms.map((alarm) => (
            <article key={alarm.id} className={`rounded-lg border p-4 ${alarm.resolved ? 'border-emerald-100 bg-emerald-50/40' : 'border-slate-200'}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#2f7f8b]">{alarm.time} · {alarm.id}</p>
                  <h3 className="mt-1 text-base font-semibold text-slate-950">{alarm.type}</h3>
                  <p className="mt-1 text-sm text-slate-500">{alarm.patientId ? alarm.patient : 'Nepotrivita cu pacient'}</p>
                </div>
                {alarm.resolved ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Confirmata</span> : <StatusBadge status={alarm.severity} />}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{alarm.message}</p>
              {!alarm.resolved && (
                <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 lg:flex-row lg:items-center lg:justify-between">
                  <form onSubmit={handleMatchAlarm} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input type="hidden" name="alarmId" value={alarm.id} />
                    <select name="patientId" defaultValue={alarm.patientId ?? patients[0]?.id} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#469ba8]">
                      {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}
                    </select>
                    <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                      <Link2 size={15} />
                      Potriveste
                    </button>
                  </form>
                  <button onClick={() => resolveAlarm(alarm.id)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                    <CheckCheck size={15} />
                    Confirma alarma
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

export default AlarmePage
