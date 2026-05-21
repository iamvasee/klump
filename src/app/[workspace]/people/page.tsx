'use client';

import {
  Plus,
  Eye,
  Calendar,
  Users,
  ChevronUp,
  ChevronDown,
  Search,
  Mail,
  Shield,
  Clock,
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { PrimaryButton, GhostButton } from '@/components/ui/Button/index';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { db } from '@/lib/mockdb';

export default function PeoplePage() {
  const params = useParams();
  const workspaceSlug = params.workspace as string;
  const breadcrumbs = [{ label: 'People', current: true }];

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const people = db.getPeople();

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedPeople = () => {
    let filtered = people;
    if (searchTerm) {
      filtered = people.filter(
        (p) =>
          p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.pan?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (!sortField) return filtered;

    return [...filtered].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortField];
      const bValue = (b as Record<string, unknown>)[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const stats = {
    total: people.length,
    avgCompleteness: Math.round(
      people.reduce((sum, p) => sum + (p.completeness_score || 0), 0) /
        people.length
    ),
    withDin: people.filter((p) => p.din).length,
  };

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">People</h1>
            <p className="text-gray-600">
              Manage stakeholders, directors, and partners
            </p>
          </div>
          <Link href={`/${workspaceSlug}/people/add`}>
            <PrimaryButton leftIcon={<Plus className="w-4 h-4" />}>
              Add Person
            </PrimaryButton>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total People
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
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
              <div className="p-3 bg-green-100 rounded-xl">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Directors (with DIN)
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.withDin}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  New This Month
                </p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search people by name, email, PAN, DIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* People Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSort('full_name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Person</span>
                      {getSortIcon('full_name')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Identifiers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completeness
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getSortedPeople().map((person, index) => (
                  <tr key={person.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-semibold text-sm">
                            {person.full_name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {person.full_name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {person.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-500 font-mono">
                        PAN: {person.pan || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        DIN: {person.din || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              (person.completeness_score || 0) > 80
                                ? 'bg-green-500'
                                : (person.completeness_score || 0) > 50
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                            }`}
                            style={{
                              width: `${person.completeness_score || 0}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          {person.completeness_score || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/${workspaceSlug}/people/${person.id}`}>
                        <GhostButton
                          size="sm"
                          leftIcon={<Eye className="w-4 h-4" />}
                        >
                          View
                        </GhostButton>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
