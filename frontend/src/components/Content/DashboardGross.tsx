import React from 'react';
import { Table, Grid } from '@mantine/core';

interface DashboardGrossProps {
  grossSalesData: {
    gross_sales_by_year: { year: string | null; total_sales: number }[];
  } | null;
}

const DashboardGross: React.FC<DashboardGrossProps> = ({ grossSalesData }) => {
  return (
    <Grid.Col span={4}>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Year</th>
            <th>Gross Sales</th>
          </tr>
        </thead>
        <tbody>
          {grossSalesData?.gross_sales_by_year.map((entry: any, index: number) => (
            <tr key={index}>
              <td>{entry.year ? entry.year.slice(0, 4) : 'Unknown'}</td>
              <td>${entry.total_sales.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Grid.Col>
  );
};

export default DashboardGross;
