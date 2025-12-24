'use client';

import { useState, useEffect } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function BackendStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/health`);
        setIsConnected(res.ok);
      } catch {
        setIsConnected(false);
      }
      setChecking(false);
    };

    checkBackend();
    const interval = setInterval(checkBackend, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  if (checking || isConnected) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-2 text-sm text-center">
      <ExclamationTriangleIcon className="w-4 h-4 inline mr-2" />
      Backend API unavailable - Some features may not work
    </div>
  );
}
