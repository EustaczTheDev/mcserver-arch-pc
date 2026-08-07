import React from 'react';
import { Gift, X, CheckCircle2 } from 'lucide-react';
import { Player } from '../types';

interface GiveItemModalProps {
  player: Player | null;
  onClose: () => void;
  onGiveItem: (itemKey: string, count: number) => void;
  darkMode: boolean;
}

const COMMON_ITEMS = [
  { id: 'diamond', name: 'Diamond', icon: '💎' },
  { id: 'netherite_ingot', name: 'Netherite Ingot', icon: '⬛' },
  { id: 'golden_apple', name: 'Enchanted Golden Apple', icon: '🍎' },
  { id: 'elytra', name: 'Elytra', icon: '🪽' },
  { id: 'cooked_beef', name: 'Steak (64)', icon: '🥩' },
  { id: 'totem_of_undying', name: 'Totem of Undying', icon: '🛡️' },
  { id: 'experience_bottle', name: 'Bottle o\' Enchanting', icon: '🧪' },
  { id: 'command_block', name: 'Command Block', icon: '📦' },
];

export const GiveItemModal: React.FC<GiveItemModalProps> = ({
  player,
  onClose,
  onGiveItem,
  darkMode,
}) => {
  if (!player) return null;

  const [selectedItem, setSelectedItem] = React.useState('diamond');
  const [itemCount, setItemCount] = React.useState(64);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGiveItem(selectedItem, itemCount);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs font-mono text-xs">
      <div className={`w-full max-w-md p-5 rounded-xl border shadow-2xl space-y-4 ${
        darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Gift className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-slate-100">Give Item to {player.username}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 mb-1">Quick Select Item:</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
              {COMMON_ITEMS.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItem(item.id)}
                  className={`p-2 rounded-lg border flex items-center space-x-2 text-left transition-colors ${
                    selectedItem === item.id 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="text-[11px] truncate">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Minecraft Item ID:</label>
            <input
              type="text"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Quantity / Stack Count:</label>
            <input
              type="number"
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value))}
              min={1}
              max={64}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center space-x-1"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Exec `/give` Command</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
