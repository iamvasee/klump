'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  XCircle
} from 'lucide-react';
import Select from './ui/Select/Select';
import styles from './TransactionPanel.module.css';

/**
 * TransactionPanel Component
 * 
 * A reusable floating panel component for handling deposit and withdrawal transactions.
 * This component provides a unified interface for both deposit and withdrawal operations
 * with support for cash and bank transfer modes.
 * 
 * @example
 * ```tsx
 * import TransactionPanel from '@/components/TransactionPanel';
 * import { useTransactionPanel } from '@/hooks/useTransactionPanel';
 * 
 * function MyComponent() {
 *   const { isOpen, transactionType, openDeposit, openWithdraw, close } = useTransactionPanel();
 *   
 *   return (
 *     <>
 *       <button onClick={openDeposit}>Deposit</button>
 *       <button onClick={openWithdraw}>Withdraw</button>
 *       
 *       <TransactionPanel
 *         isOpen={isOpen}
 *         onClose={close}
 *         initialTransactionType={transactionType}
 *       />
 *     </>
 *   );
 * }
 * ```
 * 
 * BACKEND INTEGRATION GUIDE:
 * ========================
 * 
 * 1. API ENDPOINTS REQUIRED:
 *    - GET /api/wallets - Fetch available wallets for selection
 *    - GET /api/bank-accounts - Fetch company bank accounts
 *    - POST /api/transactions/deposit - Process deposit transaction
 *    - POST /api/transactions/withdraw - Process withdrawal transaction
 * 
 * 2. DATA STRUCTURE EXPECTED:
 *    - Wallets: { id: string, walletNumber: string, memberName: string, balance: number }
 *    - Bank Accounts: { id: string, accountNumber: string, bankName: string, balance: number }
 *    - Transaction: { walletId: string, amount: number, mode: 'cash' | 'bank', bankAccountId?: string, description?: string }
 * 
 * 3. INTEGRATION STEPS:
 *    a. Replace mock data with API calls in useEffect hooks
 *    b. Add loading states for wallet and bank account fetching
 *    c. Implement error handling for API failures
 *    d. Add success/error notifications after transaction submission
 *    e. Update wallet balances after successful transactions
 * 
 * 4. SECURITY CONSIDERATIONS:
 *    - Validate transaction amounts on backend
 *    - Check wallet permissions before allowing transactions
 *    - Implement proper authentication for API calls
 *    - Add transaction logging for audit trails
 * 
 * 5. VALIDATION RULES:
 *    - Amount must be positive and within wallet limits
 *    - Bank mode requires valid bank account selection
 *    - Wallet must be active and not suspended
 *    - Sufficient balance required for withdrawals
 */

interface TransactionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialTransactionType?: 'deposit' | 'withdraw' | null;
}

interface WalletOption {
  value: string;
  label: string;
}

interface BankAccountOption {
  value: string;
  label: string;
}

