'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  LinkIcon,
  CloudIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  CogIcon,
  BoltIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Integration {
  id: string;
  name: string;
  provider: string;
  category: 'security' | 'monitoring' | 'communication' | 'development' | 'compliance' | 'storage';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  lastSync: string;
  dataFlow: 'bidirectional' | 'inbound' | 'outbound';
  apiCalls: number;
  authenticated: boolean;
  description: string;
}

const integrations: Integration[] = [
  {
    id: 'INT-001',
    name: 'Slack Notifications',
    provider: 'Slack',
    category: 'communication',
    status: 'connected',
    lastSync: '5 minutes ago',
    dataFlow: 'outbound',
    apiCalls: 1250,
    authenticated: true,
    description: 'Send security alerts and compliance notifications to Slack channels'
  },
  {
    id: 'INT-002',
    name: 'GitHub Code Scanning',
    provider: 'GitHub',
    category: 'development',
    status: 'connected',
    lastSync: '1 hour ago',
    dataFlow: 'bidirectional',
    apiCalls: 450,
    authenticated: true,
    description: 'Scan code repositories for vulnerabilities and compliance issues'
  },
  {
    id: 'INT-003',
    name: 'AWS CloudTrail',
    provider: 'Amazon Web Services',
    category: 'monitoring',
    status: 'error',
    lastSync: '3 days ago',
    dataFlow: 'inbound',
    apiCalls: 0,
    authenticated: false,
    description: 'Import AWS audit logs for compliance monitoring'
  },
  {
    id: 'INT-004',
    name: 'Splunk SIEM',
    provider: 'Splunk',
    category: 'security',
    status: 'connected',
    lastSync: '10 minutes ago',
    dataFlow: 'bidirectional',
    apiCalls: 8920,
    authenticated: true,
    description: 'Real-time security event monitoring and incident response'
  },
  {
    id: 'INT-005',
    name: 'Jira Ticketing',
    provider: 'Atlassian',
    category: 'development',
    status: 'connected',
    lastSync: '30 minutes ago',
    dataFlow: 'bidirectional',
    apiCalls: 320,
    authenticated: true,
    description: 'Create and track security issues and compliance tasks'
  },
  {
    id: 'INT-006',
    name: 'Office 365 Compliance',
    provider: 'Microsoft',
    category: 'compliance',
    status: 'pending',
    lastSync: 'Never',
    dataFlow: 'inbound',
    apiCalls: 0,
    authenticated: false,
    description: 'Monitor Office 365 compliance and data governance'
  },
  {
    id: 'INT-007',
    name: 'Box Storage',
    provider: 'Box',
    category: 'storage',
    status: 'disconnected',
    lastSync: '1 week ago',
    dataFlow: 'bidirectional',
    apiCalls: 0,
    authenticated: false,
    description: 'Secure document storage and compliance artifact management'
  },
  {
    id: 'INT-008',
    name: 'PagerDuty Alerts',
    provider: 'PagerDuty',
    category: 'monitoring',
    status: 'connected',
    lastSync: '2 minutes ago',
    dataFlow: 'outbound',
    apiCalls: 150,
    authenticated: true,
    description: 'Critical security incident escalation and on-call management'
  }
];

const categories = [
  { name: 'security', icon: ShieldCheckIcon, color: 'purple' },
  { name: 'monitoring', icon: ChartBarIcon, color: 'blue' },
  { name: 'communication', icon: ChatBubbleLeftRightIcon, color: 'green' },
  { name: 'development', icon: CodeBracketIcon, color: 'indigo' },
  { name: 'compliance', icon: DocumentCheckIcon, color: 'yellow' },
  { name: 'storage', icon: CloudIcon, color: 'gray' }
];

// Import missing icons
import {
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'disconnected': return <XCircleIcon className="w-5 h-5 text-gray-400" />;
      case 'error': return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'pending': return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security': return 'bg-red-100 text-red-700';
      case 'monitoring': return 'bg-blue-100 text-blue-700';
      case 'communication': return 'bg-green-100 text-green-700';
      case 'development': return 'bg-indigo-100 text-indigo-700';
      case 'compliance': return 'bg-yellow-100 text-yellow-700';
      case 'storage': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredIntegrations = integrations.filter(integration => {
    if (selectedCategory !== 'all' && integration.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && integration.status !== selectedStatus) return false;
    return true;
  });

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const errorCount = integrations.filter(i => i.status === 'error').length;
  const totalApiCalls = integrations.reduce((sum, i) => sum + i.apiCalls, 0);

  return (
    <ProtectedRoute>
      <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-600 mt-2">Connect and manage third-party services</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Integrations</span>
            <LinkIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{integrations.length}</div>
          <div className="text-xs text-gray-500 mt-1">Configured services</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Connected</span>
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600">{connectedCount}</div>
          <div className="text-xs text-gray-500 mt-1">Active integrations</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Errors</span>
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600">{errorCount}</div>
          <div className="text-xs text-gray-500 mt-1">Need attention</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">API Calls (24h)</span>
            <BoltIcon className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {totalApiCalls > 1000 ? `${(totalApiCalls / 1000).toFixed(1)}k` : totalApiCalls}
          </div>
          <div className="text-xs text-gray-500 mt-1">Total requests</div>
        </div>
      </div>

      {/* Alert for errors */}
      {errorCount > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Integration Errors</h3>
              <p className="text-sm text-red-700 mt-1">
                {errorCount} integration{errorCount > 1 ? 's' : ''} failed to connect. Review authentication settings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Category Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">By Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const count = integrations.filter(i => i.category === cat.name).length;
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name === selectedCategory ? 'all' : cat.name)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedCategory === cat.name
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 mx-auto ${
                  selectedCategory === cat.name ? 'text-red-600' : 'text-gray-600'
                }`} />
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-xs text-gray-600 capitalize">{cat.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="connected">Connected</option>
            <option value="disconnected">Disconnected</option>
            <option value="error">Error</option>
            <option value="pending">Pending</option>
          </select>

          <button className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
            + Add Integration
          </button>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredIntegrations.map((integration) => (
          <div key={integration.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                  <p className="text-sm text-gray-500">{integration.provider}</p>
                </div>
              </div>
              {getStatusIcon(integration.status)}
            </div>

            <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Category</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(integration.category)}`}>
                  {integration.category}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Data Flow</span>
                <span className="text-gray-900">{integration.dataFlow}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last Sync</span>
                <span className="text-gray-900">{integration.lastSync}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">API Calls (24h)</span>
                <span className="text-gray-900">{integration.apiCalls.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {integration.status === 'connected' ? (
                <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
                  Configure
                </button>
              ) : (
                <button className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                  Connect
                </button>
              )}
              <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <CogIcon className="w-4 h-4" />
              </button>
              {integration.status === 'connected' && (
                <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  <ArrowPathIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Available Integrations */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Integrations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Datadog', 'Okta', 'Snowflake', 'Salesforce', 'Azure AD', 'Google Workspace', 'Zendesk', 'DocuSign'].map((name) => (
            <button key={name} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-sm font-medium text-gray-900">{name}</div>
              <div className="text-xs text-red-600 mt-1">+ Connect</div>
            </button>
          ))}
        </div>
      </div>

      {/* CTF Hint */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          Debug: API keys for integrations stored in plaintext at /api/integrations/keys (no auth)
        </p>
      </div>
      </div>
    </ProtectedRoute>
  );
}