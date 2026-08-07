import { 
  ServerMetrics, 
  Player, 
  BannedPlayer, 
  LogMessage, 
  FileItem, 
  PluginItem, 
  BackupSchedule, 
  BackupSnapshot, 
  ServerProfile 
} from '../types';

export const INITIAL_SERVER_PROFILES: ServerProfile[] = [
  {
    id: 'arch-prod-1',
    name: 'Arch Linux Main Server (Paper 1.20.4)',
    archHost: '192.168.1.105',
    sshPort: 22,
    sshUser: 'minecraft',
    sshAuthType: 'private_key',
    rconPort: 25575,
    rconPassword: '••••••••••••',
    serverDir: '/opt/minecraft/server',
    systemdService: 'minecraft.service',
    customStartCommand: 'systemctl start minecraft.service',
    javaMaxRamGB: 16,
    paperVersion: 'Paper-1.20.4-build-496 (OpenJDK 21)',
    archKernel: 'Linux 6.10.8-arch1-1 x86_64',
    isCurrent: true,
  },
  {
    id: 'arch-velocity-2',
    name: 'Arch Velocity Proxy Network',
    archHost: '192.168.1.106',
    sshPort: 22,
    sshUser: 'sysadmin',
    sshAuthType: 'password',
    rconPort: 25577,
    rconPassword: '••••••••••••',
    serverDir: '/srv/velocity',
    systemdService: 'velocity.service',
    customStartCommand: 'java -Xms4G -Xmx8G -XX:+UseG1GC -jar velocity-3.3.0.jar',
    javaMaxRamGB: 8,
    paperVersion: 'Velocity 3.3.0',
    archKernel: 'Linux 6.10.8-arch1-1 x86_64',
    isCurrent: false,
  }
];

