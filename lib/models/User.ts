import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  persona: { type: String, enum: ['Software Developer', 'Product Manager', 'Team Leader', 'Other'], default: 'Other' },
  ikigai: { type: String },
  psychology: {
    quizResults: Map,
    traits: [String],
    lastPsychUpdate: Date
  },
  lifeGoals: [String],
}, { timestamps: true });

export const User =  model('User', UserSchema);
