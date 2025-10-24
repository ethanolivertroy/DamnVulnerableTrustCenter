'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  ServerIcon,
  ComputerDesktopIcon,
  CloudIcon,
  CpuChipIcon,
  CircleStackIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Asset {
  id: string;
  name: string;
  type: 'server' | 'workstation' | 'cloud' | 'database' | 'network' | 'application';
  category: string;
  owner: string;
  location: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'inactive' | 'maintenance' | 'decommissioned';
  lastUpdated: string;
  compliance: boolean;
  vulnerabilities: number;
}

const assets: Asset[] = [
  {
    id: 'ASSET-001',
    name: 'prod-api-server-01',
    type: 'server',
    category: 'Production',
    owner: 'Infrastructure Team',
    location: 'AWS US-East-1',
    criticality: 'critical',
    status: 'active',
    lastUpdated: '2024-09-20',
    compliance: true,
    vulnerabilities: 2
  },
  {
    id: 'ASSET-002',
    name: 'customer-database',
    type: 'database',
    category: 'Production',
    owner: 'Data Team',
    location: 'AWS RDS',
    criticality: 'critical',
    status: 'active',
    lastUpdated: '2024-09-19',
    compliance: false,
    vulnerabilities: 5
  },
  {
    id: 'ASSET-003',
    name: 'dev-workstation-42',
    type: 'workstation',
    category: 'Development',
    owner: 'John Doe',
    location: 'Office - Floor 3',
    criticality: 'low',
    status: 'active',
    lastUpdated: '2024-09-15',
    compliance: true,
    vulnerabilities: 0
  },
  {
    id: 'ASSET-004',
    name: 'load-balancer-01',
    type: 'network',
    category: 'Infrastructure',
    owner: 'Network Team',
    location: 'AWS ELB',
    criticality: 'high',
    status: 'active',
    lastUpdated: '2024-09-18',
    compliance: true,
    vulnerabilities: 1
  },
  {
    id: 'ASSET-005',
    name: 'backup-storage',
    type: 'cloud',
    category: 'Backup',
    owner: 'Operations Team',
    location: 'AWS S3',
    criticality: 'high',
    status: 'maintenance',
    lastUpdated: '2024-09-10',
    compliance: true,
    vulnerabilities: 0
  },
  {
    id: 'ASSET-006',
    name: 'customer-portal',
    type: 'application',
    category: 'Production',
    owner: 'Product Team',
    location: 'Kubernetes Cluster',
    criticality: 'critical',
    status: 'active',
    lastUpdated: '2024-09-21',
    compliance: false,
    vulnerabilities: 8
  },
  {
    id: 'ASSET-007',
    name: 'monitoring-server',
    type: 'server',
    category: 'Infrastructure',
    owner: 'DevOps Team',
    location: 'On-Premise DC1',
    criticality: 'medium',
    status: 'active',
    lastUpdated: '2024-09-17',
    compliance: true,
    vulnerabilities: 3
  },
  {
    id: 'ASSET-008',
    name: 'legacy-app-server',
    type: 'server',
    category: 'Legacy',
    owner: 'IT Team',
    location: 'On-Premise DC2',
    criticality: 'low',
    status: 'decommissioned',
    lastUpdated: '2024-08-01',
    compliance: false,
    vulnerabilities: 15
  }
];

export default function AssetsPage() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCriticality, setSelectedCriticality] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'server': return <ServerIcon className="w-5 h-5 text-red-600" />;
      case 'workstation': return <ComputerDesktopIcon className="w-5 h-5 text-blue-600" />;
      case 'cloud': return <CloudIcon className="w-5 h-5 text-cyan-600" />;
      case 'database': return <CircleStackIcon className="w-5 h-5 text-green-600" />;
      case 'network': return <GlobeAltIcon className="w-5 h-5 text-orange-600" />;
      case 'application': return <CpuChipIcon className="w-5 h-5 text-indigo-600" />;
      default: return null;
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'decommissioned': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredAssets = assets.filter(asset => {
    if (selectedType !== 'all' && asset.type !== selectedType) return false;
    if (selectedCriticality !== 'all' && asset.criticality !== selectedCriticality) return false;
    if (searchTerm && !asset.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const activeAssets = assets.filter(a => a.status === 'active').length;
  const criticalAssets = assets.filter(a => a.criticality === 'critical').length;
  const nonCompliant = assets.filter(a => !a.compliance).length;
  const totalVulnerabilities = assets.reduce((sum, a) => sum + a.vulnerabilities, 0);

  return (
    <ProtectedRoute>
      <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Asset Inventory</h1>
        <p className="text-gray-600 mt-2">Track and manage your organization's IT assets</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Assets</span>
            <ServerIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{assets.length}</div>
          <div className="text-xs text-gray-500 mt-1">{activeAssets} active</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Critical Assets</span>
            <ShieldCheckIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600">{criticalAssets}</div>
          <div className="text-xs text-gray-500 mt-1">Require protection</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Non-Compliant</span>
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-yellow-600">{nonCompliant}</div>
          <div className="text-xs text-gray-500 mt-1">Need attention</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Vulnerabilities</span>
            <LockClosedIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600">{totalVulnerabilities}</div>
          <div className="text-xs text-gray-500 mt-1">Across all assets</div>
        </div>
      </div>

      {/* Asset Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Asset Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {['server', 'workstation', 'cloud', 'database', 'network', 'application'].map((type) => {
            const count = assets.filter(a => a.type === type).length;
            return (
              <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-center mb-2">{getTypeIcon(type)}</div>
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-xs text-gray-600 capitalize">{type}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Types</option>
            <option value="server">Server</option>
            <option value="workstation">Workstation</option>
            <option value="cloud">Cloud</option>
            <option value="database">Database</option>
            <option value="network">Network</option>
            <option value="application">Application</option>
          </select>

          <select
            value={selectedCriticality}
            onChange={(e) => setSelectedCriticality(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Criticality</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
            + Add Asset
          </button>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Criticality</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Vulnerabilities</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAssets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(asset.type)}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                      <div className="text-xs text-gray-500">{asset.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 capitalize">{asset.category}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{asset.owner}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{asset.location}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCriticalityColor(asset.criticality)}`}>
                    {asset.criticality.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(asset.status)}`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {asset.compliance ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${
                    asset.vulnerabilities > 5 ? 'text-red-600' :
                    asset.vulnerabilities > 0 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {asset.vulnerabilities}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CTF Hint */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          Debug: Asset inventory exported daily to /tmp/assets_export.csv with plaintext credentials
        </p>
      </div>
      </div>
    </ProtectedRoute>
  );
}