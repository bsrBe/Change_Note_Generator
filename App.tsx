import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import CodeInput from './components/CodeInput';
import ResultDisplay from './components/ResultDisplay';
import Button from './components/Button';
import Loader from './components/Loader';
import { generateChangeNotes } from './services/geminiService';
import HistorySidebar from './components/HistorySidebar';
import { DownloadIcon } from './components/icons/DownloadIcon';

export interface HistoryEntry {
  id: string;
  timestamp: string;
  filename: string;
  beforeCode: string;
  afterCode: string;
  changeNotes: string;
}

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [filename, setFilename] = useState<string>('');
  const [beforeCode, setBeforeCode] = useState<string>('');
  const [afterCode, setAfterCode] = useState<string>('');
  const [changeNotes, setChangeNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('codeReviewHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
      setHistory([]);
    }
  }, []);

  const saveHistory = (newHistory: HistoryEntry[]) => {
    setHistory(newHistory);
    localStorage.setItem('codeReviewHistory', JSON.stringify(newHistory));
  };

  const handleGenerate = useCallback(async () => {
    if (!apiKey || !filename || !beforeCode || !afterCode) {
      setError('All fields (API Key, Filename, Before Code, and After Code) are required.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setChangeNotes('');

    try {
      const notes = await generateChangeNotes(apiKey, filename, beforeCode, afterCode);
      setChangeNotes(notes);

      const newEntry: HistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        filename,
        beforeCode,
        afterCode,
        changeNotes: notes,
      };

      const updatedHistory = [newEntry, ...history];
      saveHistory(updatedHistory);
      setActiveHistoryId(newEntry.id);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, filename, beforeCode, afterCode, history]);

  const handleSelectHistory = (id: string) => {
    const entry = history.find(item => item.id === id);
    if (entry) {
      setFilename(entry.filename);
      setBeforeCode(entry.beforeCode);
      setAfterCode(entry.afterCode);
      setChangeNotes(entry.changeNotes);
      setActiveHistoryId(id);
      setError(null);
    }
  };

  const handleClearHistory = () => {
    saveHistory([]);
    setFilename('');
    setBeforeCode('');
    setAfterCode('');
    setChangeNotes('');
    setActiveHistoryId(null);
  };

  const handleDownloadNotes = () => {
    if (!changeNotes || !filename) return;

    // Sanitize filename for download
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const downloadFilename = `${sanitizedFilename}.md`;

    const blob = new Blob([changeNotes], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  const isButtonDisabled = !apiKey || !filename || !beforeCode || !afterCode || isLoading;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <Header />
      <div className="flex-grow grid grid-cols-1 md:grid-cols-[300px_1fr] h-[calc(100vh-105px)]">
        <HistorySidebar
            history={history}
            activeId={activeHistoryId}
            onSelect={handleSelectHistory}
            onClear={handleClearHistory}
        />
        <main className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-y-auto">
          {/* Input Section */}
          <div className="flex flex-col gap-6">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-slate-400 mb-2">
                Gemini API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API Key"
                className="w-full bg-slate-800 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              />
            </div>
            <div>
              <label htmlFor="filename" className="block text-sm font-medium text-slate-400 mb-2">
                File Name
              </label>
              <input
                type="text"
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="e.g., src/components/Button.tsx"
                className="w-full bg-slate-800 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
              <CodeInput
                title="Before Code"
                value={beforeCode}
                onChange={setBeforeCode}
                placeholder="Paste the original code here..."
              />
              <CodeInput
                title="After Code"
                value={afterCode}
                onChange={setAfterCode}
                placeholder="Paste the modified code here..."
              />
            </div>
            {error && <div className="text-red-400 bg-red-900/50 border border-red-700 p-3 rounded-md text-sm">{error}</div>}
            <Button onClick={handleGenerate} disabled={isButtonDisabled}>
              {isLoading ? 'Generating...' : 'Generate Notes'}
            </Button>
          </div>

          {/* Output Section */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-sky-400">Generated Change Notes</h2>
              <button
                onClick={handleDownloadNotes}
                disabled={!changeNotes || isLoading}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
                title="Download as Markdown"
                aria-label="Download notes as markdown"
              >
                <DownloadIcon className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
            <div className="p-6 flex-grow overflow-y-auto relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
                  <Loader />
                </div>
              ) : (
                <ResultDisplay notes={changeNotes} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;