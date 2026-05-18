'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button/index';
import { Select } from '@/components/ui/Select';
import TextField from '@/components/ui/TextField/TextField';
import { db } from '@/lib/mockdb';
import { AccountType } from '@/lib/types';

interface AddBankAccountModalProps {
  entityId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddBankAccountModal({ entityId, isOpen, onClose, onSuccess }: AddBankAccountModalProps) {
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountType, setAccountType] = useState('current');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!bankName || !accountHolder || !accountNumber || !ifscCode) return;
    
    setIsSubmitting(true);
    db.addBankAccount({
      entity_id: entityId,
      bank_name: bankName,
      account_holder_name: accountHolder,
      account_number: accountNumber,
      ifsc_code: ifscCode,
      account_type: accountType as AccountType,
      is_primary: false,
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
          <h2 className="text-xl font-bold text-gray-900">Add Bank Account</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <TextField
            id="bank_name"
            label="Bank Name"
            value={bankName}
            onChange={setBankName}
            placeholder="e.g. HDFC Bank"
            required
          />
          <TextField
            id="account_holder"
            label="Account Holder Name"
            value={accountHolder}
            onChange={setAccountHolder}
            placeholder="e.g. Acme Private Limited"
            required
          />
          <TextField
            id="account_number"
            label="Account Number"
            value={accountNumber}
            onChange={setAccountNumber}
            required
          />
          <TextField
            id="ifsc_code"
            label="IFSC Code"
            value={ifscCode}
            onChange={setIfscCode}
            placeholder="e.g. HDFC0000001"
            required
          />
          <Select
            id="account_type"
            label="Account Type"
            value={accountType}
            onChange={setAccountType}
            options={[
              { value: 'current', label: 'Current Account' },
              { value: 'savings', label: 'Savings Account' },
              { value: 'cc', label: 'Cash Credit (CC)' },
            ]}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton 
            onClick={handleSubmit} 
            disabled={isSubmitting || !bankName || !accountHolder || !accountNumber || !ifscCode}
          >
            {isSubmitting ? 'Adding...' : 'Add Account'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
