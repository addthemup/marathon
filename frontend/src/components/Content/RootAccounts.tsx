import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    fetchRootAccounts,
    fetchSalesReps,
    fetchBranchAccounts,
    updateAccountSalesRep,
    createRootAccount,
    deleteRootAccount
} from '../Api/AccountsApi';
import {
    Table,
    ScrollArea,
    Select,
    LoadingOverlay,
    Text,
    TextInput,
    Group,
    Button,
    ActionIcon,
} from '@mantine/core';
import { IconPlus, IconX } from '@tabler/icons-react';
import { RootAccountModal } from './RootAccountModal';
import { showNotification } from '@mantine/notifications';
import { useModals } from '@mantine/modals';
import classes from './Accounts.module.css';
import cx from 'clsx';

// Helper functions for localStorage operations
const loadFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) || null;
const saveToLocalStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export function RootAccounts() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rootAccounts, setRootAccounts] = useState([]);
    const [salesReps, setSalesReps] = useState([]);
    const [branchAccounts, setBranchAccounts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRootAccounts, setFilteredRootAccounts] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const navigate = useNavigate();
    const modals = useModals();

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);

                const cachedRootAccounts = loadFromLocalStorage('rootAccounts');
                const cachedSalesReps = loadFromLocalStorage('salesReps');
                const cachedBranchAccounts = loadFromLocalStorage('branchAccounts');

                if (cachedRootAccounts && cachedSalesReps && cachedBranchAccounts) {
                    setRootAccounts(cachedRootAccounts);
                    setSalesReps(cachedSalesReps);
                    setBranchAccounts(cachedBranchAccounts);
                    setFilteredRootAccounts(cachedRootAccounts);
                } else {
                    const [rootAccountsData, salesRepsData, branchAccountsData] = await Promise.all([
                        fetchRootAccounts(),
                        fetchSalesReps(),
                        fetchBranchAccounts()
                    ]);

                    setRootAccounts(rootAccountsData);
                    setSalesReps(salesRepsData);
                    setBranchAccounts(branchAccountsData);
                    setFilteredRootAccounts(rootAccountsData);

                    saveToLocalStorage('rootAccounts', rootAccountsData);
                    saveToLocalStorage('salesReps', salesRepsData);
                    saveToLocalStorage('branchAccounts', branchAccountsData);
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to load data');
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = rootAccounts.filter((rootAccount) => {
            const { name, branch_accounts_details } = rootAccount;
            const subAccounts = (branch_accounts_details || [])
                .flatMap(branch => branch.accounts_details || [])
                .map((account) => `${account.name} ${account.customer_number}`)
                .join(' ')
                .toLowerCase();
            return name.toLowerCase().includes(lowerCaseQuery) || subAccounts.includes(lowerCaseQuery);
        });

        setFilteredRootAccounts(filtered);
    }, [searchQuery, rootAccounts]);

    const handleSalesRepChange = async (accountId, newSalesRepId) => {
        try {
            setLoading(true);
            await updateAccountSalesRep(accountId, newSalesRepId);
            const updatedRootAccounts = rootAccounts.map((rootAccount) => ({
                ...rootAccount,
                branch_accounts_details: rootAccount.branch_accounts_details.map((branch) => ({
                    ...branch,
                    accounts_details: branch.accounts_details.map((account) =>
                        account.id === accountId
                            ? { ...account, sales_rep: salesReps.find((rep) => rep.id === parseInt(newSalesRepId)) }
                            : account
                    ),
                })),
            }));
            setRootAccounts(updatedRootAccounts);
            setFilteredRootAccounts(updatedRootAccounts);
            saveToLocalStorage('rootAccounts', updatedRootAccounts);
            setLoading(false);
        } catch (err) {
            setError('Failed to update sales rep');
            setLoading(false);
        }
    };

    const handleAccountClick = (account) => {
        localStorage.setItem('selectedAccount', JSON.stringify(account));
        navigate(`/accounts/${account.id}`);
    };

    const handleCreateRootAccount = async (rootAccountData) => {
        try {
            await createRootAccount(rootAccountData);
            const refreshedRootAccounts = await fetchRootAccounts();
            setRootAccounts(refreshedRootAccounts);
            setFilteredRootAccounts(refreshedRootAccounts);
            saveToLocalStorage('rootAccounts', refreshedRootAccounts);
            setModalOpen(false);
        } catch (err) {
            setError('Failed to create root account');
        }
    };

    // Delete root account
    const handleDeleteRootAccount = async (rootAccountId) => {
        try {
            await deleteRootAccount(rootAccountId);
            const updatedRootAccounts = rootAccounts.filter((rootAccount) => rootAccount.id !== rootAccountId);
            setRootAccounts(updatedRootAccounts);
            setFilteredRootAccounts(updatedRootAccounts);

            saveToLocalStorage('rootAccounts', updatedRootAccounts);

            showNotification({
                title: 'Root Account Deleted',
                message: 'The root account was successfully deleted',
                color: 'green',
            });
        } catch (error) {
            showNotification({
                title: 'Error',
                message: 'Failed to delete root account',
                color: 'red',
            });
        }
    };

    // Confirmation modal for deleting a root account
    const confirmDelete = (rootAccountId) => {
        modals.openConfirmModal({
            title: 'Confirm Delete',
            centered: true,
            children: <Text>Are you sure you want to delete this root account?</Text>,
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => handleDeleteRootAccount(rootAccountId),
        });
    };

    if (loading) return <LoadingOverlay visible={loading} />;
    if (error) return <Text color="red">{error}</Text>;

    const rows = filteredRootAccounts.map((rootAccount) => (
        <Table.Tr key={rootAccount.id}>
            <Table.Td>
                <Text>{rootAccount.name}</Text>
            </Table.Td>
            <Table.Td colSpan={5}>
                <Table style={{ width: '100%' }}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Branch Account Name</Table.Th>
                            <Table.Th>Sub-Account Name</Table.Th>
                            <Table.Th>Customer Number</Table.Th>
                            <Table.Th>Address</Table.Th>
                            <Table.Th>Total Invoices</Table.Th>
                            <Table.Th>Gross Sum</Table.Th>
                            <Table.Th>Sales Rep</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {(rootAccount.branch_accounts_details || []).flatMap((branch) =>
                            (branch.accounts_details || []).map((account) => (
                                <Table.Tr key={account.id}>
                                    <Table.Td>{branch.name}</Table.Td>
                                    <Table.Td>{account.name}</Table.Td>
                                    <Table.Td>{account.customer_number}</Table.Td>
                                    <Table.Td>{`${account.address}, ${account.city}, ${account.state} ${account.zip_code}`}</Table.Td>
                                    <Table.Td>{account.total_invoices}</Table.Td>
                                    <Table.Td>${account.gross_sum?.toFixed(2)}</Table.Td>
                                    <Table.Td>
                                        <Select
                                            value={account.sales_rep?.id?.toString() || ''}
                                            onChange={(newSalesRepId) => handleSalesRepChange(account.id, newSalesRepId)}
                                            data={salesReps.map((rep) => ({
                                                value: rep.id.toString(),
                                                label: rep.full_name,
                                            }))}
                                            placeholder={account.sales_rep ? account.sales_rep.full_name : 'Select Sales Rep'}
                                            nothingFound="No sales reps available"
                                            searchable
                                            disabled={loading}
                                        />
                                    </Table.Td>
                                </Table.Tr>
                            ))
                        )}
                    </Table.Tbody>
                </Table>
            </Table.Td>
            {/* Delete icon */}
            <Table.Td>
                <ActionIcon color="red" onClick={() => confirmDelete(rootAccount.id)}>
                    <IconX size={16} />
                </ActionIcon>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div style={{ marginTop: '-25px', height: '100%', width: '100%' }}>
            <Group position="right" mb="md">
                <TextInput
                    placeholder="Search by Root Account or Sub-Account"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                />
                <Button leftIcon={<IconPlus />} onClick={() => setModalOpen(true)}>
                    Create Root Account
                </Button>
            </Group>

            <ScrollArea style={{ height: '100%', width: '100%' }}>
                <Table style={{ minWidth: '100%', width: '100%' }}>
                    <Table.Thead className={cx(classes.header)}>
                        <Table.Tr>
                            <Table.Th>Root Account Name</Table.Th>
                            <Table.Th>Branch and Sub-Accounts</Table.Th>
                            <Table.Th />
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </ScrollArea>

            <RootAccountModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                branchAccounts={branchAccounts} // Pass the correct branch accounts
                salesReps={salesReps}
                handleCreateRootAccount={handleCreateRootAccount}
            />
        </div>
    );
}
