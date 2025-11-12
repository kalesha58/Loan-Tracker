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
        return {
          icon: 'text-white',
          bg: 'bg-success',
          border: 'border-success',
          ring: 'ring-success/20'
        };
      case 'current':
        return {
          icon: 'text-white',
          bg: 'bg-primary',
          border: 'border-primary',
          ring: 'ring-primary/20'
        };
      case 'pending':
        return {
          icon: 'text-muted-foreground',
          bg: 'bg-muted',
          border: 'border-border',
          ring: 'ring-transparent'
        };
      default:
        return {
          icon: 'text-muted-foreground',
          bg: 'bg-muted',
          border: 'border-border',
          ring: 'ring-transparent'
        };
    }
  };

  const getConnectorColor = (currentStatus: string, nextStatus: string) => {
    if (currentStatus === 'completed') {
      return 'bg-success';
    }
    if (currentStatus === 'current') {
      return 'bg-gradient-to-r from-primary via-primary/50 to-muted';
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
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 shadow-card">
      <div className="flex items-center gap-2 mb-6 sm:mb-8">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="GitBranch" size={18} className="text-primary" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Loan Workflow</h2>
      </div>

      {/* Desktop Timeline */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Line Background */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-muted" />
          
          {/* Progress Line Active */}
          {(() => {
            const completedCount = steps.filter(s => s.status === 'completed').length;
            const currentIndex = steps.findIndex(s => s.status === 'current');
            let progressWidth = 0;
            
            if (completedCount === steps.length) {
              progressWidth = 100;
            } else if (currentIndex >= 0) {
              progressWidth = (currentIndex / (steps.length - 1)) * 100;
            } else {
              progressWidth = (completedCount / (steps.length - 1)) * 100;
            }
            
            return (
              <div 
                className="absolute top-6 left-0 h-0.5 bg-success transition-all duration-500"
                style={{ width: `${progressWidth}%` }}
              />
            );
          })()}

          <div className="relative flex items-start justify-between">
            {steps.map((step, index) => {
              const colors = getStepColor(step.status);
              const isLast = index === steps.length - 1;
              
              return (
                <div key={step.id} className="flex flex-col items-center relative flex-1">
                  {/* Step Circle */}
                  <div className={`relative z-10 w-12 h-12 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center shadow-sm transition-all duration-300 ${step.status === 'current' ? 'ring-4 ' + colors.ring : ''}`}>
                    <Icon name={getStepIcon(step.status)} size={20} className={colors.icon} />
                    {step.status === 'completed' && (
                      <div className="absolute inset-0 rounded-full bg-success animate-ping opacity-20" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="mt-5 text-center w-full max-w-[140px]">
                    <h3 className={`font-semibold text-sm mb-1.5 ${
                      step.status === 'completed' ? 'text-foreground' : 
                      step.status === 'current' ? 'text-primary' : 
                      'text-muted-foreground'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                      {step.description}
                    </p>
                    {step.completedDate && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-success/10">
                        <Icon name="Calendar" size={12} className="text-success" />
                        <p className="text-xs text-success font-medium">
                          {formatDate(step.completedDate)}
                        </p>
                      </div>
                    )}
                    {step.status === 'current' && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 mt-2">
                        <Icon name="Clock" size={12} className="text-primary" />
                        <p className="text-xs text-primary font-medium">
                          In Progress
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="md:hidden space-y-6">
        {steps.map((step, index) => {
          const colors = getStepColor(step.status);
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step.id} className="flex items-start gap-4 relative">
              {/* Vertical Line */}
              {!isLast && (
                <div className={`absolute left-6 top-12 w-0.5 h-full ${getConnectorColor(step.status, steps[index + 1]?.status)}`} />
              )}

              {/* Step Circle */}
              <div className={`relative z-10 w-12 h-12 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 ${step.status === 'current' ? 'ring-4 ' + colors.ring : ''}`}>
                <Icon name={getStepIcon(step.status)} size={20} className={colors.icon} />
                {step.status === 'completed' && (
                  <div className="absolute inset-0 rounded-full bg-success animate-ping opacity-20" />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0 pt-1">
                <h3 className={`font-semibold text-base mb-1.5 ${
                  step.status === 'completed' ? 'text-foreground' : 
                  step.status === 'current' ? 'text-primary' : 
                  'text-muted-foreground'
                }`}>
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {step.description}
                </p>
                {step.completedDate && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-success/10">
                    <Icon name="Calendar" size={14} className="text-success" />
                    <p className="text-sm text-success font-medium">
                      {formatDate(step.completedDate)}
                    </p>
                  </div>
                )}
                {step.status === 'current' && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-primary/10 mt-2">
                    <Icon name="Clock" size={14} className="text-primary" />
                    <p className="text-sm text-primary font-medium">
                      In Progress
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowTimeline;

