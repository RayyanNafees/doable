export type ActionResult<T = unknown> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never };

export interface Integration {
  _id: string;
  platform: string;
  userId: string | User;
  lastSyncedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface User {
  _id: string;
  email: string;
  persona: 'Software Developer' | 'Product Manager' | 'Team Leader' | 'Other';
  ikigai?: string;
  psychology?: {
    quizResults?: Record<string, string>;
    traits?: string[];
    lastPsychUpdate?: Date;
  };
  lifeGoals?: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Employee {
  _id: string;
  name: string;
  psychology?: {
    strengths?: string[];
    personalityType?: string;
    motivationFactors?: string[];
  };
  pastCompletionRate: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Project {
  _id: string;
  userId: string | User;
  title: string;
  description?: string;
  status: 'Active' | 'On Hold' | 'Completed';
  assignedEmployees?: (string | Employee)[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Substep {
  _id?: string;
  title: string;
  durationMins: number;
  isCompleted: boolean;
}

export interface Task {
  _id: string;
  userId: string | User;
  projectId?: string | Project;
  title: string;
  description?: string;
  why?: string;
  priority: number;
  eisenhowerQuadrant?:
  | 'Urgent & Important'
  | 'Not Urgent & Important'
  | 'Urgent & Not Important'
  | 'Not Urgent & Not Important';
  dueDate?: string | Date | null;
  effortEstimateMins?: number;
  isCompleted: boolean;
  substeps?: Substep[];
  lastDelayedAt?: string | Date | null;
  reversePomodoroActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface GeneratedTask {
  title: string;
  description: string;
  effortEstimateMins: number;
  recommendedTraits: string[];
}

export interface AIRecommendation {
  employeeId: string;
  employeeName: string;
  matchScore: number;
  reasoning: string;
}
