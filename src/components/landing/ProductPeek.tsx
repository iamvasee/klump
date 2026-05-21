'use client';

import React from 'react';
import {
  Building2,
  Users,
  ShieldCheck,
  ArrowUpRight,
  FileText,
  Search,
  LayoutDashboard,
  Settings,
} from 'lucide-react';
import { FullLogo } from '@/components/ui/Logo';

export default function ProductPeek() {
  return (
    <div className="relative group max-w-2xl mx-auto perspective-1000">
      {/* Glow behind the mockup */}
      <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* The Mockup Frame */}
      <div className="relative bg-white border border-gray-200 rounded-[2.5rem] shadow-2xl overflow-hidden transform group-hover:rotate-x-2 group-hover:scale-[1.01] transition-all duration-700 ease-out">
        {/* Browser Top Bar */}
        <div className="h-12 bg-gray-50 border-b border-gray-100 flex items-center px-6 gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
          </div>
          <div className="mx-auto bg-white border border-gray-200 rounded-lg px-4 py-1 text-[10px] text-gray-400 font-medium">
            klump.app/acme-corp
          </div>
        </div>

        <div className="flex h-[380px]">
          {/* Mock Sidebar */}
          <div className="w-40 border-r border-gray-100 p-4 space-y-6 hidden md:block">
            {/* Mock Logo */}
            <div className="px-1 mb-2">
              <FullLogo className="h-4 opacity-80" />
            </div>

            <div className="space-y-1.5">
              {[
                { icon: LayoutDashboard, label: 'Dashboard', active: true },
                { icon: Building2, label: 'Entities' },
                { icon: Users, label: 'People' },
                { icon: ShieldCheck, label: 'Compliance' },
                { icon: FileText, label: 'Documents' },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${item.active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-400'}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
              ))}
            </div>
            <div className="pt-20">
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-gray-400">
                <Settings className="w-4 h-4" />
                Settings
              </div>
            </div>
          </div>

          {/* Mock Content */}
          <div className="flex-1 bg-[#F8FAFC] p-8 space-y-8 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-6 w-32 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-3 w-48 bg-gray-100 rounded-lg animate-pulse" />
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-xl" />
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3"
                >
                  <div className="w-8 h-8 bg-gray-50 rounded-xl" />
                  <div className="h-4 w-12 bg-gray-200 rounded-lg" />
                  <div className="h-2 w-20 bg-gray-100 rounded-lg" />
                </div>
              ))}
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm flex-1 overflow-hidden">
              <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-gray-300" />
                  <div className="h-3 w-32 bg-gray-100 rounded-lg" />
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg" />
                  <div className="w-8 h-8 bg-gray-50 rounded-lg" />
                </div>
              </div>
              <div className="p-5 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-40 bg-gray-200 rounded-lg" />
                        <div className="h-2 w-24 bg-gray-100 rounded-lg" />
                      </div>
                    </div>
                    <div className="h-6 w-16 bg-emerald-50 rounded-full" />
                    <ArrowUpRight className="w-4 h-4 text-gray-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
