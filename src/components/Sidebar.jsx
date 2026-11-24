import React, { useState } from 'react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'customers', label: 'Customers' },
  { id: 'products', label: 'Products' },
  { id: 'settings', label: 'Settings' }
];

export default function Sidebar({ activeTab = 'overview', onTabSelect }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id) => {
    if (onTabSelect) onTabSelect(id);
    setMobileMenuOpen(false);
  };

  // Reusable vector logo matching original growth_logo.svg and dark theme
  const BrandLogo = () => (
    <div className="sidebarBrand">
      <svg
        className="sidebarLogoSvg"
        viewBox="0 0 180 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Leaf Emblem */}
        <g transform="translate(0, 0) scale(0.75)">
          <path d="M30 60 C-3 43 9 15 30 11 C30 29 36 42 30 60Z" fill="#55966B" />
          <path d="M30 60 C23 29 38 5 62 8 C56 35 49 48 30 60Z" fill="#3D7B58" />
          <path d="M30 60 C39 34 53 23 70 28 C65 43 53 55 30 60Z" fill="#D7AE62" />
        </g>
        {/* Typography */}
        <text x="60" y="32" fill="#FFFFFF" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="22">
          growth.
        </text>
        <text x="61" y="45" fill="#93B8A5" fontFamily="system-ui, -apple-system, sans-serif" fontSize="7.5" fontWeight="600" letterSpacing="2">
          WELLNESS STORE
        </text>
      </svg>
    </div>
  );

  return (
    <>
      {/* Tablet & Mobile Top Sticky Bar */}
      <div className="tabletBar" role="banner">
        <div className="tabletLogoContainer">
          <svg
            width="120"
            height="34"
            viewBox="0 0 180 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <g transform="translate(0, 0) scale(0.75)">
              <path d="M30 60 C-3 43 9 15 30 11 C30 29 36 42 30 60Z" fill="#55966B" />
              <path d="M30 60 C23 29 38 5 62 8 C56 35 49 48 30 60Z" fill="#3D7B58" />
              <path d="M30 60 C39 34 53 23 70 28 C65 43 53 55 30 60Z" fill="#D7AE62" />
            </g>
            <text x="60" y="32" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="22">
              growth.
            </text>
          </svg>
        </div>
        <div className="tabletRightControls">
          <span className="activeNavBadge">Overview</span>
          <button
            type="button"
            className="hamburgerBtn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Visible when hamburger clicked) */}
      <div className={`mobileMenuOverlay ${mobileMenuOpen ? 'open' : ''}`}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`navItem ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Desktop Persistent Left Sidebar */}
      <aside className="sidebar" aria-label="Primary navigation">
        <div>
          <BrandLogo />
          <nav className="sidebarNav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`navItem ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebarFooter">
          <span className="internalTag">Internal Operations</span>
        </div>
      </aside>
    </>
  );
}
