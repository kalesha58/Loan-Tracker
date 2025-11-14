export interface IBusinessLoanFormData {
  businessName: string;
  contactPersonName: string;
  phoneNumber: string;
  email: string;
  businessAddress: string;
  businessType: string;
  registrationNumber: string;
  gstNumber: string;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  tenureUnit: 'months' | 'years';
  businessRegistrationDoc?: File;
  gstCertificate?: File;
  bankStatement?: File;
  otp?: string;
}

export interface IOTPVerificationState {
  otpSent: boolean;
  otpVerified: boolean;
  otpCode: string;
  isVerifying: boolean;
}

export interface IFileUploadState {
  businessRegistrationDoc: File | null;
  gstCertificate: File | null;
  bankStatement: File | null;
  businessRegistrationFileName: string;
  gstCertificateFileName: string;
  bankStatementFileName: string;
}

