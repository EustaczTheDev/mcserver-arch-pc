import React from 'react';
import { 
  Menu, 
  Terminal, 
  Play, 
  Square, 
  RotateCw, 
  Minus, 
  Square as WindowSquare, 
  X, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Activity,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import { ServerStatus, ServerProfile } from '../types';

interface TitleBarProps {
  serverStatus: ServerStatus;
  currentProfile: ServerProfile;
  tps: number;
  cpuUsage: number;
  onlinePlayers: number;
  maxPlayers: number;
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
  onStartServer: () => void;
  onStopServer: () => void;
  onRestartServer: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSettings: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  serverStatus,
  currentProfile,
  tps,
  cpuUsage,
  onlinePlayers,
  maxPlayers,
  isDrawerOpen,
  onToggleDrawer,
  onStartServer,
  onStopServer,
  onRestartServer,
  darkMode,
  onToggleDarkMode,
}) => {
  const [isMaximized, setIsMaximized] = React.useState(false);

  return (
    <header className={`h-16 border-b flex items-center justify-between px-4 sm:px-6 select-none transition-colors ${
      darkMode 
        ? 'bg-slate-900/50 border-slate-800 text-slate-200' 
        : 'bg-slate-100/90 border-slate-200 text-slate-800'
    }`}>
      {/* Left side: Hamburger menu button + App Identity + Server Status */}
      <div className="flex items-center space-x-4">
        {/* Navigation Drawer button */}
        <button
          onClick={onToggleDrawer}
          id="toggle-sidebar-btn"
          title={isDrawerOpen ? "Collapse navigation drawer" : "Pull out navigation tabs"}
          className={`p-2 rounded-lg transition-all flex items-center justify-center ${
            isDrawerOpen 
              ? 'bg-blue-600 text-white shadow-sm' 
              : darkMode 
                ? 'hover:bg-slate-800 text-slate-300' 
                : 'hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Menu className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Brand & Identity */}
        <div className="flex items-center space-x-3">
          <h1 className="text-base sm:text-lg font-semibold tracking-tight">
            ArchCraft Server Manager
          </h1>
          
          {/* Status Pill */}
          <span className={`px-2 py-0.5 rounded text-xs font-semibold tracking-wide border uppercase ${
            serverStatus === 'online'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : serverStatus === 'starting'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {serverStatus}
          </span>

          <code className="hidden md:inline-block text-xs text-slate-500 font-mono">
            ssh://{currentProfile.sshUser}@{currentProfile.archHost}
          </code>
        </div>
      </div>

      {/* Middle/Right Controls */}
      <div className="flex items-center space-x-3">
        {/* TPS & Metrics Pill */}
        <div className="hidden lg:flex items-center space-x-3 text-xs font-mono bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 flex items-center space-x-1">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span className={tps >= 19.5 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{tps.toFixed(1)} TPS</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">
            CPU <strong className="text-slate-200">{cpuUsage.toFixed(1)}%</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">
            Players <strong className="text-emerald-400">{onlinePlayers}/{maxPlayers}</strong>
          </span>
        </div>

        {/* Quick Power Actions */}
        <div className="flex items-center space-x-2">
          {serverStatus === 'offline' ? (
            <button
              onClick={onStartServer}
              id="start-server-btn"
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition-colors flex items-center space-x-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start</span>
            </button>
          ) : (
            <>
              <button
                onClick={onRestartServer}
                id="restart-server-btn"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700 transition-colors flex items-center space-x-1.5"
              >
                <RotateCw className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Restart</span>
              </button>

              <button
                onClick={onStopServer}
                id="stop-server-btn"
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-medium transition-colors flex items-center space-x-1.5"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Stop Server</span>
              </button>
            </>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            id="theme-toggle-btn"
            title={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
            className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>

        {/* Windows Controls */}
        <div className="hidden sm:flex items-center space-x-1 pl-2 border-l border-slate-800">
          <button id="win-minimize-btn" className="p-1.5 text-slate-500 hover:text-slate-300">
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setIsMaximized(!isMaximized)} 
            id="win-maximize-btn" 
            className="p-1.5 text-slate-500 hover:text-slate-300"
          >
            <WindowSquare className="w-3.5 h-3.5" />
          </button>
          <button id="win-close-btn" className="p-1.5 text-slate-500 hover:text-rose-400">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
