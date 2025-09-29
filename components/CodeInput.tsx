import React from 'react';

interface CodeInputProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const CodeInput: React.FC<CodeInputProps> = ({ title, value, onChange, placeholder }) => {
  return (
    <div className="flex flex-col h-full">
      <label className="block text-md font-semibold text-slate-300 mb-2">{title}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-grow w-full bg-slate-950/70 border border-slate-700 rounded-lg shadow-inner py-3 px-4 font-mono text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition resize-none"
        spellCheck="false"
      />
    </div>
  );
};

export default CodeInput;
