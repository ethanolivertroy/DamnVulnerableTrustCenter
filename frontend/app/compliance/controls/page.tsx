'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid, XCircleIcon as XCircleSolid } from '@heroicons/react/24/solid';

interface Control {
  id: string;
  name: string;
  description: string;
  status: 'implemented' | 'in_progress' | 'not_started';
  testStatus: 'passed' | 'failed' | 'not_tested';
  owner: string;
  lastTested: string;
  evidence: number;
  category: string;
}

interface Framework {
  id: string;
  name: string;
  controlCount: number;
}

const frameworks: Framework[] = [
  { id: 'soc2', name: 'SOC 2 Type II', controlCount: 104 },
  { id: 'iso27001', name: 'ISO 27001', controlCount: 114 },
  { id: 'fedramp', name: 'FedRAMP Moderate', controlCount: 325 },
  { id: 'hipaa', name: 'HIPAA', controlCount: 78 },
  { id: 'gdpr', name: 'GDPR', controlCount: 89 },
  { id: 'pci', name: 'PCI DSS', controlCount: 264 },
];

// Sample controls for SOC 2
const soc2Controls: Control[] = [
  {
    id: 'CC-1.1',
    name: 'COSO Principle 1',
    description: 'The entity demonstrates a commitment to integrity and ethical values',
    status: 'implemented',
    testStatus: 'passed',
    owner: 'Jane Smith',
    lastTested: 'Apr 15, 2024',
    evidence: 5,
    category: 'Common Criteria'
  },
  {
    id: 'CC-1.2',
    name: 'Board Independence',
    description: 'The board of directors demonstrates independence from management',
    status: 'implemented',
    testStatus: 'passed',
    owner: 'John Doe',
    lastTested: 'Apr 10, 2024',
    evidence: 3,
    category: 'Common Criteria'
  },
  {
    id: 'CC-2.1',
    name: 'Risk Assessment',
    description: 'The entity specifies objectives with sufficient clarity',
    status: 'implemented',
    testStatus: 'passed',
    owner: 'Sarah Johnson',
    lastTested: 'Apr 20, 2024',
    evidence: 8,
    category: 'Common Criteria'
  },
  {
    id: 'CC-3.1',
    name: 'Information and Communication',
    description: 'The entity obtains or generates relevant quality information',
    status: 'in_progress',
    testStatus: 'not_tested',
    owner: 'Mike Chen',
    lastTested: 'N/A',
    evidence: 2,
    category: 'Common Criteria'
  },
  {
    id: 'CC-4.1',
    name: 'Monitoring Activities',
    description: 'The entity selects, develops, and performs ongoing monitoring',
    status: 'implemented',
    testStatus: 'failed',
    owner: 'Jane Smith',
    lastTested: 'Apr 25, 2024',
    evidence: 4,
    category: 'Common Criteria'
  },
];

// Sample controls for ISO 27001
const iso27001Controls: Control[] = [
  {
    id: 'A.5.1.1',
    name: 'Information Security Policies',
    description: 'A set of policies for information security shall be defined',
    status: 'implemented',
    testStatus: 'passed',
    owner: 'Jane Smith',
    lastTested: 'Jan 10, 2024',
    evidence: 6,
    category: 'Organizational Controls'
  },
  {
    id: 'A.6.1.1',
    name: 'Information Security Roles',
    description: 'All information security responsibilities shall be defined',
    status: 'implemented',
    testStatus: 'passed',
    owner: 'John Doe',
    lastTested: 'Jan 15, 2024',
    evidence: 4,
    category: 'People Controls'
  },
  {
    id: 'A.8.1.1',
    name: 'Asset Inventory',
    description: 'Assets associated with information shall be identified',
    status: 'in_progress',
    testStatus: 'not_tested',
    owner: 'Sarah Johnson',
    lastTested: 'N/A',
    evidence: 3,
    category: 'Technology Controls'
  },
];

