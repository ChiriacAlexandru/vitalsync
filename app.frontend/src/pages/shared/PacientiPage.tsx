import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Plus, Search } from 'lucide-react'
import { PageHeader, SectionCard, StatusBadge } from '../../components/ui'
import { useAppData } from '../../contexts/AppDataContext'
import type { VitalStatus } from '../../data/mock'

const PacientiPage = () => {
  const { addPatient, doctors, patients } = useAppData()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const pulse = Number(form.get('pulse'))
    const oxygen = Number(form.get('oxygen'))
    const temperature = Number(form.get('temperature'))

    addPatient({
      name: String(form.get('name')),
      age: Number(form.get('age')),
      diagnosis: String(form.get('diagnosis')),
      doctor: String(form.get('doctor')),
      room: String(form.get('room')),
      pulse,
      oxygen,
      temperature,
      bloodPressure: String(form.get('bloodPressure')),
      status: String(form.get('status')) as VitalStatus,
    })
    event.currentTarget.reset()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Pacienti" description="Registru operational cu valori vitale, camera, medic responsabil si status de triaj." />

      <SectionCard>
        <h2 className="text-lg font-semibold text-slate-950">Adauga pacient</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 lg:grid-cols-4">
          <input required name="name" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#469ba8]" placeholder="Nume pacient" />
          <input required name="age" type="number" min="0" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#469ba8]" placeholder="Varsta" />
          <input required name="diagnosis" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#469ba8]" placeholder="Diagnostic" />
          <select required name="doctor" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#469ba8]">
            {doctors.map((doctor) => <option key={doctor.id}>{doctor.name}</option>)}
          </select>
          <input required name="room" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#469ba8]" placeholder="Salon / camera" />
          <input required name="pulse" type="number" defaultValue="78" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#469ba8]" placeholder="Puls" />
          <input required name="oxygen" type="number" defaultValue="98" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#469ba8]" placeholder="SpO2" />
          <input required name="temperature" type="number" step="0.1" defaultValue="36.8" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#469ba8]" placeholder="Temperatura" />
          <input required name="bloodPressure" defaultValue="120/80" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#469ba8]" placeholder="Tensiune" />
          <select required name="status" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#469ba8]">
            <option value="stabil">Stabil</option>
            <option value="atentie">Atentie</option>
            <option value="critic">Critic</option>
          </select>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#469ba8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#397f8a] lg:col-span-2">
            <Plus size={16} />
            Adauga pacient
          </button>
        </form>
      </SectionCard>

      <SectionCard>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex w-full max-w-md items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Search size={17} />
            <input className="w-full bg-transparent outline-none" placeholder="Cauta pacient" />
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {patients.map((patient) => (
            <Link key={patient.id} to={`/pacienti/${patient.id}`} className="rounded-lg border border-slate-200 p-4 transition hover:border-[#469ba8]/50 hover:shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-slate-950">{patient.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{patient.id} · {patient.age} ani · {patient.room}</p>
                </div>
                <StatusBadge status={patient.status} />
              </div>
              <p className="mt-4 text-sm text-slate-600">{patient.diagnosis}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <div className="rounded-lg bg-slate-50 p-3"><span className="block text-slate-400">Puls</span><strong>{patient.pulse}</strong></div>
                <div className="rounded-lg bg-slate-50 p-3"><span className="block text-slate-400">SpO2</span><strong>{patient.oxygen}%</strong></div>
                <div className="rounded-lg bg-slate-50 p-3"><span className="block text-slate-400">TA</span><strong>{patient.bloodPressure}</strong></div>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2f7f8b]">
                Deschide fisa <ArrowUpRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

export default PacientiPage
