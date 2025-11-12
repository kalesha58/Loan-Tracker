import React from 'react';

import Icon from '../../../components/ui/AppIcon';
import { WorkflowStep } from '../types';

interface WorkflowTimelineProps {
  steps: WorkflowStep[];
}

const WorkflowTimeline = ({ steps }: WorkflowTimelineProps) => {
  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'current':
        return 'Clock';
      case 'pending':
        return 'Circle';
      default:
        return 'Circle';
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10 border-success/20';
      case 'current':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'pending':
        return 'text-muted-foreground bg-muted border-border';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getConnectorColor = (currentStatus: string, nextStatus: string) => {
    if (currentStatus === 'completed') {
      return 'bg-success';
    }
    if (currentStatus === 'current' && nextStatus === 'pending') {
      return 'bg-gradient-to-r from-primary to-muted';
    }
    return 'bg-muted';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Icon name="GitBranch" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Loan Workflow</h2>
      </div>

      {/* Desktop Timeline */}
      <div className="hidden md:block">
        <div className="relative">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center relative">
                {/* Step Circle */}
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStepColor(step.status)}`}>
                  <Icon name={getStepIcon(step.status)} size={20} />
                </div>

                {/* Step Content */}
                <div className="mt-4 text-center max-w-32">
                  <h3 className="font-medium text-sm text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {step.description}
                  </p>
                  {step.completedDate && (
                    <p className="text-xs text-success font-medium">
                      {formatDate(step.completedDate)}
                    </p>
                  )}
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div 
                    className={`absolute top-6 left-12 w-full h-0.5 ${getConnectorColor(step.status, steps[index + 1].status)}`}
                    style={{ width: 'calc(100vw / 4 - 3rem)' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="md:hidden space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-4 relative">
            {/* Step Circle */}
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${getStepColor(step.status)}`}>
              <Icon name={getStepIcon(step.status)} size={16} />
            </div>

            {/* Step Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground mb-1">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {step.description}
              </p>
              {step.completedDate && (
                <p className="text-sm text-success font-medium">
                  Completed: {formatDate(step.completedDate)}
                </p>
              )}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="absolute left-9 mt-10 w-0.5 h-8 bg-muted" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowTimeline;

