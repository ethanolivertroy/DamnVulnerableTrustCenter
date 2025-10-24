'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  DocumentTextIcon,
  FolderIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ShareIcon,
  EllipsisVerticalIcon,
  CalendarIcon,
  TagIcon,
  DocumentChartBarIcon,
  ShieldCheckIcon,
  ClipboardDocumentCheckIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

interface Document {
  id: string;
  name: string;
  type: 'policy' | 'procedure' | 'evidence' | 'certification' | 'report';
  frameworks: string[];
  uploadDate: string;
  size: string;
  uploadedBy: string;
  version: string;
  status: 'current' | 'archived' | 'draft';
}

const documents: Document[] = [
  {
    id: 'DOC-001',
    name: 'SOC 2 Type II Audit Report 2024',
    type: 'report',
    frameworks: ['SOC 2'],
    uploadDate: 'May 1, 2024',
    size: '2.4 MB',
    uploadedBy: 'Jane Smith',
    version: '1.0',
    status: 'current'
  },
  {
    id: 'DOC-002',
    name: 'Information Security Policy',
    type: 'policy',
    frameworks: ['SOC 2', 'ISO 27001', 'HIPAA'],
    uploadDate: 'Apr 30, 2024',
    size: '856 KB',
    uploadedBy: 'John Doe',
    version: '3.0',
    status: 'current'
  },
  {
    id: 'DOC-003',
    name: 'ISO 27001 Certificate',
    type: 'certification',
    frameworks: ['ISO 27001'],
    uploadDate: 'Jan 15, 2024',
    size: '124 KB',
    uploadedBy: 'Sarah Johnson',
    version: '1.0',
    status: 'current'
  },
  {
    id: 'DOC-004',
    name: 'Access Control Procedure',
    type: 'procedure',
    frameworks: ['SOC 2', 'ISO 27001', 'FedRAMP'],
    uploadDate: 'Apr 20, 2024',
    size: '512 KB',
    uploadedBy: 'Mike Chen',
    version: '2.1',
    status: 'current'
  },
  {
    id: 'DOC-005',
    name: 'Penetration Test Results Q1 2024',
    type: 'evidence',
    frameworks: ['SOC 2', 'ISO 27001'],
    uploadDate: 'Apr 5, 2024',
    size: '3.2 MB',
    uploadedBy: 'Jane Smith',
    version: '1.0',
    status: 'current'
  },
  {
    id: 'DOC-006',
    name: 'HIPAA Compliance Report',
    type: 'report',
    frameworks: ['HIPAA'],
    uploadDate: 'Mar 20, 2024',
    size: '1.8 MB',
    uploadedBy: 'John Doe',
    version: '1.0',
    status: 'current'
  },
  {
    id: 'DOC-007',
    name: 'Incident Response Procedure',
    type: 'procedure',
    frameworks: ['SOC 2', 'ISO 27001', 'FedRAMP', 'HIPAA'],
    uploadDate: 'Apr 15, 2024',
    size: '678 KB',
    uploadedBy: 'Sarah Johnson',
    version: '2.0',
    status: 'current'
  },
  {
    id: 'DOC-008',
    name: 'FedRAMP SSP (System Security Plan)',
    type: 'evidence',
    frameworks: ['FedRAMP'],
    uploadDate: 'Nov 10, 2024',
    size: '5.6 MB',
    uploadedBy: 'Mike Chen',
    version: '1.2',
    status: 'current'
  },
  {
    id: 'DOC-009',
    name: 'Data Protection Policy (GDPR)',
    type: 'policy',
    frameworks: ['GDPR'],
    uploadDate: 'Feb 10, 2024',
    size: '945 KB',
    uploadedBy: 'Jane Smith',
    version: '1.5',
    status: 'current'
  },
  {
    id: 'DOC-010',
    name: 'Vulnerability Scan Report - October 2024',
    type: 'evidence',
    frameworks: ['SOC 2', 'ISO 27001', 'PCI DSS'],
    uploadDate: 'Oct 30, 2024',
    size: '2.1 MB',
    uploadedBy: 'John Doe',
    version: '1.0',
    status: 'current'
  },
  {
    id: 'DOC-011',
    name: 'Business Continuity Plan',
    type: 'procedure',
    frameworks: ['SOC 2', 'ISO 27001'],
    uploadDate: 'Mar 1, 2024',
    size: '1.2 MB',
    uploadedBy: 'Sarah Johnson',
    version: '3.2',
    status: 'current'
  },
  {
    id: 'DOC-012',
    name: 'Information Security Policy (Draft)',
    type: 'policy',
    frameworks: ['SOC 2', 'ISO 27001'],
    uploadDate: 'Nov 20, 2024',
    size: '892 KB',
    uploadedBy: 'Mike Chen',
    version: '4.0-draft',
    status: 'draft'
  }
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [frameworkFilter, setFrameworkFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesFramework = frameworkFilter === 'all' || doc.frameworks.includes(frameworkFilter);
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;

    return matchesSearch && matchesType && matchesFramework && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'policy': return <DocumentCheckIcon className="w-5 h-5 text-blue-500" />;
      case 'procedure': return <ClipboardDocumentCheckIcon className="w-5 h-5 text-purple-500" />;
      case 'evidence': return <FolderIcon className="w-5 h-5 text-green-500" />;
      case 'certification': return <ShieldCheckIcon className="w-5 h-5 text-yellow-500" />;
      case 'report': return <DocumentChartBarIcon className="w-5 h-5 text-red-500" />;
      default: return <DocumentTextIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'text-green-700 bg-green-100';
      case 'archived': return 'text-gray-700 bg-gray-100';
      case 'draft': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const stats = {
    total: documents.length,
    policies: documents.filter(d => d.type === 'policy').length,
    procedures: documents.filter(d => d.type === 'procedure').length,
    evidence: documents.filter(d => d.type === 'evidence').length,
    certifications: documents.filter(d => d.type === 'certification').length,
    reports: documents.filter(d => d.type === 'report').length,
  };

  return (
    <ProtectedRoute>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Compliance Documents</h1>
              <p className="text-gray-600 mt-2">Manage policies, procedures, evidence, and certifications</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5" />
              Upload Document
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-600 mt-1">Total Documents</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.policies}</div>
            <div className="text-xs text-gray-600 mt-1">Policies</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.procedures}</div>
            <div className="text-xs text-gray-600 mt-1">Procedures</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-green-600">{stats.evidence}</div>
            <div className="text-xs text-gray-600 mt-1">Evidence</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.certifications}</div>
            <div className="text-xs text-gray-600 mt-1">Certifications</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-red-600">{stats.reports}</div>
            <div className="text-xs text-gray-600 mt-1">Reports</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="policy">Policies</option>
              <option value="procedure">Procedures</option>
              <option value="evidence">Evidence</option>
              <option value="certification">Certifications</option>
              <option value="report">Reports</option>
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
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="current">Current</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frameworks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          {getTypeIcon(doc.type)}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                            <div className="text-xs text-gray-500 mt-1">ID: {doc.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 capitalize">{doc.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {doc.frameworks.map((framework, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded"
                            >
                              {framework}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                          {doc.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{doc.version}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{doc.uploadDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{doc.size}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <ArrowDownTrayIcon className="w-5 h-5" />
                          </button>
                          <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <ShareIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <div className="text-gray-500">No documents found matching your filters</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-600">
          Showing {filteredDocuments.length} of {documents.length} documents
        </div>
      </div>
    </ProtectedRoute>
  );
}
