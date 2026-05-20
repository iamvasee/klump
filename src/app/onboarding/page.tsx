'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Users,
  ArrowRight,
  Check,
  Sparkles,
  Lock,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { FullLogo } from '@/components/ui/Logo';

type Step = 'choose' | 'create';
type SlugStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
const MIN_SLUG_LENGTH = 3;
const MAX_SLUG_LENGTH = 48;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('choose');
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [slugStatus, setSlugStatus] = useState<SlugStatus>('idle');
  const [slugMessage, setSlugMessage] = useState('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const validateSlugFormat = (
    slug: string
  ): { valid: boolean; message: string } => {
    if (slug.length === 0) return { valid: false, message: '' };
    if (slug.length < MIN_SLUG_LENGTH)
      return {
        valid: false,
        message: `Must be at least ${MIN_SLUG_LENGTH} characters.`,
      };
    if (slug.length > MAX_SLUG_LENGTH)
      return {
        valid: false,
        message: `Must be ${MAX_SLUG_LENGTH} characters or fewer.`,
      };
    if (slug.startsWith('-') || slug.endsWith('-'))
      return { valid: false, message: 'Cannot start or end with a hyphen.' };
    if (slug.includes('--'))
      return { valid: false, message: 'Cannot contain consecutive hyphens.' };
    if (!SLUG_REGEX.test(slug))
      return {
        valid: false,
        message: 'Only lowercase letters, numbers and hyphens allowed.',
      };
    return { valid: true, message: '' };
  };

  const checkSlugAvailability = useCallback(async (slug: string) => {
    const { valid, message } = validateSlugFormat(slug);
    if (!valid) {
      setSlugStatus(message ? 'invalid' : 'idle');
      setSlugMessage(message);
      return;
    }

    setSlugStatus('checking');
    setSlugMessage('');

    const { data: isAvailable } = await supabase.rpc('check_slug_available', {
      slug_to_check: slug,
    });

    if (isAvailable) {
      setSlugStatus('available');
      setSlugMessage('This URL is available!');
    } else {
      setSlugStatus('taken');
      setSlugMessage('This URL is already taken.');
    }
  }, []);

  const handleSlugChange = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setOrgSlug(cleaned);
    setSlugStatus('idle');
    setSlugMessage('');

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (cleaned.length > 0) {
      debounceRef.current = setTimeout(
        () => checkSlugAvailability(cleaned),
        500
      );
    }
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleOrgNameChange = (name: string) => {
    setOrgName(name);
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setOrgSlug(slug);
    setSlugStatus('idle');
    setSlugMessage('');

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (slug.length > 0) {
      debounceRef.current = setTimeout(() => checkSlugAvailability(slug), 500);
    }
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log('[DEBUG] Auth user:', user?.id, user?.email);

    if (!user) {
      router.push('/auth');
      return;
    }

    // Also check the session to confirm JWT is being sent
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log('[DEBUG] Session exists:', !!session);
    console.log(
      '[DEBUG] Access token (first 20 chars):',
      session?.access_token?.substring(0, 20)
    );

    // Atomically create workspace and add user as admin
    const { data: workspaceId, error: createError } = await supabase.rpc(
      'create_workspace_with_admin',
      {
        workspace_name: orgName,
        workspace_slug: orgSlug,
      }
    );

    if (createError) {
      setError(createError.message);
      setIsLoading(false);
      return;
    }

    console.log('[DEBUG] Successfully created workspace with ID:', workspaceId);

    // Hard redirect to the new workspace dashboard.
    // This bypasses the root redirect and ensures the user lands exactly where they need to be.
    window.location.href = `/${orgSlug}`;
  };

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

              <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-200 p-10 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500"></div>

                <div className="mb-10 text-center">
                  <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-100">
                    <Building2 className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Name your workspace
                  </h2>
                  <p className="mt-3 text-gray-500">
                    This is where your team will collaborate.
                  </p>
                </div>

                <form onSubmit={handleCreateOrg} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Organisation Name
                    </label>
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => handleOrgNameChange(e.target.value)}
                      className="w-full px-5 py-4 border border-gray-200 rounded-2xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                      placeholder="e.g. Acme & Associates"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Workspace URL
                    </label>
                    <div
                      className={`flex items-center border rounded-2xl overflow-hidden bg-gray-50/50 focus-within:bg-white focus-within:ring-2 transition-all ${
                        slugStatus === 'available'
                          ? 'border-green-300 focus-within:ring-green-500 focus-within:border-green-500'
                          : slugStatus === 'taken' || slugStatus === 'invalid'
                            ? 'border-red-300 focus-within:ring-red-500 focus-within:border-red-500'
                            : 'border-gray-200 focus-within:ring-indigo-500 focus-within:border-indigo-500'
                      }`}
                    >
                      <span className="px-5 py-4 text-gray-400 text-sm border-r border-gray-200 bg-gray-100 select-none font-medium">
                        klump.app/
                      </span>
                      <input
                        type="text"
                        required
                        value={orgSlug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        className="flex-1 px-5 py-4 bg-transparent outline-none text-gray-900 text-sm"
                        placeholder="acme-associates"
                        maxLength={MAX_SLUG_LENGTH}
                      />
                      {slugStatus !== 'idle' && (
                        <div className="pr-4 flex items-center">
                          {slugStatus === 'checking' && (
                            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                          )}
                          {slugStatus === 'available' && (
                            <Check className="w-5 h-5 text-green-500" />
                          )}
                          {slugStatus === 'taken' && (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                          {slugStatus === 'invalid' && (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {slugMessage ? (
                      <p
                        className={`mt-2 text-xs font-medium ${
                          slugStatus === 'available'
                            ? 'text-green-600'
                            : slugStatus === 'taken' || slugStatus === 'invalid'
                              ? 'text-red-500'
                              : 'text-gray-400'
                        }`}
                      >
                        {slugMessage}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs font-medium text-gray-400">
                        Lowercase letters, numbers and hyphens only.
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm font-medium text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      !orgName ||
                      !orgSlug ||
                      slugStatus !== 'available'
                    }
                    className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-3 mt-4"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
