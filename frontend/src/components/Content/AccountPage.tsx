import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Text,
  LoadingOverlay,
  Group,
  Table,
  Grid,
  Paper,
  ScrollArea,
  Breadcrumbs,
  Anchor,
  Pagination,
} from '@mantine/core';
import { fetchAccountSalesInvoice } from '../Api/AccountPageApi';
import AccountMap from './AccountMap';
import AccountCard from './AccountCard';
import AccountRep from './AccountRep'; // Import the AccountRep component
import classes from './AccountPage.module.css';

// Types for account data and sales data
interface ProductSales {
  product_code: string;
  product_description: string;
  total_sales: number;
  average_time_between_sales: number;
  time_since_last_purchase: number | null;
}

interface AccountData {
  address: string;
  city: string;
  state: string;
  zip_code: string;
  sales_rep: any; // Replace `any` with the correct type for sales rep if available
  product_sales: ProductSales[];
}

export function AccountPage() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ field: keyof ProductSales; direction: 'asc' | 'desc' }>({
    field: 'total_sales',
    direction: 'desc',
  });
  const [activePage, setActivePage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadAccountData = async () => {
      try {
        setLoading(true);
        const data = await fetchAccountSalesInvoice(accountId);
        setAccountData(data);
      } catch (e) {
        setError('Failed to load account data');
      } finally {
        setLoading(false);
      }
    };
    loadAccountData();
  }, [accountId]);

  const handlePrevAccount = () => {
    navigate(`/accounts/${parseInt(accountId!) - 1}`);
  };

  const handleNextAccount = () => {
    navigate(`/accounts/${parseInt(accountId!) + 1}`);
  };

  const breadcrumbs = (
    <Breadcrumbs>
      <Anchor onClick={() => navigate('/')}>Accounts</Anchor>
      <Text>{`Account ${accountId}`}</Text>
    </Breadcrumbs>
  );

  const sortedSalesData = [...(accountData?.product_sales || [])].sort((a, b) => {
    const aValue = a[sortConfig.field] || 0;
    const bValue = b[sortConfig.field] || 0;
    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const handleSort = (field: keyof ProductSales) => {
    setSortConfig((prevConfig) => ({
      field,
      direction: prevConfig.field === field && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const paginatedSalesData = sortedSalesData.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  if (loading) return <LoadingOverlay visible />;
  if (error) return <Text color="red">{error}</Text>;
  if (!accountData) return <Text>No account data available</Text>;

  return (
    <div className={classes.accountPageContainer}>
      {breadcrumbs}
      <Group position="apart" mt="md" mb="md">
        <Anchor onClick={handlePrevAccount}>&larr; Previous Account</Anchor>
        <Anchor onClick={handleNextAccount}>Next Account &rarr;</Anchor>
      </Group>

      <Grid>
        <Grid.Col span={4} style={{ minHeight: 400, maxHeight: 400 }}>
          <AccountCard accountData={accountData} />
        </Grid.Col>

        <Grid.Col span={4} style={{ minHeight: 400, maxHeight: 400 }}>
          <Paper shadow="xs" padding="md" style={{ height: '100%' }}>
            <AccountMap
              address={accountData.address}
              city={accountData.city}
              state={accountData.state}
              zip_code={accountData.zip_code}
            />
          </Paper>
        </Grid.Col>

        <Grid.Col span={4} style={{ minHeight: 400, maxHeight: 400 }}>
          <Paper shadow="xs" padding="md" className={classes.salesRepInfo} style={{ height: '100%' }}>
            <AccountRep repData={accountData.sales_rep} />
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Product Sales Table */}
      <Paper shadow="xs" padding="md" className={classes.salesRepInfo} style={{ height: '100%' }}>
        <Group className={classes.productSalesGroup} mt="lg">
          <ScrollArea style={{ margin: '10px', maxHeight: '500px', width: '100%' }}>
            <Table highlightOnHover>
              <thead>
                <tr>
                  <th onClick={() => handleSort('product_code')}>Product Code</th>
                  <th>Description</th>
                  <th onClick={() => handleSort('total_sales')}>Total Sales</th>
                  <th>Average Time Between Sales (days)</th>
                  <th>Time Since Last Purchase (days)</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSalesData.length > 0 ? (
                  paginatedSalesData.map((product, index) => (
                    <tr key={index}>
                      <td>{product.product_code || 'N/A'}</td>
                      <td>{product.product_description || 'N/A'}</td>
                      <td>${product.total_sales ? product.total_sales.toFixed(2) : 'N/A'}</td>
                      <td>{product.average_time_between_sales ? product.average_time_between_sales.toFixed(2) : 'N/A'}</td>
                      <td>{product.time_since_last_purchase !== null ? product.time_since_last_purchase : 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>No product sales data available</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </ScrollArea>

          <Pagination
            total={Math.ceil(sortedSalesData.length / itemsPerPage)}
            page={activePage}
            onChange={setActivePage}
            mt="md"
          />
        </Group>
      </Paper>
    </div>
  );
}
