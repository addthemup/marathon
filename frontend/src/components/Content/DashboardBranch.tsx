import { Table, Progress, Anchor, Text, Group, Avatar } from '@mantine/core';
import { Fragment } from 'react';
import classes from './DashboardBranch.module.css';

interface BranchAccount {
  branch_account: {
    id: number;
    name: string;
    ytd_total_sales: number;
    sales_rep: {
      full_name: string;
      profile_pic: string;
    } | null;
  };
  yearly_sales: { year: number | null; total_sales: number }[];
}

interface DashboardBranchProps {
  branchAccountsData: BranchAccount[];
}

const DashboardBranch: React.FC<DashboardBranchProps> = ({ branchAccountsData }) => {
  const rows = branchAccountsData.map((branch) => {
    const ytdSales = branch.branch_account.ytd_total_sales;
    const sales2023 = branch.yearly_sales.find((sale) => sale.year === 2023)?.total_sales || 0;
    const totalSales = ytdSales + sales2023;
    
    // Calculate percentage for progress bars
    const ytdSalesPercentage = (ytdSales / totalSales) * 100;
    const sales2023Percentage = (sales2023 / totalSales) * 100;

    // Construct profile picture URL
    const profilePicUrl = branch.branch_account.sales_rep?.profile_pic
      ? `http://127.0.0.1:8000${branch.branch_account.sales_rep.profile_pic}`
      : null;

    return (
      <Table.Tr key={branch.branch_account.id}>
        <Table.Td>
          <Anchor component="button" fz="sm">
            {branch.branch_account.name}
          </Anchor>
        </Table.Td>
        <Table.Td>${ytdSales.toLocaleString()}</Table.Td>
        <Table.Td>
          {branch.branch_account.sales_rep ? (
            <Group spacing="sm">
              <Avatar src={profilePicUrl} radius="xl" />
              <Text fz="sm">{branch.branch_account.sales_rep.full_name}</Text>
            </Group>
          ) : (
            <Text fz="sm">N/A</Text>
          )}
        </Table.Td>
        <Table.Td>
          <Group justify="space-between">
            <Text fz="xs" c="teal" fw={700}>
              {ytdSalesPercentage.toFixed(0)}% (YTD)
            </Text>
            <Text fz="xs" c="red" fw={700}>
              {sales2023Percentage.toFixed(0)}% (2023)
            </Text>
          </Group>
          <Progress.Root>
            <Progress.Section
              className={classes.progressSection}
              value={ytdSalesPercentage}
              color="teal"
            />
            <Progress.Section
              className={classes.progressSection}
              value={sales2023Percentage}
              color="red"
            />
          </Progress.Root>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Table.ScrollContainer minWidth="100%" style={{ width: '100%' }}>
      <Table striped highlightOnHover verticalSpacing="xs" style={{ minWidth: '100%', width: '100%' }}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Branch</Table.Th>
            <Table.Th>YTD Sales</Table.Th>
            <Table.Th>Sales Rep</Table.Th>
            <Table.Th>Sales Distribution</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};

export default DashboardBranch;
