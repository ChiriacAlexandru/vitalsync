import { NavLink, Outlet } from 'react-router-dom'
import { Activity, Bell, ChartNoAxesCombined, LayoutDashboard, LogOut, Search, Settings, Stethoscope, UserRound } from 'lucide-react'
import { useAppData } from '../../contexts/AppDataContext'
import { currentUser } from '../../data/mock'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['medic', 'pacient'] },
  { to: '/pacienti', label: 'Pacienti', icon: Activity, roles: ['medic'] },
  { to: '/grafice', label: 'Grafice', icon: ChartNoAxesCombined, roles: ['medic', 'pacient'] },
  { to: '/alarme', label: 'Alarme', icon: Bell, roles: ['medic'] },
  { to: '/medici', label: 'Medici', icon: Stethoscope, roles: ['medic'] },
  { to: '/profil', label: 'Profil', icon: Settings, roles: ['medic', 'pacient'] },
]

const DashboardLayout = () => {
  const { activeAlarms, currentPatient, patients, role, setCurrentPatientId, setRole } = useAppData()
  const visibleNavItems = navItems.filter((item) => item.roles.includes(role))
  const patientAlarmsCount = activeAlarms.filter((alarm) => alarm.patientId === currentPatient.id || alarm.patient === currentPatient.name).length

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      <aside className="sticky top-0 z-20 flex border-b border-slate-200 bg-white/95 backdrop-blur lg:h-screen lg:w-72 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 px-4 py-4 lg:px-5 lg:py-6">
          <img src="/logo.png" alt="VitalSync" className="h-10 w-10 rounded-lg object-contain" />
          <div className="hidden min-w-0 lg:block">
            <p className="text-base font-semibold text-slate-950">VitalSync</p>
            <p className="text-xs text-slate-500">AC, Anul III</p>
          </div>
        </div>

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto px-2 lg:flex-col lg:items-stretch lg:gap-1 lg:px-3">
          {visibleNavItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#469ba8]/10 text-[#2f7f8b]'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'
                  }`
                }
              >
                <Icon size={18} />
                <span className="whitespace-nowrap">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="hidden border-t border-slate-100 px-3 py-4 lg:block">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#469ba8]/10 text-sm font-semibold text-[#2f7f8b]">
              {currentUser.name.split(' ').at(-1)?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{currentUser.name}</p>
              <p className="truncate text-xs text-slate-500">{role === 'medic' ? currentUser.department : currentPatient.name}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-[73px] z-10 border-b border-slate-200 bg-white/90 backdrop-blur lg:top-0">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <label className="hidden w-full max-w-md items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 sm:flex">
              <Search size={17} />
              <input className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Cauta pacient, medic sau alerta" />
            </label>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                {(['medic', 'pacient'] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => setRole(item)}
                    className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                      role === item ? 'bg-white text-[#2f7f8b] shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {item === 'medic' ? 'Medic' : 'Pacient'}
                  </button>
                ))}
              </div>
              {role === 'pacient' && (
                <select
                  value={currentPatient.id}
                  onChange={(event) => setCurrentPatientId(event.target.value)}
                  className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-[#469ba8] md:block"
                >
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              )}
              <button className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50" aria-label="Notificari">
                <Bell size={18} />
                {(role === 'medic' ? activeAlarms.length : patientAlarmsCount) > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />}
              </button>
              <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 sm:flex">
                <UserRound size={16} />
                {role}
              </div>
              <NavLink to="/login" className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50" aria-label="Iesire">
                <LogOut size={18} />
              </NavLink>
            </div>
          </div>
          <div className="border-t border-slate-100 bg-[#469ba8]/5 px-4 py-2 text-xs text-[#2f7f8b] sm:px-6 lg:px-8">
            {role === 'medic'
              ? `${activeAlarms.length} alarme active sincronizate prin BFF mock`
              : `${patientAlarmsCount} alarme active pentru ${currentPatient.name}`}
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
