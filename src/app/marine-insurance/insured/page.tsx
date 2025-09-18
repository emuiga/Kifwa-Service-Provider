
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Search, Filter, X, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

// Mock data interface
interface InsuredItem {
  idf_Number: string;
  certificate_date: string;
  destinationCountry: string;
  consignee: {
    name: string;
  };
  insured_amount: string;
  originCountry: string;
  clearing_agent: string;
  mci_status: string;
}

// Mock data
const mockInsuredData: InsuredItem[] = [
  {
    idf_Number: "IDF001234567",
    certificate_date: "2024-01-15",
    destinationCountry: "Kenya",
    consignee: {
      name: "Mwangi Trading Company Ltd"
    },
    insured_amount: "KES 2,500,000",
    originCountry: "China",
    clearing_agent: "Kamau Logistics",
    mci_status: "YES"
  },
  {
    idf_Number: "IDF001234568",
    certificate_date: "2024-01-16",
    destinationCountry: "Uganda",
    consignee: {
      name: "East Africa Imports Ltd"
    },
    insured_amount: "KES 1,800,000",
    originCountry: "India",
    clearing_agent: "Wanjiku Customs",
    mci_status: "YES"
  },
  {
    idf_Number: "IDF001234569",
    certificate_date: "2024-01-17",
    destinationCountry: "Tanzania",
    consignee: {
      name: "Coastal Trading Co"
    },
    insured_amount: "KES 3,200,000",
    originCountry: "Germany",
    clearing_agent: "Ocean Freight Ltd",
    mci_status: "YES"
  },
  {
    idf_Number: "IDF001234570",
    certificate_date: "2024-01-18",
    destinationCountry: "Rwanda",
    consignee: {
      name: "Mountain View Imports"
    },
    insured_amount: "KES 950,000",
    originCountry: "Japan",
    clearing_agent: "Precision Logistics",
    mci_status: "YES"
  },
  {
    idf_Number: "IDF001234571",
    certificate_date: "2024-01-19",
    destinationCountry: "Kenya",
    consignee: {
      name: "Nairobi Trading House"
    },
    insured_amount: "KES 4,100,000",
    originCountry: "South Korea",
    clearing_agent: "Express Customs",
    mci_status: "YES"
  }
];

export default function InsuredPage() {
  const router = useRouter();
  
  // Set default date range to past 3 months
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  const [startDate, setStartDate] = useState(threeMonthsAgo.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [originCountry, setOriginCountry] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter data based on search and filters
  const filteredData = mockInsuredData.filter(item => {
    const matchesSearch = !debouncedSearchTerm || 
      item.idf_Number.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    const matchesDestination = !destinationCountry || 
      item.destinationCountry.toLowerCase().includes(destinationCountry.toLowerCase());
    
    const matchesOrigin = !originCountry || 
      item.originCountry.toLowerCase().includes(originCountry.toLowerCase());
    
    return matchesSearch && matchesDestination && matchesOrigin;
  });

  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  
  // Paginate data
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setCurrentPage(1);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleRowClick = (idfNumber: string) => {
    router.push(`/marine-insurance/insured/${idfNumber}`);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setDestinationCountry('');
    setOriginCountry('');
    setCurrentPage(1);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold">Insured Cargo</h1>
            <p className="text-sm text-gray-500">
              Showing {paginatedData.length} of {totalRecords} records
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              {debouncedSearchTerm && (
                <span className="ml-2 text-blue-600">
                  • Searching for "{debouncedSearchTerm}"
                </span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="start-date" className="text-sm">From:</label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="end-date" className="text-sm">To:</label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <Calendar className="h-4 w-4" />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            placeholder="Search by IDF number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm !== debouncedSearchTerm && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
        {(searchTerm || destinationCountry || originCountry) && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label htmlFor="destination-country" className="text-sm font-medium text-gray-700">Destination Country</label>
              <input
                id="destination-country"
                placeholder="Enter destination country"
                value={destinationCountry}
                onChange={(e) => setDestinationCountry(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleFilterChange()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="origin-country" className="text-sm font-medium text-gray-700">Origin Country</label>
              <input
                id="origin-country"
                placeholder="Enter origin country"
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleFilterChange()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleFilterChange}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IDF Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consignee Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insured Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clearing Agent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <Search className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      {debouncedSearchTerm ? 'No Search Results Found' : 'No Insured Cargo Found'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {debouncedSearchTerm 
                        ? `No insured cargo records found matching "${debouncedSearchTerm}"`
                        : 'No insured cargo records found for the selected date range.'
                      }
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr 
                  key={index}
                  className={`cursor-pointer transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
                  onClick={() => handleRowClick(item.idf_Number)}
                >
                  <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.idf_Number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.certificate_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.destinationCountry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.consignee?.name || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.insured_amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.originCountry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.clearing_agent || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.mci_status === "YES" 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.mci_status === "YES" ? "Insured" : "Uninsured"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleRowClick(item.idf_Number)}
                      className="p-2 rounded-full hover:bg-blue-50 transition-colors"
                      title="View Details"
                    >
                      <ArrowLeft className="h-5 w-5 text-blue-600 rotate-180" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {renderPaginationNumbers()}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

