'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import {
  ChartBarIcon,
  UsersIcon,
  ServerIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CogIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/dashboard`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/login');
        return;
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading admin dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user.username} ({user.role})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-8 w-8 text-red-600" />
              <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded">
                VULNERABLE
              </span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="h-6 w-6 text-green-600 mt-0.5" />
            <div>
              <p className="text-green-800 font-medium">
                🎉 Congratulations! You've successfully logged into the admin panel!
              </p>
              <p className="text-green-700 text-sm mt-1">
                You discovered the credentials through the AI chatbot vulnerability and used them to authenticate.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UsersIcon className="h-10 w-10 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData?.stats?.total_users || 0}
                </p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-10 w-10 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData?.stats?.active_sessions || 0}
                </p>
                <p className="text-sm text-gray-600">Active Sessions</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-10 w-10 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData?.stats?.failed_logins || 0}
                </p>
                <p className="text-sm text-gray-600">Failed Logins</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ServerIcon className="h-10 w-10 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData?.stats?.suspicious_activities || 0}
                </p>
                <p className="text-sm text-gray-600">Suspicious Activities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sensitive Configuration */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Sensitive Configuration</h2>
            <p className="text-sm text-gray-600">System configuration (SHOULD BE PROTECTED)</p>
          </div>
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <p className="text-red-800 font-medium">Security Warning</p>
                  <p className="text-red-700">This information should never be exposed to users!</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">AWS Configuration</h3>
                <div className="bg-gray-50 rounded p-3 font-mono text-xs">
                  <p>Region: {dashboardData?.sensitive_config?.aws_region}</p>
                  <p>LocalStack: {dashboardData?.sensitive_config?.localstack_url}</p>
                  <p>Debug Mode: {dashboardData?.sensitive_config?.debug_mode}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">System Info</h3>
                <div className="bg-gray-50 rounded p-3 font-mono text-xs">
                  <p>Version: {dashboardData?.system_info?.version}</p>
                  <p>Uptime: {dashboardData?.system_info?.uptime}</p>
                  <p>Database: {dashboardData?.system_info?.database_size}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Security Events</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {dashboardData?.recent_events?.map((event: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <DocumentTextIcon className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{event.event}</p>
                    <p className="text-xs text-gray-600">
                      User: {event.user} • {new Date(event.timestamp).toLocaleString()}
                    </p>
                    {event.details && (
                      <p className="text-xs text-gray-500 mt-1">{event.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/api/admin/downloadAuditTrail')}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow text-left"
          >
            <DocumentTextIcon className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">Download Audit Trail</h3>
            <p className="text-sm text-gray-600">Export all security events</p>
          </button>

          <button
            onClick={() => router.push('/admin/users')}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow text-left"
          >
            <UsersIcon className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900">Manage Users</h3>
            <p className="text-sm text-gray-600">View and edit user accounts</p>
          </button>

          <button
            onClick={() => router.push('/admin/config')}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow text-left"
          >
            <CogIcon className="h-8 w-8 text-red-600 mb-2" />
            <h3 className="font-medium text-gray-900">System Configuration</h3>
            <p className="text-sm text-gray-600">Modify system settings</p>
          </button>
        </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}