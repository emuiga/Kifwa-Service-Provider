'use client';

import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock, Eye, Search, Filter, Edit3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

// Application interface
interface BondApplication {
  id: string;
  applicantName: string;
  applicantCompany: string;
  bondType: string;
  bondName: string;
  amount: string;
  submittedDate: string;
  status: string;
  purpose: string;
  suretyCompany: string;
  approvedDate?: string;
  rejectedDate?: string;
  rejectionReason?: string;
}

// Mock applications data
const mockApplications: BondApplication[] = [
  {
    id: 'APP001',
    applicantName: 'John Doe',
    applicantCompany: 'Doe Enterprises Ltd',
    bondType: 'CB-1',
    bondName: 'Single Entry Bond',
    amount: 'KES 500,000',
    submittedDate: '2024-01-15',
    status: 'pending',
    purpose: 'Import of electronic goods',
    suretyCompany: 'ABC Insurance Ltd',
    approvedDate: undefined,
    rejectedDate: undefined,
    rejectionReason: undefined
  },
  {
    id: 'APP002',
    applicantName: 'Jane Smith',
    applicantCompany: 'Smith Trading Co',
    bondType: 'CB-8',
    bondName: 'Continuous Bond',
    amount: 'KES 2,000,000',
    submittedDate: '2024-01-18',
    status: 'pending',
    purpose: 'Multiple import transactions',
    suretyCompany: 'XYZ Surety Ltd',
    approvedDate: undefined,
    rejectedDate: undefined,
    rejectionReason: undefined
  },
  {
    id: 'APP003',
    applicantName: 'Mike Johnson',
    applicantCompany: 'Johnson Logistics',
    bondType: 'CB-12',
    bondName: 'Term Bond',
    amount: 'KES 1,500,000',
    submittedDate: '2024-01-10',
    status: 'approved',
    approvedDate: '2024-01-12',
    purpose: 'Warehouse storage bond',
    suretyCompany: 'DEF Insurance Co',
    rejectedDate: undefined,
    rejectionReason: undefined
  },
  {
    id: 'APP004',
    applicantName: 'Sarah Wilson',
    applicantCompany: 'Wilson Imports Ltd',
    bondType: 'CB-15',
    bondName: 'Warehouse Bond',
    amount: 'KES 3,000,000',
    submittedDate: '2024-01-20',
    status: 'rejected',
    rejectedDate: '2024-01-22',
    rejectionReason: 'Insufficient surety documentation',
    purpose: 'Customs warehouse storage',
    suretyCompany: 'GHI Surety Corp',
    approvedDate: undefined
  }
];

export default function ReviewApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<BondApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = !searchTerm ||
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAction = (application: BondApplication, action: 'approve' | 'reject') => {
    setSelectedApplication(application);
    setActionType(action);
    setShowModal(true);
    if (action === 'reject') {
      setRejectionReason('');
    }
  };

  const confirmAction = () => {
    if (!selectedApplication) return;

    const updatedApplications = applications.map(app => {
      if (app.id === selectedApplication.id) {
        if (actionType === 'approve') {
          return {
            ...app,
            status: 'approved',
            approvedDate: new Date().toISOString().split('T')[0]
          };
        } else if (actionType === 'reject') {
          return {
            ...app,
            status: 'rejected',
            rejectedDate: new Date().toISOString().split('T')[0],
            rejectionReason
          };
        }
      }
      return app;
    });

    setApplications(updatedApplications);
    setShowModal(false);
    setSelectedApplication(null);
    setActionType(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending Review';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
                <h1 className="text-2xl font-semibold">Review Bond Applications</h1>
                <p className="text-sm text-gray-500">
                  Approve or reject customs bond applications
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    placeholder="Search by applicant name, company, or application ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bond Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {app.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{app.applicantName}</div>
                          <div className="text-sm text-gray-500">{app.applicantCompany}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.bondName} ({app.bondType})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                          {getStatusIcon(app.status)}
                          {getStatusText(app.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(app.submittedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2 relative">
                          <button
                            onClick={() => { /* View details */ }}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {app.status === 'pending' && (
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => setEditingId(editingId === app.id ? null : app.id)}
                                className="px-2 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                                title="Edit"
                              >
                                <Edit3 className="h-4 w-4" />
                                <span>Edit</span>
                              </button>
                              {editingId === app.id && (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => { setEditingId(null); handleAction(app, 'approve'); }}
                                    className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => { setEditingId(null); handleAction(app, 'reject'); }}
                                    className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredApplications.length === 0 && (
              <div className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <Search className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No applications found</h3>
                  <p className="text-sm text-gray-500">
                    {searchTerm || statusFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'No bond applications to review at this time.'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Approve/Reject Confirmation */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {actionType === 'approve' ? 'Approve Application' : 'Reject Application'}
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Application: <span className="font-medium">{selectedApplication.id}</span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Applicant: <span className="font-medium">{selectedApplication.applicantName}</span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Bond Type: <span className="font-medium">{selectedApplication.bondName}</span>
              </p>
              <p className="text-sm text-gray-600">
                Amount: <span className="font-medium">{selectedApplication.amount}</span>
              </p>
            </div>

            {actionType === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={actionType === 'reject' && !rejectionReason.trim()}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


