export interface IPersonalLoanFormData {
  borrowerName: string;
  phoneNumber: string;
  email: string;
  address: string;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  tenureUnit: 'months' | 'years';
  aadhaarCard?: File;
  panCard?: File;
  otp?: string;
}

export interface IOTPVerificationState {
  otpSent: boolean;
  otpVerified: boolean;
  otpCode: string;
  isVerifying: boolean;
}

export interface IFileUploadState {
  aadhaarCard: File | null;
  panCard: File | null;
  aadhaarFileName: string;
  panFileName: string;
}

