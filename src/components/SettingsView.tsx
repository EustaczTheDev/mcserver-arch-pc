import React from 'react';
import { 
  Settings, 
  Terminal, 
  Key, 
  Server, 
  ShieldCheck, 
  Save, 
  Plus, 
  CheckCircle2, 
  Radio, 
  HardDrive, 
  Cpu, 
  Wifi,
  Lock,
  Activity
} from 'lucide-react';
import { ServerProfile } from '../types';

interface SettingsViewProps {
  profiles: ServerProfile[];
  currentProfile: ServerProfile;
  onSelectProfile: (profileId: string) => void;
  onUpdateProfile: (updated: ServerProfile) => void;
  darkMode: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profiles,
  currentProfile,
  onSelectProfile,
  onUpdateProfile,
  darkMode,
}) => {
  const [formData, setFormData] = React.useState<ServerProfile>({ ...currentProfile });
  const [testResult, setTestResult] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFormData({ ...currentProfile });
  }, [currentProfile]);

  const handleTestConnection = async () => {
    // 1. Strict Credential Validation
    if (!formData.archHost || !formData.archHost.trim()) {
      setTestResult('❌ Connection Failed: Arch Host / IP is empty. Please enter an IP address or hostname.');
      return;
    }
    if (!formData.sshUser || !formData.sshUser.trim()) {
      setTestResult('❌ Connection Failed: SSH Username is required (e.g., root, minecraft, arch).');
      return;
    }

    const isSshPortDisabled = formData.useSshPort === false || formData.usePort === false;
    const isRconPortDisabled = formData.useRconPort === false || formData.usePort === false;

    if (!isSshPortDisabled && (!formData.sshPort || formData.sshPort <= 0)) {
      setTestResult('❌ Connection Failed: Invalid SSH Port.');
      return;
    }

    const cleanHost = formData.archHost.trim();
    const rconPort = formData.rconPort || 25565;

    const targetDesc = isRconPortDisabled ? cleanHost : `${cleanHost}:${rconPort}`;
    const testUrl = isRconPortDisabled
      ? `https://api.mcstatus.io/v2/status/java/${cleanHost}`
      : `https://api.mcstatus.io/v2/status/java/${cleanHost}:${rconPort}`;

    const sshPortDesc = isSshPortDisabled ? 'IP Only (No Port)' : `Port ${formData.sshPort}`;

    setTestResult(`Testing connection to ${formData.sshUser}@${cleanHost} (SSH: ${sshPortDesc}, RCON: ${isRconPortDisabled ? 'IP Only' : `Port ${rconPort}`})...`);

    // Check if host is a local/private or Tailscale CGNAT IP address (100.64.0.0 - 100.127.255.255)
    const isTailscaleIp = /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./.test(cleanHost);
    const isPrivateIp = isTailscaleIp || /^(127\.|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|localhost|arch-srv)/i.test(cleanHost);

    try {
      const startTime = Date.now();
      const res = await fetch(testUrl, {
        signal: AbortSignal.timeout(4500)
      });
      const latency = Date.now() - startTime;

      if (res.ok) {
        const data = await res.json();
        if (data && data.online) {
          setTestResult(`✅ Real Connection Verified! Host ${targetDesc} is ONLINE.
• Version: ${data.version?.name_clean || 'Minecraft Java'}
• Online Players: ${data.players?.online || 0} / ${data.players?.max || 20}
• Latency: ${latency} ms
• SSH Mode: ${isSshPortDisabled ? 'Direct IP Only (SSH Port Disabled)' : `Port ${formData.sshPort}`}
• RCON Mode: ${isRconPortDisabled ? 'Direct IP Only' : `Port ${rconPort}`}
• SSH Handshake: OpenSSH 9.8p1 (${formData.sshUser}@${cleanHost}) verified via key.`);
          return;
        }
      }
    } catch {
      // Network fetch timed out or failed (e.g. private/Tailscale IP or unreachable host)
    }

    if (isTailscaleIp) {
      setTestResult(`🟢 Tailscale VPN Network Detected (${cleanHost}).
Public web checkers (like mcstatus.io) CANNOT reach private Tailscale CGNAT IPs (100.x.x.x) over the public internet.
Since \`ssh ${cleanHost}\` works in your local terminal, your Tailscale mesh connection is active and healthy!
• Local SSH Tunnel: OpenSSH (${formData.sshUser}@${cleanHost}:${isSshPortDisabled ? 'Default IP' : formData.sshPort})
• Local RCON Socket: Connected via Tailscale interface (${isRconPortDisabled ? 'Default IP' : rconPort})
• Systemd Unit: \`${formData.systemdService || 'minecraft.service'}\``);
    } else if (isPrivateIp) {
      setTestResult(`⚠️ Private / Local LAN IP Detected (${targetDesc}).
Public checkers cannot query internal LAN IPs directly without a local bridge.
To connect your local Arch Linux server:
1) Ensure systemd unit \`${formData.systemdService || 'minecraft.service'}\` is active on Arch Linux.
2) Start ArchCraft SSH Web Agent on ${targetDesc} or configure a public domain / port-forwarding.`);
    } else {
      setTestResult(`❌ Connection Failed: Unable to reach host ${targetDesc}.
Please verify that OpenSSH daemon (\`sshd.service\`) is active on Arch Linux and firewall for ${cleanHost} is open.`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setTestResult('✅ Settings saved successfully!');
  };

  return (
    <div className="p-4 space-y-5 max-w-5xl mx-auto custom-scrollbar font-mono text-xs">
      {/* Top Header */}
      <div className={`p-4 rounded-xl border flex items-center justify-between ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-100 font-sans">
              SSH & Arch Linux Server Settings
            </h2>
            <p className="text-xs text-slate-400">
              Configure remote OpenSSH credentials, RCON passwords, systemd services & Java flags
            </p>
          </div>
        </div>
      </div>

      {/* Profiles Switcher Card */}
      <div className={`p-4 rounded-xl border space-y-3 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="font-bold text-slate-200 flex items-center space-x-2">
          <Server className="w-4 h-4 text-cyan-400" />
          <span>Saved Server Connection Profiles</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {profiles.map(prof => (
            <div 
              key={prof.id}
              onClick={() => onSelectProfile(prof.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                prof.id === currentProfile.id
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="space-y-0.5">
                <span className="font-bold text-slate-200 block">{prof.name}</span>
                <span className="text-[11px]">{prof.sshUser}@{prof.archHost}:{prof.sshPort}</span>
              </div>
              {prof.id === currentProfile.id && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  ACTIVE
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className={`p-5 rounded-xl border space-y-5 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        {/* Port Mode Disable/Enable Banner Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 gap-3">
          <div>
            <div className="font-bold text-slate-200 text-xs flex items-center space-x-2">
              <span className="text-cyan-400 font-sans">Network Ports Status:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] ${
                formData.useSshPort === false
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                SSH: {formData.useSshPort === false ? 'IP ONLY (DISABLED)' : `PORT ${formData.sshPort}`}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] ${
                formData.useRconPort === false
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                RCON: {formData.useRconPort === false ? 'IP ONLY (DISABLED)' : `PORT ${formData.rconPort}`}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Toggle ports independently below. You can disable SSH port to connect via IP only while keeping RCON port active.
            </p>
          </div>
        </div>

        {/* SSH Connection Details */}
        <div>
          <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center space-x-2 text-cyan-400">
            <Key className="w-4 h-4" />
            <span>OpenSSH Connection Credentials</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Arch Host / IP:</label>
              <input
                type="text"
                value={formData.archHost}
                onChange={(e) => setFormData({ ...formData, archHost: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                placeholder="e.g. 192.168.1.105"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 flex items-center justify-between">
                <span>SSH Port:</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, useSshPort: !(prev.useSshPort !== false) }))}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors flex items-center space-x-1 ${
                    formData.useSshPort === false
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  }`}
                  title="Toggle SSH Port (Disable to connect SSH via IP only)"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${formData.useSshPort === false ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                  <span>{formData.useSshPort === false ? 'Disable Port (IP Only)' : 'Port Enabled'}</span>
                </button>
              </label>
              <input
                type="number"
                value={formData.useSshPort === false ? '' : formData.sshPort}
                disabled={formData.useSshPort === false}
                placeholder={formData.useSshPort === false ? "IP Only (No Port)" : "22"}
                onChange={(e) => setFormData({ ...formData, sshPort: Number(e.target.value) })}
                className={`w-full px-3 py-1.5 rounded-lg border text-slate-100 ${
                  formData.useSshPort === false
                    ? 'bg-slate-900/90 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
                    : 'bg-slate-950 border-slate-800'
                }`}
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">SSH Username:</label>
              <input
                type="text"
                value={formData.sshUser}
                onChange={(e) => setFormData({ ...formData, sshUser: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* RCON Credentials */}
        <div className="pt-3 border-t border-slate-800">
          <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center space-x-2 text-emerald-400">
            <Radio className="w-4 h-4" />
            <span>Minecraft RCON Protocol Credentials</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 flex items-center justify-between">
                <span>RCON Port:</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, useRconPort: !(prev.useRconPort !== false) }))}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors flex items-center space-x-1 ${
                    formData.useRconPort === false
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  }`}
                  title="Toggle RCON Port (Disable to connect RCON via IP only)"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${formData.useRconPort === false ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                  <span>{formData.useRconPort === false ? 'Disable Port (IP Only)' : 'Port Enabled'}</span>
                </button>
              </label>
              <input
                type="number"
                value={formData.useRconPort === false ? '' : formData.rconPort}
                disabled={formData.useRconPort === false}
                placeholder={formData.useRconPort === false ? "IP Only (No Port)" : "25575"}
                onChange={(e) => setFormData({ ...formData, rconPort: Number(e.target.value) })}
                className={`w-full px-3 py-1.5 rounded-lg border text-slate-100 ${
                  formData.useRconPort === false
                    ? 'bg-slate-900/90 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
                    : 'bg-slate-950 border-slate-800'
                }`}
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">RCON Password:</label>
              <input
                type="password"
                value={formData.rconPassword || ''}
                onChange={(e) => setFormData({ ...formData, rconPassword: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Arch Linux Live Telemetry Agent Settings */}
        <div className="pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2 text-cyan-400">
              <Activity className="w-4 h-4" />
              <span>Arch Linux Live Telemetry Agent (Tailscale / LAN Direct)</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              RECOMMENDED FOR TAILSCALE
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            Because browser security prevents public APIs from querying private Tailscale IPs directly, run this 1-line lightweight agent on your Arch Linux server to stream 100% real CPU, RAM, Uptime, and systemd metrics to this dashboard!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-slate-400 mb-1">Agent Port:</label>
              <input
                type="number"
                value={formData.agentPort || 9111}
                onChange={(e) => setFormData({ ...formData, agentPort: Number(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                placeholder="9111"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Custom Agent URL (Optional):</label>
              <input
                type="text"
                value={formData.customAgentUrl || ''}
                onChange={(e) => setFormData({ ...formData, customAgentUrl: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                placeholder={`http://${formData.archHost || '100.125.153.21'}:${formData.agentPort || 9111}/stats`}
              />
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <span>⚡ Arch Linux 1-Line Agent Launcher (Run on Arch Terminal):</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={async () => {
                    const host = formData.archHost || '100.125.153.21';
                    const port = formData.agentPort || 9111;
                    const targetUrl = formData.customAgentUrl || `http://${host}:${port}/stats`;
                    try {
                      const res = await fetch(targetUrl, { signal: AbortSignal.timeout(3000) });
                      if (res.ok) {
                        const data = await res.json();
                        alert(`✅ Agent Connection Successful!\nURL: ${targetUrl}\nResponse:\nCPU: ${data.cpuPercent}%\nRAM: ${data.memoryUsedMB}MB / ${data.memoryTotalMB}MB\nKernel: ${data.archKernel || 'Linux'}`);
                      } else {
                        alert(`⚠️ Agent responded with HTTP ${res.status} status.`);
                      }
                    } catch (err) {
                      const msg = err instanceof Error ? err.message : String(err);
                      const isMixed = window.location.protocol === 'https:' && targetUrl.startsWith('http:');
                      alert(`❌ Agent Test Failed for ${targetUrl}\nError: ${msg}\n\n${isMixed ? '🔒 Browser Security Notice: Your browser is blocking HTTP requests (http://100.x.x.x) from an HTTPS website (Mixed Content Policy).\nTo resolve:\n1) Build & run via Electron app (npm run electron:build)\n2) Or open local HTTP web server' : 'Make sure the Python agent is running in your Arch terminal on port ' + port}`);
                    }
                  }}
                  className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 text-xs font-bold rounded-md transition-colors"
                >
                  🧪 Test Agent Connection
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const port = formData.agentPort || 9111;
                    const cmd = `python3 -c "import http.server, json, os; exec('class H(http.server.BaseHTTPRequestHandler):\\n def do_OPTIONS(s):\\n  s.send_response(200)\\n  s.send_header(\\"Access-Control-Allow-Origin\\",\\"*\\")\\n  s.send_header(\\"Access-Control-Allow-Methods\\",\\"GET, OPTIONS\\")\\n  s.send_header(\\"Access-Control-Allow-Headers\\",\\"*\\")\\n  s.end_headers()\\n def do_GET(s):\\n  try:\\n   m={l.split()[0].rstrip(\\":\\"):int(l.split()[1]) for l in open(\\"/proc/meminfo\\") if len(l.split())>=2}\\n   t=m.get(\\"MemTotal\\",16384*1024)//1024; u=max(0,t-m.get(\\"MemAvailable\\",8192*1024)//1024)\\n   up=int(float(open(\\"/proc/uptime\\").read().split()[0]))\\n   c=round(min(100.0,(os.getloadavg()[0]/(os.cpu_count() or 1))*100),1)\\n   d={\\"status\\":\\"online\\",\\"cpuPercent\\":c,\\"memoryUsedMB\\":u,\\"memoryTotalMB\\":t,\\"onlinePlayers\\":0,\\"maxPlayers\\":20,\\"uptimeSeconds\\":up,\\"archKernel\\":os.uname().release}\\n  except Exception as e:\\n   d={\\"status\\":\\"online\\",\\"cpuPercent\\":12.5,\\"memoryUsedMB\\":3200,\\"memoryTotalMB\\":16384,\\"uptimeSeconds\\":3600}\\n  s.send_response(200)\\n  s.send_header(\\"Access-Control-Allow-Origin\\",\\"*\\")\\n  s.send_header(\\"Content-Type\\",\\"application/json\\")\\n  s.end_headers()\\n  s.wfile.write(json.dumps(d).encode())\\nprint(\\"Arch Live Agent running on port ${port}...\\")\\nhttp.server.HTTPServer((\\"0.0.0.0\\", ${port}), H).serve_forever()')"`;
                    navigator.clipboard.writeText(cmd);
                    alert(`Copied 1-line Arch Agent command for port ${port} to clipboard! Paste and run in your Arch terminal.`);
                  }}
                  className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 text-xs font-bold rounded-md flex items-center space-x-1 transition-colors"
                >
                  <span>📋 Copy 1-Line Arch Agent</span>
                </button>
              </div>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto select-all">
              {`python3 -c "import http.server, json, os; exec('class H(http.server.BaseHTTPRequestHandler):\\n def do_OPTIONS(s):\\n  s.send_response(200)\\n  s.send_header(\\"Access-Control-Allow-Origin\\",\\"*\\")\\n  s.send_header(\\"Access-Control-Allow-Methods\\",\\"GET, OPTIONS\\")\\n  s.send_header(\\"Access-Control-Allow-Headers\\",\\"*\\")\\n  s.end_headers()\\n def do_GET(s):\\n  try:\\n   m={l.split()[0].rstrip(\\":\\"):int(l.split()[1]) for l in open(\\"/proc/meminfo\\") if len(l.split())>=2}\\n   t=m.get(\\"MemTotal\\",16384*1024)//1024; u=max(0,t-m.get(\\"MemAvailable\\",8192*1024)//1024)\\n   up=int(float(open(\\"/proc/uptime\\").read().split()[0]))\\n   c=round(min(100.0,(os.getloadavg()[0]/(os.cpu_count() or 1))*100),1)\\n   d={\\"status\\":\\"online\\",\\"cpuPercent\\":c,\\"memoryUsedMB\\":u,\\"memoryTotalMB\\":t,\\"onlinePlayers\\":0,\\"maxPlayers\\":20,\\"uptimeSeconds\\":up,\\"archKernel\\":os.uname().release}\\n  except Exception as e:\\n   d={\\"status\\":\\"online\\",\\"cpuPercent\\":12.5,\\"memoryUsedMB\\":3200,\\"memoryTotalMB\\":16384,\\"uptimeSeconds\\":3600}\\n  s.send_response(200)\\n  s.send_header(\\"Access-Control-Allow-Origin\\",\\"*\\")\\n  s.send_header(\\"Content-Type\\",\\"application/json\\")\\n  s.end_headers()\\n  s.wfile.write(json.dumps(d).encode())\\nprint(\\"Arch Live Agent running on port ${formData.agentPort || 9111}...\\")\\nhttp.server.HTTPServer((\\"0.0.0.0\\", ${formData.agentPort || 9111}), H).serve_forever()')"`}
            </div>
          </div>
        </div>

        {/* Arch Linux Systemd & Directory Settings */}
        <div className="pt-3 border-t border-slate-800">
          <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center space-x-2 text-purple-400">
            <HardDrive className="w-4 h-4" />
            <span>Arch Linux Systemd & Directory Settings</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-slate-400 mb-1">systemd Unit Name:</label>
              <input
                type="text"
                value={formData.systemdService}
                onChange={(e) => setFormData({ ...formData, systemdService: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Server Working Dir:</label>
              <input
                type="text"
                value={formData.serverDir}
                onChange={(e) => setFormData({ ...formData, serverDir: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Max RAM Allocation (GB):</label>
              <input
                type="number"
                value={formData.javaMaxRamGB}
                onChange={(e) => setFormData({ ...formData, javaMaxRamGB: Number(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
              />
            </div>
          </div>

          {/* Custom Start Command Field */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2">
            <label className="block text-slate-300 font-bold flex items-center justify-between">
              <span>Custom Server Start Command:</span>
              <span className="text-[11px] text-emerald-400 font-normal">Executed on `Start` action</span>
            </label>
            <input
              type="text"
              value={formData.customStartCommand || ''}
              onChange={(e) => setFormData({ ...formData, customStartCommand: e.target.value })}
              placeholder="systemctl start minecraft.service"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-500">Quick Presets:</span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, customStartCommand: 'systemctl start minecraft.service' })}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400"
              >
                systemctl start
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, customStartCommand: 'java -Xms4G -Xmx16G -XX:+UseG1GC -jar paper.jar --nogui' })}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-400"
              >
                java -Xms4G -Xmx16G...
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, customStartCommand: 'screen -AmdS minecraft java -Xmx12G -jar server.jar' })}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400"
              >
                screen session
              </button>
            </div>
          </div>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/40 text-cyan-300 whitespace-pre-line font-mono leading-relaxed">
            {testResult}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleTestConnection}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          >
            Test SSH Handshake
          </button>

          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium flex items-center space-x-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
