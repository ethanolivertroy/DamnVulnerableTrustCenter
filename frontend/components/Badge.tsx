'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface BadgeProps {
  type: 'soc2' | 'iso27001' | 'hipaa' | 'gdpr' | 'fips_encryption' | 'pci_dss';
  size?: 'sm' | 'md' | 'lg';
}

const badgeInfo = {
  soc2: { name: 'SOC 2 Type II', defaultStatus: 'ok' },
  iso27001: { name: 'ISO 27001', defaultStatus: 'ok' },
  hipaa: { name: 'HIPAA', defaultStatus: 'ok' },
  gdpr: { name: 'GDPR', defaultStatus: 'ok' },
  fips_encryption: { name: 'FIPS 140-2', defaultStatus: 'false' },
  pci_dss: { name: 'PCI DSS', defaultStatus: 'warning' },
};

export default function Badge({ type, size = 'md' }: BadgeProps) {
  const [status, setStatus] = useState<string>('loading');

  useEffect(() => {
    // VULNERABILITY: Client-side override takes precedence over server state
    // This allows attackers to falsify badge status in the browser
    if (typeof window !== 'undefined' && (window as any).__BADGES_OVERRIDE && (window as any).__BADGES_OVERRIDE[type]) {
      console.log(`[Badge] Using override for ${type}:`, (window as any).__BADGES_OVERRIDE[type]);
      setStatus((window as any).__BADGES_OVERRIDE[type]);
      return;
    }

    // Fetch actual badge status from server
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/badges`)
      .then(res => res.json())
      .then(data => {
        if (data[type]) {
          setStatus(data[type]);
        } else {
          setStatus(badgeInfo[type]?.defaultStatus || 'unknown');
        }
      })
      .catch(err => {
        console.error('Failed to fetch badge status:', err);
        setStatus('error');
      });
  }, [type]);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const getStatusColor = () => {
    switch (status) {
      case 'ok':
      case 'true':
      case 'enabled':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'false':
      case 'disabled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'loading':
        return 'bg-gray-100 text-gray-500 border-gray-300 animate-pulse';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const getIcon = () => {
    const iconClass = iconSizes[size];
    switch (status) {
      case 'ok':
      case 'true':
      case 'enabled':
        return <CheckCircleIcon className={iconClass} />;
      case 'false':
      case 'disabled':
        return <XCircleIcon className={iconClass} />;
      case 'warning':
        return <ExclamationTriangleIcon className={iconClass} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border ${sizeClasses[size]} ${getStatusColor()}`}
      data-badge-type={type}
      data-badge-status={status}
    >
      {getIcon()}
      <span className="font-medium">{badgeInfo[type]?.name || type}</span>
    </div>
  );
}