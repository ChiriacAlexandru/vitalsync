import { Activity, HeartPulse, SlidersHorizontal } from 'lucide-react'
import { MiniChart, PageHeader, SectionCard } from '../../components/ui'
import { useAppData } from '../../contexts/AppDataContext'
import { ecgSeries, pulseSeries } from '../../data/mock'

const ChartsPage = () => {
  const { currentPatient, patients, role } = useAppData()

  return (
    <div className="space-y-6">
      <PageHeader
        title={role === 'pacient' ? `Graficele mele - ${currentPatient.name}` : 'Grafice zilnice'}
        description={
          role === 'pacient'
            ? 'Vizualizari pentru valorile tale vitale, afisate in modul pacient.'
            : 'Vizualizari pentru ECG, puls si valori critice, pregatite pentru datele mapate de chartsService.'
        }
      />

      <SectionCard>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Selectie context</h2>
            <p className="mt-1 text-sm text-slate-500">
              {role === 'pacient' ? 'Controale mock limitate la pacientul conectat.' : 'Controale mock pentru pacient, interval si tip grafic.'}
            </p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <SlidersHorizontal size={16} />
            Parametri
          </button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none">
            {(role === 'pacient' ? [currentPatient] : patients).map((patient) => <option key={patient.id}>{patient.name}</option>)}
          </select>
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none">
            <option>Ultimele 24 ore</option>
            <option>Ultimele 7 zile</option>
          </select>
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none">
            <option>ECG + Puls</option>
            <option>Doar ECG</option>
            <option>Doar puls</option>
          </select>
        </div>
      </SectionCard>

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionCard>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950">ECG</h2>
            <Activity size={22} className="text-[#469ba8]" />
          </div>
          <MiniChart data={ecgSeries} />
        </SectionCard>
        <SectionCard>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950">Puls</h2>
            <HeartPulse size={22} className="text-rose-600" />
          </div>
          <MiniChart data={pulseSeries} color="#e11d48" />
        </SectionCard>
      </div>
    </div>
  )
}

export default ChartsPage
