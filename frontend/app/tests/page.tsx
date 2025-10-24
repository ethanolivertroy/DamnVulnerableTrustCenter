'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  BeakerIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlayIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface Test {
  id: string;
  name: string;
  type: 'automated' | 'manual' | 'penetration';
  status: 'passed' | 'failed' | 'running' | 'scheduled';
  framework: string;
  lastRun: string;
  nextRun: string;
  coverage: number;
}

const tests: Test[] = [
  { id: 'TEST-001', name: 'Access Control Validation', type: 'automated', status: 'passed', framework: 'SOC 2', lastRun: '2 hours ago', nextRun: 'In 22 hours', coverage: 95 },
  { id: 'TEST-002', name: 'Data Encryption Verification', type: 'automated', status: 'running', framework: 'ISO 27001', lastRun: '1 day ago', nextRun: 'Running now', coverage: 88 },
  { id: 'TEST-003', name: 'Vulnerability Scan', type: 'penetration', status: 'failed', framework: 'General', lastRun: '3 days ago', nextRun: 'Tomorrow', coverage: 73 },
  { id: 'TEST-004', name: 'Backup Recovery Test', type: 'manual', status: 'scheduled', framework: 'SOC 2', lastRun: '1 week ago', nextRun: 'In 2 days', coverage: 100 },
  { id: 'TEST-005', name: 'API Security Test', type: 'automated', status: 'failed', framework: 'OWASP', lastRun: '4 hours ago', nextRun: 'In 20 hours', coverage: 67 },
];

export default function TestsPage() {
  const [selectedType, setSelectedType] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'failed': return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'running': return <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />;
      case 'scheduled': return <ClockIcon className="w-5 h-5 text-gray-400" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'automated': return 'bg-blue-100 text-blue-700';
      case 'manual': return 'bg-yellow-100 text-yellow-700';
      case 'penetration': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredTests = selectedType === 'all' ? tests : tests.filter(t => t.type === selectedType);

  return (
    <ProtectedRoute>
      <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tests</h1>
        <p className="text-gray-600 mt-2">Manage and monitor your compliance and security tests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Tests</span>
            <BeakerIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{tests.length}</div>
          <div className="text-xs text-gray-500 mt-1">Across all frameworks</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pass Rate</span>
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600">73%</div>
          <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Failed Tests</span>
            <XCircleIcon className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600">2</div>
          <div className="text-xs text-gray-500 mt-1">Require attention</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Coverage</span>
            <DocumentTextIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">85%</div>
          <div className="text-xs text-gray-500 mt-1">Average coverage</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-2">
          {['all', 'automated', 'manual', 'penetration'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
              {type !== 'all' && (
                <span className="ml-2 text-xs">
                  ({tests.filter(t => t.type === type).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Framework</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Coverage</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTests.map((test) => (
              <tr key={test.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{test.name}</div>
                    <div className="text-xs text-gray-500">{test.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(test.type)}`}>
                    {test.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(test.status)}
                    <span className="text-sm text-gray-600">{test.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{test.framework}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${test.coverage >= 80 ? 'bg-green-500' : test.coverage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${test.coverage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{test.coverage}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-gray-500">
                    <div>Last: {test.lastRun}</div>
                    <div>Next: {test.nextRun}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="p-1 text-red-600 hover:text-red-700">
                    <PlayIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CTF Hint */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          Debug: Test results stored in S3 bucket without encryption. Check LocalStack logs for details.
        </p>
      </div>
      </div>
    </ProtectedRoute>
  );
}