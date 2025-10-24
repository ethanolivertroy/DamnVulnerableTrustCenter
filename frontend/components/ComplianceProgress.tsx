'use client';

import { useEffect, useState } from 'react';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ComplianceProgressProps {
  data: any;
  loading: boolean;
}

export default function ComplianceProgress({ data, loading }: ComplianceProgressProps) {
  const frameworks = [
    {
      name: 'SOC 2',
      status: 'compliant',
      progress: 99,
      color: 'green',
      icon: CheckCircleIcon,
    },
    {
      name: 'ISO 27001',
      status: 'in_progress',
      progress: 75,
      color: 'yellow',
      icon: ClockIcon,
    },
    {
      name: 'GDPR',
      status: 'compliant',
      progress: 95,
      color: 'green',
      icon: CheckCircleIcon,
    },
    {
      name: 'HIPAA',
      status: 'compliant',
      progress: 98,
      color: 'green',
      icon: CheckCircleIcon,
    },
  ];

  if (loading) {
    return <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Progress</h3>
      <div className="space-y-4">
        {frameworks.map((framework) => (
          <div key={framework.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <framework.icon
                className={`h-5 w-5 ${
                  framework.color === 'green' ? 'text-green-500' : 'text-yellow-500'
                }`}
              />
              <span className="font-medium text-gray-900">{framework.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    framework.color === 'green' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${framework.progress}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12">{framework.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}