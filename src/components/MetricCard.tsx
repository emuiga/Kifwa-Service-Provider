'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { MetricCardProps } from '@/types';
import { 
  Users, 
  DollarSign, 
  Shield, 
  FileText,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Users,
  DollarSign,
  Shield,
  FileText,
};

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    accent: 'bg-blue-100',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    accent: 'bg-green-100',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    accent: 'bg-purple-100',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    accent: 'bg-red-100',
  },
};

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
}) => {
  const IconComponent = iconMap[icon];
  const colors = colorClasses[color];

  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `Ksh ${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `Ksh ${(val / 1000).toFixed(1)}K`;
      }
      return `Ksh ${val.toLocaleString()}`;
    }
    return val;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600 mb-3">
          {title}
        </p>
        <p className="text-4xl font-bold text-gray-900 mb-3">
          {formatValue(value)}
        </p>
        
        {/* Trend Indicator */}
        {trend && (
          <div className="flex items-center justify-center">
            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              trend.isPositive 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {trend.isPositive ? (
                <TrendingUp size={12} className="mr-1" />
              ) : (
                <TrendingDown size={12} className="mr-1" />
              )}
              {Math.abs(trend.value)}%
            </div>
            <span className="text-xs text-gray-500 ml-2">
              vs last month
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;