// Sample controls for FedRAMP
const fedrampControls: Control[] = [
  {
    id: 'AC-1',
    name: 'Access Control Policy and Procedures',
    description: 'Develop, document, and disseminate access control policy',
    status: 'implemented',
    testStatus: 'passed',
    owner: 'Jane Smith',
    lastTested: 'Nov 10, 2024',
    evidence: 7,
    category: 'Access Control'
  },
  {
    id: 'AC-2',
    name: 'Account Management',
    description: 'Manage information system accounts',
    status: 'implemented',
    testStatus: 'passed',
    owner: 'Mike Chen',
    lastTested: 'Nov 12, 2024',
    evidence: 9,
    category: 'Access Control'
  },
  {
    id: 'AU-1',
    name: 'Audit and Accountability Policy',
    description: 'Develop, document, and disseminate audit policy',
    status: 'in_progress',
    testStatus: 'not_tested',
    owner: 'Sarah Johnson',
    lastTested: 'N/A',
    evidence: 2,
    category: 'Audit and Accountability'
  },
  {
    id: 'CM-1',
    name: 'Configuration Management Policy',
    description: 'Develop, document, and disseminate configuration management policy',
    status: 'implemented',
    testStatus: 'passed',
    owner: 'John Doe',
    lastTested: 'Nov 8, 2024',
    evidence: 5,
    category: 'Configuration Management'
  },
];

const controlsByFramework: Record<string, Control[]> = {
  soc2: soc2Controls,
  iso27001: iso27001Controls,
  fedramp: fedrampControls,
  hipaa: soc2Controls.slice(0, 3), // Placeholder
  gdpr: iso27001Controls.slice(0, 2), // Placeholder
  pci: soc2Controls.slice(0, 4), // Placeholder
};

export default function ControlsPage() {
  const [selectedFramework, setSelectedFramework] = useState<string>('soc2');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [testStatusFilter, setTestStatusFilter] = useState<string>('all');

  const controls = controlsByFramework[selectedFramework] || [];

  const filteredControls = controls.filter(control => {
    const matchesSearch =
      control.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || control.status === statusFilter;
    const matchesTestStatus = testStatusFilter === 'all' || control.testStatus === testStatusFilter;

    return matchesSearch && matchesStatus && matchesTestStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'text-green-700 bg-green-100';
      case 'in_progress': return 'text-yellow-700 bg-yellow-100';
      case 'not_started': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getTestStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircleSolid className="w-5 h-5 text-green-600" />;
      case 'failed': return <XCircleSolid className="w-5 h-5 text-red-600" />;
      case 'not_tested': return <ClockIcon className="w-5 h-5 text-gray-400" />;
      default: return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const stats = {
    total: controls.length,
    implemented: controls.filter(c => c.status === 'implemented').length,
    passed: controls.filter(c => c.testStatus === 'passed').length,
    failed: controls.filter(c => c.testStatus === 'failed').length,
  };

  return (
    <ProtectedRoute>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Security Controls</h1>
          <p className="text-gray-600 mt-2">View and manage framework-specific security controls</p>
        </div>

        {/* Framework Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Select Framework</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {frameworks.map((framework) => (
              <button
                key={framework.id}
                onClick={() => setSelectedFramework(framework.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedFramework === framework.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-semibold text-gray-900 text-sm mb-1">{framework.name}</div>
                <div className="text-xs text-gray-600">{framework.controlCount} controls</div>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600 mt-1">Total Controls</div>
              </div>
              <ShieldCheckIcon className="w-10 h-10 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.implemented}</div>
                <div className="text-sm text-gray-600 mt-1">Implemented</div>
              </div>
              <CheckCircleIcon className="w-10 h-10 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
                <div className="text-sm text-gray-600 mt-1">Tests Passed</div>
              </div>
              <CheckCircleSolid className="w-10 h-10 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-sm text-gray-600 mt-1">Tests Failed</div>
              </div>
              <XCircleSolid className="w-10 h-10 text-red-400" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search controls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="implemented">Implemented</option>
              <option value="in_progress">In Progress</option>
              <option value="not_started">Not Started</option>
            </select>
            <select
              value={testStatusFilter}
              onChange={(e) => setTestStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Test Status</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="not_tested">Not Tested</option>
            </select>
          </div>
        </div>

        {/* Controls Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Control ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name & Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Tested
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredControls.length > 0 ? (
                  filteredControls.map((control) => (
                    <tr key={control.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-red-600">{control.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{control.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{control.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{control.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(control.status)}`}>
                          {control.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getTestStatusIcon(control.testStatus)}
                          <span className="text-sm text-gray-600 capitalize">
                            {control.testStatus.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{control.owner}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{control.evidence} files</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{control.lastTested}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="text-gray-500">No controls found matching your filters</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-600">
          Showing {filteredControls.length} of {controls.length} controls for {frameworks.find(f => f.id === selectedFramework)?.name}
        </div>
      </div>
    </ProtectedRoute>
  );
}
