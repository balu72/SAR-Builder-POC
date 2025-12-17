export interface ReportDetails {
  dateOfSending: string;
  isReplacement: boolean;
  originalReportDate?: string;
}

export interface PrincipalOfficer {
  bankName: string;
  bsrCode: string;
  fiuIndId: string;
  bankCategory: string;
  officerName: string;
  designation: string;
  addressNo: string;
  street: string;
  locality: string;
  cityDistrict: string;
  stateCountry: string;
  pinCode: string;
  telephone: string;
  fax: string;
  email: string;
}

export interface ReportingBranch {
  branchName: string;
  bsrCode: string;
  fiuIndId: string;
  addressNo: string;
  street: string;
  locality: string;
  cityDistrict: string;
  stateCountry: string;
  pinCode: string;
  telephone: string;
  fax: string;
  email: string;
}

export interface LinkedIndividual {
  name: string;
  customerId: string;
  annexure: string;
}

export interface LinkedEntity {
  name: string;
  customerId: string;
  annexure: string;
}

export interface LinkedAccount {
  accountNumber: string;
  accountHolderName: string;
  annexure: string;
}

export interface SuspiciousTransaction {
  reasonsForSuspicion: string[];
  otherReason?: string;
  groundsOfSuspicion: string[];
}

export interface ActionTaken {
  investigationDetails: string[];
}

export interface SARReportData {
  reportDetails: ReportDetails;
  principalOfficer: PrincipalOfficer;
  reportingBranch: ReportingBranch;
  linkedIndividuals: LinkedIndividual[];
  linkedEntities: LinkedEntity[];
  linkedAccounts: LinkedAccount[];
  suspiciousTransaction: SuspiciousTransaction;
  actionTaken: ActionTaken;
}
