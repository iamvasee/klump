'use client';

import ScrollReveal from './ScrollReveal';
import { 
  Zap, 
  Cloud, 
  MessageCircle, 
  ArrowRight, 
  Building2, 
  History,
  Archive,
  Fingerprint,
  Search,
  ShieldCheck
} from 'lucide-react';

export default function VisionSection() {
  return (
    <section className="relative py-40 px-6 sm:px-10 bg-[#fafafa] overflow-hidden">
      {/* Background ambient glows and grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-indigo-50/40 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-8">
              <Zap className="w-3 h-3 fill-current" />
              The Mission
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[900] text-gray-900 tracking-tight leading-[1.1] mb-6">
              Closing the
              <br />
              <span className="text-gray-400">Memory Gap.</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Organizations fail when they rely on individuals to remember. Klump shifts the burden of memory from the person to the institution itself.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
          {/* Comparison Card 1: Individual */}
          <div className="lg:col-span-5">
            <ScrollReveal delay={100} x={-20}>
              <div className="h-full p-10 bg-white border border-gray-100 rounded-[3rem] shadow-sm flex flex-col relative overflow-hidden group">
                {/* Background Danger Accent */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-red-50 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="flex items-center gap-4 mb-10 relative z-10">
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                    <Fingerprint className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Individual Memory</h3>
                    <p className="text-[11px] font-bold text-red-600 uppercase italic">Status: Fragmented</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-10 flex-1 relative z-10">
                   {[
                     { icon: MessageCircle, label: 'Trapped in inboxes', desc: 'Approvals lost in email chains' },
                     { icon: Archive, label: 'Unstructured chaos', desc: 'Paper files & scattered Excel sheets' },
                     { icon: History, label: 'Fragile continuity', desc: 'Memory disappears when people leave' },
                   ].map((item) => (
                     <div key={item.label} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-red-100 transition-all group/item">
                        <item.icon className="w-5 h-5 text-gray-300 group-hover/item:text-red-400" />
                        <div>
                          <p className="text-xs font-bold text-gray-400 group-hover/item:text-gray-700 transition-colors">{item.label}</p>
                          <p className="text-[10px] text-gray-300 group-hover/item:text-gray-400 transition-colors">{item.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <p className="text-sm text-red-400 font-bold leading-relaxed italic relative z-10">
                  Institutions weaken when they rely on individuals to remember.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* The Bridge Indicator */}
          <div className="lg:col-span-2 flex items-center justify-center">
             <div className="hidden lg:flex flex-col items-center gap-4">
                <div className="h-20 w-px bg-gradient-to-b from-transparent via-gray-200 to-gray-200" />
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-300">
                   <ArrowRight className="w-4 h-4" />
                </div>
                <div className="h-20 w-px bg-gradient-to-b from-gray-200 via-gray-200 to-transparent" />
             </div>
          </div>

          {/* Comparison Card 2: Institutional */}
          <div className="lg:col-span-5">
            <ScrollReveal delay={200} x={20}>
              <div className="h-full p-10 bg-white border border-gray-100 rounded-[3rem] shadow-sm flex flex-col relative overflow-hidden group">
                 {/* Background Success Accent */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="flex items-center gap-4 mb-10 relative z-10">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Institutional Memory</h3>
                    <p className="text-[11px] font-bold text-emerald-600 uppercase">Status: Continuous</p>
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-1 relative z-10">
                   {[
                     { icon: Cloud, label: 'Single source of truth', desc: 'Every record centralized & secure' },
                     { icon: Search, label: 'Instantly searchable', desc: 'Find any resolution or filing in seconds' },
                     { icon: ShieldCheck, label: 'Generational access', desc: 'History outlasts any single employee' },
                   ].map((item) => (
                     <div key={item.label} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-emerald-100 transition-all group/item">
                        <item.icon className="w-5 h-5 text-gray-400 group-hover/item:text-emerald-500" />
                        <div>
                          <p className="text-xs font-bold text-gray-700">{item.label}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{item.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <p className="text-sm text-emerald-600 font-medium leading-relaxed italic relative z-10">
                   True institutional memory never forgets.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* The Resolution Section */}
        <ScrollReveal delay={400} y={40}>
          <div className="mt-20 p-10 sm:p-16 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[3.5rem] text-white text-center shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            {/* Animated shimmer overlay */}
            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms] ease-in-out pointer-events-none" />
            
            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl font-[900] tracking-tight mb-8 leading-tight">
                Klump is the infrastructure for
                <br />
                <span className="italic underline decoration-white/20 underline-offset-8">generational continuity.</span>
              </h3>
              <p className="text-lg text-indigo-100 max-w-2xl mx-auto font-medium leading-relaxed mb-10 opacity-90">
                We build the memory layer that ensures your organization never has to look back with uncertainty. From first filing to final transition.
              </p>
              <div className="flex items-center justify-center gap-10 opacity-50 grayscale hover:opacity-100 transition-opacity duration-500">
                {['Immutable Records', 'Generational Access', 'Audit Certainty'].map(tag => (
                  <span key={tag} className="text-[10px] font-black uppercase tracking-[0.2em]">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
