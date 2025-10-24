'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

interface Framework {
  id: string;
  name: string;
  status: 'compliant' | 'in_progress' | 'not_started';
  progress: number;
  controls: {
    total: number;
    passed: number;
    failed: number;
    not_tested: number;
  };
  lastAudit: string;
  nextAudit: string;
}

const frameworks: Framework[] = [
  {
    id: 'soc2',
    name: 'SOC 2 Type II',
    status: 'compliant',
    progress: 98,
    controls: { total: 104, passed: 103, failed: 1, not_tested: 0 },
    lastAudit: 'Apr 30, 2024',
    nextAudit: 'Oct 30, 2024'
  },
  {
    id: 'iso27001',
    name: 'ISO 27001',
    status: 'in_progress',
    progress: 75,
    controls: { total: 114, passed: 85, failed: 5, not_tested: 24 },
    lastAudit: 'Jan 15, 2024',
    nextAudit: 'Jul 15, 2024'
  },
  {
    id: 'fedramp',
    name: 'FedRAMP Moderate',
    status: 'in_progress',
    progress: 65,
    controls: { total: 325, passed: 210, failed: 15, not_tested: 100 },
    lastAudit: 'Nov 15, 2024',
    nextAudit: 'May 15, 2025'
  },
  {
    id: 'hipaa',
    name: 'HIPAA',
    status: 'compliant',
    progress: 100,
    controls: { total: 78, passed: 78, failed: 0, not_tested: 0 },
    lastAudit: 'Mar 20, 2024',
    nextAudit: 'Sep 20, 2024'
  },
  {
    id: 'gdpr',
    name: 'GDPR',
    status: 'compliant',
    progress: 95,
    controls: { total: 89, passed: 85, failed: 2, not_tested: 2 },
    lastAudit: 'Feb 10, 2024',
    nextAudit: 'Aug 10, 2024'
  },
  {
    id: 'pci',
    name: 'PCI DSS',
    status: 'not_started',
    progress: 0,
    controls: { total: 264, passed: 0, failed: 0, not_tested: 264 },
    lastAudit: 'N/A',
    nextAudit: 'TBD'
  }
];

export default function CompliancePage() {
  const [selectedFramework, setSelectedFramework] = useState<Framework>(frameworks[0]);
  const [complianceData, setComplianceData] = useState<any>(null);

  useEffect(() => {
    // Fetch compliance data from backend
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/feeds/compliance.json`)
      .then(res => res.json())
      .then(data => setComplianceData(data))
      .catch(err => console.error('Failed to fetch compliance data:', err));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      case 'not_started': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircleIcon className="w-5 h-5" />;
      case 'in_progress': return <ClockIcon className="w-5 h-5" />;
      case 'not_started': return <XCircleIcon className="w-5 h-5" />;
      default: return <ExclamationTriangleIcon className="w-5 h-5" />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Compliance</h1>
        <p className="text-gray-600 mt-2">Monitor and manage your compliance frameworks and controls</p>
      </div>

      {/* Overall Compliance Score */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Overall Compliance Score</h2>
            <p className="text-gray-600 mt-1">Weighted average across all active frameworks</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-red-600">92%</div>
            <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
              <ArrowTrendingUpIcon className="w-4 h-4" />
              <span>+3% from last quarter</span>
            </div>
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
          <div className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full" style={{ width: '92%' }}></div>
        </div>
      </div>

      {/* Framework Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {frameworks.map((framework) => (
          <div
            key={framework.id}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer transition-all hover:shadow-md ${
              selectedFramework.id === framework.id ? 'ring-2 ring-red-500' : ''
            }`}
            onClick={() => setSelectedFramework(framework)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{framework.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(framework.status)}`}>
                {getStatusIcon(framework.status)}
                {framework.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span className="font-medium">{framework.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      framework.progress === 100 ? 'bg-green-500' :
                      framework.progress >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${framework.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-gray-500">Controls</div>
                  <div className="font-semibold">{framework.controls.total}</div>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-gray-500">Passed</div>
                  <div className="font-semibold text-green-600">{framework.controls.passed}</div>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                <div>Last audit: {framework.lastAudit}</div>
                <div>Next audit: {framework.nextAudit}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Framework Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {selectedFramework.name} - Control Details
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Control Status Chart */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">Control Status Distribution</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-600">Passed</div>
                <div className="flex-1 bg-gray-200 rounded-full h-8">
                  <div
                    className="bg-green-500 h-8 rounded-full flex items-center justify-end pr-3"
                    style={{ width: `${(selectedFramework.controls.passed / selectedFramework.controls.total) * 100}%` }}
                  >
                    <span className="text-white text-xs font-medium">{selectedFramework.controls.passed}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-600">Failed</div>
                <div className="flex-1 bg-gray-200 rounded-full h-8">
                  <div
                    className="bg-red-500 h-8 rounded-full flex items-center justify-end pr-3"
                    style={{ width: `${(selectedFramework.controls.failed / selectedFramework.controls.total) * 100}%` }}
                  >
                    {selectedFramework.controls.failed > 0 && (
                      <span className="text-white text-xs font-medium">{selectedFramework.controls.failed}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-600">Not Tested</div>
                <div className="flex-1 bg-gray-200 rounded-full h-8">
                  <div
                    className="bg-gray-400 h-8 rounded-full flex items-center justify-end pr-3"
                    style={{ width: `${(selectedFramework.controls.not_tested / selectedFramework.controls.total) * 100}%` }}
                  >
                    {selectedFramework.controls.not_tested > 0 && (
                      <span className="text-white text-xs font-medium">{selectedFramework.controls.not_tested}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">Recent Activities</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircleSolid className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Access Control Policy updated</div>
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DocumentTextIcon className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Quarterly audit report generated</div>
                  <div className="text-xs text-gray-500">1 day ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Control CC-1.3 needs review</div>
                  <div className="text-xs text-gray-500">3 days ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheckIcon className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Security training completed</div>
                  <div className="text-xs text-gray-500">1 week ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            View All Controls
          </button>
          <button className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors">
            Download Report
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Schedule Audit
          </button>
        </div>
      </div>

      {/* Debug Info for CTF */}
      {complianceData && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            Debug: Compliance data loaded. Check console for details.
          </p>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}