'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  BuildingOfficeIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface Vendor {
  id: string;
  name: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  complianceStatus: 'compliant' | 'pending' | 'non-compliant' | 'expired';
  contractExpiry: string;
  lastAssessment: string;
  dataAccess: string[];
  certifications: string[];
  spend: string;
}

const vendors: Vendor[] = [
  {
    id: 'VND-001',
    name: 'AWS Cloud Services',
    category: 'Infrastructure',
    riskLevel: 'low',
    complianceStatus: 'compliant',
    contractExpiry: '2025-12-31',
    lastAssessment: '2024-08-15',
    dataAccess: ['Customer Data', 'Application Data', 'Logs'],
    certifications: ['SOC 2', 'ISO 27001', 'HIPAA'],
    spend: '$125,000/year'
  },
  {
    id: 'VND-002',
    name: 'Salesforce CRM',
    category: 'Software',
    riskLevel: 'medium',
    complianceStatus: 'pending',
    contractExpiry: '2025-03-31',
    lastAssessment: '2024-06-01',
    dataAccess: ['Customer PII', 'Sales Data'],
    certifications: ['SOC 2', 'ISO 27001'],
    spend: '$45,000/year'
  },
  {
    id: 'VND-003',
    name: 'SecureAuth Inc',
    category: 'Security',
    riskLevel: 'low',
    complianceStatus: 'compliant',
    contractExpiry: '2024-11-30',
    lastAssessment: '2024-09-01',
    dataAccess: ['Authentication Data'],
    certifications: ['SOC 2', 'FIPS 140-2'],
    spend: '$30,000/year'
  },
  {
    id: 'VND-004',
    name: 'DataClean Solutions',
    category: 'Data Processing',
    riskLevel: 'high',
    complianceStatus: 'non-compliant',
    contractExpiry: '2024-10-15',
    lastAssessment: '2024-03-15',
    dataAccess: ['Customer Data', 'Financial Data'],
    certifications: ['None'],
    spend: '$15,000/year'
  },
  {
    id: 'VND-005',
    name: 'TechSupport Global',
    category: 'Services',
    riskLevel: 'critical',
    complianceStatus: 'expired',
    contractExpiry: '2024-09-01',
    lastAssessment: '2023-12-01',
    dataAccess: ['Support Tickets', 'Customer Communications'],
    certifications: ['ISO 9001'],
    spend: '$8,000/month'
  }
];

export default function VendorPage() {
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedCompliance, setSelectedCompliance] = useState<string>('all');

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'pending': return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'non-compliant': return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'expired': return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
      default: return null;
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    if (selectedRisk !== 'all' && vendor.riskLevel !== selectedRisk) return false;
    if (selectedCompliance !== 'all' && vendor.complianceStatus !== selectedCompliance) return false;
    return true;
  });

  const totalSpend = vendors.reduce((acc, v) => {
    const amount = parseInt(v.spend.replace(/[^0-9]/g, ''));
    const isMonthly = v.spend.includes('month');
    return acc + (isMonthly ? amount * 12 : amount);
  }, 0);

  return (
    <ProtectedRoute>
      <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
        <p className="text-gray-600 mt-2">Monitor and assess third-party vendor risks and compliance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Vendors</span>
            <BuildingOfficeIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{vendors.length}</div>
          <div className="text-xs text-gray-500 mt-1">Active relationships</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">High Risk</span>
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600">
            {vendors.filter(v => v.riskLevel === 'high' || v.riskLevel === 'critical').length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Require review</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Compliant</span>
            <ShieldCheckIcon className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600">
            {vendors.filter(v => v.complianceStatus === 'compliant').length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Meeting requirements</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Annual Spend</span>
            <span className="text-red-600 text-xs">USD</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${(totalSpend / 1000).toFixed(0)}k
          </div>
          <div className="text-xs text-gray-500 mt-1">Across all vendors</div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Action Required</h3>
            <p className="text-sm text-red-700 mt-1">
              2 vendors have expired contracts. 1 vendor failed security assessment.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-4">
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
            <option value="critical">Critical Risk</option>
          </select>

          <select
            value={selectedCompliance}
            onChange={(e) => setSelectedCompliance(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Compliance</option>
            <option value="compliant">Compliant</option>
            <option value="pending">Pending</option>
            <option value="non-compliant">Non-Compliant</option>
            <option value="expired">Expired</option>
          </select>

          <button className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
            + Add Vendor
          </button>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Data Access</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Spend</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredVendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                    <div className="text-xs text-gray-500">{vendor.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{vendor.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(vendor.riskLevel)}`}>
                    {vendor.riskLevel.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getComplianceIcon(vendor.complianceStatus)}
                    <span className="text-sm text-gray-600">
                      {vendor.complianceStatus.replace('-', ' ')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-gray-600">
                    {vendor.dataAccess.slice(0, 2).join(', ')}
                    {vendor.dataAccess.length > 2 && (
                      <span className="text-red-600"> +{vendor.dataAccess.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{vendor.contractExpiry}</div>
                  <div className="text-xs text-gray-500">
                    Last assessed: {vendor.lastAssessment}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{vendor.spend}</td>
                <td className="px-6 py-4">
                  <button className="text-red-600 hover:text-red-700">
                    <ArrowPathIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Certifications Overview */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Certifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['SOC 2', 'ISO 27001', 'HIPAA', 'GDPR'].map((cert) => {
            const count = vendors.filter(v => v.certifications.includes(cert)).length;
            return (
              <div key={cert} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{count}</div>
                <div className="text-sm text-gray-600">{cert}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTF Hint */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          Debug: Vendor assessment questionnaires stored in public S3 bucket: dvtc-vendor-docs
        </p>
      </div>
      </div>
    </ProtectedRoute>
  );
}