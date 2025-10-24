'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BugAntIcon,
  LockClosedIcon,
  ChartBarIcon,
  BellAlertIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface SecurityMetric {
  label: string;
  value: number;
  change: number;
  status: 'good' | 'warning' | 'critical';
}

interface Vulnerability {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved';
  discoveredDate: string;
  component: string;
}

interface SecurityEvent {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error';
}

const metrics: SecurityMetric[] = [
  { label: 'Critical Vulnerabilities', value: 3, change: -2, status: 'critical' },
  { label: 'High Risk Issues', value: 7, change: 1, status: 'warning' },
  { label: 'Security Score', value: 78, change: 5, status: 'good' },
  { label: 'Days Since Last Incident', value: 42, change: 42, status: 'good' }
];

const vulnerabilities: Vulnerability[] = [
  {
    id: 'VULN-001',
    title: 'SQL Injection in User Search',
    severity: 'critical',
    status: 'open',
    discoveredDate: '2024-09-20',
    component: 'Backend API'
  },
  {
    id: 'VULN-002',
    title: 'XSS in Comment Section',
    severity: 'high',
    status: 'in_progress',
    discoveredDate: '2024-09-18',
    component: 'Frontend'
  },
  {
    id: 'VULN-003',
    title: 'Weak Password Policy',
    severity: 'medium',
    status: 'open',
    discoveredDate: '2024-09-15',
    component: 'Authentication'
  },
  {
    id: 'VULN-004',
    title: 'Missing Rate Limiting',
    severity: 'high',
    status: 'open',
    discoveredDate: '2024-09-10',
    component: 'API Gateway'
  },
  {
    id: 'VULN-005',
    title: 'Outdated Dependencies',
    severity: 'medium',
    status: 'resolved',
    discoveredDate: '2024-09-01',
    component: 'Dependencies'
  }
];

const recentEvents: SecurityEvent[] = [
  {
    id: 'EVT-001',
    type: 'Authentication',
    message: 'Multiple failed login attempts from IP 192.168.1.100',
    timestamp: '2 hours ago',
    severity: 'warning'
  },
  {
    id: 'EVT-002',
    type: 'Firewall',
    message: 'DDoS attack mitigated - 50,000 requests blocked',
    timestamp: '5 hours ago',
    severity: 'error'
  },
  {
    id: 'EVT-003',
    type: 'System',
    message: 'Security patches applied successfully',
    timestamp: '1 day ago',
    severity: 'info'
  },
  {
    id: 'EVT-004',
    type: 'Compliance',
    message: 'Quarterly security audit completed',
    timestamp: '2 days ago',
    severity: 'info'
  }
];

export default function SecurityPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <XCircleIcon className="w-4 h-4 text-red-500" />;
      case 'in_progress': return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case 'resolved': return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const filteredVulnerabilities = showCriticalOnly
    ? vulnerabilities.filter(v => v.severity === 'critical' || v.severity === 'high')
    : vulnerabilities;

  return (
    <ProtectedRoute>
      <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Security Monitoring</h1>
        <p className="text-gray-600 mt-2">Real-time security posture and threat monitoring</p>
      </div>

      {/* Alert Banner */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex items-center">
          <ShieldExclamationIcon className="w-6 h-6 text-red-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Critical Security Alert</h3>
            <p className="text-sm text-red-700 mt-1">
              3 critical vulnerabilities require immediate attention. SQL injection vulnerability detected in production.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{metric.label}</span>
              {metric.change !== 0 && (
                <span className={`flex items-center text-xs font-medium ${
                  metric.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change > 0 ? (
                    <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(metric.change)}
                </span>
              )}
            </div>
            <div className={`text-3xl font-bold ${
              metric.status === 'critical' ? 'text-red-600' :
              metric.status === 'warning' ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {metric.value}
              {metric.label.includes('Score') && '%'}
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className={`h-2 rounded-full ${
                metric.status === 'critical' ? 'bg-red-500' :
                metric.status === 'warning' ? 'bg-yellow-500' :
                'bg-green-500'
              }`} style={{ width: `${metric.status === 'good' ? 100 : metric.value}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerabilities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <BugAntIcon className="w-6 h-6 text-red-600" />
              Active Vulnerabilities
            </h2>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showCriticalOnly}
                onChange={(e) => setShowCriticalOnly(e.target.checked)}
                className="rounded text-red-600"
              />
              Critical only
            </label>
          </div>

          <div className="space-y-3">
            {filteredVulnerabilities.map((vuln) => (
              <div key={vuln.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getSeverityColor(vuln.severity)}`}>
                        {vuln.severity.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{vuln.id}</span>
                    </div>
                    <h4 className="font-medium text-gray-900">{vuln.title}</h4>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{vuln.component}</span>
                      <span>•</span>
                      <span>Discovered: {vuln.discoveredDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(vuln.status)}
                    <span className="text-xs text-gray-600">{vuln.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <BellAlertIcon className="w-6 h-6 text-red-600" />
              Recent Security Events
            </h2>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="text-sm px-3 py-1 border border-gray-300 rounded-lg"
            >
              <option value="1d">Last 24h</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>

          <div className="space-y-3">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className={`mt-0.5 w-2 h-2 rounded-full ${
                  event.severity === 'error' ? 'bg-red-500' :
                  event.severity === 'warning' ? 'bg-yellow-500' :
                  'bg-gray-400'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${getSeverityColor(event.severity)}`}>
                      {event.type}
                    </span>
                    <span className="text-xs text-gray-500">{event.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700">{event.message}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium">
            View all events →
          </button>
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-4">Security Recommendations</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5" />
            <span className="text-sm text-red-800">
              Enable FIPS encryption mode for enhanced security (currently disabled)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5" />
            <span className="text-sm text-red-800">
              Review and update access control policies - 3 policies need attention
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5" />
            <span className="text-sm text-red-800">
              Schedule penetration testing - last test was 365 days ago
            </span>
          </li>
        </ul>
      </div>

      {/* CTF Hint */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          Debug: Check /api/admin/downloadAuditTrail for security audit logs (no auth required - vulnerability)
        </p>
      </div>
      </div>
    </ProtectedRoute>
  );
}