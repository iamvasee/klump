'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  User,
  Building2,
  Shield,
  CheckCircle,
  Plus,
  TrendingUp,
  ArrowLeft,
  FileText,
  MapPin,
  CreditCard,
  Download,
  Info,
  BadgeCheck,
  FileCheck,
  Briefcase,
  ExternalLink,
  Copy,
  Check,
  Search,
  Book,
  Eye,
  Edit,
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button/index';
import { db } from '@/lib/mockdb';
import {
  Entity,
  Person,
  EntityPersonRelationship,
  BankAccount,
  CapTableEntry,
} from '@/lib/types';
import { DOCUMENT_TYPE_LABELS } from '@/lib/constants';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AddMemberModal from './AddMemberModal';
import IssueSharesModal from './IssueSharesModal';
import AddBankAccountModal from './AddBankAccountModal';
import UploadDocumentModal from './UploadDocumentModal';

export default function EntityViewContent({ uid }: { uid: string }) {
  const params = useParams();
  const workspaceSlug = params.workspace as string;
  const [entity, setEntity] = useState<Entity | null>(null);
  const [relationships, setRelationships] = useState<
    Array<
      EntityPersonRelationship & { person?: Person; related_entity?: Entity }
    >
  >([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filingFilter, setFilingFilter] = useState('all');
  const [filingSearch, setFilingSearch] = useState('');
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isIssueSharesModalOpen, setIsIssueSharesModalOpen] = useState(false);
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const entityData = db.getEntity(uid);
    if (entityData) {
      setEntity(entityData);
      const rels = db.getRelationshipsForEntity(uid);
      const relsWithPeople = rels.map((rel) => ({
        ...rel,
        person: rel.person_id ? db.getPerson(rel.person_id) : undefined,
        related_entity: rel.related_entity_id
          ? db.getEntity(rel.related_entity_id)
          : undefined,
      }));
      setRelationships(relsWithPeople);
    }
    setLoading(false);
  }, [uid]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);
  const calculateCapTable = (entity: Entity): CapTableEntry[] => {
    if (!entity.equity_ledger || !entity.share_classes) return [];

    const balances: Record<string, number> = {};
    const stakeholderInfo: Record<
      string,
      { name: string; type: 'person' | 'entity' }
    > = {};

    entity.equity_ledger.forEach((tx) => {
      const classId = tx.share_class_id;
      // Outgoing
      if (tx.from_stakeholder_id) {
        const key = `${tx.from_stakeholder_type}:${tx.from_stakeholder_id}:${classId}`;
        balances[key] = (balances[key] || 0) - tx.share_count;
      }
      // Incoming
      if (tx.to_stakeholder_id) {
        const key = `${tx.to_stakeholder_type}:${tx.to_stakeholder_id}:${classId}`;
        balances[key] = (balances[key] || 0) + tx.share_count;

        // Resolve names for display
        if (!stakeholderInfo[key]) {
          if (tx.to_stakeholder_type === 'person') {
            const person = db.getPerson(tx.to_stakeholder_id);
            stakeholderInfo[key] = {
              name: person?.full_name || 'Unknown Person',
              type: 'person',
            };
          } else {
            const ent = db.getEntity(tx.to_stakeholder_id);
            stakeholderInfo[key] = {
              name: ent?.legal_name || 'Unknown Entity',
              type: 'entity',
            };
          }
        }
      }
    });

    const totalIssued = Object.values(balances).reduce((a, b) => a + b, 0);

    return Object.entries(balances)
      .filter(([, balance]) => balance > 0)
      .map(([key, balance]) => {
        const [type, id, classId] = key.split(':');
        const info = stakeholderInfo[key];
        return {
          stakeholder_id: id,
          stakeholder_type: type as 'person' | 'entity',
          stakeholder_name: info.name,
          share_class_id: classId,
          shares_held: balance,
          percentage_holding: (balance / totalIssued) * 100,
        };
      })
      .sort((a, b) => b.shares_held - a.shares_held);
  };

  const breadcrumbs = [
    { label: 'Entities', href: '/entities' },
    {
      label: entity?.short_name || entity?.legal_name || 'Loading...',
      current: true,
    },
  ];

  // Empty string since I already moved useEffect

  const handleCopyBankDetails = async (acc: BankAccount) => {
    const details = `Bank: ${acc.bank_name}
Account Name: ${acc.account_holder_name}
Account Number: ${acc.account_number}
IFSC: ${acc.ifsc_code}
${acc.swift_code ? `SWIFT: ${acc.swift_code}` : ''}
${acc.iban ? `IBAN: ${acc.iban}` : ''}
Branch: ${acc.branch || 'N/A'}`;

    try {
      await navigator.clipboard.writeText(details);
      setCopiedId(acc.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDocumentIcon = (type: string) => {
    if (!type) return <FileText className="w-5 h-5 text-gray-600" />;
    if (type.includes('gst'))
      return <BadgeCheck className="w-5 h-5 text-blue-600" />;
    if (type.includes('mca') || type === 'certificate_of_incorporation')
      return <Building2 className="w-5 h-5 text-indigo-600" />;
    if (type.includes('itr') || type.includes('tds') || type === 'pan_card')
      return <FileText className="w-5 h-5 text-orange-600" />;
    if (type.includes('pf') || type.includes('esi'))
      return <Users className="w-5 h-5 text-green-600" />;
    return <FileCheck className="w-5 h-5 text-gray-600" />;
  };

  const getFilingCategory = (type: string) => {
    if (!type) return 'others';
    if (type.includes('gst')) return 'gst';
    if (
      type.includes('itr') ||
      type.includes('tds') ||
      type === 'pan_card' ||
      type === 'tan_allotment'
    )
      return 'tax';
    if (
      type.includes('mca') ||
      type === 'certificate_of_incorporation' ||
      type === 'moa_aoa' ||
      type === 'balance_sheet'
    )
      return 'mca';
    if (
      type.includes('pf') ||
      type.includes('esi') ||
      type === 'professional_tax_return'
    )
      return 'labor';
    if (
      type.includes('fssai') ||
      type.includes('udyam') ||
      type.includes('iec')
    )
      return 'licenses';
    return 'others';
  };

  if (loading) {
    return (
      <MainLayout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </MainLayout>
    );
  }

  if (!entity) {
    return (
      <MainLayout breadcrumbs={breadcrumbs}>
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Entity Not Found
          </h2>
          <SecondaryButton
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => window.history.back()}
          >
            Go Back
          </SecondaryButton>
        </div>
      </MainLayout>
    );
  }

  const directors = relationships.filter((r) =>
    ['director', 'managing_director', 'partner', 'designated_partner'].includes(
      r.role
    )
  );
  const professionalAppointments = relationships.filter((r) =>
    ['auditor', 'company_secretary'].includes(r.role)
  );

  // Static/One-time documents
  const staticDocTypes = [
    'certificate_of_incorporation',
    'llp_agreement',
    'pan_card',
    'aadhaar_card',
    'tan_allotment',
    'gst_certificate',
    'moa_aoa',
    'fssai_license',
    'udyam_certificate',
    'iec_certificate',
  ];

  const staticDocuments =
    entity.documents?.filter((doc) =>
      staticDocTypes.includes(doc.document_type)
    ) || [];

  // Filings filtering using the new Filing interface
  const filteredFilings =
    entity.filings?.filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(filingSearch.toLowerCase()) ||
        (f.description || '')
          .toLowerCase()
          .includes(filingSearch.toLowerCase());
      const matchesFilter =
        filingFilter === 'all' ||
        getFilingCategory(f.filing_type) === filingFilter;
      return matchesSearch && matchesFilter;
    }) || [];

  const filingCategories = [
    { id: 'all', label: 'All' },
    { id: 'tax', label: 'Income Tax' },
    { id: 'gst', label: 'GST' },
    { id: 'labor', label: 'Labor/PF/ESI' },
    { id: 'mca', label: 'MCA/Annual' },
    { id: 'others', label: 'Others' },
  ];

  const isLimitedCompany = ['private_limited', 'public_limited'].includes(
    entity.entity_type
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'management', label: 'Management', icon: Users },
    ...(isLimitedCompany
      ? [{ id: 'ownership', label: 'Ownership', icon: TrendingUp }]
      : []),
    { id: 'banking', label: 'Banking', icon: CreditCard },
    { id: 'statutory', label: 'Statutory Docs', icon: Book },
    { id: 'filings', label: 'Filings', icon: Shield },
  ];

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 bg-white sticky top-0 z-10">
            <div className="flex overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-5 px-6 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50/30'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon
                    className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`}
                  />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-10">
                {/* Entity Identity Section */}
                <div className="flex flex-col md:flex-row md:items-start gap-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 shrink-0">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                          {entity.legal_name}
                        </h1>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(entity.status)}`}
                        >
                          {entity.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-base text-gray-500 font-medium">
                          {entity.short_name || 'Legal Entity Identity'}
                        </p>
                        <Link href={`/${workspaceSlug}/entities/${uid}/edit`}>
                          <SecondaryButton
                            size="sm"
                            leftIcon={<Edit className="w-4 h-4" />}
                          >
                            Edit Entity
                          </SecondaryButton>
                        </Link>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-gray-100">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                          Entity Type
                        </label>
                        <p className="text-sm font-semibold text-gray-700 capitalize">
                          {entity.entity_type.replace('_', ' ')}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                          Incorporation Date
                        </label>
                        <p className="text-sm font-semibold text-gray-700">
                          {entity.date_of_incorporation || 'N/A'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                          PAN
                        </label>
                        <p className="text-sm font-mono font-semibold text-gray-700">
                          {entity.pan || 'N/A'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                          TAN
                        </label>
                        <p className="text-sm font-mono font-semibold text-gray-700">
                          {entity.tan || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Registration Details
                    </h3>
                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                        <span className="text-sm font-medium text-gray-500">
                          CIN / LLPIN
                        </span>
                        <span className="text-sm font-mono font-semibold text-gray-900">
                          {entity.cin || entity.llpin || 'N/A'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium text-gray-500">
                          Nature of Business
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {entity.nature_of_business || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      Registered Office
                    </h3>
                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                      <p className="text-gray-700 font-medium leading-relaxed">
                        {entity.address_line1}
                        <br />
                        {entity.address_line2 && (
                          <>
                            {entity.address_line2}
                            <br />
                          </>
                        )}
                        {entity.city}, {entity.state} {entity.pin_code}
                        <br />
                        <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2 block">
                          India
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Management Tab */}
            {activeTab === 'management' && (
              <div className="space-y-10">
                {/* Board of Directors / Partners */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      {['llp', 'partnership'].includes(entity.entity_type)
                        ? 'Partners'
                        : 'Board of Directors'}
                    </h2>
                    <PrimaryButton
                      size="sm"
                      onClick={() => setIsAddMemberModalOpen(true)}
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      Add Member
                    </PrimaryButton>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest w-16">
                            S.No.
                          </th>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            Name
                          </th>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            Designation
                          </th>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            DIN / DPIN
                          </th>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            Start Date
                          </th>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            End Date
                          </th>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            Authority
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {directors.map((rel, index) => {
                          const appointmentFiling = entity.filings?.find(
                            (f) => f.id === rel.appointment_filing_id
                          );
                          return (
                            <tr
                              key={rel.id}
                              className="hover:bg-blue-50/30 transition-colors"
                            >
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">
                                {index + 1}
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap">
                                <Link
                                  href={`/${workspaceSlug}/people/${rel.person_id}`}
                                  className="flex items-center group"
                                >
                                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mr-3 group-hover:bg-blue-600 transition-all duration-300">
                                    <span className="text-blue-700 group-hover:text-white font-bold text-sm">
                                      {rel.person?.full_name[0]}
                                    </span>
                                  </div>
                                  <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {rel.person?.full_name}
                                  </div>
                                </Link>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap">
                                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-semibold rounded-lg uppercase tracking-wider">
                                  {rel.role.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap text-xs font-mono font-medium text-gray-500">
                                {rel.person?.din || rel.person?.dpin || 'N/A'}
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">
                                {rel.effective_from || 'N/A'}
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">
                                {rel.effective_to || 'Present'}
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap">
                                {appointmentFiling ? (
                                  <Link
                                    href={`/${workspaceSlug}/entities/${entity.id}/filings/${appointmentFiling.id}`}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    <FileCheck className="w-3.5 h-3.5" />
                                    {appointmentFiling.name
                                      .split('(')[0]
                                      .trim()}
                                  </Link>
                                ) : (
                                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter italic">
                                    Not Linked
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Professional Appointments */}
                <div className="space-y-4">
                  <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    Professional Appointments
                  </h2>
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest w-16">
                            S.No.
                          </th>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            Professional / Firm
                          </th>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            Role
                          </th>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            Start Date
                          </th>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            End Date
                          </th>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            Authority
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {professionalAppointments.map((rel, index) => {
                          const appointmentFiling = entity.filings?.find(
                            (f) => f.id === rel.appointment_filing_id
                          );
                          return (
                            <tr
                              key={rel.id}
                              className="hover:bg-indigo-50/30 transition-colors"
                            >
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">
                                {index + 1}
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mr-3">
                                    <span className="text-indigo-700 font-bold text-sm">
                                      {
                                        (rel.person?.full_name ||
                                          rel.related_entity?.legal_name)?.[0]
                                      }
                                    </span>
                                  </div>
                                  <div className="text-sm font-bold text-gray-900">
                                    {rel.person?.full_name ||
                                      rel.related_entity?.legal_name}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap">
                                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-semibold rounded-lg uppercase tracking-wider min-w-[140px] text-center inline-block">
                                  {rel.role.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">
                                {rel.effective_from || 'N/A'}
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">
                                {rel.effective_to || 'Present'}
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap">
                                {appointmentFiling ? (
                                  <Link
                                    href={`/${workspaceSlug}/entities/${entity.id}/filings/${appointmentFiling.id}`}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    <FileCheck className="w-3.5 h-3.5" />
                                    {appointmentFiling.name
                                      .split('(')[0]
                                      .trim()}
                                  </Link>
                                ) : (
                                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter italic">
                                    Not Linked
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Ownership Tab */}
            {activeTab === 'ownership' && isLimitedCompany && (
              <div className="space-y-10">
                {/* Shareholders */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      Shareholding Pattern
                    </h2>
                    <PrimaryButton
                      size="sm"
                      onClick={() => setIsIssueSharesModalOpen(true)}
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      Issue Shares
                    </PrimaryButton>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            Shareholder
                          </th>
                          <th className="px-6 py-4 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            Shares
                          </th>
                          <th className="px-6 py-4 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            Holdings (%)
                          </th>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {calculateCapTable(entity).map((entry) => (
                          <tr
                            key={`${entry.stakeholder_type}:${entry.stakeholder_id}:${entry.share_class_id}`}
                            className="hover:bg-green-50/30 transition-colors"
                          >
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div className="flex items-center">
                                {entry.stakeholder_type === 'entity' ? (
                                  <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                                ) : (
                                  <User className="w-4 h-4 text-gray-400 mr-2" />
                                )}{' '}
                                <Link
                                  href={
                                    entry.stakeholder_type === 'entity'
                                      ? `/entities/${entry.stakeholder_id}`
                                      : `/people/${entry.stakeholder_id}`
                                  }
                                  className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                >
                                  {entry.stakeholder_name}
                                </Link>
                              </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap text-right">
                              <span className="text-sm font-bold text-gray-900">
                                {entry.shares_held.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-3">
                                <div className="w-24 bg-gray-100 rounded-full h-1.5 hidden md:block">
                                  <div
                                    className="bg-green-500 h-1.5 rounded-full"
                                    style={{
                                      width: `${entry.percentage_holding}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm font-bold text-gray-900">
                                  {entry.percentage_holding.toFixed(2)}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <span className="flex items-center text-green-600 text-[10px] font-bold uppercase tracking-widest">
                                <CheckCircle className="w-3.5 h-3.5 mr-1" />{' '}
                                Active
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Banking Tab */}
            {activeTab === 'banking' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    Bank Accounts
                  </h2>
                  <PrimaryButton
                    size="sm"
                    onClick={() => setIsAddBankModalOpen(true)}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Bank Account
                  </PrimaryButton>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {entity.bank_accounts?.map((acc) => (
                    <div
                      key={acc.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all relative group"
                    >
                      {acc.is_primary && (
                        <div className="absolute top-4 right-4 bg-blue-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shadow-lg shadow-blue-600/20 tracking-tighter">
                          Primary
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 tracking-tight">
                              {acc.bank_name}
                            </h3>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                              {acc.account_type} Account
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopyBankDetails(acc)}
                          className={`p-2 rounded-xl transition-all ${
                            copiedId === acc.id
                              ? 'bg-green-50 text-green-600'
                              : 'bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600'
                          }`}
                          title="Copy Account Details"
                        >
                          {copiedId === acc.id ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="space-y-3.5 pt-4 border-t border-gray-50">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                            Account Name
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {acc.account_holder_name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                            Account Number
                          </span>
                          <span className="text-sm font-mono font-medium text-gray-900">
                            {acc.account_number}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                            IFSC Code
                          </span>
                          <span className="text-sm font-mono font-medium text-gray-900">
                            {acc.ifsc_code}
                          </span>
                        </div>
                        {acc.swift_code && (
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                              SWIFT / BIC
                            </span>
                            <span className="text-sm font-mono font-medium text-gray-900">
                              {acc.swift_code}
                            </span>
                          </div>
                        )}
                        {acc.iban && (
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                              IBAN
                            </span>
                            <p className="text-xs font-mono font-medium text-gray-900 bg-gray-50 p-2 rounded-lg border border-gray-100/50 break-all">
                              {acc.iban}
                            </p>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                            Branch
                          </span>
                          <span className="text-sm text-gray-700 font-medium">
                            {acc.branch || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-gray-300 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all duration-300 group">
                    <Plus className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold uppercase tracking-widest">
                      Link New Account
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Statutory Documents Tab */}
            {activeTab === 'statutory' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    Statutory Documents
                  </h2>
                  <PrimaryButton
                    size="sm"
                    onClick={() => setIsUploadDocModalOpen(true)}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Upload Document
                  </PrimaryButton>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {staticDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-start hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 group"
                    >
                      <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 mb-6">
                        {getDocumentIcon(doc.document_type)}
                      </div>
                      <div className="flex-1 space-y-1.5 mb-6">
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 leading-tight transition-colors line-clamp-2">
                          {doc.file_name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {DOCUMENT_TYPE_LABELS[doc.document_type] ||
                              doc.document_type.replace(/_/g, ' ')}
                          </p>
                        </div>
                        {doc.document_date && (
                          <p className="text-[10px] text-gray-500 font-medium italic">
                            Issued: {doc.document_date}
                          </p>
                        )}
                      </div>
                      <div className="w-full pt-4 border-t border-gray-50 flex items-center gap-2">
                        <button className="flex-1 py-3 bg-gray-50 group-hover:bg-blue-600 text-gray-400 group-hover:text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-bold text-[10px] uppercase tracking-widest">
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                        <button className="p-3 bg-gray-50 group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-600 rounded-xl transition-all duration-300">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-gray-300 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all duration-300 group min-h-[260px]">
                    <Plus className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Add Statutory Doc
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Filings Tab */}
            {activeTab === 'filings' && (
              <div className="space-y-8">
                {/* Filing Filters & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex overflow-x-auto no-scrollbar gap-2">
                    {filingCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setFilingFilter(cat.id)}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border ${
                          filingFilter === cat.id
                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64 group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="text"
                        placeholder="Search filings..."
                        value={filingSearch}
                        onChange={(e) => setFilingSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm font-medium border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all"
                      />
                    </div>
                    <Link
                      href={`/${workspaceSlug}/entities/${uid}/filings/add`}
                    >
                      <PrimaryButton
                        size="sm"
                        leftIcon={<Plus className="w-4 h-4" />}
                      >
                        Create Filing
                      </PrimaryButton>
                    </Link>
                  </div>
                </div>

                {/* Filings List - Dense Row Layout */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest w-12">
                          #
                        </th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Filing Name
                        </th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          FY / Period
                        </th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Filing Date
                        </th>
                        <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredFilings.map((filing, index) => (
                        <tr
                          key={filing.id}
                          className="hover:bg-blue-50/30 transition-colors group"
                        >
                          <td className="px-6 py-5 whitespace-nowrap text-xs font-bold text-gray-400">
                            {String(index + 1).padStart(2, '0')}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <Link
                              href={`/${workspaceSlug}/entities/${uid}/filings/${filing.id}`}
                              className="flex items-center group/name"
                            >
                              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3 group-hover/name:bg-blue-100 transition-colors">
                                {getDocumentIcon(filing.filing_type)}
                              </div>
                              <div className="text-sm font-semibold text-gray-900 tracking-tight group-hover/name:text-blue-600 transition-colors">
                                {filing.name}
                              </div>
                            </Link>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                              {DOCUMENT_TYPE_LABELS[filing.filing_type] ||
                                filing.filing_type}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-700">
                            {filing.financial_year}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">
                            {filing.filing_date}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right">
                            <div className="flex justify-end gap-2">
                              <Link
                                href={`/${workspaceSlug}/entities/${uid}/filings/${filing.id}`}
                              >
                                <button
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </Link>
                              <button
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="Download Proof"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredFilings.length === 0 && (
                    <div className="py-20 text-center bg-white">
                      <Shield className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-400 font-medium">
                        No recurring filings match your current criteria.
                      </p>
                      <button
                        onClick={() => {
                          setFilingFilter('all');
                          setFilingSearch('');
                        }}
                        className="mt-2 text-blue-600 text-sm font-bold hover:underline"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddMemberModal
        entityId={uid}
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onSuccess={fetchData}
      />
      <IssueSharesModal
        entity={entity}
        isOpen={isIssueSharesModalOpen}
        onClose={() => setIsIssueSharesModalOpen(false)}
        onSuccess={fetchData}
      />
      <AddBankAccountModal
        entityId={uid}
        isOpen={isAddBankModalOpen}
        onClose={() => setIsAddBankModalOpen(false)}
        onSuccess={fetchData}
      />
      <UploadDocumentModal
        entityId={uid}
        isOpen={isUploadDocModalOpen}
        onClose={() => setIsUploadDocModalOpen(false)}
        onSuccess={fetchData}
      />
    </MainLayout>
  );
}
