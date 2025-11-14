import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Helmet } from 'react-helmet';

import Header from '../../../components/ui/Header';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/ui/AppIcon';
import { IBusinessLoanFormData, IOTPVerificationState, IFileUploadState } from '../types';
import { Loan } from '../../loans-list/types';
import { generateLoanPDF } from '../../../utils/pdfGenerator';
import { handleLogout as logout } from '../../../utils/auth';

const AddBusinessLoanPage = () => {
  const navigate = useNavigate();
  const [otpState, setOtpState] = useState<IOTPVerificationState>({
    otpSent: false,
    otpVerified: false,
    otpCode: '',
    isVerifying: false
  });

  const [fileUploads, setFileUploads] = useState<IFileUploadState>({
    businessRegistrationDoc: null,
    gstCertificate: null,
    bankStatement: null,
    businessRegistrationFileName: '',
    gstCertificateFileName: '',
    bankStatementFileName: ''
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
    watch
  } = useForm<IBusinessLoanFormData>({
    defaultValues: {
      businessName: '',
      contactPersonName: '',
      phoneNumber: '',
      email: '',
      businessAddress: '',
      businessType: '',
      registrationNumber: '',
      gstNumber: '',
      loanAmount: 0,
      interestRate: 0,
      tenure: 0,
      tenureUnit: 'months'
    }
  });

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

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: 'businessRegistrationDoc' | 'gstCertificate' | 'bankStatement'
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

    const fileNameKey = fileType === 'businessRegistrationDoc' 
      ? 'businessRegistrationFileName'
      : fileType === 'gstCertificate'
      ? 'gstCertificateFileName'
      : 'bankStatementFileName';

    setFileUploads(prev => ({
      ...prev,
      [fileType]: file,
      [fileNameKey]: file.name
    }));
  };

  const removeFile = (fileType: 'businessRegistrationDoc' | 'gstCertificate' | 'bankStatement') => {
    const fileNameKey = fileType === 'businessRegistrationDoc' 
      ? 'businessRegistrationFileName'
      : fileType === 'gstCertificate'
      ? 'gstCertificateFileName'
      : 'bankStatementFileName';

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

  const onSubmit = async (data: IBusinessLoanFormData) => {
    if (!otpState.otpVerified) {
      alert('Please verify your phone number with OTP');
      return;
    }

    if (!fileUploads.businessRegistrationDoc || !fileUploads.gstCertificate || !fileUploads.bankStatement) {
      alert('Please upload all required documents');
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
        borrowerName: data.businessName,
        borrowerEmail: data.email,
        borrowerPhone: data.phoneNumber,
        borrowerAddress: data.businessAddress,
        loanType: 'Business',
        amount: data.loanAmount,
        status: 'Initiated',
        nextDueDate: nextDueDate,
        interestRate: data.interestRate,
        term: data.tenureUnit === 'years' ? data.tenure * 12 : data.tenure,
        createdDate: createdDate
      };

      // Save to localStorage
      const existingLoans = localStorage.getItem('businessLoans');
      const loans: Loan[] = existingLoans ? JSON.parse(existingLoans) : [];
      loans.push(newLoan);
      localStorage.setItem('businessLoans', JSON.stringify(loans));

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
        businessRegistrationDoc: null,
        gstCertificate: null,
        bankStatement: null,
        businessRegistrationFileName: '',
        gstCertificateFileName: '',
        bankStatementFileName: ''
      });

      alert('Business loan application submitted successfully! PDF has been downloaded.');
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

  const businessTypeOptions = [
    { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'llp', label: 'Limited Liability Partnership (LLP)' },
    { value: 'private_limited', label: 'Private Limited Company' },
    { value: 'public_limited', label: 'Public Limited Company' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <>
      <Helmet>
        <title>Add Business Loan - LoanTracker</title>
        <meta name="description" content="Add a new business loan application" />
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
                    Add Business Loan
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Fill in the details to create a new business loan application
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
                {/* Business Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                    Business Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Business Name"
                      required
                      {...register('businessName', {
                        required: 'Business name is required',
                        minLength: {
                          value: 2,
                          message: 'Business name must be at least 2 characters'
                        }
                      })}
                      error={errors.businessName?.message}
                      placeholder="Enter business name"
                    />

                    <Input
                      label="Contact Person Name"
                      required
                      {...register('contactPersonName', {
                        required: 'Contact person name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      })}
                      error={errors.contactPersonName?.message}
                      placeholder="Enter contact person name"
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
                      Business Address <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      {...register('businessAddress', {
                        required: 'Business address is required',
                        minLength: {
                          value: 10,
                          message: 'Address must be at least 10 characters'
                        }
                      })}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter complete business address"
                    />
                    {errors.businessAddress && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.businessAddress.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="businessType"
                      control={control}
                      rules={{ required: 'Business type is required' }}
                      render={({ field }) => (
                        <Select
                          label="Business Type"
                          required
                          options={businessTypeOptions}
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.businessType?.message}
                        />
                      )}
                    />

                    <Input
                      label="Registration Number"
                      required
                      {...register('registrationNumber', {
                        required: 'Registration number is required'
                      })}
                      error={errors.registrationNumber?.message}
                      placeholder="Enter business registration number"
                    />
                  </div>

                  <Input
                    label="GST Number"
                    required
                    {...register('gstNumber', {
                      required: 'GST number is required',
                      pattern: {
                        value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                        message: 'Please enter a valid GST number'
                      }
                    })}
                    error={errors.gstNumber?.message}
                    placeholder="Enter 15-digit GST number"
                  />
                </div>

                {/* Loan Details Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                    Loan Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Loan Amount (₹)"
                      type="number"
                      required
                      {...register('loanAmount', {
                        required: 'Loan amount is required',
                        min: {
                          value: 100000,
                          message: 'Minimum loan amount is ₹1,00,000'
                        },
                        valueAsNumber: true
                      })}
                      error={errors.loanAmount?.message}
                      placeholder="Enter loan amount"
                    />

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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          label="Tenure Unit"
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

                {/* Document Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                    Document Upload
                  </h3>

                  <div className="space-y-4">
                    {/* Business Registration Document */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Business Registration Document <span className="text-destructive">*</span>
                      </label>
                      {fileUploads.businessRegistrationFileName ? (
                        <div className="flex items-center justify-between p-3 border border-border rounded-md bg-muted/30">
                          <div className="flex items-center gap-2">
                            <Icon name="FileText" size={20} className="text-primary" />
                            <span className="text-sm text-foreground">{fileUploads.businessRegistrationFileName}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile('businessRegistrationDoc')}
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
                            onChange={(e) => handleFileUpload(e, 'businessRegistrationDoc')}
                            className="hidden"
                            id="business-registration-upload"
                          />
                          <label
                            htmlFor="business-registration-upload"
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            <Icon name="Upload" size={32} className="text-muted-foreground mb-2" />
                            <span className="text-sm text-foreground mb-1">Click to upload Business Registration Document</span>
                            <span className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 10MB)</span>
                          </label>
                        </div>
                      )}
                    </div>

                    {/* GST Certificate */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        GST Certificate <span className="text-destructive">*</span>
                      </label>
                      {fileUploads.gstCertificateFileName ? (
                        <div className="flex items-center justify-between p-3 border border-border rounded-md bg-muted/30">
                          <div className="flex items-center gap-2">
                            <Icon name="FileText" size={20} className="text-primary" />
                            <span className="text-sm text-foreground">{fileUploads.gstCertificateFileName}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile('gstCertificate')}
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
                            onChange={(e) => handleFileUpload(e, 'gstCertificate')}
                            className="hidden"
                            id="gst-certificate-upload"
                          />
                          <label
                            htmlFor="gst-certificate-upload"
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            <Icon name="Upload" size={32} className="text-muted-foreground mb-2" />
                            <span className="text-sm text-foreground mb-1">Click to upload GST Certificate</span>
                            <span className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 10MB)</span>
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Bank Statement */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Bank Statement (Last 6 months) <span className="text-destructive">*</span>
                      </label>
                      {fileUploads.bankStatementFileName ? (
                        <div className="flex items-center justify-between p-3 border border-border rounded-md bg-muted/30">
                          <div className="flex items-center gap-2">
                            <Icon name="FileText" size={20} className="text-primary" />
                            <span className="text-sm text-foreground">{fileUploads.bankStatementFileName}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile('bankStatement')}
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
                            onChange={(e) => handleFileUpload(e, 'bankStatement')}
                            className="hidden"
                            id="bank-statement-upload"
                          />
                          <label
                            htmlFor="bank-statement-upload"
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            <Icon name="Upload" size={32} className="text-muted-foreground mb-2" />
                            <span className="text-sm text-foreground mb-1">Click to upload Bank Statement</span>
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

export default AddBusinessLoanPage;

