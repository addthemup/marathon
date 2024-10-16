import { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import { Accounts } from './Accounts';
import { RootAccounts } from './RootAccounts';
import { BranchAccounts } from './BranchAccounts';
import InvoicesTable from './InvoicesTable';
import InvoiceDetails from './InvoiceDetails';
import { Products } from './Products';
import Reps from './Reps';
import { Analytics } from './Analytics';
import SalesReport from './SalesReport'; // Import SalesReport
import Home from './Home';
import AboutUs from './AboutUs';

interface ContentProps {
  currentView: string;  // Indicates which view is active
  onViewChange: (view: string) => void;  // Handles view changes
}

export function Content({ currentView, onViewChange }: ContentProps) {
  const [selectedProjectData, setSelectedProjectData] = useState(null);  // State for selected project data

  useEffect(() => {
    console.log(`Content loaded with view: ${currentView}`);
    
    // Auto-scroll to the top whenever the view changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Optional: Add smooth scrolling
    });

    if (currentView === 'projectsMain') {
      const storedProjectData = localStorage.getItem('selectedProjectData');
      if (storedProjectData) {
        setSelectedProjectData(JSON.parse(storedProjectData));  // Load selected project from localStorage
      }
    }
  }, [currentView]);

  return (
    <div style={{ padding: '30px', paddingLeft: '30px', paddingRight: '15px', color: 'gray', height: '100%', minWidth: '100%' }}>
      {/* Render different views based on currentView */}
      {currentView === 'home' && <Home />}
      {currentView === 'aboutus' && <AboutUs />}
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'rootaccounts' && <RootAccounts />}
      {currentView === 'branchaccounts' && <BranchAccounts />}
      {currentView === 'accounts' && <Accounts />}
      {currentView === 'salesReports' && <SalesReport />}  {/* Render the SalesReport */}
      {currentView === 'products' && <Products />}
      {currentView === 'salesReps' && <Reps />}
      {currentView === 'analytics' && <Analytics />}
      
      {/* Invoices view */}
      {currentView === 'invoices' && <InvoicesTable />}
      {currentView === 'invoicedetails' && <InvoiceDetails />}
      
      {/* Handle project-specific view if needed */}
      {currentView === 'projectsMain' && selectedProjectData && (
        <div>
          <h1>Project: {selectedProjectData.name}</h1>
          <p>Description: {selectedProjectData.description}</p>
        </div>
      )}
    </div>
  );
}
