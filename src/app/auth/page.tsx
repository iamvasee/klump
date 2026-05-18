'use client';

import { Eye, EyeOff, Shield, Lock, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PrimaryButton } from '@/components/ui/Button/index';
import { FullLogo } from '@/components/ui/Logo';

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check for existing session (Mock)
  useEffect(() => {
    const session = localStorage.getItem('klump-session');
    if (session) {
      router.push('/');
    }
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('klump-session', 'true');
      router.push('/');
    }, 1500);
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
                Statutory management,<br />
                <span className="text-blue-300">redefined.</span>
              </h1>
              
              <p className="text-xl text-blue-100/80 leading-relaxed max-w-lg">
                The modern standard for entity compliance and stakeholder management. 
                Built for portfolios that demand precision.
              </p>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-blue-200">
                    <Shield className="w-5 h-5" />
                    <span className="font-semibold">Secure</span>
                  </div>
                  <p className="text-sm text-blue-100/60">Enterprise-grade data encryption & privacy.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-blue-200">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Compliant</span>
                  </div>
                  <p className="text-sm text-blue-100/60">Automated regulatory health monitoring.</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-12 left-16">
              <p className="text-sm text-blue-200/50">
                © {new Date().getFullYear()} Klump Technologies. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Auth Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-20 relative bg-white">
          <div className="max-w-md mx-auto w-full">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center space-x-2 mb-12">
              <FullLogo className="h-8" />
            </div>
            
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="mt-2 text-gray-500">
                {isLogin 
                  ? 'Access your entity compliance dashboard' 
                  : 'Start managing your portfolio with Klump'}
              </p>
            </div>

            <div className="space-y-6">
              <form onSubmit={handleAuth} className="space-y-5">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      type="email"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 outline-none"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-semibold text-gray-700">Password</label>
                    {isLogin && (
                      <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 outline-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {isLogin && (
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
                      Keep me signed in for 30 days
                    </label>
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
                        <span>{isLogin ? 'Sign In to Dashboard' : 'Create Klump Account'}</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </PrimaryButton>
                </div>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-400">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700">
                  <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
                  <span>Google</span>
                </button>
              </div>

              <div className="pt-8 text-center">
                <p className="text-sm text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    {isLogin ? 'Sign up for free' : 'Sign in here'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
