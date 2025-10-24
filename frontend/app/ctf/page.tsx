'use client';

import { useState, useEffect } from 'react';
import {
  FlagIcon,
  TrophyIcon,
  LightBulbIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useToast } from '@/contexts/ToastContext';

interface CompletedFlag {
  flag_id: string;
  points: number;
  timestamp: string;
}

export default function CTFPage() {
  const [flags, setFlags] = useState<any[]>([]);
  const [completedFlags, setCompletedFlags] = useState<CompletedFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    fetchFlags();
    loadProgress();
  }, []);

  const fetchFlags = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/flags/list`
      );
      const data = await response.json();
      setFlags(data.flags || []);
      setTotalPoints(data.total_points || 0);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch flags:', error);
      setLoading(false);
    }
  };

  const loadProgress = () => {
    // Load completed flags from localStorage
    const stored = localStorage.getItem('dvtc_completed_flags');
    if (stored) {
      setCompletedFlags(JSON.parse(stored));
    }
  };

  const saveProgress = (newCompletedFlags: CompletedFlag[]) => {
    localStorage.setItem('dvtc_completed_flags', JSON.stringify(newCompletedFlags));
    setCompletedFlags(newCompletedFlags);
  };

  const submitFlag = async (flagId: string, flagValue: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/flags/submit`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            flag_id: flagId,
            flag_value: flagValue,
          }),
        }
      );
      const data = await response.json();

      if (data.success) {
        // Add to completed flags
        const newCompleted = [...completedFlags, {
          flag_id: data.flag_id,
          points: data.points,
          timestamp: new Date().toISOString()
        }];
        saveProgress(newCompleted);

        showToast('success', '🎉 Flag Captured!', `${data.message} (+${data.points} points)`);
      } else {
        showToast('error', 'Incorrect Flag', data.message);
        if (data.hint) {
          showToast('info', '💡 Hint', data.hint);
        }
      }
    } catch (error) {
      showToast('error', 'Submission Failed', 'Failed to submit flag');
    }
  };

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all your progress?')) {
      localStorage.removeItem('dvtc_completed_flags');
      setCompletedFlags([]);
      showToast('success', 'Progress Reset', 'Your CTF progress has been cleared');
    }
  };

  const isCompleted = (flagId: string) => {
    return completedFlags.some(f => f.flag_id === flagId);
  };

  const calculateScore = () => {
    return completedFlags.reduce((sum, f) => sum + f.points, 0);
  };

  const calculateProgress = () => {
    return flags.length > 0 ? (completedFlags.length / flags.length) * 100 : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">CTF Challenges</h1>
              <p className="mt-2">Damn Vulnerable Trust Center - Capture The Flag</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {calculateScore()} / {totalPoints} pts
              </div>
              <div className="text-sm">Your Score</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span>{completedFlags.length} of {flags.length} Challenges Completed</span>
              <span>{Math.round(calculateProgress())}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-500"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {completedFlags.length}
                </div>
                <div className="text-sm text-gray-600">Flags Found</div>
              </div>
              <FlagIcon className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {flags.length - completedFlags.length}
                </div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
              <TrophyIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(calculateProgress())}%
                </div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <button
              onClick={resetProgress}
              className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700"
            >
              <ArrowPathIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Reset Progress</span>
            </button>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flags.map((flag) => (
            <ChallengeCard
              key={flag.id}
              flag={flag}
              onSubmit={submitFlag}
              isCompleted={isCompleted(flag.id)}
            />
          ))}
        </div>

        {/* Completion Message */}
        {completedFlags.length === flags.length && flags.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 inline-block">
              <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-900">Congratulations!</h2>
              <p className="text-green-700 mt-2">
                You've completed all {flags.length} challenges!
              </p>
              <p className="text-green-600 mt-1">
                Total Score: {calculateScore()} points
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChallengeCard({ flag, onSubmit, isCompleted }: any) {
  const [flagValue, setFlagValue] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [allHints, setAllHints] = useState<string[]>([]);
  const [hintLevel, setHintLevel] = useState(0);

  const fetchMoreHints = async () => {
    if (!showHint) {
      setShowHint(true);
      setAllHints(flag.hints || []);
      setHintLevel(1);
    } else {
      // Try to fetch more hints from the API
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/flags/hints/${flag.id}?reveal_level=10`);
        const data = await response.json();
        if (data.hints) {
          setAllHints(data.hints);
          setHintLevel(data.hints.length);
        }
      } catch (error) {
        console.error('Failed to fetch hints:', error);
      }
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: any = {
      'Cloud Storage': 'bg-blue-100 text-blue-800',
      'IAM/Secrets': 'bg-red-100 text-red-800',
      'Serverless': 'bg-green-100 text-green-800',
      'OSINT/Metadata': 'bg-yellow-100 text-yellow-800',
      'Frontend Logic': 'bg-pink-100 text-pink-800',
      'Supply Chain': 'bg-red-100 text-red-800',
      'API Auth': 'bg-indigo-100 text-indigo-800',
      'AI Security': 'bg-orange-100 text-orange-800',
      'Source Control': 'bg-gray-100 text-gray-800',
      'Business Logic': 'bg-teal-100 text-teal-800',
      'Information Disclosure': 'bg-cyan-100 text-cyan-800',
      'Authentication': 'bg-fuchsia-100 text-fuchsia-800',
      'Crypto/Config': 'bg-lime-100 text-lime-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${
      isCompleted ? 'ring-2 ring-green-500' : ''
    }`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(flag.category)}`}>
            {flag.category}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-red-600">{flag.points} pts</span>
            {isCompleted && (
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
            )}
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          {flag.title}
          {isCompleted && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
              Completed
            </span>
          )}
        </h3>
        <p className="text-sm text-gray-600 mb-4">{flag.description}</p>

        {!isCompleted ? (
          <>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="flag{...}"
                value={flagValue}
                onChange={(e) => setFlagValue(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onSubmit(flag.id, flagValue);
                    setFlagValue('');
                  }
                }}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onSubmit(flag.id, flagValue);
                  setFlagValue('');
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Submit Flag
              </button>
              <button
                onClick={fetchMoreHints}
                className="p-2 text-red-600 hover:text-red-700 border border-red-200 rounded-lg"
                title={showHint ? "Show more hints" : "Show hint"}
              >
                <LightBulbIcon className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircleIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Challenge Completed!</span>
            </div>
          </div>
        )}

        {showHint && !isCompleted && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="space-y-2">
              {(allHints.length > 0 ? allHints : flag.hints || []).map((hint: string, idx: number) => (
                <p key={idx} className="text-xs text-yellow-800">
                  <span className="font-semibold">Hint {idx + 1}:</span> {hint}
                </p>
              ))}
              {hintLevel > 0 && hintLevel < 4 && (
                <button
                  onClick={fetchMoreHints}
                  className="text-xs text-yellow-700 hover:text-yellow-900 underline"
                >
                  Need more hints? Click the lightbulb again
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}