'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import {
  DocumentChartBarIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const reports = [
  { name: 'SOC 2 Type II Audit Report', type: 'Compliance', date: 'Apr 30, 2024', size: '2.3 MB' },
  { name: 'Vulnerability Assessment Q2', type: 'Security', date: 'Jun 30, 2024', size: '1.8 MB' },
  { name: 'Risk Assessment Report', type: 'Risk', date: 'May 15, 2024', size: '3.1 MB' },
  { name: 'Penetration Test Results', type: 'Security', date: 'Mar 20, 2024', size: '4.5 MB' },
  { name: 'Compliance Status Dashboard', type: 'Compliance', date: 'Today', size: '856 KB' },
];

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-2">Access and download compliance and security reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <DocumentChartBarIcon className="w-8 h-8 text-red-600 mb-3" />
          <h3 className="font-semibold text-gray-900">15 Reports</h3>
          <p className="text-sm text-gray-600">Available this quarter</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <CalendarIcon className="w-8 h-8 text-red-600 mb-3" />
          <h3 className="font-semibold text-gray-900">Weekly</h3>
          <p className="text-sm text-gray-600">Report generation frequency</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ChartBarIcon className="w-8 h-8 text-red-600 mb-3" />
          <h3 className="font-semibold text-gray-900">92%</h3>
          <p className="text-sm text-gray-600">Compliance score trend</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Reports</h2>
          <div className="space-y-3">
            {reports.map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <div className="font-medium text-gray-900">{report.name}</div>
                  <div className="text-sm text-gray-500">{report.type} • {report.date} • {report.size}</div>
                </div>
                <button className="p-2 text-red-600 hover:text-red-700">
                  <ArrowDownTrayIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}