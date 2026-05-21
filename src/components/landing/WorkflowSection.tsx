'use client';

import { Search, Clock, Shield } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const workflows = [
  {
    icon: Search,
    title: 'Ask your organization questions.',
    description: 'Natural language access to your entire institutional memory.',
    examples: [
      '"Show all borrowing-related resolutions."',
      '"Who was authorized signatory in 2021?"',
      '"Which entities have overdue filings?"',
    ],
    accent: 'from-indigo-500 to-blue-500',
  },
  {
    icon: Clock,
    title: 'See institutional history chronologically.',
    description: 'Every governance event, placed on a structured timeline.',
    examples: [
      'Board approvals & resolutions',
      'ROC filings & annual returns',
      'Ownership changes & notices',
      'Director appointments & cessations',
    ],
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Preserve continuity across teams.',
    description: 'When people leave, the institution keeps its memory.',
    examples: [
      'Complete audit trails for every action',
      'Role-based access & permissions',
      'Traceable approval chains',
      'Archival permanence across generations',
    ],
    accent: 'from-emerald-500 to-teal-500',
  },
];

export default function WorkflowSection() {
  return (
    <section className="relative py-32 px-6 sm:px-10 bg-white overflow-hidden">
      {/* Background grid and ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-[10%] w-[40%] h-[40%] bg-blue-50/60 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-indigo-50/60 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-24">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4">
              Intelligence in motion
            </p>
            <h2 className="text-4xl sm:text-5xl font-[900] text-gray-900 tracking-tight">
              Workflows, not features.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {workflows.map((workflow, i) => (
            <ScrollReveal key={workflow.title} delay={i * 100} y={40}>
              <div className="h-full flex flex-col bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group relative">
                {/* Accent Gradient */}
                <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${workflow.accent}`} />

                <div className="p-10 flex-1 flex flex-col relative z-10">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl transition-all duration-500">
                    <workflow.icon className="w-8 h-8 text-gray-900" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-[900] text-gray-900 mb-4 leading-tight">
                    {workflow.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm font-medium text-gray-500 mb-10 leading-relaxed">{workflow.description}</p>

                  {/* Examples */}
                  <div className="mt-auto space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">Example Queries</p>
                    {workflow.examples.map((example) => (
                      <div
                        key={example}
                        className="px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 group-hover:bg-white group-hover:border-indigo-100 transition-colors"
                      >
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

