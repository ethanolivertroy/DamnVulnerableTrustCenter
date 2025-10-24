'use client';

import { useState } from 'react';
import { FlagIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface FlagSubmitProps {
  flagId: string;
  title: string;
  points: number;
  onSuccess?: () => void;
}

export default function FlagSubmit({ flagId, title, points, onSuccess }: FlagSubmitProps) {
  const [flag, setFlag] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim()) return;

    setSubmitting(true);
    setResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/flags/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: flagId,
          value: flag.trim()
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult({
          success: true,
          message: data.message || `Correct! You earned ${points} points!`
        });
        if (onSuccess) onSuccess();
        // Clear the input after successful submission
        setTimeout(() => {
          setFlag('');
          setIsExpanded(false);
        }, 2000);
      } else {
        setResult({
          success: false,
          message: data.detail || 'Incorrect flag. Try again!'
        });
      }
    } catch (error) {
      console.error('Flag submission error:', error);
      setResult({
        success: false,
        message: 'Network error. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FlagIcon className="h-5 w-5 text-red-600" />
          <span className="font-medium text-gray-900">{title}</span>
          <span className="text-sm text-gray-500">({points} points)</span>
        </div>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <form onSubmit={handleSubmit} className="mt-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                placeholder="Enter flag{...}"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting || !flag.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>

          {result && (
            <div className={`mt-3 p-3 rounded-md flex items-center gap-2 ${
              result.success
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {result.success ? (
                <CheckCircleIcon className="h-5 w-5" />
              ) : (
                <XCircleIcon className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">{result.message}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}