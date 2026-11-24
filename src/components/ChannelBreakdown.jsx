import React, { useMemo } from 'react';

const CHANNEL_CONFIG = [
  { name: 'Website', fillClass: 'fillWebsite' },
  { name: 'Mobile App', fillClass: 'fillMobileApp' },
  { name: 'Marketplace', fillClass: 'fillMarketplace' }
];

export default function ChannelBreakdown({ transactions = [] }) {
  // Dynamically compute breakdown strictly from dataset
  const { channelStats, totalCompleted } = useMemo(() => {
    const completed = transactions.filter((t) => t.status === 'Completed');
    const total = completed.length;

    const stats = CHANNEL_CONFIG.map(({ name, fillClass }) => {
      const channelTxns = completed.filter((t) => t.channel === name);
      const count = channelTxns.length;
      const revenue = channelTxns.reduce((sum, t) => sum + (t.amountINR || 0), 0);
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

      return {
        name,
        count,
        revenue,
        percentage,
        fillClass
      };
    });

    return { channelStats: stats, totalCompleted: total };
  }, [transactions]);

  return (
    <div className="cardPanel">
      <div className="panelHeader">
        <h2 className="panelTitle">Orders by channel</h2>
        <span className="panelSubtitle">Completed transactions</span>
      </div>

      <div className="channelList">
        {channelStats.map((item) => (
          <div key={item.name} className="channelItem">
            <div className="channelItemHeader">
              <span className="channelName">{item.name}</span>
              <span className="channelStats">
                {item.count} orders ({item.percentage}%)
              </span>
            </div>
            <div className="channelBarTrack">
              <svg className="channelBarSvg" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
                <rect x="0" y="0" width="100" height="12" rx="6" className="barBackground" />
                <rect x="0" y="0" width={item.percentage} height="12" rx="6" className={`barFill ${item.fillClass}`} />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
