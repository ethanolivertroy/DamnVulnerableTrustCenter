'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  ClipboardDocumentCheckIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ChevronRightIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

interface Audit {
  id: string;
  framework: string;
  type: 'internal' | 'external' | 'surveillance' | 'certification';
  status: 'scheduled' | 'in_progress' | 'completed' | 'passed' | 'failed';
  auditor: string;
  auditorFirm?: string;
  startDate: string;
  endDate: string;
  findings: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  reportUrl?: string;
  scope: string;
}

const audits: Audit[] = [
  {
    id: 'AUD-2024-001',
    framework: 'SOC 2 Type II',
    type: 'external',
    status: 'passed',
    auditor: 'Sarah Williams, CPA',
    auditorFirm: 'BigFour Auditors LLP',
    startDate: 'Apr 1, 2024',
    endDate: 'Apr 30, 2024',
    findings: { critical: 0, high: 0, medium: 1, low: 3 },
    reportUrl: '/reports/soc2-2024.pdf',
    scope: 'Security, Availability, Confidentiality'
  },
  {
    id: 'AUD-2024-002',
    framework: 'ISO 27001',
    type: 'surveillance',
    status: 'in_progress',
    auditor: 'Michael Chen',
    auditorFirm: 'ISO Certification Bodies Inc.',
    startDate: 'Nov 15, 2024',
    endDate: 'Nov 30, 2024',
    findings: { critical: 0, high: 0, medium: 0, low: 0 },
    scope: 'Annual surveillance audit'
  },
  {
    id: 'AUD-2024-003',
    framework: 'HIPAA',
    type: 'external',
    status: 'passed',
    auditor: 'Jennifer Martinez',
    auditorFirm: 'Healthcare Compliance Partners',
    startDate: 'Mar 10, 2024',
    endDate: 'Mar 20, 2024',
    findings: { critical: 0, high: 0, medium: 2, low: 1 },
    reportUrl: '/reports/hipaa-2024.pdf',
    scope: 'Privacy Rule, Security Rule, Breach Notification'
  },
  {
    id: 'AUD-2024-004',
    framework: 'FedRAMP Moderate',
    type: 'certification',
    status: 'in_progress',
    auditor: 'Robert Johnson',
    auditorFirm: 'Federal Compliance Assessors',
    startDate: 'Oct 1, 2024',
    endDate: 'Dec 31, 2024',
    findings: { critical: 0, high: 2, medium: 8, low: 15 },
    scope: 'Full authorization package assessment'
  },
  {
    id: 'AUD-2025-001',
    framework: 'SOC 2 Type II',
    type: 'external',
    status: 'scheduled',
    auditor: 'Sarah Williams, CPA',
    auditorFirm: 'BigFour Auditors LLP',
    startDate: 'Apr 1, 2025',
    endDate: 'Apr 30, 2025',
    findings: { critical: 0, high: 0, medium: 0, low: 0 },
    scope: 'Security, Availability, Confidentiality'
  },
  {
    id: 'AUD-2024-005',
    framework: 'Internal Security',
    type: 'internal',
    status: 'completed',
    auditor: 'Jane Smith',
    startDate: 'Oct 15, 2024',
    endDate: 'Oct 20, 2024',
    findings: { critical: 1, high: 3, medium: 5, low: 8 },
    reportUrl: '/reports/internal-q4-2024.pdf',
    scope: 'Quarterly internal security assessment'
  },
  {
    id: 'AUD-2024-006',
    framework: 'GDPR',
    type: 'external',
    status: 'passed',
    auditor: 'Emma Thompson',
    auditorFirm: 'EU Privacy Consultants',
    startDate: 'Feb 5, 2024',
    endDate: 'Feb 15, 2024',
    findings: { critical: 0, high: 0, medium: 3, low: 2 },
    reportUrl: '/reports/gdpr-2024.pdf',
    scope: 'Data protection impact assessment'
  },
  {
    id: 'AUD-2025-002',
    framework: 'PCI DSS',
    type: 'external',
    status: 'scheduled',
    auditor: 'David Lee',
    auditorFirm: 'Payment Security Auditors',
    startDate: 'Jan 15, 2025',
    endDate: 'Jan 30, 2025',
    findings: { critical: 0, high: 0, medium: 0, low: 0 },
    scope: 'Annual PCI DSS compliance assessment'
  }
];

