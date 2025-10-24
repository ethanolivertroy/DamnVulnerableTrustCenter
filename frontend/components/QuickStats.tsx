'use client';

import { ShieldCheckIcon, DocumentTextIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function QuickStats() {
  const stats = [
    {
      label: 'Compliance Score',
      value: '92%',
      change: '+3%',
      positive: true,
      icon: ShieldCheckIcon,
    },
    {
      label: 'Active Policies',
      value: '46',
      change: '+2',
      positive: true,
      icon: DocumentTextIcon,
    },
    {
      label: 'Team Members',
      value: '127',
      change: '+8',
      positive: true,
      icon: UserGroupIcon,
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <stat.icon className="h-6 w-6 text-red-600" />
            <span className={`text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          <div className="text-sm text-gray-500">{stat.label}</div>
        </div>
      ))}
    </>
  );
}