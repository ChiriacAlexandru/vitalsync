import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nume: { type: String, required: true },
    prenume: { type: String, required: true },
    cnp: { type: String, required: true, unique: true },
    varsta: Number,
    adresa: String,
    telefon: String,
    profesie: String,
    locMunca: String,
    istoricMedical: String,
    alergii: String,
    consultatiiCardiologice: String,
    camera: String,
    tensiune: String,
    spo2: Number,
    thresholds: {
      pulsMax: { type: Number, default: 100 },
      pulsMin: { type: Number, default: 50 },
      tempMax: { type: Number, default: 37.5 },
      spo2Min: { type: Number, default: 94 },
    },
  },
  { timestamps: true },
)

export default mongoose.model('Patient', patientSchema)
