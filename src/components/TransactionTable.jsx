import React, { useState, useMemo, useEffect } from 'react';

const PAGE_SIZE = 10;

function formatINR(amount) {
  if (typeof amount !== 'number') return amount;
  return `₹${amount.toLocaleString('en-IN')}`;
}

export default function TransactionTable({
  rows = [],
  startDate = '',
  endDate = '',
  onDateChange,
  statusFilter: externalStatus,
  onStatusChange: externalSetStatus,
  channelFilter: externalChannel,
  onChannelChange: externalSetChannel
}) {
  // Support both controlled and uncontrolled states for status and channel
  const [internalStatus, setInternalStatus] = useState('All');
  const [internalChannel, setInternalChannel] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const statusFilter = externalStatus !== undefined ? externalStatus : internalStatus;
  const channelFilter = externalChannel !== undefined ? externalChannel : internalChannel;

  const handleStatusChange = (val) => {
    if (externalSetStatus) externalSetStatus(val);
    else setInternalStatus(val);
    setCurrentPage(1);
  };

  const handleChannelChange = (val) => {
    if (externalSetChannel) externalSetChannel(val);
    else setInternalChannel(val);
    setCurrentPage(1);
  };

  // Reset page when date filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate]);

  // Combined real-time filtering: Status + Channel + Date range + Sort by Date Descending
  const filteredRows = useMemo(() => {
    return rows
      .filter((row) => {
        const matchesStatus = statusFilter === 'All' || row.status === statusFilter;
        const matchesChannel = channelFilter === 'All' || row.channel === channelFilter;
        const matchesStart = !startDate || row.date >= startDate;
        const matchesEnd = !endDate || row.date <= endDate;
        return matchesStatus && matchesChannel && matchesStart && matchesEnd;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [rows, statusFilter, channelFilter, startDate, endDate]);

  // Pagination calculation
  const totalRecords = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * PAGE_SIZE;
    return filteredRows.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredRows, validCurrentPage]);

  const startIndex = totalRecords === 0 ? 0 : (validCurrentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(validCurrentPage * PAGE_SIZE, totalRecords);

  const hasActiveFilters = statusFilter !== 'All' || channelFilter !== 'All';

  const handleResetFilters = () => {
    handleStatusChange('All');
    handleChannelChange('All');
    if (onDateChange) onDateChange('', '');
    setCurrentPage(1);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'statusCompleted';
      case 'Pending':
        return 'statusPending';
      case 'Refunded':
        return 'statusRefunded';
      case 'Cancelled':
        return 'statusCancelled';
      default:
        return '';
    }
  };

  return (
    <section className="tableCard" aria-label="Recent transactions management">
      <div className="tableToolbar">
        <div className="tableTitleGroup">
          <h2 className="panelTitle">Recent transactions</h2>
          <span className="tableCountBadge">
            {totalRecords} {totalRecords === 1 ? 'record' : 'records'}
          </span>
        </div>

        <div className="filterControls">
          {/* Status Filter */}
          <select
            id="statusFilterSelect"
            className="filterSelect"
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            aria-label="Filter transactions by status"
          >
            <option value="All">All statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Channel Filter */}
          <select
            id="channelFilterSelect"
            className="filterSelect"
            value={channelFilter}
            onChange={(e) => handleChannelChange(e.target.value)}
            aria-label="Filter transactions by channel"
          >
            <option value="All">All channels</option>
            <option value="Website">Website</option>
            <option value="Mobile App">Mobile App</option>
            <option value="Marketplace">Marketplace</option>
          </select>

          {/* Reset Filters Action */}
          {hasActiveFilters && (
            <button
              type="button"
              className="resetFiltersBtn"
              onClick={handleResetFilters}
              aria-label="Reset all table filters"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Responsive Table Scroll Container */}
      <div className="tableContainer">
        <table className="dataTable">
          <thead>
            <tr>
              <th scope="col">Transaction</th>
              <th scope="col">Date</th>
              <th scope="col">Product</th>
              <th scope="col">Amount</th>
              <th scope="col">Channel</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((tx) => (
                <tr key={tx.transactionId}>
                  <td className="txnIdCell">{tx.transactionId}</td>
                  <td className="dateCell">{tx.date}</td>
                  <td>{tx.productName}</td>
                  <td className="amountCell">{formatINR(tx.amountINR)}</td>
                  <td>{tx.channel}</td>
                  <td>
                    <span className={`statusBadge ${getStatusClass(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="emptyState">
                  <div className="emptyStateTitle">No transactions found</div>
                  <p>Try adjusting your status, channel, or date range filters.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalRecords > 0 && (
        <div className="paginationContainer" aria-label="Table pagination">
          <div className="paginationSummary">
            Showing {startIndex}–{endIndex} of {totalRecords} transactions
          </div>

          <div className="paginationControls">
            <button
              type="button"
              className="paginationBtn"
              disabled={validCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={`page-${page}`}
                type="button"
                className={`paginationBtn ${page === validCurrentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
                aria-label={`Page ${page}`}
                aria-current={page === validCurrentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className="paginationBtn"
              disabled={validCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
