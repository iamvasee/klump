'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Wallet,
  Send,
  Eye,
  Search,
  DollarSign,
  Clock,
  User,
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface WalletEntry {
  id: string;
  walletId: string;
  memberId: string;
  memberName: string;
  amount: number;
  type: 'Credit' | 'Debit';
  paymentMethod: 'Bank' | 'Cash';
  bankName: string | null;
  transactionDate: string;
  createdBy: string;
  status: 'Approved' | 'Rejected';
  description: string;
  approvedBy: string;
  approvedAt: string;
}

interface Disbursement {
  id: string;
  type: string;
  recipientName: string;
  recipientId: string;
  amount: number;
  description: string;
  groupName: string;
  requestedBy: string;
  requestedAt: string;
  status: 'Approved' | 'Rejected';
  approvedBy: string;
  approvedAt: string;
}

export default function ApprovalLogsPage() {
  const params = useParams();
  const workspaceSlug = params.workspace as string;
  const breadcrumbs = [
    { label: 'Compliance', href: `/${workspaceSlug}/compliance` },
    { label: 'Approval Logs', current: true },
  ];

  const [activeTab, setActiveTab] = useState<'wallet' | 'disbursement'>(
    'wallet'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<
    WalletEntry | Disbursement | null
  >(null);
  // Mock data for approved/rejected wallet entries
  const walletEntries: WalletEntry[] = [
    {
      id: 'WE003',
      walletId: 'WALLET-2024-003',
      memberId: 'MEM003',
      memberName: 'Amit Patel',
      amount: 25000,
      type: 'Credit',
      paymentMethod: 'Bank',
      bankName: 'SBI Bank - Savings A/C',
      transactionDate: '2024-10-03T16:45:00',
      createdBy: 'System',
      status: 'Approved',
      description: 'Auction winning amount deposit',
      approvedBy: 'Admin',
      approvedAt: '2024-10-03T17:00:00',
    },
    {
      id: 'WE004',
      walletId: 'WALLET-2024-004',
      memberId: 'MEM004',
      memberName: 'Sunita Singh',
      amount: 12000,
      type: 'Debit',
      paymentMethod: 'Bank',
      bankName: 'ICICI Bank - Current A/C',
      transactionDate: '2024-10-03T14:20:00',
      createdBy: 'Admin',
      status: 'Rejected',
      description: 'Loan disbursement',
      approvedBy: 'Manager',
      approvedAt: '2024-10-03T15:00:00',
    },
    {
      id: 'WE006',
      walletId: 'WALLET-2024-006',
      memberId: 'MEM006',
      memberName: 'Kavita Sharma',
      amount: 18000,
      type: 'Credit',
      paymentMethod: 'Cash',
      bankName: null,
      transactionDate: '2024-10-02T11:30:00',
      createdBy: 'Kavita Sharma',
      status: 'Approved',
      description: 'Cash deposit for monthly contribution',
      approvedBy: 'Admin',
      approvedAt: '2024-10-02T12:00:00',
    },
    {
      id: 'WE007',
      walletId: 'WALLET-2024-007',
      memberId: 'MEM007',
      memberName: 'Suresh Kumar',
      amount: 7500,
      type: 'Debit',
      paymentMethod: 'Cash',
      bankName: null,
      transactionDate: '2024-10-01T16:15:00',
      createdBy: 'Suresh Kumar',
      status: 'Rejected',
      description: 'Emergency cash withdrawal',
      approvedBy: 'Manager',
      approvedAt: '2024-10-01T17:30:00',
    },
  ];

  // Mock data for approved/rejected disbursements
  const disbursements: Disbursement[] = [
    {
      id: 'DIS003',
      type: 'Refund',
      recipientName: 'Priya Sharma',
      recipientId: 'MEM002',
      amount: 3000,
      description: 'Overpayment refund',
      groupName: 'Premium Entity Management Group B',
      requestedBy: 'Admin',
      requestedAt: '2024-10-03T15:45:00',
      status: 'Approved',
      approvedBy: 'Manager',
      approvedAt: '2024-10-03T16:00:00',
    },
    {
      id: 'DIS004',
      type: 'Dividend Distribution',
      recipientName: 'Multiple Members',
      recipientId: 'GRP002',
      amount: 45000,
      description: 'Dividend distribution for auction AUC003',
      groupName: 'Premium Entity Management Group B',
      requestedBy: 'System',
      requestedAt: '2024-10-02T14:30:00',
      status: 'Approved',
      approvedBy: 'Admin',
      approvedAt: '2024-10-02T15:00:00',
    },
    {
      id: 'DIS005',
      type: 'Loan Disbursement',
      recipientName: 'Vikram Mehta',
      recipientId: 'MEM005',
      amount: 20000,
      description: 'Personal loan disbursement',
      groupName: 'Office Colleagues Entity Management',
      requestedBy: 'Vikram Mehta',
      requestedAt: '2024-10-01T10:00:00',
      status: 'Rejected',
      approvedBy: 'Manager',
      approvedAt: '2024-10-01T11:30:00',
    },
  ];
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'credit':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'debit':
        return <DollarSign className="w-4 h-4 text-red-600" />;
      default:
        return <Send className="w-4 h-4 text-blue-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const filteredWalletEntries = walletEntries.filter((entry) => {
    const matchesSearch =
      entry.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.walletId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.approvedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' ||
      entry.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const filteredDisbursements = disbursements.filter((disbursement) => {
    const matchesSearch =
      disbursement.recipientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      disbursement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disbursement.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      disbursement.approvedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' ||
      disbursement.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const openModal = (entry: WalletEntry | Disbursement) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEntry(null);
  };
  // Calculate stats
  const approvedWalletEntries = walletEntries.filter(
    (e) => e.status === 'Approved'
  ).length;
  const rejectedWalletEntries = walletEntries.filter(
    (e) => e.status === 'Rejected'
  ).length;
  const approvedDisbursements = disbursements.filter(
    (d) => d.status === 'Approved'
  ).length;
  const rejectedDisbursements = disbursements.filter(
    (d) => d.status === 'Rejected'
  ).length;
  const totalApproved = approvedWalletEntries + approvedDisbursements;
  const totalRejected = rejectedWalletEntries + rejectedDisbursements;
  const totalTransactions = walletEntries.length + disbursements.length;

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Approval Logs</h1>
            <p className="mt-1 text-sm text-gray-600">
              View all approved and rejected wallet entries and disbursements
            </p>
          </div>
          <Link href={`/${workspaceSlug}/compliance`}>
            <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
              Back to Compliance
            </button>
          </Link>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Approved
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalApproved}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Rejected
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalRejected}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalTransactions}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Approval Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalTransactions > 0
                    ? Math.round((totalApproved / totalTransactions) * 100)
                    : 0}
                  %
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('wallet')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'wallet'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4" />
                  <span>Wallet Entries ({walletEntries.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('disbursement')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'disbursement'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Disbursements ({disbursements.length})</span>
                </div>
              </button>
            </nav>
          </div>
          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'wallet' ? 'wallet entries' : 'disbursements'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Filter by status"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
          {/* Content */}
          <div className="overflow-x-auto">
            {activeTab === 'wallet' ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wallet & Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount & Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status & Approved By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approval Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredWalletEntries.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No wallet entries found
                      </td>
                    </tr>
                  ) : (
                    filteredWalletEntries.map((entry, index) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              {getTypeIcon(entry.type)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {entry.walletId}
                              </div>
                              <div className="text-sm text-gray-500">
                                {entry.memberName} ({entry.memberId})
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div
                              className={`text-sm font-medium ${
                                entry.type === 'Credit'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {entry.type === 'Credit' ? '+' : '-'}
                              {formatCurrency(entry.amount)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {entry.type}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {entry.paymentMethod}
                            </div>
                            {entry.bankName && (
                              <div className="text-sm text-gray-500">
                                {entry.bankName}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}
                            >
                              {entry.status}
                            </span>
                            <div className="flex items-center text-xs text-gray-500">
                              <User className="w-3 h-3 mr-1" />
                              {entry.approvedBy}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDateTime(entry.approvedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openModal(entry)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Disbursement Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient & Group
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount & Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status & Approved By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approval Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDisbursements.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No disbursements found
                      </td>
                    </tr>
                  ) : (
                    filteredDisbursements.map((disbursement, index) => (
                      <tr key={disbursement.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                              <Send className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {disbursement.id}
                              </div>
                              <div className="text-sm text-gray-500">
                                {disbursement.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {disbursement.recipientName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {disbursement.groupName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-green-600">
                              {formatCurrency(disbursement.amount)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {disbursement.type}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(disbursement.status)}`}
                            >
                              {disbursement.status}
                            </span>
                            <div className="flex items-center text-xs text-gray-500">
                              <User className="w-3 h-3 mr-1" />
                              {disbursement.approvedBy}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDateTime(disbursement.approvedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openModal(disbursement)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {/* Modal */}
      {showModal && selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Transaction Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {activeTab === 'wallet' && 'walletId' in selectedEntry ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Wallet ID:
                    </span>
                    <span className="text-sm text-gray-900">
                      {selectedEntry.walletId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Member:
                    </span>
                    <span className="text-sm text-gray-900">
                      {selectedEntry.memberName} ({selectedEntry.memberId})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Amount:
                    </span>
                    <span
                      className={`text-sm font-medium ${selectedEntry.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {selectedEntry.type === 'Credit' ? '+' : '-'}
                      {formatCurrency(selectedEntry.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Type:
                    </span>
                    <span className="text-sm text-gray-900">
                      {selectedEntry.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Payment Method:
                    </span>
                    <span className="text-sm text-gray-900">
                      {selectedEntry.paymentMethod}
                    </span>
                  </div>
                  {selectedEntry.bankName && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Bank:
                      </span>
                      <span className="text-sm text-gray-900">
                        {selectedEntry.bankName}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Transaction Date:
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDateTime(selectedEntry.transactionDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Created By:
                    </span>
                    <span className="text-sm text-gray-900">
                      {selectedEntry.createdBy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Status:
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedEntry.status)}`}
                    >
                      {selectedEntry.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Approved By:
                    </span>
                    <span className="text-sm text-gray-900">
                      {selectedEntry.approvedBy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Approval Date:
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDateTime(selectedEntry.approvedAt)}
                    </span>
                  </div>
                  {selectedEntry.description && (
                    <div className="pt-2 border-t border-gray-200">
                      <span className="text-sm font-medium text-gray-500">
                        Description:
                      </span>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedEntry.description}
                      </p>
                    </div>
                  )}
                </>
              ) : activeTab === 'disbursement' &&
                'recipientName' in selectedEntry ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      ID:
                    </span>
                    <span className="text-sm text-gray-900">
                      {selectedEntry.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Recipient:
                    </span>
                    <span className="text-sm text-gray-900">
                      {selectedEntry.recipientName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Amount:
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {formatCurrency(selectedEntry.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Type:
                    </span>
                    <span className="text-sm text-gray-900">
                      {selectedEntry.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Group:
                    </span>
                    <span className="text-sm text-gray-900">
                      {selectedEntry.groupName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Requested:
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDateTime(selectedEntry.requestedAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Requested By:
                    </span>
                    <span className="text-sm text-gray-900">
                      {selectedEntry.requestedBy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Status:
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedEntry.status)}`}
                    >
                      {selectedEntry.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Approved By:
                    </span>
                    <span className="text-sm text-gray-900">
                      {selectedEntry.approvedBy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Approval Date:
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDateTime(selectedEntry.approvedAt)}
                    </span>
                  </div>
                  {selectedEntry.description && (
                    <div className="pt-2 border-t border-gray-200">
                      <span className="text-sm font-medium text-gray-500">
                        Description:
                      </span>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedEntry.description}
                      </p>
                    </div>
                  )}
                </>
              ) : null}
            </div>

            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
