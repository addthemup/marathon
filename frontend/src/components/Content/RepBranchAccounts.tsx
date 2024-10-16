import React, { useState } from 'react';
import { Table, Text, Card } from '@mantine/core';

interface BranchAccount {
  branch_account: {
    id: number;
    name: string;
    city: string;
    state: string;
    zip_code: string;
  };
  gross_sales: number;
  invoice_count: number;
}

interface RepBranchAccountsProps {
  branchAccounts: BranchAccount[];
}

const RepBranchAccounts = ({ branchAccounts }: RepBranchAccountsProps) => {
  const [sortBy, setSortBy] = useState<'gross_sales' | 'invoice_count'>('gross_sales');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Sort the branch accounts based on the selected column and direction
  const sortedBranchAccounts = [...branchAccounts].sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];

    if (sortDirection === 'asc') {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });

  // Handle column sorting
  const handleSort = (column: 'gross_sales' | 'invoice_count') => {
    if (column === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); // Toggle direction
    } else {
      setSortBy(column); // Change sorting column
      setSortDirection('desc'); // Default to descending
    }
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder style={{ minHeight: '440px' }}>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Branch Name</th>
            <th>City</th>
            <th>State</th>
            <th
              onClick={() => handleSort('gross_sales')}
              style={{ cursor: 'pointer' }}
            >
              Gross Sales {sortBy === 'gross_sales' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              onClick={() => handleSort('invoice_count')}
              style={{ cursor: 'pointer' }}
            >
              Invoice Count {sortBy === 'invoice_count' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedBranchAccounts.length > 0 ? (
            sortedBranchAccounts.map((branch) => (
              <tr key={branch.branch_account.id}>
                <td>{branch.branch_account.name}</td>
                <td>{branch.branch_account.city}</td>
                <td>{branch.branch_account.state}</td>
                <td>${branch.gross_sales.toFixed(2)}</td>
                <td>{branch.invoice_count}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>
                <Text align="center">No branch accounts available.</Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Card>
  );
};

export default RepBranchAccounts;
