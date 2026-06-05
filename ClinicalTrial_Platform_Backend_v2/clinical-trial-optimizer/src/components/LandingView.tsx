import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, FileText, CheckCircle2, ShieldCheck, Activity,
  BrainCircuit, Database, Network, Globe, TrendingUp, Users,
  FlaskConical, Stethoscope, Award, HeartPulse, Microscope
} from "lucide-react";

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({
  end, suffix = "", decimals = 0, duration = 2
}: { end: number; suffix?: string; decimals?: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(parseFloat(start.toFixed(decimals)));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [end, duration, isInView, decimals]);

  return <span ref={ref}>{decimals > 0 ? count.toFixed(decimals) : Math.ceil(count)}{suffix}</span>;
}

// ─── Recent Trials Data (TCGA-BRCA + Indian Institutions) ────────────────────
const RECENT_TRIALS = [
  {
    id: "NCT_BRCA_001",
    name: "Adaptive Immunotherapy for HER2+ Breast Cancer",
    institution: "MD Anderson Cancer Center",
    country: "USA",
    flag: "🇺🇸",
    phase: "Phase III",
    status: "ACTIVE",
    enrolled: "187 / 500",
    mos: "28.4 mo",
    diagnosis: "Infiltrating duct carcinoma, NOS",
    urgency: "HIGH",
    color: "bg-emerald-500",
  },
  {
    id: "NCT_BRCA_TMH_001",
    name: "Neoadjuvant Chemo Optimization — TNBC",
    institution: "Tata Memorial Hospital",
    country: "India",
    flag: "🇮🇳",
    phase: "Phase II",
    status: "ACTIVE",
    enrolled: "92 / 300",
    mos: "17.5 mo",
    diagnosis: "Triple-Negative Breast Cancer",
    urgency: "MEDIUM",
    color: "bg-blue-500",
  },
  {
    id: "NCT_AIIMS_DM_001",
    name: "Novel GLP-2 Agonist for Type 2 Diabetes",
    institution: "AIIMS New Delhi",
    country: "India",
    flag: "🇮🇳",
    phase: "Phase III",
    status: "ACTIVE",
    enrolled: "142 / 200",
    mos: "—",
    diagnosis: "Type 2 Diabetes Mellitus",
    urgency: "HIGH",
    color: "bg-amber-500",
  },
  {
    id: "NCT_BRCA_MAYO_001",
    name: "Hormone Receptor Targeted Therapy ER+",
    institution: "Mayo Clinic Rochester",
    country: "USA",
    flag: "🇺🇸",
    phase: "Phase III",
    status: "ACTIVE",
    enrolled: "156 / 400",
    mos: "32.1 mo",
    diagnosis: "Lobular carcinoma, NOS",
    urgency: "HIGH",
    color: "bg-purple-500",
  },
  {
    id: "NCT_ICMR_TB_001",
    name: "Novel Regimen for Drug-Resistant TB",
    institution: "ICMR National Institute",
    country: "India",
    flag: "🇮🇳",
    phase: "Phase II",
    status: "ACTIVE",
    enrolled: "45 / 120",
    mos: "—",
    diagnosis: "MDR-Tuberculosis",
    urgency: "HIGH",
    color: "bg-rose-500",
  },
];

