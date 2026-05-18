'use client';

import React, { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button/index';
import { Select } from '@/components/ui/Select';
import TextField from '@/components/ui/TextField/TextField';
import { db } from '@/lib/mockdb';
import { DocumentType } from '@/lib/types';
import { DOCUMENT_TYPE_LABELS } from '@/lib/constants';

interface UploadDocumentModalProps {
  entityId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadDocumentModal({ entityId, isOpen, onClose, onSuccess }: UploadDocumentModalProps) {
  const [documentType, setDocumentType] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!documentType || (!fileName && !file)) return;
    
    setIsSubmitting(true);
    db.addDocument({
      organisation_id: 'org_1', // Mock organization
      entity_id: entityId,
      document_type: documentType as DocumentType,
      file_name: file ? file.name : fileName,
      file_path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Mock path
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
      onClose();
    }, 800);
  };

  const docTypeOptions = Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => ({
    value: key,
    label: label as string,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <Select
            id="document_type"
            label="Document Type"
            value={documentType}
            onChange={setDocumentType}
            options={docTypeOptions}
            required
          />
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => document.getElementById('file_upload')?.click()}>
            <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max 10MB)</p>
            <input 
              id="file_upload"
              type="file" 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                  if (!fileName) setFileName(e.target.files[0].name);
                }
              }} 
            />
          </div>

          {file && (
            <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-lg flex items-center justify-between border border-blue-100">
              <span className="truncate">{file.name}</span>
              <button onClick={() => setFile(null)} className="text-blue-500 hover:text-blue-700"><X className="w-4 h-4" /></button>
            </div>
          )}

          {!file && (
            <TextField
              id="file_name"
              label="Or specify Document Name (Mock)"
              value={fileName}
              onChange={setFileName}
              placeholder="e.g. Board_Resolution_2024.pdf"
            />
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton 
            onClick={handleSubmit} 
            disabled={isSubmitting || !documentType || (!fileName && !file)}
          >
            {isSubmitting ? 'Uploading...' : 'Upload File'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
