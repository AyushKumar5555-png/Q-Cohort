import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { Clock, TrendingUp, DollarSign, Users, Award, ShieldAlert, Play, ArrowRight, CheckCircle, X, Sparkles, Database, ShieldCheck, Activity, Download, ActivitySquare, Map, FileText, CheckCircle2 } from "lucide-react";
import { MetricCardData, TrialReport } from "../types";

interface DashboardViewProps {
  metrics: {
    runtime: string;
    feasibilityScore: number;
    costReduction: string;
    recruitmentEfficiency: number;
    cohortQuality: number;
    amendmentReduction: number;
    backendConnected?: boolean;
  };
  templates: TrialReport[];
  selectedTemplate: string;
  onSelectTemplate: (id: string) => void;
  onNavigateToOptimize: () => void;
}

export default function DashboardView({
  metrics,
  templates,
  selectedTemplate,
  onSelectTemplate,
  onNavigateToOptimize,
}: DashboardViewProps) {
  const [activeKpiDetail, setActiveKpiDetail] = useState<string | null>(null);
  const [activeGanttRow, setActiveGanttRow] = useState<number | null>(null);

  const getWeeklyTrend = (cardId: string) => {
    const isCompiled = metrics.feasibilityScore > 64;
    let seed = 1.0;
    if (selectedTemplate === "cardio-genetic") seed = 1.15;
    if (selectedTemplate === "neuro-stratification") seed = 0.85;

    switch (cardId) {
      case "runtime": {
        const val = isCompiled ? 420 : 1200;
        return [
          { day: "Day 1", value: Math.round(val * 3.5 * seed) },
          { day: "Day 2", value: Math.round(val * 2.8 * seed) },
          { day: "Day 3", value: Math.round(val * 2.1) },
          { day: "Day 4", value: Math.round(val * 1.7 * seed) },
          { day: "Day 5", value: Math.round(val * 1.3) },
          { day: "Day 6", value: Math.round(val * 1.1 * seed) },
          { day: "Day 7", value: val },
        ];
      }
      case "feasibility": {
        const currentScore = metrics.feasibilityScore;
        const base = isCompiled ? 72 : 55;
        return [
          { day: "Day 1", value: Math.round(base * seed) },
          { day: "Day 2", value: Math.round((base + 4) * seed) },
          { day: "Day 3", value: Math.round((base + 8) * seed) },
          { day: "Day 4", value: Math.round((base + 11) * seed) },
          { day: "Day 5", value: Math.round((base + 15) * seed) },
          { day: "Day 6", value: Math.round((base + 17) * seed) },
          { day: "Day 7", value: currentScore },
        ];
      }
      case "cost": {
        const val = parseFloat(metrics.costReduction.replace(/[^0-9.]/g, "")) || 0;
        return [
          { day: "Day 1", value: Math.max(0, val - 3.2 * seed) },
          { day: "Day 2", value: Math.max(0, val - 2.5 * seed) },
          { day: "Day 3", value: Math.max(0, val - 1.8) },
          { day: "Day 4", value: Math.max(0, val - 1.2 * seed) },
          { day: "Day 5", value: Math.max(0, val - 0.7) },
          { day: "Day 6", value: Math.max(0, val - 0.2 * seed) },
          { day: "Day 7", value: val },
        ];
      }
      case "recruitment": {
        const val = metrics.recruitmentEfficiency;
        return [
          { day: "Day 1", value: Math.round(val * 0.65 * seed) },
          { day: "Day 2", value: Math.round(val * 0.72) },
          { day: "Day 3", value: Math.round(val * 0.78 * seed) },
          { day: "Day 4", value: Math.round(val * 0.83) },
          { day: "Day 5", value: Math.round(val * 0.89 * seed) },
          { day: "Day 6", value: Math.round(val * 0.95) },
          { day: "Day 7", value: val },
        ];
      }
      case "cohort": {
        const val = metrics.cohortQuality;
        return [
          { day: "Day 1", value: Math.max(10, Math.round(val - 32 * seed)) },
          { day: "Day 2", value: Math.max(15, Math.round(val - 25)) },
          { day: "Day 3", value: Math.max(20, Math.round(val - 18 * seed)) },
          { day: "Day 4", value: Math.max(30, Math.round(val - 12)) },
          { day: "Day 5", value: Math.max(40, Math.round(val - 7 * seed)) },
          { day: "Day 6", value: Math.max(45, Math.round(val - 2)) },
          { day: "Day 7", value: val },
        ];
      }
      case "amendments": {
        const val = metrics.amendmentReduction;
        return [
          { day: "Day 1", value: Math.max(0, val - 65 * seed) },
          { day: "Day 2", value: Math.max(0, val - 50) },
          { day: "Day 3", value: Math.max(0, val - 35 * seed) },
          { day: "Day 4", value: Math.max(0, val - 20) },
          { day: "Day 5", value: Math.max(0, val - 10 * seed) },
          { day: "Day 6", value: Math.max(0, val - 3) },
          { day: "Day 7", value: val },
        ];
      }
      default:
        return Array.from({ length: 7 }, (_, i) => ({ day: `Day ${i + 1}`, value: 50 + i * 5 }));
    }
  };

  const getThirtyDayFeasibilityTrend = () => {
    const currentScore = metrics.feasibilityScore;
    const isCompiled = currentScore > 64;
    let seed = 1.0;
    if (selectedTemplate === "cardio-genetic") seed = 1.1;
    if (selectedTemplate === "neuro-stratification") seed = 0.9;
    const baseStart = isCompiled ? Math.round(55 * seed) : Math.round(40 * seed);
    const trendData = [];
    for (let i = 1; i <= 30; i++) {
      if (i === 30) {
        trendData.push({ day: "Day 30", score: currentScore });
      } else {
        const progressFraction = (i - 1) / 29;
        const idealPath = baseStart + (currentScore - baseStart) * progressFraction;
        const wobble = Math.sin(i * 0.8) * 2.5 + (i % 3 === 0 ? 1 : -1.5);
        const score = Math.min(100, Math.max(10, Math.round(idealPath + wobble)));
        trendData.push({ day: `Day ${i}`, score: score });
      }
    }
    return trendData;
  };

  const handleExportCSV = () => {
    const selectedTemplateObj = templates.find((t) => t.id === selectedTemplate);
    const templateTitle = selectedTemplateObj ? selectedTemplateObj.title : selectedTemplate;
    const csvContent: string[] = [];
    csvContent.push(`Clinical Experiment Matrix Trial Report`);
    csvContent.push(`Trial Name,${templateTitle}`);
    csvContent.push(`Exported Date,${new Date().toISOString()}`);
    csvContent.push(``);
    csvContent.push(`Optimization KPI Metrics`);
    csvContent.push(`KPI Metric,Current Value,Improvement / Status`);
    dashboardMetricCards.forEach(card => {
      csvContent.push(`"${card.title}","${card.value}","${card.change}"`);
    });
    const blob = new Blob([csvContent.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `clinical-report-${templateTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const comparativeData = [
    { metric: "Cohort Setup (Days)", Baseline: 120, Optimized: 18 },
    { metric: "Dropout Rate (%)", Baseline: 28, Optimized: 5 },
    { metric: "Avg Site Load (%)", Baseline: 82, Optimized: 44 },
    { metric: "Protocol Amendments (#)", Baseline: 11, Optimized: 1 },
    { metric: "Compliance Score (%)", Baseline: 62, Optimized: 98 },
  ];

  const recruitmentFunnelData = [
    { name: "Total Identified", value: 100000, fill: "#0F4C81" },
    { name: "Location Match", value: 45000, fill: "#2563EB" },
    { name: "Genetic Match", value: 12500, fill: "#14B8A6" },
    { name: "Eligibility Passed", value: 3400, fill: "#10B981" },
    { name: "Target Enrolled", value: Math.max(120, Math.floor(3400 * (metrics.recruitmentEfficiency / 100))), fill: "#F59E0B" },
  ];

  const dashboardMetricCards: MetricCardData[] = [
    {
      id: "cost",
      title: "Estimated Cost Saving",
      value: metrics.costReduction,
      change: "24.5% CapEx Saved",
      trend: "up",
      description: "Financial savings based on optimized multi-site routing and cohort speed",
      iconName: "DollarSign",
    },
    {
      id: "recruitment",
      title: "Recruitment Efficiency",
      value: `${metrics.recruitmentEfficiency}%`,
      change: "Optimal Patient Pool",
      trend: "up",
      description: "Target matching and predictive exclusion compliance statistics",
      iconName: "Users",
    },
    {
      id: "cohort",
      title: "Cohort Quality Score",
      value: `${metrics.cohortQuality}%`,
      change: "+31% Homogeneity",
      trend: "up",
      description: "Genetic stratification quality and reduced standard deviation",
      iconName: "CheckCircle",
    },
    {
      id: "runtime",
      title: "Trial Duration Reduction",
      value: metrics.feasibilityScore > 64 ? "2.4 Mos" : "0 Mos",
      change: "-18% Duration",
      trend: "up",
      description: "Reduced execution timeline via rapid parallel site activation",
      iconName: "Clock",
    },
    {
      id: "amendments",
      title: "Protocol Amendment Reduction",
      value: `${metrics.amendmentReduction}%`,
      change: "0 Risk Detected",
      trend: "up",
      description: "Avoided post-initiation adjustments via robust initial DSL compiler checks",
      iconName: "ShieldAlert",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 pb-12"
    >
      {/* Backend Connection Status */}
      {metrics.backendConnected !== undefined && (
        <motion.div variants={itemVariants} className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-mono ${
          metrics.backendConnected 
            ? "bg-emerald-50/80 border-emerald-200 text-emerald-700" 
            : "bg-red-50/80 border-red-200 text-red-600"
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${metrics.backendConnected ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
            <span className="font-semibold">{metrics.backendConnected ? "API CONNECTED" : "API OFFLINE"}</span>
            <span className="text-[10px] opacity-70">|</span>
            <span className="opacity-80">{metrics.backendConnected ? "FastAPI + Qiskit Quantum + Cox PH AI + SQLite" : "Running in client-side simulation mode"}</span>
          </div>
          {metrics.backendConnected && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-[10px] font-bold">TCGA-BRCA DATA LOADED</span>
          )}
        </motion.div>
      )}

      {/* Template Chooser & Main Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-serif font-bold tracking-tight text-[#0F4C81] flex items-center gap-2">
            Executive Summary <span className="text-[#10B981] font-sans text-xs px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 font-semibold">Active Simulation</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose a clinical trial configuration to view physical baseline parameters and AI optimization outputs in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-mono font-semibold text-slate-500 uppercase">Select Trial:</label>
          <select
            value={selectedTemplate}
            onChange={(e) => onSelectTemplate(e.target.value)}
            className="bg-slate-50 border border-slate-200 hover:border-[#2563EB] rounded-xl px-3 py-2 text-xs font-semibold text-[#0F4C81] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all cursor-pointer"
          >
            {templates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-[#0F4C81] border border-slate-200 font-semibold px-4 py-2 text-xs rounded-xl transition-all shadow-sm uppercase tracking-wider cursor-pointer"
            title="Export full evaluation telemetry & historical trends to CSV"
          >
            Export <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onNavigateToOptimize}
            className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold px-4 py-2 text-xs rounded-xl transition-all shadow-md shadow-blue-500/20 uppercase tracking-wider cursor-pointer"
          >
            Launch Solver <Play className="w-3.5 h-3.5 fill-white" />
          </button>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {dashboardMetricCards.map((card, idx) => {
          let IconComp = Clock;
          if (card.iconName === "Clock") IconComp = Clock;
          else if (card.iconName === "Award") IconComp = Award;
          else if (card.iconName === "DollarSign") IconComp = DollarSign;
          else if (card.iconName === "Users") IconComp = Users;
          else if (card.iconName === "CheckCircle") IconComp = CheckCircle;
          else if (card.iconName === "ShieldAlert") IconComp = ShieldAlert;

          return (
            <motion.button
              variants={itemVariants}
              type="button"
              key={card.id}
              className={`p-5 bg-white border border-slate-200 rounded-2xl transition-all duration-300 relative group overflow-hidden text-left cursor-pointer hover:border-[#2563EB]/40 hover:shadow-lg w-full flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[10px] font-bold text-slate-500 font-sans tracking-widest uppercase line-clamp-1">
                    {card.title}
                  </span>
                  <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB]">
                    <IconComp className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-mono font-semibold text-slate-900 tracking-tight">
                    {card.value}
                  </span>
                  <span className="text-[10px] font-bold text-[#10B981] font-mono px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 flex items-center gap-0.5 w-fit">
                    <TrendingUp className="w-2.5 h-2.5 text-[#10B981]" /> {card.change}
                  </span>
                </div>
              </div>

              {/* 7-Day Sparkline trend visualization */}
              <div className="h-8 w-full mt-4 bg-slate-50 rounded-lg border border-slate-100 p-1 opacity-70 group-hover:opacity-100 transition-all duration-300">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getWeeklyTrend(card.id)}>
                    <defs>
                      <linearGradient id={`sparklineGrad-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity={0.2}/>
                        <stop offset="100%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#2563EB"
                      strokeWidth={1.5}
                      fillOpacity={1}
                      fill={`url(#sparklineGrad-${card.id})`}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Visualization Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recruitment Funnel */}
        <div className="lg:col-span-1 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <Users className="w-4 h-4 text-[#0F4C81]" />
              Recruitment Funnel
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Projected patient identification drop-off.
            </p>
          </div>

          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={recruitmentFunnelData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={10} stroke="#64748b" />
                <Tooltip cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {recruitmentFunnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Reduction Projection */}
        <div className="lg:col-span-2 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                <DollarSign className="w-4 h-4 text-[#10B981]" />
                Cost Reduction Projection
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparison of classic execution vs. optimized model.
              </p>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparativeData}
                margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="metric" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "#f8fafc" }} />
                <Legend verticalAlign="bottom" height={36} iconSize={10} iconType="circle" wrapperStyle={{ fontSize: "10px", fontWeight: "600" }} />
                <Bar dataKey="Baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Optimized" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </motion.div>

      {/* Demographics & Site Performance */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cohort Demographics */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <ActivitySquare className="w-4 h-4 text-[#14B8A6]" />
              Cohort Demographics
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Genetic alignment variance analysis.
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[ { name: "Primary Biomarker", value: 65 }, { name: "Secondary Variant", value: 25 }, { name: "Atypical", value: 10 } ]} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  <Cell fill="#0F4C81" />
                  <Cell fill="#2563EB" />
                  <Cell fill="#14B8A6" />
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: "10px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Site Performance Heatmap / Recent Activities */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <Map className="w-4 h-4 text-[#2563EB]" />
              Recent Trial Activities
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Global synchronization feed.
            </p>
          </div>
          <div className="flex-1 space-y-4">
            {[
              { title: "Mayo Clinic Site Activated", time: "2 hours ago", type: "success" },
              { title: "Protocol Amendment Rejected by Solver", time: "5 hours ago", type: "warning" },
              { title: "Stanford Cohort Matched", time: "1 day ago", type: "success" },
              { title: "MD Anderson Capacity Reached", time: "2 days ago", type: "info" }
            ].map((feed, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="mt-0.5">
                  {feed.type === "success" && <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
                  {feed.type === "warning" && <ShieldAlert className="w-4 h-4 text-amber-500" />}
                  {feed.type === "info" && <Activity className="w-4 h-4 text-[#2563EB]" />}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">{feed.title}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{feed.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
