'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Save,
  Settings as SettingsIcon,
  Mail,
  Lock,
  Camera,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button/index';
import { supabase } from '@/lib/supabase';

export default function AccountSettingsPage() {
  const breadcrumbs = [{ label: 'Account Settings', current: true }];

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    avatar_url: '',
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('users')
          .select('full_name, email, avatar_url')
          .eq('auth_user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        if (data) {
          setFormData({
            full_name: data.full_name || '',
            email: data.email || '',
            avatar_url: data.avatar_url || '',
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
        })
        .eq('auth_user_id', user.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (err: unknown) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update profile',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Personal Profile', icon: User },
    { id: 'security', label: 'Security & Access', icon: Shield },
  ];

  if (loading) {
    return (
      <MainLayout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-sm font-medium text-gray-400">
              Loading settings...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Account Settings
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  Manage your profile and security preferences
                </p>
              </div>
            </div>
            {activeTab === 'profile' && (
              <PrimaryButton
                onClick={handleSaveProfile}
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
                {isSubmitting ? 'Saving Changes...' : 'Save Profile'}
              </PrimaryButton>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Nav Sidebar */}
            <div className="lg:col-span-3">
              <nav className="flex flex-col space-y-1.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                          : 'text-gray-500 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-gray-100'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 mr-3 ${isActive ? 'text-white' : 'text-gray-400'}`}
                      />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9 space-y-6">
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
                    <Shield className="w-5 h-5" />
                  )}
                  <span className="text-sm font-bold">{message.text}</span>
                </div>
              )}

              {/* Profile Card */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-50">
                    <h2 className="text-lg font-bold text-gray-900">
                      Personal Information
                    </h2>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">
                      Details visible to your workspace members
                    </p>
                  </div>

                  <div className="p-8 space-y-10">
                    {/* Avatar Branding */}
                    <div className="flex items-center space-x-8">
                      <div className="relative group">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[2rem] flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                          {formData.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={formData.avatar_url}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-10 h-10 text-indigo-400" />
                          )}
                        </div>
                        <button
                          type="button"
                          className="absolute -bottom-1 -right-1 p-2.5 bg-white text-indigo-600 rounded-2xl shadow-lg border border-gray-100 hover:bg-indigo-600 hover:text-white transition-all duration-200"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-gray-900">
                          Profile Image
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">
                          Update your photo to help teammates recognize you.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                          <button className="text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700">
                            Upload
                          </button>
                          <span className="text-gray-300">•</span>
                          <button className="text-[11px] font-black text-rose-600 uppercase tracking-widest hover:text-rose-700">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                          Full Name
                        </label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                          <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                full_name: e.target.value,
                              })
                            }
                            className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900 text-sm"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                          Work Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                          <input
                            type="email"
                            disabled
                            value={formData.email}
                            className="w-full h-12 pl-11 pr-4 bg-gray-100/50 border border-gray-200 rounded-2xl text-gray-400 cursor-not-allowed font-medium text-sm"
                          />
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Card */}
              {activeTab === 'security' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-right-2 duration-400">
                  <div className="px-8 py-6 border-b border-gray-50">
                    <h2 className="text-lg font-bold text-gray-900">
                      Security & Access
                    </h2>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">
                      Secure your account with modern standards
                    </p>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between p-6 rounded-2xl border border-indigo-100 bg-indigo-50/30 group hover:border-indigo-300 transition-all duration-300">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-indigo-950">
                            Update Password
                          </h3>
                          <p className="text-xs text-indigo-600/70 font-medium">
                            Keep your account credentials fresh
                          </p>
                        </div>
                      </div>
                      <PrimaryButton
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 h-10 rounded-xl px-5"
                      >
                        Change
                      </PrimaryButton>
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-2xl border border-gray-100 bg-gray-50/50 opacity-60">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-400">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">
                            Multi-Factor Auth
                          </h3>
                          <p className="text-xs text-gray-500 font-medium italic">
                            Available soon for all users
                          </p>
                        </div>
                      </div>
                      <SecondaryButton
                        size="sm"
                        disabled
                        className="h-10 rounded-xl px-5 border-gray-200"
                      >
                        Disabled
                      </SecondaryButton>
                    </div>
                  </div>
                </div>
              )}

              {/* Danger Section */}
              {activeTab === 'profile' && (
                <div className="p-6 bg-rose-50/30 border border-rose-100 rounded-3xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-rose-900">
                        Deactivate Profile
                      </h4>
                      <p className="text-xs text-rose-700/60 font-medium">
                        Temporarily hide your profile from workspace members.
                      </p>
                    </div>
                  </div>
                  <button className="h-10 px-5 text-xs font-black text-rose-600 uppercase tracking-widest bg-white border border-rose-200 rounded-xl hover:bg-rose-600 hover:text-white transition-all">
                    Deactivate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
