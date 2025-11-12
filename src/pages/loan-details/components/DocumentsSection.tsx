import React, { useState } from 'react';

import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/Button';
import { LoanDocument } from '../types';

interface DocumentsSectionProps {
  documents: LoanDocument[];
  onUpload: (files: FileList) => void;
  onReplace: (documentId: string, file: File) => void;
  onDelete: (documentId: string) => void;
}

const DocumentsSection = ({ documents, onUpload, onReplace, onDelete }: DocumentsSectionProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<LoanDocument | null>(null);

  const getDocumentIcon = (type: string) => {
    if (type.includes('pdf')) return 'FileText';
    if (type.includes('image')) return 'Image';
    if (type.includes('word')) return 'FileText';
    return 'File';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-success bg-success/10 border-success/20';
      case 'pending':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'rejected':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Icon name="Upload" size={40} className="sm:w-12 sm:h-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
        <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">
          Upload Documents
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
          Drag and drop files here, or click to browse
        </p>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button variant="outline" iconName="Plus" iconPosition="left">
            Choose Files
          </Button>
        </label>
        <p className="text-xs text-muted-foreground mt-2">
          Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
        </p>
      </div>

      {/* Documents List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {documents.map((document) => (
          <div
            key={document.id}
            className="border border-border rounded-lg p-3 sm:p-4 hover:shadow-card transition-shadow cursor-pointer"
            onClick={() => setSelectedDocument(document)}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={getDocumentIcon(document.type)} size={20} className="text-muted-foreground" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                  <h4 className="font-medium text-sm sm:text-base text-foreground truncate">
                    {document.name}
                  </h4>
                  <div className={`px-2 py-0.5 sm:py-1 rounded text-xs font-medium border flex-shrink-0 ${getStatusColor(document.status)}`}>
                    {document.status}
                  </div>
                </div>
                
                <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                  {formatFileSize(document.size)} • {formatDate(document.uploadDate)}
                </p>
                
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Eye"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(document.url, '_blank');
                    }}
                    className="text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">View</span>
                    <span className="sm:hidden">View</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Download"
                    onClick={(e) => {
                      e.stopPropagation();
                      const link = document.createElement('a');
                      link.href = document.url;
                      link.download = document.name;
                      link.click();
                    }}
                    className="text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">Download</span>
                    <span className="sm:hidden">Down</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Trash2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(document.id);
                    }}
                    className="text-xs sm:text-sm text-destructive hover:text-destructive"
                  >
                    <span className="hidden sm:inline">Delete</span>
                    <span className="sm:hidden">Del</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {documents.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileX" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No Documents Uploaded
          </h3>
          <p className="text-muted-foreground">
            Upload loan documents to get started with the verification process.
          </p>
        </div>
      )}

      {/* Document Preview Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border flex-shrink-0">
              <h3 className="font-semibold text-sm sm:text-base text-foreground truncate pr-2">
                {selectedDocument.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setSelectedDocument(null)}
                className="flex-shrink-0"
              />
            </div>
            
            <div className="p-2 sm:p-4 h-64 sm:h-96 overflow-auto flex-1">
              {selectedDocument.type.includes('pdf') ? (
                <iframe
                  src={selectedDocument.url}
                  className="w-full h-full border-0"
                  title={`Preview of ${selectedDocument.name}`}
                />
              ) : (
                <img
                  src={selectedDocument.url}
                  alt={`Preview of ${selectedDocument.name}`}
                  className="max-w-full h-auto mx-auto"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsSection;

