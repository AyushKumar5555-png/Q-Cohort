import { ViewType } from "../types";
import { LayoutDashboard, FileCode, Users, Sliders, Activity, BarChart3, FileText, FolderOpen, Settings, Dna, Sparkles } from "lucide-react";

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogoClick?: () => void;
}

export default function Sidebar({ currentView, onViewChange, onLogoClick }: SidebarProps) {
  const menuItems = [
    { id: ViewType.DASHBOARD, label: "Dashboard", icon: LayoutDashboard, desc: "Executive metrics" },
    { id: ViewType.EDITOR, label: "Protocol Design", icon: FileCode, desc: "DSL Compiler" },
    { id: ViewType.COHORT, label: "Cohort Selection", icon: Users, desc: "AI matching" },
    { id: ViewType.OPTIMIZE, label: "Optimization Engine", icon: Sliders, desc: "Quantum solver" },
    { id: ViewType.SIMULATOR, label: "Trial Simulator", icon: Activity, desc: "Predictive outcomes" },
    { id: ViewType.REPORTS, label: "Reports & Analytics", icon: BarChart3, desc: "Visualizations" },
    { id: ViewType.AUDIT, label: "Audit Reports", icon: FileText, desc: "Compliance PDF" },
    { id: ViewType.DOCUMENTS, label: "Document Library", icon: FolderOpen, desc: "Trial assets" },
    { id: ViewType.SETTINGS, label: "Settings", icon: Settings, desc: "Platform config" },
  ];

  return (
    <aside
      id="side-nav-rail"
      className="w-72 bg-white/80 backdrop-blur-md border-r border-slate-200 p-6 flex flex-col h-screen shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
    >
      {/* Brand Header */}
      <div 
        className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 cursor-pointer group"
        onClick={onLogoClick}
        title="Scroll to Top"
      >
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#2563EB] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
          <Dna className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-serif font-bold tracking-tight text-slate-900 flex items-center gap-1.5 group-hover:text-[#2563EB] transition-colors">
            CTO <span className="text-blue-700 text-xs font-mono px-1.5 py-0.5 rounded bg-blue-50 text-[10px] border border-blue-100">Enterprise</span>
          </h1>
          <p className="text-[10px] text-slate-500 tracking-wider uppercase font-mono mt-0.5">Clinical Trial Optimizer</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1.5 select-none overflow-y-auto pr-2">
        <p className="px-3 text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-3 font-semibold">Workspace Navigation</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-link-${item.id}`}
              onClick={() => onViewChange(item.id)}
              className={`w-full group relative flex items-start gap-3.5 px-3 py-3 rounded-xl transition-all duration-200 text-left ${
                isActive
                  ? "bg-blue-50 border border-blue-100/50 text-[#0F4C81] shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-transform duration-300 group-hover:scale-105 ${
                  isActive ? "bg-white text-[#2563EB] shadow-sm" : "bg-slate-100 text-slate-500 group-hover:text-[#2563EB]"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col pt-0.5">
                <p className="text-sm font-semibold leading-none">{item.label}</p>
                {isActive && <p className="text-[10px] text-slate-500 mt-1 font-mono">{item.desc}</p>}
              </div>
              
              {isActive && (
                <div className="absolute right-3 top-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status Foot */}
      <div className="pt-6 border-t border-slate-100 space-y-3.5 mt-auto">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse relative">
            <span className="absolute inset-0 bg-[#10B981] opacity-75 animate-ping rounded-full" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-700 font-mono">Platform Gateway</p>
            <p className="text-[9px] text-slate-500 font-mono">Connected & Secure</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1 font-medium">
          <span>COMPLIANCE STATUS</span>
          <span className="text-[#10B981] flex items-center gap-1 font-bold">
            <Sparkles className="w-2.5 h-2.5 text-[#10B981]" /> VERIFIED
          </span>
        </div>
      </div>
    </aside>
  );
}
