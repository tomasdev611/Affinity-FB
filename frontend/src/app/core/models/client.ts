export interface Client {
  AccountingID: string;
  Address1: string;
  Address2: string;
  Ambulatory: string;
  CaseManagerId: number;
  CaseManagerName: string;
  City: string;
  ClientId: number;
  ClientTypeName: string;
  County: string;
  DNR: boolean;
  DateOfBirth: string;
  DonotConfirm: boolean;
  Email: string;
  Enable1500: boolean;
  FirstName: string;
  Gender: string;
  InitialContactID: number;
  LastName: string;
  LocationID: number;
  'MedicalRecord#': string;
  MiddleInit: string;
  MiddleIntial: string;
  PayorId: number;
  Phone: string;
  Physician: string;
  PhysicianName: string;
  PhysicianPhone: string;
  PrimaryDiagnosis: string;
  Priority: string;
  QuickbooksId: string;
  Reason: string;
  RefNumber: number;
  ReferralNumber: string;
  ReferredBy: string;
  ReferredByName: string;
  SSN: string;
  ServiceEndDate: string;
  ServiceStartDate: string;
  State: string;
  Status: string;
  TelophonyID: string;
  Weight: number;
  Zip: string;
  bit_Alert: boolean;
  clientTypeID: number;
  created: string;
  createdBy: string;
  diagnosisCode: string;
  enable1500: boolean;
  gstExempt: boolean;
  int_statusid: number;
  lastUpdated: string;
  locationID: string;
  notes: string;
  profile_url: string;
  ssn: string;
  str_reason: string;
  telephonyID: string;
  updatedBy: string;
}
