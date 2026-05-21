'use client';

import ScrollReveal from './ScrollReveal';
import ProductPeek from './ProductPeek';
import { PrimaryButton, OutlineButton } from '@/components/ui/Button/index';
import { FullLogo } from '@/components/ui/Logo';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-0 px-6 sm:px-10 overflow-hidden">
      {/* Background ambient effects — match onboarding and dashboard */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft atmospheric glows */}
        <div className="absolute top-[-10%] left-[-5%] w-[70%] h-[60%] bg-indigo-100/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[120px]" />
        
        {/* Modern Dot Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Announcement Badge */}
        <ScrollReveal>
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-md border border-indigo-100 shadow-xl shadow-indigo-500/5 rounded-full mb-12">
            <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center">
                   <div className="w-1 h-1 bg-indigo-600 rounded-full" />
                 </div>
               ))}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Now Onboarding 50 Founding Partners
            </span>
          </div>
        </ScrollReveal>

        {/* The Headline — Simplified and Robust */}
        <div className="mb-10">
          <h1 className="text-5xl sm:text-7xl lg:text-[6rem] font-[900] text-gray-900 tracking-tight leading-[0.95] flex flex-col items-center">
            <span className="relative overflow-hidden py-1 h-[1.1em] flex items-center">
              <span className="inline-block animate-reveal-up opacity-0" style={{ animationDelay: '100ms' }}>
                Institutions
              </span>
            </span>
            <span className="relative overflow-hidden py-1 h-[1.1em] flex items-center -mt-4 lg:-mt-6">
              <span className="inline-block animate-reveal-up opacity-0 italic text-gray-400" style={{ animationDelay: '300ms', fontFamily: 'serif' }}>
                remember
              </span>
            </span>
            <span className="relative overflow-hidden py-2 h-[1.2em] flex items-center -mt-2">
              <span className="inline-block animate-reveal-up opacity-0" style={{ animationDelay: '500ms' }}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600 bg-[length:200%_auto] animate-shimmer">
                  with klump.
                </span>
              </span>
            </span>
          </h1>
        </div>

        {/* Sub-headline */}
        <ScrollReveal delay={700}>
          <p className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-12 font-medium">
            Building the memory infrastructure for high-stakes organizations. 
            Preserve history across people, teams, and generations.
          </p>
        </ScrollReveal>

        {/* Call to Actions */}
        <ScrollReveal delay={900}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
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
           <div className="mt-16 flex items-center justify-center gap-10 opacity-30 grayscale hover:opacity-60 transition-opacity">
              <FullLogo className="h-5" />
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Compliant by Design</span>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Institutional Grade</span>
           </div>
        </ScrollReveal>

        {/* The Product Peek Visual */}
        <ScrollReveal delay={1300} y={40}>
          <ProductPeek />
        </ScrollReveal>
      </div>
      
      {/* Elegent bottom fade to bridge with the next section */}
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />
    </section>
  );
}
