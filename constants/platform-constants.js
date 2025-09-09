

// Employee roles for parlour staffing
export const EMPLOYEE_ROLES = {
  OWNER: 'owner',
  MANAGER: 'manager',
  RECEPTIONIST: 'receptionist',
  CASHIER: 'cashier',
  STYLIST: 'stylist',
  BARBER: 'barber',
  BEAUTICIAN: 'beautician',
  THERAPIST: 'therapist',
  MAKEUP_ARTIST: 'makeup_artist',
  NAIL_TECHNICIAN: 'nail_technician',
  ASSISTANT: 'assistant',
  EMPLOYEE: 'employee',
};

export const EMPLOYEE_ROLE_VALUES = Object.values(EMPLOYEE_ROLES);

export const EMPLOYEE_ROLE_OPTIONS = EMPLOYEE_ROLE_VALUES.map((value) => ({
  value,
  label: value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase()),
}));