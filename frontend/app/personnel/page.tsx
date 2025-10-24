'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

import { useState } from 'react';
import {
  UserGroupIcon,
  UserIcon,
  ShieldCheckIcon,
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface Person {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  accessLevel: 'admin' | 'privileged' | 'standard' | 'restricted';
  status: 'active' | 'inactive' | 'suspended' | 'offboarding';
  startDate: string;
  lastLogin: string;
  trainingStatus: 'compliant' | 'pending' | 'overdue' | 'exempt';
  backgroundCheck: boolean;
  mfaEnabled: boolean;
}

const personnel: Person[] = [
  {
    id: 'EMP-001',
    name: 'Alice Johnson',
    email: 'alice.johnson@dvtc.local',
    department: 'Engineering',
    role: 'Senior Developer',
    accessLevel: 'privileged',
    status: 'active',
    startDate: '2022-03-15',
    lastLogin: '2 hours ago',
    trainingStatus: 'compliant',
    backgroundCheck: true,
    mfaEnabled: true
  },
  {
    id: 'EMP-002',
    name: 'Bob Smith',
    email: 'bob.smith@dvtc.local',
    department: 'Security',
    role: 'Security Administrator',
    accessLevel: 'admin',
    status: 'active',
    startDate: '2021-01-10',
    lastLogin: '5 minutes ago',
    trainingStatus: 'compliant',
    backgroundCheck: true,
    mfaEnabled: true
  },
  {
    id: 'EMP-003',
    name: 'Carol White',
    email: 'carol.white@dvtc.local',
    department: 'Sales',
    role: 'Account Executive',
    accessLevel: 'standard',
    status: 'active',
    startDate: '2023-06-01',
    lastLogin: '1 day ago',
    trainingStatus: 'pending',
    backgroundCheck: true,
    mfaEnabled: false
  },
  {
    id: 'EMP-004',
    name: 'David Brown',
    email: 'david.brown@dvtc.local',
    department: 'IT',
    role: 'System Administrator',
    accessLevel: 'admin',
    status: 'suspended',
    startDate: '2020-11-20',
    lastLogin: '1 week ago',
    trainingStatus: 'overdue',
    backgroundCheck: true,
    mfaEnabled: true
  },
  {
    id: 'EMP-005',
    name: 'Eve Davis',
    email: 'eve.davis@dvtc.local',
    department: 'HR',
    role: 'HR Manager',
    accessLevel: 'privileged',
    status: 'active',
    startDate: '2021-08-15',
    lastLogin: '3 hours ago',
    trainingStatus: 'compliant',
    backgroundCheck: true,
    mfaEnabled: true
  },
  {
    id: 'EMP-006',
    name: 'Frank Miller',
    email: 'frank.miller@dvtc.local',
    department: 'Finance',
    role: 'CFO',
    accessLevel: 'admin',
    status: 'active',
    startDate: '2019-05-01',
    lastLogin: '1 hour ago',
    trainingStatus: 'exempt',
    backgroundCheck: true,
    mfaEnabled: false
  },
  {
    id: 'CONT-001',
    name: 'Grace Lee',
    email: 'grace.lee@external.com',
    department: 'Engineering',
    role: 'Contractor',
    accessLevel: 'restricted',
    status: 'offboarding',
    startDate: '2024-01-15',
    lastLogin: '3 days ago',
    trainingStatus: 'compliant',
    backgroundCheck: false,
    mfaEnabled: false
  }
];

export default function PersonnelPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'admin': return 'text-red-600 bg-red-100';
      case 'privileged': return 'text-orange-600 bg-orange-100';
      case 'standard': return 'text-green-600 bg-green-100';
      case 'restricted': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'offboarding': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrainingIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'pending': return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case 'overdue': return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
      case 'exempt': return <DocumentTextIcon className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  const filteredPersonnel = personnel.filter(person => {
    if (selectedDepartment !== 'all' && person.department !== selectedDepartment) return false;
    if (selectedStatus !== 'all' && person.status !== selectedStatus) return false;
    if (searchTerm && !person.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !person.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const activeCount = personnel.filter(p => p.status === 'active').length;
  const adminCount = personnel.filter(p => p.accessLevel === 'admin').length;
  const mfaCount = personnel.filter(p => p.mfaEnabled).length;
  const trainingCompliant = personnel.filter(p => p.trainingStatus === 'compliant' || p.trainingStatus === 'exempt').length;

  return (
    <ProtectedRoute>
      <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Personnel Management</h1>
        <p className="text-gray-600 mt-2">Manage employee access, training, and compliance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Personnel</span>
            <UserGroupIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{personnel.length}</div>
          <div className="text-xs text-gray-500 mt-1">{activeCount} active</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Admin Access</span>
            <ShieldCheckIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600">{adminCount}</div>
          <div className="text-xs text-gray-500 mt-1">Privileged users</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">MFA Enabled</span>
            <KeyIcon className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600">
            {Math.round((mfaCount / personnel.length) * 100)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">{mfaCount} of {personnel.length}</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Training Compliant</span>
            <DocumentTextIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600">
            {Math.round((trainingCompliant / personnel.length) * 100)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">{trainingCompliant} compliant</div>
        </div>
      </div>

      {/* Alert Banner */}
      {personnel.filter(p => p.trainingStatus === 'overdue').length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Training Alert</h3>
              <p className="text-sm text-yellow-700 mt-1">
                {personnel.filter(p => p.trainingStatus === 'overdue').length} employees have overdue security training.
                {personnel.filter(p => !p.mfaEnabled && p.status === 'active').length} active users without MFA.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Departments</option>
            {[...new Set(personnel.map(p => p.department))].map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="offboarding">Offboarding</option>
          </select>

          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
            + Add Personnel
          </button>
        </div>
      </div>

      {/* Personnel Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Access Level</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Training</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Security</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPersonnel.map((person) => (
              <tr key={person.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{person.name}</div>
                      <div className="text-xs text-gray-500">{person.email}</div>
                      <div className="text-xs text-gray-400">{person.id} • {person.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{person.department}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAccessLevelColor(person.accessLevel)}`}>
                    {person.accessLevel.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(person.status)}`}>
                    {person.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getTrainingIcon(person.trainingStatus)}
                    <span className="text-sm text-gray-600">{person.trainingStatus}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      {person.mfaEnabled ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircleIcon className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-gray-600">MFA</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {person.backgroundCheck ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircleIcon className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-gray-600">BGC</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{person.lastLogin}</div>
                  <div className="text-xs text-gray-400">Started: {person.startDate}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Access Review Schedule */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Access Reviews</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-red-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Quarterly Admin Access Review</div>
                <div className="text-xs text-gray-500">Review all admin and privileged access</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">Oct 1, 2024</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-red-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Annual Security Training</div>
                <div className="text-xs text-gray-500">Mandatory for all personnel</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">Nov 15, 2024</div>
          </div>
        </div>
      </div>

      {/* CTF Hint */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          Debug: Employee directory with SSNs exposed at /api/personnel/export?include_pii=true
        </p>
      </div>
      </div>
    </ProtectedRoute>
  );
}