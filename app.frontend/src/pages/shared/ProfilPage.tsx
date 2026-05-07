import { Bell, Moon, ShieldCheck, UserRound } from 'lucide-react'
import { PageHeader, SectionCard } from '../../components/ui'
import { useAppData } from '../../contexts/AppDataContext'

const ProfilPage = () => {
  const { currentPatient, currentUser, role } = useAppData()
  const displayName = role === 'pacient' ? currentPatient?.name : currentUser?.name
  const displayEmail = role === 'pacient' ? currentUser?.email : currentUser?.email
  const displayMeta = role === 'pacient' ? currentPatient?.diagnosis : currentUser?.specialty

  return (
    <div className="space-y-6">
      <PageHeader title="Profil si preferinte" description="Profil incarcat din backend si preferinte UI persistate ulterior in BFF." />

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionCard>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#469ba8]/10 text-xl font-semibold text-[#2f7f8b]">
              {displayName?.split(' ').at(-1)?.charAt(0) ?? 'V'}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-950">{displayName ?? 'Utilizator VitalSync'}</h2>
              <p className="text-sm text-slate-500">{displayEmail ?? 'Fara email incarcat'}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm">
            <p className="flex items-center gap-2 text-slate-600"><UserRound size={16} className="text-[#469ba8]" /> Rol: {role}</p>
            <p className="flex items-center gap-2 text-slate-600"><ShieldCheck size={16} className="text-[#469ba8]" /> {role === 'pacient' ? 'Diagnostic' : 'Specializare'}: {displayMeta ?? 'Nespecificat'}</p>
          </div>
        </SectionCard>

        <SectionCard>
          <h2 className="text-lg font-semibold text-slate-950">Preferinte aplicatie</h2>
          <div className="mt-5 divide-y divide-slate-100">
            {[
              { icon: Bell, title: 'Alarme in timp real', desc: 'Notificari vizibile in header si pagina Alarme', active: true },
              { icon: Moon, title: 'Tema discreta', desc: 'Interfata luminoasa, minimalista, cu accent teal', active: true },
              { icon: ShieldCheck, title: 'RBAC pregatit', desc: 'Separare Medic/Pacient prin rute protejate in pasul urmator', active: false },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex items-center justify-between gap-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-[#469ba8]">
                      <Icon size={19} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  <span className={`h-6 w-11 rounded-full p-1 ${item.active ? 'bg-[#469ba8]' : 'bg-slate-200'}`}>
                    <span className={`block h-4 w-4 rounded-full bg-white transition ${item.active ? 'translate-x-5' : ''}`} />
                  </span>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

export default ProfilPage
