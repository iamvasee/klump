'use client';

import Image from 'next/image';
import {
  AlertCircle,
  CheckCircle2,
  FileSignature,
  FileText,
  History,
  ShieldAlert,
  Building2,
  Users,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function RealitySection() {
  return (
    <section
      id="reality"
      className="relative py-32 px-6 sm:px-10 bg-[#f8fafc] overflow-hidden"
    >
      {/* Premium Background Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-red-100/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-100/50 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-24">
            <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-[900] text-gray-900 tracking-tight leading-[1.1] mb-6">
              Complexity shouldn&apos;t be
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                an operational nightmare.
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-500 max-w-3xl mx-auto font-medium">
              Managing 10 Private Limiteds, 5 LLPs, and 50+ Directors means
              critical records are scattered across WhatsApp, Telegram, PDFs,
              and fragile spreadsheets.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-stretch">
          {/* LEFT: THE CHAOS (Scattered Mess) */}
          <div className="relative flex flex-col h-full">
            <ScrollReveal delay={100} x={-30} className="flex flex-col h-full">
              <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                  <ShieldAlert className="w-3 h-3" />
                  The Current Mess
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  A multi-entity disaster waiting to happen.
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  GST filings in email threads. MCA portal passwords in WhatsApp
                  groups. Form 26AS PDFs in Telegram. When managing massive
                  portfolios, this fragmentation causes fatal confusion during
                  audits or team transitions.
                </p>
              </div>

              {/* Visualizing the Chaos (More dense & chaotic) */}
              <div className="relative flex-1 w-full perspective-1000 min-h-[480px] mt-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50/50 rounded-[3rem] border border-red-100/50 shadow-inner" />

                {/* WhatsApp Password Card */}
                <div className="absolute top-6 left-2 sm:left-6 w-64 bg-white p-4 rounded-2xl shadow-xl shadow-red-900/5 border border-red-100 transform -rotate-6 animate-float z-30">
                  <div className="flex items-center gap-3 mb-2">
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                      alt="WhatsApp"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Group: Admin &amp; Passwords
                    </span>
                  </div>
                  <div className="bg-green-50/50 p-2 rounded-xl rounded-tl-none border border-green-100/50">
                    <p className="text-xs text-gray-700 font-medium">
                      &quot;Guys, what&apos;s the MCA portal login for Singhania
                      Ventures Pvt Ltd again? The one pinned is failing.&quot;
                    </p>
                  </div>
                </div>

                {/* Telegram Documents Card */}
                <div className="absolute top-32 right-2 sm:right-6 w-72 bg-white p-4 rounded-2xl shadow-xl shadow-red-900/5 border border-red-100 transform rotate-3 animate-float-delayed z-40">
                  <div className="flex items-center gap-3 mb-2">
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
                      alt="Telegram"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Vajra Corp Compliance
                    </span>
                  </div>
                  <div className="bg-blue-50/50 p-3 rounded-xl rounded-tr-none border border-blue-100/50 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-700 font-bold">
                        FY23_GST_Returns_Final.pdf
                      </p>
                      <p className="text-[9px] text-gray-500">
                        Can someone verify if this is the filed version?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Excel Tracker Mess */}
                <div className="absolute bottom-32 left-8 sm:left-12 w-64 bg-white p-4 rounded-2xl shadow-xl shadow-red-900/5 border border-red-100 transform -rotate-3 animate-float z-20">
                  <div className="flex items-center gap-3 mb-3">
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/e/e3/Microsoft_Office_Excel_%282019%E2%80%932025%29.svg"
                      alt="Excel"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      EPFO_Payments_2023.xlsx
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex gap-2 text-[8px] font-mono text-red-500 bg-red-50 p-1 rounded">
                      <span>#REF!</span>
                      <span>Row 42</span>
                      <span>Data Missing</span>
                    </div>
                    <div className="flex gap-2 text-[8px] font-mono text-gray-400 bg-gray-50 p-1 rounded">
                      <span>Director_KYC</span>
                      <span>Pending</span>
                      <span>Overdue</span>
                    </div>
                  </div>
                </div>

                {/* Drive File Card */}
                <div className="absolute bottom-6 right-8 sm:right-16 w-72 bg-white p-4 rounded-2xl shadow-xl shadow-red-900/5 border border-red-100 transform rotate-2 animate-float-delayed z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg"
                      alt="Drive"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 uppercase tracking-wider">
                      <AlertCircle className="w-3 h-3" /> Conflicting Copies
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-[10px] text-gray-500 font-medium">
                        TDS_Form26AS_FINAL.pdf
                      </span>
                      <span className="text-[9px] text-gray-400">Oct 2023</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg border border-red-100">
                      <span className="text-[10px] text-red-700 font-bold">
                        TDS_Form26AS_ActualFinal.pdf
                      </span>
                      <span className="text-[9px] text-red-500">Nov 2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT: THE KLUMP WAY (Multi-Entity, Role-Based, Chronological) */}
          <div className="relative flex flex-col h-full">
            <ScrollReveal delay={300} x={30} className="flex flex-col h-full">
              <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                  <ShieldCheck className="w-3 h-3" />
                  The Klump Way
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Unified. Compartmentalized. Perfect Memory.
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  Manage infinite entities—Pvt Ltds, LLPs, Partnerships—from one
                  unified dashboard. Everything is strictly compartmentalized
                  with role-based access, creating an unbreakable chronological
                  history of every tax return, resolution, and KYC document.
                </p>
              </div>

              {/* Visualizing the Unified Dashboard & Timeline */}
              <div className="relative flex-1 bg-white border border-indigo-100 rounded-[2.5rem] p-6 shadow-2xl shadow-indigo-900/5 mt-auto">
                {/* Mock Multi-Entity Header */}
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-bold text-gray-900">
                        Singhania Ventures Pvt Ltd
                      </span>
                      <span className="text-[9px] text-gray-400 ml-2">
                        ▼ Switch Entity
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                      <Lock className="w-3 h-3" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">
                        Access: Full Admin
                      </span>
                    </div>
                  </div>

                  {/* Portfolio Stats */}
                  <div className="flex gap-4 px-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      <Building2 className="w-3 h-3" /> 10 Pvt Ltd
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      <Building2 className="w-3 h-3" /> 5 LLPs
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      <Users className="w-3 h-3" /> 60 Directors
                    </div>
                  </div>
                </div>

                {/* Timeline Line */}
                <div className="absolute top-[140px] bottom-10 left-[41px] sm:left-[41px] w-px bg-gradient-to-b from-indigo-100 via-indigo-200 to-indigo-50" />

                <div className="space-y-6 relative ml-1">
                  {/* Timeline Event 1: GST */}
                  <div className="flex gap-4 sm:gap-6 relative group">
                    <div className="w-8 h-8 rounded-full bg-white border-4 border-indigo-100 flex items-center justify-center shrink-0 z-10 group-hover:border-indigo-500 transition-colors">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="flex-1 bg-gray-50 hover:bg-white p-4 rounded-2xl border border-transparent hover:border-indigo-100 hover:shadow-lg transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">
                          Statutory Filing
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">
                          Oct 14, 2023
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mb-2">
                        GST Return FY23-24
                      </h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[8px] font-bold text-indigo-700">
                            CA
                          </div>
                          <span className="text-[10px] font-medium text-gray-500">
                            Filed by CA Team
                          </span>
                        </div>
                        <span className="text-[8px] font-bold bg-white border border-gray-200 px-2 py-1 rounded text-gray-500 uppercase">
                          Vajra Pvt Ltd
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Event 2: ITR */}
                  <div className="flex gap-4 sm:gap-6 relative group">
                    <div className="w-8 h-8 rounded-full bg-white border-4 border-emerald-100 flex items-center justify-center shrink-0 z-10 group-hover:border-emerald-500 transition-colors">
                      <FileSignature className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-lg transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">
                          Personal Tax
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">
                          Nov 02, 2023
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mb-2">
                        Income Tax Return (ITR-V)
                      </h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 border border-white flex items-center justify-center text-[8px] font-bold text-emerald-700">
                            RK
                          </div>
                          <span className="text-[10px] font-medium text-gray-500">
                            Rajesh Kumar (Director)
                          </span>
                        </div>
                        <span className="text-[8px] font-bold bg-red-50 text-red-600 border border-red-100 px-2 py-1 rounded flex items-center gap-1 uppercase">
                          <Lock className="w-2 h-2" /> Highly Confidential
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Event 3: TDS / EPFO */}
                  <div className="flex gap-4 sm:gap-6 relative group">
                    <div className="w-8 h-8 rounded-full bg-white border-4 border-blue-100 flex items-center justify-center shrink-0 z-10 group-hover:border-blue-500 transition-colors">
                      <History className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 bg-gray-50 hover:bg-white p-4 rounded-2xl border border-transparent hover:border-blue-100 hover:shadow-lg transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">
                          Compliance Sync
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">
                          Today
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mb-2">
                        Form 26AS (TDS) Reconciled
                      </h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium text-gray-500">
                            System Auto-Retrieved
                          </span>
                        </div>
                        <span className="text-[8px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 rounded flex items-center gap-1 uppercase">
                          <Users className="w-2 h-2" /> Auditor Access Only
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
