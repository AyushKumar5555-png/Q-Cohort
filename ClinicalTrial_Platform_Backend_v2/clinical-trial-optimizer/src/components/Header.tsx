import { useState } from "react";
import { Bell, Cpu, Radio, Layers, X, RefreshCw, Sparkles } from "lucide-react";

interface HeaderProps {
  compilerStatus: "idle" | "compiling" | "success" | "error";
  simulationActive: boolean;
  onReset: () => void;
  systemMetrics: {
    runtime: string;
    feasibilityScore: number;
    costReduction: string;
  };
}

export default function Header({
  compilerStatus,
  simulationActive,
  onReset,
  systemMetrics,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeGatewayInfo, setActiveGatewayInfo] = useState<string | null>(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Biomarker Optimization",
      text: "Oncology Phase II protocol aligned 12 high-affinity patient groups.",
      time: "Just now",
      read: false,
    },
    {
      id: 2,
      title: "Quantum Compiler Secure",
      text: "Finished sandbox lexer evaluation on 42,000 sub-nodes.",
      time: "5m ago",
      read: true,
    },
    {
      id: 3,
      title: "FDA compliance audit locked",
      text: "Protocol key CARD-GEN-S99 loaded safely into cryptographically signed state.",
      time: "2h ago",
      read: true,
    },
  ]);

  const toggleNotificationRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      id="system-top-header"
      className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-20 relative shadow-sm"
    >
      {/* Platform Breadcrumb */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-slate-400 text-[11px] font-mono tracking-wide uppercase">Workspace:</span>
          <span className="text-slate-700 text-xs font-semibold font-mono px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
            CLINICAL-TRIAL-DECISION-MATRIX
          </span>
        </div>
      </div>

      {/* Real-time Status Connection Rail */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-slate-200 pr-6 hidden md:flex">
          {/* API Gateway Status */}
          <button 
            type="button"
            onClick={() => setActiveGatewayInfo(activeGatewayInfo === "gateway" ? null : "gateway")}
            className="flex items-center gap-2 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg transition-colors text-left" 
            title="Click to view API Gateway details"
          >
            <Radio className="w-3.5 h-3.5 text-[#14B8A6]" />
            <span className="text-[11px] font-mono font-medium text-slate-600">API Gateway</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          </button>

          {/* Compiler Status */}
          <button 
            type="button"
            onClick={() => setActiveGatewayInfo(activeGatewayInfo === "compiler" ? null : "compiler")}
            className="flex items-center gap-2 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg transition-colors text-left" 
            title="Click to view Compiler details"
          >
            <Layers className={`w-3.5 h-3.5 ${compilerStatus === "compiling" ? "text-amber-500 animate-spin" : "text-[#2563EB]"}`} />
            <span className="text-[11px] font-mono font-medium text-slate-600">DSL Compiler</span>
            <span className={`w-1.5 h-1.5 rounded-full ${compilerStatus === "error" ? "bg-red-500 animate-ping" : compilerStatus === "compiling" ? "bg-amber-400 animate-pulse" : "bg-[#10B981]"}`} />
          </button>

          {/* Quantum Processing Core */}
          <button 
            type="button"
            onClick={() => setActiveGatewayInfo(activeGatewayInfo === "quantum" ? null : "quantum")}
            className="flex items-center gap-2 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg transition-colors text-left" 
            title="Click to view hardware details"
          >
            <Cpu className={`w-3.5 h-3.5 ${simulationActive ? "text-purple-600" : "text-[#0F4C81]"}`} />
            <span className="text-[11px] font-mono font-medium text-slate-600">Solver Engine</span>
            <span className={`w-1.5 h-1.5 rounded-full ${simulationActive ? "bg-purple-500 animate-pulse" : "bg-[#10B981]"}`} />
          </button>
        </div>

        {/* Global Reset Action */}
        <button
          onClick={onReset}
          className="p-2 rounded-lg bg-white hover:bg-slate-50 w-9 h-9 flex items-center justify-center border border-slate-200 text-slate-400 hover:text-[#2563EB] hover:border-blue-200 transition-all cursor-pointer shadow-sm"
          title="Reset All Simulation Progress"
        >
          <RefreshCw className="w-4 h-4 text-[#2563EB]" />
        </button>

        {/* Notification bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setActiveGatewayInfo(null);
            }}
            className="hover:text-[#0F4C81] text-slate-500 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer flex items-center justify-center shadow-sm"
            title="System alerts & real-time updates"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-white animate-pulse" />
            )}
          </button>

          {/* Floating Notifications Drawer */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">System Alerts</span>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[10px] text-blue-600 hover:text-blue-800 transition-colors font-medium"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-0.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No active system alerts.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => toggleNotificationRead(n.id)}
                      className={`p-2.5 rounded-lg transition-all text-left cursor-pointer border ${
                        n.read
                          ? "bg-slate-50 border-slate-100 opacity-60"
                          : "bg-blue-50/50 border-blue-100 hover:border-blue-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <p className={`text-xs ${n.read ? "text-slate-500" : "text-slate-900 font-semibold"}`}>
                          {n.title}
                        </p>
                        <span className="text-[9px] text-slate-400 font-mono shrink-0">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                        {n.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Card */}
        <button
          type="button"
          onClick={() => alert(`Identity:\n\nUser: Dr. Ram Murthy\nRole: Lead Research Architect`)}
          className="flex items-center gap-3 pl-2 text-left cursor-pointer group"
          title="Click to view credentials"
        >
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-[#0F4C81] border border-slate-200 shadow-sm group-hover:bg-[#0F4C81] group-hover:text-white transition-colors">
            RM
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-slate-900 group-hover:text-[#2563EB] transition-colors">Dr. Ram Murthy</p>
            <p className="text-[9px] text-slate-500 font-mono">Lead Research Architect</p>
          </div>
        </button>
      </div>

      {/* Floating Network Detail overlays */}
      {activeGatewayInfo && (
        <div className="absolute right-40 top-20 w-72 bg-white border border-slate-200 rounded-xl p-4 shadow-xl z-50 animate-fade-in text-left">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
              {activeGatewayInfo === "gateway" && <Radio className="w-4 h-4 text-[#14B8A6]" />}
              {activeGatewayInfo === "compiler" && <Layers className="w-4 h-4 text-[#2563EB]" />}
              {activeGatewayInfo === "quantum" && <Cpu className="w-4 h-4 text-purple-600" />}
              {activeGatewayInfo} telemetry
            </h4>
            <button onClick={() => setActiveGatewayInfo(null)} className="p-0.5 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          
          {activeGatewayInfo === "gateway" && (
            <div className="space-y-2 text-xs text-slate-600 font-mono">
              <p>📍 Status: <span className="text-[#10B981] font-semibold">ONLINE</span></p>
              <p>⚡ Latency: <span className="text-slate-900">14ms</span></p>
              <p>🔒 TLS Status: <span className="text-slate-900">AES-256 GCM Secure</span></p>
              <p className="text-[10px] text-slate-500 leading-relaxed pt-1">
                Proxies genetic biomarker data directly from sandboxed hospital registries without revealing patient PII.
              </p>
            </div>
          )}

          {activeGatewayInfo === "compiler" && (
            <div className="space-y-2 text-xs text-slate-600 font-mono">
              <p>⚙️ Compiler: <span className="text-slate-900">v1.2.3-Enterprise</span></p>
              <p>⚡ AST Size: <span className="text-[#2563EB] font-semibold">Ready</span></p>
              <p>💾 Optimization: <span className="text-slate-900">Matrix-annealing core</span></p>
              <p className="text-[10px] text-slate-500 leading-relaxed pt-1">
                Compiled states are evaluated against FDA regulatory rules and local therapeutic requirements on fly.
              </p>
            </div>
          )}

          {activeGatewayInfo === "quantum" && (
            <div className="space-y-2 text-xs text-slate-600 font-mono">
              <p>🔮 Processing: <span className="text-purple-600 font-semibold">Active</span></p>
              <p>🌀 Core Matrix Temp: <span className="text-slate-900">15mK</span></p>
              <p>🎛️ Threads: <span className="text-slate-900">3,120</span></p>
              <p className="text-[10px] text-slate-500 leading-relaxed pt-1">
                Computes high-frequency combinatorial optimization paths for randomized site selections in 120ms.
              </p>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
