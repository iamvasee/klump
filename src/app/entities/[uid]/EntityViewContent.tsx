'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Building2,
  Shield,
  CheckCircle,
  Edit,
  Plus,
  MoreVertical,
  Phone,
  Mail,
  User,
  TrendingUp,
  History,
  ArrowLeft,
  Trash2,
  FileText,
  Settings,
  Lock,
  Clock,
  Globe,
  MapPin,
  Hash,
  CreditCard,
  Download,
  Info,
  BadgeCheck,
  FileCheck,
  Briefcase,
  ExternalLink,
  Copy,
  Check
} from "lucide-react";
import MainLayout from '@/components/layout/MainLayout';
import {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  OutlineButton
} from '@/components/ui/Button/index';
import { db } from '@/lib/mockdb';
import { Entity, Person, EntityPersonRelationship, Document, BankAccount } from '@/lib/types';
import Link from 'next/link';

export default function EntityViewContent({ uid }: { uid: string }) {
  const [entity, setEntity] = useState<Entity | null>(null);
  const [relationships, setRelationships] = useState<Array<EntityPersonRelationship & { person?: Person }>>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const breadcrumbs = [
    { label: 'Entities', href: '/entities' },
    { label: entity?.short_name || entity?.legal_name || 'Loading...', current: true }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const entityData = db.getEntity(uid);
      if (entityData) {
        setEntity(entityData);
        const rels = db.getRelationshipsForEntity(uid);
        const relsWithPeople = rels.map(rel => ({
          ...rel,
          person: db.getPerson(rel.person_id)
        }));
        setRelationships(relsWithPeople);
      }
      setLoading(false);
    };

    fetchData();
  }, [uid]);

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
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'certificate_of_incorporation': return <BadgeCheck className="w-5 h-5 text-blue-600" />;
      case 'pan_card': return <FileText className="w-5 h-5 text-orange-600" />;
      case 'itr_acknowledgement': return <FileCheck className="w-5 h-5 text-green-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Entity Not Found</h2>
          <SecondaryButton leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => window.history.back()}>
            Go Back
          </SecondaryButton>
        </div>
      </MainLayout>
    );
  }

  const directors = relationships.filter(r => ['director', 'managing_director', 'partner', 'designated_partner'].includes(r.role));
  const shareholders = relationships.filter(r => r.role === 'shareholder');
  const professionalAppointments = relationships.filter(r => ['auditor', 'company_secretary'].includes(r.role));

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 bg-white sticky top-0 z-10">
            <div className="flex overflow-x-auto no-scrollbar">
              {[
                { id: 'overview', label: 'Overview', icon: Info },
                { id: 'management', label: 'Management', icon: Users },
                { id: 'banking', label: 'Banking', icon: CreditCard },
                { id: 'compliance', label: 'Compliance', icon: Shield },
                { id: 'documents', label: 'Documents', icon: FileText }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-5 px-6 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50/30'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="hidden md:flex items-center gap-3">
               <OutlineButton size="sm" leftIcon={<Edit className="w-3.5 h-3.5" />}>Edit</OutlineButton>
               <PrimaryButton size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>Stakeholder</PrimaryButton>
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
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{entity.legal_name}</h1>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(entity.status)}`}>
                          {entity.status}
                        </span>
                      </div>
                      <p className="text-base text-gray-500 font-medium">{entity.short_name || 'Legal Entity Identity'}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-gray-100">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Entity Type</label>
                        <p className="text-sm font-semibold text-gray-700 capitalize">{entity.entity_type.replace('_', ' ')}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Incorporation Date</label>
                        <p className="text-sm font-semibold text-gray-700">{entity.date_of_incorporation || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">PAN</label>
                        <p className="text-sm font-mono font-semibold text-gray-700">{entity.pan || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">TAN</label>
                        <p className="text-sm font-mono font-semibold text-gray-700">{entity.tan || 'N/A'}</p>
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
                        <span className="text-sm font-medium text-gray-500">CIN / LLPIN</span>
                        <span className="text-sm font-mono font-semibold text-gray-900">{entity.cin || entity.llpin || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                        <span className="text-sm font-medium text-gray-500">FSSAI License</span>
                        <span className="text-sm font-mono font-semibold text-gray-900">{entity.fssai || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium text-gray-500">Nature of Business</span>
                        <span className="text-sm font-semibold text-gray-900">{entity.nature_of_business || 'N/A'}</span>
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
                        {entity.address_line1}<br />
                        {entity.address_line2 && <>{entity.address_line2}<br /></>}
                        {entity.city}, {entity.state} {entity.pin_code}<br />
                        <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2 block">India</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Management Tab */}
            {activeTab === 'management' && (
              <div className="space-y-8">
                {/* Directors */}
                <div className="space-y-4">
                  <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    Board of Directors & Partners
                  </h2>
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Name</th>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Designation</th>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">DIN / DPIN</th>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Since</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {directors.map((rel) => (
                          <tr key={rel.id} className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-6 py-5 whitespace-nowrap">
                              <Link href={`/people/${rel.person_id}`} className="flex items-center group">
                                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mr-3 group-hover:bg-blue-600 transition-all duration-300">
                                  <span className="text-blue-700 group-hover:text-white font-bold text-sm">{rel.person?.full_name[0]}</span>
                                </div>
                                <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{rel.person?.full_name}</div>
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
                              {rel.effective_from}
                            </td>
                          </tr>
                        ))}
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
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Professional / Firm</th>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Role</th>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Since</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {professionalAppointments.map((rel) => (
                          <tr key={rel.id} className="hover:bg-indigo-50/30 transition-colors">
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mr-3">
                                  <span className="text-indigo-700 font-bold text-sm">{rel.person?.full_name[0]}</span>
                                </div>
                                <div className="text-sm font-semibold text-gray-900">{rel.person?.full_name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-semibold rounded-lg uppercase tracking-wider min-w-[140px] text-center inline-block">
                                {rel.role.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">
                              {rel.effective_from}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Shareholders */}
                <div className="space-y-4">
                  <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    Shareholding Pattern
                  </h2>
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Shareholder</th>
                          <th className="px-6 py-4 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Holdings (%)</th>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {shareholders.map((rel) => (
                          <tr key={rel.id} className="hover:bg-green-50/30 transition-colors">
                            <td className="px-6 py-5 whitespace-nowrap">
                              <Link href={`/people/${rel.person_id}`} className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                {rel.person?.full_name}
                              </Link>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-3">
                                <div className="w-24 bg-gray-100 rounded-full h-1.5 hidden md:block">
                                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${rel.shareholding_pct}%` }}></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{rel.shareholding_pct}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <span className="flex items-center text-green-600 text-[10px] font-semibold uppercase tracking-widest">
                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Active
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {entity.bank_accounts?.map((acc) => (
                    <div key={acc.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all relative group">
                      {acc.is_primary && (
                        <div className="absolute top-4 right-4 bg-blue-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shadow-lg shadow-blue-600/20 tracking-tighter">Primary</div>
                      )}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 tracking-tight">{acc.bank_name}</h3>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">{acc.account_type} Account</p>
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
                          {copiedId === acc.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="space-y-3.5 pt-4 border-t border-gray-50">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Account Name</span>
                          <span className="text-sm font-semibold text-gray-900">{acc.account_holder_name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Account Number</span>
                          <span className="text-sm font-mono font-medium text-gray-900">{acc.account_number}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">IFSC Code</span>
                          <span className="text-sm font-mono font-medium text-gray-900">{acc.ifsc_code}</span>
                        </div>
                        {acc.swift_code && (
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">SWIFT / BIC</span>
                            <span className="text-sm font-mono font-medium text-gray-900">{acc.swift_code}</span>
                          </div>
                        )}
                        {acc.iban && (
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">IBAN</span>
                            <p className="text-xs font-mono font-medium text-gray-900 bg-gray-50 p-2 rounded-lg border border-gray-100/50 break-all">{acc.iban}</p>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Branch</span>
                          <span className="text-sm text-gray-700 font-medium">{acc.branch || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-gray-300 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all duration-300 group">
                    <Plus className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold uppercase tracking-widest">Link New Account</span>
                  </button>
                </div>
              </div>
            )}

            {/* Compliance Tab */}
            {activeTab === 'compliance' && (
              <div className="space-y-8">
                {/* GST Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4 text-blue-600" />
                      GST Registrations
                    </h2>
                  </div>
                  <div className="p-6">
                    {entity.gstins?.map((gst) => (
                      <div key={gst.id} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 transition-all">
                        <div className="flex items-center gap-5">
                          <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-blue-600">
                            <Building2 className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-base font-semibold text-gray-900 font-mono tracking-tighter">{gst.gstin}</p>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mt-0.5">{gst.state} • <span className="text-green-600 font-bold">VERIFIED</span></p>
                          </div>
                        </div>
                        <GhostButton size="sm" className="font-semibold text-[10px] uppercase tracking-widest text-blue-600" leftIcon={<Download className="w-4 h-4" />}>Certificate</GhostButton>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tax Filings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <History className="w-4 h-4 text-blue-600" />
                      Income Tax Filing History
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Financial Year</th>
                          <th className="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Filing Date</th>
                          <th className="px-6 py-4 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {entity.documents?.filter(d => d.document_type === 'itr_acknowledgement').map((doc) => (
                          <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">{doc.financial_year}</td>
                            <td className="px-6 py-5 whitespace-nowrap text-xs font-medium text-gray-500">{doc.document_date || 'Jul 2024'}</td>
                            <td className="px-6 py-5 whitespace-nowrap text-right">
                              <GhostButton size="sm" className="text-blue-600 font-semibold text-[10px] uppercase tracking-widest" leftIcon={<Download className="w-3.5 h-3.5" />}>Acknowledgement</GhostButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {entity.documents?.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-start hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group">
                    <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 mb-6">
                      {getDocumentIcon(doc.document_type)}
                    </div>
                    <div className="flex-1 space-y-1 mb-6">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 leading-tight transition-colors">{doc.file_name}</h3>
                      <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">
                        {doc.document_type.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <button className="w-full py-3 bg-gray-50 group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-600 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-semibold text-[10px] uppercase tracking-widest">
                      <Download className="w-3.5 h-3.5" />
                      Download File
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
