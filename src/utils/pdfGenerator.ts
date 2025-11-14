import { jsPDF } from 'jspdf';
import { IPersonalLoanFormData } from '../pages/personal-loans/types';
import { Loan } from '../pages/loans-list/types';

interface IPDFData {
  loan: Loan;
  formData: IPersonalLoanFormData;
}

export const generateLoanPDF = (data: IPDFData): void => {
  const { loan, formData } = data;
  const doc = new jsPDF();

  // Colors
  const primaryColor = [37, 99, 235]; // Blue
  const textColor = [30, 30, 30];
  const lightGray = [240, 240, 240];
  const darkGray = [100, 100, 100];

  // Helper function to add text with styling
  const addText = (
    text: string,
    x: number,
    y: number,
    fontSize: number = 10,
    isBold: boolean = false,
    color: number[] = textColor,
    align: 'left' | 'center' | 'right' = 'left'
  ): void => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(text, x, y, { align });
  };

  // Helper function to add a line
  const addLine = (x1: number, y1: number, x2: number, y2: number, color: number[] = lightGray): void => {
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.line(x1, y1, x2, y2);
  };

  // Helper function to add a section header
  const addSectionHeader = (title: string, y: number): number => {
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(14, y - 6, 182, 8, 2, 2, 'F');
    addText(title, 18, y, 12, true, [255, 255, 255]);
    return y + 10;
  };

  // Format currency in Indian format
  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  // Format tenure properly
  const formatTenure = (): string => {
    if (formData.tenureUnit === 'years') {
      const years = formData.tenure;
      const months = years * 12;
      if (years === 1) {
        return `${years} year (${months} months)`;
      }
      return `${years} years (${months} months)`;
    } else {
      const months = formData.tenure;
      if (months === 1) {
        return `${months} month`;
      }
      return `${months} months`;
    }
  };

  let yPosition = 20;

  // Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(14, 10, 182, 28, 3, 3, 'F');
  
  addText('LOAN APPLICATION SUMMARY', 105, 24, 18, true, [255, 255, 255], 'center');
  addText('LoanTracker - Personal Loan Application', 105, 32, 11, false, [255, 255, 255], 'center');

  yPosition = 48;

  // Loan Application Summary Section
  yPosition = addSectionHeader('LOAN APPLICATION SUMMARY', yPosition);
  
  const applicationDate = new Date(loan.createdDate);
  const formattedDate = applicationDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const summaryData = [
    ['Loan ID:', loan.id],
    ['Application Date:', formattedDate],
    ['Loan Amount:', formatCurrency(loan.amount)],
    ['Interest Rate:', `${loan.interestRate}% per annum`],
    ['Loan Tenure:', formatTenure()],
    ['Status:', loan.status]
  ];

  summaryData.forEach(([label, value], index) => {
    const y = yPosition + (index * 9);
    addText(label, 18, y, 10, true);
    addText(String(value), 85, y, 10, false);
  });

  yPosition += summaryData.length * 9 + 12;

  // Borrower Details Section
  yPosition = addSectionHeader('BORROWER DETAILS', yPosition);

  const borrowerData = [
    ['Name:', formData.borrowerName],
    ['Phone Number:', formData.phoneNumber],
    ['Email:', formData.email],
    ['Address:', formData.address]
  ];

  borrowerData.forEach(([label, value], index) => {
    const y = yPosition + (index * 9);
    addText(label, 18, y, 10, true);
    
    // Handle long addresses with word wrap
    if (label === 'Address:' && value.length > 50) {
      const lines = doc.splitTextToSize(String(value), 125);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text(lines, 85, y);
      yPosition += (lines.length - 1) * 6;
    } else {
      addText(String(value), 85, y, 10, false);
    }
  });

  yPosition += borrowerData.length * 9 + 12;

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Terms and Conditions Section
  yPosition = addSectionHeader('TERMS AND CONDITIONS', yPosition);
  yPosition += 2;

  const terms = [
    '1. LOAN AMOUNT AND DISBURSEMENT:',
    '   The loan amount, interest rate, and tenure are as specified in this document. The loan amount will be disbursed to the borrower\'s registered bank account upon successful verification of all documents and completion of KYC requirements.',
    '',
    '2. REPAYMENT OBLIGATIONS:',
    '   The borrower agrees to repay the loan amount along with interest as per the agreed EMI schedule. The borrower shall make timely payments on or before the due date specified in the repayment schedule. Failure to make payments on time may result in late payment charges and impact the borrower\'s credit score.',
    '',
    '3. INTEREST RATE AND CHARGES:',
    '   The interest rate of ' + loan.interestRate + '% per annum is fixed for the entire loan tenure. Additional charges may apply including processing fees, late payment charges, prepayment charges (if applicable), and other charges as per the lender\'s policy.',
    '',
    '4. DOCUMENT VERIFICATION:',
    '   The borrower confirms that all information and documents provided (including Aadhaar Card, PAN Card, income proof, bank statements, and other KYC documents) are true, accurate, and authentic. The lender reserves the right to verify all documents and information provided by the borrower at any time during the loan tenure.',
    '',
    '5. DEFAULT AND LEGAL ACTION:',
    '   In case of default in payment of any EMI or breach of any terms and conditions, the lender reserves the right to take appropriate legal action, recover the outstanding amount along with interest and charges, and report the default to credit bureaus which may adversely affect the borrower\'s credit history.',
    '',
    '6. PREPAYMENT AND FORECLOSURE:',
    '   The borrower may prepay the loan in part or full subject to prepayment charges (if applicable) as per the lender\'s policy. The borrower must provide advance notice and follow the prescribed procedure for prepayment.',
    '',
    '7. LOAN APPROVAL AND DISBURSEMENT:',
    '   The loan is subject to approval and disbursement as per the lender\'s policies and procedures. The lender has the sole discretion to accept or reject any loan application without assigning any reason. Approval is subject to verification of documents, credit assessment, and fulfillment of all eligibility criteria.',
    '',
    '8. JURISDICTION AND DISPUTES:',
    '   All disputes, differences, or claims arising out of or in connection with this loan agreement shall be subject to the exclusive jurisdiction of the courts in India. The agreement shall be governed by the laws of India.',
    '',
    '9. CHANGE IN TERMS:',
    '   Any changes to the loan terms, interest rates, or other conditions must be agreed upon in writing by both parties. The lender may revise interest rates or charges as per regulatory guidelines with prior notice to the borrower.',
    '',
    '10. BORROWER\'S OBLIGATIONS:',
    '    The borrower must maintain the required documents throughout the loan tenure, inform the lender immediately of any change in contact details, employment status, or financial circumstances, and comply with all terms and conditions of this agreement.',
    '',
    '11. DATA PRIVACY:',
    '    The borrower consents to the collection, storage, and use of personal and financial information by the lender for processing the loan application, credit assessment, and as required by law. The lender will maintain confidentiality of the borrower\'s information as per applicable data protection laws.',
    '',
    '12. FORCE MAJEURE:',
    '    The lender shall not be liable for any delay or failure in performance of its obligations under this agreement due to circumstances beyond its reasonable control, including but not limited to natural disasters, government actions, or other force majeure events.'
  ];

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);

  terms.forEach((term) => {
    if (term === '') {
      yPosition += 3;
      return;
    }

    const lines = doc.splitTextToSize(term, 175);
    doc.text(lines, 18, yPosition);
    yPosition += lines.length * 5.5;
    
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
  });

  yPosition += 8;

  // Signature Section
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }

  addLine(14, yPosition, 196, yPosition, [200, 200, 200]);
  yPosition += 12;

  // Borrower Signature
  addText('Borrower Signature', 18, yPosition, 10, true);
  addLine(18, yPosition + 8, 90, yPosition + 8, [150, 150, 150]);
  addText('Date: _______________', 18, yPosition + 15, 9, false, darkGray);
  addText('Name: ' + formData.borrowerName, 18, yPosition + 22, 9, false, darkGray);

  // Lender Signature
  addText('Lender Signature', 120, yPosition, 10, true);
  addLine(120, yPosition + 8, 192, yPosition + 8, [150, 150, 150]);
  addText('Date: _______________', 120, yPosition + 15, 9, false, darkGray);
  addText('Authorized Signatory', 120, yPosition + 22, 9, false, darkGray);

  yPosition += 35;

  // Important Note
  doc.setFillColor(255, 248, 220);
  doc.roundedRect(14, yPosition, 182, 15, 2, 2, 'F');
  addText('IMPORTANT: This is a loan application document. The loan is subject to approval and verification.', 18, yPosition + 6, 8, false, [139, 69, 19]);
  addText('Please read all terms and conditions carefully before signing.', 18, yPosition + 12, 8, false, [139, 69, 19]);

  // Footer
  const pageCount = doc.getNumberOfPages();
  const generatedDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    addLine(14, 280, 196, 280, [220, 220, 220]);
    doc.text(
      `Page ${i} of ${pageCount} | Generated on ${generatedDate} | LoanTracker`,
      105,
      285,
      { align: 'center' }
    );
  }

  // Generate filename
  const fileName = `Personal-Loan-Application-${loan.id}-${new Date().toISOString().split('T')[0]}.pdf`;

  // Save the PDF
  doc.save(fileName);
};

