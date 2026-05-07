import mongoose from 'mongoose'

const alarmSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    message: String,
    severity: {
      type: String,
      enum: ['stabil', 'atentie', 'critic'],
      default: 'atentie',
    },
    sensorValue: Number,
    patientNote: String,
    resolved: {
      type: Boolean,
      default: false,
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export default mongoose.model('Alarm', alarmSchema)
