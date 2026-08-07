import React from 'react';
import { 
  Users, 
  ShieldAlert, 
  UserCheck, 
  UserX, 
  Shield, 
  Crown, 
  Heart, 
  MapPin, 
  Compass, 
  Package, 
  Ban, 
  Search, 
  Plus, 
  Trash2, 
  Key, 
  Crosshair, 
  Gift, 
  Eye, 
  Award,
  Wifi
} from 'lucide-react';
import { Player, BannedPlayer } from '../types';

interface PlayerManagerViewProps {
  players: Player[];
  bannedPlayers: BannedPlayer[];
  onKickPlayer: (username: string, reason: string) => void;
  onBanPlayer: (username: string, reason: string) => void;
  onUnbanPlayer: (username: string) => void;
  onToggleOp: (uuid: string) => void;
  onToggleWhitelist: (uuid: string) => void;
  onInspectInventory: (player: Player) => void;
  onGiveItemModal: (player: Player) => void;
  darkMode: boolean;
}

export const PlayerManagerView: React.FC<PlayerManagerViewProps> = ({
  players,
  bannedPlayers,
  onKickPlayer,
  onBanPlayer,
  onUnbanPlayer,
  onToggleOp,
  onToggleWhitelist,
  onInspectInventory,
  onGiveItemModal,
  darkMode,
}) => {
  const [activeSubTab, setActiveSubTab] = React.useState<'online' | 'bans' | 'whitelist' | 'analytics'>('online');
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Kick/Ban Modal states
  const [targetPlayer, setTargetPlayer] = React.useState<Player | null>(null);
  const [actionType, setActionType] = React.useState<'kick' | 'ban' | null>(null);
  const [actionReason, setActionReason] = React.useState('');

  const [newWhitelistUser, setNewWhitelistUser] = React.useState('');

  const filteredOnline = players.filter(p => 
    p.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.uuid.includes(searchTerm) ||
    p.ipAddress.includes(searchTerm)
  );

  const filteredBans = bannedPlayers.filter(b => 
    b.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPlayer) return;

    if (actionType === 'kick') {
      onKickPlayer(targetPlayer.username, actionReason || 'Kicked by administrator');
    } else if (actionType === 'ban') {
      onBanPlayer(targetPlayer.username, actionReason || 'Banned by administrator');
    }

    setTargetPlayer(null);
    setActionType(null);
    setActionReason('');
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto custom-scrollbar">
      {/* Top Header & Sub-tab navigation */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-100 flex items-center space-x-2">
              <span>Player Management Suite</span>
              <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {players.length} Connected
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live moderation, permissions, inventory inspector, and banlist control
            </p>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('online')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'online' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Online ({players.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('bans')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'bans' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Bans ({bannedPlayers.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('whitelist')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'whitelist' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Whitelist</span>
          </button>

          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'analytics' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Leaderboards</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by player name, UUID, or IP address..."
          className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono shadow-sm"
        />
      </div>

      {/* TAB 1: Connected Online Players */}
      {activeSubTab === 'online' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOnline.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500 font-mono">
              No online players matching "{searchTerm}".
            </div>
          ) : (
            filteredOnline.map((player) => (
              <div 
                key={player.uuid}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all hover:border-slate-700 shadow-md ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                {/* Avatar & Header Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={player.skinUrl || `https://mc-heads.net/avatar/${player.username}/64`}
                      alt={player.username}
                      className="w-11 h-11 rounded-lg border border-slate-700 bg-slate-950 p-0.5 shadow-sm shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/Steve/64';
                      }}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-100 font-mono">
                          {player.username}
                        </span>
                        {player.isOp && (
                          <span title="Server Operator (OP)" className="p-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                            <Crown className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {player.ipAddress} • {player.ping}ms
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full uppercase font-semibold ${
                    player.gamemode === 'survival' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                  }`}>
                    {player.gamemode}
                  </span>
                </div>

                {/* Health & Food Bars + Location */}
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>Health:</span>
                    </span>
                    <span className="text-slate-200 font-semibold">{player.health} / 20</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Compass className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Dimension:</span>
                    </span>
                    <span className="text-cyan-400 capitalize">{player.dimension.replace('world_', '')}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                    <span>Coordinates:</span>
                    <span className="text-slate-200 font-medium">X: {player.coords.x}, Y: {player.coords.y}, Z: {player.coords.z}</span>
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-medium pt-1">
                  <button
                    onClick={() => onInspectInventory(player)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inventory</span>
                  </button>

                  <button
                    onClick={() => onGiveItemModal(player)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Give Item</span>
                  </button>

                  <button
                    onClick={() => onToggleOp(player.uuid)}
                    className={`px-2.5 py-1.5 rounded-lg border flex items-center justify-center space-x-1.5 transition-colors ${
                      player.isOp 
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' 
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>{player.isOp ? 'De-OP' : 'Grant OP'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setTargetPlayer(player);
                      setActionType('kick');
                      setActionReason('');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Kick</span>
                  </button>

                  <button
                    onClick={() => {
                      setTargetPlayer(player);
                      setActionType('ban');
                      setActionReason('');
                    }}
                    className="col-span-2 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Ban Player (Permanent/IP)</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Ban List */}
      {activeSubTab === 'bans' && (
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="p-3">Player / IP</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Banned By</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBans.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No banned players found in `banned-players.json`.
                    </td>
                  </tr>
                ) : (
                  filteredBans.map(ban => (
                    <tr key={ban.uuid} className="hover:bg-slate-800/40">
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <img
                            src={`https://mc-heads.net/avatar/${ban.username}/32`}
                            alt={ban.username}
                            className="w-7 h-7 rounded border border-slate-700 bg-slate-950"
                          />
                          <div>
                            <span className="font-bold text-slate-200 block">{ban.username}</span>
                            <span className="text-[10px] text-slate-500">{ban.ip}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-slate-300 max-w-xs truncate">{ban.reason}</td>
                      <td className="p-3 text-cyan-400">{ban.bannedBy}</td>
                      <td className="p-3 text-slate-400">{ban.bannedAt}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onUnbanPlayer(ban.username)}
                          className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        >
                          Unban
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Whitelist */}
      {activeSubTab === 'whitelist' && (
        <div className={`p-5 rounded-xl border space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-semibold text-sm text-slate-100 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Enforce Whitelist (`whitelist.json`)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Only players added to the whitelist can log into the Arch Linux Minecraft server.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newWhitelistUser}
                onChange={(e) => setNewWhitelistUser(e.target.value)}
                placeholder="Username e.g., CraftMaster"
                className="px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <button
                onClick={() => {
                  if (newWhitelistUser.trim()) {
                    setNewWhitelistUser('');
                  }
                }}
                className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Whitelist</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {players.map(p => (
              <div key={p.uuid} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={p.skinUrl || `https://mc-heads.net/avatar/${p.username}/32`}
                    alt={p.username}
                    className="w-7 h-7 rounded border border-slate-700"
                  />
                  <div>
                    <span className="font-bold text-slate-200 block">{p.username}</span>
                    <span className="text-[10px] text-slate-500">{p.isWhitelisted ? 'Whitelisted' : 'Not Whitelisted'}</span>
                  </div>
                </div>

                <button
                  onClick={() => onToggleWhitelist(p.uuid)}
                  className={`px-2 py-1 text-[11px] rounded border ${
                    p.isWhitelisted 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {p.isWhitelisted ? 'Whitelisted' : 'Grant Access'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Playtime Analytics Leaderboard */}
      {activeSubTab === 'analytics' && (
        <div className={`p-5 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className="font-semibold text-sm text-slate-100 mb-4 flex items-center space-x-2">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Playtime Leaderboard & Activity</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {players.sort((a,b) => b.playtimeHours - a.playtimeHours).map((player, idx) => (
              <div key={player.uuid} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs ${
                    idx === 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    idx === 1 ? 'bg-slate-400/20 text-slate-300 border border-slate-400/40' :
                    idx === 2 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/40' : 'text-slate-500'
                  }`}>
                    #{idx + 1}
                  </span>
                  <img
                    src={`https://mc-heads.net/avatar/${player.username}/32`}
                    alt={player.username}
                    className="w-8 h-8 rounded border border-slate-700"
                  />
                  <div>
                    <span className="font-bold text-slate-200 block">{player.username}</span>
                    <span className="text-[10px] text-slate-500">Joined: {player.joinedAt}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-cyan-400 text-sm block">{player.playtimeHours} hrs</span>
                  <span className="text-[10px] text-slate-500">Total Playtime</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kick/Ban Confirmation Modal */}
      {actionType && targetPlayer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className={`w-full max-w-md p-5 rounded-xl border shadow-xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <h3 className="text-base font-semibold mb-1 flex items-center space-x-2 text-rose-400">
              <Ban className="w-5 h-5" />
              <span>{actionType === 'kick' ? 'Kick Player' : 'Ban Player'} from Server</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Target player: <strong className="text-slate-200 font-mono">{targetPlayer.username}</strong> ({targetPlayer.ipAddress})
            </p>

            <form onSubmit={handleConfirmAction} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Reason for {actionType}:</label>
                <input
                  type="text"
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="e.g. Griefing spawn area, disrespectful behavior..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
                  autoFocus
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTargetPlayer(null);
                    setActionType(null);
                  }}
                  className="px-3.5 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 text-xs rounded-lg text-white font-medium ${
                    actionType === 'ban' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-amber-600 hover:bg-amber-500'
                  }`}
                >
                  Confirm {actionType === 'kick' ? 'Kick' : 'Ban'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
