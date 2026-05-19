'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Users, ArrowRight, Check, Sparkles, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { FullLogo } from '@/components/ui/Logo';

type Step = 'choose' | 'create';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('choose');
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOrgNameChange = (name: string) => {
    setOrgName(name);
    // Auto-generate slug from name
    setOrgSlug(
      name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    );
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
      return;
    }

    // 1. Create the workspace
    const { data: org, error: orgError } = await supabase
      .from('workspaces')
      .insert({ name: orgName, slug: orgSlug })
      .select()
      .single();

    if (orgError) {
      setError(orgError.message);
      setIsLoading(false);
      return;
    }

    // 2. Add the creator as admin of the workspace
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: org.id,
        user_id: user.id,
        role: 'admin',
      });

    if (memberError) {
      setError(memberError.message);
      setIsLoading(false);
      return;
    }

    // Done — redirect to dashboard
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden font-sans">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:34px_34px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      {/* Animated Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-700"></div>

      {/* Header */}
      <div className="relative z-10 px-8 py-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <FullLogo className="h-8" fill="white" />
        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            router.push('/auth');
          }}
          className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="flex-1 relative z-10 flex items-center justify-center px-4 pb-20">
        <div className="w-full max-w-3xl">

          {/* Step: Choose */}
          {step === 'choose' && (
            <div className="text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                  <Sparkles className="w-4 h-4" />
                  Welcome to Klump
                </div>
                <h1 className="text-5xl font-extrabold text-white tracking-tight">
                  Let's set up your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">workspace</span>.
                </h1>
                <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
                  Create a new organisation to start managing entities, or join an existing team via an invite link.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
                {/* Create Org Card */}
                <button
                  onClick={() => setStep('create')}
                  className="group relative p-8 bg-slate-900/50 backdrop-blur-xl border border-slate-700 hover:border-indigo-500/50 rounded-3xl shadow-2xl hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="absolute top-0 right-0 p-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-indigo-500 transition-colors duration-500">
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-500" />
                      </div>
                    </div>
                    
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 group-hover:border-indigo-500/30 transition-colors duration-500 shadow-inner">
                      <Building2 className="w-8 h-8 text-indigo-400" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3">Create Workspace</h3>
                    <p className="text-slate-400 leading-relaxed mb-8">
                      Start fresh. Create a new organisation, invite your team, and manage compliance portfolios.
                    </p>
                    
                    <div className="space-y-3">
                      {['Invite team members', 'Manage infinite entities', 'Full admin privileges'].map((f) => (
                        <div key={f} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                          <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                            <Check className="w-3 h-3 text-indigo-400" />
                          </div>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </button>

                {/* Join Org Card */}
                <div className="relative p-8 bg-slate-900/30 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl opacity-75">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 border border-slate-800">
                    <Users className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-300 mb-3">Join Workspace</h3>
                  <p className="text-slate-500 leading-relaxed mb-8">
                    Got an invite? Use the secure link sent to your email to join your team's existing workspace.
                  </p>
                  
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-full">
                    <Lock className="w-3.5 h-3.5" />
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step: Create Org Form */}
          {step === 'create' && (
            <div className="animate-in fade-in zoom-in-95 duration-500 max-w-lg mx-auto">
              <button
                onClick={() => setStep('choose')}
                className="text-sm font-medium text-slate-400 hover:text-white mb-8 flex items-center gap-2 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to options
              </button>

              <div className="bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-slate-700/50 p-10 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500"></div>
                
                <div className="mb-10 text-center">
                  <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-700/50">
                    <Building2 className="w-10 h-10 text-indigo-400" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">Name your workspace</h2>
                  <p className="mt-3 text-slate-400">This is where your team will collaborate.</p>
                </div>

                <form onSubmit={handleCreateOrg} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      Organisation Name
                    </label>
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => handleOrgNameChange(e.target.value)}
                      className="w-full px-5 py-4 border border-slate-700 rounded-2xl bg-slate-800/50 text-white placeholder-slate-500 focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                      placeholder="e.g. Acme & Associates"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      Workspace URL
                    </label>
                    <div className="flex items-center border border-slate-700 rounded-2xl overflow-hidden bg-slate-800/50 focus-within:bg-slate-800 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                      <span className="px-5 py-4 text-slate-400 text-sm border-r border-slate-700 bg-slate-900/50 select-none font-medium">
                        klump.app/
                      </span>
                      <input
                        type="text"
                        required
                        value={orgSlug}
                        onChange={(e) => setOrgSlug(e.target.value)}
                        className="flex-1 px-5 py-4 bg-transparent outline-none text-white text-sm"
                        placeholder="acme-associates"
                      />
                    </div>
                    <p className="mt-2 text-xs font-medium text-slate-500">Lowercase letters, numbers and hyphens only.</p>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm font-medium text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !orgName || !orgSlug}
                    className="w-full py-4 px-6 bg-white hover:bg-slate-100 disabled:opacity-50 disabled:bg-white text-slate-900 font-extrabold rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-3 mt-4"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                        Provisioning...
                      </>
                    ) : (
                      <>
                        Create Workspace
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
