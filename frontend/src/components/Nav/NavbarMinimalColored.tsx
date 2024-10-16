import { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Center, Tooltip, UnstyledButton, Box, rem } from '@mantine/core';  // Import rem from Mantine
import {
  IconHome2,
  IconGauge,
  IconDeviceAnalytics,
  IconReportAnalytics,
  IconBox,
  IconUser,
  IconFileInvoice,
  IconTree,
  IconFriends,
  IconSeeding,
} from '@tabler/icons-react';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import classes from './NavbarMinimalColored.module.css';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
}

// Create a forwarded ref to ensure Tooltip works with the UnstyledButton
const NavbarLink = forwardRef<HTMLButtonElement, NavbarLinkProps>(
  ({ icon: Icon, label, active, onClick }, ref) => (
    <Tooltip label={label} position="bottom" transitionProps={{ duration: 0 }}>
      <UnstyledButton ref={ref} onClick={onClick} className={classes.link} data-active={active || undefined}>
        <Icon style={{ width: rem(30), height: rem(30) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  )
);

// Ensure the display name for easier debugging
NavbarLink.displayName = 'NavbarLink';

interface NavbarMinimalColoredProps {
  onViewChange: (view: string) => void;
}

export function NavbarMinimalColored({ onViewChange }: NavbarMinimalColoredProps) {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  // Links with updated tab names, including Invoices
  const links = [
    { icon: IconGauge, label: 'Dashboard', view: 'dashboard' },
    { icon: IconFriends, label: 'Employees', view: 'salesReps' },
    { icon: IconTree, label: 'Root Accounts', view: 'rootaccounts' },
    { icon: IconSeeding, label: 'Branch Accounts', view: 'branchaccounts' },
    { icon: IconUser, label: 'Raw Accounts', view: 'accounts' },
    { icon: IconReportAnalytics, label: 'Sales Reports', view: 'salesReports' },
    { icon: IconBox, label: 'Products', view: 'products' },
    { icon: IconDeviceAnalytics, label: 'Analytics', view: 'analytics' },
    { icon: IconFileInvoice, label: 'Invoices', view: 'invoices' },
  ];

  // Handle navigation and view reset
  const handleNavClick = (index: number, view: string) => {
    setActive(index);
    onViewChange(view);
    navigate('/'); // Reset route to home path
    localStorage.setItem('currentView', view);
  };

  return (
    <Box
      style={{
        height: rem(50),  // Adjust height for horizontal navbar
        display: 'flex',
        justifyContent: 'center',  // Center horizontally
        alignItems: 'center',
        padding: rem(0),
        width: '100%',  // Full width
        flexDirection: 'row',  // Horizontal direction
      }}
      className={classes.navbar}
    >
      <div className={classes.navbarMain} style={{ display: 'flex', gap: rem(8) }}> {/* Adjust to a horizontal flexbox */}
        {links.map((link, index) => (
          <NavbarLink
            key={link.label}
            icon={link.icon}
            label={link.label}
            active={index === active}
            onClick={() => handleNavClick(index, link.view)}  // Ensure navigation reset on click
          />
        ))}
      </div>
    </Box>
  );
}