export default function TransactionPanel({ 
  isOpen, 
  onClose, 
  initialTransactionType = null 
}: TransactionPanelProps) {
  // Form state management
  const [selectedTransactionType, setSelectedTransactionType] = useState<'deposit' | 'withdraw' | ''>('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [selectedMode, setSelectedMode] = useState<'cash' | 'bank' | ''>('');
  const [selectedBankAccount, setSelectedBankAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [amountError, setAmountError] = useState('');
  // TODO: BACKEND INTEGRATION - Add these state variables for API integration
  // const [loadingWallets, setLoadingWallets] = useState(false);
  // const [loadingBankAccounts, setLoadingBankAccounts] = useState(false);
  // const [submitting, setSubmitting] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // const [walletOptions, setWalletOptions] = useState<WalletOption[]>([]);
  // const [companyBankAccounts, setCompanyBankAccounts] = useState<BankAccountOption[]>([]);

  // TODO: BACKEND INTEGRATION - Replace with API calls
  // Mock data for wallets and bank accounts
  // 
  // BACKEND INTEGRATION STEPS:
  // 1. Create state for loading/error states
  // 2. Add useEffect to fetch wallets on component mount
  // 3. Add useEffect to fetch bank accounts when needed
  // 4. Handle API errors and loading states
  // 5. Transform API response to match expected format
  //
  // Example API integration:
  // const [walletOptions, setWalletOptions] = useState<WalletOption[]>([]);
  // const [loadingWallets, setLoadingWallets] = useState(false);
  // 
  // useEffect(() => {
  //   const fetchWallets = async () => {
  //     setLoadingWallets(true);
  //     try {
  //       const response = await fetch('/api/wallets');
  //       const wallets = await response.json();
  //       setWalletOptions(wallets.map(w => ({
  //         value: w.id,
  //         label: `${w.walletNumber} - ${w.memberName} (₹${w.balance.toLocaleString()})`
  //       })));
  //     } catch (error) {
  //       console.error('Failed to fetch wallets:', error);
  //       // Handle error (show notification, etc.)
  //     } finally {
  //       setLoadingWallets(false);
  //     }
  //   };
  //   fetchWallets();
  // }, []);
  
  const walletOptions: WalletOption[] = [
    { value: 'WALLET-2024-001', label: 'WALLET-2024-001 - Rajesh Kumar (₹250,000)' },
    { value: 'WALLET-2024-002', label: 'WALLET-2024-002 - Priya Sharma (₹150,000)' },
    { value: 'WALLET-2024-003', label: 'WALLET-2024-003 - Amit Patel (₹50,000)' },
    { value: 'WALLET-2024-004', label: 'WALLET-2024-004 - Sunita Singh (₹450,000)' },
  ];

  const companyBankAccounts: BankAccountOption[] = [
    { value: 'COMP-001', label: 'SBI - 1234567890 (₹1,500,000)' },
    { value: 'COMP-002', label: 'HDFC - 9876543210 (₹2,200,000)' },
    { value: 'COMP-003', label: 'ICICI - 5555666677 (₹800,000)' },
  ];

  const selectedWalletData = walletOptions.find(w => w.value === selectedWallet);
  const selectedBankData = companyBankAccounts.find(b => b.value === selectedBankAccount);

  // Amount validation
  const validateAmount = (value: string) => {
    const numValue = parseFloat(value);
    if (value === '') {
      setAmountError('');
      return true;
    }
    if (isNaN(numValue) || numValue <= 0) {
      setAmountError('Amount must be a positive number');
      return false;
    }
    if (numValue < 0.01) {
      setAmountError('Minimum amount is ₹0.01');
      return false;
    }
    if (numValue > 1000000) {
      setAmountError('Maximum amount is ₹10,00,000');
      return false;
    }
    setAmountError('');
    return true;
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    validateAmount(value);
  };

  /**
   * Handles transaction form submission
   * 
   * BACKEND INTEGRATION REQUIRED:
   * 1. Validate form data before submission
   * 2. Send API request to appropriate endpoint
   * 3. Handle success/error responses
   * 4. Show user feedback (toast notifications)
   * 5. Update parent component state if needed
   * 6. Close panel on success
   * 
   * API ENDPOINTS:
   * - Deposit: POST /api/transactions/deposit
   * - Withdraw: POST /api/transactions/withdraw
   * 
   * REQUEST PAYLOAD:
   * {
   *   walletId: string,
   *   amount: number,
   *   mode: 'cash' | 'bank',
   *   bankAccountId?: string, // Required if mode is 'bank'
   *   description?: string,
   *   transactionType: 'deposit' | 'withdraw'
   * }
   * 
   * ERROR HANDLING:
   * - Insufficient balance for withdrawals
   * - Invalid wallet or bank account
   * - Network errors
   * - Server validation errors
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: BACKEND INTEGRATION - Replace with actual API calls
    console.log('Transaction submitted:', { 
      selectedTransactionType, 
      selectedWallet, 
      selectedMode, 
      selectedBankAccount, 
      amount, 
      description 
    });
    
    // Example backend integration:
    // try {
    //   const payload = {
    //     walletId: selectedWallet,
    //     amount: parseFloat(amount),
    //     mode: selectedMode,
    //     bankAccountId: selectedMode === 'bank' ? selectedBankAccount : undefined,
    //     description: description || undefined,
    //     transactionType: selectedTransactionType
    //   };
    // 
    //   const endpoint = selectedTransactionType === 'deposit' 
    //     ? '/api/transactions/deposit' 
    //     : '/api/transactions/withdraw';
    // 
    //   const response = await fetch(endpoint, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${getAuthToken()}` // Add auth token
    //     },
    //     body: JSON.stringify(payload)
    //   });
    // 
    //   if (!response.ok) {
    //     const error = await response.json();
    //     throw new Error(error.message || 'Transaction failed');
    //   }
    // 
    //   const result = await response.json();
    //   
    //   // Show success notification
    //   showSuccessNotification(`${selectedTransactionType} successful!`);
    //   
    //   // Update parent component if needed
    //   onTransactionSuccess?.(result);
    //   
    //   // Close panel
    //   onClose();
    //   
    // } catch (error) {
    //   console.error('Transaction failed:', error);
    //   showErrorNotification(error.message || 'Transaction failed. Please try again.');
    // }
    
    // TODO: Implement transaction logic
    onClose();
  };

  // Set initial transaction type from props
  useEffect(() => {
    if (initialTransactionType) {
      setSelectedTransactionType(initialTransactionType);
    }
  }, [initialTransactionType]);

  // Reset form when panel closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedTransactionType('');
      setSelectedWallet('');
      setSelectedMode('');
      setSelectedBankAccount('');
      setAmount('');
      setDescription('');
      setAmountError('');
    }
  }, [isOpen]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen) {
        const target = event.target as Element;
        if (!target.closest('[data-transaction-panel]')) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`fixed inset-0 z-[9999] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Subtle backdrop for floating effect */}
      <div 
        className={`${styles.backdrop} ${isOpen ? styles.open : ''}`}
      />
      
      {/* Panel - Floating on right side with 1px margins on 3 sides */}
      <div 
        data-transaction-panel
        className={`${styles.panelContainer} ${isOpen ? styles.open : ''}`}
      >
        {/* Panel Header */}
        <div className={`px-6 py-4 border-b border-gray-200 ${
          selectedTransactionType === 'deposit' ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                selectedTransactionType === 'deposit' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {selectedTransactionType === 'deposit' ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedTransactionType === 'deposit' ? 'Deposit Money' : 'Withdraw Money'}
                </h2>
                <p className="text-xs text-gray-600">
                  {selectedTransactionType === 'deposit' 
                    ? 'Add funds to wallet' 
                    : 'Remove funds from wallet'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors group"
              title="Close panel"
              aria-label="Close panel"
            >
              <XCircle className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </button>
          </div>
        </div>

        {/* Panel Content */}
        <div 
          className={`${styles.panelContent} ${isOpen ? styles.open : ''}`}
        >
          <div className="space-y-6">
            {/* Transaction Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTransactionType('deposit')}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedTransactionType === 'deposit'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">Deposit</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTransactionType('withdraw')}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedTransactionType === 'withdraw'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <TrendingDown className="w-4 h-4" />
                    <span className="font-medium">Withdraw</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Wallet Selection */}
            <div>
              <Select
                label="Select Wallet"
                placeholder="Search and select wallet..."
                options={walletOptions}
                value={selectedWallet}
                onChange={setSelectedWallet}
                required
              />
              {selectedWalletData && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Available Balance</span>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{selectedWalletData.label.split('₹')[1]?.replace(')', '')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Transaction Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Transaction Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMode('cash')}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedMode === 'cash'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">Cash</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMode('bank')}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedMode === 'bank'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="font-medium">Bank</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Bank Account Selection (only if Bank mode is selected) */}
            {selectedMode === 'bank' && (
              <div>
                <Select
                  label={`Company Bank Account (${selectedTransactionType === 'deposit' ? 'Receiving' : 'Sending'} from)`}
                  placeholder="Select company bank account..."
                  options={companyBankAccounts}
                  value={selectedBankAccount}
                  onChange={setSelectedBankAccount}
                  required
                />
                {selectedBankData && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">Account Balance</span>
                      <span className="text-lg font-bold text-blue-700">
                        ₹{selectedBankData.label.split('₹')[1]?.replace(')', '')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Transaction Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium pointer-events-none">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0.00"
                    required
                    min="0.01"
                    step="0.01"
                    max="1000000"
                    className={`w-full pl-10 pr-4 py-3 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 ${
                      amountError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200'
                    }`}
                    aria-label="Transaction amount in rupees"
                    {...(amountError && { 'aria-invalid': true })}
                    aria-describedby={amountError ? 'amount-error' : undefined}
                  />
                </div>
                {amountError && (
                  <p id="amount-error" className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {amountError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={`Add a note about this ${selectedTransactionType}...`}
                  rows={3}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none hover:border-gray-300"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedTransactionType || !selectedWallet || !selectedMode || (selectedMode === 'bank' && !selectedBankAccount) || !amount || !!amountError}
                  className={`flex-1 px-4 py-3 text-white rounded-lg transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedTransactionType === 'deposit'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {/* TODO: BACKEND INTEGRATION - Add loading state */}
                  {/* {submitting ? 'Processing...' : (selectedTransactionType === 'deposit' ? 'Deposit Money' : 'Withdraw Money')} */}
                  {selectedTransactionType === 'deposit' ? 'Deposit Money' : 'Withdraw Money'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * BACKEND INTEGRATION CHECKLIST:
 * =============================
 * 
 * ✅ COMPLETED:
 * - Component structure and UI
 * - Form validation logic
 * - State management
 * - Mock data structure
 * 
 * 🔄 TODO - BACKEND INTEGRATION:
 * 
 * 1. API INTEGRATION:
 *    [ ] Replace mock wallet data with API call to GET /api/wallets
 *    [ ] Replace mock bank account data with API call to GET /api/bank-accounts
 *    [ ] Implement transaction submission to POST /api/transactions/deposit
 *    [ ] Implement transaction submission to POST /api/transactions/withdraw
 * 
 * 2. STATE MANAGEMENT:
 *    [ ] Add loading states for API calls
 *    [ ] Add error handling and display
 *    [ ] Add success notifications
 *    [ ] Add form submission loading state
 * 
 * 3. VALIDATION:
 *    [ ] Client-side validation for amount (positive numbers)
 *    [ ] Server-side validation for business rules
 *    [ ] Balance checking for withdrawals
 *    [ ] Wallet status validation
 * 
 * 4. SECURITY:
 *    [ ] Add authentication headers to API calls
 *    [ ] Implement proper error handling
 *    [ ] Add transaction logging
 *    [ ] Validate user permissions
 * 
 * 5. UX IMPROVEMENTS:
 *    [ ] Add loading spinners
 *    [ ] Add success/error toast notifications
 *    [ ] Add form reset after successful submission
 *    [ ] Add keyboard shortcuts (Enter to submit, Escape to close)
 * 
 * 6. TESTING:
 *    [ ] Unit tests for form validation
 *    [ ] Integration tests for API calls
 *    [ ] Error handling tests
 *    [ ] User interaction tests
 * 
 * 7. OPTIMIZATION:
 *    [ ] Debounce wallet search
 *    [ ] Cache wallet and bank account data
 *    [ ] Optimize re-renders
 *    [ ] Add error boundaries
 */
