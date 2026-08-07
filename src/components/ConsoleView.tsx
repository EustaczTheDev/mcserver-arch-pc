import React from 'react';
import { 
  Terminal as TerminalIcon, 
  Send, 
  Trash2, 
  Pause, 
  Play, 
  Copy, 
  Download, 
  Search, 
  Filter, 
  Sparkles,
  ChevronRight,
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { LogMessage } from '../types';

interface ConsoleViewProps {
  logs: LogMessage[];
  onSendCommand: (cmd: string) => void;
  onClearLogs: () => void;
  darkMode: boolean;
}

const COMMAND_SUGGESTIONS = [
  { cmd: '/say ', desc: 'Broadcast a message to all players' },
  { cmd: '/spark tps', desc: 'Run Spark performance profiler & TPS check' },
  { cmd: '/paper reload', desc: 'Reload Paper configuration settings' },
  { cmd: '/time set day', desc: 'Set world time to day (1000 ticks)' },
  { cmd: '/weather clear', desc: 'Clear rain and thunder weather' },
  { cmd: '/whitelist add ', desc: 'Add player to server whitelist' },
  { cmd: '/whitelist list', desc: 'View current whitelist entries' },
  { cmd: '/op ', desc: 'Grant operator privileges to a player' },
  { cmd: '/deop ', desc: 'Revoke operator privileges from a player' },
  { cmd: '/kick ', desc: 'Disconnect a player from the server' },
  { cmd: '/ban ', desc: 'Ban a player or IP address' },
  { cmd: '/pardon ', desc: 'Unban a player or IP address' },
  { cmd: '/gamerule keepInventory true', desc: 'Enable keep inventory on death' },
  { cmd: '/gamerule doDaylightCycle false', desc: 'Pause daylight cycle' },
  { cmd: '/difficulty hard', desc: 'Set server difficulty to hard' },
  { cmd: '/save-all', desc: 'Force immediate world save to disk' },
  { cmd: '/worldborder set 10000', desc: 'Set world border diameter to 10,000 blocks' },
  { cmd: '/give ', desc: 'Give an item to a player (e.g. /give @a diamond 64)' },
  { cmd: '/xp add ', desc: 'Add experience points or levels to a player' },
  { cmd: '/version', desc: 'Display server software version and build' },
];

export const ConsoleView: React.FC<ConsoleViewProps> = ({
  logs,
  onSendCommand,
  onClearLogs,
  darkMode,
}) => {
  const [inputCmd, setInputCmd] = React.useState('');
  const [filterLevel, setFilterLevel] = React.useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [autoScroll, setAutoScroll] = React.useState(true);
  const [cmdHistory, setCmdHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState<number>(-1);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const consoleEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (autoScroll) {
      consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter(log => {
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesSearch = !searchTerm || 
      log.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCmd.trim()) return;

    onSendCommand(inputCmd);
    setCmdHistory(prev => [...prev, inputCmd]);
    setHistoryIndex(-1);
    setInputCmd('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIndex = historyIndex < cmdHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIndex);
        setInputCmd(cmdHistory[cmdHistory.length - 1 - nextIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputCmd(cmdHistory[cmdHistory.length - 1 - nextIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputCmd('');
      }
    }
  };

  const filteredSuggestions = COMMAND_SUGGESTIONS.filter(item => 
    item.cmd.toLowerCase().includes(inputCmd.toLowerCase())
  );

  const copyAllLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.source}/${l.level}]: ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
  };

  const downloadLogFile = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.source}/${l.level}]: ${l.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minecraft-latest-${new Date().toISOString().slice(0, 10)}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 h-[calc(100vh-2.75rem)] flex flex-col space-y-3 font-sans">
      {/* Console Header Control Bar */}
      <div className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 shrink-0 ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <TerminalIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-slate-100 flex items-center space-x-2">
              <span>Arch Linux RCON & Paper Terminal</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              STDIO stream from systemd unit `minecraft.service`
            </p>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Level Filter Tabs */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
            {(['ALL', 'INFO', 'WARN', 'ERROR'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterLevel === lvl 
                    ? 'bg-slate-800 text-cyan-400 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
              className="pl-8 pr-3 py-1 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 w-36 sm:w-48 font-mono"
            />
          </div>

          {/* Auto-scroll toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            title={autoScroll ? "Pause log autoscroll" : "Resume log autoscroll"}
            className={`p-1.5 rounded-lg border text-xs flex items-center space-x-1.5 transition-colors ${
              autoScroll ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {autoScroll ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline font-mono">Auto-Scroll</span>
          </button>

          <button
            onClick={copyAllLogs}
            title="Copy all logs"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={downloadLogFile}
            title="Download latest.log file"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClearLogs}
            title="Clear console view"
            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Terminal Window */}
      <div className="flex-1 rounded-xl bg-slate-950 border border-slate-800 p-3.5 font-mono text-xs overflow-y-auto custom-scrollbar select-text space-y-1.5 leading-relaxed shadow-inner">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center py-12">
            <TerminalIcon className="w-8 h-8 mb-2 opacity-40" />
            <p>No log output matching active filters.</p>
          </div>
        ) : (
          filteredLogs.map(log => {
            let levelBadge = 'text-cyan-400 bg-cyan-950/60 border-cyan-800/80';
            if (log.level === 'WARN') levelBadge = 'text-amber-400 bg-amber-950/60 border-amber-800/80';
            if (log.level === 'ERROR') levelBadge = 'text-rose-400 bg-rose-950/60 border-rose-800/80';

            return (
              <div key={log.id} className="flex items-start space-x-2 group hover:bg-slate-900/60 px-1 py-0.5 rounded transition-colors">
                <span className="text-slate-500 shrink-0 select-none font-mono">[{log.timestamp}]</span>
                <span className={`px-1.5 py-0.2 rounded border text-[10px] font-bold uppercase shrink-0 ${levelBadge}`}>
                  {log.level}
                </span>
                <span className="text-purple-400 shrink-0 font-medium">[{log.source}]:</span>
                <span className={`break-all ${
                  log.level === 'ERROR' ? 'text-rose-300 font-semibold' : log.level === 'WARN' ? 'text-amber-200' : 'text-slate-200'
                }`}>
                  {log.text}
                </span>
              </div>
            );
          })
        )}
        <div ref={consoleEndRef} />
      </div>

      {/* Quick Macros & Interactive Command Line */}
      <div className="space-y-2 shrink-0">
        {/* Macros */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs custom-scrollbar">
          <span className="text-slate-500 font-mono text-[11px] shrink-0">Macros:</span>
          <button
            onClick={() => onSendCommand('/time set day')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-300 shrink-0 transition-colors"
          >
            ☀️ Set Day
          </button>
          <button
            onClick={() => onSendCommand('/weather clear')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 shrink-0 transition-colors"
          >
            🌤️ Clear Weather
          </button>
          <button
            onClick={() => onSendCommand('/spark tps')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-300 shrink-0 transition-colors"
          >
            ⚡ Spark Profiler
          </button>
          <button
            onClick={() => onSendCommand('/paper reload')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-300 shrink-0 transition-colors"
          >
            🔄 Reload Configs
          </button>
        </div>

        {/* Command Form */}
        <form onSubmit={handleFormSubmit} className="relative flex items-center">
          <div className="absolute left-3 text-emerald-400 flex items-center space-x-1 font-mono font-bold text-sm">
            <span>&gt;</span>
          </div>

          <input
            type="text"
            value={inputCmd}
            onChange={(e) => {
              setInputCmd(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Type a Minecraft command e.g., /say, /op, /kick, /spark tps..."
            className="w-full pl-8 pr-24 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500 shadow-lg"
          />

          <button
            type="submit"
            disabled={!inputCmd.trim()}
            className="absolute right-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center space-x-1.5 disabled:opacity-40 transition-colors"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>

          {/* Command Autocomplete Dropdown */}
          {showSuggestions && inputCmd.startsWith('/') && filteredSuggestions.length > 0 && (
            <div className="absolute bottom-full mb-1 left-0 right-0 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-30 max-h-48 overflow-y-auto custom-scrollbar font-mono">
              <div className="text-[10px] text-slate-400 px-2 py-1 uppercase tracking-wider">
                Command Suggestions
              </div>
              {filteredSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputCmd(item.cmd);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800 flex justify-between items-center text-xs transition-colors"
                >
                  <span className="text-emerald-400 font-semibold">{item.cmd}</span>
                  <span className="text-slate-400 text-[11px] font-sans">{item.desc}</span>
                </button>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
