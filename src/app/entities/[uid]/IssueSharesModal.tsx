'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button/index';
import { Select } from '@/components/ui/Select';
import { DateField } from '@/components/ui/DateField';
import TextField from '@/components/ui/TextField/TextField';
import { db } from '@/lib/mockdb';
import { Entity } from '@/lib/types';

interface IssueSharesModalProps {
  entity: Entity;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function IssueSharesModal({ entity, isOpen, onClose, onSuccess }: IssueSharesModalProps) {
  const [stakeholderId, setStakeholderId] = useState('');
  const [stakeholderType, setStakeholderType] = useState('person');
  const [shareClassId, setShareClassId] = useState('');
  const [shareCount, setShareCount] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const people = db.getPeople();
  const otherEntities = db.getEntities().filter(e => e.id !== entity.id);
  const shareClasses = entity.share_classes || [];

  const stakeholderOptions = stakeholderType === 'person' 
    ? people.map(p => ({ value: p.id, label: p.full_name }))
    : otherEntities.map(e => ({ value: e.id, label: e.legal_name }));

  const handleSubmit = () => {
    if (!stakeholderId || !shareClassId || !shareCount || !effectiveDate) return;
    
    setIsSubmitting(true);
    db.addEquityTransaction({
      entity_id: entity.id,
      share_class_id: shareClassId,
      transaction_type: 'issuance',
      to_stakeholder_id: stakeholderId,
      to_stakeholder_type: stakeholderType as 'person' | 'entity',
      share_count: parseInt(shareCount, 10),
      effective_date: effectiveDate,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Issue Shares</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <Select
            id="stakeholder_type"
            label="Stakeholder Type"
            value={stakeholderType}
            onChange={setStakeholderType}
            options={[
              { value: 'person', label: 'Individual (Person)' },
              { value: 'entity', label: 'Corporate Entity' },
            ]}
          />
          <Select
            id="stakeholder_id"
            label="Select Stakeholder"
            value={stakeholderId}
            onChange={setStakeholderId}
            options={stakeholderOptions}
            required
          />
          <Select
            id="share_class"
            label="Share Class"
            value={shareClassId}
            onChange={setShareClassId}
            options={shareClasses.map(sc => ({ value: sc.id, label: sc.name }))}
            required
          />
          <TextField
            id="share_count"
            label="Number of Shares"
            type="number"
            value={shareCount}
            onChange={setShareCount}
            placeholder="e.g. 1000"
            required
          />
          <DateField
            id="effective_date"
            label="Issuance Date"
            value={effectiveDate}
            onChange={setEffectiveDate}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton 
            onClick={handleSubmit} 
            disabled={isSubmitting || !stakeholderId || !shareClassId || !shareCount || !effectiveDate}
          >
            {isSubmitting ? 'Issuing...' : 'Issue Shares'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
