'use client';

import {
  MessageSquare,
  FolderOpen,
  FileText,
  Mail,
  Archive,
  Sheet,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const chaosItems = [
  { icon: MessageSquare, label: 'WhatsApp', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: FolderOpen, label: 'Shared drives', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { icon: Mail, label: 'Email', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Sheet, label: 'Excel', color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

export default function RealitySection() {
  return (
    <section id="reality" className="relative py-32 px-6 sm:px-10 bg-white overflow-hidden">
      {/* Background grid and ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-red-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-24">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[900] text-gray-900 tracking-tight mb-6">
              Memory shouldn&apos;t be
              <br />
              <span className="text-gray-400">an operational risk.</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Most institutional knowledge is scattered across fragmented channels, creating a fragile foundation for growth.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent hidden lg:block" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* The Chaos side */}
            <div className="space-y-8 relative">
              <ScrollReveal delay={100} x={-20}>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-100 to-orange-100 rounded-3xl blur opacity-30" />
                  <div className="relative bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-6">The Current Mess</p>
                    <div className="grid grid-cols-2 gap-4">
                      {chaosItems.map((item, i) => (
                        <div
                          key={item.label}
                          className={`group p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-red-100 transition-all duration-300 hover:scale-[1.05] animate-float`}
                          style={{ animationDelay: `${i * 0.5}s`, animationDuration: '4s' }}
                        >
                          <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mb-3`}>
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                          </div>
                          <span className="text-xs font-bold text-gray-900">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
              
              <ScrollReveal delay={300}>
                <div className="flex items-start gap-4 p-6 bg-red-50/50 rounded-2xl border border-red-100">
                  <div className="p-2 bg-white rounded-lg text-red-600 shadow-sm">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <p className="text-sm font-medium text-red-900/80 leading-relaxed italic">
                    &quot;We found the resolution, but it was the unsigned version. The signed copy was in a partner&apos;s WhatsApp from 2021.&quot;
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* The Order side */}
            <div className="space-y-8 relative">
              <ScrollReveal delay={200} x={20}>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-3xl blur opacity-50" />
                  <div className="relative bg-white border border-indigo-100 p-8 rounded-[2.5rem] shadow-xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6">The Klump Way</p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200 group overflow-hidden relative">
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">Unified Memory</h4>
                          <p className="text-[11px] opacity-80">Everything linked, searchable, and generational.</p>
                        </div>
                        <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {['Institutional Continuity', 'Compliance Certainty', 'Clean Governance'].map((item) => (
                          <div key={item} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-xs font-bold text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={400}>
                <div className="p-8 bg-indigo-50/30 rounded-3xl border border-indigo-100/50">
                  <p className="text-sm font-bold text-gray-900 mb-2">Build Infrastructure, not just folders.</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Klump transforms scattered documents into institutional intelligence. We help you move from surviving the next audit to owning your entire corporate history.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

