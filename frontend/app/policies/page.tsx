'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

interface Policy {
  id: string;
  name: string;
  frameworks: string[];
  status: 'ok' | 'needs_review' | 'expired';
  lastApproved: string;
  owner: string;
  version: string;
  personnelAcceptance: number;
}

const policies: Policy[] = [
  {
    id: 'COC-001',
    name: 'Code of Conduct',
    frameworks: ['SOC 2', 'ISO 27001'],
    status: 'ok',
    lastApproved: 'Apr 30, 2024',
    owner: 'Jane Smith',
    version: '2.1',
    personnelAcceptance: 100
  },
  {
    id: 'ISP-001',
    name: 'Information Security Policy (AUP)',
    frameworks: ['SOC 2', 'ISO 27001', 'HIPAA'],
    status: 'ok',
    lastApproved: 'Apr 30, 2024',
    owner: 'John Doe',
    version: '3.0',
    personnelAcceptance: 98
  },
  {
    id: 'AMP-001',
    name: 'Asset Management Policy',
    frameworks: ['SOC 2', 'ISO 27001'],
    status: 'ok',
    lastApproved: 'Apr 30, 2024',
    owner: 'Alice Johnson',
    version: '1.5',
    personnelAcceptance: 95
  },
  {
    id: 'ISR-001',
    name: 'Information Security Roles and Responsibilities',
    frameworks: ['SOC 2', 'ISO 27001', 'GDPR'],
    status: 'needs_review',
    lastApproved: 'Apr 30, 2024',
    owner: 'Bob Williams',
    version: '2.0',
    personnelAcceptance: 92
  },
  {
    id: 'ACP-001',
    name: 'Access Control Policy',
    frameworks: ['SOC 2', 'ISO 27001', 'HIPAA'],
    status: 'ok',
    lastApproved: 'Apr 30, 2024',
    owner: 'Carol Davis',
    version: '2.3',
    personnelAcceptance: 100
  },
  {
    id: 'DMP-001',
    name: 'Data Management Policy',
    frameworks: ['SOC 2', 'GDPR'],
    status: 'ok',
    lastApproved: 'Apr 30, 2024',
    owner: 'David Brown',
    version: '1.8',
    personnelAcceptance: 88
  },
  {
    id: 'HRS-001',
    name: 'Human Resource Security Policy',
    frameworks: ['SOC 2', 'ISO 27001'],
    status: 'expired',
    lastApproved: 'Jan 15, 2024',
    owner: 'Eve Martinez',
    version: '1.2',
    personnelAcceptance: 76
  },
  {
    id: 'OPS-001',
    name: 'Operations Security Policy',
    frameworks: ['SOC 2', 'ISO 27001'],
    status: 'ok',
    lastApproved: 'Apr 30, 2024',
    owner: 'Frank Wilson',
    version: '2.5',
    personnelAcceptance: 100
  },
  {
    id: 'PSP-001',
    name: 'Physical Security Policy',
    frameworks: ['SOC 2', 'ISO 27001'],
    status: 'ok',
    lastApproved: 'Apr 30, 2024',
    owner: 'Grace Lee',
    version: '1.9',
    personnelAcceptance: 94
  },
  {
    id: 'RMP-001',
    name: 'Risk Management Policy',
    frameworks: ['SOC 2', 'ISO 27001'],
    status: 'ok',
    lastApproved: 'Apr 30, 2024',
    owner: 'Henry Chen',
    version: '3.1',
    personnelAcceptance: 97
  },
  {
    id: 'TPM-001',
    name: 'Third-Party Management Policy',
    frameworks: ['SOC 2', 'GDPR'],
    status: 'needs_review',
    lastApproved: 'May 2, 2024',
    owner: 'Iris Taylor',
    version: '2.2',
    personnelAcceptance: 85
  }
];

export default function PoliciesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [density, setDensity] = useState<'comfortable' | 'regular' | 'dense'>('regular');

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFramework = selectedFramework === 'All' || policy.frameworks.includes(selectedFramework);
    const matchesStatus = selectedStatus === 'All' || policy.status === selectedStatus;
    return matchesSearch && matchesFramework && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ok':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <CheckCircleSolid className="w-3 h-3" />
            OK
          </span>
        );
      case 'needs_review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            Needs Review
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  const getRowPadding = () => {
    switch (density) {
      case 'comfortable': return 'py-4';
      case 'dense': return 'py-2';
      default: return 'py-3';
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Policies</h1>
        <p className="text-gray-600 mt-2">Manage and review your compliance policies</p>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="All">All Frameworks</option>
              <option value="SOC 2">SOC 2</option>
              <option value="ISO 27001">ISO 27001</option>
              <option value="HIPAA">HIPAA</option>
              <option value="GDPR">GDPR</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="All">All Status</option>
              <option value="ok">OK</option>
              <option value="needs_review">Needs Review</option>
              <option value="expired">Expired</option>
            </select>

            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FunnelIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Add custom policy
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Edit SLAs
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              More <ChevronDownIcon className="inline w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* View Options */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded"
            >
              <option value="name">Name</option>
              <option value="frameworks">Frameworks</option>
              <option value="status">Status</option>
              <option value="lastApproved">Last approved on</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Density:</span>
            <div className="flex gap-1 bg-gray-100 p-1 rounded">
              <button
                onClick={() => setDensity('dense')}
                className={`px-2 py-1 text-xs rounded ${density === 'dense' ? 'bg-white shadow' : ''}`}
              >
                Dense
              </button>
              <button
                onClick={() => setDensity('regular')}
                className={`px-2 py-1 text-xs rounded ${density === 'regular' ? 'bg-white shadow' : ''}`}
              >
                Regular
              </button>
              <button
                onClick={() => setDensity('comfortable')}
                className={`px-2 py-1 text-xs rounded ${density === 'comfortable' ? 'bg-white shadow' : ''}`}
              >
                Comfortable
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Policies Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Frameworks</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Last approved on</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Personnel acceptance</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPolicies.map((policy) => (
              <tr key={policy.id} className="hover:bg-gray-50">
                <td className={`px-6 ${getRowPadding()}`}>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                    <div className="text-xs text-gray-500">v{policy.version} · {policy.owner}</div>
                  </div>
                </td>
                <td className={`px-6 ${getRowPadding()}`}>
                  <div className="flex flex-wrap gap-1">
                    {policy.frameworks.map((fw) => (
                      <span key={fw} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                        {fw}
                      </span>
                    ))}
                  </div>
                </td>
                <td className={`px-6 ${getRowPadding()}`}>
                  {getStatusBadge(policy.status)}
                </td>
                <td className={`px-6 ${getRowPadding()} text-sm text-gray-600`}>
                  {policy.lastApproved}
                </td>
                <td className={`px-6 ${getRowPadding()}`}>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">{policy.personnelAcceptance}%</span>
                  </div>
                </td>
                <td className={`px-6 ${getRowPadding()}`}>
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <EllipsisVerticalIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div>
          Showing {filteredPolicies.length} of {policies.length} policies
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Previous</button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Next</button>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}