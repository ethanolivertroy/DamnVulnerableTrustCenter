'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Risk {
  id: string;
  title: string;
  category: 'operational' | 'compliance' | 'security' | 'financial' | 'reputational';
  likelihood: 'low' | 'medium' | 'high' | 'critical';
  impact: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  status: 'open' | 'mitigating' | 'accepted' | 'closed';
  owner: string;
  dueDate: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

const risks: Risk[] = [
  {
    id: 'RISK-001',
    title: 'Unencrypted data transmission in legacy API',
    category: 'security',
    likelihood: 'high',
    impact: 'critical',
    score: 9.2,
    status: 'mitigating',
    owner: 'Security Team',
    dueDate: '2024-10-15',
    trend: 'decreasing'
  },
  {
    id: 'RISK-002',
    title: 'Vendor SLA non-compliance',
    category: 'operational',
    likelihood: 'medium',
    impact: 'high',
    score: 7.5,
    status: 'open',
    owner: 'Vendor Management',
    dueDate: '2024-10-30',
    trend: 'stable'
  },
  {
    id: 'RISK-003',
    title: 'SOC 2 audit finding - Access reviews',
    category: 'compliance',
    likelihood: 'low',
    impact: 'medium',
    score: 4.8,
    status: 'mitigating',
    owner: 'Compliance Team',
    dueDate: '2024-11-01',
    trend: 'decreasing'
  },
  {
    id: 'RISK-004',
    title: 'Third-party data breach exposure',
    category: 'reputational',
    likelihood: 'medium',
    impact: 'critical',
    score: 8.1,
    status: 'accepted',
    owner: 'Executive Team',
    dueDate: '2024-12-01',
    trend: 'increasing'
  },
  {
    id: 'RISK-005',
    title: 'Budget overrun in security initiatives',
    category: 'financial',
    likelihood: 'high',
    impact: 'medium',
    score: 6.9,
    status: 'open',
    owner: 'Finance Team',
    dueDate: '2024-10-20',
    trend: 'increasing'
  }
];

export default function RiskPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-100';
    if (score >= 6) return 'text-orange-600 bg-orange-100';
    if (score >= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security': return 'bg-red-100 text-red-700';
      case 'compliance': return 'bg-blue-100 text-blue-700';
      case 'operational': return 'bg-gray-100 text-gray-700';
      case 'financial': return 'bg-green-100 text-green-700';
      case 'reputational': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <ArrowTrendingUpIcon className="w-4 h-4 text-red-500" />;
      case 'decreasing': return <ArrowTrendingDownIcon className="w-4 h-4 text-green-500" />;
      default: return <span className="w-4 h-4 text-gray-400">—</span>;
    }
  };

  const filteredRisks = risks.filter(risk => {
    if (selectedCategory !== 'all' && risk.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && risk.status !== selectedStatus) return false;
    return true;
  });

  const criticalRisks = risks.filter(r => r.score >= 8).length;
  const highRisks = risks.filter(r => r.score >= 6 && r.score < 8).length;
  const mediumRisks = risks.filter(r => r.score >= 4 && r.score < 6).length;
  const lowRisks = risks.filter(r => r.score < 4).length;

  return (
    <ProtectedRoute>
      <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Risk Management</h1>
        <p className="text-gray-600 mt-2">Identify, assess, and mitigate organizational risks</p>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Risks</span>
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{risks.length}</div>
          <div className="text-xs text-gray-500 mt-1">Active in registry</div>
        </div>

        <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-red-700">Critical Risks</span>
            <ShieldExclamationIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600">{criticalRisks}</div>
          <div className="text-xs text-red-600 mt-1">Require immediate attention</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Avg Risk Score</span>
            <ChartBarIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {(risks.reduce((acc, r) => acc + r.score, 0) / risks.length).toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Across all categories</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Mitigating</span>
            <ClockIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600">
            {risks.filter(r => r.status === 'mitigating').length}
          </div>
          <div className="text-xs text-gray-500 mt-1">In progress</div>
        </div>
      </div>

      {/* Risk Heat Map */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Risk Heat Map</h2>
        <div className="grid grid-cols-5 gap-2">
          <div></div>
          <div className="text-center text-sm font-medium text-gray-600">Low</div>
          <div className="text-center text-sm font-medium text-gray-600">Medium</div>
          <div className="text-center text-sm font-medium text-gray-600">High</div>
          <div className="text-center text-sm font-medium text-gray-600">Critical</div>

          <div className="text-sm font-medium text-gray-600">Critical</div>
          <div className="h-20 bg-yellow-200 rounded flex items-center justify-center"></div>
          <div className="h-20 bg-orange-200 rounded flex items-center justify-center"></div>
          <div className="h-20 bg-red-200 rounded flex items-center justify-center">
            <span className="text-2xl font-bold text-red-700">1</span>
          </div>
          <div className="h-20 bg-red-300 rounded flex items-center justify-center">
            <span className="text-2xl font-bold text-red-800">1</span>
          </div>

          <div className="text-sm font-medium text-gray-600">High</div>
          <div className="h-20 bg-green-200 rounded flex items-center justify-center"></div>
          <div className="h-20 bg-yellow-200 rounded flex items-center justify-center"></div>
          <div className="h-20 bg-orange-200 rounded flex items-center justify-center">
            <span className="text-2xl font-bold text-orange-700">1</span>
          </div>
          <div className="h-20 bg-red-200 rounded flex items-center justify-center"></div>

          <div className="text-sm font-medium text-gray-600">Medium</div>
          <div className="h-20 bg-green-100 rounded flex items-center justify-center"></div>
          <div className="h-20 bg-green-200 rounded flex items-center justify-center">
            <span className="text-2xl font-bold text-green-700">1</span>
          </div>
          <div className="h-20 bg-yellow-200 rounded flex items-center justify-center">
            <span className="text-2xl font-bold text-yellow-700">1</span>
          </div>
          <div className="h-20 bg-orange-200 rounded flex items-center justify-center"></div>

          <div className="text-sm font-medium text-gray-600">Low</div>
          <div className="h-20 bg-green-50 rounded flex items-center justify-center"></div>
          <div className="h-20 bg-green-100 rounded flex items-center justify-center"></div>
          <div className="h-20 bg-green-200 rounded flex items-center justify-center"></div>
          <div className="h-20 bg-yellow-200 rounded flex items-center justify-center"></div>

          <div></div>
          <div className="text-center text-sm text-gray-500 pt-2">Impact →</div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-2">↑ Likelihood</div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Categories</option>
            <option value="security">Security</option>
            <option value="compliance">Compliance</option>
            <option value="operational">Operational</option>
            <option value="financial">Financial</option>
            <option value="reputational">Reputational</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="mitigating">Mitigating</option>
            <option value="accepted">Accepted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Risk Register */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRisks.map((risk) => (
              <tr key={risk.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{risk.title}</div>
                    <div className="text-xs text-gray-500">{risk.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(risk.category)}`}>
                    {risk.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-sm font-bold rounded-full ${getRiskColor(risk.score)}`}>
                    {risk.score.toFixed(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{risk.status}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{risk.owner}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{risk.dueDate}</td>
                <td className="px-6 py-4">
                  {getTrendIcon(risk.trend)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CTF Hint */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          Debug: Risk assessment reports exposed via unprotected API endpoint at /api/risk/export?format=csv
        </p>
      </div>
      </div>
    </ProtectedRoute>
  );
}