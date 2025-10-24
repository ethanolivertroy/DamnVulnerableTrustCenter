'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ArrowRightIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import MonitoringCards from '@/components/MonitoringCards';
import StarterGuide from '@/components/StarterGuide';

export default function Home() {
  const [complianceData, setComplianceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch compliance data
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trust/compliance`)
      .then(res => res.json())
      .then(data => {
        setComplianceData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch compliance data:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">Home</h1>
      </motion.div>

      {/* Starter Guide */}
      <StarterGuide />

      {/* Compliance Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance progress</h2>

          <Link href="/compliance" className="block group">
            <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">SOC 2</h3>
                  <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">99%</div>
                <div className="text-sm text-gray-600 mb-3">103 controls complete</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: '99%' }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>103 controls complete</span>
                  <span>104 total</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Monitoring Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <MonitoringCards />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <Link href="/trust" className="group">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Public Trust Center</h3>
              <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" />
            </div>
            <p className="text-sm text-gray-600">View and customize your public-facing security page</p>
          </div>
        </Link>

        <Link href="/policies" className="group">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Policy Library</h3>
              <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" />
            </div>
            <p className="text-sm text-gray-600">Manage and approve your security policies</p>
          </div>
        </Link>

        <Link href="/security" className="group">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Security Monitoring</h3>
              <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" />
            </div>
            <p className="text-sm text-gray-600">Monitor vulnerabilities and security events</p>
          </div>
        </Link>
      </motion.div>

      {/* CTF Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-red-50 border border-red-200 rounded-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BeakerIcon className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">CTF Mode Active</h3>
              <p className="text-red-700">This instance contains intentional vulnerabilities for educational purposes</p>
            </div>
          </div>
          <Link
            href="/ctf"
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            View Challenges
          </Link>
        </div>
      </motion.div>
    </div>
  );
}