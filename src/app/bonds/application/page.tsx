'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building, Calendar, DollarSign, FileText, Save, User } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

// Mock account owner data - in real app, this would come from user context/store
const mockAccountOwner = {
  name: 'John Doe',
  address: '123 Main Street, Nairobi, Kenya',
  email: 'john.doe@example.com',
  phone: '+254 712 345 678',
  company: 'Doe Enterprises Ltd',
  idNumber: '12345678',
  kraPin: 'A123456789B'
};

interface BondApplicationForm {
  // Applicant (Service Provider) Details
  applicantName: string;
  applicantIdNumber: string;
  applicantKraPin: string;
  applicantAddress: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantCompany: string;

  // Bond Details
  bondType: string;
  bondAmount: string;
  issueDate: string;
  expiryDate: string;
  purpose: string;

  // Surety Details
  suretyCompany: string;
  suretyAddress: string;
  suretyContact: string;
  suretyEmail: string;
  suretyPhone: string;

  // Declaration
  declaration: string;
  signature: string;
  dateSigned: string;
}

const BOND_TYPES: { code: string; name: string }[] = [
  { code: 'CB-1', name: 'Single Entry Bond' },
  { code: 'CB-8', name: 'Continuous Bond' },
  { code: 'CB-12', name: 'Term Bond' },
  { code: 'CB-15', name: 'Warehouse Bond' },
  { code: 'CB-20', name: 'Transit Bond' }
];

export default function ServiceProviderBondApplicationPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<BondApplicationForm>({
    applicantName: '',
    applicantIdNumber: '',
    applicantKraPin: '',
    applicantAddress: '',
    applicantEmail: '',
    applicantPhone: '',
    applicantCompany: '',
    bondType: '',
    bondAmount: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    purpose: '',
    suretyCompany: '',
    suretyAddress: '',
    suretyContact: '',
    suretyEmail: '',
    suretyPhone: '',
    declaration:
      'We hereby apply for a customs bond in accordance with the Customs and Excise Act and agree to comply with all terms and conditions. We understand that this bond is binding and that failure to comply may result in penalties.',
    signature: '',
    dateSigned: new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-populate service provider account details on mount
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      applicantName: mockAccountOwner.name,
      applicantIdNumber: mockAccountOwner.idNumber,
      applicantKraPin: mockAccountOwner.kraPin,
      applicantAddress: mockAccountOwner.address,
      applicantEmail: mockAccountOwner.email,
      applicantPhone: mockAccountOwner.phone,
      applicantCompany: mockAccountOwner.company,
      signature: mockAccountOwner.name
    }));

    // Set expiry date to 1 year from issue date
    const issueDate = new Date();
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    setFormData(prev => ({
      ...prev,
      expiryDate: expiryDate.toISOString().split('T')[0]
    }));
  }, []);

  const handleInputChange = (field: keyof BondApplicationForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Bond application submitted successfully by service provider for ${formData.bondType}.`);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />

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
                <h1 className="text-2xl font-semibold">Service Provider Bond Application</h1>
                <p className="text-sm text-gray-500">Submit a customs bond on behalf of your client</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-8">
            {/* Applicant (Service Provider) Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <User className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Service Provider Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    value={formData.applicantName}
                    onChange={(e) => handleInputChange('applicantName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ID Number *</label>
                  <input
                    type="text"
                    value={formData.applicantIdNumber}
                    onChange={(e) => handleInputChange('applicantIdNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">KRA PIN *</label>
                  <input
                    type="text"
                    value={formData.applicantKraPin}
                    onChange={(e) => handleInputChange('applicantKraPin', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    value={formData.applicantCompany}
                    onChange={(e) => handleInputChange('applicantCompany', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.applicantPhone}
                    onChange={(e) => handleInputChange('applicantPhone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address *</label>
                  <input
                    type="email"
                    value={formData.applicantEmail}
                    onChange={(e) => handleInputChange('applicantEmail', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-3">
                  <label className="text-sm font-medium text-gray-700">Physical Address *</label>
                  <textarea
                    value={formData.applicantAddress}
                    onChange={(e) => handleInputChange('applicantAddress', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Bond Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Bond Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Bond Type *</label>
                  <select
                    value={formData.bondType}
                    onChange={(e) => handleInputChange('bondType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value="" disabled>
                      Select bond type
                    </option>
                    {BOND_TYPES.map(b => (
                      <option key={b.code} value={b.code}>{`${b.code} - ${b.name}`}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Bond Amount (KES) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      value={formData.bondAmount}
                      onChange={(e) => handleInputChange('bondAmount', e.target.value)}
                      placeholder="Enter amount"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Issue Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => handleInputChange('issueDate', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Expiry Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Purpose of Bond *</label>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    placeholder="Describe the purpose of this bond application"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Surety Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <Building className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Surety Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Surety Company Name *</label>
                  <input
                    type="text"
                    value={formData.suretyCompany}
                    onChange={(e) => handleInputChange('suretyCompany', e.target.value)}
                    placeholder="Enter surety company name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Contact Person</label>
                  <input
                    type="text"
                    value={formData.suretyContact}
                    onChange={(e) => handleInputChange('suretyContact', e.target.value)}
                    placeholder="Contact person name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.suretyPhone}
                    onChange={(e) => handleInputChange('suretyPhone', e.target.value)}
                    placeholder="Surety phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={formData.suretyEmail}
                    onChange={(e) => handleInputChange('suretyEmail', e.target.value)}
                    placeholder="Surety email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2 md:col-span-3">
                  <label className="text-sm font-medium text-gray-700">Surety Address *</label>
                  <textarea
                    value={formData.suretyAddress}
                    onChange={(e) => handleInputChange('suretyAddress', e.target.value)}
                    placeholder="Enter surety company address"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Declaration & Signature</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Declaration Statement *</label>
                  <textarea
                    value={formData.declaration}
                    onChange={(e) => handleInputChange('declaration', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Signature (Full Name) *</label>
                    <input
                      type="text"
                      value={formData.signature}
                      onChange={(e) => handleInputChange('signature', e.target.value)}
                      placeholder="Enter your full name as signature"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Date Signed *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        value={formData.dateSigned}
                        onChange={(e) => handleInputChange('dateSigned', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <Save className="h-5 w-5" />
                {isSubmitting ? 'Submitting Application...' : 'Submit Bond Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


