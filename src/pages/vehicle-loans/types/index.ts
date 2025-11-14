export interface IVehicleLoanFormData {
  borrowerName: string;
  phoneNumber: string;
  email: string;
  address: string;
  dateOfBirth: string;
  panNumber: string;
  vehicleType: string;
  vehicleMake: string;
  vehicleModel: string;
  yearOfManufacture: string;
  vehicleRegistrationNumber?: string;
  vehiclePrice: number;
  downPayment: number;
  loanAmount: number;
  employmentType: string;
  monthlyIncome: number;
  companyName?: string;
  interestRate: number;
  tenure: number;
  tenureUnit: 'months' | 'years';
  aadhaarCard?: File;
  panCard?: File;
  drivingLicense?: File;
  addressProof?: File;
  incomeProof?: File;
  vehicleRC?: File;
  vehicleInsurance?: File;
  vehicleInvoice?: File;
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
  drivingLicense: File | null;
  addressProof: File | null;
  incomeProof: File | null;
  vehicleRC: File | null;
  vehicleInsurance: File | null;
  vehicleInvoice: File | null;
  aadhaarFileName: string;
  panFileName: string;
  drivingLicenseFileName: string;
  addressProofFileName: string;
  incomeProofFileName: string;
  vehicleRCFileName: string;
  vehicleInsuranceFileName: string;
  vehicleInvoiceFileName: string;
}

