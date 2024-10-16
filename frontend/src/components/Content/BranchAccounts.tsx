import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea, Table, Pagination } from '@mantine/core';
import { BranchAccountModal } from './BranchAccountModal'; // Import modal component
import BranchAccountRow from './BranchAccountRow'; // Import BranchAccountRow component
import BranchAccountHeader from './BranchAccountHeader';
import BranchesMap from './BranchesMap';
import classes from './Accounts.module.css';
import cx from 'clsx';

// Helper function to load from localStorage
const loadFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

export function BranchAccounts() {
    const [branchAccounts, setBranchAccounts] = useState([]);
    const [filteredBranchAccounts, setFilteredBranchAccounts] = useState([]);
    const [salesReps, setSalesReps] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const rowsPerPage = 12; // Number of rows per page
    const navigate = useNavigate();

    // Load data from localStorage on component mount
    useEffect(() => {
        const branchAccountsData = loadFromLocalStorage('branchAccounts');
        const salesRepsData = loadFromLocalStorage('salesReps');
        const accountsData = loadFromLocalStorage('accounts');

        setBranchAccounts(branchAccountsData);
        setFilteredBranchAccounts(branchAccountsData);
        setSalesReps(salesRepsData);
        setAccounts(accountsData);
    }, []);

    // Filter branch accounts based on search query
    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = branchAccounts.filter((branchAccount) => {
            const { name, city } = branchAccount;
            return (
                name.toLowerCase().includes(lowerCaseQuery) ||
                city.toLowerCase().includes(lowerCaseQuery)
            );
        });
        setFilteredBranchAccounts(filtered);
        setCurrentPage(1); // Reset to first page after search
    }, [searchQuery, branchAccounts]);

    // Handle branch account creation
    const handleCreateBranchAccount = (branchAccountData) => {
        const updatedBranchAccounts = [...branchAccounts, branchAccountData];
        setBranchAccounts(updatedBranchAccounts);
        setFilteredBranchAccounts(updatedBranchAccounts);

        // Save updated branch accounts to local storage
        localStorage.setItem('branchAccounts', JSON.stringify(updatedBranchAccounts));

        setModalOpen(false);
    };

    // Handle deleting branch account
    const handleDeleteBranchAccount = (branchAccountId) => {
        const updatedBranchAccounts = branchAccounts.filter((account) => account.id !== branchAccountId);
        setBranchAccounts(updatedBranchAccounts);
        setFilteredBranchAccounts(updatedBranchAccounts);
        localStorage.setItem('branchAccounts', JSON.stringify(updatedBranchAccounts));
    };

    // Calculate pagination
    const totalPages = Math.ceil(filteredBranchAccounts.length / rowsPerPage);
    const paginatedBranchAccounts = filteredBranchAccounts.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div style={{ marginTop: '-25px', height: '100%', width: '100%' }}>
            {/* Search and create header */}
            <BranchesMap />
            <BranchAccountHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setModalOpen={setModalOpen}
            />

            {/* Branch Accounts Table */}
            <ScrollArea style={{ height: '65%', width: '100%' }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                <Table style={{ minWidth: '100%', width: '100%' }}>
                    <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                        <Table.Tr>
                            <Table.Th>Logo</Table.Th>
                            <Table.Th>Branch Account Name</Table.Th>
                            <Table.Th>Address</Table.Th>
                            <Table.Th>Phone Number</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Total Invoices</Table.Th>
                            <Table.Th>Gross Sales</Table.Th>
                            <Table.Th>Sales Rep</Table.Th>
                            <Table.Th />
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {paginatedBranchAccounts.map((branchAccount) => (
                            <BranchAccountRow
                                key={branchAccount.id}
                                branchAccount={branchAccount}
                                salesReps={salesReps}
                                navigate={navigate}
                                handleDeleteBranchAccount={handleDeleteBranchAccount}
                            />
                        ))}
                    </Table.Tbody>
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

            {/* Modal for Creating Branch Account */}
            <BranchAccountModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                accounts={accounts}
                salesReps={salesReps}
                handleCreateBranchAccount={handleCreateBranchAccount}
            />
        </div>
    );
}
