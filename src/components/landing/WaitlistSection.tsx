'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { PrimaryButton } from '@/components/ui/Button/index';
import { WAITLIST_ROLE_OPTIONS } from '@/lib/constants';

export default function WaitlistSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    challenge: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section
      id="waitlist"
      className="relative py-40 px-6 sm:px-10 bg-white overflow-hidden"
    >
      {/* Background ambient glows and grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-[900] text-gray-900 tracking-tight mb-6">
              Join the founding partners.
            </h2>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              We&apos;re building the next generation of institutional memory
              with the leaders who live this complexity every day.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          {isSubmitted ? (
            <div className="bg-white border border-green-200 rounded-[3rem] p-12 text-center shadow-2xl shadow-green-100/50 animate-in zoom-in-95 duration-700">
              <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-3xl font-[900] text-gray-900 mb-4">
                You&apos;re on the list.
              </h3>
              <p className="text-gray-500 font-medium">
                Thank you for believing in institutional continuity. We&apos;ll
                be in touch soon to begin our partnership.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/60 border border-gray-100 p-10 sm:p-14 relative overflow-hidden group">
              {/* Gradient accent bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600 animate-shimmer bg-[length:200%_auto]" />

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full h-14 px-6 border border-gray-100 bg-gray-50/50 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 outline-none transition-all font-medium text-gray-900"
                      placeholder="e.g. Alexander Wilder"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full h-14 px-6 border border-gray-100 bg-gray-50/50 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 outline-none transition-all font-medium text-gray-900"
                      placeholder="name@company.com"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Organization
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: e.target.value,
                        })
                      }
                      className="w-full h-14 px-6 border border-gray-100 bg-gray-50/50 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 outline-none transition-all font-medium text-gray-900"
                      placeholder="e.g. Acme Corp"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Current Role
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="w-full h-14 px-6 border border-gray-100 bg-gray-50/50 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 outline-none transition-all font-medium text-gray-900 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          What is your position?
                        </option>
                        {WAITLIST_ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ArrowRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Primary Challenge
                    </label>
                    <textarea
                      rows={3}
                      value={formData.challenge}
                      onChange={(e) =>
                        setFormData({ ...formData, challenge: e.target.value })
                      }
                      className="w-full p-6 border border-gray-100 bg-gray-50/50 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 outline-none transition-all font-medium text-gray-900 resize-none"
                      placeholder="What's the hardest part about your records today?"
                    />
                  </div>
                </div>

                <PrimaryButton
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-indigo-200 transition-all duration-300 flex items-center justify-center gap-4 hover:scale-[1.02]"
                  rightIcon={
                    !isSubmitting && <ArrowRight className="w-5 h-5" />
                  }
                >
                  {isSubmitting ? 'Securing Access...' : 'Reserve Access'}
                </PrimaryButton>
              </form>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
