import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Helmet } from 'react-helmet';

import Header from '../../../components/ui/Header';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/ui/AppIcon';
import { IVehicleLoanFormData, IOTPVerificationState, IFileUploadState } from '../types';
import { Loan } from '../../loans-list/types';
import { generateLoanPDF } from '../../../utils/pdfGenerator';
import { handleLogout as logout } from '../../../utils/auth';

const AddVehicleLoanPage = () => {
  const navigate = useNavigate();
  const [otpState, setOtpState] = useState<IOTPVerificationState>({
    otpSent: false,
    otpVerified: false,
    otpCode: '',
    isVerifying: false
  });

  const [fileUploads, setFileUploads] = useState<IFileUploadState>({
    aadhaarCard: null,
    panCard: null,
    drivingLicense: null,
    addressProof: null,
    incomeProof: null,
    vehicleRC: null,
    vehicleInsurance: null,
    vehicleInvoice: null,
    aadhaarFileName: '',
    panFileName: '',
    drivingLicenseFileName: '',
    addressProofFileName: '',
    incomeProofFileName: '',
    vehicleRCFileName: '',
    vehicleInsuranceFileName: '',
    vehicleInvoiceFileName: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock user data
  const currentUser = {
    name: "Sarah Johnson",
    email: "sarah.johnson@loantracker.com",
    role: "Loan Officer"
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<IVehicleLoanFormData>({
    defaultValues: {
      borrowerName: '',
      phoneNumber: '',
      email: '',
      address: '',
      dateOfBirth: '',
      panNumber: '',
      vehicleType: '',
      vehicleMake: '',
      vehicleModel: '',
      yearOfManufacture: '',
      vehicleRegistrationNumber: '',
      vehiclePrice: 0,
      downPayment: 0,
      loanAmount: 0,
      employmentType: '',
      monthlyIncome: 0,
      companyName: '',
      interestRate: 0,
      tenure: 0,
      tenureUnit: 'months'
    }
  });

  // Auto-calculate loan amount when vehicle price or down payment changes
  const vehiclePrice = watch('vehiclePrice');
  const downPayment = watch('downPayment');

  useEffect(() => {
    if (vehiclePrice && downPayment) {
      const calculatedLoanAmount = vehiclePrice - downPayment;
      if (calculatedLoanAmount > 0) {
        setValue('loanAmount', calculatedLoanAmount);
      }
    }
  }, [vehiclePrice, downPayment, setValue]);

  const handleSendOTP = () => {
    const phoneNumber = watch('phoneNumber');
    if (!phoneNumber || phoneNumber.length < 10) {
      return;
    }

    // Mock OTP generation
    const mockOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpState(prev => ({
      ...prev,
      otpSent: true,
      otpCode: mockOTP
    }));

    // In real scenario, this would be sent via SMS
    alert(`Mock OTP sent to ${phoneNumber}. OTP: ${mockOTP} (for testing purposes)`);
  };

  const handleVerifyOTP = () => {
    const enteredOTP = otpState.otpCode;
    if (!enteredOTP || enteredOTP.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setOtpState(prev => ({
      ...prev,
      isVerifying: true
    }));

    // Mock verification - accept any 6-digit code
    setTimeout(() => {
      setOtpState(prev => ({
        ...prev,
        otpVerified: true,
        isVerifying: false
      }));
    }, 1000);
  };

  type FileUploadKey = 'aadhaarCard' | 'panCard' | 'drivingLicense' | 'addressProof' | 'incomeProof' | 'vehicleRC' | 'vehicleInsurance' | 'vehicleInvoice';

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: FileUploadKey
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload PDF, JPG, or PNG files.');
      return;
    }

    if (file.size > maxSize) {
      alert('File too large. Maximum size is 10MB.');
      return;
    }

    const fileNameKey = `${fileType}FileName` as keyof IFileUploadState;

    setFileUploads(prev => ({
      ...prev,
      [fileType]: file,
      [fileNameKey]: file.name
    }));
  };

  const removeFile = (fileType: FileUploadKey) => {
    const fileNameKey = `${fileType}FileName` as keyof IFileUploadState;

    setFileUploads(prev => ({
      ...prev,
      [fileType]: null,
      [fileNameKey]: ''
    }));
  };

  const generateLoanId = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `LN${timestamp}${random}`;
  };

  const calculateNextDueDate = (term: number, tenureUnit: 'months' | 'years'): string => {
    const date = new Date();
    if (tenureUnit === 'years') {
      date.setMonth(date.getMonth() + (term * 12));
    } else {
      date.setMonth(date.getMonth() + term);
    }
    return date.toISOString().split('T')[0];
  };

  const onSubmit = async (data: IVehicleLoanFormData) => {
    if (!otpState.otpVerified) {
      alert('Please verify your phone number with OTP');
      return;
    }

    if (!fileUploads.aadhaarCard || !fileUploads.panCard || !fileUploads.drivingLicense || 
        !fileUploads.addressProof || !fileUploads.incomeProof) {
      alert('Please upload all required documents (Aadhaar, PAN, Driving License, Address Proof, Income Proof)');
      return;
    }

    if (data.downPayment >= data.vehiclePrice) {
      alert('Down payment cannot be greater than or equal to vehicle price');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate loan ID
      const loanId = generateLoanId();
      const createdDate = new Date().toISOString().split('T')[0];
      const nextDueDate = calculateNextDueDate(data.tenure, data.tenureUnit);

      // Create loan object
      const newLoan: Loan = {
        id: loanId,
        borrowerName: data.borrowerName,
        borrowerEmail: data.email,
        borrowerPhone: data.phoneNumber,
        borrowerAddress: data.address,
        loanType: 'Vehicle',
        amount: data.loanAmount,
        status: 'Initiated',
        nextDueDate: nextDueDate,
        interestRate: data.interestRate,
        term: data.tenureUnit === 'years' ? data.tenure * 12 : data.tenure,
        createdDate: createdDate
      };

      // Save to localStorage
      const existingLoans = localStorage.getItem('vehicleLoans');
      const loans: Loan[] = existingLoans ? JSON.parse(existingLoans) : [];
      loans.push(newLoan);
      localStorage.setItem('vehicleLoans', JSON.stringify(loans));

      // Generate and download PDF
      generateLoanPDF({
        loan: newLoan,
        formData: data as any
      });

      // Reset form
      reset();
      setOtpState({
        otpSent: false,
        otpVerified: false,
        otpCode: '',
        isVerifying: false
      });
      setFileUploads({
        aadhaarCard: null,
        panCard: null,
        drivingLicense: null,
        addressProof: null,
        incomeProof: null,
        vehicleRC: null,
        vehicleInsurance: null,
        vehicleInvoice: null,
        aadhaarFileName: '',
        panFileName: '',
        drivingLicenseFileName: '',
        addressProofFileName: '',
        incomeProofFileName: '',
        vehicleRCFileName: '',
        vehicleInsuranceFileName: '',
        vehicleInvoiceFileName: ''
      });

      alert('Vehicle loan application submitted successfully! PDF has been downloaded.');
      navigate('/loans-list');
    } catch (error) {
      alert('An error occurred while submitting the loan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout(navigate);
  };

  const tenureUnitOptions = [
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' }
  ];

  const vehicleTypeOptions = [
    { value: 'car', label: 'Car' },
    { value: 'bike', label: 'Bike/Motorcycle' },
    { value: 'scooter', label: 'Scooter' },
    { value: 'commercial_vehicle', label: 'Commercial Vehicle' },
    { value: 'truck', label: 'Truck' },
    { value: 'other', label: 'Other' }
  ];

  const employmentTypeOptions = [
    { value: 'salaried', label: 'Salaried' },
    { value: 'self_employed', label: 'Self-Employed' },
    { value: 'business', label: 'Business' },
    { value: 'professional', label: 'Professional' }
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString()
  }));

  return (
    <>
      <Helmet>
        <title>Add Vehicle Loan - LoanTracker</title>
        <meta name="description" content="Add a new vehicle loan application" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header user={currentUser} onLogout={handleLogout} />
        
        <main className="pt-16">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <Breadcrumb />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-foreground">
                    Add Vehicle Loan
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Fill in the details to create a new vehicle loan application
                  </p>
                </div>
                <Button
                  variant="outline"
                  iconName="ArrowLeft"
                  iconPosition="left"
                  onClick={() => navigate('/loans-list')}
                >
                  Back to List
                </Button>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-card rounded-xl border border-border/50 shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
                {/* Borrower Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                    Borrower Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Borrower Name"
                      required
                      {...register('borrowerName', {
                        required: 'Borrower name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      })}
                      error={errors.borrowerName?.message}
                      placeholder="Enter borrower name"
                    />

                    <Input
                      label="Date of Birth"
                      type="date"
                      required
                      {...register('dateOfBirth', {
                        required: 'Date of birth is required',
                        validate: (value) => {
                          const dob = new Date(value);
                          const today = new Date();
                          const age = today.getFullYear() - dob.getFullYear();
                          if (age < 18) {
                            return 'You must be at least 18 years old';
                          }
                          if (age > 100) {
                            return 'Please enter a valid date of birth';
                          }
                          return true;
                        }
                      })}
                      error={errors.dateOfBirth?.message}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number"
                      type="tel"
                      required
                      {...register('phoneNumber', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Please enter a valid 10-digit phone number'
                        }
                      })}
                      error={errors.phoneNumber?.message}
                      placeholder="Enter 10-digit phone number"
                    />

                    <Input
                      label="Email"
                      type="email"
                      required
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      error={errors.email?.message}
                      placeholder="Enter email address"
                    />
                  </div>

                  {/* OTP Verification */}
                  <div className="space-y-2">
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Input
                          label="OTP Verification"
                          type="text"
                          maxLength={6}
                          value={otpState.otpCode}
                          onChange={(e) => setOtpState(prev => ({ ...prev, otpCode: e.target.value }))}
                          placeholder="Enter 6-digit OTP"
                          disabled={!otpState.otpSent || otpState.otpVerified}
                          error={
                            otpState.otpSent && !otpState.otpVerified
                              ? 'Please verify OTP'
                              : undefined
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={otpState.otpSent ? handleVerifyOTP : handleSendOTP}
                        disabled={!watch('phoneNumber') || watch('phoneNumber')?.length < 10 || otpState.isVerifying || otpState.otpVerified}
                        loading={otpState.isVerifying}
                        className="mb-0"
                      >
                        {otpState.otpSent ? 'Verify OTP' : 'Send OTP'}
                      </Button>
                    </div>
                    {otpState.otpVerified && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Icon name="CheckCircle" size={16} />
                        <span>Phone number verified successfully</span>
                      </div>
                    )}
                    {otpState.otpSent && !otpState.otpVerified && (
                      <p className="text-xs text-muted-foreground">
                        Enter any 6-digit code to verify (mock verification)
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Address <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      {...register('address', {
                        required: 'Address is required',
                        minLength: {
                          value: 10,
                          message: 'Address must be at least 10 characters'
                        }
                      })}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter complete address"
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <Input
                    label="PAN Number"
                    required
                    {...register('panNumber', {
                      required: 'PAN number is required',
                      pattern: {
                        value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                        message: 'Please enter a valid PAN number (e.g., ABCDE1234F)'
                      }
                    })}
                    error={errors.panNumber?.message}
                    placeholder="Enter PAN number"
                    className="uppercase"
                  />
                </div>

                {/* Vehicle Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                    Vehicle Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="vehicleType"
                      control={control}
                      rules={{ required: 'Vehicle type is required' }}
                      render={({ field }) => (
                        <Select
                          label="Vehicle Type"
                          required
                          options={vehicleTypeOptions}
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.vehicleType?.message}
                        />
                      )}
                    />

                    <Input
                      label="Vehicle Make (Brand)"
                      required
                      {...register('vehicleMake', {
                        required: 'Vehicle make is required'
                      })}
                      error={errors.vehicleMake?.message}
                      placeholder="e.g., Maruti, Honda, Hero"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Vehicle Model"
                      required
                      {...register('vehicleModel', {
                        required: 'Vehicle model is required'
                      })}
                      error={errors.vehicleModel?.message}
                      placeholder="e.g., Swift, Activa, Splendor"
                    />

                    <Controller
                      name="yearOfManufacture"
                      control={control}
                      rules={{ required: 'Year of manufacture is required' }}
                      render={({ field }) => (
                        <Select
                          label="Year of Manufacture"
                          required
                          options={yearOptions}
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.yearOfManufacture?.message}
                        />
                      )}
                    />
                  </div>

                  <Input
                    label="Vehicle Registration Number (if already registered)"
                    {...register('vehicleRegistrationNumber')}
                    error={errors.vehicleRegistrationNumber?.message}
                    placeholder="e.g., MH12AB1234"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Vehicle Price/Ex-showroom Price (₹)"
                      type="number"
                      required
                      {...register('vehiclePrice', {
                        required: 'Vehicle price is required',
                        min: {
                          value: 50000,
                          message: 'Minimum vehicle price is ₹50,000'
                        },
                        valueAsNumber: true
                      })}
                      error={errors.vehiclePrice?.message}
                      placeholder="Enter vehicle price"
                    />

                    <Input
                      label="Down Payment (₹)"
                      type="number"
                      required
                      {...register('downPayment', {
                        required: 'Down payment is required',
                        min: {
                          value: 0,
                          message: 'Down payment cannot be negative'
                        },
                        validate: (value) => {
                          const vehiclePrice = watch('vehiclePrice');
                          if (value >= vehiclePrice) {
                            return 'Down payment must be less than vehicle price';
                          }
                          return true;
                        },
                        valueAsNumber: true
                      })}
                      error={errors.downPayment?.message}
                      placeholder="Enter down payment"
                    />
                  </div>

                  <div className="p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Loan Amount (Auto-calculated):</span>
                      <span className="text-lg font-bold text-primary">
                        ₹{watch('loanAmount')?.toLocaleString('en-IN') || '0'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Vehicle Price - Down Payment = Loan Amount
                    </p>
                  </div>
                </div>

                {/* Employment & Income Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                    Employment & Income Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="employmentType"
                      control={control}
                      rules={{ required: 'Employment type is required' }}
                      render={({ field }) => (
                        <Select
                          label="Employment Type"
                          required
                          options={employmentTypeOptions}
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.employmentType?.message}
                        />
                      )}
                    />

                    {watch('employmentType') === 'salaried' && (
                      <Input
                        label="Company Name"
                        required
                        {...register('companyName', {
                          required: watch('employmentType') === 'salaried' ? 'Company name is required' : false
                        })}
                        error={errors.companyName?.message}
                        placeholder="Enter company name"
                      />
                    )}
                  </div>

                  <Input
                    label="Monthly Income (₹)"
                    type="number"
                    required
                    {...register('monthlyIncome', {
                      required: 'Monthly income is required',
                      min: {
                        value: 15000,
                        message: 'Minimum monthly income should be ₹15,000'
                      },
                      valueAsNumber: true
                    })}
                    error={errors.monthlyIncome?.message}
                    placeholder="Enter monthly income"
                  />
                </div>

                {/* Loan Details Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                    Loan Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Interest Rate (%)"
                      type="number"
                      step="0.1"
                      required
                      {...register('interestRate', {
                        required: 'Interest rate is required',
                        min: {
                          value: 0.1,
                          message: 'Interest rate must be greater than 0'
                        },
                        max: {
                          value: 30,
                          message: 'Interest rate cannot exceed 30%'
                        },
                        valueAsNumber: true
                      })}
                      error={errors.interestRate?.message}
                      placeholder="Enter interest rate"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Tenure"
                        type="number"
                        required
                        {...register('tenure', {
                          required: 'Tenure is required',
                          min: {
                            value: 1,
                            message: 'Tenure must be at least 1'
                          },
                          max: {
                            value: 84,
                            message: 'Maximum tenure is 84 months (7 years)'
                          },
                          valueAsNumber: true
                        })}
                        error={errors.tenure?.message}
                        placeholder="Enter tenure"
                      />

                      <Controller
                        name="tenureUnit"
                        control={control}
                        rules={{ required: 'Tenure unit is required' }}
                        render={({ field }) => (
                          <Select
                            label="Unit"
                            required
                            options={tenureUnitOptions}
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.tenureUnit?.message}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Document Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                    Document Upload
                  </h3>

                  <div className="space-y-4">
                    {/* Aadhaar Card */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Aadhaar Card <span className="text-destructive">*</span>
                      </label>
                      {fileUploads.aadhaarFileName ? (
                        <div className="flex items-center justify-between p-3 border border-border rounded-md bg-muted/30">
                          <div className="flex items-center gap-2">
                            <Icon name="FileText" size={20} className="text-primary" />
                            <span className="text-sm text-foreground">{fileUploads.aadhaarFileName}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile('aadhaarCard')}
                            iconName="X"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-border rounded-md p-4">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, 'aadhaarCard')}
                            className="hidden"
                            id="aadhaar-upload"
                          />
                          <label
                            htmlFor="aadhaar-upload"
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            <Icon name="Upload" size={32} className="text-muted-foreground mb-2" />
                            <span className="text-sm text-foreground mb-1">Click to upload Aadhaar Card</span>
                            <span className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 10MB)</span>
                          </label>
                        </div>
                      )}
                    </div>

                    {/* PAN Card */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        PAN Card <span className="text-destructive">*</span>
                      </label>
                      {fileUploads.panFileName ? (
                        <div className="flex items-center justify-between p-3 border border-border rounded-md bg-muted/30">
                          <div className="flex items-center gap-2">
                            <Icon name="FileText" size={20} className="text-primary" />
                            <span className="text-sm text-foreground">{fileUploads.panFileName}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile('panCard')}
                            iconName="X"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-border rounded-md p-4">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, 'panCard')}
                            className="hidden"
                            id="pan-upload"
                          />
                          <label
                            htmlFor="pan-upload"
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            <Icon name="Upload" size={32} className="text-muted-foreground mb-2" />
                            <span className="text-sm text-foreground mb-1">Click to upload PAN Card</span>
                            <span className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 10MB)</span>
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Driving License */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Driving License <span className="text-destructive">*</span>
                      </label>
                      {fileUploads.drivingLicenseFileName ? (
                        <div className="flex items-center justify-between p-3 border border-border rounded-md bg-muted/30">
                          <div className="flex items-center gap-2">
                            <Icon name="FileText" size={20} className="text-primary" />
                            <span className="text-sm text-foreground">{fileUploads.drivingLicenseFileName}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile('drivingLicense')}
                            iconName="X"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-border rounded-md p-4">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, 'drivingLicense')}
                            className="hidden"
                            id="driving-license-upload"
                          />
                          <label
                            htmlFor="driving-license-upload"
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            <Icon name="Upload" size={32} className="text-muted-foreground mb-2" />
                            <span className="text-sm text-foreground mb-1">Click to upload Driving License</span>
                            <span className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 10MB)</span>
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Address Proof */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Address Proof <span className="text-destructive">*</span>
                      </label>
                      {fileUploads.addressProofFileName ? (
                        <div className="flex items-center justify-between p-3 border border-border rounded-md bg-muted/30">
                          <div className="flex items-center gap-2">
                            <Icon name="FileText" size={20} className="text-primary" />
                            <span className="text-sm text-foreground">{fileUploads.addressProofFileName}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile('addressProof')}
                            iconName="X"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-border rounded-md p-4">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, 'addressProof')}
                            className="hidden"
                            id="address-proof-upload"
                          />
                          <label
                            htmlFor="address-proof-upload"
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            <Icon name="Upload" size={32} className="text-muted-foreground mb-2" />
                            <span className="text-sm text-foreground mb-1">Click to upload Address Proof</span>
                            <span className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 10MB)</span>
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Income Proof */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Income Proof (Salary Slip/Bank Statement) <span className="text-destructive">*</span>
                      </label>
                      {fileUploads.incomeProofFileName ? (
                        <div className="flex items-center justify-between p-3 border border-border rounded-md bg-muted/30">
                          <div className="flex items-center gap-2">
                            <Icon name="FileText" size={20} className="text-primary" />
                            <span className="text-sm text-foreground">{fileUploads.incomeProofFileName}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile('incomeProof')}
                            iconName="X"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-border rounded-md p-4">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, 'incomeProof')}
                            className="hidden"
                            id="income-proof-upload"
                          />
                          <label
                            htmlFor="income-proof-upload"
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            <Icon name="Upload" size={32} className="text-muted-foreground mb-2" />
                            <span className="text-sm text-foreground mb-1">Click to upload Income Proof</span>
                            <span className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 10MB)</span>
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Vehicle RC */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Vehicle RC (Registration Certificate) {watch('vehicleRegistrationNumber') && <span className="text-destructive">*</span>}
                      </label>
                      {fileUploads.vehicleRCFileName ? (
                        <div className="flex items-center justify-between p-3 border border-border rounded-md bg-muted/30">
                          <div className="flex items-center gap-2">
                            <Icon name="FileText" size={20} className="text-primary" />
                            <span className="text-sm text-foreground">{fileUploads.vehicleRCFileName}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile('vehicleRC')}
                            iconName="X"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-border rounded-md p-4">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, 'vehicleRC')}
                            className="hidden"
                            id="vehicle-rc-upload"
                          />
                          <label
                            htmlFor="vehicle-rc-upload"
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            <Icon name="Upload" size={32} className="text-muted-foreground mb-2" />
                            <span className="text-sm text-foreground mb-1">Click to upload Vehicle RC</span>
                            <span className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 10MB)</span>
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Vehicle Insurance */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Vehicle Insurance
                      </label>
                      {fileUploads.vehicleInsuranceFileName ? (
                        <div className="flex items-center justify-between p-3 border border-border rounded-md bg-muted/30">
                          <div className="flex items-center gap-2">
                            <Icon name="FileText" size={20} className="text-primary" />
                            <span className="text-sm text-foreground">{fileUploads.vehicleInsuranceFileName}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile('vehicleInsurance')}
                            iconName="X"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-border rounded-md p-4">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, 'vehicleInsurance')}
                            className="hidden"
                            id="vehicle-insurance-upload"
                          />
                          <label
                            htmlFor="vehicle-insurance-upload"
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            <Icon name="Upload" size={32} className="text-muted-foreground mb-2" />
                            <span className="text-sm text-foreground mb-1">Click to upload Vehicle Insurance</span>
                            <span className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 10MB)</span>
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Vehicle Invoice/Quotation */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Vehicle Invoice/Quotation
                      </label>
                      {fileUploads.vehicleInvoiceFileName ? (
                        <div className="flex items-center justify-between p-3 border border-border rounded-md bg-muted/30">
                          <div className="flex items-center gap-2">
                            <Icon name="FileText" size={20} className="text-primary" />
                            <span className="text-sm text-foreground">{fileUploads.vehicleInvoiceFileName}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile('vehicleInvoice')}
                            iconName="X"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-border rounded-md p-4">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, 'vehicleInvoice')}
                            className="hidden"
                            id="vehicle-invoice-upload"
                          />
                          <label
                            htmlFor="vehicle-invoice-upload"
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            <Icon name="Upload" size={32} className="text-muted-foreground mb-2" />
                            <span className="text-sm text-foreground mb-1">Click to upload Vehicle Invoice/Quotation</span>
                            <span className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 10MB)</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/loans-list')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !otpState.otpVerified}
                    loading={isSubmitting}
                    iconName="Save"
                    iconPosition="left"
                  >
                    Submit & Generate PDF
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AddVehicleLoanPage;

