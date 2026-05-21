'use client';

import { useState } from 'react';
import { Building2, Briefcase, Landmark, ShieldCheck, CheckCircle2 } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const personas = [
  {
    id: 'cs',
    icon: Building2,
    title: 'Company Secretaries',
    headline: 'Stop relying on your memory alone.',
    pains: [
      'Resolutions scattered across folders',
      'Physical registers with no digital backup',
      'Signing coordination across directors',
      'MCA deadline panic every quarter',
    ],
    emotional: 'One missing document can derail an entire board process.',
    color: 'indigo',
  },
  {
    id: 'ca',
    icon: Briefcase,
    title: 'CA & Audit Firms',
    headline: 'Manage 100 entities in one place.',
    pains: [
      'Partner dependency for knowledge',
      'No centralized visibility across clients',
      'Recurring filing chaos every cycle',
      'Difficult onboarding for new staff',
    ],
    emotional: 'Institutional memory shouldn\'t disappear when partners retire.',
    color: 'blue',
  },
  {
    id: 'fo',
    icon: Landmark,
    title: 'Family Offices',
    headline: 'Multi-generational continuity.',
    pains: [
      'Layered and overlapping ownership',
      'Undocumented entity relationships',
      'Succession planning without records',
      'No single source of truth',
    ],
    emotional: 'Institutions weaken when history becomes fragmented.',
    color: 'emerald',
  },
  {
    id: 'cfo',
    icon: ShieldCheck,
    title: 'Governance Teams',
    headline: 'Audit-ready, always.',
    pains: [
      'Finding approvals in email chains',
      'Tracking authority and signing rights',
      'Due diligence stress under pressure',
      'Ownership tracking across structures',
    ],
    emotional: 'Never rebuild your history from scratch for an audit again.',
    color: 'amber',
  },
];

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-600 border-indigo-600 text-white',
  blue: 'bg-blue-600 border-blue-600 text-white',
  emerald: 'bg-emerald-600 border-emerald-600 text-white',
  amber: 'bg-amber-600 border-amber-600 text-white',
};

const lightColorMap: Record<string, string> = {
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
};

export default function PersonaPainSection() {
  const [activeTab, setActiveTab] = useState(personas[0]);

  return (
    <section className="relative py-32 px-6 sm:px-10 bg-[#F8FAFC] overflow-hidden">
      {/* Background ambient glows and grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-4">
              Tailored for complexity
            </p>
            <h2 className="text-4xl sm:text-5xl font-[900] text-gray-900 tracking-tight">
              Designed for the people
              <br />
              <span className="text-gray-400">carrying the weight.</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Tab Selectors */}
          <div className="lg:col-span-5 space-y-3">
            {personas.map((persona) => {
              const isActive = activeTab.id === persona.id;
              return (
                <button
                  key={persona.id}
                  onClick={() => setActiveTab(persona)}
                  className={`w-full text-left p-6 rounded-[2rem] border transition-all duration-300 group ${
                    isActive
                      ? 'bg-white border-gray-200 shadow-xl shadow-gray-200/50 scale-[1.02]'
                      : 'bg-transparent border-transparent grayscale opacity-50 hover:grayscale-0 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-colors ${
                      isActive ? colorMap[persona.color] : 'bg-gray-100 text-gray-400'
                    }`}>
                      <persona.icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-lg truncate ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                        {persona.title}
                      </h3>
                      <div className={`overflow-hidden transition-all duration-300 ${isActive ? 'max-h-12 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                        <p className="text-xs text-gray-500 font-medium truncate">
                          {persona.headline}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Active Content */}
          <div className="lg:col-span-7">
            {/* Fixed height container to prevent jumping */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/40 p-10 sm:p-14 relative overflow-hidden h-[540px] flex flex-col">
              {/* Background Accent */}
              <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20 -mr-32 -mt-32 transition-colors duration-700 ${lightColorMap[activeTab.color]}`} />
              
              <div key={activeTab.id} className="relative z-10 animate-in fade-in slide-in-from-right-8 duration-500 flex-1 flex flex-col">
                <div className={`inline-flex self-start items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 ${lightColorMap[activeTab.color]}`}>
                  <activeTab.icon className="w-3 h-3" />
                  The {activeTab.title} Challenge
                </div>

                <h4 className="text-3xl font-[900] text-gray-900 leading-tight mb-10 italic underline decoration-indigo-500/20 underline-offset-8">
                  &ldquo;{activeTab.headline}&rdquo;
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-8 flex-1 content-start">
                  {activeTab.pains.map((pain) => (
                    <div key={pain} className="flex items-start gap-3">
                      <div className={`mt-1 shrink-0 rounded-full p-0.5 ${lightColorMap[activeTab.color]}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-bold text-gray-600 leading-snug">{pain}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8 border-t border-gray-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                    The Stakes
                  </p>
                  <p className="text-lg font-bold text-gray-900 italic leading-relaxed">
                    {activeTab.emotional}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

