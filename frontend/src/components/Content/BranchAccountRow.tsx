import React from 'react';
import { Table, ActionIcon, Text, Select, Avatar } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

const BranchAccountRow = ({ branchAccount, salesReps, navigate, handleDeleteBranchAccount }) => {
  const handleBranchAccountClick = (branchAccount) => {
    navigate(`/branch-accounts/${branchAccount.id}`);
  };

  return (
    <Table.Tr>
      <Table.Td>
        <Avatar src={branchAccount.logo || 'default-placeholder.png'} size="md" radius="xl" />
      </Table.Td>
      <Table.Td>
        <Text
          component="a"
          className="clickableAccountName"
          onClick={() => handleBranchAccountClick(branchAccount)}
        >
          {branchAccount.name}
        </Text>
      </Table.Td>
      <Table.Td>{`${branchAccount.address}, ${branchAccount.city}, ${branchAccount.state} ${branchAccount.zip_code}`}</Table.Td>
      <Table.Td>{branchAccount.phone_number || 'N/A'}</Table.Td>
      <Table.Td>{branchAccount.email || 'N/A'}</Table.Td>
      <Table.Td>
        {branchAccount.branch_total_invoices}
      </Table.Td>
      <Table.Td>
        ${branchAccount.branch_gross_sum.toFixed(2)}
      </Table.Td>
      <Table.Td>
        <Select
          value={branchAccount.sales_rep?.id?.toString() || ''}
          onChange={(newSalesRepId) => handleSalesRepChange(branchAccount.id, newSalesRepId)}
          data={salesReps.map((rep) => ({
            value: rep.id.toString(),
            label: rep.full_name,
          }))}
          placeholder={branchAccount.sales_rep ? branchAccount.sales_rep.full_name : 'Select Sales Rep'}
          nothingFound="No sales reps available"
          searchable
        />
      </Table.Td>
      <Table.Td>
        <ActionIcon color="red" onClick={() => handleDeleteBranchAccount(branchAccount.id)}>
          <IconX size={16} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  );
};

export default BranchAccountRow;
