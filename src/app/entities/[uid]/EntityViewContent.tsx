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
  Globe,
  MapPin,
  Hash
} from "lucide-react";
import MainLayout from '@/components/layout/MainLayout';
import {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  OutlineButton
} from '@/components/ui/Button/index';
import { db } from '@/lib/mockdb';
import { Entity, Person, EntityPersonRelationship } from '@/lib/types';

export default function EntityViewContent({ uid }: { uid: string }) {
  const [entity, setEntity] = useState<Entity | null>(null);
  const [relationships, setRelationships] = useState<Array<EntityPersonRelationship & { person?: Person }>>([]);
  const [loading, setLoading] = useState(true);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <MainLayout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading entity details...</p>
          </div>
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
          <p className="text-gray-600 mb-6">The entity you&apos;re looking for doesn&apos;t exist.</p>
          <SecondaryButton leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => window.history.back()}>
            Go Back
          </SecondaryButton>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center border border-blue-200">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{entity.legal_name}</h1>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entity.status)}`}>
                      {entity.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Hash className="w-3 h-3 text-gray-400" />
                      <span>{entity.id}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Shield className="w-3 h-3 text-gray-400" />
                      <span className="capitalize">{entity.entity_type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>Incorporated {entity.date_of_incorporation || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <OutlineButton 
                  leftIcon={<MoreVertical className="w-4 h-4" />} 
                  onClick={() => setShowActionsMenu(!showActionsMenu)}
                >
                  Actions
                </OutlineButton>
                {/* Actions menu implementation here if needed */}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Statutory Details
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">Legal Name</label>
                    <p className="text-gray-900 font-medium">{entity.legal_name}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">Short Name</label>
                    <p className="text-gray-900">{entity.short_name || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">PAN</label>
                    <p className="text-gray-900 font-mono">{entity.pan || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">CIN / LLPIN</label>
                    <p className="text-gray-900 font-mono">{entity.cin || entity.llpin || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">Nature of Business</label>
                    <p className="text-gray-900">{entity.nature_of_business || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">State of Incorporation</label>
                    <p className="text-gray-900">{entity.state_of_incorporation || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stakeholders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  Key Management & Stakeholders
                </h2>
                <PrimaryButton size="sm" leftIcon={<Plus className="w-4 h-4" />}>Add Person</PrimaryButton>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective From</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {relationships.map((rel) => (
                      <tr key={rel.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <span className="text-blue-600 text-xs font-bold">{rel.person?.full_name[0]}</span>
                            </div>
                            <div className="text-sm font-medium text-gray-900">{rel.person?.full_name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full capitalize">
                            {rel.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rel.effective_from}
                        </td>
                      </tr>
                    ))}
                    {relationships.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                          No stakeholders found for this entity.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Address & Contact</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    {entity.address_line1 && <p>{entity.address_line1}</p>}
                    {entity.address_line2 && <p>{entity.address_line2}</p>}
                    <p>{entity.city}, {entity.state} {entity.pin_code}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Entity Health</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Completeness Score</span>
                  <span className="text-sm font-bold text-gray-900">{entity.completeness_score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${entity.completeness_score}%` }}
                  ></div>
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  Update missing statutory details to improve the score.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
