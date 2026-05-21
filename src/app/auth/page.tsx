'use client';

import {
  Eye,
  EyeOff,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PrimaryButton } from '@/components/ui/Button/index';
import { FullLogo } from '@/components/ui/Logo';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push('/');
      }
    };
    checkSession();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Left Column - Branding & Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900">
          {/* Abstract brand pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>

          {/* Animated Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-12">
            <FullLogo className="h-10" fill="white" />
          </div>

          <div className="space-y-8">
            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight">
              Statutory management,
              <br />
              <span className="text-blue-300">redefined.</span>
            </h1>

            <p className="text-xl text-blue-100/80 leading-relaxed max-w-lg">
              The modern standard for entity compliance and stakeholder
              management. Built for portfolios that demand precision.
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-blue-200">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">Secure</span>
                </div>
                <p className="text-sm text-blue-100/60">
                  Enterprise-grade data encryption & privacy.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-blue-200">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Compliant</span>
                </div>
                <p className="text-sm text-blue-100/60">
                  Automated regulatory health monitoring.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 left-16">
            <p className="text-sm text-blue-200/50">
              © {new Date().getFullYear()} Klump Technologies. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-20 relative bg-white">
        <div className="max-w-md mx-auto w-full">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center space-x-2 mb-12">
            <FullLogo className="h-8" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-gray-500">
              Access your entity compliance dashboard
            </p>
          </div>

          {/* Beta Warning Banner */}
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 shadow-sm shadow-amber-900/5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                Developer Beta
              </h3>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                Access is currently strictly limited to invited users. As we are
                in active development, expect rapid updates, experimental
                features, and occasional bugs.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleAuth} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 outline-none"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-600 cursor-pointer select-none"
                >
                  Keep me signed in for 30 days
                </label>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="pt-2">
                <PrimaryButton
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 text-base font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all duration-200 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </PrimaryButton>
              </div>
            </form>

            <div className="pt-8 text-center">
              <p className="text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link
                  href="/#waitlist"
                  className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Join the waitlist
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
