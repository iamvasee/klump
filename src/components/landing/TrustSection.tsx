'use client';

import {
  Lock,
  History,
  Eye,
  Server,
  Fingerprint,
  Shield,
  ShieldCheck,
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const trustItems = [
  {
    icon: ShieldCheck,
    title: 'SOC2 Standards Pathway',
    description:
      'We are actively building our internal controls, data handling, and infrastructure towards official SOC2 compliance.',
  },
  {
    icon: Server,
    title: 'Bank-grade Encryption',
    description:
      'AES-256 encryption at rest and TLS 1.3 in transit. Your sensitive documents are locked in a cryptographic vault.',
  },
  {
    icon: Lock,
    title: 'Strict Compartmentalization',
    description:
      'Granular Row-Level Security (RLS) ensures data is strictly locked down to specific entities and authorized roles.',
  },
  {
    icon: History,
    title: 'Immutable Audit Trails',
    description:
      'Every action logged. Every document version tracked. Absolute, unbroken continuity for your external audits.',
  },
  {
    icon: Fingerprint,
    title: 'Governance-First Design',
    description:
      'Not retrofitted. Built specifically from day one for compliance professionals and complex multi-entity structures.',
  },
  {
    icon: Eye,
    title: 'Zero-Knowledge Traceability',
    description:
      'Who did what, when, and why — always answerable to you, completely invisible to unauthorized parties.',
  },
];

export default function TrustSection() {
  return (
    <section className="relative py-32 px-6 sm:px-10 overflow-hidden bg-white">
      {/* Background grid and ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-blue-50/50 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              <Shield className="w-3.5 h-3.5" />
              Security First
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
              Architected for strict compliance.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Building for SOC2.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
              We handle highly sensitive board resolutions, multi-entity cap
              tables, and statutory documents. Security isn&apos;t an
              afterthought—it&apos;s the foundation. We are building our entire
              infrastructure to meet and exceed rigorous SOC2 certification
              standards.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {trustItems.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 80}>
              <div className="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:scale-110 transition-all duration-300">
                  <item.icon className="w-6 h-6 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
