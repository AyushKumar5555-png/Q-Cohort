export enum ViewType {
  LANDING = "landing",
  DASHBOARD = "dashboard",
  EDITOR = "editor",
  COHORT = "cohort",
  OPTIMIZE = "optimize",
  SIMULATOR = "simulator",
  REPORTS = "reports",
  AUDIT = "audit",
  DOCUMENTS = "documents",
  SETTINGS = "settings",
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  description: string;
  iconName: string;
}

export interface CompilerLog {
  id: string;
  timestamp: string;
  type: "info" | "success" | "warning" | "error" | "system";
  message: string;
}

export interface ActiveConstraint {
  id: string;
  name: string;
  status: "active" | "satisfied" | "violated";
  category: "Regulatory" | "Feasibility" | "Budgetary" | "Ethical";
  score: number;
}

export interface OptimizationCore {
  id: string;
  name: string;
  progress: number;
  status: "idle" | "running" | "completed" | "error";
  eta: string;
  details: string;
  metrics: { label: string; value: string }[];
}

export interface TrialReport {
  id: string;
  title: string;
  protocolKey: string;
  phase: string;
  therapeuticArea: string;
  targetEnrollment: number;
  optimizedFeasibility: number;
  expectedCostSaving: string;
  status: "Approved" | "Audited" | "Draft" | "Action Required";
  createdAt: string;
  author: string;
}
