'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Users,
  ArrowRight,
  Check,
  Sparkles,
  Lock,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { FullLogo } from '@/components/ui/Logo';
import CreateWorkspaceForm from '@/components/workspaces/CreateWorkspaceForm';

type Step = 'choose' | 'create';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('choose');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden font-sans">
      {/* Premium Background — subtle dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Soft ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-200/40 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-[100px]"></div>

      {/* Header */}
      <div className="relative z-10 px-8 py-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <FullLogo className="h-8" />
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push('/auth');
          }}
          className="text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="flex-1 relative z-10 flex items-center justify-center px-4 pb-20">
        <div className="w-full max-w-3xl">
          {/* Step: Choose */}
          {step === 'choose' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest">
                  <Sparkles className="w-4 h-4" />
                  Welcome to Klump
                </div>
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                  Let&apos;s set up your{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                    workspace
                  </span>
                  .
                </h1>
                <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
                  Create a workspace for your company or firm and start managing
                  your entity portfolio.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {/* Create Workspace Card */}
                <button
                  onClick={() => setStep('create')}
                  className="group relative text-left p-8 bg-white border border-gray-200 hover:border-indigo-400 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 group-hover:border-indigo-300 transition-colors duration-500">
                        <Building2 className="w-7 h-7 text-indigo-600" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-500">
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-500" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Create Workspace
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                      Start fresh. Set up a new workspace for your company or CA
                      firm.
                    </p>

                    <div className="space-y-2.5">
                      {[
                        'Invite team members',
                        'Manage entities',
                        'Full admin control',
                      ].map((f) => (
                        <div
                          key={f}
                          className="flex items-center gap-2.5 text-sm text-gray-600"
                        >
                          <div className="w-5 h-5 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </button>

                {/* Join Workspace Card */}
                <div className="relative text-left p-8 bg-white/60 border border-gray-200 rounded-3xl shadow-sm opacity-70 cursor-default">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
                      <Users className="w-7 h-7 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-400 mb-2">
                    Join Workspace
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    Got an invite? Use the link from your email to join an
                    existing team.
                  </p>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-600 text-xs font-bold uppercase tracking-wider rounded-full">
                    <Lock className="w-3.5 h-3.5" />
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step: Create Workspace Form */}
          {step === 'create' && (
            <div className="animate-in fade-in zoom-in-95 duration-500 max-w-lg mx-auto">
              <button
                onClick={() => setStep('choose')}
                className="text-sm font-medium text-gray-400 hover:text-gray-700 mb-8 flex items-center gap-2 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to options
              </button>

              <CreateWorkspaceForm onCancel={() => setStep('choose')} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
