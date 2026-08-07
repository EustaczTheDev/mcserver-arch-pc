import React from 'react';
import { 
  Cpu, 
  HardDrive, 
  Activity, 
  Users, 
  Zap, 
  Wifi, 
  Clock, 
  Terminal, 
  RefreshCw, 
  Trash2, 
  Megaphone, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Server,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Table,
  LineChart,
  Play
} from 'lucide-react';
import { ServerMetrics, ServerStatus, ServerProfile } from '../types';

interface DashboardViewProps {
  metrics: ServerMetrics;
  serverStatus: ServerStatus;
  currentProfile: ServerProfile;
  onTriggerGC: () => void;
  onBroadcastMessage: (msg: string) => void;
  onOpenConsole: () => void;
  onOpenPlayers: () => void;
  onOpenBackups: () => void;
  onStartCustomCommand?: (cmd: string) => void;
  onFetchLiveServerData?: () => Promise<void>;
  liveServerNotice?: string | null;
  darkMode: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  serverStatus,
  currentProfile,
  onTriggerGC,
  onBroadcastMessage,
  onOpenConsole,
  onOpenPlayers,
  onOpenBackups,
  onStartCustomCommand,
  onFetchLiveServerData,
  liveServerNotice,
  darkMode,
}) => {
  const [broadcastInput, setBroadcastInput] = React.useState('');
  const [showBroadcastModal, setShowBroadcastModal] = React.useState(false);
  const [telemetryViewMode, setTelemetryViewMode] = React.useState<'chart' | 'table'>('chart');
  const [hoveredPointIndex, setHoveredPointIndex] = React.useState<number | null>(null);
  const [showCustomStartModal, setShowCustomStartModal] = React.useState(false);
  const [customCmdInput, setCustomCmdInput] = React.useState(
    currentProfile.customStartCommand || 'systemctl start minecraft.service'
  );

  const ramPercentage = Math.round((metrics.ramUsedGB / metrics.ramTotalGB) * 100);
  const diskPercentage = Math.round((metrics.diskUsedGB / metrics.diskTotalGB) * 100);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastInput.trim()) return;
    onBroadcastMessage(broadcastInput);
    setBroadcastInput('');
    setShowBroadcastModal(false);
  };

  const handleExecuteCustomStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCmdInput.trim()) return;
    if (onStartCustomCommand) {
      onStartCustomCommand(customCmdInput.trim());
    }
    setShowCustomStartModal(false);
  };

  const activePoint = hoveredPointIndex !== null && metrics.history[hoveredPointIndex] 
    ? metrics.history[hoveredPointIndex]
    : metrics.history[metrics.history.length - 1];

  return (
    <div className="p-4 space-y-5 max-w-7xl mx-auto custom-scrollbar">
      {/* Top Banner: Arch Linux Server Status & Custom Start Command trigger */}
      <div className={`p-4 rounded-xl border relative overflow-hidden transition-all ${
        darkMode 
          ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border-slate-800' 
          : 'bg-gradient-to-r from-white via-slate-50 to-cyan-50 border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-100">
                  {currentProfile.name}
                </h1>
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                  SYSTEMD ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>OS: Arch Linux x86_64</span>
                <span>•</span>
                <span>Host: {currentProfile.archHost}:{currentProfile.rconPort || 25565}</span>
                <span>•</span>
                <span>Uptime: {formatUptime(metrics.uptimeSeconds)}</span>
              </p>

              {liveServerNotice && (
                <div className="mt-2 inline-flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-[11px] font-mono text-blue-300">
                  <Wifi className="w-3 h-3 text-blue-400 animate-pulse" />
                  <span>{liveServerNotice}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Shortcuts & Custom Start Command Button */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onFetchLiveServerData && (
              <button
                onClick={onFetchLiveServerData}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center space-x-1.5 transition-colors"
                title="Query live network server status and online players count"
              >
                <Wifi className="w-3.5 h-3.5 text-blue-400" />
                <span>Sync Live Status</span>
              </button>
            )}

            <button
              onClick={() => setShowCustomStartModal(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1.5 transition-colors"
              title="Configure or execute a custom start command"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Custom Start Cmd</span>
            </button>

            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center space-x-1.5 transition-colors"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Broadcast</span>
            </button>

            <button
              onClick={onTriggerGC}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center space-x-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Trigger GC</span>
            </button>

            <button
              onClick={onOpenConsole}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Terminal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Metric Cards: Professional Polish Monitoring Grid with Explicit Units */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Usage Card */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">CPU Utilization</span>
            <span className="text-xs text-cyan-400 font-mono font-semibold">% vCPU</span>
          </div>
          <div className="text-2xl font-mono mb-2 text-slate-100 flex items-baseline space-x-1">
            <span>{metrics.cpuUsage.toFixed(1)}</span>
            <span className="text-sm text-cyan-400 font-bold">%</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                metrics.cpuUsage > 80 ? 'bg-rose-500' : metrics.cpuUsage > 50 ? 'bg-amber-400' : 'bg-cyan-400'
              }`}
              style={{ width: `${Math.min(100, metrics.cpuUsage)}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-2">16 vCores • Load 0.42</span>
        </div>

        {/* Memory Card */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Memory Heap</span>
            <span className="text-xs text-purple-400 font-mono font-semibold">GB RAM</span>
          </div>
          <div className="text-2xl font-mono mb-2 text-slate-100 flex items-baseline space-x-1">
            <span>{metrics.ramUsedGB.toFixed(1)}</span>
            <span className="text-sm text-slate-400 font-normal">/ {metrics.ramTotalGB.toFixed(0)} GB</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-purple-500 h-full transition-all duration-500"
              style={{ width: `${ramPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-2">
            <span>{ramPercentage}% Allocated</span>
            <button onClick={onTriggerGC} className="text-purple-400 hover:underline">Purge GC</button>
          </div>
        </div>

        {/* Tick Performance Card */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Tick Rate & MSPT</span>
            <span className="text-xs text-emerald-400 font-mono font-semibold">TPS / ms</span>
          </div>
          <div className="text-2xl font-mono mb-2 text-slate-100 flex items-baseline space-x-2">
            <span className={metrics.tps >= 19.5 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {metrics.tps.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">TPS</span>
            <span className="text-slate-600 text-xs">•</span>
            <span className="text-xs text-emerald-300 font-mono">{metrics.mspt.toFixed(1)} ms</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-400 h-full transition-all duration-500"
              style={{ width: `${(metrics.tps / 20) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-2">Target: 20.0 TPS (&lt;50.0 ms)</span>
        </div>

        {/* Players Card */}
        <div 
          onClick={onOpenPlayers}
          className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer group transition-all ${
            darkMode ? 'bg-slate-800/40 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Active Players</span>
            <span className="text-xs text-blue-400 font-mono font-semibold">players</span>
          </div>
          <div className="text-2xl font-mono mb-2 text-slate-100 flex items-baseline space-x-1">
            <span>{metrics.onlinePlayers}</span>
            <span className="text-xs text-slate-400">/ {metrics.maxPlayers} players</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-500"
              style={{ width: `${(metrics.onlinePlayers / metrics.maxPlayers) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-blue-400 font-mono mt-2 group-hover:underline flex items-center justify-between">
            <span>Manage online users</span>
            <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Main Visual Telemetry Charts Section with explicit Units & Table toggle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Resource Telemetry Graph */}
        <div className={`lg:col-span-2 p-4 rounded-xl border flex flex-col ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-semibold text-sm text-slate-100 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Resource Telemetry History</span>
              </h3>
              <p className="text-xs text-slate-400">
                Tracked CPU (%), RAM (GB), Tick Rate (TPS) &amp; MSPT (ms) at 15s intervals
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {/* Chart vs Table View Toggle */}
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setTelemetryViewMode('chart')}
                  className={`px-2.5 py-1 rounded flex items-center space-x-1 transition-colors ${
                    telemetryViewMode === 'chart' 
                      ? 'bg-blue-600 text-white font-semibold' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LineChart className="w-3.5 h-3.5" />
                  <span>Graph</span>
                </button>
                <button
                  onClick={() => setTelemetryViewMode('table')}
                  className={`px-2.5 py-1 rounded flex items-center space-x-1 transition-colors ${
                    telemetryViewMode === 'table' 
                      ? 'bg-blue-600 text-white font-semibold' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Units Table</span>
                </button>
              </div>
            </div>
          </div>

          {/* Unit Legend Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono mb-3 p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
            <span className="text-slate-500 text-[11px] font-bold uppercase">Units Legend:</span>
            <span className="flex items-center space-x-1.5 text-blue-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" />
              <span>CPU (% vCPU)</span>
            </span>
            <span className="flex items-center space-x-1.5 text-purple-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm" />
              <span>RAM (GB RAM)</span>
            </span>
            <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
              <span>Tick Rate (TPS)</span>
            </span>
            <span className="flex items-center space-x-1.5 text-amber-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
              <span>MSPT (ms)</span>
            </span>
            <span className="flex items-center space-x-1.5 text-slate-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-sm" />
              <span>Players (count)</span>
            </span>
          </div>

          {telemetryViewMode === 'chart' ? (
            <div>
              {/* Active Point Hover Unit Details Box */}
              {activePoint && (
                <div className="mb-3 p-2.5 bg-slate-950/90 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono text-center shadow-inner">
                  <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">TIME</span>
                    <span className="font-bold text-slate-200">{activePoint.timestamp}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">CPU (% vCPU)</span>
                    <span className="font-bold text-blue-400">{activePoint.cpu.toFixed(1)} %</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">RAM (GB RAM)</span>
                    <span className="font-bold text-purple-400">{activePoint.ram.toFixed(1)} GB</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">TICK RATE (TPS)</span>
                    <span className="font-bold text-emerald-400">{activePoint.tps.toFixed(1)} TPS</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">PLAYERS (count)</span>
                    <span className="font-bold text-slate-200">{activePoint.players} players</span>
                  </div>
                </div>
              )}

              {/* Redesigned Clean SVG Area & Line Graph */}
              <div className="h-56 w-full relative flex items-end pt-4 pb-2 border-b border-slate-800/80 select-none">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="cpuAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="ramAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid Lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#1e293b" strokeDasharray="3,3" strokeWidth="0.8" />
                  <line x1="0" y1="40" x2="100" y2="40" stroke="#1e293b" strokeDasharray="3,3" strokeWidth="0.8" />
                  <line x1="0" y1="60" x2="100" y2="60" stroke="#1e293b" strokeDasharray="3,3" strokeWidth="0.8" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="#1e293b" strokeDasharray="3,3" strokeWidth="0.8" />

                  {/* CPU Area Fill Gradient */}
                  {metrics.history.length > 1 && (
                    <polygon
                      fill="url(#cpuAreaGrad)"
                      points={`0,100 ${metrics.history.map((h, i) => `${(i / (metrics.history.length - 1)) * 100},${100 - h.cpu}`).join(' ')} 100,100`}
                    />
                  )}

                  {/* RAM Area Fill Gradient */}
                  {metrics.history.length > 1 && (
                    <polygon
                      fill="url(#ramAreaGrad)"
                      points={`0,100 ${metrics.history.map((h, i) => `${(i / (metrics.history.length - 1)) * 100},${100 - (h.ram / metrics.ramTotalGB) * 100}`).join(' ')} 100,100`}
                    />
                  )}

                  {/* CPU Line (Sleek Royal Blue) */}
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={metrics.history.map((h, i) => `${(i / (metrics.history.length - 1)) * 100},${100 - h.cpu}`).join(' ')}
                  />

                  {/* RAM Line (Purple) */}
                  <polyline
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="1.8"
                    strokeDasharray="4,2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={metrics.history.map((h, i) => `${(i / (metrics.history.length - 1)) * 100},${100 - (h.ram / metrics.ramTotalGB) * 100}`).join(' ')}
                  />

                  {/* TPS Line (Emerald) */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.2"
                    points={metrics.history.map((h, i) => `${(i / (metrics.history.length - 1)) * 100},${100 - (h.tps / 20) * 100}`).join(' ')}
                  />

                  {/* Active Hover Crosshair Line and Cursor Ring */}
                  {(() => {
                    const activeIdx = hoveredPointIndex !== null ? hoveredPointIndex : metrics.history.length - 1;
                    const point = metrics.history[activeIdx];
                    if (!point) return null;

                    const cx = (activeIdx / (metrics.history.length - 1)) * 100;
                    const cpuCy = 100 - point.cpu;
                    const ramCy = 100 - (point.ram / metrics.ramTotalGB) * 100;

                    return (
                      <g key="active-crosshair">
                        <line
                          x1={cx}
                          y1="0"
                          x2={cx}
                          y2="100"
                          stroke="#64748b"
                          strokeWidth="0.8"
                          strokeDasharray="2,2"
                        />
                        <circle cx={cx} cy={cpuCy} r="3.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                        <circle cx={cx} cy={ramCy} r="3" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
                      </g>
                    );
                  })()}

                  {/* Invisible Hover Rectangles for Smooth Mouseover */}
                  {metrics.history.map((_, i) => {
                    const widthPct = 100 / metrics.history.length;
                    const xPct = i * widthPct;
                    return (
                      <rect
                        key={i}
                        x={xPct}
                        y="0"
                        width={widthPct}
                        height="100"
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPointIndex(i)}
                      />
                    );
                  })}
                </svg>
              </div>

              {/* X Axis Timestamps */}
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2 px-1">
                <span>{metrics.history[0]?.timestamp || '10 mins ago'}</span>
                <span>{metrics.history[Math.floor(metrics.history.length / 2)]?.timestamp || '5 mins ago'}</span>
                <span>{metrics.history[metrics.history.length - 1]?.timestamp || 'Now'}</span>
              </div>
            </div>
          ) : (
            /* Explicit Units Telemetry History Data Table */
            <div className="overflow-x-auto custom-scrollbar border border-slate-800 rounded-lg max-h-64 font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 sticky top-0">
                  <tr>
                    <th className="p-2">Timestamp</th>
                    <th className="p-2 text-blue-400">CPU Usage (% vCPU)</th>
                    <th className="p-2 text-purple-400">RAM Allocated (GB RAM)</th>
                    <th className="p-2 text-emerald-400">Tick Rate (TPS)</th>
                    <th className="p-2 text-amber-400">Tick Duration (ms)</th>
                    <th className="p-2 text-slate-300">Connected Players</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 text-slate-200">
                  {metrics.history.slice().reverse().map((point, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/50">
                      <td className="p-2 text-slate-400">{point.timestamp}</td>
                      <td className="p-2 font-bold text-blue-400">{point.cpu.toFixed(1)} %</td>
                      <td className="p-2 font-bold text-purple-300">{point.ram.toFixed(1)} GB</td>
                      <td className="p-2 font-bold text-emerald-300">{point.tps.toFixed(1)} TPS</td>
                      <td className="p-2 font-bold text-amber-300">{(point.mspt || 18.2).toFixed(1)} ms</td>
                      <td className="p-2 font-bold text-slate-300">{point.players} players</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Arch Linux System & SSD Storage Status */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <h3 className="font-semibold text-sm text-slate-100 flex items-center space-x-2 mb-3">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>Storage &amp; Network I/O Units</span>
            </h3>

            {/* Storage Progress */}
            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>NVMe SSD Storage (/opt)</span>
                  <span className="text-slate-400">{metrics.diskUsedGB} GB / {metrics.diskTotalGB} GB</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400"
                    style={{ width: `${diskPercentage}%` }}
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2 text-[11px]">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center space-x-1.5">
                    <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Inbound Bandwidth:</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">{metrics.networkRxKBps.toFixed(1)} KB/s</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center space-x-1.5">
                    <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Outbound Bandwidth:</span>
                  </span>
                  <span className="text-cyan-400 font-semibold">{metrics.networkTxKBps.toFixed(1)} KB/s</span>
                </div>
              </div>

              {/* Entities & Chunks */}
              <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                <div className="p-2 rounded bg-slate-800/50 border border-slate-700/50">
                  <span className="block text-slate-400">Loaded Chunks</span>
                  <span className="text-sm font-bold text-slate-100">{metrics.chunksLoaded} chunks</span>
                </div>
                <div className="p-2 rounded bg-slate-800/50 border border-slate-700/50">
                  <span className="block text-slate-400">Entities Count</span>
                  <span className="text-sm font-bold text-slate-100">{metrics.entitiesLoaded} entities</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono flex items-center justify-between text-slate-400">
            <span>Arch Linux pacman</span>
            <span className="text-emerald-400 font-medium">All packages updated</span>
          </div>
        </div>
      </div>

      {/* Custom Start Command Modal */}
      {showCustomStartModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs font-mono text-xs">
          <div className={`w-full max-w-lg p-5 rounded-xl border shadow-2xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <h3 className="text-sm font-bold mb-1 flex items-center space-x-2 text-emerald-400">
              <Play className="w-4 h-4 fill-current" />
              <span>Execute Custom Server Start Command</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-sans">
              Specify a custom shell or Java command to launch your Minecraft server instance over SSH.
            </p>

            <form onSubmit={handleExecuteCustomStart} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">
                  Custom Command String:
                </label>
                <input
                  type="text"
                  value={customCmdInput}
                  onChange={(e) => setCustomCmdInput(e.target.value)}
                  placeholder="e.g., systemctl start minecraft.service"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  autoFocus
                />
              </div>

              {/* Quick Presets */}
              <div className="space-y-1.5">
                <span className="text-slate-500 text-[11px]">Preset Examples:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCustomCmdInput('systemctl start minecraft.service')}
                    className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-400"
                  >
                    systemctl start
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomCmdInput('java -Xms4G -Xmx16G -XX:+UseG1GC -jar paper.jar --nogui')}
                    className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-400"
                  >
                    java -Xms4G -Xmx16G...
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomCmdInput('screen -AmdS minecraft java -Xmx12G -jar server.jar')}
                    className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-purple-400"
                  >
                    screen session
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCustomStartModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!customCmdInput.trim()}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium disabled:opacity-50 flex items-center space-x-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Server</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Announcement Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className={`w-full max-w-md p-5 rounded-xl border shadow-xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <h3 className="text-base font-semibold mb-1 flex items-center space-x-2">
              <Megaphone className="w-5 h-5 text-cyan-400" />
              <span>Broadcast In-Game Message</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Sends an announcement to all online players using Minecraft `/say` command.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Message Content:
                </label>
                <input
                  type="text"
                  value={broadcastInput}
                  onChange={(e) => setBroadcastInput(e.target.value)}
                  placeholder="[Server Notice] Scheduled maintenance in 10 minutes..."
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500 font-sans"
                  autoFocus
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-3.5 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!broadcastInput.trim()}
                  className="px-4 py-1.5 text-xs rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium disabled:opacity-50"
                >
                  Broadcast Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

