import React, { useState } from 'react';
import { LEARNING_TOPICS } from '../data/learningTopics';
import { LearningTopic } from '../types';
import { storage } from '../utils/storage';
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Search,
  Filter,
  Sparkles,
  Shield,
  HelpCircle,
  X,
  RotateCcw,
} from 'lucide-react';

export const LearningHubPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTopic, setActiveTopic] = useState<LearningTopic | null>(null);

  // Quiz State inside modal
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScores, setQuizScores] = useState<Record<string, number>>(() => storage.getQuizProgress());

  const categories = ['All', 'Phishing', 'Ransomware', 'Social Engineering', 'Zero Trust', 'Password Security', 'OSINT'];

  const filteredTopics = LEARNING_TOPICS.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenTopic = (topic: LearningTopic) => {
    setActiveTopic(topic);
    setUserAnswers({});
    setQuizSubmitted(false);
  };

  const handleOptionSelect = (qIdx: number, oIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!activeTopic) return;
    let correct = 0;
    activeTopic.quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });

    const percent = Math.round((correct / activeTopic.quiz.length) * 100);
    setQuizSubmitted(true);
    storage.saveQuizScore(activeTopic.id, percent);
    setQuizScores(storage.getQuizProgress());
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800/90 p-6 shadow-xl">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <GraduationCap className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
              SecOps Academy & Training
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
            Cybersecurity Learning Hub
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Master threat hunting, spear phishing mitigation, zero-trust network design, password entropy, ransomware incident response, and OSINT reconnaissance through interactive modules and quizzes.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics or keywords..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-9 pr-4 py-2 text-slate-100 text-xs font-mono placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg border whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Topic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => {
          const score = quizScores[topic.id];
          return (
            <div
              key={topic.id}
              onClick={() => handleOpenTopic(topic)}
              className="group cursor-pointer rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-blue-500/50 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-blue-400 border border-slate-800 uppercase">
                    {topic.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" /> {topic.readTimeMinutes} Min
                    </span>
                    {score !== undefined && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        Quiz: {score}%
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-slate-100 text-base group-hover:text-blue-300 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{topic.summary}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Start Module
                </span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail & Quiz Modal */}
      {activeTopic && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative custom-scrollbar">
            {/* Close Button */}
            <button
              onClick={() => setActiveTopic(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 rounded-lg bg-slate-800/80 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-8">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {activeTopic.category} • {activeTopic.difficulty}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-100 font-sans">{activeTopic.title}</h2>
            </div>

            {/* Overview */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Module Overview</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{activeTopic.overview}</p>
            </div>

            {/* Key Takeaways */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Key Defense Takeaways</h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeTopic.keyTakeaways.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Case Study */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">Real-World Case Study</h3>
              <h4 className="font-bold text-slate-200 text-sm">{activeTopic.caseStudy.title}</h4>
              <p className="text-xs text-slate-400">{activeTopic.caseStudy.scenario}</p>
              <div className="pt-2 border-t border-slate-800 text-xs text-cyan-300">
                <strong>Resolution:</strong> {activeTopic.caseStudy.resolution}
              </div>
            </div>

            {/* Interactive Mini Quiz */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-slate-100 font-sans flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-400" /> Module Knowledge Verification
              </h3>

              <div className="space-y-4">
                {activeTopic.quiz.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3">
                    <p className="text-sm font-semibold text-slate-200">
                      Q{qIdx + 1}: {q.question}
                    </p>

                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = userAnswers[qIdx] === oIdx;
                        const isCorrect = q.correctIndex === oIdx;

                        let style = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                        if (isSelected) style = 'bg-blue-500/20 border-blue-500 text-blue-200 font-semibold';
                        if (quizSubmitted) {
                          if (isCorrect) style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                          else if (isSelected && !isCorrect) style = 'bg-rose-500/20 border-rose-500 text-rose-300';
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleOptionSelect(qIdx, oIdx)}
                            disabled={quizSubmitted}
                            className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${style}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <p className="text-xs font-mono text-cyan-300 pt-1">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length < activeTopic.quiz.length}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-slate-950 font-bold text-sm hover:from-blue-400 hover:to-cyan-500 disabled:opacity-50 transition-all cursor-pointer"
                >
                  Submit Quiz Answers
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                  <Award className="w-6 h-6 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-emerald-300">
                    Quiz Score Saved: {quizScores[activeTopic.id]}%
                  </p>
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setUserAnswers({});
                    }}
                    className="text-xs font-mono text-slate-400 underline hover:text-slate-200"
                  >
                    Retake Quiz
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
