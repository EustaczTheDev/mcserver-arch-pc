import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Terminal, 
  Users, 
  FolderTree, 
  Puzzle, 
  Archive, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Terminal as TerminalIcon,
  Server,
  Activity,
  HardDrive,
  Cpu,
  ShieldAlert,
  Zap,
  Pin
} from 'lucide-react';
import { ActiveTab, ServerStatus, ServerProfile } from '../types';

interface SidebarDrawerProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  onClose: () => void;
  onToggleOpen: () => void;
  serverStatus: ServerStatus;
  onlinePlayersCount: number;
  maxPlayersCount: number;
  installedPluginsCount: number;
  currentProfile: ServerProfile;
  darkMode: boolean;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  onToggleOpen,
  serverStatus,
  onlinePlayersCount,
  maxPlayersCount,
  installedPluginsCount,
  currentProfile,
  darkMode,
}) => {
  const [isPinned, setIsPinned] = React.useState(true);

  const navigationItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard & Monitoring',
      icon: LayoutDashboard,
      badge: null,
      description: 'Real-time CPU, RAM, TPS & telemetry'
    },
    {
      id: 'console' as ActiveTab,
      label: 'Minecraft Console',
      icon: Terminal,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      description: 'Interactive RCON & Paper logs'
    },
    {
      id: 'players' as ActiveTab,
      label: 'Player Management',
      icon: Users,
      badge: `${onlinePlayersCount}/${maxPlayersCount}`,
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      description: 'Kicks, bans, inventory & OP tools'
    },
    {
      id: 'files' as ActiveTab,
      label: 'Graphical File Explorer',
      icon: FolderTree,
      badge: null,
      description: 'Remote Arch Linux file manager & editor'
    },
    {
      id: 'plugins' as ActiveTab,
      label: 'Plugin Manager (SSH)',
      icon: Puzzle,
      badge: `${installedPluginsCount}`,
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      description: 'Spigot/Paper plugins & remote configs'
    },
    {
      id: 'backups' as ActiveTab,
      label: 'Automated Backups',
      icon: Archive,
      badge: '3 Jobs',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      description: 'Scheduled zstd/xz snapshots'
    },
    {
      id: 'settings' as ActiveTab,
      label: 'SSH & Server Settings',
      icon: Settings,
      badge: null,
      description: 'Arch systemd, SSH & RCON credentials'
    },
  ];

  return (
    <>
      {/* Overlay backdrop for mobile / auto-hide when not pinned */}
      {!isPinned && isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-20 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Main Slide-Out Navigation Drawer */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isOpen ? 260 : 64,
          x: 0
        }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className={`h-[calc(100vh-4rem)] border-r flex flex-col justify-between select-none z-30 relative shrink-0 ${
          darkMode 
            ? 'bg-[#020617] border-slate-800 text-slate-200' 
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-3 border-b border-slate-800 flex items-center justify-between">
          {isOpen ? (
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
                <Server className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h2 className="font-semibold text-xs text-slate-200 truncate font-mono">
                  {currentProfile.name}
                </h2>
                <p className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                  <span>archlinux</span>
                  <span>•</span>
                  <span className="text-emerald-400">{currentProfile.sshUser}@{currentProfile.archHost}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
                <Server className="w-4 h-4" />
              </div>
            </div>
          )}

          {isOpen && (
            <button
              onClick={() => setIsPinned(!isPinned)}
              title={isPinned ? "Unpin sidebar drawer" : "Pin sidebar drawer"}
              className={`p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
                isPinned ? 'text-blue-400' : ''
              }`}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Navigation Tabs List */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1.5 custom-scrollbar">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  if (!isPinned) onClose();
                }}
                title={!isOpen ? item.label : undefined}
                className={`w-full flex items-center rounded-xl px-3 py-2.5 text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : darkMode
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`} />

                {isOpen && (
                  <div className="ml-3 flex-1 flex items-center justify-between truncate text-left">
                    <div className="truncate">
                      <span className="block truncate font-medium">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ml-1 shrink-0 ${
                        isActive
                          ? 'bg-blue-700/80 text-blue-100 border-blue-500/50'
                          : item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Drawer Footer / Arch Linux System Information */}
        <div className={`p-2.5 border-t border-slate-800/80 ${darkMode ? 'bg-slate-950/60' : 'bg-slate-100'}`}>
          {isOpen ? (
            <div className="space-y-2">
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="flex justify-between items-center text-slate-400">
                  <span>OS System:</span>
                  <span className="text-cyan-400 font-semibold">Arch Linux x86_64</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Kernel:</span>
                  <span className="text-slate-300">6.10.8-arch1-1</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>systemd:</span>
                  <span className="text-emerald-400 font-medium">minecraft.service</span>
                </div>
              </div>

              <button
                onClick={onToggleOpen}
                className="w-full py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded flex items-center justify-center space-x-1 border border-slate-800 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Collapse Drawer</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onToggleOpen}
              title="Expand Drawer"
              className="w-full py-2 text-slate-400 hover:text-cyan-400 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
};
