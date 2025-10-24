'use client';

import { useState, useEffect } from 'react';
import { DocumentTextIcon, CodeBracketIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function FeedsPage() {
  const [jsonData, setJsonData] = useState<any>(null);
  const [xmlData, setXmlData] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'json' | 'xml'>('json');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both feeds
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/feeds/compliance.json`)
        .then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/feeds/compliance.xml`)
        .then(res => res.text())
    ]).then(([json, xml]) => {
      setJsonData(json);
      setXmlData(xml);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to fetch feeds:', err);
      setLoading(false);
    });
  }, []);

  const highlightSensitiveData = (text: string) => {
    // Highlight potential sensitive information
    const patterns = [
      /dvtc-[a-z-]+/gi,  // Bucket names
      /arn:aws:[^"\\s]+/gi,  // ARNs
      /admin[A-Za-z0-9_-]*/gi,  // Admin references
      /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/gi,  // UUIDs
      /flag\{[^}]+\}/gi,  // Flags
    ];

    let highlighted = text;
    patterns.forEach(pattern => {
      highlighted = highlighted.replace(pattern, match =>
        `<span class="bg-yellow-200 text-red-700 font-semibold px-1 rounded">${match}</span>`
      );
    });
    return highlighted;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Compliance Data Feeds</h1>
          <p className="text-lg text-gray-600">
            Machine-readable compliance and security information for automated integration
          </p>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  VULNERABILITY: Information Overshare
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  These feeds contain more information than necessary, including internal resource names,
                  bucket identifiers, and administrative metadata. Look carefully at the data structure!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg">
          <div className="border-b border-gray-200">
            <div className="flex gap-4 p-4">
              <button
                onClick={() => setActiveTab('json')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'json'
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <CodeBracketIcon className="h-5 w-5" />
                JSON Feed
              </button>
              <button
                onClick={() => setActiveTab('xml')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'xml'
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <DocumentTextIcon className="h-5 w-5" />
                XML Feed
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <>
                {activeTab === 'json' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">JSON Compliance Feed</h2>
                      <a
                        href={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/feeds/compliance.json`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-red-600 hover:text-red-700 underline"
                      >
                        Direct API Link →
                      </a>
                    </div>
                    <div
                      className="bg-gray-50 rounded-lg p-4 overflow-x-auto"
                    >
                      <pre
                        className="text-sm text-gray-800 font-mono"
                        dangerouslySetInnerHTML={{
                          __html: highlightSensitiveData(JSON.stringify(jsonData, null, 2))
                        }}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'xml' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">XML Compliance Feed</h2>
                      <a
                        href={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/feeds/compliance.xml`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-red-600 hover:text-red-700 underline"
                      >
                        Direct API Link →
                      </a>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                      <pre
                        className="text-sm text-gray-800 font-mono"
                        dangerouslySetInnerHTML={{
                          __html: highlightSensitiveData(xmlData)
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Integration Instructions</h3>
            <p className="text-sm text-gray-600 mb-4">
              These feeds are designed for automated consumption by compliance monitoring tools.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-red-600 font-mono text-sm">GET</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1">
                  /api/feeds/compliance.json
                </code>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-600 font-mono text-sm">GET</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1">
                  /api/feeds/compliance.xml
                </code>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Update Frequency</h3>
            <p className="text-sm text-gray-600 mb-4">
              Our compliance data is updated in real-time as changes occur.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-green-500">●</span>
                Certificate updates: Real-time
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">●</span>
                Policy changes: Within 5 minutes
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">●</span>
                Audit reports: Daily at 00:00 UTC
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Hint: Check the JSON structure carefully. Sometimes metadata reveals more than intended... 🔍
          </p>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}