import { Schema, model, models, Types } from 'mongoose';

const SubstepSchema = new Schema({
  title: { type: String, required: true },
  durationMins: { type: Number, default: 5 },
  isCompleted: { type: Boolean, default: false },
});

const TaskSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  projectId: { type: Types.ObjectId, ref: 'Project' },
  title: { type: String, required: true },
  description: { type: String },
  why: { type: String }, // The user's "Why" behind the task
  priority: { type: Number, min: 1, max: 5, default: 3 },
  eisenhowerQuadrant: {
    type: String,
    enum: ['Urgent & Important', 'Not Urgent & Important', 'Urgent & Not Important', 'Not Urgent & Not Important']
  },
  dueDate: { type: Date },
  effortEstimateMins: { type: Number },
  isCompleted: { type: Boolean, default: false },
  substeps: [SubstepSchema],
  lastDelayedAt: { type: Date },
  reversePomodoroActive: { type: Boolean, default: false }
}, { timestamps: true });

export const Task =  model('Task', TaskSchema);
