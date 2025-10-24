'use client';

import { useState } from 'react';
import { LightBulbIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface HintProps {
  hints: string[];
  flagId: string;
}

export default function Hint({ hints, flagId }: HintProps) {
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [showHints, setShowHints] = useState<boolean>(false);

  if (!hints || hints.length === 0) {
    return null;
  }

  const revealNextHint = () => {
    if (revealedHints < hints.length) {
      setRevealedHints(revealedHints + 1);
      setShowHints(true);

      // Log hint usage for analytics (and debugging)
      console.log(`[Hint] Revealing hint ${revealedHints + 1} for ${flagId}`);
    }
  };

  const toggleHintsVisibility = () => {
    setShowHints(!showHints);
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <LightBulbIcon className="h-5 w-5 text-yellow-600" />
          <span className="font-medium text-yellow-900">Hints Available</span>
          <span className="text-sm text-yellow-700">
            ({revealedHints} of {hints.length} revealed)
          </span>
        </div>
        <div className="flex gap-2">
          {revealedHints > 0 && (
            <button
              onClick={toggleHintsVisibility}
              className="p-1.5 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 rounded transition-colors"
              title={showHints ? 'Hide hints' : 'Show hints'}
            >
              {showHints ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          )}
          {revealedHints < hints.length && (
            <button
              onClick={revealNextHint}
              className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors"
            >
              Reveal Hint {revealedHints + 1}
            </button>
          )}
        </div>
      </div>

      {revealedHints > 0 && showHints && (
        <div className="space-y-2">
          {hints.slice(0, revealedHints).map((hint, index) => (
            <div
              key={index}
              className="p-3 bg-white border border-yellow-100 rounded-md"
            >
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-yellow-700">
                  Hint {index + 1}:
                </span>
                <p className="text-sm text-gray-700 flex-1">{hint}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {revealedHints === hints.length && (
        <div className="mt-2 text-sm text-yellow-700 italic">
          All hints revealed. Good luck!
        </div>
      )}
    </div>
  );
}