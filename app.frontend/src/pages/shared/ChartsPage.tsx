import { useEffect, useRef, useState } from 'react'
import { Activity, HeartPulse, SlidersHorizontal } from 'lucide-react'
import { MiniChart, PageHeader, SectionCard } from '../../components/ui'
import { useAppData } from '../../contexts/AppDataContext'
import { api } from '../../services/api'
import type { ChartPoint } from '../../types/domain'

type GraphType = 'all' | 'ecg' | 'pulse'

const ChartsPage = () => {
  const { currentPatient, patients, role } = useAppData()
  const [chartData, setChartData] = useState<ChartPoint[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [graphType, setGraphType] = useState<GraphType>('all')
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    const id = currentPatient?.id || patients[0]?.id
    if (id && !selectedPatientId) {
      setSelectedPatientId(id)
    }
  }, [currentPatient?.id, patients, selectedPatientId])

  const loadCharts = async (patientId: string) => {
    try {
      const { data } = await api.get('/bff/charts', { params: { patientId } })
      setChartData(data)
    } catch {
      setChartData([])
    }
  }

  useEffect(() => {
    if (!selectedPatientId) return
    loadCharts(selectedPatientId)
    intervalRef.current = setInterval(() => {
      loadCharts(selectedPatientId)
    }, 30000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [selectedPatientId])

  const handlePatientChange = (name: string) => {
    const patient = patients.find((p) => p.name === name)
    if (patient) setSelectedPatientId(patient.id)
  }

  const ecgData = chartData.map((point) => ({ label: point.label, value: point.ecg ?? point.value }))
  const pulseData = chartData.map((point) => ({ label: point.label, value: point.pulse ?? point.value }))

  return (
    <div className="space-y-6">
      <PageHeader
        title={role === 'pacient' ? `Graficele mele - ${currentPatient?.name ?? 'pacient'}` : 'Grafice zilnice'}
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
              {role === 'pacient' ? 'Controale limitate la pacientul conectat.' : 'Controale pentru pacient, interval si tip grafic.'}
            </p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <SlidersHorizontal size={16} />
            Parametri
          </button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none"
            value={patients.find((p) => p.id === selectedPatientId)?.name ?? ''}
            onChange={(e) => handlePatientChange(e.target.value)}
          >
            {(role === 'pacient' && currentPatient ? [currentPatient] : patients).map((patient) => (
              <option key={patient.id}>{patient.name}</option>
            ))}
          </select>
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none">
            <option>Ultimele 24 ore</option>
            <option>Ultimele 7 zile</option>
          </select>
          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none"
            value={graphType}
            onChange={(e) => setGraphType(e.target.value as GraphType)}
          >
            <option value="all">ECG + Puls</option>
            <option value="ecg">Doar ECG</option>
            <option value="pulse">Doar puls</option>
          </select>
        </div>
      </SectionCard>

      <div className="grid gap-5 xl:grid-cols-2">
        {(graphType === 'all' || graphType === 'ecg') && (
          <SectionCard>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-950">ECG</h2>
              <Activity size={22} className="text-[#469ba8]" />
            </div>
            <MiniChart data={ecgData} />
          </SectionCard>
        )}
        {(graphType === 'all' || graphType === 'pulse') && (
          <SectionCard>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-950">Puls</h2>
              <HeartPulse size={22} className="text-rose-600" />
            </div>
            <MiniChart data={pulseData} color="#e11d48" />
          </SectionCard>
        )}
      </div>
    </div>
  )
}

export default ChartsPage
