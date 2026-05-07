import { Router } from 'express'
import {
  addAlarm,
  addDoctor,
  addPatient,
  bootstrap,
  charts,
  confirmAlarm,
  updateAlarmMatch,
} from '../../controllers/medic/medicController.js'
import { authMiddleware, requireRole } from '../../middlewares/auth/authMiddleware.js'

const router = Router()

router.use(authMiddleware)
router.get('/bootstrap', bootstrap)
router.get('/charts', charts)
router.post('/medic/doctors', requireRole('Medic'), addDoctor)
router.post('/medic/patients', requireRole('Medic'), addPatient)
router.post('/alarms', requireRole('Medic'), addAlarm)
router.patch('/alarms/:id/match', requireRole('Medic'), updateAlarmMatch)
router.patch('/alarms/:id/resolve', requireRole('Medic'), confirmAlarm)

export default router
