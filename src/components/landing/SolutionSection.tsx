'use client';

import ScrollReveal from './ScrollReveal';
import { LANDING_MEMORY_ITEMS } from '@/lib/constants';

export default function SolutionSection() {
  return (
    <section className="relative py-32 px-6 sm:px-10 overflow-hidden">
      {/* Background grid and ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-indigo-100/30 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-[900] text-gray-900 tracking-tight mb-6 leading-tight">
              From fragmented records
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 animate-shimmer bg-[length:200%_auto]">
                to institutional continuity.
              </span>
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="bg-white border border-gray-100 rounded-[3rem] p-10 sm:p-16 shadow-2xl shadow-gray-200/40 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none" />

            <div className="relative z-10">
              <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed mb-10">
                Klump creates a{' '}
                <span className="font-black text-gray-900 underline decoration-indigo-500/20 underline-offset-8">
                  structured memory layer
                </span>{' '}
                for high-stakes organizations.
              </p>

              <div className="flex items-center gap-3 mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                  The Catalog
                </span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
                {LANDING_MEMORY_ITEMS.map((item) => (
                  <div
                    key={item}
                    className="group px-4 py-4 bg-gray-50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-lg hover:shadow-indigo-500/5 rounded-2xl text-xs font-bold text-gray-600 text-center transition-all duration-300"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <p className="text-xl text-gray-700 leading-relaxed">
                  …becomes{' '}
                  <span className="font-black text-gray-900 italic">
                    permanently organized
                  </span>
                  ,{' '}
                  <span className="font-black text-gray-900 underline decoration-blue-500/20">
                    searchable
                  </span>
                  , and{' '}
                  <span className="font-black text-gray-900 tracking-tight">
                    traceable
                  </span>
                  .
                </p>

                <div className="flex flex-wrap gap-8 pt-10 border-t border-gray-50">
                  {[
                    'Across entities.',
                    'Across teams.',
                    'Across generations.',
                  ].map((line) => (
                    <p
                      key={line}
                      className="text-sm font-black text-indigo-600 uppercase tracking-widest"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
