import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, FileText, Mail, Database, Settings, ArrowRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl bg-[#0c0c0e] border border-zinc-800 rounded-xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-800 relative z-10">
              <Search className="text-zinc-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search integrations, workflows, or templates..."
                className="w-full bg-transparent text-white text-base placeholder:text-zinc-500 focus:outline-none font-medium"
                autoFocus
              />
              <kbd className="font-mono text-[10px] text-zinc-500 px-1.5 py-0.5 bg-zinc-900 rounded border border-zinc-800 hidden sm:block">
                ESC
              </kbd>
            </div>

            {/* Content */}
            <div className="p-2 overflow-y-auto max-h-[50vh] relative z-10 custom-scrollbar">
              {/* AI Templates Group */}
              <div className="px-2 py-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-2 mb-2 block">
                  AI Automations
                </span>

                <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#2563eb]/10 hover:text-[#3b82f6] group transition-colors text-zinc-300 text-left">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-[#3b82f6] w-5 h-5" />
                    <span className="text-sm font-medium">Generate pipeline from prompt</span>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-800/60 group transition-colors text-zinc-300 text-left mt-1">
                  <div className="flex items-center gap-3">
                    <FileText className="text-zinc-400 w-5 h-5 group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium">Extract invoice data to Stripe</span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 border border-zinc-700 rounded px-1.5 py-0.5 uppercase tracking-widest">
                    Template
                  </span>
                </button>

                <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-800/60 group transition-colors text-zinc-300 text-left mt-1">
                  <div className="flex items-center gap-3">
                    <Mail className="text-zinc-400 w-5 h-5 group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium">Categorize support tickets via OpenAI</span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 border border-zinc-700 rounded px-1.5 py-0.5 uppercase tracking-widest">
                    Template
                  </span>
                </button>
              </div>

              {/* Integrations Group */}
              <div className="px-2 py-2 mt-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-2 mb-2 block">
                  Quick Actions
                </span>

                <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-800/60 group transition-colors text-zinc-300 text-left">
                  <div className="flex items-center gap-3">
                    <Database className="text-zinc-400 w-5 h-5 group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium">Connect new database</span>
                  </div>
                </button>

                <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-800/60 group transition-colors text-zinc-300 text-left mt-1">
                  <div className="flex items-center gap-3">
                    <Settings className="text-zinc-400 w-5 h-5 group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium">System configuration</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-zinc-800 bg-zinc-900/30 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4 hidden sm:flex">
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <span className="text-[10px] font-medium">↑↓ to navigate</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <span className="text-[10px] font-medium">↵ to select</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  FlowForge Engine
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
