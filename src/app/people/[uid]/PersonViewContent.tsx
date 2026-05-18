'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  FileText, 
  Camera,
  Edit,
  Trash2,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  IdCard,
  Building2,
  Shield,
  Eye,
  EyeOff,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Lock,
  RefreshCw,
  Upload,
  Plus,
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
  Check,
  History,
  Search,
  Book
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { SecondaryButton, OutlineButton, PrimaryButton, GhostButton } from '@/components/ui/Button/index';
import { db } from '@/lib/mockdb';
import { Person, Entity, EntityPersonRelationship, Document, BankAccount } from '@/lib/types';
import { DOCUMENT_TYPE_LABELS } from '@/lib/constants';
import Link from 'next/link';

export default function PersonViewContent({ uid }: { uid: string }) {
  const [person, setPerson] = useState<Person | null>(null);
  const [relationships, setRelationships] = useState<Array<EntityPersonRelationship & { entity?: Entity }>>([]);
  const [loading, setLoading] = useState(true);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filingFilter, setFilingFilter] = useState('all');
  const [filingSearch, setFilingSearch] = useState('');

  const breadcrumbs = [
    { label: 'People', href: '/people' },
    { label: person?.full_name || 'Loading...', current: true }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const personData = db.getPerson(uid);
      if (personData) {
        setPerson(personData);
        const rels = db.getRelationshipsForPerson(uid);
        const relsWithEntities = rels.map(rel => ({
          ...rel,
          entity: db.getEntity(rel.entity_id)
        }));
        setRelationships(relsWithEntities);
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

  const getStatusColor = (completeness: number) => {
    if (completeness > 80) return 'bg-green-100 text-green-800 border-green-200';
    if (completeness > 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getDocumentIcon = (type: string) => {
    if (type === 'pan_card') return <FileText className="w-5 h-5 text-orange-600" />;
    if (type === 'aadhaar_card') return <IdCard className="w-5 h-5 text-blue-600" />;
    if (type.includes('itr') || type.includes('tds')) return <FileCheck className="w-5 h-5 text-green-600" />;
    return <FileText className="w-5 h-5 text-gray-600" />;
  };

  const getFilingCategory = (type: string) => {
    if (type.includes('itr')) return 'tax';
    if (type.includes('tds')) return 'tds';
    if (type === 'pan_card' || type === 'aadhaar_card' || type === 'kyc_document') return 'kyc';
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

  if (!person) {
    return (
      <MainLayout breadcrumbs={breadcrumbs}>
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Person Not Found</h2>
          <SecondaryButton leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => window.history.back()}>
            Go Back
          </SecondaryButton>
        </div>
      </MainLayout>
    );
  }

  // Static/KYC documents
  const staticDocTypes = ['aadhaar_card', 'pan_card', 'kyc_document'];
  const staticDocuments = person.documents?.filter(doc => staticDocTypes.includes(doc.document_type)) || [];

  // Recurring filings
  const recurringFilings = person.documents?.filter(doc => !staticDocTypes.includes(doc.document_type)) || [];

  const filteredFilings = recurringFilings.filter(doc => {
    const matchesSearch = doc.file_name.toLowerCase().includes(filingSearch.toLowerCase()) || 
                         (doc.description || '').toLowerCase().includes(filingSearch.toLowerCase());
    const matchesFilter = filingFilter === 'all' || getFilingCategory(doc.document_type) === filingFilter;
    return matchesSearch && matchesFilter;
  });

  const filingCategories = [
    { id: 'all', label: 'All Filings' },
    { id: 'tax', label: 'Income Tax (ITR)' },
    { id: 'tds', label: 'TDS Filings' },
    { id: 'others', label: 'Others' }
  ];

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 bg-white sticky top-0 z-10">
            <div className="flex overflow-x-auto no-scrollbar">
              {[
                { id: 'overview', label: 'Overview', icon: Info },
                { id: 'entities', label: 'Associated Entities', icon: Building2 },
                { id: 'banking', label: 'Banking', icon: CreditCard },
                { id: 'statutory', label: 'KYC Docs', icon: Book },
                { id: 'filings', label: 'Filings', icon: Shield }
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
            

          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-10">
                {/* Person Identity Section */}
                <div className="flex flex-col md:flex-row md:items-start gap-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 shrink-0">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{person.full_name}</h1>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(person.completeness_score || 0)}`}>
                          Profile {person.completeness_score}% Complete
                        </span>
                      </div>
                      <p className="text-base text-gray-500 font-medium">Individual Profile</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-gray-100">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Nationality</label>
                        <p className="text-sm font-semibold text-gray-700">{person.nationality}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Date of Birth</label>
                        <p className="text-sm font-semibold text-gray-700">{person.date_of_birth || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">PAN</label>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-mono font-semibold text-gray-700">{showSensitiveData ? (person.pan || 'N/A') : '••••••••••'}</p>
                          <button onClick={() => setShowSensitiveData(!showSensitiveData)} className="text-blue-600">
                            {showSensitiveData ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Aadhaar</label>
                        <p className="text-sm font-mono font-semibold text-gray-700">{showSensitiveData ? (person.aadhaar_number || 'N/A') : '•••• •••• ••••'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      Contact Details
                    </h3>
                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                        <span className="text-sm font-medium text-gray-500">Email Address</span>
                        <span className="text-sm font-semibold text-gray-900">{person.email}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                        <span className="text-sm font-medium text-gray-500">Phone Number</span>
                        <span className="text-sm font-semibold text-gray-900">{person.phone || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium text-gray-500">DIN / DPIN</span>
                        <span className="text-sm font-mono font-semibold text-gray-900">{person.din || person.dpin || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      Residential Address
                    </h3>
                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                      <p className="text-gray-700 font-medium leading-relaxed">
                        {person.residential_address || 'Address not provided'}<br />
                        <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2 block">India</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Entities Tab */}
            {activeTab === 'entities' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entity Name</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Since</th>
                        <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {relationships.map((rel) => (
                        <tr key={rel.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <Link href={`/entities/${rel.entity_id}`} className="flex items-center group">
                              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-600 transition-all duration-300">
                                <Building2 className="w-5 h-5 text-blue-700 group-hover:text-white transition-colors" />
                              </div>
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{rel.entity?.legal_name}</div>
                            </Link>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                              {rel.role.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">
                            {rel.effective_from}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right">
                            <Link href={`/entities/${rel.entity_id}`}>
                              <GhostButton size="sm" className="text-blue-600 font-bold text-[10px] uppercase tracking-widest" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>View Entity</GhostButton>
                            </Link>
                          </td>
                        </tr>
                      ))}
                      {relationships.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500 font-medium">
                            No associated entities found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Banking Tab */}
            {activeTab === 'banking' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {person.bank_accounts?.map((acc) => (
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
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Branch</span>
                          <span className="text-sm text-gray-700 font-medium">{acc.branch || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-gray-300 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all duration-300 group">
                    <Plus className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Add Personal Account</span>
                  </button>
                </div>
              </div>
            )}

            {/* Statutory Documents Tab */}
            {activeTab === 'statutory' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staticDocuments.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-start hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 group">
                    <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 mb-6">
                      {getDocumentIcon(doc.document_type)}
                    </div>
                    <div className="flex-1 space-y-1.5 mb-6">
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 leading-tight transition-colors line-clamp-2">{doc.file_name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {DOCUMENT_TYPE_LABELS[doc.document_type] || doc.document_type.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="w-full pt-4 border-t border-gray-50 flex items-center gap-2">
                      <button className="flex-1 py-3 bg-gray-50 group-hover:bg-blue-600 text-gray-400 group-hover:text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-bold text-[10px] uppercase tracking-widest">
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
                <button className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-gray-300 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all duration-300 group min-h-[220px]">
                  <Plus className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-widest">Add KYC Doc</span>
                </button>
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
                </div>

                {/* Filings List - Dense Row Layout */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Filing Name</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Filing Type</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Period / FY</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Filing Date</th>
                        <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredFilings.map((doc) => (
                        <tr key={doc.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                                {getDocumentIcon(doc.document_type)}
                              </div>
                              <div className="text-sm font-semibold text-gray-900">{doc.file_name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                              {DOCUMENT_TYPE_LABELS[doc.document_type] || doc.document_type}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-700">
                            {doc.financial_year || 'N/A'}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">
                            {doc.document_date || 'N/A'}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right">
                            <div className="flex justify-end gap-2">
                              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Download Proof">
                                <Download className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Details">
                                <ExternalLink className="w-4 h-4" />
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
                      <p className="text-gray-400 font-medium">No recurring filings match your current criteria.</p>
                      <button onClick={() => {setFilingFilter('all'); setFilingSearch('');}} className="mt-2 text-blue-600 text-sm font-bold hover:underline">Reset Filters</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