export default function AuditsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [frameworkFilter, setFrameworkFilter] = useState<string>('all');

  const filteredAudits = audits.filter(audit => {
    const matchesStatus = statusFilter === 'all' || audit.status === statusFilter;
    const matchesType = typeFilter === 'all' || audit.type === typeFilter;
    const matchesFramework = frameworkFilter === 'all' || audit.framework.includes(frameworkFilter);
    return matchesStatus && matchesType && matchesFramework;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-700 bg-green-100';
      case 'failed': return 'text-red-700 bg-red-100';
      case 'in_progress': return 'text-blue-700 bg-blue-100';
      case 'completed': return 'text-gray-700 bg-gray-100';
      case 'scheduled': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircleIcon className="w-5 h-5" />;
      case 'failed': return <XCircleIcon className="w-5 h-5" />;
      case 'in_progress': return <ClockIcon className="w-5 h-5" />;
      case 'completed': return <CheckCircleIcon className="w-5 h-5" />;
      case 'scheduled': return <CalendarIcon className="w-5 h-5" />;
      default: return <ClockIcon className="w-5 h-5" />;
    }
  };

  const stats = {
    total: audits.length,
    scheduled: audits.filter(a => a.status === 'scheduled').length,
    inProgress: audits.filter(a => a.status === 'in_progress').length,
    passed: audits.filter(a => a.status === 'passed').length,
    failed: audits.filter(a => a.status === 'failed').length,
  };

  const totalFindings = filteredAudits.reduce((acc, audit) => ({
    critical: acc.critical + audit.findings.critical,
    high: acc.high + audit.findings.high,
    medium: acc.medium + audit.findings.medium,
    low: acc.low + audit.findings.low,
  }), { critical: 0, high: 0, medium: 0, low: 0 });

  return (
    <ProtectedRoute>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Compliance Audits</h1>
              <p className="text-gray-600 mt-2">Track and manage compliance audits and assessments</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Schedule Audit
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600 mt-1">Total Audits</div>
              </div>
              <ClipboardDocumentCheckIcon className="w-10 h-10 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.scheduled}</div>
                <div className="text-sm text-gray-600 mt-1">Scheduled</div>
              </div>
              <CalendarIcon className="w-10 h-10 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                <div className="text-sm text-gray-600 mt-1">In Progress</div>
              </div>
              <ClockIcon className="w-10 h-10 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
                <div className="text-sm text-gray-600 mt-1">Passed</div>
              </div>
              <CheckCircleSolid className="w-10 h-10 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-sm text-gray-600 mt-1">Failed</div>
              </div>
              <XCircleIcon className="w-10 h-10 text-red-400" />
            </div>
          </div>
        </div>

        {/* Findings Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Findings Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{totalFindings.critical}</div>
                <div className="text-sm text-gray-600">Critical</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{totalFindings.high}</div>
                <div className="text-sm text-gray-600">High</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{totalFindings.medium}</div>
                <div className="text-sm text-gray-600">Medium</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalFindings.low}</div>
                <div className="text-sm text-gray-600">Low</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
              <option value="surveillance">Surveillance</option>
              <option value="certification">Certification</option>
            </select>
            <select
              value={frameworkFilter}
              onChange={(e) => setFrameworkFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Frameworks</option>
              <option value="SOC 2">SOC 2</option>
              <option value="ISO 27001">ISO 27001</option>
              <option value="FedRAMP">FedRAMP</option>
              <option value="HIPAA">HIPAA</option>
              <option value="GDPR">GDPR</option>
              <option value="PCI DSS">PCI DSS</option>
            </select>
          </div>
        </div>

        {/* Audits List */}
        <div className="space-y-4">
          {filteredAudits.map((audit) => (
            <div
              key={audit.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ClipboardDocumentCheckIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{audit.framework}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(audit.status)}`}>
                        {getStatusIcon(audit.status)}
                        {audit.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full capitalize">
                        {audit.type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">{audit.scope}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <UserGroupIcon className="w-4 h-4 text-gray-400" />
                        <span>{audit.auditor}</span>
                        {audit.auditorFirm && <span className="text-gray-400">• {audit.auditorFirm}</span>}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span>{audit.startDate} - {audit.endDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {audit.reportUrl && (
                  <button className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2">
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Report
                  </button>
                )}
              </div>

              {/* Findings */}
              {(audit.findings.critical > 0 || audit.findings.high > 0 || audit.findings.medium > 0 || audit.findings.low > 0) && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Findings</div>
                  <div className="grid grid-cols-4 gap-4">
                    {audit.findings.critical > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-900">{audit.findings.critical} Critical</span>
                      </div>
                    )}
                    {audit.findings.high > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-900">{audit.findings.high} High</span>
                      </div>
                    )}
                    {audit.findings.medium > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-900">{audit.findings.medium} Medium</span>
                      </div>
                    )}
                    {audit.findings.low > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-900">{audit.findings.low} Low</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredAudits.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <ClipboardDocumentCheckIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500">No audits found matching your filters</div>
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-600">
          Showing {filteredAudits.length} of {audits.length} audits
        </div>
      </div>
    </ProtectedRoute>
  );
}
