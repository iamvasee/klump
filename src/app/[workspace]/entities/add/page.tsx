'use client';

import React, { useState } from 'react';
import {
  Building2,
  FileText,
  Send,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useParams } from 'next/navigation';
import {
  PrimaryButton,
  SecondaryButton,
  SuccessButton,
} from '@/components/ui/Button/index';
import TextField from '@/components/ui/TextField/TextField';
import { Select } from '@/components/ui/Select';
import { DateField } from '@/components/ui/DateField';

interface FormData {
  legal_name: string;
  short_name: string;
  entity_type: string;
  status: string;
  date_of_incorporation: string;
  state_of_incorporation: string;
  pan: string;
  cin: string;
  llpin: string;
  nature_of_business: string;
  address_line1: string;
  city: string;
  state: string;
  pin_code: string;
}

export default function AddEntityPage() {
  const params = useParams();
  const workspaceSlug = params.workspace as string;
  const breadcrumbs = [
    { label: 'Entities', href: `/${workspaceSlug}/entities` },
    { label: 'Add Entity', current: true },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    legal_name: '',
    short_name: '',
    entity_type: '',
    status: 'active',
    date_of_incorporation: '',
    state_of_incorporation: '',
    pan: '',
    cin: '',
    llpin: '',
    nature_of_business: '',
    address_line1: '',
    city: '',
    state: '',
    pin_code: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Legal name, type and incorporation details',
      icon: Building2,
      fields: ['legal_name', 'entity_type', 'date_of_incorporation'],
    },
    {
      id: 2,
      title: 'Tax & Registration',
      description: 'PAN, CIN and other statutory identifiers',
      icon: FileText,
      fields: ['pan', 'cin'],
    },
    {
      id: 3,
      title: 'Address & Location',
      description: 'Registered office address details',
      icon: MapPin,
      fields: ['address_line1', 'city', 'state', 'pin_code'],
    },
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitForApproval = () => {
    setIsSubmitting(true);
    console.log('Submitting entity:', formData);
    // In real app, call db.addEntity
  };

  const getStepProgress = () => {
    return (currentStep / steps.length) * 100;
  };

  const isStepComplete = (stepId: number) => {
    const step = steps.find((s) => s.id === stepId);
    if (!step) return false;

    return step.fields.every((field) => {
      const value = formData[field as keyof FormData];
      return value !== '' && value !== null && value !== undefined;
    });
  };

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Entity</h1>
            <p className="text-gray-600">
              Register a new company or LLP in the system
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Registration Progress
                  </h3>
                  <p className="text-sm text-gray-600">
                    Complete all steps to create a new entity
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {currentStep}
                </div>
                <div className="text-sm text-gray-500">
                  of {steps.length} steps
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Overall Progress
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {Math.round(getStepProgress())}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out`}
                  style={{
                    width: `${getStepProgress()}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className="relative mb-3">
                    {index < steps.length - 1 && (
                      <div className="absolute top-1/2 left-full w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0">
                        <div
                          className={`h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 ease-out ${
                            currentStep > step.id ? 'w-full' : 'w-0'
                          }`}
                        ></div>
                      </div>
                    )}

                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 relative z-10 ${
                        currentStep === step.id
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                          : isStepComplete(step.id)
                            ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                            : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                      }`}
                    >
                      {isStepComplete(step.id) ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <div
                      className={`text-xs font-semibold leading-tight mb-1 ${
                        currentStep === step.id
                          ? 'text-blue-600'
                          : isStepComplete(step.id)
                            ? 'text-green-600'
                            : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {React.createElement(steps[currentStep - 1].icon, {
                    className: 'w-6 h-6 text-blue-600',
                  })}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {steps[currentStep - 1].title}
                  </h2>
                  <p className="text-gray-600">
                    {steps[currentStep - 1].description}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {currentStep > 1 && (
                  <SecondaryButton
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                    onClick={prevStep}
                  >
                    Previous
                  </SecondaryButton>
                )}

                {currentStep < steps.length ? (
                  <PrimaryButton
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={nextStep}
                  >
                    Next Step
                  </PrimaryButton>
                ) : (
                  <SuccessButton
                    leftIcon={<Send className="w-4 h-4" />}
                    onClick={submitForApproval}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Register Entity'}
                  </SuccessButton>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  id="legal_name"
                  label="Legal Name"
                  value={formData.legal_name}
                  onChange={(v) => handleInputChange('legal_name', v)}
                  placeholder="e.g. Acme Private Limited"
                  required
                />
                <TextField
                  id="short_name"
                  label="Short Name"
                  value={formData.short_name}
                  onChange={(v) => handleInputChange('short_name', v)}
                  placeholder="e.g. Acme"
                />
                <Select
                  id="entity_type"
                  label="Entity Type"
                  value={formData.entity_type}
                  onChange={(v) => handleInputChange('entity_type', v)}
                  placeholder="Select type"
                  options={[
                    {
                      value: 'private_limited',
                      label: 'Private Limited Company',
                    },
                    {
                      value: 'public_limited',
                      label: 'Public Limited Company',
                    },
                    { value: 'llp', label: 'Limited Liability Partnership' },
                    { value: 'partnership', label: 'Partnership' },
                    { value: 'proprietorship', label: 'Proprietorship' },
                  ]}
                  required
                />
                <DateField
                  id="date_of_incorporation"
                  label="Date of Incorporation"
                  value={formData.date_of_incorporation}
                  onChange={(v) =>
                    handleInputChange('date_of_incorporation', v)
                  }
                  required
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  id="pan"
                  label="PAN"
                  value={formData.pan}
                  onChange={(v) => handleInputChange('pan', v)}
                  placeholder="ABCDE1234F"
                  required
                />
                <TextField
                  id="cin"
                  label="CIN"
                  value={formData.cin}
                  onChange={(v) => handleInputChange('cin', v)}
                  placeholder="U12345..."
                />
                <TextField
                  id="llpin"
                  label="LLPIN"
                  value={formData.llpin}
                  onChange={(v) => handleInputChange('llpin', v)}
                  placeholder="AAA-1234"
                />
                <TextField
                  id="nature_of_business"
                  label="Nature of Business"
                  value={formData.nature_of_business}
                  onChange={(v) => handleInputChange('nature_of_business', v)}
                  placeholder="e.g. Software Development"
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <TextField
                    id="address_line1"
                    label="Address Line 1"
                    value={formData.address_line1}
                    onChange={(v) => handleInputChange('address_line1', v)}
                    placeholder="Enter street address"
                    required
                  />
                </div>
                <TextField
                  id="city"
                  label="City"
                  value={formData.city}
                  onChange={(v) => handleInputChange('city', v)}
                  placeholder="Mumbai"
                  required
                />
                <TextField
                  id="state"
                  label="State"
                  value={formData.state}
                  onChange={(v) => handleInputChange('state', v)}
                  placeholder="Maharashtra"
                  required
                />
                <TextField
                  id="pin_code"
                  label="Pin Code"
                  value={formData.pin_code}
                  onChange={(v) => handleInputChange('pin_code', v)}
                  placeholder="400001"
                  required
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
