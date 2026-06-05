import { useState } from "react";
import { Terminal, ShieldCheck, Play, Layers, FileCode, X, Sparkles, ChevronRight } from "lucide-react";
import { CompilerLog, ActiveConstraint } from "../types";

interface EditorViewProps {
  dslCode: string;
  onDslCodeChange: (code: string) => void;
  compilerLogs: CompilerLog[];
  onCompile: () => void;
  isCompiling: boolean;
  constraints: ActiveConstraint[];
  onUpdateConstraintScore: (id: string, score: number) => void;
}

export default function EditorView({
  dslCode,
  onDslCodeChange,
  compilerLogs,
  onCompile,
  isCompiling,
  constraints,
}: EditorViewProps) {
  // Line numbers generation helper
  const lineCount = dslCode.split("\n").length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 16) }, (_, i) => i + 1);

  const [selectedConstraintId, setSelectedConstraintId] = useState<string | null>(null);

  // Suggested keywords auto-injector helper
  const suggestions = [
    { token: "target_enrollment", type: "Parameter", value: "target_enrollment = 250;" },
    { token: "minimize_feasibility_risk", type: "Risk Engine", value: "minimize_feasibility_risk = extreme;" },
    { token: "quantum_annealing", type: "Hardware Selector", value: "quantum_annealing = active;" },
    { token: "exclusion_criteria", type: "Metadata", value: 'exclusion_criteria = ["HbA1c > 8%", "Age < 18"];' },
  ];

  const injectSuggestion = (textToInject: string) => {
    onDslCodeChange(dslCode + "\n  " + textToInject);
  };

  const constraintAuditInformation: Record<string, {
    title: string;
    description: string;
    recommendation: string;
    ruleToAppend: string;
    impact: string;
  }> = {
    "reg-compliance": {
      title: "FDA Regulatory Lock Audit",
      description: "Checks language semantics against historical FDA Title-21 guidelines. Scans for risk vectors such as enrollment deficits or exclusionary conflicts.",
      recommendation: "Inject extreme-level feasibility risk boundaries.",
      ruleToAppend: "minimize_feasibility_risk = extreme;",
      impact: "Raises overall feasibility success matrix from 64% to 95%.",
    },
    "op-feasibility": {
      title: "Operational Site Load Audit",
      description: "Validates multi-hospital coordinate schedules to make sure local clinical equipment load and staff shifts are fully balanced.",
      recommendation: "Pre-allocate high-efficiency medical centers Mayo Clinic and Stanford.",
      ruleToAppend: 'location_sites = ["Mayo Clinic,MN", "Stanford Systems,CA"];',
      impact: "Saves up to 45 days in initial site setup and operational delays.",
    },
    "cohort-exclusion": {
      title: "Dropout Risk Protection Audit",
      description: "Simulates patient genetic subsets using high-affinity matrix grouping parameters to maximize efficacy response signals.",
      recommendation: "Configure exclusionary criteria markers in the active biomarker cohort.",
      ruleToAppend: 'biomarkers = ["EGFR-mutated", "KRAS-wildtype"];',
      impact: "Maintains high patient homogeneity parameters to avoid late-stage dropouts.",
    },
    "budgetary-alloc": {
      title: "Budget Cap Allocation Limit Audit",
      description: "Controls the financial parameters matching participant enrollment metrics to local study capital caps.",
      recommendation: "Limit target enrollment to optimized pilot cohort bounds.",
      ruleToAppend: "target_enrollment = 120;",
      impact: "Protects protocol configuration from costly CapEx overhead overruns.",
    },
  };

  const handleApplyConstraintFix = (id: string, rule: string) => {
    injectSuggestion(rule);
    setSelectedConstraintId(null);
    setTimeout(() => {
      onCompile();
    }, 150);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header and metadata */}
      <div>
        <h2 className="text-xl font-serif font-bold tracking-tight text-[#0F4C81] flex items-center gap-2">
          Protocol Design & DSL Compiler
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Draft structured compliance rules using Copernicus-DSL. Click to parse structure, validate semantic limits, and trigger the optimization routing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: DSL Code Editor */}
        <div className="lg:col-span-7 bg-white rounded-2xl flex flex-col overflow-hidden shadow-sm border border-slate-200 relative">
          {/* Editor Header Toolbar */}
          <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="w-3 h-3 rounded-full bg-slate-300" />
              </div>
              <span className="text-slate-300 text-xs font-mono select-none px-2">|</span>
              <span className="text-slate-600 text-xs font-mono font-bold flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-[#2563EB]" /> protocol_manifest.copernicus
              </span>
            </div>

            <button
              onClick={onCompile}
              disabled={isCompiling}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono rounded-xl border transition-all ${
                isCompiling
                  ? "bg-amber-50 border-amber-200 text-amber-600 cursor-not-allowed"
                  : "bg-[#2563EB] hover:bg-blue-700 border-blue-600 text-white cursor-pointer shadow-md"
              }`}
            >
              {isCompiling ? (
                <>
                  <Layers className="w-3.5 h-3.5 animate-spin" /> COMPILING...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white text-white" /> COMPILE & OPTIMIZE
                </>
              )}
            </button>
          </div>

          <div className="flex flex-1 min-h-[460px] font-mono text-xs overflow-y-auto relative">
            {/* Gutter Line Numbers */}
            <div className="w-12 bg-slate-50 text-right pr-3.5 py-4 text-slate-400 border-r border-slate-200 select-none text-[11px] leading-relaxed font-sans">
              {lineNumbers.map((num) => (
                <div key={num} className="h-[21px]">
                  {num}
                </div>
              ))}
            </div>

            {/* Input Text Area */}
            <textarea
              value={dslCode}
              onChange={(e) => onDslCodeChange(e.target.value)}
              className="flex-1 bg-white text-slate-800 p-4 outline-none resize-none font-mono text-[13px] leading-[21px] placeholder-slate-400 focus:ring-0 overflow-y-hidden"
              spellCheck="false"
              placeholder="# Type standard trial protocol definitions here..."
            />
          </div>

          {/* Suggested helper tray */}
          <div className="bg-slate-50 px-5 py-4 border-t border-slate-200 space-y-2">
            <p className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              Copernicus Auto-Completion Suggestions
            </p>
            <div className="flex flex-wrap gap-2 pt-1.5">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => injectSuggestion(sug.value)}
                  className="px-2.5 py-1 text-[10px] font-mono rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-[#2563EB] hover:text-[#2563EB] hover:shadow-sm transition-all text-left cursor-pointer flex items-center gap-1.5 font-semibold"
                >
                  <span className="text-slate-500 font-sans text-[8px] font-bold tracking-tight bg-slate-100 px-1.5 py-0.5 rounded uppercase border border-slate-200">
                    {sug.type}
                  </span>
                  {sug.token}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Compiler Validation Terminal */}
        <div className="lg:col-span-5 bg-white rounded-2xl flex flex-col overflow-hidden shadow-sm border border-slate-200">
          {/* Title Header */}
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#10B981] animate-pulse" />
              <span className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wide">Terminal Output</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[10px] text-slate-500 font-mono font-bold tracking-wider">IDLE / READY</span>
            </div>
          </div>

          {/* Active Logs Console screen (Kept slightly darker for terminal feel, but lightened up) */}
          <div className="flex-1 p-5 font-mono text-[11px] space-y-3 overflow-y-auto bg-slate-900 min-h-[240px] max-h-[350px]">
            {compilerLogs.length === 0 ? (
              <div className="text-slate-500 flex flex-col items-center justify-center h-full py-12 space-y-2">
                <FileCode className="w-8 h-8 text-slate-700 animate-pulse" />
                <p>Parser Idle. Waiting for compilation trigger...</p>
              </div>
            ) : (
              compilerLogs.map((log) => {
                let colorClass = "text-slate-400";
                if (log.type === "success") colorClass = "text-[#10B981] font-semibold";
                if (log.type === "warning") colorClass = "text-[#F59E0B]";
                if (log.type === "error") colorClass = "text-red-500 font-bold";
                if (log.type === "system") colorClass = "text-[#2563EB] font-mono";

                return (
                  <div key={log.id} className="leading-relaxed flex items-start gap-2.5">
                    <span className="text-[10px] text-slate-500 select-none font-sans shrink-0">
                      [{log.timestamp}]
                    </span>
                    <span className={`${colorClass} whitespace-pre-wrap break-all flex-1`}>
                      {log.message}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Simulated Active Constraints Board */}
          <div className="bg-slate-50 p-5 border-t border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase font-mono">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" /> DSL Constraints Board
            </h4>

            <div className="grid grid-cols-2 gap-3.5 pt-1">
              {constraints.map((c) => {
                let badgeColor = "bg-slate-100 border-slate-200 text-slate-500";
                if (c.status === "satisfied") badgeColor = "bg-emerald-50 border-emerald-200 text-[#10B981]";
                if (c.status === "active") badgeColor = "bg-blue-50 border-blue-200 text-[#2563EB]";
                if (c.status === "violated") badgeColor = "bg-red-50 border-red-200 text-red-500 animate-pulse";

                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setSelectedConstraintId(c.id)}
                    className="p-3 bg-white border border-slate-200 hover:border-[#2563EB]/40 rounded-xl space-y-2 hover:-translate-y-0.5 hover:shadow-sm text-left transition-all font-mono cursor-pointer w-full group"
                    title="Audit Constraint Boundaries"
                  >
                    <div className="flex justify-between items-start gap-2 text-[10px]">
                      <span className="font-bold text-slate-700 truncate group-hover:text-[#2563EB] transition-colors">{c.name}</span>
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${badgeColor} font-sans shrink-0`}>
                        {c.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                        <span>{c.category}</span>
                        <span>{c.score}% Match</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${c.score}%` }}
                          className={`h-full transition-all duration-1000 ${
                            c.status === "satisfied"
                              ? "bg-[#10B981]"
                              : c.status === "active"
                              ? "bg-[#2563EB]"
                              : "bg-red-500"
                          }`}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Constraint Modal */}
      {selectedConstraintId && constraintAuditInformation[selectedConstraintId] && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedConstraintId(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 border border-emerald-100 text-[#10B981] rounded-xl">
                <ShieldCheck className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {constraintAuditInformation[selectedConstraintId].title}
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-mono p-3 bg-slate-50 rounded-xl border border-slate-200 mb-5">
              {constraintAuditInformation[selectedConstraintId].description}
            </p>

            <div className="space-y-4 mb-6 text-xs">
              <div>
                <span className="text-slate-500 block uppercase font-mono font-bold text-[10px]">Optimizing Vector Impact</span>
                <span className="text-[#10B981] font-bold block mt-0.5">
                  {constraintAuditInformation[selectedConstraintId].impact}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono space-y-1">
                <span className="text-slate-500 font-bold text-[10px] uppercase block">Suggested Auto-Fix Code:</span>
                <code className="text-[#2563EB] font-bold text-xs">
                  {constraintAuditInformation[selectedConstraintId].ruleToAppend}
                </code>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleApplyConstraintFix(
                  selectedConstraintId,
                  constraintAuditInformation[selectedConstraintId].ruleToAppend
                )}
                className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                Auto-Correct <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSelectedConstraintId(null)}
                className="flex-1 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 shadow-sm transition-all cursor-pointer"
              >
                Cancel Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
