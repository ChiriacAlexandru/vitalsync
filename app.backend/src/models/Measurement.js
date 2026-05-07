import mongoose from 'mongoose'

const measurementSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
    puls: Number,
    ecg: Number,
    temperatura: Number,
    umiditate: Number,
    spo2: Number,
    tensiune: String,
    accelBurst: String,
  },
  { timestamps: true },
)

export default mongoose.model('Measurement', measurementSchema)
