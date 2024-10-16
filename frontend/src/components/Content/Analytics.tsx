import { useState, useEffect } from 'react';
import { Table, MultiSelect, Group, ScrollArea, Button, Pagination } from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import classes from './Analytics.module.css';

type AnalyticsItem = {
  product_code: string;
  product_description: string;
  sum_price: number;
  amount_sold: number;
  brand?: string;
  category?: { name: string };
  sub_category?: { name: string };
  tags?: { name: string }[];
  account?: string;
  root_accounts?: string[];
  sales_rep?: string;
  quantity_sold?: string;
  quantity_invoiced?: string;
  sell_price: string;
};

export function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsItem[]>([]);
  const [filteredData, setFilteredData] = useState<AnalyticsItem[]>([]); // Keeping it if required in future.
  const [groupedData, setGroupedData] = useState<AnalyticsItem[]>([]);
  const [brands, setBrands] = useState<{ value: string; label: string }[]>([]);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [subCategories, setSubCategories] = useState<{ value: string; label: string }[]>([]);
  const [tags, setTags] = useState<{ value: string; label: string }[]>([]);
  const [accounts, setAccounts] = useState<{ value: string; label: string }[]>([]);
  const [rootAccounts, setRootAccounts] = useState<{ value: string; label: string }[]>([]);
  const [salesReps, setSalesReps] = useState<{ value: string; label: string }[]>([]);

  const [filters, setFilters] = useState({
    brand: [] as string[],
    category: [] as string[],
    subCategory: [] as string[],
    tags: [] as string[],
    accounts: [] as string[],
    rootAccounts: [] as string[],
    salesReps: [] as string[],
  });

  const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10); // Commented out because it's unused.
  const rowsPerPage = 10; // Keep this static for now to avoid the unused variable error.
  const [sortField, setSortField] = useState<'sum_price' | 'amount_sold'>('sum_price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedAnalytics = localStorage.getItem('analytics');
    if (storedAnalytics) {
      const data: AnalyticsItem[] = JSON.parse(storedAnalytics);
      setAnalyticsData(data);
      setFilteredData(data);
      extractFilterOptions(data);
    }
  }, []);

  // Function to extract unique filter options from the data
  const extractFilterOptions = (data: AnalyticsItem[]) => {
    const uniqueBrands = [...new Set(data.map((item) => item.brand).filter(Boolean))].map((brand) => ({
      value: brand!,
      label: brand!,
    }));
    const uniqueCategories = [...new Set(data.map((item) => item.category?.name).filter(Boolean))].map(
      (category) => ({
        value: category!,
        label: category!,
      })
    );
    const uniqueSubCategories = [...new Set(data.map((item) => item.sub_category?.name).filter(Boolean))].map(
      (subCategory) => ({
        value: subCategory!,
        label: subCategory!,
      })
    );
    const uniqueTags = [
      ...new Set(data.flatMap((item) => (item.tags || []).map((tag) => tag?.name)).filter(Boolean)),
    ].map((tag) => ({
      value: tag!,
      label: tag!,
    }));
    const uniqueAccounts = [...new Set(data.map((item) => item.account).filter(Boolean))].map((account) => ({
      value: account!,
      label: account!,
    }));
    const uniqueRootAccounts = [...new Set(data.flatMap((item) => item.root_accounts || []).filter(Boolean))].map(
      (rootAccount) => ({
        value: rootAccount!,
        label: rootAccount!,
      })
    );
    const uniqueSalesReps = [...new Set(data.map((item) => item.sales_rep).filter(Boolean))].map((salesRep) => ({
      value: salesRep!,
      label: salesRep!,
    }));

    setBrands(uniqueBrands);
    setCategories(uniqueCategories);
    setSubCategories(uniqueSubCategories);
    setTags(uniqueTags);
    setAccounts(uniqueAccounts);
    setRootAccounts(uniqueRootAccounts);
    setSalesReps(uniqueSalesReps);
  };

  // Filter and group data based on selected filters
  useEffect(() => {
    let filtered = analyticsData;

    if (filters.brand.length) {
      filtered = filtered.filter((item) => filters.brand.includes(item.brand!));
    }
    if (filters.category.length) {
      filtered = filtered.filter((item) => filters.category.includes(item.category?.name!));
    }
    if (filters.subCategory.length) {
      filtered = filtered.filter((item) => filters.subCategory.includes(item.sub_category?.name!));
    }
    if (filters.tags.length) {
      filtered = filtered.filter((item) =>
        filters.tags.every((tag) => (item.tags || []).some((t) => t?.name === tag))
      );
    }
    if (filters.accounts.length) {
      filtered = filtered.filter((item) => filters.accounts.includes(item.account!));
    }
    if (filters.rootAccounts.length) {
      filtered = filtered.filter((item) =>
        filters.rootAccounts.every((root) => (item.root_accounts || []).includes(root))
      );
    }
    if (filters.salesReps.length) {
      filtered = filtered.filter((item) => filters.salesReps.includes(item.sales_rep!));
    }

    setFilteredData(filtered);
    groupAndSortData(filtered);
  }, [filters, sortField, sortOrder, analyticsData]);

  // Group and sort data by product_code
  const groupAndSortData = (filteredData: AnalyticsItem[]) => {
    const grouped = filteredData.reduce((acc: any, item) => {
      const existingGroup = acc.find((group: any) => group.product_code === item.product_code);
      const quantity = item.quantity_sold ? parseFloat(item.quantity_sold) : parseFloat(item.quantity_invoiced!);
      const price = parseFloat(item.sell_price);

      if (existingGroup) {
        existingGroup.sum_price += quantity * price;
        existingGroup.amount_sold += quantity;
      } else {
        acc.push({
          product_code: item.product_code,
          product_description: item.product_description,
          sum_price: quantity * price,
          amount_sold: quantity,
        });
      }

      return acc;
    }, []);

    const sorted = grouped.sort((a: any, b: any) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    });

    setGroupedData(sorted);
  };

  // Paginate data
  const paginatedData = groupedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Handle sorting
  const handleSort = (field: 'sum_price' | 'amount_sold') => {
    setSortField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className={classes.container}>
      <Group position="apart" className={classes.filterGroup}>
        <MultiSelect data={brands} placeholder="Filter by brands" onChange={(value) => setFilters((prev) => ({ ...prev, brand: value }))} />
        <MultiSelect data={categories} placeholder="Filter by categories" onChange={(value) => setFilters((prev) => ({ ...prev, category: value }))} />
        <MultiSelect data={subCategories} placeholder="Filter by subcategories" onChange={(value) => setFilters((prev) => ({ ...prev, subCategory: value }))} />
        <MultiSelect data={tags} placeholder="Filter by tags" onChange={(value) => setFilters((prev) => ({ ...prev, tags: value }))} />
        <MultiSelect data={accounts} placeholder="Filter by accounts" onChange={(value) => setFilters((prev) => ({ ...prev, accounts: value }))} />
        <MultiSelect data={rootAccounts} placeholder="Filter by root accounts" onChange={(value) => setFilters((prev) => ({ ...prev, rootAccounts: value }))} />
        <MultiSelect data={salesReps} placeholder="Filter by sales reps" onChange={(value) => setFilters((prev) => ({ ...prev, salesReps: value }))} />
      </Group>

      <ScrollArea className={classes.tableContainer}>
        <Table>
          <thead>
            <tr>
              <th className={classes.rightAligned}>Product Code</th>
              <th className={classes.rightAligned}>Description</th>
              <th className={classes.rightAligned}>
                <Button variant="subtle" onClick={() => handleSort('sum_price')}>
                  Total Price Sold {sortField === 'sum_price' && (sortOrder === 'asc' ? <IconSortAscending /> : <IconSortDescending />)}
                </Button>
              </th>
              <th className={classes.rightAligned}>
                <Button variant="subtle" onClick={() => handleSort('amount_sold')}>
                  Total Quantity Sold {sortField === 'amount_sold' && (sortOrder === 'asc' ? <IconSortAscending /> : <IconSortDescending />)}
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((group) => (
              <tr key={group.product_code}>
                <td className={classes.rightAligned}>{group.product_code}</td>
                <td className={classes.rightAligned}>{group.product_description}</td>
                <td className={classes.rightAligned}>{group.sum_price.toFixed(2)}</td>
                <td className={classes.rightAligned}>{group.amount_sold.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ScrollArea>

      <Pagination
        page={currentPage}
        onChange={setCurrentPage}
        total={Math.ceil(groupedData.length / rowsPerPage)}
        className={classes.pagination}
      />
    </div>
  );
}
