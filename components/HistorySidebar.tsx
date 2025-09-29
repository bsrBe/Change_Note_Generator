import React from 'react';
import type { HistoryEntry } from '../App';
import { HistoryIcon } from './icons/HistoryIcon';
import { TrashIcon } from './icons/TrashIcon';

interface HistorySidebarProps {
  history: HistoryEntry[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClear: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, activeId, onSelect, onClear }) => {
  return (
    <aside className="bg-slate-950/60 border-r border-slate-800 flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <HistoryIcon className="h-6 w-6 text-sky-400" />
          <h2 className="text-lg font-semibold text-slate-200">History</h2>
        </div>
        <button
          onClick={onClear}
          disabled={history.length === 0}
          className="p-1 text-slate-400 hover:text-red-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
          title="Clear History"
          aria-label="Clear History"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {history.length === 0 ? (
          <p className="p-4 text-sm text-slate-500">No history yet.</p>
        ) : (
          <ul>
            {history.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item.id)}
                  className={`w-full text-left p-3 border-b border-slate-800/50 text-sm transition-colors ${
                    activeId === item.id
                      ? 'bg-sky-800/30 text-sky-300'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  <p className="font-medium text-slate-300 truncate">{item.filename}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default HistorySidebar;