export const INITIAL_METRICS: ServerMetrics = {
  cpuUsage: 28.4,
  ramUsedGB: 11.2,
  ramTotalGB: 16.0,
  diskUsedGB: 42.8,
  diskTotalGB: 250.0,
  tps: 20.0,
  mspt: 18.2,
  networkRxKBps: 1240.5,
  networkTxKBps: 3450.2,
  onlinePlayers: 14,
  maxPlayers: 50,
  chunksLoaded: 4820,
  entitiesLoaded: 1240,
  uptimeSeconds: 1234500, // ~14 days
  history: Array.from({ length: 20 }).map((_, i) => ({
    timestamp: new Date(Date.now() - (19 - i) * 15000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    cpu: Math.min(100, Math.max(10, 25 + Math.sin(i) * 15 + Math.random() * 10)),
    ram: Number((10.5 + Math.cos(i) * 0.8 + Math.random() * 0.4).toFixed(1)),
    tps: Number((19.8 + Math.random() * 0.2).toFixed(1)),
    mspt: Number((16.5 + Math.random() * 4.0).toFixed(1)),
    players: Math.floor(10 + Math.sin(i * 0.5) * 4 + Math.random() * 2),
  })),
};

export const INITIAL_PLAYERS: Player[] = [
  {
    uuid: '069a79f4-44e9-4726-a5be-fef90e38aaf5',
    username: 'Notch',
    ping: 24,
    health: 20,
    food: 18,
    gamemode: 'survival',
    dimension: 'world',
    coords: { x: 1420, y: 64, z: -820 },
    isOp: true,
    isWhitelisted: true,
    isBanned: false,
    joinedAt: '2 hours ago',
    playtimeHours: 142.5,
    ipAddress: '192.168.1.42',
    skinUrl: 'https://mc-heads.net/avatar/Notch/64',
    inventory: [
      { slot: 0, id: 'diamond_sword', name: 'Sharpness V Diamond Sword', count: 1, icon: '⚔️' },
      { slot: 1, id: 'diamond_pickaxe', name: 'Efficiency V Pickaxe', count: 1, icon: '⛏️' },
      { slot: 2, id: 'golden_apple', name: 'Enchanted Golden Apple', count: 8, icon: '🍎' },
      { slot: 3, id: 'cooked_beef', name: 'Steak', count: 64, icon: '🥩' },
      { slot: 8, id: 'totem_of_undying', name: 'Totem of Undying', count: 2, icon: '🛡️' },
    ]
  },
  {
    uuid: '853c80ef-3c37-49fd-aa49-938b674adae6',
    username: 'Jeb_',
    ping: 18,
    health: 20,
    food: 20,
    gamemode: 'creative',
    dimension: 'world',
    coords: { x: 0, y: 72, z: 0 },
    isOp: true,
    isWhitelisted: true,
    isBanned: false,
    joinedAt: '45 mins ago',
    playtimeHours: 210.1,
    ipAddress: '192.168.1.18',
    skinUrl: 'https://mc-heads.net/avatar/jeb_/64',
    inventory: [
      { slot: 0, id: 'redstone', name: 'Redstone Dust', count: 64, icon: '🔴' },
      { slot: 1, id: 'repeater', name: 'Redstone Repeater', count: 64, icon: '📟' },
      { slot: 2, id: 'command_block', name: 'Command Block', count: 1, icon: '📦' },
    ]
  },
  {
    uuid: '61626644-301d-4ae8-87bf-e5aca5763ac2',
    username: 'AlexBuilder',
    ping: 42,
    health: 16,
    food: 14,
    gamemode: 'survival',
    dimension: 'world',
    coords: { x: -320, y: 88, z: 1250 },
    isOp: false,
    isWhitelisted: true,
    isBanned: false,
    joinedAt: '10 mins ago',
    playtimeHours: 48.2,
    ipAddress: '82.165.42.11',
    skinUrl: 'https://mc-heads.net/avatar/Alex/64',
    inventory: [
      { slot: 0, id: 'oak_log', name: 'Oak Wood', count: 64, icon: '🪵' },
      { slot: 1, id: 'stone_bricks', name: 'Stone Bricks', count: 64, icon: '🧱' },
      { slot: 2, id: 'glass', name: 'Glass', count: 32, icon: '🪟' },
    ]
  },
  {
    uuid: 'f84c6a71-0a37-4d1a-8e2b-28312019aaf1',
    username: 'EnderMaster',
    ping: 68,
    health: 12,
    food: 10,
    gamemode: 'survival',
    dimension: 'world_the_end',
    coords: { x: 100, y: 49, z: -20 },
    isOp: false,
    isWhitelisted: true,
    isBanned: false,
    joinedAt: '1 hour ago',
    playtimeHours: 89.6,
    ipAddress: '109.224.81.9',
    skinUrl: 'https://mc-heads.net/avatar/Ender/64',
    inventory: [
      { slot: 0, id: 'elytra', name: 'Unbreaking III Elytra', count: 1, icon: '🪽' },
      { slot: 1, id: 'firework_rocket', name: 'Firework Rocket (Duration 3)', count: 64, icon: '🚀' },
      { slot: 2, id: 'ender_pearl', name: 'Ender Pearl', count: 16, icon: '🔮' },
    ]
  },
  {
    uuid: '3b18d2f0-1a2c-4e89-9821-2a28e90a12f3',
    username: 'NetherExplorer',
    ping: 35,
    health: 18,
    food: 19,
    gamemode: 'survival',
    dimension: 'world_nether',
    coords: { x: -450, y: 32, z: 210 },
    isOp: false,
    isWhitelisted: true,
    isBanned: false,
    joinedAt: '3 hours ago',
    playtimeHours: 64.0,
    ipAddress: '185.220.101.5',
    skinUrl: 'https://mc-heads.net/avatar/Steve/64',
  },
  {
    uuid: '22883344-5566-7788-9900-aabbccddeeff',
    username: 'RedstoneWiz',
    ping: 29,
    health: 20,
    food: 20,
    gamemode: 'survival',
    dimension: 'world',
    coords: { x: 800, y: 62, z: 450 },
    isOp: false,
    isWhitelisted: true,
    isBanned: false,
    joinedAt: '30 mins ago',
    playtimeHours: 112.4,
    ipAddress: '192.168.1.88',
    skinUrl: 'https://mc-heads.net/avatar/MumboJumbo/64',
  }
];

export const INITIAL_BANNED_PLAYERS: BannedPlayer[] = [
  {
    uuid: '99999999-0000-1111-2222-333333333333',
    username: 'XrayGriefer',
    ip: '185.120.44.12',
    reason: 'Auto-detected X-Ray texture pack & Fly hack by CoreProtect',
    bannedBy: 'Console (CoreProtect)',
    bannedAt: '2026-08-01 14:22:00',
    expiresAt: 'Permanent',
  },
  {
    uuid: '88888888-1111-2222-3333-444444444444',
    username: 'SpamBot9000',
    ip: '45.154.255.8',
    reason: 'Mass automated chat advertising bot',
    bannedBy: 'Notch',
    bannedAt: '2026-08-05 09:15:30',
    expiresAt: 'Permanent',
  }
];

export const INITIAL_LOGS: LogMessage[] = [
  { id: '1', timestamp: '01:40:12', level: 'INFO', source: 'Server thread', text: 'Starting minecraft server version 1.20.4 on Arch Linux (Kernel 6.10.8-arch1-1)' },
  { id: '2', timestamp: '01:40:14', level: 'INFO', source: 'Paper/Spigot', text: 'Loading Paper 1.20.4-R0.1-SNAPSHOT (build 496) with OpenJDK 21.0.3 64-Bit' },
  { id: '3', timestamp: '01:40:15', level: 'INFO', source: 'EssentialsX', text: '[Essentials] Enabling EssentialsX v2.20.1...' },
  { id: '4', timestamp: '01:40:16', level: 'INFO', source: 'LuckPerms', text: '[LuckPerms] Successfully connected to SQLite storage provider' },
  { id: '5', timestamp: '01:40:18', level: 'INFO', source: 'WorldEdit', text: '[WorldEdit] WorldEdit for Bukkit v7.2.15 enabled!' },
  { id: '6', timestamp: '01:40:19', level: 'INFO', source: 'Server thread', text: 'Preparing level "world" with Seed [-4829104918239012]' },
  { id: '7', timestamp: '01:40:22', level: 'INFO', source: 'Server thread', text: 'Done (7.412s)! For help, type "help"' },
  { id: '8', timestamp: '01:41:00', level: 'INFO', source: 'UserAuthenticate', text: 'Notch [/192.168.1.42:54820] logged in with entity id 104 at ([world]1420.5, 64.0, -820.5)' },
  { id: '9', timestamp: '01:41:15', level: 'WARN', source: 'Paper/Spigot', text: 'Can\'t keep up! Is the server overloaded? Running 2150ms or 43 ticks behind' },
  { id: '10', timestamp: '01:41:40', level: 'INFO', source: 'RCON Listener', text: 'RCON client connected from 127.0.0.1:49182 (ArchCraft Management GUI)' },
  { id: '11', timestamp: '01:42:05', level: 'INFO', source: 'SparkProfiler', text: '[Spark] Automated background health check: 20.00 TPS, 17.8ms MSPT, 11.2GB/16GB Heap' },
  { id: '12', timestamp: '01:42:18', level: 'INFO', source: 'Server thread', text: 'Jeb_ [/192.168.1.18:52110] logged in with entity id 189 at ([world]0.0, 72.0, 0.0)' },
];

export const INITIAL_FILES: FileItem[] = [
  {
    id: 'f-1',
    name: 'server.properties',
    path: '/opt/minecraft/server/server.properties',
    isDirectory: false,
    size: 2410,
    updatedAt: '2026-08-06 22:15',
    permissions: '-rw-r--r--',
    extension: 'properties',
    content: `# Minecraft server properties (Arch Linux systemd service)
# Generated on ArchCraft Server Manager
enable-jmx-monitoring=false
rcon.port=25575
level-seed=-4829104918239012
gamemode=survival
enable-command-block=true
enable-query=true
generator-settings={}
level-name=world
motd=\\u00A7b\\u00A7lArchCraft Minecraft \\u00A77| \\u00A7eArch Linux 6.10 \\u00A7a[1.20.4]
query.port=25565
pvp=true
generate-structures=true
max-chained-neighbor-updates=1000000
difficulty=hard
network-compression-threshold=256
max-tick-time=60000
require-resource-pack=false
use-native-transport=true
max-players=50
online-mode=true
enable-status=true
allow-flight=false
view-distance=10
server-ip=0.0.0.0
resource-pack-prompt=
allow-nether=true
server-port=25565
enable-rcon=true
rcon.password=ArchCraftSecret2026!
sync-chunk-writes=true
op-permission-level=4
prevent-proxy-connections=false
hide-online-players=false
resource-pack=
entity-broadcast-range-percentage=100
simulation-distance=8
rcon.password=ArchCraftSecret2026!
player-idle-timeout=15
force-gamemode=false
rate-limit=0
hardcore=false
white-list=true
broadcast-console-to-ops=true
spawn-npcs=true
spawn-animals=true
snooper-enabled=false
function-permission-level=2
initial-enabled-packs=vanilla
spawn-monsters=true
enforce-whitelist=true
resource-pack-sha1=
spawn-protection=16
max-world-size=29999984`
  },
  {
    id: 'f-2',
    name: 'paper-global.yml',
    path: '/opt/minecraft/server/paper-global.yml',
    isDirectory: false,
    size: 4120,
    updatedAt: '2026-08-05 18:40',
    permissions: '-rw-r--r--',
    extension: 'yml',
    content: `# Paper Global Configuration (Arch Linux JDK 21 optimized)
_version: 28
async-chunks:
  enable: true
  threads: 8
chunk-loading:
  autoconfig-send-distance: true
  min-concurrent-sends: 1
  max-concurrent-sends: 10
logging:
  deobfuscate-stacktraces: true
messages:
  kick:
    authentication-servers-down: '\xa7cAuthentication servers are down. Please try again later.'
    connection-throttle: Connection throttled! Please wait before reconnecting.
proxies:
  bungee-cord:
    online-mode: true
  velocity:
    enabled: true
    online-mode: true
    secret: 'arch-velocity-secret-key-992138'
timings:
  enabled: false
  verbose: true`
  },
  {
    id: 'f-3',
    name: 'eula.txt',
    path: '/opt/minecraft/server/eula.txt',
    isDirectory: false,
    size: 180,
    updatedAt: '2026-07-20 10:00',
    permissions: '-rw-r--r--',
    extension: 'txt',
    content: `# By changing the setting below to TRUE you are indicating your agreement to the Mojang EULA (https://aka.ms/MinecraftEULA).
# Arch Linux Minecraft systemd auto-accept
eula=true`
  },
  {
    id: 'f-4',
    name: 'spigot.yml',
    path: '/opt/minecraft/server/spigot.yml',
    isDirectory: false,
    size: 3200,
    updatedAt: '2026-08-01 11:20',
    permissions: '-rw-r--r--',
    extension: 'yml',
    content: `# Spigot configuration file
config-version: 12
settings:
  debug: false
  save-user-cache-on-stop-only: false
  sample-count: 12
  bungeecord: false
  player-shuffle: 0
  user-cache-size: 1000
  moved-wrongly-threshold: 0.0625
  moved-too-quickly-multiplier: 10.0
world-settings:
  default:
    verbose: false
    mob-spawn-range: 6
    growth:
      cactus-modifier: 100
      cane-modifier: 100
      melon-modifier: 100
      mushroom-modifier: 100
      pumpkin-modifier: 100
      sapling-modifier: 100
      beetroot-modifier: 100
      carrot-modifier: 100
      potato-modifier: 100
      wheat-modifier: 100
      netherwart-modifier: 100
    entity-activation-range:
      animals: 16
      monsters: 24
      raiders: 48
      misc: 8
      water: 16
      villagers: 16
      flying-monsters: 24
    merge-radius:
      item: 2.5
      exp: 3.0`
  },
  {
    id: 'f-dir-plugins',
    name: 'plugins',
    path: '/opt/minecraft/server/plugins',
    isDirectory: true,
    size: 4096,
    updatedAt: '2026-08-06 19:30',
    permissions: 'drwxr-xr-x',
    children: [
      {
        id: 'f-p1',
        name: 'EssentialsX.jar',
        path: '/opt/minecraft/server/plugins/EssentialsX.jar',
        isDirectory: false,
        size: 3840120,
        updatedAt: '2026-08-01 10:00',
        permissions: '-rw-r--r--',
        extension: 'jar'
      },
      {
        id: 'f-p2',
        name: 'LuckPerms.jar',
        path: '/opt/minecraft/server/plugins/LuckPerms.jar',
        isDirectory: false,
        size: 9120400,
        updatedAt: '2026-08-02 12:10',
        permissions: '-rw-r--r--',
        extension: 'jar'
      },
      {
        id: 'f-p3',
        name: 'WorldEdit.jar',
        path: '/opt/minecraft/server/plugins/WorldEdit.jar',
        isDirectory: false,
        size: 5210000,
        updatedAt: '2026-07-28 14:00',
        permissions: '-rw-r--r--',
        extension: 'jar'
      },
      {
        id: 'f-p4',
        name: 'spark.jar',
        path: '/opt/minecraft/server/plugins/spark.jar',
        isDirectory: false,
        size: 2100800,
        updatedAt: '2026-08-04 16:45',
        permissions: '-rw-r--r--',
        extension: 'jar'
      },
      {
        id: 'f-p5-dir',
        name: 'Essentials',
        path: '/opt/minecraft/server/plugins/Essentials',
        isDirectory: true,
        size: 4096,
        updatedAt: '2026-08-06 18:22',
        permissions: 'drwxr-xr-x',
        children: [
          {
            id: 'f-p5-cfg',
            name: 'config.yml',
            path: '/opt/minecraft/server/plugins/Essentials/config.yml',
            isDirectory: false,
            size: 14200,
            updatedAt: '2026-08-06 18:22',
            permissions: '-rw-r--r--',
            extension: 'yml',
            content: `# EssentialsX Configuration on Arch Linux Server
# https://essentialsx.net

ops-name-color: 'c'
nickname-prefix: '~'
max-nick-length: 15
change-displayname: true
teleport-cooldown: 3
teleport-delay: 3
heal-cooldown: 60
auto-afk: 300
auto-afk-kick: -1
spawnpoint: 'spawn'

economy:
  starting-balance: 100.0
  currency-symbol: '$'
  max-money: 1000000000`
          }
        ]
      }
    ]
  },
  {
    id: 'f-dir-world',
    name: 'world',
    path: '/opt/minecraft/server/world',
    isDirectory: true,
    size: 4096,
    updatedAt: '2026-08-07 01:40',
    permissions: 'drwxr-xr-x',
    children: [
      {
        id: 'f-w1',
        name: 'level.dat',
        path: '/opt/minecraft/server/world/level.dat',
        isDirectory: false,
        size: 24500,
        updatedAt: '2026-08-07 01:42',
        permissions: '-rw-r--r--',
        extension: 'dat'
      },
      {
        id: 'f-w2',
        name: 'session.lock',
        path: '/opt/minecraft/server/world/session.lock',
        isDirectory: false,
        size: 12,
        updatedAt: '2026-08-07 01:40',
        permissions: '-rw-r--r--',
        extension: 'lock'
      }
    ]
  },
  {
    id: 'f-dir-logs',
    name: 'logs',
    path: '/opt/minecraft/server/logs',
    isDirectory: true,
    size: 4096,
    updatedAt: '2026-08-07 01:40',
    permissions: 'drwxr-xr-x',
    children: [
      {
        id: 'f-l1',
        name: 'latest.log',
        path: '/opt/minecraft/server/logs/latest.log',
        isDirectory: false,
        size: 154000,
        updatedAt: '2026-08-07 01:42',
        permissions: '-rw-r--r--',
        extension: 'log',
        content: `[01:40:12] [Server thread/INFO]: Starting minecraft server version 1.20.4 on Arch Linux (Kernel 6.10.8-arch1-1)
[01:40:14] [Server thread/INFO]: Loading Paper 1.20.4-R0.1-SNAPSHOT (build 496) with OpenJDK 21.0.3
[01:40:15] [Server thread/INFO]: [Essentials] Enabling EssentialsX v2.20.1...
[01:40:16] [Server thread/INFO]: [LuckPerms] Successfully connected to SQLite storage provider
[01:40:18] [Server thread/INFO]: [WorldEdit] WorldEdit for Bukkit v7.2.15 enabled!
[01:40:19] [Server thread/INFO]: Preparing level "world"
[01:40:22] [Server thread/INFO]: Done (7.412s)! For help, type "help"`
      }
    ]
  }
];

export const INITIAL_PLUGINS: PluginItem[] = [
  {
    id: 'essentialsx',
    name: 'EssentialsX',
    version: '2.20.1',
    author: 'EssentialsX Team',
    description: 'The essential suite of commands for Spigot & Paper servers, including teleportation, economy, homes, and moderation tools.',
    category: 'Essentials',
    fileName: 'EssentialsX.jar',
    fileSizeMB: 3.8,
    enabled: true,
    updateAvailable: false,
    installedVersion: '2.20.1',
    configFilePath: '/opt/minecraft/server/plugins/Essentials/config.yml',
    downloadsCount: 14200000,
    isInstalled: true,
    dependencies: ['Vault'],
  },
  {
    id: 'luckperms',
    name: 'LuckPerms',
    version: '5.4.102',
    author: 'Luck',
    description: 'Advanced permissions management plugin with web editor, rank hierarchies, fast caching, and full Paper support.',
    category: 'Security',
    fileName: 'LuckPerms.jar',
    fileSizeMB: 9.1,
    enabled: true,
    updateAvailable: true,
    installedVersion: '5.4.102',
    configFilePath: '/opt/minecraft/server/plugins/LuckPerms/config.yml',
    downloadsCount: 9800000,
    isInstalled: true,
  },
  {
    id: 'worldedit',
    name: 'WorldEdit',
    version: '7.2.15',
    author: 'EngineHub',
    description: 'In-game Minecraft map editor with selection tools, brush tools, schematics, and rapid block replacements.',
    category: 'World',
    fileName: 'WorldEdit.jar',
    fileSizeMB: 5.2,
    enabled: true,
    updateAvailable: false,
    installedVersion: '7.2.15',
    downloadsCount: 18500000,
    isInstalled: true,
  },
  {
    id: 'spark',
    name: 'spark',
    version: '1.10.53',
    author: 'lucko',
    description: 'Performance profiling plugin for Minecraft servers. Provides CPU profiler, memory inspection, and TPS/MSPT analytics.',
    category: 'Performance',
    fileName: 'spark.jar',
    fileSizeMB: 2.1,
    enabled: true,
    updateAvailable: false,
    installedVersion: '1.10.53',
    downloadsCount: 4100000,
    isInstalled: true,
  },
  {
    id: 'vault',
    name: 'Vault',
    version: '1.7.3',
    author: 'Slekit',
    description: 'Economy, permission, and chat abstraction API required by almost all server management plugins.',
    category: 'Economy',
    fileName: 'Vault.jar',
    fileSizeMB: 0.4,
    enabled: true,
    updateAvailable: false,
    installedVersion: '1.7.3',
    downloadsCount: 16000000,
    isInstalled: true,
  },
  {
    id: 'coreprotect',
    name: 'CoreProtect',
    version: '22.2',
    author: 'PlayPro',
    description: 'Fast, efficient block logging and rollback tool to inspect block changes, chest transactions, and grief attempts.',
    category: 'Security',
    fileName: 'CoreProtect.jar',
    fileSizeMB: 1.8,
    enabled: false,
    updateAvailable: false,
    downloadsCount: 8900000,
    isInstalled: false,
  },
  {
    id: 'dynmap',
    name: 'Dynmap',
    version: '3.7.1',
    author: 'mikeprimm',
    description: 'Google Maps-style real-time web map for your Minecraft server worlds, hosted right on Arch Linux.',
    category: 'Utility',
    fileName: 'Dynmap.jar',
    fileSizeMB: 18.4,
    enabled: false,
    updateAvailable: false,
    downloadsCount: 11200000,
    isInstalled: false,
  },
  {
    id: 'viaversion',
    name: 'ViaVersion',
    version: '4.9.2',
    author: 'ViaVersion Team',
    description: 'Allows newer Minecraft client versions to connect to older server versions without re-compiling.',
    category: 'Utility',
    fileName: 'ViaVersion.jar',
    fileSizeMB: 7.6,
    enabled: false,
    updateAvailable: false,
    downloadsCount: 12400000,
    isInstalled: false,
  },
  {
    id: 'multiverse-core',
    name: 'Multiverse-Core',
    version: '4.3.12',
    author: 'Multiverse Team',
    description: 'Easily create, import, manage, and teleport between multiple worlds on a single server.',
    category: 'World',
    fileName: 'Multiverse-Core.jar',
    fileSizeMB: 1.9,
    enabled: false,
    updateAvailable: false,
    downloadsCount: 15300000,
    isInstalled: false,
  }
];

export const INITIAL_BACKUP_SCHEDULES: BackupSchedule[] = [
  {
    id: 'sched-1',
    name: 'Daily Full Arch Server Snapshot',
    cronExpression: '0 3 * * *',
    frequencyLabel: 'Every night at 03:00 AM',
    scope: 'full',
    retentionDays: 14,
    compression: 'zstd',
    enabled: true,
    lastRun: 'Today at 03:00 AM',
    nextRun: 'Tomorrow at 03:00 AM',
    destination: '/var/backups/minecraft/snapshots/',
  },
  {
    id: 'sched-2',
    name: 'Hourly World & Playerdata Backup',
    cronExpression: '0 * * * *',
    frequencyLabel: 'Every hour on the hour',
    scope: 'world_only',
    retentionDays: 3,
    compression: 'tar.xz',
    enabled: true,
    lastRun: '1 hour ago',
    nextRun: 'In 18 minutes',
    destination: '/var/backups/minecraft/hourly_worlds/',
  },
  {
    id: 'sched-3',
    name: 'Weekly Plugin & Config Sync',
    cronExpression: '0 0 * * 0',
    frequencyLabel: 'Every Sunday at Midnight',
    scope: 'plugins_configs',
    retentionDays: 30,
    compression: 'gzip',
    enabled: false,
    lastRun: '4 days ago',
    nextRun: 'In 3 days',
    destination: '/var/backups/minecraft/configs_weekly/',
  }
];

export const INITIAL_BACKUP_SNAPSHOTS: BackupSnapshot[] = [
  {
    id: 'snap-104',
    fileName: 'mc_backup_full_2026-08-07_0300.tar.zst',
    sizeMB: 1840.5,
    createdAt: '2026-08-07 03:00:00',
    scope: 'full',
    compression: 'Zstandard (.zst)',
    status: 'completed',
    path: '/var/backups/minecraft/snapshots/mc_backup_full_2026-08-07_0300.tar.zst'
  },
  {
    id: 'snap-103',
    fileName: 'mc_backup_world_2026-08-07_0100.tar.xz',
    sizeMB: 620.2,
    createdAt: '2026-08-07 01:00:00',
    scope: 'world_only',
    compression: 'Tar.XZ',
    status: 'completed',
    path: '/var/backups/minecraft/hourly_worlds/mc_backup_world_2026-08-07_0100.tar.xz'
  },
  {
    id: 'snap-102',
    fileName: 'mc_backup_full_2026-08-06_0300.tar.zst',
    sizeMB: 1812.0,
    createdAt: '2026-08-06 03:00:00',
    scope: 'full',
    compression: 'Zstandard (.zst)',
    status: 'completed',
    path: '/var/backups/minecraft/snapshots/mc_backup_full_2026-08-06_0300.tar.zst'
  },
  {
    id: 'snap-101',
    fileName: 'mc_backup_plugins_2026-08-03_0000.tar.gz',
    sizeMB: 48.4,
    createdAt: '2026-08-03 00:00:00',
    scope: 'plugins_configs',
    compression: 'Gzip',
    status: 'completed',
    path: '/var/backups/minecraft/configs_weekly/mc_backup_plugins_2026-08-03_0000.tar.gz'
  }
];
