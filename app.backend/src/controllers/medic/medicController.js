import {
  createAlarm,
  createDoctor,
  createPatient,
  getBootstrap,
  getCharts,
  matchAlarm,
  resolveAlarm,
} from '../../services/dashboard/dashboardService.js'

export const bootstrap = async (req, res, next) => {
  try {
    res.status(200).json(await getBootstrap(req.user))
  } catch (error) {
    next(error)
  }
}

export const charts = async (req, res, next) => {
  try {
    res.status(200).json(await getCharts(req.query.patientId, req.user))
  } catch (error) {
    next(error)
  }
}

export const addDoctor = async (req, res, next) => {
  try {
    res.status(201).json(await createDoctor(req.body))
  } catch (error) {
    next(error)
  }
}

export const addPatient = async (req, res, next) => {
  try {
    res.status(201).json(await createPatient(req.body, req.user.id))
  } catch (error) {
    next(error)
  }
}

export const addAlarm = async (req, res, next) => {
  try {
    res.status(201).json(await createAlarm(req.body))
  } catch (error) {
    next(error)
  }
}

export const updateAlarmMatch = async (req, res, next) => {
  try {
    res.status(200).json(await matchAlarm(req.params.id, req.body.patientId))
  } catch (error) {
    next(error)
  }
}

export const confirmAlarm = async (req, res, next) => {
  try {
    res.status(200).json(await resolveAlarm(req.params.id))
  } catch (error) {
    next(error)
  }
}
