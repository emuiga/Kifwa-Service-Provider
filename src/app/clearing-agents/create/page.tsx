'use client';

import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Building2, User, Shield, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

interface CompanyDetails {
  companyName: string;
  registrationNumber: string;
  kraPin: string;
  businessType: string;
  address: string;
  city: string;
  postalCode: string;
  website: string;
  description: string;
}

interface AdminDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  kraPin: string;
  idNumber: string;
}

interface RoleDetails {
  roleName: string;
  description: string;
  permissions: string[];
}

// interface ReviewData {
//   companyDetails: CompanyDetails;
//   adminDetails: AdminDetails;
//   roles: RoleDetails[];
// }

const CreateClearingAgent = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    companyName: '',
    registrationNumber: '',
    kraPin: '',
    businessType: '',
    address: '',
    city: '',
    postalCode: '',
    website: '',
    description: '',
  });
  const [adminDetails, setAdminDetails] = useState<AdminDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    kraPin: '',
    idNumber: '',
  });
  const [roles, setRoles] = useState<RoleDetails[]>([
    {
      roleName: 'Admin',
      description: 'Full access to all clearing agent functions',
      permissions: ['create_transaction', 'view_transactions', 'manage_users', 'view_reports', 'manage_settings'],
    },
    {
      roleName: 'Agent',
      description: 'Standard clearing agent operations',
      permissions: ['create_transaction', 'view_transactions'],
    },
  ]);

  const steps = [
    { id: 1, title: 'Company Details', icon: Building2 },
    { id: 2, title: 'Admin Details', icon: User },
    { id: 3, title: 'Roles & Permissions', icon: Shield },
    { id: 4, title: 'Review & Submit', icon: CheckCircle },
  ];

  const handleCompanyDetailsChange = (field: keyof CompanyDetails, value: string) => {
    setCompanyDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleAdminDetailsChange = (field: keyof AdminDetails, value: string) => {
    setAdminDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleChange = (index: number, field: keyof RoleDetails, value: string | string[]) => {
    setRoles(prev => prev.map((role, i) => 
      i === index ? { ...role, [field]: value } : role
    ));
  };

  const addRole = () => {
    setRoles(prev => [...prev, {
      roleName: '',
      description: '',
      permissions: [],
    }]);
  };

  const removeRole = (index: number) => {
    setRoles(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting clearing agent:', { companyDetails, adminDetails, roles });
    router.push('/clearing-agents/view');
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return companyDetails.companyName && companyDetails.registrationNumber && companyDetails.kraPin;
      case 2:
        return adminDetails.firstName && adminDetails.lastName && adminDetails.email && adminDetails.phone;
      case 3:
        return roles.every(role => role.roleName && role.permissions.length > 0);
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={companyDetails.companyName}
                    onChange={(e) => handleCompanyDetailsChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    value={companyDetails.registrationNumber}
                    onChange={(e) => handleCompanyDetailsChange('registrationNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter registration number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KRA PIN *
                  </label>
                  <input
                    type="text"
                    value={companyDetails.kraPin}
                    onChange={(e) => handleCompanyDetailsChange('kraPin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter KRA PIN"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type
                  </label>
                  <select
                    value={companyDetails.businessType}
                    onChange={(e) => handleCompanyDetailsChange('businessType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select business type</option>
                    <option value="Limited Company">Limited Company</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Cooperative">Cooperative</option>
                  </select>
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={companyDetails.address}
                    onChange={(e) => handleCompanyDetailsChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter company address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={companyDetails.city}
                    onChange={(e) => handleCompanyDetailsChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={companyDetails.postalCode}
                    onChange={(e) => handleCompanyDetailsChange('postalCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter postal code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={companyDetails.website}
                    onChange={(e) => handleCompanyDetailsChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter website URL"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Description
                  </label>
                  <textarea
                    value={companyDetails.description}
                    onChange={(e) => handleCompanyDetailsChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter company description"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Administrator Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={adminDetails.firstName}
                    onChange={(e) => handleAdminDetailsChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={adminDetails.lastName}
                    onChange={(e) => handleAdminDetailsChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={adminDetails.email}
                    onChange={(e) => handleAdminDetailsChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={adminDetails.phone}
                    onChange={(e) => handleAdminDetailsChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={adminDetails.position}
                    onChange={(e) => handleAdminDetailsChange('position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter position"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KRA PIN
                  </label>
                  <input
                    type="text"
                    value={adminDetails.kraPin}
                    onChange={(e) => handleAdminDetailsChange('kraPin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter KRA PIN"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Number
                  </label>
                  <input
                    type="text"
                    value={adminDetails.idNumber}
                    onChange={(e) => handleAdminDetailsChange('idNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter ID number"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Roles & Permissions</h3>
              <div className="space-y-6">
                {roles.map((role, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-900">Role {index + 1}</h4>
                      {roles.length > 1 && (
                        <button
                          onClick={() => removeRole(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove Role
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role Name *
                        </label>
                        <input
                          type="text"
                          value={role.roleName}
                          onChange={(e) => handleRoleChange(index, 'roleName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter role name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={role.description}
                          onChange={(e) => handleRoleChange(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter role description"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Permissions *
                      </label>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                        {['create_transaction', 'view_transactions', 'manage_users', 'view_reports', 'manage_settings'].map((permission) => (
                          <label key={permission} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={role.permissions.includes(permission)}
                              onChange={(e) => {
                                const newPermissions = e.target.checked
                                  ? [...role.permissions, permission]
                                  : role.permissions.filter(p => p !== permission);
                                handleRoleChange(index, 'permissions', newPermissions);
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 capitalize">
                              {permission.replace('_', ' ')}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addRole}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
                >
                  + Add Another Role
                </button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Review & Submit</h3>
              <div className="space-y-6">
                {/* Company Details Review */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Company Details</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Company Name:</span>
                      <p className="text-gray-900">{companyDetails.companyName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Registration Number:</span>
                      <p className="text-gray-900">{companyDetails.registrationNumber}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">KRA PIN:</span>
                      <p className="text-gray-900">{companyDetails.kraPin}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Business Type:</span>
                      <p className="text-gray-900">{companyDetails.businessType}</p>
                    </div>
                  </div>
                </div>

                {/* Admin Details Review */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Administrator Details</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <p className="text-gray-900">{adminDetails.firstName} {adminDetails.lastName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-900">{adminDetails.email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span>
                      <p className="text-gray-900">{adminDetails.phone}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Position:</span>
                      <p className="text-gray-900">{adminDetails.position}</p>
                    </div>
                  </div>
                </div>

                {/* Roles Review */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Roles & Permissions</h4>
                  <div className="space-y-4">
                    {roles.map((role, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900">{role.roleName}</h5>
                        <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {role.permissions.map((permission) => (
                            <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {permission.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />
      
      {/* Main Content */}
      <div className="pt-16 transition-all duration-300 min-h-screen">
        <div className="p-4 lg:p-6 space-y-6">
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
                <h1 className="text-2xl font-semibold text-gray-900">Create Clearing Agent</h1>
                <p className="text-sm text-gray-600">Register a new clearing agent in the system</p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="min-h-96">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex items-center gap-3">
                {currentStep === 4 ? (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Application
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClearingAgent;
