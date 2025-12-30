import { Schema, model, models } from 'mongoose';

const EmployeeSchema = new Schema({
  name: { type: String, required: true },
  psychology: {
    strengths: [String],
    personalityType: String,
    motivationFactors: [String]
  },
  pastCompletionRate: { type: Number, default: 0 }
}, { timestamps: true });

export const Employee =  model('Employee', EmployeeSchema);
