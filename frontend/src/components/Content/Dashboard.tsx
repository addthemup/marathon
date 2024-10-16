import React, { useEffect, useState } from 'react';
import { Grid, Loader, Container, Table } from '@mantine/core';
import {
  fetchGrossSalesYearlyYTD,
  fetchTopTenBranchAccountsYTD,
  fetchTopTenSalesRepsYTD,
  fetchTopBrandsYTD,
} from '../Api/DashboardApi';
import DashboardBranch from './DashboardBranch';
import DashboardGross from './DashboardGross';
import DashboardRepMonthly from './DashboardRepMonthly'; // Import the new component

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [grossSalesData, setGrossSalesData] = useState<any>(null);
  const [branchAccountsData, setBranchAccountsData] = useState<any[]>([]);
  const [salesRepsData, setSalesRepsData] = useState<any[]>([]);
  const [brandsData, setBrandsData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch all data in parallel
    Promise.all([
      fetchGrossSalesYearlyYTD(),
      fetchTopTenBranchAccountsYTD(),
      fetchTopTenSalesRepsYTD(),
      fetchTopBrandsYTD(),
    ]).then(([grossSales, branches, salesReps, brands]) => {
      setGrossSalesData(grossSales);
      setBranchAccountsData(branches);
      setSalesRepsData(salesReps);
      setBrandsData(brands);
      setLoading(false);
    }).catch(error => {
      console.error("Failed to fetch dashboard data", error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Container>
        <Loader size="xl" />
      </Container>
    );
  }

  return (
    <Container fluid style={{ minWidth: '100%' }}>
      <Grid>
        {/* Gross Sales Yearly and YTD */}

        <Grid.Col span={6}>

        <DashboardBranch branchAccountsData={branchAccountsData} />
        </Grid.Col>

        <DashboardRepMonthly /> {/* Include the new component */}

        <DashboardGross grossSalesData={grossSalesData} />

        {/* Top 10 Sales Reps YTD */}
        <Grid.Col span={4}>
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Sales Rep</th>
                <th>YTD Sales</th>
              </tr>
            </thead>
            <tbody>
              {salesRepsData.map((rep: any, index: number) => (
                <tr key={index}>
                  <td>{rep.sales_rep.full_name}</td>
                  <td>${rep.sales_rep.ytd_total_sales.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Grid.Col>

        {/* Top 10 Brands YTD */}
        <Grid.Col span={4}>
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Brand</th>
                <th>YTD Sales</th>
              </tr>
            </thead>
            <tbody>
              {brandsData.map((brand: any, index: number) => (
                <tr key={index}>
                  <td>{brand.brand.name}</td>
                  <td>${brand.brand.ytd_total_sales.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Grid.Col>

        {/* Monthly Sales by Sales Rep */}

      </Grid>
    </Container>
  );
};

export default Dashboard;
