'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Badge from '@/components/Badge';
import {
  ShieldCheckIcon,
  CogIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

export default function AdminPage() {
  const [debugMode, setDebugMode] = useState(false);
  const [badgeOverrides, setBadgeOverrides] = useState<any>({});
  const [auditDownloadStatus, setAuditDownloadStatus] = useState('');
  const [secretToken, setSecretToken] = useState('');

  useEffect(() => {
    // Check if debug mode is already enabled
    if (typeof window !== 'undefined' && (window as any).__DEBUG_MODE) {
      setDebugMode(true);
    }

    // Load any existing badge overrides
    if (typeof window !== 'undefined' && (window as any).__BADGES_OVERRIDE) {
      setBadgeOverrides((window as any).__BADGES_OVERRIDE);
    }
  }, []);

  const toggleBadge = (badgeType: string, value: string) => {
    const newOverrides = {
      ...badgeOverrides,
      [badgeType]: value
    };
    setBadgeOverrides(newOverrides);

    // VULNERABILITY: Client-side badge manipulation
    // This allows changing badge status without server validation
    if (typeof window !== 'undefined') {
      (window as any).__BADGES_OVERRIDE = newOverrides;
      console.log('[Admin] Badge override applied:', badgeType, '=', value);
    }
  };

  const downloadAuditTrail = async () => {
    setAuditDownloadStatus('downloading');
    try {
      // VULNERABILITY: No authentication required for audit trail download
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/downloadAuditTrail`
      );

      if (response.ok) {
        const data = await response.json();
        // Create a downloadable file
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'audit-trail.json';
        a.click();
        setAuditDownloadStatus('success');
        setTimeout(() => setAuditDownloadStatus(''), 3000);
      } else {
        setAuditDownloadStatus('error');
      }
    } catch (error) {
      console.error('Failed to download audit trail:', error);
      setAuditDownloadStatus('error');
    }
  };

  const generateSecretToken = () => {
    // VULNERABILITY: Weak token generation
    const timestamp = Date.now();
    const token = `admin_token_${timestamp}_${Math.floor(Math.random() * 1000)}`;
    setSecretToken(token);

    // Store in window for easy access
    if (typeof window !== 'undefined') {
      (window as any).__ADMIN_TOKEN = token;
      console.log('[Admin] Secret token generated and stored in window.__ADMIN_TOKEN');
    }
  };

  const enableDebugMode = () => {
    setDebugMode(true);
    if (typeof window !== 'undefined') {
      (window as any).__DEBUG_MODE = true;
      console.log('[Admin] Debug mode enabled globally');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">
            System configuration and security controls
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Badge Control Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheckIcon className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Compliance Badge Control</h2>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <div className="flex items-start gap-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">CLIENT-SIDE VULNERABILITY</p>
                  <p className="mt-1">These controls modify badges on the client only. Try toggling FIPS to "ok"!</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Badge type="fips_encryption" />
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleBadge('fips_encryption', 'ok')}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Enable
                  </button>
                  <button
                    onClick={() => toggleBadge('fips_encryption', 'false')}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Disable
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Badge type="soc2" />
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleBadge('soc2', 'ok')}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Pass
                  </button>
                  <button
                    onClick={() => toggleBadge('soc2', 'warning')}
                    className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Warn
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Badge type="hipaa" />
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleBadge('hipaa', 'ok')}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Compliant
                  </button>
                  <button
                    onClick={() => toggleBadge('hipaa', 'false')}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Non-Compliant
                  </button>
                </div>
              </div>
            </div>

            {Object.keys(badgeOverrides).length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-xs font-mono text-yellow-800">
                  window.__BADGES_OVERRIDE = {JSON.stringify(badgeOverrides)}
                </p>
              </div>
            )}
          </div>

          {/* Audit Trail Download */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <DocumentArrowDownIcon className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Audit Trail Export</h2>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Download complete audit trail of all system activities and configuration changes.
            </p>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
              <p className="text-sm text-yellow-800">
                ⚠️ No authentication required - This endpoint is publicly accessible!
              </p>
            </div>

            <button
              onClick={downloadAuditTrail}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              Download Audit Trail
            </button>

            {auditDownloadStatus && (
              <div className={`mt-3 p-2 rounded text-sm text-center ${
                auditDownloadStatus === 'downloading' ? 'bg-blue-50 text-blue-700' :
                auditDownloadStatus === 'success' ? 'bg-green-50 text-green-700' :
                'bg-red-50 text-red-700'
              }`}>
                {auditDownloadStatus === 'downloading' ? 'Downloading...' :
                 auditDownloadStatus === 'success' ? 'Download complete!' :
                 'Download failed'}
              </div>
            )}
          </div>

          {/* Debug Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <BeakerIcon className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Debug Controls</h2>
            </div>

            <div className="space-y-4">
              <div>
                <button
                  onClick={enableDebugMode}
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${
                    debugMode
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {debugMode ? '✓ Debug Mode Enabled' : 'Enable Debug Mode'}
                </button>
                {debugMode && (
                  <p className="mt-2 text-xs text-gray-600">
                    Console logging enhanced. Check browser console for details.
                  </p>
                )}
              </div>

              <div>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      console.log('=== DVTC Debug Info ===');
                      console.log('Badges Override:', (window as any).__BADGES_OVERRIDE);
                      console.log('Debug Mode:', (window as any).__DEBUG_MODE);
                      console.log('Admin Token:', (window as any).__ADMIN_TOKEN);
                      console.log('API URL:', (window as any).__API_URL);
                      console.log('=======================');
                    }
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Log System State
                </button>
              </div>
            </div>
          </div>

          {/* Secret Token Generator */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <KeyIcon className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Token Generator</h2>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Generate admin tokens for API access (weak implementation for CTF).
            </p>

            <button
              onClick={generateSecretToken}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 mb-4"
            >
              Generate Admin Token
            </button>

            {secretToken && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                <p className="text-xs text-gray-600 mb-1">Generated Token:</p>
                <code className="text-sm font-mono text-gray-800 break-all">{secretToken}</code>
                <p className="text-xs text-gray-500 mt-2">
                  Also stored in: window.__ADMIN_TOKEN
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Developer Notes</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Badge overrides are stored in window.__BADGES_OVERRIDE</li>
            <li>• Debug mode flag is at window.__DEBUG_MODE</li>
            <li>• Admin tokens are stored in window.__ADMIN_TOKEN</li>
            <li>• Audit trail endpoint has no authentication (intentional vulnerability)</li>
            <li>• All changes are client-side only unless explicitly saved to server</li>
          </ul>
        </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}