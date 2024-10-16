import { Table, Text, Select } from '@mantine/core';

const SubAccountRow = ({ account, salesReps }) => {
    const handleSalesRepChange = (accountId, newSalesRepId) => {
        // Update the sales rep for the sub-account
    };

    return (
        <Table.Tr>
            <Table.Td>
                <Text component="a" className="clickableAccountName">
                    {account.name}
                </Text>
            </Table.Td>
            <Table.Td>{account.customer_number}</Table.Td>
            <Table.Td>{`${account.address}, ${account.city}, ${account.state} ${account.zip_code}`}</Table.Td>
            <Table.Td>{account.total_invoices}</Table.Td>
            <Table.Td>${account.gross_sum ? account.gross_sum.toFixed(2) : 'N/A'}</Table.Td>
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
                />
            </Table.Td>
        </Table.Tr>
    );
};

export default SubAccountRow;
