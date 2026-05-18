'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Shield, 
  FileText, 
  Calendar, 
  CheckCircle, 
  Upload, 
  Plus, 
  Trash2,
  Building2,
  Info,
  DollarSign,
  Briefcase,
  BadgeCheck,
  FileCheck,
  ArrowRight,
  Save
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { PrimaryButton, SecondaryButton, SuccessButton, OutlineButton } from '@/components/ui/Button/index';
import TextField from '@/components/ui/TextField/TextField';
import { Select } from '@/components/ui/Select';
import { DateField } from '@/components/ui/DateField';
import { db } from '@/lib/mockdb';
import { Entity, DocumentType } from '@/lib/types';
import { DOCUMENT_TYPE_LABELS } from '@/lib/constants';

interface AddFilingViewProps {
  uid: string;
}

export default function AddFilingView({ uid }: AddFilingViewProps) {
  const [entity, setEntity] = useState<Entity | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    filing_type: '' as DocumentType | '',
    financial_year: '2024-25',
    filing_date: new Date().toISOString().split('T')[0],
    status: 'completed',
    description: '',
    data: {} as Record<string, string>,
    files: [] as File[]
  });

  useEffect(() => {
    const entityData = db.getEntity(uid);
    if (entityData) setEntity(entityData);
    setLoading(false);
  }, [uid]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDataFieldChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      data: { ...prev.data, [key]: value }
    }));
  };

  const addDataField = () => {
    const key = prompt('Enter field name (e.g., Total Tax Paid)');
    if (key) {
      handleDataFieldChange(key, '');
    }
  };

  const removeDataField = (key: string) => {
    setFormData(prev => {
      const newData = { ...prev.data };
      delete newData[key];
      return { ...prev, data: newData };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, files: [...prev.files, ...newFiles] }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Filing Created:', formData);
      setIsSubmitting(false);
      window.history.back();
    }, 1500);
  };

  if (loading) return <MainLayout><div className="flex justify-center p-20 animate-pulse text-gray-400">Loading...</div></MainLayout>;
  if (!entity) return <MainLayout><div className="p-20 text-center">Entity Not Found</div></MainLayout>;

  const filingTypes = Object.entries(DOCUMENT_TYPE_LABELS)
    .filter(([key]) => !['certificate_of_incorporation', 'llp_agreement', 'pan_card', 'aadhaar_card', 'tan_allotment', 'gst_certificate', 'moa_aoa'].includes(key))
    .map(([key, label]) => ({ value: key, label }));

  return (
    <MainLayout breadcrumbs={[
      { label: 'Entities', href: '/entities' },
      { label: entity.short_name || entity.legal_name, href: `/entities/${uid}` },
      { label: 'Add Filing', current: true }
    ]}>
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create New Filing</h1>
            <p className="text-sm text-gray-500 font-medium flex items-center gap-2 mt-1">
              <Building2 className="w-4 h-4" />
              {entity.legal_name}
            </p>
          </div>
          <SecondaryButton leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => window.history.back()}>Cancel</SecondaryButton>
        </div>

        {/* Progress Stepper */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { step: 1, label: 'Filing Basics', icon: Info },
            { step: 2, label: 'Data Points', icon: FileText },
            { step: 3, label: 'Upload Proofs', icon: Upload }
          ].map((s) => (
            <div key={s.step} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
              currentStep === s.step ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' : 
              currentStep > s.step ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-100 text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                currentStep === s.step ? 'bg-white/20' : currentStep > s.step ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {currentStep > s.step ? <CheckCircle className="w-5 h-5" /> : s.step}
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <TextField 
                      label="Filing Name" 
                      placeholder="e.g. GST Return - August 2024" 
                      value={formData.name}
                      onChange={(v) => handleInputChange('name', v)}
                      required
                    />
                  </div>
                  <Select 
                    label="Filing Type" 
                    placeholder="Select Type"
                    value={formData.filing_type}
                    options={filingTypes}
                    onChange={(v) => handleInputChange('filing_type', v)}
                    required
                  />
                  <Select 
                    label="Financial Year" 
                    value={formData.financial_year}
                    options={[
                      { value: '2024-25', label: '2024-25' },
                      { value: '2023-24', label: '2023-24' },
                      { value: '2022-23', label: '2022-23' }
                    ]}
                    onChange={(v) => handleInputChange('financial_year', v)}
                  />
                  <DateField 
                    label="Filing Date" 
                    value={formData.filing_date}
                    onChange={(v) => handleInputChange('filing_date', v)}
                    required
                  />
                  <Select 
                    label="Status" 
                    value={formData.status}
                    options={[
                      { value: 'completed', label: 'Completed' },
                      { value: 'pending', label: 'Pending' }
                    ]}
                    onChange={(v) => handleInputChange('status', v)}
                  />
                  <div className="md:col-span-2">
                    <TextField 
                      label="Description / Notes" 
                      placeholder="Optional notes about this filing..." 
                      multiline 
                      rows={3}
                      value={formData.description}
                      onChange={(v) => handleInputChange('description', v)}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Captured Data Points</h2>
                    <p className="text-sm text-gray-500">Add specific values from the filing for quick reference</p>
                  </div>
                  <OutlineButton leftIcon={<Plus className="w-4 h-4" />} onClick={addDataField}>Add Field</OutlineButton>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(formData.data).map((key) => (
                    <div key={key} className="flex items-end gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 relative group">
                      <div className="flex-1">
                        <TextField 
                          label={key} 
                          placeholder={`Enter ${key}`} 
                          value={formData.data[key]}
                          onChange={(v) => handleDataFieldChange(key, v)}
                        />
                      </div>
                      <button 
                        onClick={() => removeDataField(key)}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {Object.keys(formData.data).length === 0 && (
                    <div className="col-span-2 py-12 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                      <p className="text-gray-400 font-medium italic">No custom data fields added yet.</p>
                      <button onClick={addDataField} className="text-blue-600 font-bold text-sm mt-2 hover:underline">+ Add first field</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Upload Proofs</h2>
                  <p className="text-sm text-gray-500">Attach receipts, acknowledgements or working sheets (Max 5 files)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* File Upload Area */}
                  <div className="relative border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
                    <input 
                      type="file" 
                      multiple 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleFileChange}
                    />
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-gray-900">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, Image or Excel files</p>
                  </div>

                  {/* File List */}
                  <div className="space-y-3">
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 bg-gray-50 rounded-lg text-blue-600">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{file.name}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-black">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFile(index)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {formData.files.length === 0 && (
                      <div className="h-full flex items-center justify-center border border-gray-100 rounded-3xl bg-gray-50/30">
                        <p className="text-gray-400 text-sm italic">No files selected</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <SecondaryButton leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={prevStep}>Previous Step</SecondaryButton>
            ) : (
              <div></div>
            )}
            
            {currentStep < 3 ? (
              <PrimaryButton rightIcon={<ArrowRight className="w-4 h-4" />} onClick={nextStep}>Next Step</PrimaryButton>
            ) : (
              <SuccessButton 
                leftIcon={<Save className="w-4 h-4" />} 
                onClick={handleSubmit}
                disabled={isSubmitting || formData.name === '' || formData.filing_type === ''}
              >
                {isSubmitting ? 'Creating Filing...' : 'Create Filing Record'}
              </SuccessButton>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
