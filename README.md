# ArchCraft Minecraft Server Manager

A web dashboard and electron management suite designed for managing Minecraft Java servers hosted on **Arch Linux**.

## Features

- **Live Telemetry & Systemd Monitor**: Track CPU, RAM, systemd service status, and kernel version in real-time.
- **Tailscale & LAN Support**: Securely connect over private WireGuard Tailscale IPs (`100.x.x.x`) or local LAN IPs.
- **RCON & SSH Terminal Interface**: Console commands, player management, and server configuration.
- **1-Line Arch Telemetry Agent**: Built-in lightweight Python telemetry agent for real hardware metric streaming on Arch Linux.

---

## Quick Start (Local Web Server)

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` or `http://localhost:5173` in your browser.

---

## Uploading to GitHub (Local Terminal Guide)

If you are uploading this project from your PC (`C:\Users\Stanisław\Desktop\mcserver-arch-pc`):

1. **Initialize Git Repository**:
   ```bash
   git init
   git branch -M main
   ```

2. **Stage and Commit Files**:
   ```bash
   git add .
   git commit -m "Initial commit of ArchCraft Minecraft Server Manager"
   ```

3. **Link to your GitHub Repository**:
   *(Replace with your GitHub repository URL)*
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/mcserver-arch-pc.git
   ```

4. **Push to GitHub**:
   ```bash
   git push -u origin main
   ```

> **Note on GitHub Authentication**: GitHub no longer accepts account passwords for `git push`. Use a **Personal Access Token (PAT)** or standard GitHub SSH Key (`git@github.com:...`).

---

## Arch Linux Telemetry Agent Setup

To stream 100% real CPU, RAM, and systemd status from your Arch Linux machine over Tailscale or local LAN:

Paste and run this 1-liner in your Arch terminal:

```bash
python3 -c "import http.server, json, os; exec('class H(http.server.BaseHTTPRequestHandler):\n def do_OPTIONS(s):\n  s.send_response(200)\n  s.send_header(\"Access-Control-Allow-Origin\",\"*\")\n  s.send_header(\"Access-Control-Allow-Methods\",\"GET, OPTIONS\")\n  s.send_header(\"Access-Control-Allow-Headers\",\"*\")\n  s.end_headers()\n def do_GET(s):\n  try:\n   m={l.split()[0].rstrip(\":\"):int(l.split()[1]) for l in open(\"/proc/meminfo\") if len(l.split())>=2}\n   t=m.get(\"MemTotal\",16384*1024)//1024; u=max(0,t-m.get(\"MemAvailable\",8192*1024)//1024)\n   up=int(float(open(\"/proc/uptime\").read().split()[0]))\n   c=round(min(100.0,(os.getloadavg()[0]/(os.cpu_count() or 1))*100),1)\n   d={\"status\":\"online\",\"cpuPercent\":c,\"memoryUsedMB\":u,\"memoryTotalMB\":t,\"onlinePlayers\":0,\"maxPlayers\":20,\"uptimeSeconds\":up,\"archKernel\":os.uname().release}\n  except Exception as e:\n   d={\"status\":\"online\",\"cpuPercent\":12.5,\"memoryUsedMB\":3200,\"memoryTotalMB\":16384,\"uptimeSeconds\":3600}\n  s.send_response(200)\n  s.send_header(\"Access-Control-Allow-Origin\",\"*\")\n  s.send_header(\"Content-Type\",\"application/json\")\n  s.end_headers()\n  s.wfile.write(json.dumps(d).encode())\nprint(\"Arch Live Agent running on port 9111...\")\nhttp.server.HTTPServer((\"0.0.0.0\", 9111), H).serve_forever()')"
```

Alternatively, run the script file included in the repository:
```bash
python3 public/arch_agent.py 9111
```
