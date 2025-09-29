import React from 'react';
import { CodeIcon } from './icons/CodeIcon';

const Header: React.FC = () => {
  return (
    <header className="p-4 md:p-6 text-center border-b border-slate-800 bg-slate-900/70 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center justify-center gap-4">
        <CodeIcon className="h-10 w-10 text-sky-400" />
        <h1 className="text-2xl md:text-4xl font-bold text-slate-100 tracking-tight">
          Gemini Code Review Notes
        </h1>
      </div>
      <p className="mt-2 text-md md:text-lg text-slate-400">
        Automatically generate detailed change notes from code diffs.
      </p>
    </header>
  );
};

export default Header;
