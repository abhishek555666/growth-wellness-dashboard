import React, { useState, useMemo } from 'react';
import { transactions } from './data.js';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import StatCard from './components/StatCard.jsx';
import RevenueTrend from './components/RevenueTrend.jsx';
import ChannelBreakdown from './components/ChannelBreakdown.jsx';
import TransactionTable from './components/TransactionTable.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  // Compute dataset bounds dynamically
  const { minDate, maxDate } = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { minDate: '2026-08-01', maxDate: '2026-11-12' };
    }
    const dates = transactions.map((t) => t.date).sort();
    return {
      minDate: dates[0] || '2026-08-01',
      maxDate: dates[dates.length - 1] || '2026-11-12'
    };
  }, []);

  // Filter states
  const [startDate, setStartDate] = useState(minDate);
  const [endDate, setEndDate] = useState(maxDate);
  const [statusFilter, setStatusFilter] = useState('All');
  const [channelFilter, setChannelFilter] = useState('All');

  // Filter transactions by selected date range for dashboard analytics
  const dateFilteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchStart = !startDate || t.date >= startDate;
      const matchEnd = !endDate || t.date <= endDate;
      return matchStart && matchEnd;
    });
  }, [startDate, endDate]);

  // Dynamic KPI calculations per acceptance rules:
  // Gross revenue: sum amountINR for Completed only
  // Completed orders: count Completed only
  // Units sold: sum quantity for Completed only
  // Pending orders: count Pending only
  const kpiMetrics = useMemo(() => {
    const completedTxns = dateFilteredTransactions.filter((t) => t.status === 'Completed');
    const pendingTxns = dateFilteredTransactions.filter((t) => t.status === 'Pending');

    const grossRevenue = completedTxns.reduce((sum, t) => sum + (t.amountINR || 0), 0);
    const completedCount = completedTxns.length;
    const unitsSold = completedTxns.reduce((sum, t) => sum + (t.quantity || 0), 0);
    const pendingCount = pendingTxns.length;

    return {
      grossRevenue,
      completedCount,
      unitsSold,
      pendingCount
    };
  }, [dateFilteredTransactions]);

  const handleDateRangeChange = (newStart, newEnd) => {
    setStartDate(newStart);
    setEndDate(newEnd);
  };

  return (
    <div className="appShell">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onTabSelect={setActiveTab} />

      {/* Main Dashboard Workspace */}
      <main className="mainContent" role="main">
        {/* Header with Title and Interactive Date Range Selector */}
        <Header
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
          minDate={minDate}
          maxDate={maxDate}
        />

        {/* 4 KPI StatCards */}
        <section className="kpiGrid" aria-label="Key Performance Indicators">
          <StatCard
            label="Gross revenue"
            value={kpiMetrics.grossRevenue}
            subtext="Completed sales"
            isCurrency={true}
          />
          <StatCard
            label="Completed orders"
            value={kpiMetrics.completedCount}
            subtext="Paid transactions"
          />
          <StatCard
            label="Units sold"
            value={kpiMetrics.unitsSold}
            subtext="Completed orders"
          />
          <StatCard
            label="Pending orders"
            value={kpiMetrics.pendingCount}
            subtext="Requires review"
          />
        </section>

        {/* Visual Charts: Revenue Trend & Orders by Channel */}
        <section className="visualSection" aria-label="Sales and Channel Visualizations">
          <RevenueTrend transactions={dateFilteredTransactions} />
          <ChannelBreakdown transactions={dateFilteredTransactions} />
        </section>

        {/* Recent Transactions Table with combined Status, Channel, and Date filtering */}
        <TransactionTable
          rows={transactions}
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateRangeChange}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          channelFilter={channelFilter}
          onChannelChange={setChannelFilter}
        />
      </main>
    </div>
  );
}
