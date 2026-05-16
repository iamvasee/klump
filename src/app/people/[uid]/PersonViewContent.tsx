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
  Globe,
  MapPin,
  Hash
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { SecondaryButton, OutlineButton } from '@/components/ui/Button/index';
import { db } from '@/lib/mockdb';
import { Person, Entity, EntityPersonRelationship } from '@/lib/types';

export default function PersonViewContent({ uid }: { uid: string }) {
  const [person, setPerson] = useState<Person | null>(null);
  const [relationships, setRelationships] = useState<Array<EntityPersonRelationship & { entity?: Entity }>>([]);
  const [loading, setLoading] = useState(true);
  const [showSensitiveData, setShowSensitiveData] = useState(false);

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

  const getStatusColor = (completeness: number) => {
    if (completeness > 80) return 'bg-green-100 text-green-800';
    if (completeness > 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <MainLayout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          <p className="text-gray-600 mb-6">The person you&apos;re looking for doesn&apos;t exist.</p>
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
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{person.full_name}</h1>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(person.completeness_score || 0)}`}>
                      Profile {person.completeness_score}% Complete
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Hash className="w-3 h-3 text-gray-400" />
                      <span>{person.id}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="w-3 h-3 text-gray-400" />
                      <span>{person.nationality || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span>{person.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <OutlineButton 
                  leftIcon={<Edit className="w-4 h-4" />} 
                  onClick={() => {}}
                >
                  Edit Profile
                </OutlineButton>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <IdCard className="w-5 h-5 mr-2 text-blue-600" />
                  Identification & Personal Info
                </h2>
                <OutlineButton 
                  size="sm"
                  leftIcon={showSensitiveData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  onClick={() => setShowSensitiveData(!showSensitiveData)}
                >
                  {showSensitiveData ? 'Hide' : 'Show'} Details
                </OutlineButton>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900">{person.date_of_birth || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">Nationality</label>
                    <p className="text-gray-900">{person.nationality || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">PAN</label>
                    <p className="text-gray-900 font-mono">
                      {showSensitiveData ? (person.pan || 'N/A') : '••••••••••'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-500">DIN (Director Identification Number)</label>
                    <p className="text-gray-900 font-mono">
                      {showSensitiveData ? (person.din || 'N/A') : '••••••••'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Entity Relationships */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-emerald-600" />
                  Associated Entities
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Since</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {relationships.map((rel) => (
                      <tr key={rel.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link href={`/entities/${rel.entity_id}`} className="flex items-center group">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mr-3 group-hover:bg-emerald-200 transition-colors">
                              <Building2 className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                              {rel.entity?.legal_name}
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full capitalize">
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
                          No associated entities found for this person.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Profile Completeness</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Completeness Score</span>
                  <span className="text-sm font-bold text-gray-900">{person.completeness_score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${person.completeness_score}%` }}
                  ></div>
                </div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Basic details provided
                  </li>
                  <li className="flex items-center text-xs text-gray-500">
                    {person.pan ? <CheckCircle className="w-3 h-3 mr-2 text-green-500" /> : <Clock className="w-3 h-3 mr-2 text-yellow-500" />}
                    PAN details
                  </li>
                  <li className="flex items-center text-xs text-gray-500">
                    {person.din ? <CheckCircle className="w-3 h-3 mr-2 text-green-500" /> : <Clock className="w-3 h-3 mr-2 text-yellow-500" />}
                    DIN details
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
