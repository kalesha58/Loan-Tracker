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
    color: number[] = textColor
  ): void => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(text, x, y);
  };

  // Helper function to add a line
  const addLine = (x1: number, y1: number, x2: number, y2: number): void => {
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.line(x1, y1, x2, y2);
  };

  // Helper function to add a section header
  const addSectionHeader = (title: string, y: number): number => {
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(14, y - 6, 182, 8, 2, 2, 'F');
    addText(title, 18, y, 12, true, [255, 255, 255]);
    return y + 8;
  };

  let yPosition = 20;

  // Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(14, 10, 182, 25, 3, 3, 'F');
  
  addText('LOAN APPLICATION SUMMARY', 105, 22, 16, true, [255, 255, 255]);
  addText('LoanTracker - Personal Loan Application', 105, 28, 10, false, [255, 255, 255]);

  yPosition = 45;

  // Loan Application Summary Section
  yPosition = addSectionHeader('LOAN APPLICATION SUMMARY', yPosition);
  
  const summaryData = [
    ['Loan ID:', loan.id],
    ['Application Date:', new Date(loan.createdDate).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })],
    ['Loan Amount:', `₹${loan.amount.toLocaleString('en-IN')}`],
    ['Interest Rate:', `${loan.interestRate}% per annum`],
    ['Loan Tenure:', `${loan.term} ${formData.tenureUnit}`],
    ['Status:', loan.status]
  ];

  summaryData.forEach(([label, value], index) => {
    const y = yPosition + (index * 8);
    addText(label, 18, y, 10, true);
    addText(String(value), 80, y, 10, false);
  });

  yPosition += summaryData.length * 8 + 10;

  // Borrower Details Section
  yPosition = addSectionHeader('BORROWER DETAILS', yPosition);

  const borrowerData = [
    ['Name:', formData.borrowerName],
    ['Phone Number:', formData.phoneNumber],
    ['Email:', formData.email],
    ['Address:', formData.address]
  ];

  borrowerData.forEach(([label, value], index) => {
    const y = yPosition + (index * 8);
    addText(label, 18, y, 10, true);
    
    // Handle long addresses with word wrap
    if (label === 'Address:' && value.length > 50) {
      const lines = doc.splitTextToSize(String(value), 120);
      doc.text(lines, 80, y);
      yPosition += (lines.length - 1) * 6;
    } else {
      addText(String(value), 80, y, 10, false);
    }
  });

  yPosition += borrowerData.length * 8 + 10;

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Terms and Conditions Section
  yPosition = addSectionHeader('TERMS AND CONDITIONS', yPosition);

  const terms = [
    '1. The loan amount, interest rate, and tenure are as specified in this document.',
    '2. The borrower agrees to repay the loan amount along with interest as per the agreed schedule.',
    '3. Late payment charges may apply if the borrower fails to make payments on time.',
    '4. The lender reserves the right to take legal action in case of default.',
    '5. All disputes shall be subject to the jurisdiction of the courts in India.',
    '6. The borrower confirms that all information provided is true and accurate.',
    '7. The lender may verify the documents and information provided by the borrower.',
    '8. The loan is subject to approval and disbursement as per the lender\'s policies.',
    '9. The borrower must maintain the required documents throughout the loan tenure.',
    '10. Any changes to the loan terms must be agreed upon in writing by both parties.'
  ];

  terms.forEach((term, index) => {
    const lines = doc.splitTextToSize(term, 175);
    doc.text(lines, 18, yPosition);
    yPosition += lines.length * 6;
    
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
  });

  yPosition += 10;

  // Signature Section
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }

  addLine(14, yPosition, 196, yPosition);
  yPosition += 15;

  addText('Borrower Signature', 18, yPosition, 10, true);
  addText('Date: _______________', 18, yPosition + 8, 9, false, darkGray);

  addText('Lender Signature', 120, yPosition, 10, true);
  addText('Date: _______________', 120, yPosition + 8, 9, false, darkGray);

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text(
      `Page ${i} of ${pageCount} | Generated on ${new Date().toLocaleDateString('en-IN')}`,
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

