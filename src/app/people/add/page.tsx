'use client';

import React, { useState } from 'react';
import { 
  User, 
  FileText, 
  CreditCard, 
  Camera,
  Save,
  Send,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Upload,
  Plus,
  Phone,
  Mail,
  Globe,
  MapPin
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { PrimaryButton, SecondaryButton, SuccessButton, OutlineButton } from '@/components/ui/Button/index';
import TextField from '@/components/ui/TextField/TextField';
import { Select } from '@/components/ui/Select';
import { DateField } from '@/components/ui/DateField';

interface FormData {
  full_name: string;
  date_of_birth: string;
  nationality: string;
  email: string;
  pan: string;
  din: string;
}

export default function AddPersonPage() {
  const breadcrumbs = [
    { label: 'People', href: '/people' },
    { label: 'Add Person', current: true }
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    date_of_birth: '',
    nationality: 'Indian',
    email: '',
    pan: '',
    din: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    {
      id: 1,
      title: 'Basic Info',
      description: 'Name, email and contact details',
      icon: User,
      fields: ['full_name', 'email']
    },
    {
      id: 2,
      title: 'Identification',
      description: 'PAN, DIN and Nationality',
      icon: FileText,
      fields: ['pan', 'nationality']
    }
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
    console.log('Submitting person:', formData);
  };

  const getStepProgress = () => {
    return (currentStep / steps.length) * 100;
  };

  const isStepComplete = (stepId: number) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return false;
    
    return step.fields.every(field => {
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
            <h1 className="text-2xl font-bold text-gray-900">Add New Person</h1>
            <p className="text-gray-600">Add a director, partner or stakeholder to the system</p>
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
                  <h3 className="text-lg font-semibold text-gray-900">Registration Progress</h3>
                  <p className="text-sm text-gray-600">Complete all steps to add a new person</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{currentStep}</div>
                <div className="text-sm text-gray-500">of {steps.length} steps</div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm font-semibold text-blue-600">{Math.round(getStepProgress())}%</span>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 relative z-10 ${
                      currentStep === step.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                        : isStepComplete(step.id)
                        ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                        : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                    }`}>
                      {isStepComplete(step.id) ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-xs font-semibold leading-tight mb-1 ${
                      currentStep === step.id 
                        ? 'text-blue-600' 
                        : isStepComplete(step.id)
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}>
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
                  {React.createElement(steps[currentStep - 1].icon, { className: "w-6 h-6 text-blue-600" })}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {steps[currentStep - 1].title}
                  </h2>
                  <p className="text-gray-600">{steps[currentStep - 1].description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {currentStep > 1 && (
                  <SecondaryButton leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={prevStep}>
                    Previous
                  </SecondaryButton>
                )}
                
                {currentStep < steps.length ? (
                  <PrimaryButton rightIcon={<ArrowRight className="w-4 h-4" />} onClick={nextStep}>
                    Next Step
                  </PrimaryButton>
                ) : (
                  <SuccessButton 
                    leftIcon={<Send className="w-4 h-4" />} 
                    onClick={submitForApproval}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Add Person'}
                  </SuccessButton>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  id="full_name"
                  label="Full Name"
                  value={formData.full_name}
                  onChange={(v) => handleInputChange('full_name', v)}
                  placeholder="e.g. Alice Smith"
                  required
                />
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(v) => handleInputChange('email', v)}
                  placeholder="alice@example.com"
                  required
                />
                <DateField
                  id="date_of_birth"
                  label="Date of Birth"
                  value={formData.date_of_birth}
                  onChange={(v) => handleInputChange('date_of_birth', v)}
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
                  id="din"
                  label="DIN (Director Identification Number)"
                  value={formData.din}
                  onChange={(v) => handleInputChange('din', v)}
                  placeholder="01234567"
                />
                <TextField
                  id="nationality"
                  label="Nationality"
                  value={formData.nationality}
                  onChange={(v) => handleInputChange('nationality', v)}
                  placeholder="Indian"
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
