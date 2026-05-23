'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  ArrowRight,
  Check,
  AlertCircle,
  Loader2,
  X,
  Globe,
  Zap,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import TextField from '@/components/ui/TextField/TextField';
import { toast } from 'sonner';

type SlugStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
const MIN_SLUG_LENGTH = 3;
const MAX_SLUG_LENGTH = 48;

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
  onSuccess?: (slug: string) => void;
}

export default function CreateWorkspaceForm({
  onCancel,
  onSuccess,
}: CreateWorkspaceFormProps) {
  const router = useRouter();
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
        message: `Min ${MIN_SLUG_LENGTH} characters required`,
      };
    if (slug.length > MAX_SLUG_LENGTH)
      return {
        valid: false,
        message: `Max ${MAX_SLUG_LENGTH} characters allowed`,
      };
    if (slug.startsWith('-') || slug.endsWith('-'))
      return { valid: false, message: 'Cannot start or end with hyphen' };
    if (slug.includes('--'))
      return { valid: false, message: 'Cannot contain consecutive hyphens' };
    if (!SLUG_REGEX.test(slug))
      return {
        valid: false,
        message: 'Lowercase letters, numbers, and hyphens only',
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

    try {
      const { data: isAvailable, error: rpcError } = await supabase.rpc(
        'check_slug_available',
        {
          slug_to_check: slug,
        }
      );

      if (rpcError) throw rpcError;

      if (isAvailable) {
        setSlugStatus('available');
        setSlugMessage('This workspace ID is available');
      } else {
        setSlugStatus('taken');
        setSlugMessage('This workspace ID is already taken');
      }
    } catch (err) {
      console.error('Error checking slug:', err);
      setSlugStatus('idle');
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
      .replace(/^-+|-+$/g, '')
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
    if (slugStatus !== 'available') return;

    setIsLoading(true);
    setError('');

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth');
        return;
      }

      const { error: createError } = await supabase.rpc(
        'create_workspace_with_admin',
        {
          workspace_name: orgName,
          workspace_slug: orgSlug,
        }
      );

      if (createError) {
        setError(createError.message);
        toast.error(createError.message);
        setIsLoading(false);
        return;
      }

      if (onSuccess) {
        onSuccess(orgSlug);
      } else {
        window.location.href = `/${orgSlug}`;
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error('Failed to create workspace');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-gray-100 p-10 sm:p-12 relative overflow-hidden group/form">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-[100px] -mr-16 -mt-16 transition-transform group-hover/form:scale-110 duration-700" />

      <div className="mb-12 text-center relative z-10">
        <div className="w-16 h-16 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200 ring-4 ring-indigo-50">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-[900] text-gray-900 tracking-tight mb-3">
          Create Workspace
        </h2>
        <p className="text-sm text-gray-400 font-medium max-w-[280px] mx-auto leading-relaxed">
          Initialize a secure organizational node for your institutional memory.
        </p>
      </div>

      <form onSubmit={handleCreateOrg} className="space-y-8 relative z-10">
        <div className="space-y-6">
          <TextField
            label={
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Workspace Name
              </span>
            }
            placeholder="e.g. Acme Corp"
            value={orgName}
            onChange={handleOrgNameChange}
            required
            className="group"
            leftIcon={
              <Building2 className="w-4 h-4 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
            }
          />

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Workspace URL
            </label>
            <div
              className={`flex items-center border-2 h-16 rounded-2xl overflow-hidden bg-gray-50/30 focus-within:bg-white focus-within:ring-4 transition-all duration-300 ${
                slugStatus === 'available'
                  ? 'border-emerald-100 focus-within:ring-emerald-500/5 focus-within:border-emerald-500'
                  : slugStatus === 'taken' || slugStatus === 'invalid'
                    ? 'border-red-100 focus-within:ring-red-500/5 focus-within:border-red-500'
                    : 'border-gray-100 focus-within:ring-indigo-500/5 focus-within:border-indigo-600'
              }`}
            >
              <div className="px-5 h-full flex items-center gap-2 text-gray-400 text-[10px] border-r border-gray-100 bg-gray-50/50 font-black uppercase tracking-widest shrink-0">
                <Globe className="w-3.5 h-3.5" />
                klump.app/
              </div>
              <input
                type="text"
                required
                value={orgSlug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="flex-1 px-5 h-full bg-transparent outline-none text-gray-900 text-sm font-bold placeholder:text-gray-200"
                placeholder="identifier"
                maxLength={MAX_SLUG_LENGTH}
              />
              {slugStatus !== 'idle' && (
                <div className="pr-5 flex items-center">
                  {slugStatus === 'checking' && (
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  )}
                  {slugStatus === 'available' && (
                    <div className="w-6 h-6 bg-emerald-50 rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                  )}
                  {slugStatus === 'taken' && (
                    <div className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center">
                      <X className="w-3.5 h-3.5 text-red-500" />
                    </div>
                  )}
                  {slugStatus === 'invalid' && (
                    <div className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    </div>
                  )}
                </div>
              )}
            </div>
            {slugMessage && (
              <div
                className={`mt-2.5 text-[9px] font-black uppercase tracking-widest ml-1 flex items-center gap-2 ${
                  slugStatus === 'available'
                    ? 'text-emerald-600'
                    : slugStatus === 'taken' || slugStatus === 'invalid'
                      ? 'text-red-500'
                      : 'text-gray-400'
                }`}
              >
                {slugStatus === 'available' ? (
                  <Zap className="w-3 h-3 fill-current" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                {slugMessage}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            </div>
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 h-14 bg-gray-50 hover:bg-gray-100 text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={
              isLoading || !orgName || !orgSlug || slugStatus !== 'available'
            }
            className="flex-[2] h-14 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 relative overflow-hidden group/btn"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span className="relative z-10 flex items-center gap-3">
                  Initialize Workspace
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
