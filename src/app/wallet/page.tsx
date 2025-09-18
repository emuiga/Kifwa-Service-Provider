'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Search, Filter, X, RefreshCw, Eye, Download, Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

// Mock data interface
interface Transaction {
  id: string;
  date: string;
  type: 'Credit' | 'Debit';
  amount: number;
  currency: string;
  description: string;
  reference: string;
  status: 'Completed' | 'Pending' | 'Failed';
  balance: number;
  category: string;
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-20T10:30:00',
    type: 'Credit',
    amount: 50000,
    currency: 'KES',
    description: 'Revenue share from Kamau Logistics',
    reference: 'RS001234567',
    status: 'Completed',
    balance: 1250000,
    category: 'Revenue Share',
  },
  {
    id: '2',
    date: '2024-01-19T14:15:00',
    type: 'Debit',
    amount: 15000,
    currency: 'KES',
    description: 'Platform fee deduction',
    reference: 'PF001234568',
    status: 'Completed',
    balance: 1200000,
    category: 'Platform Fee',
  },
  {
    id: '3',
    date: '2024-01-18T09:45:00',
    type: 'Credit',
    amount: 75000,
    currency: 'KES',
    description: 'Revenue share from Wanjiku Customs',
    reference: 'RS001234569',
    status: 'Pending',
    balance: 1215000,
    category: 'Revenue Share',
  },
  {
    id: '4',
    date: '2024-01-17T16:20:00',
    type: 'Credit',
    amount: 30000,
    currency: 'KES',
    description: 'Revenue share from Akinyi Port Solutions',
    reference: 'RS001234570',
    status: 'Completed',
    balance: 1140000,
    category: 'Revenue Share',
  },
  {
    id: '5',
    date: '2024-01-16T11:30:00',
    type: 'Debit',
    amount: 5000,
    currency: 'KES',
    description: 'Transaction processing fee',
    reference: 'PF001234571',
    status: 'Completed',
    balance: 1110000,
    category: 'Processing Fee',
  },
];

const WalletPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [filteredData, setFilteredData] = useState<Transaction[]>(mockTransactions);

  // Calculate wallet summary
  const totalBalance = mockTransactions[0]?.balance || 0;
  const totalCredits = mockTransactions.filter(t => t.type === 'Credit' && t.status === 'Completed').reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = mockTransactions.filter(t => t.type === 'Debit' && t.status === 'Completed').reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = mockTransactions.filter(t => t.status === 'Pending').reduce((sum, t) => sum + (t.type === 'Credit' ? t.amount : -t.amount), 0);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter data based on search and filters
  useEffect(() => {
    const filtered = mockTransactions.filter(transaction => {
      const matchesSearch = !debouncedSearchTerm || 
        transaction.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesType = !typeFilter || transaction.type === typeFilter;
      const matchesStatus = !statusFilter || transaction.status === statusFilter;
      const matchesCategory = !categoryFilter || transaction.category === categoryFilter;
      
      const transactionDate = new Date(transaction.date);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;
      
      const matchesDateFrom = !fromDate || transactionDate >= fromDate;
      const matchesDateTo = !toDate || transactionDate <= toDate;
      
      return matchesSearch && matchesType && matchesStatus && matchesCategory && matchesDateFrom && matchesDateTo;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [debouncedSearchTerm, typeFilter, statusFilter, categoryFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (transactionId: string) => {
    router.push(`/wallet/transactions/${transactionId}`);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setTypeFilter('');
    setStatusFilter('');
    setCategoryFilter('');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Completed: 'bg-green-100 text-green-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Failed: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status}
      </span>
    );
  };

  const formatAmount = (amount: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);

    return (
      <span className={`font-medium ${type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
        {type === 'Credit' ? '+' : '-'}{formatted}
      </span>
    );
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 p-0 rounded-md text-sm font-medium transition-colors ${
            i === currentPage 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />
      
      {/* Main Content */}
      <div className="pt-16 transition-all duration-300 min-h-screen">
        <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Revenue Share & Payments</h1>
                <p className="text-sm text-gray-600">View revenue share statements and payment history</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          {/* Wallet Balance Card */}
          <div className="relative overflow-hidden bg-blue-800 rounded-xl p-6">
            {/* Concentric Circles with Fade Effect */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border-4 border-blue-400/5"></div>
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border-4 border-blue-400/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full border-4 border-blue-400/15"></div>
            <div className="absolute top-10 right-10 w-24 h-24 rounded-full border-4 border-blue-400/20"></div>
            <div className="absolute top-20 right-20 w-16 h-16 rounded-full border-4 border-blue-400/25"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white/90">Total Revenue Share</h2>
                  <p className="text-4xl font-bold text-white mt-1">
                    KES {totalBalance.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by description, reference, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="Credit">Credit</option>
                <option value="Debit">Debit</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="Revenue Share">Revenue Share</option>
                <option value="Platform Fee">Platform Fee</option>
                <option value="Processing Fee">Processing Fee</option>
                <option value="Commission">Commission</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || typeFilter || statusFilter || categoryFilter || dateFrom || dateTo) && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} transactions</span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.map((transaction, index) => (
                    <tr 
                      key={transaction.id}
                      className={`cursor-pointer transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
                      onClick={() => handleRowClick(transaction.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'Credit' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatAmount(transaction.amount, transaction.type)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Intl.NumberFormat('en-KE', {
                          style: 'currency',
                          currency: 'KES',
                          minimumFractionDigits: 0,
                        }).format(transaction.balance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/wallet/transactions/${transaction.id}`);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      
                      {renderPaginationNumbers()}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
