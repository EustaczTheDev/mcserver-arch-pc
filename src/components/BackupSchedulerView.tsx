import React from 'react';
import { 
  Archive, 
  Clock, 
  Calendar, 
  Plus, 
  Play, 
  Download, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  HardDrive, 
  FolderArchive,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { BackupSchedule, BackupSnapshot } from '../types';

interface BackupSchedulerViewProps {
  schedules: BackupSchedule[];
  snapshots: BackupSnapshot[];
  onCreateSchedule: (schedule: Omit<BackupSchedule, 'id'>) => void;
  onToggleSchedule: (scheduleId: string) => void;
  onTriggerInstantBackup: () => void;
  onRestoreSnapshot: (snapshot: BackupSnapshot) => void;
  onDeleteSnapshot: (snapshotId: string) => void;
  darkMode: boolean;
}

export const BackupSchedulerView: React.FC<BackupSchedulerViewProps> = ({
  schedules,
  snapshots,
  onCreateSchedule,
  onToggleSchedule,
  onTriggerInstantBackup,
  onRestoreSnapshot,
  onDeleteSnapshot,
  darkMode,
}) => {
  const [activeTab, setActiveTab] = React.useState<'snapshots' | 'schedules'>('snapshots');
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [restoringSnapshot, setRestoringSnapshot] = React.useState<BackupSnapshot | null>(null);

  // New Schedule form
  const [newScheduleName, setNewScheduleName] = React.useState('');
  const [newScheduleCron, setNewScheduleCron] = React.useState('0 */6 * * *');
  const [newScheduleLabel, setNewScheduleLabel] = React.useState('Every 6 hours');
  const [newScheduleScope, setNewScheduleScope] = React.useState<'full' | 'world_only' | 'plugins_configs'>('full');
  const [newScheduleRetention, setNewScheduleRetention] = React.useState(14);
  const [newScheduleCompression, setNewScheduleCompression] = React.useState<'zstd' | 'gzip' | 'tar.xz'>('zstd');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleName.trim()) return;

    onCreateSchedule({
      name: newScheduleName,
      cronExpression: newScheduleCron,
      frequencyLabel: newScheduleLabel,
      scope: newScheduleScope,
      retentionDays: newScheduleRetention,
      compression: newScheduleCompression,
      enabled: true,
      lastRun: 'Just now',
      nextRun: 'Scheduled',
      destination: '/var/backups/minecraft/snapshots/',
    });

    setNewScheduleName('');
    setShowCreateModal(false);
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto custom-scrollbar">
      {/* Header & Subtabs */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-100 flex items-center space-x-2">
              <span>Automated Backup Engine</span>
              <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Arch Linux tar.zst
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Cron-based background snapshots, retention cleanup & 1-click restore
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onTriggerInstantBackup}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-600 hover:bg-amber-500 text-white flex items-center space-x-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Instant Snapshot Now</span>
          </button>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('snapshots')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'snapshots' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Snapshots ({snapshots.length})
            </button>

            <button
              onClick={() => setActiveTab('schedules')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'schedules' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cron Schedules ({schedules.length})
            </button>
          </div>
        </div>
      </div>

      {/* SUBTAB 1: Snapshots List */}
      {activeTab === 'snapshots' && (
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="p-3">Archive File</th>
                  <th className="p-3">Scope</th>
                  <th className="p-3">Compression</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Created Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {snapshots.map(snap => (
                  <tr key={snap.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-200 flex items-center space-x-2">
                      <FolderArchive className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{snap.fileName}</span>
                    </td>
                    <td className="p-3 text-cyan-400 uppercase font-bold text-[11px]">{snap.scope}</td>
                    <td className="p-3 text-slate-400">{snap.compression}</td>
                    <td className="p-3 text-amber-300 font-bold">{snap.sizeMB.toFixed(1)} MB</td>
                    <td className="p-3 text-slate-400">{snap.createdAt}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setRestoringSnapshot(snap)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore</span>
                        </button>

                        <button
                          onClick={() => onDeleteSnapshot(snap.id)}
                          className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Cron Schedules */}
      {activeTab === 'schedules' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-medium flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Cron Schedule</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
            {schedules.map(sched => (
              <div 
                key={sched.id}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">{sched.name}</h3>
                      <span className="text-[11px] text-cyan-400">{sched.cronExpression} • {sched.frequencyLabel}</span>
                    </div>

                    <button
                      onClick={() => onToggleSchedule(sched.id)}
                      className="p-1 text-amber-400"
                    >
                      {sched.enabled ? <ToggleRight className="w-6 h-6 text-amber-400" /> : <ToggleLeft className="w-6 h-6 text-slate-600" />}
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs space-y-1.5 mt-3">
                    <div className="flex justify-between text-slate-400">
                      <span>Scope:</span>
                      <span className="text-slate-200 uppercase font-bold">{sched.scope}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Retention Rule:</span>
                      <span className="text-amber-400">{sched.retentionDays} Days</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Format:</span>
                      <span className="text-slate-300 uppercase">{sched.compression}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
                  <span>Last run: {sched.lastRun || 'Never'}</span>
                  <span className="text-emerald-400">Next: {sched.nextRun}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Restore Snapshot Warning Modal */}
      {restoringSnapshot && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className={`w-full max-w-md p-5 rounded-xl border shadow-xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <h3 className="text-base font-semibold mb-2 flex items-center space-x-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Server Snapshot Restore</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed font-mono mb-4">
              Restoring <strong className="text-amber-400">{restoringSnapshot.fileName}</strong> will temporarily stop <code className="text-emerald-400">minecraft.service</code> on Arch Linux, overwrite current world files, and restart the server.
            </p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setRestoringSnapshot(null)}
                className="px-3.5 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-mono"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onRestoreSnapshot(restoringSnapshot);
                  setRestoringSnapshot(null);
                }}
                className="px-4 py-1.5 text-xs rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium font-mono"
              >
                Confirm Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Schedule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs font-mono text-xs">
          <div className={`w-full max-w-md p-5 rounded-xl border shadow-xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <h3 className="text-base font-semibold mb-3 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Create Automated Cron Backup Schedule</span>
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-slate-400 mb-1">Schedule Name:</label>
                <input
                  type="text"
                  value={newScheduleName}
                  onChange={(e) => setNewScheduleName(e.target.value)}
                  placeholder="e.g. Midnight Full World Backup"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Cron Expression:</label>
                  <input
                    type="text"
                    value={newScheduleCron}
                    onChange={(e) => setNewScheduleCron(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Frequency Label:</label>
                  <input
                    type="text"
                    value={newScheduleLabel}
                    onChange={(e) => setNewScheduleLabel(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Backup Scope:</label>
                <select 
                  value={newScheduleScope}
                  onChange={(e) => setNewScheduleScope(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                >
                  <option value="full">Full Server (/opt/minecraft/server)</option>
                  <option value="world_only">World Folders Only (/world)</option>
                  <option value="plugins_configs">Plugins & Config Files Only</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
