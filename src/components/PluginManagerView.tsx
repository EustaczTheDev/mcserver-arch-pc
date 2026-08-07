import React from 'react';
import { 
  Puzzle, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Terminal as TerminalIcon, 
  Sliders, 
  ToggleLeft, 
  ToggleRight, 
  Trash2, 
  ExternalLink, 
  Package, 
  ShieldCheck, 
  Cpu, 
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { PluginItem } from '../types';

interface PluginManagerViewProps {
  plugins: PluginItem[];
  onInstallPlugin: (plugin: PluginItem) => void;
  onTogglePluginEnabled: (pluginId: string) => void;
  onUninstallPlugin: (pluginId: string) => void;
  onOpenPluginConfig: (configPath: string) => void;
  darkMode: boolean;
}

export const PluginManagerView: React.FC<PluginManagerViewProps> = ({
  plugins,
  onInstallPlugin,
  onTogglePluginEnabled,
  onUninstallPlugin,
  onOpenPluginConfig,
  darkMode,
}) => {
  const [activeTab, setActiveTab] = React.useState<'installed' | 'store' | 'ssh_terminal'>('installed');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sshCommand, setSshCommand] = React.useState('');
  const [sshLogs, setSshLogs] = React.useState<string[]>([
    '[SSH] Connected to minecraft@192.168.1.105:22 (Arch Linux OpenSSH 9.8p1)',
    '[SSH] authenticated with RSA key /home/user/.ssh/id_ed25519_archcraft',
    'Linux archlinux 6.10.8-arch1-1 #1 SMP PREEMPT_DYNAMIC Sun, 25 Aug 2026 x86_64',
    'Last login: Fri Aug  7 01:20:12 2026 from 192.168.1.42',
    '[minecraft@archlinux server]$ systemctl status minecraft.service --no-pager'
  ]);

  const installedPlugins = plugins.filter(p => p.isInstalled);
  const storePlugins = plugins.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSshSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sshCommand.trim()) return;

    setSshLogs(prev => [
      ...prev, 
      `[minecraft@archlinux server]$ ${sshCommand}`,
      `Executing Arch Linux shell command: "${sshCommand}"... (Exit code 0)`
    ]);
    setSshCommand('');
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto custom-scrollbar">
      {/* Header & Subtabs */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Puzzle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-100 flex items-center space-x-2">
              <span>Plugin Manager & Remote SSH</span>
              <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                {installedPlugins.length} Installed
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Manage Paper/Spigot plugins over SFTP and run remote Arch Linux shell commands
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('installed')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'installed' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Installed ({installedPlugins.length})
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'store' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Plugin Store
          </button>

          <button
            onClick={() => setActiveTab('ssh_terminal')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
              activeTab === 'ssh_terminal' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>Arch SSH Shell</span>
          </button>
        </div>
      </div>

      {/* Search Input for Store/Installed */}
      {activeTab !== 'ssh_terminal' && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search plugins by name, author, or category (e.g. EssentialsX, LuckPerms)..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500 font-mono"
          />
        </div>
      )}

      {/* SUBTAB 1: Installed Plugins */}
      {activeTab === 'installed' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {installedPlugins.map(plugin => (
            <div 
              key={plugin.id}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-100 font-mono flex items-center space-x-2">
                      <span>{plugin.name}</span>
                      <span className="text-[11px] text-slate-400 font-normal">v{plugin.version}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">By {plugin.author}</p>
                  </div>

                  <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full font-bold ${
                    plugin.enabled 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    {plugin.enabled ? 'Active' : 'Disabled (.disabled)'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {plugin.description}
                </p>

                {plugin.updateAvailable && (
                  <div className="mt-2.5 p-2 rounded bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center space-x-1.5 font-mono">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Update Available for Paper 1.20.4!</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                {plugin.configFilePath ? (
                  <button
                    onClick={() => onOpenPluginConfig(plugin.configFilePath!)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center space-x-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Config</span>
                  </button>
                ) : (
                  <span className="text-slate-500">No Config</span>
                )}

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onTogglePluginEnabled(plugin.id)}
                    className={`px-2.5 py-1.5 rounded-lg border flex items-center space-x-1 transition-colors ${
                      plugin.enabled 
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20' 
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                    }`}
                  >
                    {plugin.enabled ? <ToggleRight className="w-4 h-4 text-amber-400" /> : <ToggleLeft className="w-4 h-4 text-emerald-400" />}
                    <span>{plugin.enabled ? 'Disable' : 'Enable'}</span>
                  </button>

                  <button
                    onClick={() => onUninstallPlugin(plugin.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 2: Plugin Store Directory */}
      {activeTab === 'store' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {storePlugins.map(plugin => (
            <div 
              key={plugin.id}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-100 font-mono">
                      {plugin.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">By {plugin.author} • v{plugin.version}</p>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                    {plugin.category}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  {plugin.description}
                </p>

                <div className="mt-3 flex items-center space-x-3 text-[11px] text-slate-400 font-mono">
                  <span>{(plugin.downloadsCount / 1000000).toFixed(1)}M downloads</span>
                  <span>•</span>
                  <span>{plugin.fileSizeMB} MB</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                {plugin.isInstalled ? (
                  <button
                    disabled
                    className="w-full py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-medium flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Installed in /plugins/</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onInstallPlugin(plugin)}
                    className="w-full py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-medium flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>SSH Install (.jar)</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 3: Arch Linux SSH Shell Terminal */}
      {activeTab === 'ssh_terminal' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 h-[60vh] overflow-y-auto custom-scrollbar shadow-inner">
            {sshLogs.map((log, idx) => (
              <div key={idx} className="text-emerald-400 leading-relaxed">
                {log}
              </div>
            ))}
          </div>

          <form onSubmit={handleSshSubmit} className="flex items-center space-x-2">
            <span className="text-cyan-400 font-bold shrink-0">[minecraft@archlinux ~]$</span>
            <input
              type="text"
              value={sshCommand}
              onChange={(e) => setSshCommand(e.target.value)}
              placeholder="e.g. systemctl restart minecraft, pacman -Syu, journalctl -u minecraft -n 20..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shrink-0"
            >
              Exec SSH
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
