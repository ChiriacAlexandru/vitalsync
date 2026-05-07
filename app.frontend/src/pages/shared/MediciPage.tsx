import type { FormEvent } from 'react'
import { CalendarClock, Stethoscope } from 'lucide-react'
import { PageHeader, SectionCard } from '../../components/ui'
import { useAppData } from '../../contexts/AppDataContext'

const MediciPage = () => {
  const { addDoctor, doctors } = useAppData()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    addDoctor({
      name: String(form.get('name')),
      specialty: String(form.get('specialty')),
      availability: String(form.get('availability')),
    })
    event.currentTarget.reset()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Medici" description="Echipa clinica, incarcarea pe pacienti si disponibilitatea curenta." />
      <SectionCard>
        <h2 className="text-lg font-semibold text-slate-950">Adauga medic</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
          <input required name="name" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#469ba8]" placeholder="Nume medic" />
          <input required name="specialty" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#469ba8]" placeholder="Specializare" />
          <input required name="availability" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#469ba8]" placeholder="Disponibilitate" />
          <button className="rounded-lg bg-[#469ba8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#397f8a]">Adauga</button>
        </form>
      </SectionCard>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {doctors.map((doctor) => (
          <SectionCard key={doctor.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#469ba8]/10 text-[#2f7f8b]">
                <Stethoscope size={21} />
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{doctor.id}</span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-950">{doctor.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{doctor.specialty}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-slate-50 p-3">
                <span className="block text-slate-400">Pacienti</span>
                <strong>{doctor.patients}</strong>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <span className="block text-slate-400">Alerte</span>
                <strong>{doctor.alerts}</strong>
              </div>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-600">
              <CalendarClock size={16} className="text-[#469ba8]" />
              {doctor.availability}
            </p>
          </SectionCard>
        ))}
      </div>
    </div>
  )
}

export default MediciPage
