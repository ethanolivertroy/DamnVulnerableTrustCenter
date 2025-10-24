'use client';

import { useState, useEffect } from 'react';
import Badge from '@/components/Badge';
import BadgeDisplay from '@/components/BadgeDisplay';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  ShieldCheckIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  LockClosedIcon,
  ServerIcon,
  CloudIcon,
  GlobeAltIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

export default function TrustCenterPage() {
  const [complianceData, setComplianceData] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/feeds/compliance.json`)
      .then(res => res.json())
      .then(data => setComplianceData(data))
      .catch(err => console.error('Failed to fetch compliance data:', err));
  }, []);

  return (
    <ProtectedRoute>
      <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-700 to-red-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheckIcon className="w-10 h-10" />
            <h1 className="text-4xl font-bold">DVTC Trust Center</h1>
          </div>
          <p className="text-xl text-red-100 mb-8">
            Your single source of truth for security, compliance, and privacy
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white text-red-700 font-semibold rounded-lg hover:bg-red-50 transition-colors">
              Download Security Report
            </button>
            <button className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
              Contact Security Team
            </button>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Certifications & Compliance</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleSolid className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">SOC 2 Type II</h3>
            <p className="text-sm text-gray-600 mb-4">Annual audit completed</p>
            <Badge type="soc2" />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon className="w-10 h-10 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">ISO 27001</h3>
            <p className="text-sm text-gray-600 mb-4">In progress - 75% complete</p>
            <Badge type="iso27001" />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleSolid className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">HIPAA</h3>
            <p className="text-sm text-gray-600 mb-4">Fully compliant</p>
            <Badge type="hipaa" />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleSolid className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">GDPR</h3>
            <p className="text-sm text-gray-600 mb-4">Privacy compliant</p>
            <Badge type="gdpr" />
          </div>
        </div>

        {/* Badge Display Component - FLAG05 */}
        <div className="mb-12">
          <BadgeDisplay />
        </div>

        {/* Security Features */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Security Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-50 rounded-lg p-6">
            <LockClosedIcon className="w-8 h-8 text-red-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Encryption</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                AES-256 encryption at rest
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                TLS 1.3 in transit
              </li>
              <li className="flex items-center gap-2">
                <Badge type="fips_encryption" size="sm" />
                <span>FIPS 140-2 validated</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <ServerIcon className="w-8 h-8 text-red-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Infrastructure</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                99.99% uptime SLA
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                Multi-region redundancy
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                Daily backups
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <CloudIcon className="w-8 h-8 text-red-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Cloud Security</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                AWS Well-Architected
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                WAF protection
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                DDoS mitigation
              </li>
            </ul>
          </div>
        </div>

        {/* Downloads Section */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Resources & Reports</h2>
        <div className="bg-gray-50 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="#" className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="w-8 h-8 text-red-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">SOC 2 Type II Report</h4>
                  <p className="text-sm text-gray-600">Latest audit report (NDA required)</p>
                </div>
              </div>
              <DocumentArrowDownIcon className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
            </a>

            <a href="#" className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="w-8 h-8 text-red-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Security Whitepaper</h4>
                  <p className="text-sm text-gray-600">Technical security overview</p>
                </div>
              </div>
              <DocumentArrowDownIcon className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
            </a>

            <a href="#" className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="w-8 h-8 text-red-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Privacy Policy</h4>
                  <p className="text-sm text-gray-600">How we handle your data</p>
                </div>
              </div>
              <DocumentArrowDownIcon className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
            </a>

            <a href="#" className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="w-8 h-8 text-red-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Penetration Test Summary</h4>
                  <p className="text-sm text-gray-600">Annual security assessment</p>
                </div>
              </div>
              <DocumentArrowDownIcon className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
            </a>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center py-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions about our security?</h3>
          <p className="text-gray-600 mb-4">Our security team is here to help</p>
          <div className="flex justify-center gap-4">
            <a href="mailto:security@dvtc.local" className="text-red-600 hover:text-red-700 font-medium">
              security@dvtc.local
            </a>
            <span className="text-gray-400">|</span>
            <a href="#" className="text-red-600 hover:text-red-700 font-medium">
              Schedule a call
            </a>
          </div>
        </div>

        {/* VULNERABILITY: Debug info */}
        {complianceData && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              Debug: Machine-readable feed available at /api/feeds/compliance.json
            </p>
          </div>
        )}
      </div>
      </div>
    </ProtectedRoute>
  );
}