'use client';

import { Lock, History, Eye, Server, Fingerprint, GitBranch } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const trustItems = [
  {
    icon: History,
    title: 'Audit trails',
    description: 'Every action logged. Every change traceable. Nothing gets lost.',
  },
  {
    icon: Lock,
    title: 'Role-based permissions',
    description: 'Fine-grained access control across teams and entities.',
  },
  {
    icon: GitBranch,
    title: 'Continuity by design',
    description: 'Structured to survive people leaving, retiring, or transitioning.',
  },
  {
    icon: Server,
    title: 'Encrypted storage',
    description: 'Enterprise-grade encryption at rest and in transit.',
  },
  {
    icon: Eye,
    title: 'Full traceability',
    description: 'Who did what, when, and why — always answerable.',
  },
  {
    icon: Fingerprint,
    title: 'Governance-first architecture',
    description: 'Built for compliance professionals, not retro-fitted.',
  },
];

export default function TrustSection() {
  return (
    <section className="relative py-32 px-6 sm:px-10 overflow-hidden">
      {/* Background grid and ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-indigo-50/30 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Built like institutional
              <br />
              <span className="text-gray-400">infrastructure.</span>
            </h2>
            <p className="text-base text-gray-500 max-w-xl mx-auto">
              Trust first. Everything else second.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustItems.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 80}>
              <div className="p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-all duration-300 group">
                <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors duration-300">
                  <item.icon className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