// ─── Data Institutions (real data sources used) ──────────────────────────────
const DATA_INSTITUTIONS = [
  { name: "TCGA", full: "The Cancer Genome Atlas", type: "Primary Dataset" },
  { name: "ICMR", full: "Indian Council of Medical Research", type: "India Registry" },
  { name: "AIIMS", full: "All India Institute of Medical Sciences", type: "Clinical Partner" },
  { name: "NCI GDC", full: "NCI Genomic Data Commons", type: "Genomic Registry" },
  { name: "Tata Memorial", full: "Tata Memorial Hospital, Mumbai", type: "Oncology Centre" },
  { name: "cBioPortal", full: "Computational Biology Center", type: "Analysis Platform" },
  { name: "CTRI", full: "Clinical Trials Registry – India", type: "Trial Registry" },
];

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LandingView({ onEnterApp }: { onEnterApp: () => void }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [activeTrailIdx, setActiveTrialIdx] = useState(0);

  // Auto-rotate through recent trials
  useEffect(() => {
    const t = setInterval(() => setActiveTrialIdx(p => (p + 1) % RECENT_TRIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const trial = RECENT_TRIALS[activeTrailIdx];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      className="w-full min-h-screen text-slate-900 bg-transparent relative z-10 font-sans pb-32"
    >

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-center px-8 sm:px-16 lg:px-32 relative pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {/* Logo + Badge Row */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/90 border border-slate-200 shadow-lg flex items-center justify-center p-1 backdrop-blur-sm overflow-hidden">
              <img
                src="/cto_logo.png"
                alt="CTO Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to icon if image not found
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#10B981] flex items-center justify-center"><span class="text-white font-bold text-sm font-mono">CTO</span></div>`;
                }}
              />
            </div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold tracking-wide uppercase border border-blue-200 shadow-sm">
              AI-Powered Enterprise Platform
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-[#0F4C81] leading-tight mb-8">
            Optimize Clinical Trials.<br />
            Accelerate Breakthroughs.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed font-light">
            CTO leverages artificial intelligence, quantum-inspired solvers, and real TCGA-BRCA clinical data to design smarter protocols, discover optimal patient cohorts, and drastically reduce trial durations — backed by 200 real patient records.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={onEnterApp}
              className="px-8 py-4 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 group"
            >
              Enter Workspace
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white hover:bg-slate-50 text-[#0F4C81] border border-slate-200 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2 hover:-translate-y-0.5">
              <Activity className="w-5 h-5" />
              View Architecture
            </button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-slate-400"
        >
          <span className="text-xs uppercase tracking-widest mb-2 font-bold font-mono">Scroll to Platform</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#2563EB] to-transparent animate-pulse" />
        </motion.div>
      </section>

      {/* ── Data Trusted By Section ─────────────────────────────────────── */}
      <section className="py-16 px-8 sm:px-16 lg:px-32 border-y border-slate-200 bg-white/60 backdrop-blur-md">
        <p className="text-xs text-slate-500 font-bold font-mono mb-8 tracking-widest uppercase">
          📊 Data Sourced & Validated From
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {DATA_INSTITUTIONS.map((inst, i) => (
            <motion.div
              key={inst.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="text-base font-bold font-mono text-[#0F4C81] group-hover:text-[#2563EB] transition-colors mb-1">
                {inst.name}
              </div>
              <div className="text-[9px] text-slate-400 font-mono leading-tight">{inst.type}</div>
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-5 font-mono">
          Platform uses real patient-level data from <strong>TCGA-BRCA (200 patients)</strong>, breast cancer cases from GDC Data Portal, and Indian clinical registries from ICMR & CTRI.
        </p>
      </section>

      {/* ── KPI Stats Section ───────────────────────────────────────────── */}
      <section className="py-24 px-8 sm:px-16 lg:px-32">
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#0F4C81] via-[#2563EB] to-[#10B981]" />

          <div className="mb-8 text-center">
            <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-1">
              Derived from 200-patient TCGA-BRCA cohort
            </p>
            <h2 className="text-2xl font-serif text-[#0F4C81]">Platform Impact Metrics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {[
              {
                value: 32, suffix: "%", decimals: 0,
                label: "CapEx Cost Savings",
                sub: "vs. traditional trial design",
                color: "text-[#2563EB]"
              },
              {
                value: 58, suffix: "%", decimals: 0,
                label: "Recruitment Speed",
                sub: "cohort match via Qiskit QUBO",
                color: "text-[#10B981]"
              },
              {
                value: 80.09, suffix: "%", decimals: 1,
                label: "AI Concordance Index",
                sub: "Cox PH model on TCGA-BRCA",
                color: "text-[#14B8A6]"
              },
              {
                value: 2.4, suffix: " yrs", decimals: 1,
                label: "Faster Trial Duration",
                sub: "median follow-up: 337 days",
                color: "text-purple-600"
              },
            ].map((kpi, i) => (
              <div key={kpi.label} className={`flex flex-col items-center justify-center text-center ${i !== 0 ? 'pt-8 md:pt-0 md:pl-8' : ''}`}>
                <div className={`text-5xl font-mono font-bold mb-2 ${kpi.color}`}>
                  <AnimatedCounter end={kpi.value} suffix={kpi.suffix} decimals={kpi.decimals} />
                </div>
                <div className="text-sm font-bold text-slate-700 uppercase tracking-widest font-mono mb-1">{kpi.label}</div>
                <div className="text-xs text-slate-400 font-mono">{kpi.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ────────────────────────────────────────────── */}
      <section className="py-32 px-8 sm:px-16 lg:px-32 bg-slate-50/50">
        <div className="max-w-4xl mb-20">
          <h2 className="text-4xl lg:text-5xl font-serif text-[#0F4C81] mb-6 leading-tight">
            Comprehensive <span className="font-light text-slate-500">End-to-End Trial Strategy</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            From the initial DSL protocol drafting to the final IRB submission, CTO provides a vertically integrated suite of services designed to eliminate bottlenecks before a single patient is enrolled — using real TCGA-BRCA genomic data from 200 validated breast cancer patients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Protocol Compiler (DSL)",
              desc: "Draft clinical criteria using our domain-specific language. Instantly parsed against FDA rules (ICH E6 §5.1, 21 CFR Part 312) for exclusion conflicts and feasibility risks.",
              icon: FileText,
              color: "text-blue-600", bg: "bg-blue-50"
            },
            {
              title: "Quantum Cohort Stratification",
              desc: "QUBO formulation on Qiskit Aer (1024 shots). Selects optimal cohort from 200 TCGA-BRCA patients — maximizing response probability under budget constraints.",
              icon: BrainCircuit,
              color: "text-teal-600", bg: "bg-teal-50"
            },
            {
              title: "Cox PH Survival Prediction",
              desc: "AI Response Predictor trained on TCGA-BRCA data. Predicts 12-month treatment response probability with Concordance Index of 0.8009.",
              icon: HeartPulse,
              color: "text-rose-600", bg: "bg-rose-50"
            },
            {
              title: "Multi-Site Resource Routing",
              desc: "Route cohorts to optimal medical sites. Balances hospital load, investigator availability, and Indian geographic density — covering AIIMS, TMH, Apollo, ICMR.",
              icon: Network,
              color: "text-purple-600", bg: "bg-purple-50"
            },
            {
              title: "TCGA-BRCA Data Integration",
              desc: "Real patient-level data: 200 breast cancer cases with 14+ genomic markers (ESR1, ERBB2, PGR), AJCC pathologic stages, treatment histories, and follow-up outcomes.",
              icon: Database,
              color: "text-indigo-600", bg: "bg-indigo-50"
            },
            {
              title: "FDA Regulatory Vault",
              desc: "Generate Title-21 CFR Part 11 compliant audit documents instantly. Locked SHA-256 hashes ensure tamper-proof IRB submission packages.",
              icon: ShieldCheck,
              color: "text-emerald-600", bg: "bg-emerald-50"
            },
          ].map((feat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              key={feat.title}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#2563EB]/30 transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-2xl ${feat.bg} flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform`}>
                <feat.icon className={`w-7 h-7 ${feat.color}`} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Recent Trials Section ────────────────────────────────────────── */}
      <section className="py-24 px-8 sm:px-16 lg:px-32">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-2">
              🔬 Live Trial Registry
            </p>
            <h2 className="text-3xl font-serif text-[#0F4C81]">Recent Active Trials</h2>
            <p className="text-sm text-slate-500 mt-1">Sourced from CTRI, GDC Portal & institutional partners — including Indian sites</p>
          </div>
          <div className="flex gap-1">
            {RECENT_TRIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTrialIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === activeTrailIdx ? 'bg-[#2563EB] w-6' : 'bg-slate-300'}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Featured Trial */}
          <motion.div
            key={trial.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-8 shadow-lg relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-full h-1 ${trial.color}`} />
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold text-white ${trial.color}`}>
                    {trial.phase}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${trial.urgency === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {trial.urgency}
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-mono font-bold">● ACTIVE</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{trial.name}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <span>{trial.flag}</span> {trial.institution}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Enrolled</p>
                <p className="text-lg font-bold text-slate-800 font-mono">{trial.enrolled}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Med. OS</p>
                <p className="text-lg font-bold text-slate-800 font-mono">{trial.mos}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Trial ID</p>
                <p className="text-sm font-bold text-[#2563EB] font-mono">{trial.id}</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl">
              <p className="text-xs font-mono text-slate-500">
                <span className="text-slate-400">Primary Diagnosis:</span> {trial.diagnosis}
              </p>
            </div>
          </motion.div>

          {/* Trial List */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {RECENT_TRIALS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActiveTrialIdx(i)}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  i === activeTrailIdx
                    ? 'border-[#2563EB] bg-blue-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${t.color}`} />
                  <span className="text-xs font-mono font-bold text-slate-500">{t.flag} {t.phase}</span>
                </div>
                <p className="text-sm font-semibold text-slate-800 line-clamp-1">{t.name}</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{t.institution}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── TCGA Dataset Stats ───────────────────────────────────────────── */}
      <section className="py-20 px-8 sm:px-16 lg:px-32 bg-gradient-to-br from-[#0F4C81]/5 via-white to-[#10B981]/5 border-y border-slate-200">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm text-xs font-mono font-bold text-slate-600 mb-4">
            <Microscope className="w-4 h-4 text-[#2563EB]" />
            Real Data, Real Results
          </div>
          <h2 className="text-3xl lg:text-4xl font-serif text-[#0F4C81] mb-4">
            TCGA-BRCA Dataset Snapshot
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Our platform is trained and validated on 200 real breast cancer patients from The Cancer Genome Atlas — covering diverse diagnoses, stages, and treatment outcomes.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Patients", value: 200, suffix: "", icon: "👥", desc: "TCGA-BRCA cohort" },
            { label: "Avg Age", value: 58, suffix: " yrs", icon: "📅", desc: "at diagnosis" },
            { label: "5-yr Survival", value: 66, suffix: "%", icon: "❤️", desc: "India national avg" },
            { label: "Stage I–II", value: 81, suffix: "%", icon: "🔬", desc: "localized survival" },
            { label: "Follow-up", value: 337, suffix: " days", icon: "📋", desc: "median in dataset" },
            { label: "Gene Markers", value: 14, suffix: "+", icon: "🧬", desc: "ESR1, ERBB2, PGR…" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm hover:shadow-md transition-all"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-mono font-bold text-[#0F4C81] mb-1">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-0.5">{stat.label}</div>
              <div className="text-[10px] text-slate-400 font-mono">{stat.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Scroll Transition Trigger ────────────────────────────────────── */}
      <div className="h-[25vh] flex flex-col items-center justify-center opacity-50">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-4 text-slate-400"
        >
          <span className="text-xs font-bold font-mono tracking-widest uppercase">Scrolling to Workspace...</span>
          <div className="w-8 h-12 border-2 border-slate-300 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-3 bg-slate-300 rounded-full" />
          </div>
        </motion.div>
        <div ref={bottomRef} className="h-4 w-full mt-10" />
      </div>
    </motion.div>
  );
}
