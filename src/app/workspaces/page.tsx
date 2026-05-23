'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  ArrowRight,
  Plus,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { FullLogo } from '@/components/ui/Logo';
import CreateWorkspaceForm from '@/components/workspaces/CreateWorkspaceForm';
import ProfileMenu from '@/components/layout/ProfileMenu';
import { toast } from 'sonner';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  role: string;
}

export default function WorkspacesPage() {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setIsLoading(true);

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/auth');
        return;
      }

      setUser(authUser);

      const { data: memberships, error: memError } = await supabase
        .from('workspace_members')
        .select('workspace_id, role')
        .eq('user_id', authUser.id);

      if (memError) {
        console.error('Error fetching memberships:', memError);
        toast.error('Failed to load workspaces');
        setIsLoading(false);
        return;
      }

      if (!memberships || memberships.length === 0) {
        router.push('/onboarding');
        return;
      }

      const workspaceIds = memberships.map((m) => m.workspace_id);

      const { data: wsData, error: wsError } = await supabase
        .from('workspaces')
        .select('id, name, slug')
        .in('id', workspaceIds);

      if (wsError) {
        console.error('Error fetching workspaces:', wsError);
        toast.error('Failed to load workspace details');
      } else {
        const enrichedWorkspaces = wsData.map((ws) => ({
          ...ws,
          role:
            memberships.find((m) => m.workspace_id === ws.id)?.role || 'member',
        }));
        setWorkspaces(enrichedWorkspaces);
      }

      setIsLoading(false);
    };

    fetchWorkspaces();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 animate-pulse">
              Loading workspaces
            </p>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-indigo-600/30 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userName =
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background Ambient Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/40 to-white/90 pointer-events-none" />

      {/* Decorative Orbs */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-100/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-50/30 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="relative z-50 px-6 sm:px-12 py-10 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <FullLogo className="h-7" />
        </div>

        <div className="flex items-center gap-6">
          <ProfileMenu />
        </div>
      </header>

      <main className="flex-1 relative z-10 flex items-center justify-center px-6 pb-24">
        <div className="w-full max-w-6xl">
          {isCreating ? (
            <div className="animate-in fade-in zoom-in-95 duration-500 max-w-xl mx-auto">
              <button
                onClick={() => setIsCreating(false)}
                className="group inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-indigo-600 mb-10 transition-all pl-2"
              >
                <div className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
                  <ArrowRight className="w-3 h-3 rotate-180" />
                </div>
                Return to Workspaces
              </button>
              <CreateWorkspaceForm
                onCancel={() => setIsCreating(false)}
                onSuccess={(slug) => {
                  toast.success('Workspace created successfully');
                  router.push(`/${slug}`);
                }}
              />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <div className="text-center mb-20">
                <h1 className="text-4xl sm:text-5xl font-[900] text-gray-900 tracking-tight mb-4">
                  Welcome back,{' '}
                  <span className="text-indigo-600">
                    {userName.split(' ')[0]}
                  </span>
                  .
                </h1>
                <p className="text-base text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
                  Select a secure workspace environment to manage your
                  institutional assets.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {workspaces.map((ws, i) => (
                  <button
                    key={ws.id}
                    onClick={() => router.push(`/${ws.slug}`)}
                    style={{ animationDelay: `${i * 100}ms` }}
                    className="group relative text-left p-8 bg-white border border-gray-100 hover:border-indigo-200 rounded-[2rem] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_-12px_rgba(79,70,229,0.1)] transition-all duration-500 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 fill-mode-both overflow-hidden"
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-3xl pointer-events-none" />

                    <div className="flex items-start justify-between mb-10 relative z-10">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-50 group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <Building2 className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-500" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-500">
                        <ArrowRight className="w-4 h-4 text-indigo-600" />
                      </div>
                    </div>

                    <div className="space-y-2 mb-8 relative z-10">
                      <h3 className="text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 truncate">
                        {ws.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-indigo-400/70 transition-colors">
                          klump.app/{ws.slug}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2 px-2.5 py-1 bg-gray-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                        <ShieldCheck className="w-3 h-3 text-gray-300 group-hover:text-indigo-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 group-hover:text-indigo-600">
                          {ws.role}
                        </span>
                      </div>
                      <div className="w-6 h-6 rounded-lg bg-transparent flex items-center justify-center text-gray-300 group-hover:text-indigo-400 transition-colors">
                        <Settings className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </button>
                ))}

                <button
                  onClick={() => setIsCreating(true)}
                  style={{ animationDelay: `${workspaces.length * 100}ms` }}
                  className="group relative p-8 bg-gray-50/50 border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-white rounded-[2rem] transition-all duration-500 flex flex-col items-center justify-center gap-4 min-h-[220px] animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-500 shadow-sm group-hover:shadow-indigo-200 group-hover:scale-110">
                    <Plus className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xs font-black text-gray-400 group-hover:text-indigo-600 uppercase tracking-[0.2em] transition-colors">
                      New Workspace
                    </h3>
                    <p className="text-[9px] font-bold text-gray-300 mt-1 uppercase tracking-widest group-hover:text-gray-400 transition-colors">
                      Create Workspace
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 py-12 text-center">
        <div className="flex flex-col items-center gap-4 opacity-30 group hover:opacity-100 transition-opacity">
          <div className="h-[1px] w-12 bg-gray-300 mb-2" />
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-400">
            Institutional Memory Infrastructure
          </p>
          <p className="text-[8px] font-medium text-gray-300 uppercase tracking-widest">
            v0.1.0 • encrypted • klump-core-01
          </p>
        </div>
      </footer>
    </div>
  );
}
