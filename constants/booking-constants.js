export const BOOKING_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'refunded', label: 'Refunded' },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'bkash', label: 'bKash' },
  { value: 'nagad', label: 'Nagad' },
  { value: 'bank', label: 'Bank' },
  { value: 'online', label: 'Online' },
];

export const SERVICE_TYPE_OPTIONS = [
  { value: 'in-salon', label: 'In-salon' },
  { value: 'at-home', label: 'At-home' },
];


// Transactions
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

export const TRANSACTION_TYPE_VALUES = Object.values(TRANSACTION_TYPES);

export const TRANSACTION_TYPE_OPTIONS = TRANSACTION_TYPE_VALUES.map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

export const TRANSACTION_CATEGORIES = {
  BOOKING: 'booking',
  OTHER: 'other',
  CAPITAL_INJECTION: 'capital_injection',
  OWNER_WITHDRAWAL: 'owner_withdrawal',
  REFUND: 'refund',
  SALARY: 'salary',
  PLATFORM_FEES: 'platform_fees',
  CASH_ADJUSTMENT: 'cash_adjustment',
};

export const TRANSACTION_CATEGORY_VALUES = Object.values(TRANSACTION_CATEGORIES);

export const TRANSACTION_CATEGORY_OPTIONS = [
  { value: 'booking', label: 'Booking' },
  { value: 'other', label: 'Other' },
  { value: 'capital_injection', label: 'Capital Injection' },
  { value: 'owner_withdrawal', label: 'Owner Withdrawal' },
  { value: 'refund', label: 'Refund' },
  { value: 'salary', label: 'Salary' },
  { value: 'platform_fees', label: 'Platform Fees' },
  { value: 'cash_adjustment', label: 'Cash Adjustment' },
];


