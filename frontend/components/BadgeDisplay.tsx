'use client';

import { useEffect, useState } from 'react';
import { CheckIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

export default function BadgeDisplay() {
  const [badges, setBadges] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [flagShown, setFlagShown] = useState(false);

  useEffect(() => {
    fetchBadges();

    // VULNERABILITY: Check for client-side badge override
    const checkOverride = setInterval(() => {
      if (window.__BADGES_OVERRIDE && Object.keys(window.__BADGES_OVERRIDE).length > 0) {
        const overrides = window.__BADGES_OVERRIDE as any;
        setBadges((prev: any) => ({
          ...prev,
          ...Object.keys(overrides).reduce((acc: any, key: string) => {
            if (prev[key]) {
              acc[key] = {
                ...prev[key],
                status: overrides[key],
                color: overrides[key] === 'ok' ? 'green' : 'red',
                client_overridden: true
              };
            }
            return acc;
          }, {})
        }));

        // Check for FIPS override flag - only show once
        if (overrides.fips_encryption === 'ok' && !flagShown) {
          toast.success('Badge override successful! Flag: flag{ui_state_is_not_security}', {
            duration: 6000,
          });
          setFlagShown(true);
        }
      }
    }, 1000);

    return () => clearInterval(checkOverride);
  }, [flagShown]);

  const fetchBadges = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/badges`);
      const data = await response.json();
      setBadges(data.badges || {});
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch badges:', error);
      setLoading(false);
    }
  };

  const getBadgeIcon = (status: string) => {
    switch (status) {
      case 'ok':
      case 'true':
        return <CheckIcon className="h-4 w-4 text-green-600" />;
      case 'false':
      case 'error':
        return <XMarkIcon className="h-4 w-4 text-red-600" />;
      case 'in_progress':
      case 'warning':
        return <ClockIcon className="h-4 w-4 text-yellow-600" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'yellow':
      case 'orange':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Security Badges</h3>
        <button
          onClick={fetchBadges}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Object.entries(badges).map(([key, badge]: [string, any]) => (
          <div
            key={key}
            className={`flex items-center justify-between px-3 py-2 rounded-lg border ${getBadgeColor(badge.color)} transition-all duration-200 ${
              badge.client_overridden ? 'ring-2 ring-red-500' : ''
            }`}
          >
            <div className="flex items-center space-x-2">
              {getBadgeIcon(badge.status)}
              <span className="text-sm font-medium">{badge.label}</span>
            </div>
            {badge.client_overridden && (
              <span className="text-xs text-red-600">Override</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>Hint: Some badges can be overridden via browser console</p>
        <code className="block mt-1 p-1 bg-gray-100 rounded">
          window.__BADGES_OVERRIDE = &#123;fips_encryption: 'ok'&#125;
        </code>
      </div>
    </div>
  );
}