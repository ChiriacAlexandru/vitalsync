import app from './app.js'
import { env } from './config/env.js'
import { connectDatabase } from './config/database.js'
import { ensureDemoDoctor } from './services/dashboard/dashboardService.js'

await connectDatabase()
await ensureDemoDoctor()

app.listen(env.port, () => {
  console.log(`VitalSync backend listening on http://localhost:${env.port}`)
})
