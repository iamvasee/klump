'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  ArrowLeft,
  Mail,
  Phone,
  IdCard,
  Building2,
  Eye,
  EyeOff,
  CheckCircle,
  Briefcase,
  Hash,
  ExternalLink,
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { SecondaryButton, GhostButton } from '@/components/ui/Button/index';
import { db } from '@/lib/mockdb';
import { Person, Entity, EntityPersonRelationship } from '@/lib/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProfessionalViewContent({ uid }: { uid: string }) {
  const params = useParams();
  const workspaceSlug = params.workspace as string;
  const [person, setPerson] = useState<Person | null>(null);
  const [relationships, setRelationships] = useState<
    Array<EntityPersonRelationship & { entity?: Entity }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const breadcrumbs = [
    { label: 'Professionals', href: '/professionals' },
    { label: person?.full_name || 'Loading...', current: true },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const personData = db.getPerson(uid);
      if (personData) {
        setPerson(personData);
        // Filter only professional relationships (auditor, cs)
        const rels = db
          .getRelationshipsForPerson(uid)
          .filter((r) => ['auditor', 'company_secretary'].includes(r.role));
        const relsWithEntities = rels.map((rel) => ({
          ...rel,
          entity: db.getEntity(rel.entity_id),
        }));
        setRelationships(relsWithEntities);
      }
      setLoading(false);
    };

    fetchData();
  }, [uid]);

  if (loading) {
    return (
      <MainLayout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!person || relationships.length === 0) {
    return (
      <MainLayout breadcrumbs={breadcrumbs}>
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Professional Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The requested professional record doesn&apos;t exist or has no
            professional appointments.
          </p>
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

  const professionalRoles = Array.from(
    new Set(
      relationships.map((r) =>
        r.role === 'auditor' ? 'Statutory Auditor' : 'Company Secretary'
      )
    )
  );

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-5">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/10">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {person.full_name}
                  </h1>
                  <div className="flex gap-2">
                    {professionalRoles.map((role) => (
                      <span
                        key={role}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-gray-400" />
                    {person.id}
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    {relationships.length} Associated Entities
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {person.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center border-b border-gray-200 px-6 bg-white">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'entities', label: 'Associated Entities', icon: Building2 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-5 px-6 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
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

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <IdCard className="w-4 h-4 text-blue-600" />
                    Professional Details
                  </h3>
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-5">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm font-medium text-gray-500">
                        Full Name / Firm Name
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {person.full_name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm font-medium text-gray-500">
                        Nationality
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {person.nationality}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm font-medium text-gray-500">
                        PAN
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-semibold text-gray-900">
                          {showSensitiveData ? person.pan : '••••••••••'}
                        </span>
                        <button
                          onClick={() =>
                            setShowSensitiveData(!showSensitiveData)
                          }
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {showSensitiveData ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 text-blue-600">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Email Address
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {person.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 text-blue-600">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Phone Number
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {person.phone || '+91 00000 00000'}
                        </p>
                      </div>
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
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Entity Name
                        </th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Appointed Role
                        </th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Appointment Date
                        </th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {relationships.map((rel) => (
                        <tr
                          key={rel.id}
                          className="hover:bg-blue-50/30 transition-colors"
                        >
                          <td className="px-6 py-5 whitespace-nowrap">
                            <Link
                              href={`/${workspaceSlug}/entities/${rel.entity_id}`}
                              className="flex items-center group"
                            >
                              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mr-3 group-hover:bg-indigo-600 transition-all duration-300">
                                <Building2 className="w-5 h-5 text-indigo-600 group-hover:text-white" />
                              </div>
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {rel.entity?.legal_name}
                              </div>
                            </Link>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                              {rel.role.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                            {rel.effective_from}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="flex items-center text-green-600 text-[10px] font-bold uppercase tracking-widest">
                              <CheckCircle className="w-3.5 h-3.5 mr-1" />{' '}
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right">
                            <Link
                              href={`/${workspaceSlug}/entities/${rel.entity_id}`}
                            >
                              <GhostButton
                                size="sm"
                                className="text-blue-600 font-bold text-[10px] uppercase tracking-widest"
                                rightIcon={
                                  <ExternalLink className="w-3.5 h-3.5" />
                                }
                              >
                                Open Entity
                              </GhostButton>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
