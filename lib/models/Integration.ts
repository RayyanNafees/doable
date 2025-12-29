import { Schema, model, models, Types } from 'mongoose';

const IntegrationSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, enum: ['Email', 'ClickUp', 'Todoist'], required: true },
  credentials: { type: Map, of: String }, // Encrypted JSON
  lastSyncedAt: { type: Date }
}, { timestamps: true });

export const Integration = models.Integration || model('Integration', IntegrationSchema);
