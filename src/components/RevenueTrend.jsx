import React, { useMemo } from 'react';

export default function RevenueTrend({ transactions = [] }) {
  // Dynamically calculate weekly revenue from completed transactions
  const { points, polylinePoints, areaPoints, maxRev, minRev, weeklyBuckets } = useMemo(() => {
    const completed = transactions.filter((t) => t.status === 'Completed');

    if (completed.length === 0) {
      return {
        points: [],
        polylinePoints: '',
        areaPoints: '',
        maxRev: 0,
        minRev: 0,
        weeklyBuckets: []
      };
    }

    // Determine min and max dates
    const timestamps = completed.map((t) => new Date(t.date).getTime());
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);

    // Calculate number of weeks (7-day intervals)
    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    const totalWeeks = Math.max(1, Math.ceil((maxTime - minTime) / msInWeek) + 1);

    // Bucket into weekly revenue
    const buckets = [];
    for (let i = 0; i < totalWeeks; i++) {
      const bucketStart = minTime + i * msInWeek;
      const bucketEnd = bucketStart + msInWeek;
      
      const bucketTxns = completed.filter((t) => {
        const time = new Date(t.date).getTime();
        return time >= bucketStart && time < bucketEnd;
      });

      const revenue = bucketTxns.reduce((sum, t) => sum + (t.amountINR || 0), 0);
      const startDateObj = new Date(bucketStart);
      const label = startDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

      buckets.push({
        week: i + 1,
        label,
        revenue,
        orderCount: bucketTxns.length
      });
    }

    const revenues = buckets.map((b) => b.revenue);
    const maxRevenue = Math.max(...revenues, 1);
    const minRevenue = Math.min(...revenues, 0);

    // SVG canvas coordinates: width = 600, height = 150
    // Padding: left = 20, right = 580, top = 20, bottom = 135
    const width = 600;
    const height = 150;
    const padX = 24;
    const padYTop = 18;
    const padYBottom = 132;
    const plotWidth = width - padX * 2;
    const plotHeight = padYBottom - padYTop;

    const calculatedPoints = buckets.map((b, idx) => {
      const x = buckets.length > 1 ? padX + (idx / (buckets.length - 1)) * plotWidth : width / 2;
      const normalizedY = (b.revenue - minRevenue) / (maxRevenue - minRevenue || 1);
      const y = padYBottom - normalizedY * plotHeight;
      return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, ...b };
    });

    const ptsStr = calculatedPoints.map((p) => `${p.x},${p.y}`).join(' ');
    const areaStr = `${calculatedPoints[0].x},${padYBottom} ${ptsStr} ${calculatedPoints[calculatedPoints.length - 1].x},${padYBottom}`;

    return {
      points: calculatedPoints,
      polylinePoints: ptsStr,
      areaPoints: areaStr,
      maxRev: maxRevenue,
      minRev: minRevenue,
      weeklyBuckets: buckets
    };
  }, [transactions]);

  return (
    <div className="cardPanel">
      <div className="panelHeader">
        <h2 className="panelTitle">Revenue trend</h2>
        <span className="panelSubtitle">Completed orders • weekly</span>
      </div>

      <div className="chartContainer">
        {points.length > 0 ? (
          <svg
            className="svgTrendChart"
            viewBox="0 0 600 150"
            preserveAspectRatio="none"
            role="img"
            aria-label="Weekly revenue trend line chart"
          >
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4D8A64" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4D8A64" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            <line x1="20" y1="30" x2="580" y2="30" className="gridLine" />
            <line x1="20" y1="65" x2="580" y2="65" className="gridLine" />
            <line x1="20" y1="100" x2="580" y2="100" className="gridLine" />
            <line x1="20" y1="132" x2="580" y2="132" className="gridLine" />

            {/* Area under curve */}
            <polygon points={areaPoints} className="trendArea" />

            {/* Trend Polyline */}
            <polyline points={polylinePoints} className="trendLine" />

            {/* Vertex Dots */}
            {points.map((p, idx) => (
              <circle
                key={`dot-${p.week}-${idx}`}
                cx={p.x}
                cy={p.y}
                r="4.5"
                className="trendDot"
              >
                <title>{`${p.label}: ₹${p.revenue.toLocaleString('en-IN')} (${p.orderCount} orders)`}</title>
              </circle>
            ))}
          </svg>
        ) : (
          <div className="emptyState">
            <p>No completed orders in the selected period to display.</p>
          </div>
        )}
      </div>
    </div>
  );
}
