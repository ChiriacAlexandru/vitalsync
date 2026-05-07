import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Medic', 'Pacient'],
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    specialty: {
      type: String,
      trim: true,
    },
    availability: {
      type: String,
      default: 'Disponibil',
    },
  },
  { timestamps: true },
)

export default mongoose.model('User', userSchema)
