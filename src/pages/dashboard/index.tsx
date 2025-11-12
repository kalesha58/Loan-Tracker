import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import SummaryCards from './components/SummaryCards';
import LoanDistributionChart from './components/LoanDistributionChart';
import TrendChart from './components/TrendChart';
import NotificationsPanel from './components/NotificationsPanel';
import QuickActions from './components/QuickActions';
import RecentLoansPreview from './components/RecentLoansPreview';
import StatsOverview from './components/StatsOverview';
import { handleLogout as logout } from '../../utils/auth';
import {
  LoanSummary,
  ChartData,
  TrendData,
  Notification,
  RecentLoan,
  DashboardStats
} from './types';

const Dashboard = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock user data
  const user = {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@loantracker.com",
    role: "Senior Loan Officer"
  };

  // Mock dashboard statistics
  const dashboardStats: DashboardStats = {
    totalLoans: 247,
    totalAmount: 12500000,
    activeLoans: 189,
    pendingDocuments: 23
  };

  // Mock loan summary data
  const loanSummaryData: LoanSummary[] = [
    {
      type: "Personal",
      count: 85,
      totalAmount: 4250000,
      color: "#2563EB",
      icon: "User"
    },
    {
      type: "Vehicle",
      count: 62,
      totalAmount: 3720000,
      color: "#10B981",
      icon: "Car"
    },
    {
      type: "Business",
      count: 45,
      totalAmount: 3375000,
      color: "#F59E0B",
      icon: "Building"
    },
    {
      type: "Medical",
      count: 55,
      totalAmount: 1155000,
      color: "#EF4444",
      icon: "Heart"
    }
  ];

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

  // Initialize mock notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Document Verification Complete",
        message: "Loan application LN001 documents have been successfully verified and approved.",
        type: "success",
        timestamp: new Date(Date.now() - 300000),
        isRead: false
      },
      {
        id: "2",
        title: "Payment Due Reminder",
        message: "Loan LN002 payment of ₹45,000 is due in 3 days. Please remind the borrower.",
        type: "warning",
        timestamp: new Date(Date.now() - 900000),
        isRead: false
      },
      {
        id: "3",
        title: "New Loan Application",
        message: "A new business loan application for ₹15,00,000 has been submitted by Rajesh Industries.",
        type: "info",
        timestamp: new Date(Date.now() - 1800000),
        isRead: true
      },
      {
        id: "4",
        title: "Document Upload Required",
        message: "Borrower Priya Sharma needs to upload income certificate for loan LN003.",
        type: "warning",
        timestamp: new Date(Date.now() - 3600000),
        isRead: false
      },
      {
        id: "5",
        title: "Loan Disbursement Failed",
        message: "Disbursement for loan LN005 failed due to invalid bank account details.",
        type: "error",
        timestamp: new Date(Date.now() - 7200000),
        isRead: true
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

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
        <Header user={user} onLogout={handleLogout} />
        
        <main className="pt-16">
          <div className="max-w-screen-2xl mx-auto px-6 py-8">
            <div className="mb-6">
              <Breadcrumb />
              <div className="mt-4">
                <h1 className="text-3xl font-semibold text-foreground">
                  Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                  Welcome back, {user.name}. Here's your loan portfolio overview.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <QuickActions />

            {/* Stats Overview */}
            <StatsOverview stats={dashboardStats} />

            {/* Summary Cards */}
            <SummaryCards summaryData={loanSummaryData} />

            {/* Charts and Notifications Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
              {/* Loan Distribution Chart */}
              <div className="xl:col-span-1">
                <LoanDistributionChart data={chartData} />
              </div>

              {/* Trend Chart */}
              <div className="xl:col-span-1">
                <TrendChart data={trendData} />
              </div>

              {/* Notifications Panel */}
              <div className="xl:col-span-1">
                <NotificationsPanel
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                />
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