import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { fetchAccounts, fetchSalesReps, updateAccountSalesRep } from '../Api/AccountsApi';
import { Table, ScrollArea, Select, LoadingOverlay, Text, TextInput, Group, Pagination } from '@mantine/core';
import classes from './Accounts.module.css';
import cx from 'clsx';

// Define types for the account and sales rep objects
interface SalesRep {
  id: number;
  full_name: string;
}

interface Account {
  id: number;
  name: string;
  customer_number: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  total_invoices: number;
  gross_sum: number;
  sales_rep: SalesRep | null;
}

// Helper function to load from localStorage
const loadFromLocalStorage = (key: string): any => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export function Accounts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]); // Typed as Account[]
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]); // Typed as SalesRep[]
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]); // Typed as Account[]
  const [selectedSalesReps, setSelectedSalesReps] = useState<number[]>([]); // Typed as number[]
  const [currentPage, setCurrentPage] = useState(1); // State for pagination
  const rowsPerPage = 18; // Number of rows (accounts) per page

  const navigate = useNavigate(); // Initialize navigate

  // Fetch accounts and sales reps on component mount
  useEffect(() => {
    const loadAccountsAndSalesReps = async () => {
      try {
        setLoading(true);
        const [accountsData, salesRepsData] = await Promise.all([
          fetchAccounts(),
          fetchSalesReps(),
        ]);
        setAccounts(accountsData);
        setFilteredAccounts(accountsData); // Set filtered accounts initially as all accounts
        setSalesReps(salesRepsData);

        // Load selected sales reps from localStorage
        const selectedRepsFromStorage = loadFromLocalStorage('selectedSalesReps') || [];
        setSelectedSalesReps(selectedRepsFromStorage);

        setLoading(false);
      } catch {
        setError('Failed to load data');
        setLoading(false);
      }
    };

    loadAccountsAndSalesReps();
  }, []);

  // Filter accounts based on the search query
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    const filtered = accounts.filter(account => {
      const { name, customer_number, address, city, state, zip_code, sales_rep } = account;

      const salesRepName = sales_rep?.full_name?.toLowerCase() || '';
      const fullAddress = `${address} ${city} ${state} ${zip_code}`.toLowerCase();

      return (
        name.toLowerCase().includes(lowerCaseQuery) ||
        customer_number.toLowerCase().includes(lowerCaseQuery) ||
        fullAddress.includes(lowerCaseQuery) ||
        salesRepName.includes(lowerCaseQuery)
      );
    });

    setFilteredAccounts(filtered);
    setCurrentPage(1); // Reset to first page after search
  }, [searchQuery, accounts]);

  // Function to handle sales rep change for an account
  const handleSalesRepChange = async (accountId: number, newSalesRepId: string) => {
    try {
      setLoading(true);
      await updateAccountSalesRep(accountId, newSalesRepId);
      const updatedAccounts = accounts.map(account =>
        account.id === accountId
          ? { ...account, sales_rep: salesReps.find(rep => rep.id === parseInt(newSalesRepId)) }
          : account
      );
      setAccounts(updatedAccounts);
      setFilteredAccounts(updatedAccounts); // Update filtered accounts after change
      setLoading(false);
    } catch {
      setError('Failed to update sales rep');
      setLoading(false);
    }
  };

  // Function to handle clicking on the account name
  const handleAccountClick = (account: Account) => {
    // Store the selected account in localStorage to pass data
    localStorage.setItem('selectedAccount', JSON.stringify(account));

    // Navigate to the AccountPage.tsx with the account's ID
    navigate(`/accounts/${account.id}`);
  };

  if (loading) {
    return <LoadingOverlay visible={loading} />;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  // Apply faint highlight if the sales rep matches the selected ones from localStorage
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedAccounts = filteredAccounts.slice(startIndex, startIndex + rowsPerPage); // Paginate accounts

  const rows = paginatedAccounts.map(account => {
    const isHighlighted = account.sales_rep && selectedSalesReps.includes(account.sales_rep.id); // Check if the account's sales rep is selected

    return (
      <tr key={account.id} className={cx({ [classes.highlightedRow]: isHighlighted })}>
        <td>
          {/* Make Account Name clickable */}
          <Text
            component="a"
            className={classes.clickableAccountName}
            onClick={() => handleAccountClick(account)}
          >
            {account.name}
          </Text>
        </td>
        <td>{account.customer_number}</td>
        <td>{`${account.address}, ${account.city}, ${account.state} ${account.zip_code}`}</td>
        <td>{account.total_invoices}</td>
        <td>${account.gross_sum.toFixed(2)}</td>
        <td>
          <Select
            value={account.sales_rep?.id?.toString() || ''}
            onChange={(newSalesRepId) => handleSalesRepChange(account.id, newSalesRepId)}
            data={salesReps.map(rep => ({ value: rep.id.toString(), label: rep.full_name }))}
            placeholder={account.sales_rep ? account.sales_rep.full_name : 'Select Sales Rep'}
            nothingFound="No sales reps available"
            searchable
            disabled={loading}
          />
        </td>
      </tr>
    );
  });

  // Calculate total pages based on filtered accounts
  const totalPages = Math.ceil(filteredAccounts.length / rowsPerPage);

  return (
    <div style={{ marginTop: '-25px', height: '100%', width: '100%' }}>
      {/* Add a search input at the top */}
      <Group position="right" mb="md">
        <TextInput
          placeholder="Search by Account Name, Customer Number, Address, or Sales Rep"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
        />
      </Group>

      <ScrollArea style={{ height: '90%', width: '100%' }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table style={{ minWidth: '100%', width: '100%' }}>
          <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <tr>
              <th>Account Name</th>
              <th>Customer Number</th>
              <th>Address</th>
              <th>Total Invoices</th>
              <th>Gross Sum</th>
              <th>Sales Rep</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          page={currentPage}
          onChange={setCurrentPage}
          total={totalPages}
          position="center"
          mt="lg"
        />
      )}
    </div>
  );
}
