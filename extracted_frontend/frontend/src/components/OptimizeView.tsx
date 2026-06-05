import { useState } from "react";
import { Sliders, Cpu, Activity, Play, Zap, Compass, CheckCircle2, MapPin, Globe, X, Server, CheckCircle } from "lucide-react";
import { OptimizationCore } from "../types";

interface OptimizeViewProps {
  optimizationSteps: OptimizationCore[];
  onTriggerOptimization: () => void;
  isOptimizing: boolean;
  selectedTemplateTitle: string;
}

export default function OptimizeView({
  optimizationSteps,
  onTriggerOptimization,
  isOptimizing,
  selectedTemplateTitle,
}: OptimizeViewProps) {
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);

  // Mock optimized medical sites computed on site-selection module
  const optimizedSites = [
    {
      id: 0,
      name: "Mayo Clinic Center for Medicine",
      location: "Rochester, MN",
      geneticMatch: 99.4,
      cap: 280,
      efficiency: "Extreme",
      chief: "Dr. Catherine Vance",
      queueCapacity: "14% Load",
      equipmentStatus: "Active Calibration Checked",
    },
    {
      id: 1,
      name: "MD Anderson Strategic Cohort Vault",
      location: "Houston, TX",
      geneticMatch: 98.1,
      cap: 420,
      efficiency: "Optimal",
      chief: "Dr. Marcus Thorne",
      queueCapacity: "28% Load",
      equipmentStatus: "Active Calibration Checked",
    },
    {
      id: 2,
      name: "Stanford Healthcare Systems Core",
      location: "Palo Alto, CA",
      geneticMatch: 97.5,
      cap: 190,
      efficiency: "Optimal",
      chief: "Dr. Helena Vance",
      queueCapacity: "41% Load",
      equipmentStatus: "Active Calibration Checked",
    },
    {
      id: 3,
      name: "Dana-Farber Cancer Clinical Trials",
      location: "Boston, MA",
      geneticMatch: 95.8,
      cap: 310,
      efficiency: "Stable",
      chief: "Dr. Lawrence Sterling",
      queueCapacity: "24% Load",
      equipmentStatus: "Active Calibration Checked",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-serif font-bold tracking-tight text-[#0F4C81] flex items-center gap-2">
            Quantum Multi-Agent Stratification & Site Optimization
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Running optimization solver matrices for: <span className="text-[#2563EB] font-bold font-mono">{selectedTemplateTitle}</span>
          </p>
        </div>

        <button
          onClick={onTriggerOptimization}
          disabled={isOptimizing}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold font-mono tracking-wider rounded-xl uppercase transition-all ${
            isOptimizing
              ? "bg-purple-50 border border-purple-200 text-purple-600 cursor-not-allowed"
              : "bg-gradient-to-r from-[#0F4C81] to-[#2563EB] text-white cursor-pointer shadow-md shadow-blue-500/20 hover:shadow-lg hover:-translate-y-0.5"
          }`}
        >
          {isOptimizing ? (
            <>
              <Cpu className="w-4 h-4 animate-spin text-purple-600" /> SOLVERS SOLVING...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-white text-white" /> TRIGGER OPTIMIZER SOLVER
            </>
          )}
        </button>
      </div>

      {/* Progress Circles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {optimizationSteps.map((step) => {
          // Circular progress svg configuration
          const radius = 54;
          const circumference = 2 * Math.PI * radius;
          const offset = circumference - (step.progress / 100) * circumference;

          let ringColor = "stroke-[#2563EB]";
          let textColor = "text-[#2563EB]";
          if (step.id === "site-selection") {
            ringColor = "stroke-[#14B8A6]";
            textColor = "text-[#14B8A6]";
          } else if (step.id === "trial-simulation") {
            ringColor = "stroke-purple-500";
            textColor = "text-purple-600";
          }

          return (
            <div
              key={step.id}
              className={`p-6 bg-white border border-slate-200 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group hover:border-[#2563EB]/40 hover:shadow-lg duration-300 transition-all ${
                step.progress > 0 && step.progress < 100 ? "shadow-[0_0_15px_rgba(37,99,235,0.15)] border-[#2563EB]/40" : ""
              }`}
            >
              {/* Backlight flare glow */}
              {isOptimizing && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#2563EB]/10 rounded-full blur-2xl animate-pulse" />
              )}

              {/* Step Label Badge */}
              <span className="text-[10px] font-mono tracking-wider font-bold text-slate-500 uppercase">
                SOLVER INSTANCE: {step.id}
              </span>

              {/* High-Precision SVG Progress Ring */}
              <div className="relative my-7 select-none">
                <svg className="w-32 h-32 transform -rotate-90">
                  {/* Underlay rail */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="stroke-slate-100"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Active gradient border */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className={`${ringColor} transition-all duration-300`}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                  />
                </svg>

                {/* Centered progress percentage */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tighter">
                    {step.progress}%
                  </span>
                  <span className="text-[8px] font-bold text-slate-400 font-mono uppercase">
                    {step.status}
                  </span>
                </div>
              </div>

              {/* Details text descriptors */}
              <div className="space-y-1.5 w-full">
                <h3 className="text-sm font-bold text-slate-900">{step.name}</h3>
                <p className="text-[11px] text-slate-500 leading-normal min-h-[32px]">
                  {step.details}
                </p>
              </div>

              {/* ETA Display footer */}
              <div className="mt-5 w-full border-t border-slate-100 pt-4 flex items-center justify-between text-[11px] font-mono font-bold">
                <span className="text-slate-400">REMAINING ETA</span>
                <span className={`${textColor}`}>{step.eta}</span>
              </div>

              {/* Mini variables log table */}
              <div className="mt-4 w-full bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5">
                {step.metrics.map((met, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500">{met.label}</span>
                    <span className="text-slate-800 font-bold">{met.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Geospatial Site Selection Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#2563EB]" /> Geographic Optimization Map Mesh
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Visualizing physical site clusters selected by the AI constraint solver for genetic stratification pools.
              </p>
            </div>
          </div>

          {/* Map Mesh simulator canvas box (Light Mode interpretation) */}
          <div className="flex-1 bg-[#F8FAFC] text-slate-600 rounded-xl border border-slate-200 p-4 flex flex-col justify-between min-h-[220px] relative overflow-hidden select-none">
            {/* Ambient visual mesh lines */}
            <div className="absolute inset-0 opacity-20 flex flex-col justify-between py-4 pointer-events-none">
              <hr className="border-slate-300" />
              <hr className="border-slate-300" />
              <hr className="border-slate-300" />
              <hr className="border-slate-300" />
            </div>
            
            <div className="absolute inset-0 opacity-20 flex justify-between px-4 pointer-events-none">
              <div className="border-l border-slate-300 h-full" />
              <div className="border-l border-slate-300 h-full" />
              <div className="border-l border-slate-300 h-full" />
              <div className="border-l border-slate-300 h-full" />
            </div>

            {/* Custom high-tech nodes to represent sites on a grid */}
            <div className="relative flex-1 flex items-center justify-center p-8 min-h-[160px]">
              {/* Mayo Clinic Node */}
              <button
                type="button"
                onClick={() => setSelectedSiteId(0)}
                className="absolute top-[20%] left-[50%] flex flex-col items-center cursor-pointer group z-10"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#14B8A6] absolute animate-ping opacity-60" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#14B8A6] relative border-2 border-white shadow-sm" />
                <span className="text-[10px] font-mono text-[#0F4C81] bg-white border border-slate-200 shadow-sm px-1.5 py-0.5 mt-1.5 rounded font-bold uppercase group-hover:border-[#14B8A6] group-hover:text-[#14B8A6] transition-all">
                  MN-MAYO
                </span>
              </button>

              {/* MD Anderson Node */}
              <button
                type="button"
                onClick={() => setSelectedSiteId(1)}
                className="absolute bottom-[25%] left-[45%] flex flex-col items-center cursor-pointer group z-10"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#2563EB] absolute animate-ping opacity-60" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] relative border-2 border-white shadow-sm" />
                <span className="text-[10px] font-mono text-[#0F4C81] bg-white border border-slate-200 shadow-sm px-1.5 py-0.5 mt-1.5 rounded font-bold uppercase group-hover:border-[#2563EB] group-hover:text-[#2563EB] transition-all">
                  TX-MD_AND
                </span>
              </button>

              {/* Stanford health node */}
              <button
                type="button"
                onClick={() => setSelectedSiteId(2)}
                className="absolute top-[40%] left-[15%] flex flex-col items-center cursor-pointer group z-10"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-purple-500 absolute animate-ping opacity-60" />
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500 relative border-2 border-white shadow-sm" />
                <span className="text-[10px] font-mono text-[#0F4C81] bg-white border border-slate-200 shadow-sm px-1.5 py-0.5 mt-1.5 rounded font-bold uppercase group-hover:border-purple-600 group-hover:text-purple-600 transition-all">
                  CA-STAN
                </span>
              </button>

              {/* Boston Harvard Node */}
              <button
                type="button"
                onClick={() => setSelectedSiteId(3)}
                className="absolute top-[18%] right-[15%] flex flex-col items-center cursor-pointer group z-10"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#10B981] absolute animate-ping opacity-60" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] relative border-2 border-white shadow-sm" />
                <span className="text-[10px] font-mono text-[#0F4C81] bg-white border border-slate-200 shadow-sm px-1.5 py-0.5 mt-1.5 rounded font-bold uppercase group-hover:border-[#10B981] group-hover:text-[#10B981] transition-all">
                  MA-HARV
                </span>
              </button>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono font-bold pt-3 border-t border-slate-200 relative z-10">
              <span className="flex items-center gap-1.5 text-[#10B981]">
                <MapPin className="w-3 h-3 text-[#10B981]" /> MULTI-SITE RESOLUTION: SATISFIED
              </span>
              <span>GPS SYNC ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Selected Clinical Trial Sites Information */}
        <div className="lg:col-span-2 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Stratification Site Targets</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specific, highly compliant cluster healthcare locations mapped to this protocol. Click cards for diagnostic audits.
            </p>
          </div>

          <div className="mt-4 space-y-3.5 flex-1 overflow-y-auto">
            {optimizedSites.map((site) => (
              <button
                type="button"
                key={site.id}
                onClick={() => setSelectedSiteId(site.id)}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-[#2563EB] hover:-translate-y-0.5 hover:shadow-sm transition-all w-full text-left cursor-pointer group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-none group-hover:text-[#2563EB] transition-colors">{site.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-[#2563EB]" /> {site.location}
                    </p>
                  </div>
                  <span className="text-[9px] font-bold text-[#10B981] font-mono bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full capitalize">
                    {site.efficiency}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 pt-2 border-t border-slate-200 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-400 block font-bold mb-0.5">GENETIC MATCH</span>
                    <p className="text-slate-900 font-bold">{site.geneticMatch}%</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold mb-0.5">ACTIVE POOL CAP</span>
                    <p className="text-slate-900 font-bold">{site.cap} Candidates</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Site Calibration Audit Modal */}
      {selectedSiteId !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedSiteId(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 border border-blue-100 text-[#2563EB] rounded-xl">
                <Server className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {optimizedSites[selectedSiteId].name}
                </h3>
                <span className="text-xs text-slate-500 font-mono">{optimizedSites[selectedSiteId].location}</span>
              </div>
            </div>

            <div className="space-y-4 mb-6 font-mono text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">LEAD PRACTITIONER</span>
                  <span className="text-slate-900 font-bold">{optimizedSites[selectedSiteId].chief}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">MRI/GENETIC WORKLOAD</span>
                  <span className="text-[#2563EB] font-bold">{optimizedSites[selectedSiteId].queueCapacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">DEVICE VERIFICATION</span>
                  <span className="text-[#10B981] font-semibold">{optimizedSites[selectedSiteId].equipmentStatus}</span>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 text-slate-600 leading-relaxed text-[11px]">
                <p className="font-bold text-[#10B981] mb-1 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> SECURE DECRYPTION KEY OK:
                </p>
                Successfully logged real-time biomarker patient tracking with mayo/md security matrix systems under full HIPAA exclusion hashes.
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  alert(`Direct connection verified! Successfully tested continuous calibration loop.`);
                  setSelectedSiteId(null);
                }}
                className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-sm"
              >
                Remote Diagnostics
              </button>
              <button
                onClick={() => setSelectedSiteId(null)}
                className="flex-1 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 cursor-pointer shadow-sm"
              >
                Close Connection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
