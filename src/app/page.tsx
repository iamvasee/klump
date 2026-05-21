import { FullLogo } from '@/components/ui/Logo';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden font-sans"
      style={{ backgroundColor: '#0A0B14', color: '#F5F3EF' }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-30%] left-[-15%] w-[70%] h-[70%] rounded-full blur-[160px]"
          style={{ backgroundColor: 'rgba(124, 58, 237, 0.12)' }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[140px]"
          style={{ backgroundColor: 'rgba(6, 182, 212, 0.08)' }}
        />
        <div
          className="absolute top-[40%] left-[50%] w-[40%] h-[40%] rounded-full blur-[120px] -translate-x-1/2"
          style={{ backgroundColor: 'rgba(0, 209, 167, 0.06)' }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-6 max-w-7xl mx-auto w-full">
        <FullLogo className="h-8" fill="#F5F3EF" />
        <div className="flex items-center gap-4">
          <Link
            href="/auth"
            className="text-sm font-medium transition-colors hover:text-white"
            style={{ color: 'rgba(245, 243, 239, 0.6)' }}
          >
            Sign In
          </Link>
          <a
            href="#waitlist"
            className="px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: '#7C3AED',
              color: '#fff',
              boxShadow: '0 0 24px rgba(124, 58, 237, 0.3)',
            }}
          >
            Join the Waitlist
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-10 text-center max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border"
            style={{
              backgroundColor: 'rgba(124, 58, 237, 0.1)',
              borderColor: 'rgba(124, 58, 237, 0.3)',
              color: '#A78BFA',
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#7C3AED' }}
            />
            Now accepting early design partners
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]"
            style={{ color: '#F5F3EF' }}
          >
            Institutions remember
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-teal-400">
              with klump.
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto"
            style={{ color: 'rgba(245, 243, 239, 0.55)' }}
          >
            Memory infrastructure for modern organizations. Preserve continuity
            across filings, approvals, resolutions, records, and institutional
            knowledge — all in one intelligent system.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#waitlist"
              className="px-8 py-4 text-base font-bold rounded-2xl transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: '#7C3AED',
                color: '#fff',
                boxShadow: '0 4px 32px rgba(124, 58, 237, 0.35)',
              }}
            >
              Join the Waitlist →
            </a>
            <a
              href="#design-partner"
              className="px-8 py-4 text-base font-semibold rounded-2xl border transition-all duration-300 hover:bg-white/5"
              style={{
                borderColor: 'rgba(245, 243, 239, 0.15)',
                color: 'rgba(245, 243, 239, 0.7)',
              }}
            >
              Become a Design Partner
            </a>
          </div>
        </div>
      </main>

      {/* Simple footer */}
      <footer
        className="relative z-10 text-center py-8 text-xs"
        style={{ color: 'rgba(245, 243, 239, 0.3)' }}
      >
        © {new Date().getFullYear()} Klump Technologies. All rights reserved.
      </footer>
    </div>
  );
}
