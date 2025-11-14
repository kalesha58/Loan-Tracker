import React from 'react';

import { useNavigate } from 'react-router-dom';
import Modal from '../../../components/ui/Modal';
import Icon from '../../../components/ui/AppIcon';

interface IAddLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ILoanType {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  route: string;
}

const AddLoanModal: React.FC<IAddLoanModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const loanTypes: ILoanType[] = [
    {
      id: 'personal',
      name: 'Personal',
      icon: 'User',
      description: 'Personal loans for individual needs and expenses',
      color: '#2563EB',
      gradientFrom: '#3B82F6',
      gradientTo: '#2563EB',
      route: '/personal-loans/add'
    },
    {
      id: 'vehicle',
      name: 'Vehicle',
      icon: 'Car',
      description: 'Auto loans for cars, bikes, and vehicles',
      color: '#10B981',
      gradientFrom: '#34D399',
      gradientTo: '#10B981',
      route: '/vehicle-loans/add'
    },
    {
      id: 'business',
      name: 'Business',
      icon: 'Building',
      description: 'Business loans for enterprises and startups',
      color: '#F59E0B',
      gradientFrom: '#FBBF24',
      gradientTo: '#F59E0B',
      route: '/business-loans/add'
    },
    {
      id: 'medical',
      name: 'Medical',
      icon: 'Heart',
      description: 'Medical loans for healthcare and treatment expenses',
      color: '#EF4444',
      gradientFrom: '#F87171',
      gradientTo: '#EF4444',
      route: '/personal-loans/add?type=medical'
    }
  ];

  const handleLoanTypeSelect = (route: string) => {
    onClose();
    navigate(route);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Loan Type"
      size="md"
    >
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground dark:text-slate-400">
            Choose the type of loan you want to add
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {loanTypes.map((loanType) => (
            <button
              key={loanType.id}
              type="button"
              onClick={() => handleLoanTypeSelect(loanType.route)}
              className="group relative p-4 rounded-xl border border-border/50 dark:border-slate-700/50 bg-gradient-to-br from-card to-card/50 dark:from-slate-800/50 dark:to-slate-800/30 hover:border-primary/50 dark:hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/20 transition-all duration-300 text-left overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${loanType.gradientFrom}, ${loanType.gradientTo})`
                }}
              />
              
              {/* Content */}
              <div className="relative z-10 flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${loanType.gradientFrom}, ${loanType.gradientTo})`
                  }}
                >
                  <Icon
                    name={loanType.icon as any}
                    size={22}
                    className="text-white"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-foreground dark:text-slate-100 mb-1 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                    {loanType.name}
                  </h3>
                  <p className="text-xs text-muted-foreground dark:text-slate-400 leading-snug">
                    {loanType.description}
                  </p>
                </div>
                <Icon
                  name="ChevronRight"
                  size={18}
                  className="text-muted-foreground dark:text-slate-400 group-hover:text-primary dark:group-hover:text-blue-400 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0"
                />
              </div>

              {/* Decorative Corner Element */}
              <div
                className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle, ${loanType.color} 0%, transparent 70%)`
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default AddLoanModal;

