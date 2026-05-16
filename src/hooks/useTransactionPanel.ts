import { useState } from 'react';

export function useTransactionPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw' | null>(null);

  const openDeposit = () => {
    setTransactionType('deposit');
    setIsOpen(true);
  };

  const openWithdraw = () => {
    setTransactionType('withdraw');
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setTransactionType(null);
  };

  return {
    isOpen,
    transactionType,
    openDeposit,
    openWithdraw,
    close
  };
}
