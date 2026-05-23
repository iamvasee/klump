'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Save,
  Settings as SettingsIcon,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { PrimaryButton } from '@/components/ui/Button/index';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const workspaceSlug = params.workspace as string;
  const breadcrumbs = [{ label: 'Workspace Settings', current: true }];

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [workspace, setWorkspace] = useState({ id: '', name: '', slug: '' });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchWorkspace() {
      if (!workspaceSlug) return;
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch workspace
        const { data: wsData, error: wsError } = await supabase
          .from('workspaces')
          .select('id, name, slug')
          .eq('slug', workspaceSlug)
          .single();

        if (wsError) throw wsError;
        if (wsData) {
          setWorkspace({ id: wsData.id, name: wsData.name, slug: wsData.slug });

          // Check role
          const { data: memData } = await supabase
            .from('workspace_members')
            .select('role')
            .eq('workspace_id', wsData.id)
            .eq('user_id', user.id)
            .single();

          if (memData && memData.role === 'admin') {
            setIsAdmin(true);
          }
        }
      } catch (err) {
        console.error('Error fetching workspace settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkspace();
  }, [workspaceSlug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setMessage({
        type: 'error',
        text: 'Only admins can update workspace settings.',
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('workspaces')
        .update({ name: workspace.name })
        .eq('id', workspace.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Workspace updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (err: unknown) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update workspace',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-sm font-medium text-gray-400">
              Loading workspace settings...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Workspace Settings
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  Manage configuration for {workspace.name}
                </p>
              </div>
            </div>
            {isAdmin && (
              <PrimaryButton
                onClick={handleSave}
                disabled={isSubmitting}
                className="h-11 px-6 shadow-lg shadow-indigo-100"
                leftIcon={
                  isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )
                }
              >
                {isSubmitting ? 'Saving...' : 'Save Settings'}
              </PrimaryButton>
            )}
          </div>

          <div className="space-y-6">
            {message.text && (
              <div
                className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                  message.type === 'success'
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                    : 'bg-rose-50 border-rose-100 text-rose-700'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
                <span className="text-sm font-bold">{message.text}</span>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50">
                <h2 className="text-lg font-bold text-gray-900">
                  General Information
                </h2>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">
                  Core workspace details
                </p>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      Workspace Name
                    </label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                      <input
                        type="text"
                        value={workspace.name}
                        disabled={!isAdmin}
                        onChange={(e) =>
                          setWorkspace({ ...workspace, name: e.target.value })
                        }
                        className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        placeholder="Company Name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      Workspace Slug (URL)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        disabled
                        value={workspace.slug}
                        className="w-full h-12 px-4 bg-gray-100/50 border border-gray-200 rounded-2xl text-gray-500 cursor-not-allowed font-medium text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="p-6 bg-rose-50/30 border border-rose-100 rounded-3xl flex items-center justify-between gap-4 mt-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-rose-900">
                      Delete Workspace
                    </h4>
                    <p className="text-xs text-rose-700/60 font-medium">
                      Permanently delete this workspace and all its data.
                    </p>
                  </div>
                </div>
                <button className="h-10 px-5 text-xs font-black text-rose-600 uppercase tracking-widest bg-white border border-rose-200 rounded-xl hover:bg-rose-600 hover:text-white transition-all">
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
