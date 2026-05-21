'use client';

import ScrollReveal from './ScrollReveal';
import ProductPeek from './ProductPeek';
import { PrimaryButton, OutlineButton } from '@/components/ui/Button/index';
import { FullLogo } from '@/components/ui/Logo';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  FileText,
  Users,
} from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-28 sm:pt-32 pb-0 px-6 sm:px-10 overflow-visible min-h-screen">
      {/* Background ambient effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[70%] h-[60%] bg-indigo-100/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Split Layout: Text Left + Product Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Copy & CTA */}
          <div className="text-center lg:text-left">
            {/* Announcement Badge */}
            <ScrollReveal>
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-md border border-indigo-100 shadow-xl shadow-indigo-500/5 rounded-full mb-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center"
                    >
                      <div className="w-1 h-1 bg-indigo-600 rounded-full" />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Now Onboarding 25 Founding Partners
                </span>
              </div>
            </ScrollReveal>

            {/* The Headline */}
            <div className="mb-6">
              <h1 className="text-4xl sm:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] font-[900] text-gray-900 tracking-tight leading-[0.95] flex flex-col items-center lg:items-start">
                <span className="relative overflow-hidden py-1 h-[1.1em] flex items-center">
                  <span
                    className="inline-block animate-reveal-up opacity-0"
                    style={{ animationDelay: '100ms' }}
                  >
                    Institutions
                  </span>
                </span>
                <span className="relative overflow-hidden py-1 h-[1.1em] flex items-center -mt-4 lg:-mt-6">
                  <span
                    className="inline-block animate-reveal-up opacity-0 italic text-gray-400"
                    style={{ animationDelay: '300ms', fontFamily: 'serif' }}
                  >
                    remember
                  </span>
                </span>
                <span className="relative overflow-hidden py-2 h-[1.2em] flex items-center -mt-2">
                  <span
                    className="inline-block animate-reveal-up opacity-0"
                    style={{ animationDelay: '500ms' }}
                  >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600 bg-[length:200%_auto] animate-shimmer">
                      with klump.
                    </span>
                  </span>
                </span>
              </h1>
            </div>

            {/* Sub-headline */}
            <ScrollReveal delay={700}>
              <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 font-medium">
                Preserve filings, approvals, resolutions, records, and
                institutional history — across people, teams, and generations.
              </p>
            </ScrollReveal>

            {/* Call to Actions */}
            <ScrollReveal delay={900}>
              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-5">
                <a href="#waitlist">
                  <PrimaryButton
                    size="lg"
                    className="w-full sm:w-auto h-16 px-10 text-base font-black uppercase tracking-widest bg-indigo-600 border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700 shadow-2xl shadow-indigo-500/30 group"
                  >
                    Join the Waitlist
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </PrimaryButton>
                </a>
                <a href="#reality">
                  <OutlineButton
                    size="lg"
                    className="w-full sm:w-auto h-16 px-10 text-base font-bold bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white transition-all"
                  >
                    The Chaos Problem
                  </OutlineButton>
                </a>
              </div>
            </ScrollReveal>

            {/* Visual Social Proof */}
            <ScrollReveal delay={1100}>
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 opacity-30 grayscale hover:opacity-60 transition-opacity">
                <FullLogo className="h-5" />
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                  Compliant by Design
                </span>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full hidden sm:block" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 hidden sm:block">
                  Institutional Grade
                </span>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Product Peek + Floating Cards */}
          <div className="relative lg:ml-auto">
            <ScrollReveal delay={800} y={40}>
              <div className="relative">
                {/* Ambient glow behind the product peek */}
                <div className="absolute -inset-8 bg-gradient-to-br from-indigo-200/30 via-blue-200/20 to-transparent rounded-[4rem] blur-[40px] pointer-events-none" />
                <ProductPeek />

                {/* Floating Cards — rendered as siblings, no overflow parent */}

                {/* Compliance — Top Right */}
                <div className="absolute -top-8 -right-12 w-44 bg-white p-3 rounded-xl shadow-2xl border border-indigo-100 animate-bounce-slow hidden lg:block z-40">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">
                      Compliance
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-900 leading-tight">
                    Annual Return filed for FY 2023-24
                  </p>
                  <p className="text-[8px] text-gray-400 mt-1">
                    2 mins ago • by Alex
                  </p>
                </div>

                {/* Audit Trail — Mid Right */}
                <div className="absolute top-[50%] -right-16 w-44 bg-white p-3 rounded-xl shadow-2xl border border-gray-100 animate-float-delayed hidden lg:block z-40">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-gray-50 rounded-lg text-gray-600">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                      Audit Trail
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <p className="text-[9px] font-bold text-gray-700">
                        Director Appointed
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <p className="text-[9px] font-bold text-gray-700">
                        Shares Issued (Series A)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shareholders — Bottom Left */}
                <div className="absolute -bottom-10 -left-12 w-48 bg-white p-4 rounded-xl shadow-2xl border border-blue-100 animate-float hidden lg:block z-40">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">
                      Shareholders
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 w-full bg-blue-50 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-blue-600 rounded-full" />
                    </div>
                    <div className="flex justify-between text-[8px] font-bold text-gray-500">
                      <span>Promoter Group</span>
                      <span>65.4%</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Elegant bottom fade to bridge with the next section */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />
    </section>
  );
}
