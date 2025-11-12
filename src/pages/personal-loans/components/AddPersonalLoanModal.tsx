import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/ui/AppIcon';
import { IPersonalLoanFormData, IOTPVerificationState, IFileUploadState } from '../types';
import { Loan } from '../../loans-list/types';
import { generateLoanPDF } from '../../../utils/pdfGenerator';

interface IAddPersonalLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPersonalLoanModal: React.FC<IAddPersonalLoanModalProps> = ({
  isOpen,
  onClose
}) => {
  const [otpState, setOtpState] = useState<IOTPVerificationState>({
    otpSent: false,
    otpVerified: false,
    otpCode: '',
    isVerifying: false
  });

  const [fileUploads, setFileUploads] = useState<IFileUploadState>({
    aadhaarCard: null,
    panCard: null,
    aadhaarFileName: '',
    panFileName: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch
  } = useForm<IPersonalLoanFormData>({
    defaultValues: {
      borrowerName: '',
      phoneNumber: '',
      email: '',
      address: '',
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

  const handleAadhaarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setFileUploads(prev => ({
      ...prev,
      aadhaarCard: file,
      aadhaarFileName: file.name
    }));
  };

  const handlePANUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setFileUploads(prev => ({
      ...prev,
      panCard: file,
      panFileName: file.name
    }));
  };

  const removeAadhaarFile = () => {
    setFileUploads(prev => ({
      ...prev,
      aadhaarCard: null,
      aadhaarFileName: ''
    }));
  };

  const removePANFile = () => {
    setFileUploads(prev => ({
      ...prev,
      panCard: null,
      panFileName: ''
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

  const onSubmit = async (data: IPersonalLoanFormData) => {
    if (!otpState.otpVerified) {
      alert('Please verify your phone number with OTP');
      return;
    }

    if (!fileUploads.aadhaarCard || !fileUploads.panCard) {
      alert('Please upload both Aadhaar Card and PAN Card');
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
        loanType: 'Personal',
        amount: data.loanAmount,
        status: 'Initiated',
        nextDueDate: nextDueDate,
        interestRate: data.interestRate,
        term: data.tenureUnit === 'years' ? data.tenure * 12 : data.tenure,
        createdDate: createdDate
      };

      // Save to localStorage
      const existingLoans = localStorage.getItem('personalLoans');
      const loans: Loan[] = existingLoans ? JSON.parse(existingLoans) : [];
      loans.push(newLoan);
      localStorage.setItem('personalLoans', JSON.stringify(loans));

      // Generate and download PDF
      generateLoanPDF({
        loan: newLoan,
        formData: data
      });

      // Reset form and close modal
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
        aadhaarFileName: '',
        panFileName: ''
      });

      alert('Personal loan application submitted successfully! PDF has been downloaded.');
      onClose();
    } catch (error) {
      console.error('Error submitting loan:', error);
      alert('An error occurred while submitting the loan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tenureUnitOptions = [
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Personal Loan"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  value: 10000,
                  message: 'Minimum loan amount is ₹10,000'
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
            {/* Aadhaar Card Upload */}
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
                    onClick={removeAadhaarFile}
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
                    onChange={handleAadhaarUpload}
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

            {/* PAN Card Upload */}
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
                    onClick={removePANFile}
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
                    onChange={handlePANUpload}
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
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
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
    </Modal>
  );
};

export default AddPersonalLoanModal;

