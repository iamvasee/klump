'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button/index';
import { Select } from '@/components/ui/Select';
import { DateField } from '@/components/ui/DateField';
import { db } from '@/lib/mockdb';
import { RelationshipRole } from '@/lib/types';

interface AddMemberModalProps {
  entityId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddMemberModal({
  entityId,
  isOpen,
  onClose,
  onSuccess,
}: AddMemberModalProps) {
  const [personId, setPersonId] = useState('');
  const [role, setRole] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const people = db.getPeople();

  const handleSubmit = () => {
    if (!personId || !role || !effectiveDate) return;

    setIsSubmitting(true);
    db.addRelationship({
      entity_id: entityId,
      person_id: personId,
      role: role as RelationshipRole,
      effective_from: effectiveDate,
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
          <h2 className="text-xl font-bold text-gray-900">
            Add Management Member
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <Select
            id="person_id"
            label="Select Person"
            value={personId}
            onChange={setPersonId}
            options={people.map((p) => ({ value: p.id, label: p.full_name }))}
            required
          />
          <Select
            id="role"
            label="Role"
            value={role}
            onChange={setRole}
            options={[
              { value: 'director', label: 'Director' },
              { value: 'managing_director', label: 'Managing Director' },
              { value: 'partner', label: 'Partner' },
              { value: 'designated_partner', label: 'Designated Partner' },
              { value: 'auditor', label: 'Auditor' },
              { value: 'company_secretary', label: 'Company Secretary' },
            ]}
            required
          />
          <DateField
            id="effective_date"
            label="Effective Date"
            value={effectiveDate}
            onChange={setEffectiveDate}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton
            onClick={handleSubmit}
            disabled={isSubmitting || !personId || !role || !effectiveDate}
          >
            {isSubmitting ? 'Adding...' : 'Add Member'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
