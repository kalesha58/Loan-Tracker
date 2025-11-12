import React, { useState, useCallback } from 'react';

import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/Button';

interface UploadZoneProps {
  onFileUpload: (file: File, documentId?: string) => void;
  className?: string;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
}

const UploadZone = ({ onFileUpload, className = '' }: UploadZoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgresses, setUploadProgresses] = useState<UploadProgress[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (validateFile(file)) {
        simulateUpload(file);
      }
    });
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (validateFile(file)) {
        simulateUpload(file);
      }
    });
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload PDF, DOC, DOCX, or image files.');
      return false;
    }
    
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 10MB.');
      return false;
    }
    
    return true;
  };

  const simulateUpload = (file: File) => {
    const uploadProgress: UploadProgress = {
      fileName: file.name,
      progress: 0,
      status: 'uploading'
    };

    setUploadProgresses(prev => [...prev, uploadProgress]);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgresses(prev =>
        prev.map(progress =>
          progress.fileName === file.name
            ? { ...progress, progress: Math.min(progress.progress + 10, 100) }
            : progress
        )
      );
    }, 200);

    // Complete upload after 2 seconds
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgresses(prev =>
        prev.map(progress =>
          progress.fileName === file.name
            ? { ...progress, progress: 100, status: 'complete' }
            : progress
        )
      );

      // Remove from progress list after 2 more seconds
      setTimeout(() => {
        setUploadProgresses(prev =>
          prev.filter(progress => progress.fileName !== file.name)
        );
      }, 2000);

      onFileUpload(file);
    }, 2000);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${isDragOver 
            ? 'border-primary bg-primary/5' :'border-border bg-accent/30 hover:border-primary/50'
          }
        `}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Icon name="Upload" size={32} className="text-primary" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Drop files here to upload
            </h3>
            <p className="text-muted-foreground mb-4">
              or click to browse your computer
            </p>
            
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer">
                <Icon name="FileText" size={16} className="mr-2" />
                Choose Files
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Supported formats: PDF, DOC, DOCX, JPG, PNG • Maximum size: 10MB
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadProgresses.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Uploading Files</h4>
          {uploadProgresses.map((progress) => (
            <div key={progress.fileName} className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground truncate">
                  {progress.fileName}
                </span>
                <div className="flex items-center space-x-2">
                  {progress.status === 'uploading' && (
                    <Icon name="Loader2" size={16} className="text-primary animate-spin" />
                  )}
                  {progress.status === 'complete' && (
                    <Icon name="CheckCircle" size={16} className="text-green-600" />
                  )}
                  {progress.status === 'error' && (
                    <Icon name="XCircle" size={16} className="text-red-600" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {progress.progress}%
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-accent rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    progress.status === 'complete' ? 'bg-green-500' :
                    progress.status === 'error' ? 'bg-red-500' : 'bg-primary'
                  }`}
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadZone;

