import { Schema, model, models, Types } from 'mongoose';

const ProjectSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Active', 'On Hold', 'Completed'], default: 'Active' },
  assignedEmployees: [{ type: Types.ObjectId, ref: 'Employee' }]
}, { timestamps: true });

export const Project =  model('Project', ProjectSchema);
