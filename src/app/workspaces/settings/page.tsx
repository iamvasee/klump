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
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { FullLogo } from '@/components/ui/Logo';
import ProfileMenu from '@/components/layout/ProfileMenu';
import { PrimaryButton } from '@/components/ui/Button/index';
import TextField from '@/components/ui/TextField/TextField';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          toast.error('Failed to load profile data');
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

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'security') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveTab('security');
      }
    }
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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

      toast.success('Profile updated successfully');
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update profile'
      );
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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-2 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Loading Vault
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background Ambient Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/40 to-white/90 pointer-events-none" />

      {/* Header */}
      <header className="relative z-50 px-6 sm:px-12 py-10 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link href="/workspaces">
          <FullLogo className="h-7 hover:opacity-80 transition-opacity" />
        </Link>
        <ProfileMenu />
      </header>

      <main className="flex-1 relative z-10 flex px-6 pb-24 justify-center">
        <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-8 pl-1">
            <Link
              href="/workspaces"
              className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-2" />
              Back to Workspaces
            </Link>
          </div>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-1">
            <div className="flex items-center gap-5">
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
                className="h-11 px-6 shadow-lg shadow-indigo-100 text-[10px] font-black uppercase tracking-widest"
                leftIcon={
                  isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )
                }
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </PrimaryButton>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Nav Sidebar */}
            <div className="lg:col-span-3">
              <nav className="flex flex-col space-y-1">
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
            <div className="lg:col-span-9 relative min-h-[500px]">
              {/* Profile Card */}
              <div
                className={`absolute inset-0 w-full transition-all duration-400 ease-in-out ${
                  activeTab === 'profile'
                    ? 'opacity-100 translate-y-0 pointer-events-auto z-10'
                    : 'opacity-0 translate-y-4 pointer-events-none z-0'
                }`}
              >
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-50">
                    <h2 className="text-lg font-bold text-gray-900">
                      Personal Information
                    </h2>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      Details visible to your workspace members
                    </p>
                  </div>

                  <div className="p-8 space-y-10">
                    {/* Avatar */}
                    <div className="flex items-center space-x-8">
                      <div className="relative group">
                        <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                          {formData.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={formData.avatar_url}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-8 h-8 text-gray-300" />
                          )}
                        </div>
                        <button className="absolute -bottom-1 -right-1 p-2 bg-white text-indigo-600 rounded-xl shadow-md border border-gray-100 hover:bg-indigo-600 hover:text-white transition-all">
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-gray-900">
                          Profile Image
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">
                          Update your photo to help teammates recognize you.
                        </p>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <TextField
                        label={
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Full Name
                          </span>
                        }
                        value={formData.full_name}
                        onChange={(val) =>
                          setFormData({ ...formData, full_name: val })
                        }
                        placeholder="John Doe"
                        leftIcon={<User className="w-4 h-4" />}
                      />

                      <TextField
                        label={
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Work Email
                          </span>
                        }
                        type="email"
                        value={formData.email}
                        onChange={() => {}}
                        disabled
                        leftIcon={<Mail className="w-4 h-4" />}
                        rightIcon={
                          <Lock className="w-3.5 h-3.5 text-gray-400" />
                        }
                      />
                    </div>
                  </div>

                  {/* Danger Section */}
                  <div className="mx-8 mb-8 p-6 bg-rose-50/30 border border-rose-100 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-rose-900">
                          Deactivate Profile
                        </h4>
                        <p className="text-xs text-rose-700/60 font-medium">
                          Temporarily hide your profile.
                        </p>
                      </div>
                    </div>
                    <button className="h-9 px-4 text-[10px] font-black text-rose-600 uppercase tracking-widest bg-white border border-rose-200 rounded-xl hover:bg-rose-600 hover:text-white transition-all">
                      Deactivate
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Card */}
              <div
                className={`absolute inset-0 w-full transition-all duration-400 ease-in-out ${
                  activeTab === 'security'
                    ? 'opacity-100 translate-y-0 pointer-events-auto z-10'
                    : 'opacity-0 translate-y-4 pointer-events-none z-0'
                }`}
              >
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
                  <div className="px-8 py-6 border-b border-gray-50">
                    <h2 className="text-lg font-bold text-gray-900">
                      Security & Access
                    </h2>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      Secure your account with modern standards
                    </p>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between p-6 rounded-2xl border border-indigo-100 bg-indigo-50/30 group hover:border-indigo-300 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                          <KeyRound className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-indigo-950">
                            Update Password
                          </h3>
                          <p className="text-xs text-indigo-600/70 font-medium">
                            Keep your credentials fresh
                          </p>
                        </div>
                      </div>
                      <button className="h-10 px-5 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                        Change
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-2xl border border-gray-100 bg-gray-50/50 opacity-60">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-gray-900">
                              Multi-Factor Auth
                            </h3>
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                              Soon
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-medium">
                            Additional physical token access
                          </p>
                        </div>
                      </div>
                      <div className="h-10 px-5 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-gray-300 border border-gray-100 rounded-xl">
                        Disabled
                      </div>
                    </div>

                    <div className="mt-6 p-6 rounded-2xl border border-rose-100 bg-rose-50/30">
                      <div className="flex items-start gap-4">
                        <AlertTriangle className="w-5 h-5 text-rose-500 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-rose-900">
                            Suspend Profile
                          </h4>
                          <p className="text-xs text-rose-700/70 font-medium">
                            Temporarily disable access to this node.
                          </p>
                          <button className="mt-4 h-9 px-4 text-[10px] font-black text-rose-600 uppercase tracking-widest bg-white border border-rose-200 rounded-xl hover:bg-rose-600 hover:text-white transition-all">
                            Suspend
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
