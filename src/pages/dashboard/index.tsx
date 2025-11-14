import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoanDistributionChart from './components/LoanDistributionChart';
import TrendChart from './components/TrendChart';
import QuickActions from './components/QuickActions';
import RecentLoansPreview from './components/RecentLoansPreview';
import { handleLogout as logout } from '../../utils/auth';
import {
  ChartData,
  TrendData,
  RecentLoan
} from './types';

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock user data
  const user = {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@loantracker.com",
    role: "Senior Loan Officer"
  };



  // Mock chart data for loan distribution
  const chartData: ChartData[] = [
    { name: "Personal", value: 4250000, color: "#2563EB" },
    { name: "Vehicle", value: 3720000, color: "#10B981" },
    { name: "Business", value: 3375000, color: "#F59E0B" },
    { name: "Medical", value: 1155000, color: "#EF4444" }
  ];

  // Mock trend data for monthly repayments
  const trendData: TrendData[] = [
    { month: "Jan", amount: 850000 },
    { month: "Feb", amount: 920000 },
    { month: "Mar", amount: 1100000 },
    { month: "Apr", amount: 980000 },
    { month: "May", amount: 1250000 },
    { month: "Jun", amount: 1180000 },
    { month: "Jul", amount: 1350000 },
    { month: "Aug", amount: 1420000 },
    { month: "Sep", amount: 1280000 },
    { month: "Oct", amount: 1480000 },
    { month: "Nov", amount: 1520000 },
    { month: "Dec", amount: 1650000 }
  ];

  // Mock recent loans data
  const recentLoans: RecentLoan[] = [
    {
      id: "LN001",
      borrowerName: "Priya Sharma",
      type: "Personal",
      amount: 250000,
      status: "Started",
      nextDueDate: "2024-01-15",
      statusColor: "#2563EB"
    },
    {
      id: "LN002",
      borrowerName: "Amit Patel",
      type: "Vehicle",
      amount: 850000,
      status: "Accepted",
      nextDueDate: "2024-01-20",
      statusColor: "#F59E0B"
    },
    {
      id: "LN003",
      borrowerName: "Sunita Reddy",
      type: "Business",
      amount: 1200000,
      status: "Initiated",
      nextDueDate: "2024-01-25",
      statusColor: "#EAB308"
    },
    {
      id: "LN004",
      borrowerName: "Vikram Singh",
      type: "Medical",
      amount: 180000,
      status: "Started",
      nextDueDate: "2024-01-18",
      statusColor: "#2563EB"
    },
    {
      id: "LN005",
      borrowerName: "Meera Joshi",
      type: "Personal",
      amount: 320000,
      status: "Ended",
      nextDueDate: "2024-02-01",
      statusColor: "#10B981"
    }
  ];


  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - LoanTracker</title>
        <meta name="description" content="Comprehensive loan portfolio overview and management dashboard for loan officers" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header 
          user={user} 
          onLogout={handleLogout}
        />
        
        <main className="pt-16">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
            {/* Modern Header Section */}
            <div className="mb-8">
              <Breadcrumb />
              <div className="mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-bold text-foreground tracking-tight">
                      Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                      Welcome back, <span className="font-semibold text-foreground">{user.name}</span>. Here's your loan portfolio overview.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <QuickActions />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Loan Distribution Chart */}
              <div className="lg:col-span-1">
                <LoanDistributionChart data={chartData} />
              </div>

              {/* Trend Chart */}
              <div className="lg:col-span-1">
                <TrendChart data={trendData} />
              </div>
            </div>

            {/* Recent Loans Preview */}
            <RecentLoansPreview loans={recentLoans} />
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;