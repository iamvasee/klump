"use client";

import React from 'react';
import { 
  Building2, 
  FileText, 
  Globe, 
  Database, 
  Shield, 
  Download,
  Save,
  Settings as SettingsIcon,
  MapPin,
  Phone,
  Mail,
  Hash,
  Receipt,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Edit
} from "lucide-react";
import MainLayout from '@/components/layout/MainLayout';
import { PrimaryButton, SecondaryButton, DangerButton, SuccessButton, WarningButton } from '@/components/ui/Button/index';
import { Select } from '@/components/ui/Select';

export default function SettingsPage() {
  const breadcrumbs = [
    { label: 'Settings', current: true }
  ];

  const [activeTab, setActiveTab] = React.useState('company');

  const tabs = [
    { id: 'company', label: 'Company Info', icon: Building2, active: true },
    { id: 'compliance', label: 'Compliance', icon: FileText, active: false },
    { id: 'billing', label: 'Billing & Invoicing', icon: Receipt, active: false },
    { id: 'office', label: 'Office Details', icon: MapPin, active: false },
    { id: 'security', label: 'Security', icon: Shield, active: false },
    { id: 'backup', label: 'Backup & Export', icon: Database, active: false }
  ];

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-xl">
                <SettingsIcon className="w-6 h-6 text-blue-600" />
              </div>
          <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
              </div>
            </div>
        </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Settings</h3>
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {tab.label}
                      </button>
                    );
                  })}
            </nav>
              </div>
          </div>

          {/* Settings Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Company Information */}
              {activeTab === 'company' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Building2 className="w-5 h-5 mr-3 text-blue-600" />
                      Company Information
                    </h2>
                    <p className="text-gray-600 mt-1">Manage your entity management company details and legal information</p>
                  </div>
                  
                  <div className="p-8">
                    {/* Company Logo */}
                    <div className="flex items-center space-x-6 mb-8">
                      <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                          <Building2 className="w-10 h-10 text-blue-600" />
                        </div>
                        <button 
                          className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                          aria-label="Change company logo"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                  </div>
                  <div>
                        <h3 className="text-lg font-medium text-gray-900">Company Logo</h3>
                        <p className="text-gray-500 text-sm mb-3">Upload your company logo for invoices and documents</p>
                        <div className="flex space-x-3">
                          <PrimaryButton size="sm" leftIcon={<Edit className="w-4 h-4" />}>
                            Change Logo
                    </PrimaryButton>
                          <SecondaryButton size="sm">Remove</SecondaryButton>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">PNG, JPG or SVG. Max size 2MB. Recommended: 200x200px</p>
                  </div>
                    </div>

                    {/* Company Details */}
                    <div className="space-y-6 mb-8">
                      <div className="space-y-2">
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                          Company Name *
                        </label>
                        <input
                          id="companyName"
                          type="text"
                          defaultValue="Clyra Pvt Ltd"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter company name"
                        />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="cin" className="block text-sm font-medium text-gray-700">
                            CIN (Corporate Identity Number) *
                          </label>
                          <div className="relative">
                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              id="cin"
                              type="text"
                              defaultValue="U65999TN2020PTC123456"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Enter CIN"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="pan" className="block text-sm font-medium text-gray-700">
                            PAN Number *
                          </label>
                          <div className="relative">
                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                              id="pan"
                      type="text"
                              defaultValue="ABCDE1234F"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Enter PAN"
                    />
                  </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="gst" className="block text-sm font-medium text-gray-700">
                          GST Number *
                        </label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                            id="gst"
                      type="text"
                            defaultValue="33ABCDE1234F1Z5"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter GST number"
                    />
                  </div>
                </div>

                      <div className="space-y-2">
                        <label htmlFor="registrationDate" className="block text-sm font-medium text-gray-700">
                          Registration Date *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                            id="registrationDate"
                            type="date"
                            defaultValue="2020-01-15"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                </div>

                      <div className="space-y-2">
                        <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                          Business Type *
                        </label>
                        <Select
                          id="businessType"
                          placeholder="Select Business Type"
                          required
                          options={[
                            { value: 'private', label: 'Private Limited Company' },
                            { value: 'public', label: 'Public Limited Company' },
                            { value: 'llp', label: 'Limited Liability Partnership' },
                            { value: 'partnership', label: 'Partnership Firm' },
                            { value: 'proprietorship', label: 'Sole Proprietorship' }
                          ]}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-100">
                      <PrimaryButton leftIcon={<Save className="w-4 h-4" />} size="lg">
                        Save Company Details
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              )}

              {/* Compliance Settings */}
              {activeTab === 'compliance' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <FileText className="w-5 h-5 mr-3 text-green-600" />
                      Compliance & Regulatory
                    </h2>
                    <p className="text-gray-600 mt-1">Manage regulatory compliance and legal requirements</p>
                </div>

                  <div className="p-8">
                    <div className="space-y-8">
                      {/* Entity Management License */}
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-green-100 rounded-xl">
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                <div>
                              <h4 className="text-lg font-medium text-green-900">Entity Management License</h4>
                              <p className="text-green-700 text-sm">License Number: CF/2020/12345</p>
                              <p className="text-green-600 text-xs">Valid until: Dec 31, 2025</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <SecondaryButton size="sm" leftIcon={<Edit className="w-4 h-4" />}>
                              Update
                            </SecondaryButton>
                            <WarningButton size="sm" leftIcon={<AlertTriangle className="w-4 h-4" />}>
                              Renew
                            </WarningButton>
                          </div>
                        </div>
                </div>

                      {/* RBI Registration */}
                      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                              <Building2 className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="text-lg font-medium text-blue-900">RBI Registration</h4>
                              <p className="text-blue-700 text-sm">Registration Number: RBI/CF/2020/001234</p>
                              <p className="text-blue-600 text-xs">Last Updated: Jan 15, 2024</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <SecondaryButton size="sm" leftIcon={<Edit className="w-4 h-4" />}>
                              Update
                            </SecondaryButton>
                            <PrimaryButton size="sm" leftIcon={<Download className="w-4 h-4" />}>
                              Download
                  </PrimaryButton>
                </div>
              </div>
            </div>

                      {/* Compliance Forms */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Required Compliance Documents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <div>
                                <h4 className="font-medium text-gray-900">Audit Report</h4>
                                <p className="text-sm text-gray-500">Annual audit report</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <PrimaryButton size="sm">Upload</PrimaryButton>
                              <SecondaryButton size="sm">View</SecondaryButton>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <div>
                                <h4 className="font-medium text-gray-900">Annual Return</h4>
                                <p className="text-sm text-gray-500">Annual return filing</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <PrimaryButton size="sm">Upload</PrimaryButton>
                              <SecondaryButton size="sm">View</SecondaryButton>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <div>
                                <h4 className="font-medium text-gray-900">Tax Returns</h4>
                                <p className="text-sm text-gray-500">Income tax returns</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <PrimaryButton size="sm">Upload</PrimaryButton>
                              <SecondaryButton size="sm">View</SecondaryButton>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-gray-400" />
                <div>
                                <h4 className="font-medium text-gray-900">GST Returns</h4>
                                <p className="text-sm text-gray-500">Monthly GST returns</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <PrimaryButton size="sm">Upload</PrimaryButton>
                              <SecondaryButton size="sm">View</SecondaryButton>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing & Invoicing */}
              {activeTab === 'billing' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Receipt className="w-5 h-5 mr-3 text-purple-600" />
                      Billing & Invoicing
                    </h2>
                    <p className="text-gray-600 mt-1">Configure billing settings and invoice templates</p>
                  </div>
                  
                  <div className="p-8">
                    <div className="space-y-8">
                      {/* Invoice Settings */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Invoice Settings</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="invoicePrefix" className="block text-sm font-medium text-gray-700">
                              Invoice Prefix
                            </label>
                            <input
                              id="invoicePrefix"
                              type="text"
                              defaultValue="INV"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="e.g., INV, CF, ENTITY"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">
                              Next Invoice Number
                            </label>
                            <input
                              id="invoiceNumber"
                              type="number"
                              defaultValue="1001"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Starting number"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700">
                            Payment Terms
                          </label>
                          <Select
                            id="paymentTerms"
                            placeholder="Select Payment Terms"
                            options={[
                              { value: 'immediate', label: 'Immediate Payment' },
                              { value: '7days', label: '7 Days' },
                              { value: '15days', label: '15 Days' },
                              { value: '30days', label: '30 Days' },
                              { value: 'custom', label: 'Custom' }
                            ]}
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="lateFee" className="block text-sm font-medium text-gray-700">
                            Late Payment Fee (% per month)
                          </label>
                          <input
                            id="lateFee"
                            type="number"
                            step="0.1"
                            defaultValue="2.0"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Late fee percentage"
                          />
                        </div>
                      </div>

                      {/* Bank Details */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Bank Account Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                              Bank Name
                            </label>
                            <input
                              id="bankName"
                              type="text"
                              defaultValue="State Bank of India"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Bank name"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                              Account Number
                            </label>
                            <input
                              id="accountNumber"
                              type="text"
                              defaultValue="1234567890"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Account number"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">
                              IFSC Code
                            </label>
                            <input
                              id="ifscCode"
                              type="text"
                              defaultValue="SBIN0001234"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="IFSC code"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="branchName" className="block text-sm font-medium text-gray-700">
                              Branch Name
                            </label>
                    <input
                              id="branchName"
                              type="text"
                              defaultValue="Chennai Main Branch"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Branch name"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-6 border-t border-gray-100">
                        <PrimaryButton leftIcon={<Save className="w-4 h-4" />} size="lg">
                          Save Billing Settings
                        </PrimaryButton>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Office Details */}
              {activeTab === 'office' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-orange-600" />
                      Office Details
                    </h2>
                    <p className="text-gray-600 mt-1">Manage office address and contact information</p>
                </div>

                  <div className="p-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="officeAddress" className="block text-sm font-medium text-gray-700">
                          Office Address *
                        </label>
                        <textarea
                          id="officeAddress"
                          rows={3}
                          defaultValue="123 Business Park, Anna Salai, Chennai - 600002, Tamil Nadu, India"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                          placeholder="Enter complete office address"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="officePhone" className="block text-sm font-medium text-gray-700">
                            Office Phone *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              id="officePhone"
                              type="tel"
                              defaultValue="+91 44 1234 5678"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Office phone number"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="officeEmail" className="block text-sm font-medium text-gray-700">
                            Office Email *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              id="officeEmail"
                              type="email"
                              defaultValue="office@clyra.com"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Office email address"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                            Website
                          </label>
                  <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              id="website"
                              type="url"
                              defaultValue="https://www.clyra.com"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Company website"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="workingHours" className="block text-sm font-medium text-gray-700">
                            Working Hours
                          </label>
                    <input
                            id="workingHours"
                            type="text"
                            defaultValue="9:00 AM - 6:00 PM (Mon-Fri)"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Working hours"
                          />
                  </div>
                </div>

                      <div className="flex justify-end pt-6 border-t border-gray-100">
                        <PrimaryButton leftIcon={<Save className="w-4 h-4" />} size="lg">
                          Save Office Details
                        </PrimaryButton>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Shield className="w-5 h-5 mr-3 text-red-600" />
                      System Security
                    </h2>
                    <p className="text-gray-600 mt-1">Configure system security and access controls</p>
                  </div>
                  
                  <div className="p-8">
                    <div className="space-y-8">
                      {/* Session Management */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Session Management</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                              Session Timeout (minutes)
                            </label>
                            <input
                              id="sessionTimeout"
                              type="number"
                              defaultValue="30"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Session timeout in minutes"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-gray-700">
                              Max Login Attempts
                            </label>
                            <input
                              id="maxLoginAttempts"
                              type="number"
                              defaultValue="5"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Maximum login attempts"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Data Encryption */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Data Encryption</h3>
                        
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-green-100 rounded-xl">
                                <Shield className="w-6 h-6 text-green-600" />
                              </div>
                              <div>
                                <h4 className="text-lg font-medium text-green-900">Database Encryption</h4>
                                <p className="text-green-700 text-sm">AES-256 encryption enabled</p>
                                <p className="text-green-600 text-xs">Last updated: Jan 15, 2024</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <SecondaryButton size="sm" leftIcon={<Edit className="w-4 h-4" />}>
                                Configure
                              </SecondaryButton>
                              <PrimaryButton size="sm" leftIcon={<Download className="w-4 h-4" />}>
                                Export Keys
                  </PrimaryButton>
                </div>
              </div>
            </div>
                      </div>

                      {/* Audit Logs */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Audit & Logging</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <div>
                                <h4 className="font-medium text-gray-900">Login Logs</h4>
                                <p className="text-sm text-gray-500">User login activities</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <PrimaryButton size="sm">View</PrimaryButton>
                              <SecondaryButton size="sm">Export</SecondaryButton>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <div>
                                <h4 className="font-medium text-gray-900">Transaction Logs</h4>
                                <p className="text-sm text-gray-500">Financial transactions</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <PrimaryButton size="sm">View</PrimaryButton>
                              <SecondaryButton size="sm">Export</SecondaryButton>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <div>
                                <h4 className="font-medium text-gray-900">System Logs</h4>
                                <p className="text-sm text-gray-500">System activities</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <PrimaryButton size="sm">View</PrimaryButton>
                              <SecondaryButton size="sm">Export</SecondaryButton>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                                <h4 className="font-medium text-gray-900">Error Logs</h4>
                                <p className="text-sm text-gray-500">System errors</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <PrimaryButton size="sm">View</PrimaryButton>
                              <SecondaryButton size="sm">Export</SecondaryButton>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-6 border-t border-gray-100">
                        <PrimaryButton leftIcon={<Save className="w-4 h-4" />} size="lg">
                          Save Security Settings
                        </PrimaryButton>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Backup & Export */}
              {activeTab === 'backup' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Database className="w-5 h-5 mr-3 text-indigo-600" />
                      Backup & Export
                    </h2>
                    <p className="text-gray-600 mt-1">Manage data backup and export settings</p>
                  </div>
                  
                  <div className="p-8">
                    <div className="space-y-8">
                      {/* Backup Settings */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Backup Configuration</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700">
                              Backup Frequency
                            </label>
                            <Select
                              id="backupFrequency"
                              placeholder="Select Backup Frequency"
                              options={[
                                { value: 'daily', label: 'Daily' },
                                { value: 'weekly', label: 'Weekly' },
                                { value: 'monthly', label: 'Monthly' },
                                { value: 'manual', label: 'Manual Only' }
                              ]}
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="backupRetention" className="block text-sm font-medium text-gray-700">
                              Retention Period (days)
                            </label>
                            <input
                              id="backupRetention"
                              type="number"
                              defaultValue="30"
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Days to keep backups"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="backupLocation" className="block text-sm font-medium text-gray-700">
                            Backup Location
                          </label>
                          <input
                            id="backupLocation"
                            type="text"
                            defaultValue="/var/backups/clyra"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Backup directory path"
                          />
                        </div>
                      </div>

                      {/* Export Options */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Data Export</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-center justify-between p-6 bg-green-50 border border-green-200 rounded-2xl">
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-green-100 rounded-xl">
                                <Download className="w-6 h-6 text-green-600" />
                              </div>
                              <div>
                                <h4 className="text-lg font-medium text-green-900">Export All Data</h4>
                                <p className="text-green-700 text-sm">Complete database export</p>
                              </div>
                            </div>
                            <SuccessButton size="lg" leftIcon={<Download className="w-4 h-4" />}>
                    Export
                  </SuccessButton>
                </div>

                          <div className="flex items-center justify-between p-6 bg-blue-50 border border-blue-200 rounded-2xl">
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-blue-100 rounded-xl">
                                <FileText className="w-6 h-6 text-blue-600" />
                              </div>
                  <div>
                                <h4 className="text-lg font-medium text-blue-900">Export Reports</h4>
                                <p className="text-blue-700 text-sm">Financial reports only</p>
                              </div>
                  </div>
                            <PrimaryButton size="lg" leftIcon={<FileText className="w-4 h-4" />}>
                              Export
                  </PrimaryButton>
                </div>
                        </div>
                      </div>

                      {/* Recent Backups */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Recent Backups</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <Database className="w-5 h-5 text-gray-400" />
                              <div>
                                <h4 className="font-medium text-gray-900">backup_2024_01_15_120000.sql</h4>
                                <p className="text-sm text-gray-500">Jan 15, 2024 at 12:00 PM • 2.3 MB</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <PrimaryButton size="sm">Download</PrimaryButton>
                              <DangerButton size="sm">Delete</DangerButton>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <Database className="w-5 h-5 text-gray-400" />
                  <div>
                                <h4 className="font-medium text-gray-900">backup_2024_01_14_120000.sql</h4>
                                <p className="text-sm text-gray-500">Jan 14, 2024 at 12:00 PM • 2.2 MB</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <PrimaryButton size="sm">Download</PrimaryButton>
                              <DangerButton size="sm">Delete</DangerButton>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-6 border-t border-gray-100">
                        <PrimaryButton leftIcon={<Save className="w-4 h-4" />} size="lg">
                          Save Backup Settings
                        </PrimaryButton>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
