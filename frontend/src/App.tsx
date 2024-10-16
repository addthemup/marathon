import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals'; // Import ModalsProvider
import { HeaderMegaMenu } from './components/Header/HeaderMegaMenu';
import { NavbarMinimalColored } from './components/Nav/NavbarMinimalColored';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Content } from './components/Content/Content';
import InvoicesTable from './components/Content/InvoicesTable';
import InvoiceDetails from './components/Content/InvoiceDetails';
import { AccountPage } from './components/Content/AccountPage'; // Account page route
import { BranchAccountPage } from './components/Content/BranchAccountPage'; // BranchAccount page route
import { RootAccounts } from './components/Content/RootAccounts'; // Root accounts route
import { BranchAccounts } from './components/Content/BranchAccounts'; // Branch accounts route
import { LogoHeader } from './components/Content/LogoHeader';
import styles from './App.module.css';

export default function App() {
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('currentView') || 'home');
  const [username, setUsername] = useState<string | null>(null);

  const handleViewChange = (view: string) => {
    localStorage.setItem('currentView', view);
    setCurrentView(view);
  };

  useEffect(() => {
    const savedView = localStorage.getItem('currentView');
    const storedUsername = localStorage.getItem('username');

    if (savedView) setCurrentView(savedView);
    if (storedUsername) setUsername(storedUsername);
  }, []);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <ModalsProvider>
        <Router>
          <div className={styles.appContainer}>
          <div className={styles.logoHeaderContainer}>
              <LogoHeader />
            </div>
            {/* Header */}
            <div className={styles.headerContainer}>
              <HeaderMegaMenu />
            </div>

            {/* Main content area with Nav, Content, and InfoBar */}
            <div className={styles.contentContainer}>
              {/* Navbar - Show if username exists */}
              {username && (
                <div className={styles.navContainer}>
                  <NavbarMinimalColored onViewChange={handleViewChange} />
                </div>
              )}

              {/* Content window - Routing logic */}
              <div className={styles.contentWindow}>
                <Routes>
                  {/* Home route */}
                  <Route
                    path="/"
                    element={<Content currentView={currentView} onViewChange={handleViewChange} />}
                  />

                  {/* Invoice routes */}
                  <Route path="/invoices" element={<InvoicesTable />} />
                  <Route path="/invoices/:id" element={<InvoiceDetails />} />

                  {/* Route for AccountPage */}
                  <Route path="/accounts/:accountId" element={<AccountPage />} />

                  {/* Route for BranchAccountPage */}
                  <Route path="/branch-accounts/:branchAccountId" element={<BranchAccountPage />} />

                  {/* Routes for root and branch accounts */}
                  <Route path="/root-accounts" element={<RootAccounts />} />
                  <Route path="/branch-accounts" element={<BranchAccounts />} />
                </Routes>
              </div>

              {/* InfoBar */}
              <div className={styles.infoBarContainer}>
                {/* You can add additional information or sidebars here */}
              </div>
            </div>
          </div>
        </Router>
      </ModalsProvider>
    </MantineProvider>
  );
}
