import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import CodeInput from './components/CodeInput';
import ResultDisplay from './components/ResultDisplay';
import Button from './components/Button';
import Loader from './components/Loader';
import { generateChangeNotes } from './services/geminiService';

const App: React.FC = () => {
  const [filename, setFilename] = useState<string>('');
  const [beforeCode, setBeforeCode] = useState<string>('');
  const [afterCode, setAfterCode] = useState<string>('');
  const [changeNotes, setChangeNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!filename || !beforeCode || !afterCode) {
      setError('All fields (Filename, Before Code, and After Code) are required.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setChangeNotes('');

    try {
      const notes = await generateChangeNotes(filename, beforeCode, afterCode);
      setChangeNotes(notes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [filename, beforeCode, afterCode]);

  const isButtonDisabled = !filename || !beforeCode || !afterCode || isLoading;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <Header />
      <main className="flex-grow p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="flex flex-col gap-6">
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
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-sky-400">Generated Change Notes</h2>
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
  );
};

export default App;
