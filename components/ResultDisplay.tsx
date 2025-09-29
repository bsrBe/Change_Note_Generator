import React from 'react';

interface ResultDisplayProps {
  notes: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ notes }) => {
  if (!notes) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500">Your generated notes will appear here.</p>
      </div>
    );
  }

  // Basic markdown-to-HTML conversion for presentation
  const formattedNotes = notes
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-sky-300">$1</strong>') // Bold
    .replace(/`(.*?)`/g, '<code class="bg-slate-700 text-amber-300 rounded px-1 py-0.5 text-sm">$1</code>') // Inline code
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-2 text-slate-200">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-3 border-b border-slate-700 pb-2 text-slate-100">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-4 mb-4 text-white">$1</h1>')
    .replace(/^\* (.*$)/gim, '<li class="ml-6 mb-2">$1</li>') // List items
    .replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc pl-5">$1</ul>') // Wrap LIs in UL
    .replace(/\n/g, '<br />'); // Newlines

  return (
    <div
      className="prose prose-invert prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: formattedNotes }}
    />
  );
};

export default ResultDisplay;
