'use client';

import { useState } from 'react';
import {
  CodeBracketSquareIcon,
  DocumentIcon,
  CloudArrowDownIcon,
  CommandLineIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function ApiDemoPage() {
  // Report Generation State
  const [template, setTemplate] = useState('default');
  const [reportResult, setReportResult] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);

  // Presigned URL State
  const [fileName, setFileName] = useState('customer-attestation.pdf');
  const [urlResult, setUrlResult] = useState<any>(null);
  const [urlLoading, setUrlLoading] = useState(false);

  // Badge Status State
  const [badgeResult, setBadgeResult] = useState<any>(null);
  const [badgeLoading, setBadgeLoading] = useState(false);

  // Raw API Call State
  const [customEndpoint, setCustomEndpoint] = useState('/api/health');
  const [customMethod, setCustomMethod] = useState('GET');
  const [customBody, setCustomBody] = useState('');
  const [customResult, setCustomResult] = useState<any>(null);
  const [customLoading, setCustomLoading] = useState(false);

  const generateReport = async () => {
    setReportLoading(true);
    setReportResult(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/reports/generate?template=${encodeURIComponent(template)}`
      );
      const data = await response.text();
      setReportResult({
        success: response.ok,
        status: response.status,
        data: data
      });
    } catch (error) {
      setReportResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setReportLoading(false);
    }
  };

  const getPresignedUrl = async () => {
    setUrlLoading(true);
    setUrlResult(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/reports/presigned?file=${encodeURIComponent(fileName)}`
      );
      const data = await response.json();
      setUrlResult({
        success: response.ok,
        status: response.status,
        data: data
      });
    } catch (error) {
      setUrlResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setUrlLoading(false);
    }
  };

  const getBadgeStatus = async () => {
    setBadgeLoading(true);
    setBadgeResult(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/badges`
      );
      const data = await response.json();
      setBadgeResult({
        success: response.ok,
        status: response.status,
        data: data
      });
    } catch (error) {
      setBadgeResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setBadgeLoading(false);
    }
  };

  const makeCustomRequest = async () => {
    setCustomLoading(true);
    setCustomResult(null);
    try {
      const options: RequestInit = {
        method: customMethod,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (customMethod !== 'GET' && customBody) {
        try {
          options.body = customBody;
        } catch {
          options.body = customBody;
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}${customEndpoint}`,
        options
      );

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      setCustomResult({
        success: response.ok,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data: data
      });
    } catch (error) {
      setCustomResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setCustomLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">API Demonstration</h1>
          <p className="text-lg text-gray-600">
            Interactive API endpoint testing for vulnerability demonstration
          </p>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  Intentional Vulnerabilities Present
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  These endpoints contain security issues for CTF purposes. Try template injection,
                  path traversal, and examining response headers!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Report Generation */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <DocumentIcon className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Report Generation</h2>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Generate reports using templates. Try: <code className="bg-gray-100 px-1">../../etc/passwd</code>
            </p>

            <div className="space-y-3">
              <input
                type="text"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                placeholder="Template name or path..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={generateReport}
                disabled={reportLoading}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
              >
                {reportLoading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>

            {reportResult && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">
                  Status: {reportResult.status || 'N/A'}
                </p>
                <pre className="text-xs font-mono text-gray-800 overflow-x-auto">
                  {typeof reportResult.data === 'string'
                    ? reportResult.data
                    : JSON.stringify(reportResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Presigned URL */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CloudArrowDownIcon className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Presigned URL Generator</h2>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Get presigned URLs for S3 files. Try: <code className="bg-gray-100 px-1">internal-soc2-plan.pdf</code>
            </p>

            <div className="space-y-3">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="File name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={getPresignedUrl}
                disabled={urlLoading}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
              >
                {urlLoading ? 'Generating...' : 'Get Presigned URL'}
              </button>
            </div>

            {urlResult && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">
                  Status: {urlResult.status || 'N/A'}
                </p>
                {urlResult.data?.url && (
                  <div className="mb-2">
                    <a
                      href={urlResult.data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-red-600 hover:text-red-700 underline break-all"
                    >
                      {urlResult.data.url}
                    </a>
                  </div>
                )}
                <pre className="text-xs font-mono text-gray-800 overflow-x-auto">
                  {JSON.stringify(urlResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Badge Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CodeBracketSquareIcon className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Badge Status API</h2>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Check current compliance badge status from the server.
            </p>

            <button
              onClick={getBadgeStatus}
              disabled={badgeLoading}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
            >
              {badgeLoading ? 'Fetching...' : 'Get Badge Status'}
            </button>

            {badgeResult && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">
                  Status: {badgeResult.status || 'N/A'}
                </p>
                <pre className="text-xs font-mono text-gray-800 overflow-x-auto">
                  {JSON.stringify(badgeResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Custom API Call */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CommandLineIcon className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Custom API Request</h2>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <select
                  value={customMethod}
                  onChange={(e) => setCustomMethod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
                <input
                  type="text"
                  value={customEndpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                  placeholder="/api/endpoint"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {customMethod !== 'GET' && (
                <textarea
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  placeholder="Request body (JSON)..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
                />
              )}

              <button
                onClick={makeCustomRequest}
                disabled={customLoading}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
              >
                {customLoading ? 'Sending...' : 'Send Request'}
              </button>
            </div>

            {customResult && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">
                  Status: {customResult.status || 'N/A'}
                </p>
                <details className="text-xs">
                  <summary className="cursor-pointer text-gray-600 mb-1">Headers</summary>
                  <pre className="font-mono text-gray-800 overflow-x-auto">
                    {JSON.stringify(customResult.headers, null, 2)}
                  </pre>
                </details>
                <p className="text-xs text-gray-600 mt-2 mb-1">Response:</p>
                <pre className="text-xs font-mono text-gray-800 overflow-x-auto">
                  {typeof customResult.data === 'string'
                    ? customResult.data
                    : JSON.stringify(customResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Try These:</h3>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Template: <code className="bg-blue-100 px-1">../../../../etc/hosts</code></li>
              <li>• File: <code className="bg-blue-100 px-1">../internal-reports/secret.pdf</code></li>
              <li>• Endpoint: <code className="bg-blue-100 px-1">/api/admin/downloadAuditTrail</code></li>
              <li>• Look for long expiration times in presigned URLs</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-red-900 mb-2">API Documentation:</h3>
            <p className="text-xs text-red-800 mb-2">
              Full API documentation available at:
            </p>
            <a
              href={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-red-600 hover:text-red-700 underline"
            >
              {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/docs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}