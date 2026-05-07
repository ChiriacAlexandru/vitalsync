import type { FormEvent } from 'react'
import { Activity, LockKeyhole, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../../components/ui'
import { useAppData } from '../../contexts/AppDataContext'

const LoginPage = () => {
  const { authError, isLoading, login } = useAppData()
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    await login(String(form.get('email')), String(form.get('password')))
    navigate('/dashboard')
  }

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <img src="/logo.png" alt="VitalSync" className="h-12 w-12 rounded-lg object-contain" />
            <div>
              <p className="text-xl font-semibold text-slate-950">VitalSync</p>
              <p className="text-sm text-slate-500">Autentificare BFF</p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-950">Bine ai revenit</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Acces live pentru consola web Medic/Pacient.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <span className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-slate-500">
                  <Mail size={17} />
                  <input name="email" className="w-full outline-none" defaultValue="medic.demo@vitalsync.ro" />
                </span>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Parola</span>
                <span className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-slate-500">
                  <LockKeyhole size={17} />
                  <input name="password" className="w-full outline-none" type="password" defaultValue="Demo1234!" />
                </span>
              </label>
              {authError && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{authError}</p>}
              <PrimaryButton>{isLoading ? 'Se conecteaza...' : 'Intra in aplicatie'}</PrimaryButton>
            </form>
          </div>
        </div>
      </section>

      <section className="hidden items-center justify-center bg-[#469ba8] px-10 text-white lg:flex">
        <div className="max-w-lg">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-lg bg-white/15">
            <Activity size={30} />
          </div>
          <h2 className="text-4xl font-semibold leading-tight">Monitorizare medicala clara, rapida si calma.</h2>
          <p className="mt-5 text-base leading-7 text-white/82">
            Dashboard pentru alarme, pacienti, grafice ECG si preferinte UI, pregatit sa consume endpointurile BFF.
          </p>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
