export type ServerStatus = 'online' | 'starting' | 'stopping' | 'offline';

export interface ServerMetrics {
  cpuUsage: number; // percentage
  ramUsedGB: number;
  ramTotalGB: number;
  diskUsedGB: number;
  diskTotalGB: number;
  tps: number; // Max 20.0
  mspt: number; // Milliseconds per tick
  networkRxKBps: number;
  networkTxKBps: number;
  onlinePlayers: number;
  maxPlayers: number;
  chunksLoaded: number;
  entitiesLoaded: number;
  uptimeSeconds: number;
  history: {
    timestamp: string;
    cpu: number; // %
    ram: number; // GB
    tps: number; // TPS
    mspt: number; // ms
    players: number; // count
  }[];
}

export type Dimension = 'world' | 'world_nether' | 'world_the_end';

export interface InventoryItem {
  slot: number;
  id: string;
  name: string;
  count: number;
  icon: string;
  durability?: number;
  maxDurability?: number;
}

export interface Player {
  uuid: string;
  username: string;
  ping: number;
  health: number; // 0-20
  food: number; // 0-20
  gamemode: 'survival' | 'creative' | 'adventure' | 'spectator';
  dimension: Dimension;
  coords: { x: number; y: number; z: number };
  isOp: boolean;
  isWhitelisted: boolean;
  isBanned: boolean;
  joinedAt: string;
  playtimeHours: number;
  ipAddress: string;
  skinUrl?: string;
  inventory?: InventoryItem[];
}

export interface BannedPlayer {
  uuid: string;
  username: string;
  ip: string;
  reason: string;
  bannedBy: string;
  bannedAt: string;
  expiresAt: string; // 'Permanent' or date string
}

export interface LogMessage {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  source: string; // e.g. 'Server thread', 'Paper/Spigot', 'EssentialsX'
  text: string;
}

export interface FileItem {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  size: number; // bytes
  updatedAt: string;
  permissions: string; // e.g. '-rw-r--r--'
  extension?: string;
  content?: string;
  children?: FileItem[];
}

export interface PluginItem {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  category: 'Essentials' | 'Security' | 'Economy' | 'Performance' | 'World' | 'Utility';
  fileName: string;
  fileSizeMB: number;
  enabled: boolean;
  updateAvailable?: boolean;
  installedVersion?: string;
  configFilePath?: string;
  downloadsCount: number;
  isInstalled: boolean;
  dependencies?: string[];
}

export interface BackupSchedule {
  id: string;
  name: string;
  cronExpression: string; // e.g., '0 */6 * * *'
  frequencyLabel: string; // e.g., 'Every 6 hours'
  scope: 'full' | 'world_only' | 'plugins_configs' | 'playerdata';
  retentionDays: number;
  compression: 'zstd' | 'gzip' | 'tar.xz';
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
  destination: string;
}

export interface BackupSnapshot {
  id: string;
  fileName: string;
  sizeMB: number;
  createdAt: string;
  scope: 'full' | 'world_only' | 'plugins_configs' | 'playerdata';
  compression: string;
  status: 'completed' | 'in_progress' | 'failed';
  downloadUrl?: string;
  path: string;
}

export interface ServerProfile {
  id: string;
  name: string;
  archHost: string;
  sshPort: number;
  sshUser: string;
  sshAuthType: 'password' | 'private_key';
  rconPort: number;
  rconPassword?: string;
  serverDir: string;
  systemdService: string;
  customStartCommand?: string;
  usePort?: boolean; // General port enable/disable flag
  useSshPort?: boolean; // When false, connects SSH using IP only
  useRconPort?: boolean; // When false, connects RCON using IP only
  javaMaxRamGB: number;
  paperVersion: string;
  archKernel: string;
  isCurrent: boolean;
}

export type ActiveTab = 
  | 'dashboard'
  | 'console'
  | 'players'
  | 'files'
  | 'plugins'
  | 'backups'
  | 'settings';
