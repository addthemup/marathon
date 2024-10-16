import { Breadcrumbs, Anchor, Select } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Helper function to get branch accounts from localStorage
const getBranchAccountsFromLocalStorage = () => {
  const branchAccounts = localStorage.getItem('branchAccounts');
  return branchAccounts ? JSON.parse(branchAccounts) : [];
};

interface BranchAccountHeadProps {
  onViewChange: (view: string) => void;  // Accept the callback function for view changes
}

export function BranchAccountHead({ onViewChange }: BranchAccountHeadProps) {
  const { branchAccountId } = useParams<{ branchAccountId: string }>();  // Get branchAccountId from the URL
  const [branchAccounts, setBranchAccounts] = useState([]);
  const [currentBranchName, setCurrentBranchName] = useState<string>('');
  const navigate = useNavigate();

  // Fetch the branch accounts from local storage and set the current branch name
  useEffect(() => {
    const accounts = getBranchAccountsFromLocalStorage();
    setBranchAccounts(accounts);

    // Find the current branch by ID and set its name
    const currentBranch = accounts.find((account: any) => account.id === Number(branchAccountId));
    if (currentBranch) {
      setCurrentBranchName(currentBranch.name);
    }
  }, [branchAccountId]);

  // Function to handle branch selection from the dropdown
  const handleBranchChange = (value: string) => {
    navigate(`/branch-accounts/${value}`);
  };

  // Function to handle "Home" click and update the current view
  const handleHomeClick = () => {
    onViewChange('home');
    navigate('/');
  };

  // Breadcrumbs data
  const breadcrumbItems = [
    { title: 'Home', href: '/', onClick: handleHomeClick },  // Trigger view change to 'home'
    { title: 'Branch Accounts', href: '/branch-accounts' },
    { title: currentBranchName, href: '#' },  // Current branch name
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs>
        {breadcrumbItems.map((item, index) => (
          <Anchor 
            href={item.href} 
            key={index}
            onClick={item.onClick || undefined}  // Only set the onClick if it's provided (for Home)
          >
            {item.title}
          </Anchor>
        ))}
      </Breadcrumbs>

      {/* Dropdown for branch selection */}
      <Select
        placeholder="Select a branch"
        value={branchAccountId}
        onChange={handleBranchChange}
        data={branchAccounts.map((account: any) => ({
          value: account.id.toString(),
          label: account.name,
        }))}
      />
    </div>
  );
}
