'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Calendar, 
  Shield, 
  Building2,
  ExternalLink,
  Eye,
  CheckCircle,
  Clock,
  Hash,
  Info,
  ChevronRight,
  Maximize2,
  Paperclip,
  EyeOff
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { GhostButton, SecondaryButton, PrimaryButton } from '@/components/ui/Button/index';
import { db } from '@/lib/mockdb';
import { Filing, Entity, Document } from '@/lib/types';
import { DOCUMENT_TYPE_LABELS } from '@/lib/constants';
import Link from 'next/link';

interface FilingDetailViewProps {
  uid: string;
  filingId: string;
}

export default function FilingDetailView({ uid, filingId }: FilingDetailViewProps) {
  const [data, setData] = useState<{ filing: Filing; entity: Entity } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<Document | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = db.getFiling(filingId);
      if (res) {
        setData(res);
        if (res.filing.files.length > 0) {
          setSelectedFile(res.filing.files[0]);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [filingId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Filing Not Found</h2>
          <SecondaryButton leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => window.history.back()}>
            Go Back
          </SecondaryButton>
        </div>
      </MainLayout>
    );
  }

  const { filing, entity } = data;

  return (
    <MainLayout breadcrumbs={[
      { label: 'Entities', href: '/entities' },
      { label: entity.short_name || entity.legal_name, href: `/entities/${uid}` },
      { label: 'Filings', href: `/entities/${uid}?tab=filings` },
      { label: filing.name, current: true }
    ]}>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-5">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{filing.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800 border border-green-200">
                    {filing.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                   <Building2 className="w-4 h-4" />
                   {entity.legal_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <SecondaryButton leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => window.history.back()}>Back to Entity</SecondaryButton>
               <PrimaryButton leftIcon={<Download className="w-4 h-4" />}>Download All Files</PrimaryButton>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Data & Files List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filing Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Filing Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</span>
                  <span className="text-sm font-bold text-gray-700">{DOCUMENT_TYPE_LABELS[filing.filing_type] || filing.filing_type}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">FY / Period</span>
                  <span className="text-sm font-bold text-gray-900">{filing.financial_year}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filing Date</span>
                  <span className="text-sm font-bold text-gray-900">{filing.filing_date}</span>
                </div>
                <div className="pt-2">
                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</p>
                   <p className="text-sm text-gray-600 leading-relaxed italic">"{filing.description || 'No additional notes.'}"</p>
                </div>
              </div>
            </div>

            {/* User Entered Data Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Filing Data</h2>
              </div>
              <div className="p-6 space-y-4">
                {filing.data && Object.entries(filing.data).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-start gap-4">
                    <span className="text-sm font-medium text-gray-500 whitespace-nowrap">{key}</span>
                    <span className="text-sm font-bold text-gray-900 text-right">{String(value)}</span>
                  </div>
                ))}
                {!filing.data && (
                  <p className="text-sm text-gray-400 italic">No custom data points recorded for this filing.</p>
                )}
              </div>
            </div>

            {/* Attached Files Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Attached Files</h2>
              </div>
              <div className="p-2 space-y-1">
                {filing.files.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                      selectedFile?.id === file.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className={`w-5 h-5 ${selectedFile?.id === file.id ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className="text-sm font-semibold truncate max-w-[150px]">{file.file_name}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedFile?.id === file.id ? 'translate-x-1' : 'opacity-0'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Document Viewer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border-8 border-slate-900 h-[800px] flex flex-col relative">
               {/* Viewer Toolbar */}
               <div className="bg-slate-800 px-6 py-4 flex items-center justify-between border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg">
                       <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold truncate max-w-xs">{selectedFile?.file_name}</p>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">In-Browser Preview</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <GhostButton size="sm" className="text-slate-300 hover:bg-slate-700" leftIcon={<Maximize2 className="w-4 h-4" />}>Full Screen</GhostButton>
                     <PrimaryButton size="sm" className="bg-blue-600" leftIcon={<Download className="w-4 h-4" />}>Download</PrimaryButton>
                  </div>
               </div>

               {/* PDF / Document Embed */}
               {selectedFile ? (
                 <div className="flex-1 bg-slate-800 relative">
                   <iframe 
                    src={`${selectedFile.file_path}#toolbar=0`} 
                    className="w-full h-full border-none"
                    title="Document Preview"
                   />
                 </div>
               ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
                    <EyeOff className="w-16 h-16 opacity-20" />
                    <p className="font-medium">Select a file to preview</p>
                 </div>
               )}
               
               {/* Watermark Overlay */}
               <div className="absolute bottom-6 right-8 pointer-events-none opacity-20 select-none">
                  <p className="text-4xl font-black text-white/10 tracking-widest uppercase -rotate-12">CLYRA SECURE</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
