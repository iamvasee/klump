'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Briefcase, Search, Mail, Building2, ArrowUpRight } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { OutlineButton } from '@/components/ui/Button/index';
import { db } from '@/lib/mockdb';

export default function ProfessionalsPage() {
  const params = useParams();
  const workspaceSlug = params.workspace as string;
  const breadcrumbs = [{ label: 'Professionals', current: true }];
  const [searchTerm, setSearchTerm] = useState('');

  const people = db.getPeople();
  const relationships = db.getRelationships();

  // Filter people who act as auditors or company secretaries
  const professionals = people
    .filter((person) => {
      return relationships.some(
        (rel) =>
          rel.person_id === person.id &&
          ['auditor', 'company_secretary'].includes(rel.role)
      );
    })
    .map((person) => {
      const roles = Array.from(
        new Set(
          relationships
            .filter(
              (rel) =>
                rel.person_id === person.id &&
                ['auditor', 'company_secretary'].includes(rel.role)
            )
            .map((rel) =>
              rel.role === 'auditor' ? 'Statutory Auditor' : 'Company Secretary'
            )
        )
      );

      const entityCount = relationships.filter(
        (rel) =>
          rel.person_id === person.id &&
          ['auditor', 'company_secretary'].includes(rel.role)
      ).length;

      return {
        ...person,
        professionalRoles: roles,
        entityCount,
      };
    });

  const filteredProfessionals = professionals.filter(
    (pro) =>
      pro.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pro.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Professionals</h1>
            <p className="text-gray-600">
              Statutory Auditors and Company Secretaries
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, firm or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((pro) => (
            <div
              key={pro.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Briefcase className="w-6 h-6" />
                </div>
                <Link href={`/${workspaceSlug}/professionals/${pro.id}`}>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {pro.full_name}
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {pro.professionalRoles.map((role) => (
                    <span
                      key={role}
                      className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-blue-100"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3 mb-6 pt-4 border-t border-gray-50">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="truncate">{pro.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{pro.entityCount} Associated Entities</span>
                </div>
              </div>

              <Link
                href={`/${workspaceSlug}/professionals/${pro.id}`}
                className="block"
              >
                <OutlineButton className="w-full justify-center text-xs font-bold uppercase tracking-widest py-2.5">
                  View Full Profile
                </OutlineButton>
              </Link>
            </div>
          ))}

          {filteredProfessionals.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                No professionals found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
