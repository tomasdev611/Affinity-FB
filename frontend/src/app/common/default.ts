export const CLIENT_DEFAULT = {
  FirstName: '',
  LastName: '',
  MiddleInit: '',
  DateOfBirth: '',
  Weight: '60',
  Address1: '',
  Address2: '',
  City: '',
  County: '',
  State: '',
  Zip: '',
  CaseManagerId: '',
  Ambulatory: 'Yes',
  // PrimaryDiagnosis: '', // Unused Field
  ReferredBy: '',
  Status: 'A',
  PayorId: '', // Unused Field
  Priority: '',
  Gender: 'M',
  // QuickbooksId: '', // Unused Field
  ServiceStartDate: '',
  ServiceEndDate: '',
  ReferralNumber: '',
  Physician: '',
  // DNR: '', // Unused Field
  // PhysicianPhone: '', // Unused Field
  Phone: '',
  // 'MedicalRecord#': '', // Unused Field
  clientTypeID: '',
  // notes: '', // Unused Field
  ssn: '',

  diagnosisCode: '',
  locationID: '',

  // enable1500: '', // Unused Field
  telephonyID: '',
  // gstExempt: '', // Unused Field
  // DonotConfirm: '', // Unused Field
  // int_statusid: '', // Unused Field
  str_reason: '',
  RefNumber: '', // Unused Field. Is default 1?

  // bit_Alert: '', // Unused Field
  Email: '',
  AccountingID: '',
  InitialContactID: '',
  profile_url: '' // Unused Field
};

export const LOCKED_NUMBER_COLUMN = {
  lockPosition: true,
  valueGetter: 'node.rowIndex + 1',
  cellClass: 'locked-col',
  colId: 'locked-number',
  sortable: false,
  filter: false,
  width: 120,
  suppressNavigable: true
};

export const COMMON_OMIT_FIELD = ['created', 'createdBy', 'updatedBy', 'lastUpdated'];
