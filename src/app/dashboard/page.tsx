'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  RefreshCw,
  Filter,
  X,
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import MetricCard from '@/components/MetricCard';
import { 
  YearlyPremiumChart, 
  MonthlyPremiumChart, 
  PremiumDistributionChart,
  ClaimsTrendChart 
} from '@/components/Charts';
import { User, DashboardMetrics, ChartData, DateRange } from '@/types';

// Mock user data
const mockUser: User = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@kifwa.com',
  organization: {
    id: '1',
    name: 'Kifwa Port Operations',
    code: 'KPO',
    isActive: true,
  },
  role: {
    id: '1',
    name: 'Admin',
    permissions: [
      { id: '1', name: 'marine-insurance:read', resource: 'marine-insurance', action: 'read' },
      { id: '2', name: 'bonds:read', resource: 'bonds', action: 'read' },
      { id: '3', name: 'users:read', resource: 'users', action: 'read' },
      { id: '4', name: 'roles:read', resource: 'roles', action: 'read' },
      { id: '5', name: 'audit-logs:read', resource: 'audit-logs', action: 'read' },
      { id: '6', name: 'company:read', resource: 'company', action: 'read' },
      { id: '7', name: 'wallet:read', resource: 'wallet', action: 'read' },
      { id: '8', name: 'reporting:read', resource: 'reporting', action: 'read' },
    ],
  },
  permissions: [],
};

// Mock dashboard data
const mockMetrics: DashboardMetrics = {
  totalInsured: 1247,
  totalPremium: 2850000,
  totalSumInsured: 45000000,
  uninsuredIdf: 89,
};

const mockYearlyData: ChartData[] = [
  { name: '2019', value: 1200000 },
  { name: '2020', value: 1500000 },
  { name: '2021', value: 1800000 },
  { name: '2022', value: 2200000 },
  { name: '2023', value: 2600000 },
  { name: '2024', value: 2850000 },
];

const mockMonthlyData: ChartData[] = [
  { name: 'Jan', value: 220000 },
  { name: 'Feb', value: 245000 },
  { name: 'Mar', value: 280000 },
  { name: 'Apr', value: 265000 },
  { name: 'May', value: 290000 },
  { name: 'Jun', value: 310000 },
  { name: 'Jul', value: 295000 },
  { name: 'Aug', value: 320000 },
  { name: 'Sep', value: 335000 },
  { name: 'Oct', value: 315000 },
  { name: 'Nov', value: 340000 },
  { name: 'Dec', value: 355000 },
];

const mockDistributionData: ChartData[] = [
  { name: 'Cargo Insurance', value: 1200000 },
  { name: 'Hull Insurance', value: 800000 },
  { name: 'P&I Insurance', value: 600000 },
  { name: 'Freight Insurance', value: 250000 },
];

const mockClaimsData: ChartData[] = [
  { name: 'Jan', value: 12 },
  { name: 'Feb', value: 8 },
  { name: 'Mar', value: 15 },
  { name: 'Apr', value: 10 },
  { name: 'May', value: 18 },
  { name: 'Jun', value: 14 },
  { name: 'Jul', value: 9 },
  { name: 'Aug', value: 16 },
  { name: 'Sep', value: 11 },
  { name: 'Oct', value: 13 },
  { name: 'Nov', value: 7 },
  { name: 'Dec', value: 5 },
];

const DashboardPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [metrics, setMetrics] = useState<DashboardMetrics>(mockMetrics);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [showDateFilter, setShowDateFilter] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logout');
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Refresh data
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (field: 'from' | 'to', date: Date) => {
    setDateRange(prev => ({ ...prev, [field]: date }));
  };

  const clearDateFilter = () => {
    setDateRange({
      from: new Date(new Date().getFullYear(), 0, 1),
      to: new Date(),
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Topbar */}
      <Topbar
        onSidebarToggle={handleSidebarToggle}
      />

      {/* Main Content */}
      <main className="pt-16 transition-all duration-300 min-h-screen">
        <div className="p-4 lg:p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {mockUser.firstName}!
                </h1>
                <div className="flex items-center mt-2 text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span className="text-sm">{currentDate}</span>
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button
                    onClick={() => setShowDateFilter(!showDateFilter)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Filter size={16} />
                    <span className="text-sm font-medium">
                      {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                    </span>
                  </button>

                  {showDateFilter && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDateFilter(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">Filter by Date Range</h3>
                            <button
                              onClick={() => setShowDateFilter(false)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-1">
                                From
                              </label>
                              <input
                                type="date"
                                value={dateRange.from.toISOString().split('T')[0]}
                                onChange={(e) => handleDateRangeChange('from', new Date(e.target.value))}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-1">
                                To
                              </label>
                              <input
                                type="date"
                                value={dateRange.to.toISOString().split('T')[0]}
                                onChange={(e) => handleDateRangeChange('to', new Date(e.target.value))}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                              />
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={clearDateFilter}
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                            >
                              Clear Filter
                            </button>
                            <button
                              onClick={() => setShowDateFilter(false)}
                              className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                >
                  <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>
          </div>

          {/* Marine Insurance Overview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              System Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <MetricCard
                title="Clearing Agents"
                value="24"
                icon="Users"
                color="blue"
                trend={{ value: 8.3, isPositive: true }}
              />
              <MetricCard
                title="Insurance Companies"
                value="5"
                icon="DollarSign"
                color="green"
                trend={{ value: 0, isPositive: true }}
              />
              <MetricCard
                title="Total Users"
                value="156"
                icon="Shield"
                color="purple"
                trend={{ value: 12.5, isPositive: true }}
              />
              <MetricCard
                title="Active Policies"
                value="1,247"
                icon="FileText"
                color="red"
                trend={{ value: 15.2, isPositive: true }}
              />
            </div>
          </div>

          {/* Charts Section */}
          <div className="space-y-8">
            {/* First Row - Revenue & Transaction Trends */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <YearlyPremiumChart data={mockYearlyData} height={350} type="bar" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <MonthlyPremiumChart data={mockMonthlyData} height={350} type="area" />
              </div>
            </div>

            {/* Second Row - Distribution and Claims */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <PremiumDistributionChart data={mockDistributionData} height={300} type="bar" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <ClaimsTrendChart data={mockClaimsData} height={300} color="#dc2626" type="line" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;