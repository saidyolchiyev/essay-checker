import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  RotateCcw, 
  Award,
  AlertCircle,
  Target,
  BookOpen,
  Wand2,
  BookMarked,
  LayoutList
} from 'lucide-react';

export const EssayChecker = () => {
  const [topicPrompt, setTopicPrompt] = useState('');
  const [essayText, setEssayText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('mistakes'); // 'mistakes' | 'refinements' | 'diff'
  const [copied, setCopied] = useState(false);

  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;

  const handleEvaluate = async () => {
    if (!topicPrompt.trim()) {
      setError('Please provide the essay topic or prompt.');
      return;
    }

    if (!essayText.trim() || essayText.trim().length < 20) {
      setError('The essay text must contain at least 20 characters.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    try {
      const response = await fetch(`${API_BASE_URL}/api/essay/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicPrompt, essayText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred during evaluation.');
      }

      setResult(data);
      setActiveTab('mistakes');
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to connect to the evaluation server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTopicPrompt('');
    setEssayText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-zinc-800/80 pb-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-white">DİM Essay Checker</h1>
            </div>
          </div>
          
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-900 border border-zinc-800 text-indigo-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 animate-pulse" />
            Max Score: 16.5
          </span>
        </header>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Inputs */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-5">
              
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                  <button onClick={() => setError(null)} className="text-rose-400 font-bold ml-2">✕</button>
                </div>
              )}

              {/* Topic Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-indigo-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  Essay Topic / Prompt
                </label>
                <input
                  type="text"
                  value={topicPrompt}
                  onChange={(e) => setTopicPrompt(e.target.value)}
                  placeholder="e.g., Can fictional characters be good role models for teenagers?"
                  className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              {/* Essay Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300 tracking-wider uppercase flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-zinc-400" />
                    Essay Text
                  </label>
                  <span className="text-[11px] text-zinc-500">Requirement: 100+ words</span>
                </div>

                <div className="relative">
                  <textarea
                    rows={13}
                    value={essayText}
                    onChange={(e) => setEssayText(e.target.value)}
                    placeholder="Write or paste your essay here as a single continuous paragraph..."
                    className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none leading-relaxed"
                  />
                  
                  <div className="absolute bottom-3 right-3 flex items-center space-x-2 text-xs bg-zinc-900/90 px-3 py-1 rounded-md border border-zinc-800 shadow-sm">
                    <span className="text-zinc-400">Words:</span>
                    <span className={`font-semibold ${wordCount < 70 ? 'text-rose-400' : wordCount < 100 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {wordCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleReset}
                  disabled={!essayText && !topicPrompt && !result}
                  className="flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-zinc-200 disabled:opacity-40"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleEvaluate}
                  disabled={!essayText.trim() || !topicPrompt.trim() || isLoading}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-500/25 disabled:opacity-50 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Evaluating Essay...</span>
                    </>
                  ) : (
                    <>
                      <span>Evaluate Essay</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* Right Panel: Results */}
          <div className="lg:col-span-7 space-y-6">
            {!result ? (
              <div className="bg-zinc-900/30 border border-zinc-800/60 border-dashed rounded-2xl p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                  <Award className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-zinc-300">Ready for Evaluation</h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Enter the topic prompt and essay submission to generate a detailed DİM criteria breakdown.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* Score Summary Card */}
                <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                    <div>
                      <h2 className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">Final Scaled Score</h2>
                      <div className="flex items-baseline space-x-2 mt-1">
                        <span className="text-4xl font-extrabold tracking-tight text-white">{result.finalScore}</span>
                        <span className="text-sm text-zinc-500">/ 16.5 pts</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-zinc-400">Raw Criteria Total</span>
                      <div className="text-xl font-bold text-zinc-200 mt-0.5">{result.rawTotal} / 5.0</div>
                    </div>
                  </div>

                  {/* Criteria Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 text-center space-y-1">
                      <div className="text-[10px] text-zinc-400 font-medium">A: Task & Volume</div>
                      <div className="text-sm font-bold text-white">{result.rawScores.categoryA.score} / 1.0</div>
                    </div>

                    <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 text-center space-y-1">
                      <div className="text-[10px] text-zinc-400 font-medium">B: Topic & Logic</div>
                      <div className="text-sm font-bold text-white">{result.rawScores.categoryB.score} / 2.0</div>
                    </div>

                    <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 text-center space-y-1">
                      <div className="text-[10px] text-zinc-400 font-medium">C: Grammar</div>
                      <div className="text-sm font-bold text-white">{result.rawScores.categoryC.score} / 1.0</div>
                    </div>

                    <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 text-center space-y-1">
                      <div className="text-[10px] text-zinc-400 font-medium">D: Vocabulary</div>
                      <div className="text-sm font-bold text-white">{result.rawScores.categoryD.score} / 1.0</div>
                    </div>
                  </div>
                </div>

                {/* Analysis Navigation Tabs */}
                <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-5">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                    <div className="flex space-x-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                      <button
                        onClick={() => setActiveTab('mistakes')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                          activeTab === 'mistakes' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Grammar ({result.grammarMistakes.length})</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('refinements')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                          activeTab === 'refinements' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Refinements ({result.refinements?.length || 0})</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('diff')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                          activeTab === 'diff' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Model Response</span>
                      </button>
                    </div>

                    {activeTab === 'diff' && (
                      <button
                        onClick={() => handleCopy(result.improvedVersion)}
                        className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy Text'}</span>
                      </button>
                    )}
                  </div>

                  {/* TAB 1: Grammar Errors */}
                  {activeTab === 'mistakes' && (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-xl border flex items-start space-x-3 text-xs ${
                        result.isTopicRelevant 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                      }`}>
                        <Target className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold">
                            {result.isTopicRelevant ? 'Topic Relevance: Fully Relevant' : 'Warning: Off-Topic Submission'}
                          </div>
                          <div className="text-[11px] opacity-90 mt-1">{result.topicRelevanceFeedback}</div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        {result.grammarMistakes.length === 0 ? (
                          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>No grammatical errors detected. Excellent accuracy!</span>
                          </div>
                        ) : (
                          result.grammarMistakes.map((mistake, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-800 space-y-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                Grammar Error
                              </span>
                              <div className="text-xs space-y-1 font-mono">
                                <div className="line-through text-rose-300/80 bg-rose-500/10 px-2 py-1 rounded">
                                  {mistake.originalText}
                                </div>
                                <div className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                                  → {mistake.correction}
                                </div>
                              </div>
                              <p className="text-xs text-zinc-400 pt-1 leading-normal">
                                {mistake.explanation}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Vocabulary & Structure Refinements */}
                  {activeTab === 'refinements' && (
                    <div className="space-y-3">
                      {!result.refinements || result.refinements.length === 0 ? (
                        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span>Vocabulary range and structural flow are well-balanced!</span>
                        </div>
                      ) : (
                        result.refinements.map((item, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                                item.type === 'Vocabulary' 
                                  ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' 
                                  : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                              }`}>
                                {item.type === 'Vocabulary' ? <BookMarked className="w-3 h-3 mr-1" /> : <LayoutList className="w-3 h-3 mr-1" />}
                                {item.type} Upgrade
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                              <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800/80">
                                <div className="text-[10px] text-zinc-500 font-sans uppercase mb-1">Original Phrase</div>
                                <div className="text-zinc-300">{item.originalText}</div>
                              </div>
                              <div className="p-2.5 bg-indigo-950/20 rounded-lg border border-indigo-800/30">
                                <div className="text-[10px] text-indigo-400 font-sans uppercase mb-1">Recommended Upgrade</div>
                                <div className="text-indigo-200 font-semibold">{item.suggestedUpgrade}</div>
                              </div>
                            </div>

                            <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-2">
                              {item.reason}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* TAB 3: Model Paragraph */}
                  {activeTab === 'diff' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-zinc-950/80 border border-emerald-500/20 text-sm leading-relaxed text-zinc-200 font-sans">
                        {result.improvedVersion}
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>This model response is written as a single continuous paragraph (100+ words), incorporates strong arguments, addresses both perspectives, and receives the maximum score of 16.5 points.</span>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}