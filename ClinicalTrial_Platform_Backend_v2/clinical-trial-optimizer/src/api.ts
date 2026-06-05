/**
 * API Client — Central module for all backend communication.
 * Connects the React frontend to the FastAPI backend.
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── Generic fetch wrapper ──────────────────────────────────────────────────
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API Error ${res.status}`);
  }
  return res.json();
}

// ── Health & Status ────────────────────────────────────────────────────────
export async function getHealthStatus() {
  return apiFetch<{
    status: string;
    database: { status: string; patients: number; trials: number };
    ai_engine: { status: string; concordance_index: number };
    compiler: string;
    quantum_optimizer: string;
    trial_matcher: string;
  }>("/health");
}

export async function getDashboardStats() {
  return apiFetch<{
    total_patients: number;
    active_trials: number;
    total_predictions: number;
    eligible_matches: number;
    iot_readings: number;
    cohorts_optimized: number;
    high_responders: number;
    critical_alerts: number;
  }>("/stats");
}

export async function getDashboardMetrics() {
  return apiFetch<{
    total_patients: number;
    active_trials: number;
    total_predictions: number;
    eligible_matches: number;
    estimated_cost_saving: string;
    recruitment_efficiency: number;
    cohort_quality: number;
    trial_duration_months: number;
    protocol_compliance: number;
    amendment_reduction: number;
    tcga_data_loaded: boolean;
    ai_concordance: number;
  }>("/dashboard/metrics");
}

// ── DSL Compiler ───────────────────────────────────────────────────────────
export interface CompileResult {
  success: boolean;
  trial_name: string;
  ir: Record<string, unknown>;
  tokens_count: number;
  errors: string[];
  warnings: string[];
  compliance: {
    violations: Array<{ id: string; description: string; severity: string; status: string }>;
    passed: Array<{ id: string; description: string; severity: string; status: string }>;
  };
  stages_completed: string[];
}

export async function compileProtocol(dslCode: string): Promise<CompileResult> {
  return apiFetch<CompileResult>("/compile", {
    method: "POST",
    body: JSON.stringify({ dsl_code: dslCode }),
  });
}

// ── Quantum Cohort Optimizer ───────────────────────────────────────────────
export interface QuantumResult {
  method: string;
  qubits_used: number;
  shots: number;
  unique_states_explored: number;
  best_bitstring: string;
  selected_count: number;
  target_count: number;
  selected_patients: Array<Record<string, unknown>>;
  total_response_score: number;
  total_cost: number;
  circuit_depth: number;
  circuit_gates: Record<string, number>;
}

export interface CohortOptimizeResult {
  total_patients_screened: number;
  eligible_after_filter: number;
  candidates_sent_to_quantum: number;
  quantum_result: QuantumResult;
  combinatorial_complexity: string;
  qubo_matrix_size: string;
  error?: string;
}

export async function optimizeCohort(params: {
  min_age?: number;
  max_age?: number;
  diagnoses?: string[];
  exclude_cardiac?: boolean;
  max_insulin?: number;
  target_n?: number;
  budget?: number;
  use_db_patients?: boolean;
}): Promise<CohortOptimizeResult> {
  return apiFetch<CohortOptimizeResult>("/optimize-cohort", {
    method: "POST",
    body: JSON.stringify({
      min_age: params.min_age ?? 30,
      max_age: params.max_age ?? 75,
      diagnoses: params.diagnoses ?? ["Infiltrating duct carcinoma, NOS"],
      exclude_cardiac: params.exclude_cardiac ?? true,
      max_insulin: params.max_insulin ?? 80,
      target_n: params.target_n ?? 5,
      budget: params.budget ?? 100000,
      use_db_patients: params.use_db_patients ?? true,
    }),
  });
}

// ── AI Response Predictor ──────────────────────────────────────────────────
export interface PredictionResult {
  model_summary: { concordance_index: number; features: string[] };
  patients_analysed: number;
  high_responders: number;
  moderate_responders: number;
  non_responders: number;
  predictions: Array<{
    patient_id: string;
    response_probability_12m: number;
    median_response_months: number;
    risk_score: number;
    classification: string;
    recommendation: string;
    causal_drivers: Array<{
      feature: string;
      coefficient: number;
      hazard_ratio: number;
      p_value: number;
      significant: boolean;
    }>;
  }>;
}

export async function predictResponse(patients: Array<Record<string, unknown>>): Promise<PredictionResult> {
  return apiFetch<PredictionResult>("/predict", {
    method: "POST",
    body: JSON.stringify(patients),
  });
}

// ── Trial Matcher ──────────────────────────────────────────────────────────
export async function matchPatient(patient: Record<string, unknown>) {
  return apiFetch<{
    patient_id: string;
    eligible_trials_found: number;
    top_matches: Array<Record<string, unknown>>;
    all_matches: Array<Record<string, unknown>>;
    recommendation: string;
    ai_prediction: Record<string, unknown>;
  }>("/match", {
    method: "POST",
    body: JSON.stringify(patient),
  });
}

// ── Full Pipeline ──────────────────────────────────────────────────────────
export async function runFullPipeline(dslCode: string, patients: Array<Record<string, unknown>>) {
  return apiFetch<{
    pipeline: string;
    stages: string[];
    compiler_result: CompileResult;
    ai_predictions: Array<Record<string, unknown>>;
    quantum_cohort: CohortOptimizeResult;
    trial_matches: Array<Record<string, unknown>>;
  }>("/full-pipeline", {
    method: "POST",
    body: JSON.stringify({ dsl_code: dslCode, patients }),
  });
}

// ── TCGA Data ──────────────────────────────────────────────────────────────
export async function loadTcgaData(maxCases: number = 500) {
  return apiFetch<{
    status: string;
    total_parsed: number;
    newly_loaded: number;
    already_existed: number;
    source: string;
  }>(`/load-tcga?max_cases=${maxCases}`, { method: "POST" });
}

// ── Data Retrieval ─────────────────────────────────────────────────────────
export async function getTrials() {
  return apiFetch<{ active_trials: Array<Record<string, unknown>>; total: number }>("/trials");
}

export async function getPatients(skip = 0, limit = 50) {
  return apiFetch<{ patients: Array<Record<string, unknown>>; total: number }>(
    `/patients?skip=${skip}&limit=${limit}`
  );
}

export async function getRecentPredictions(limit = 20) {
  return apiFetch<{ predictions: Array<Record<string, unknown>> }>(
    `/predictions/recent?limit=${limit}`
  );
}

export async function getRecentCohorts(limit = 10) {
  return apiFetch<{ cohorts: Array<Record<string, unknown>> }>(
    `/cohorts/recent?limit=${limit}`
  );
}

export async function getCompilerHistory(limit = 20) {
  return apiFetch<{ logs: Array<Record<string, unknown>> }>(
    `/compiler/history?limit=${limit}`
  );
}
