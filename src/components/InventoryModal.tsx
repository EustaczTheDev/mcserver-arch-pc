import React from 'react';
import { Eye, X, Package, Shield, Trash2, Gift } from 'lucide-react';
import { Player, InventoryItem } from '../types';

interface InventoryModalProps {
  player: Player | null;
  onClose: () => void;
  onClearSlot: (slot: number) => void;
  darkMode: boolean;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  player,
  onClose,
  onClearSlot,
  darkMode,
}) => {
  if (!player) return null;

  const inventory = player.inventory || [];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs font-mono text-xs">
      <div className={`w-full max-w-xl p-5 rounded-xl border shadow-2xl space-y-4 ${
        darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <img
              src={player.skinUrl || `https://mc-heads.net/avatar/${player.username}/32`}
              alt={player.username}
              className="w-8 h-8 rounded border border-slate-700 bg-slate-950"
            />
            <div>
              <h3 className="font-bold text-sm text-slate-100">{player.username}'s Inventory Inspector</h3>
              <p className="text-[11px] text-slate-400">Live inventory memory dump from Arch Linux server</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hotbar / Inventory Grid */}
        <div className="space-y-3">
          <span className="text-slate-400 block font-semibold text-[11px]">Hotbar & Main Slots (0-8):</span>
          
          <div className="grid grid-cols-9 gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            {Array.from({ length: 9 }).map((_, slotIdx) => {
              const item = inventory.find(i => i.slot === slotIdx);
              return (
                <div
                  key={slotIdx}
                  className={`aspect-square rounded-lg border flex flex-col items-center justify-center relative p-1 group transition-colors ${
                    item ? 'bg-slate-900 border-cyan-500/40 text-slate-100' : 'bg-slate-950/50 border-slate-800/80 text-slate-700'
                  }`}
                >
                  {item ? (
                    <>
                      <span className="text-lg">{item.icon}</span>
                      <span className="absolute bottom-0.5 right-1 text-[10px] font-bold text-cyan-300">{item.count}</span>
                      
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full mb-1 hidden group-hover:block bg-slate-900 border border-slate-700 p-2 rounded shadow-xl z-20 text-[10px] w-32 text-center pointer-events-none">
                        <span className="font-bold text-cyan-300 block">{item.name}</span>
                        <span className="text-slate-400 text-[9px]">{item.id}</span>
                      </div>

                      <button
                        onClick={() => onClearSlot(slotIdx)}
                        title="Clear Item Slot"
                        className="absolute top-0.5 right-0.5 hidden group-hover:block p-0.5 rounded bg-rose-600 text-white"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </>
                  ) : (
                    <span className="text-[9px] text-slate-700">{slotIdx}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 font-medium"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
