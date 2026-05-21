'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Building2,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import {
  PrimaryButton,
  GhostButton,
  OutlineButton,
} from '@/components/ui/Button/index';
import { supabase } from '@/lib/supabase';
import { Entity } from '@/lib/types';

export default function EntitiesPage() {
  const params = useParams();
  const workspaceSlug = params.workspace as string;
  const breadcrumbs = [{ label: 'Entities', current: true }];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchEntities = async () => {
      const { data, error } = await supabase
        .from('entities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching entities:', error);
      } else {
        setEntities(data as Entity[]);
      }
      setLoading(false);
    };

    fetchEntities();
  }, []);

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'suspended':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredEntities = entities.filter((entity) => {
    const matchesSearch =
      entity.legal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.short_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.pan?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' ||
      entity.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: entities.length,
    active: entities.filter((e) => e.status === 'active').length,
    pending: entities.filter((e) => e.status === 'under_liquidation').length,
    avgCompleteness: Math.round(
      entities.reduce((sum, e) => sum + (e.completeness_score || 0), 0) /
        (entities.length || 1)
    ),
  };

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Entities</h1>
            <p className="text-gray-600">
              Manage companies, LLPs, and portfolios
            </p>
          </div>
          <Link href={`/${workspaceSlug}/entities/add`}>
            <PrimaryButton leftIcon={<Plus className="w-4 h-4" />}>
              Add Entity
            </PrimaryButton>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Entities
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.active}
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
                  Avg. Completeness
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgCompleteness}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Actions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search entities by name, PAN, CIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
              <OutlineButton leftIcon={<Filter className="w-4 h-4" />}>
                Filter
              </OutlineButton>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              Loading entities...
            </div>
          ) : filteredEntities.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No entities found
              </h3>
              <p className="text-gray-500 mb-6">
                Get started by creating your first entity.
              </p>
              <Link href={`/${workspaceSlug}/entities/add`}>
                <PrimaryButton leftIcon={<Plus className="w-4 h-4" />}>
                  Add Entity
                </PrimaryButton>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entity Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type & identifiers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completeness
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEntities.map((entity) => (
                    <tr key={entity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {entity.legal_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {entity.short_name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">
                          {entity.entity_type.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          PAN: {entity.pan || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          CIN: {entity.cin || entity.llpin || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {entity.city || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {entity.state || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                (entity.completeness_score || 0) > 80
                                  ? 'bg-green-500'
                                  : (entity.completeness_score || 0) > 50
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                              }`}
                              style={{
                                width: `${entity.completeness_score || 0}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-gray-700">
                            {entity.completeness_score || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(entity.status)}
                          <span
                            className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entity.status)}`}
                          >
                            {entity.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/${workspaceSlug}/entities/${entity.id}`}
                          >
                            <GhostButton
                              size="sm"
                              aria-label="View entity details"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </GhostButton>
                          </Link>
                          <Link
                            href={`/${workspaceSlug}/entities/${entity.id}/edit`}
                          >
                            <GhostButton
                              size="sm"
                              aria-label="Edit entity"
                              title="Edit entity"
                            >
                              <Edit className="w-4 h-4" />
                            </GhostButton>
                          </Link>
                          <GhostButton
                            size="sm"
                            aria-label="More options"
                            title="More options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </GhostButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
