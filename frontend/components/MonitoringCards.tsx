'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DocumentTextIcon,
  BeakerIcon,
  BuildingStorefrontIcon,
  FolderIcon,
  ArrowRightIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface MonitoringCard {
  id: string;
  title: string;
  icon: any;
  href: string;
  needsAttention: number;
  total: number;
  okCount: number;
  color: string;
}

export default function MonitoringCards() {
  const [cards, setCards] = useState<MonitoringCard[]>([
    {
      id: 'policies',
      title: 'Policies',
      icon: DocumentTextIcon,
      href: '/policies',
      needsAttention: 0,
      total: 15,
      okCount: 15,
      color: 'red'
    },
    {
      id: 'tests',
      title: 'Tests',
      icon: BeakerIcon,
      href: '/tests',
      needsAttention: 7,
      total: 148,
      okCount: 141,
      color: 'red'
    },
    {
      id: 'vendors',
      title: 'Vendors',
      icon: BuildingStorefrontIcon,
      href: '/vendor',
      needsAttention: 0,
      total: 46,
      okCount: 46,
      color: 'red'
    },
    {
      id: 'documents',
      title: 'Documents',
      icon: FolderIcon,
      href: '/documents',
      needsAttention: 2,
      total: 39,
      okCount: 37,
      color: 'red'
    }
  ]);

  const getProgressPercentage = (card: MonitoringCard) => {
    return (card.okCount / card.total) * 100;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Monitoring</h2>
        <p className="text-sm text-gray-600">Last updated 6 minutes ago</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          const progressPercentage = getProgressPercentage(card);

          return (
            <Link
              key={card.id}
              href={card.href}
              className="block bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <Icon className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{card.title}</h3>
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Needs attention</span>
                    {card.needsAttention > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                        {card.needsAttention}
                      </span>
                    )}
                  </div>

                  <div className="text-2xl font-bold text-gray-900">
                    {card.needsAttention}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{card.okCount} OK</span>
                      <span>{card.total} total</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}