import React, { useState } from 'react';
import { TextInput, Paper, Button, Chip, Autocomplete, Text, Loader } from '@mantine/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface SalesReportSidebarProps {
  selectedCustomers: string[];
  setSelectedCustomers: (value: string[]) => void;
  selectedBrands: string[];
  setSelectedBrands: (value: string[]) => void;
  selectedSalesReps: string[];
  setSelectedSalesReps: (value: string[]) => void;
  customers: string[];
  brands: string[];
  salesReps: string[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  filteredSales: any[]; // Pass the filtered sales data
}

const SalesReportSidebar: React.FC<SalesReportSidebarProps> = ({
  selectedCustomers,
  setSelectedCustomers,
  selectedBrands,
  setSelectedBrands,
  selectedSalesReps,
  setSelectedSalesReps,
  customers,
  brands,
  salesReps,
  searchTerm,
  setSearchTerm,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  filteredSales,
}) => {
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [isLoadingSalesReps, setIsLoadingSalesReps] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Helper function to ensure filter arrays are valid
  const ensureArray = (value: any) => (Array.isArray(value) ? value : []);

  // Helper function to build the file name based on filters
  const generateFileName = () => {
    const customerFilter = ensureArray(selectedCustomers).length
      ? `Customers_${ensureArray(selectedCustomers).join('-')}`
      : 'All_Customers';
    const brandFilter = ensureArray(selectedBrands).length
      ? `Brands_${ensureArray(selectedBrands).join('-')}`
      : 'All_Brands';
    const salesRepFilter = ensureArray(selectedSalesReps).length
      ? `SalesReps_${ensureArray(selectedSalesReps).join('-')}`
      : 'All_SalesReps';
    const dateRange = startDate && endDate ? `Dates_${startDate}_to_${endDate}` : 'All_Dates';
    const searchFilter = searchTerm ? `Search_${searchTerm}` : 'All_Products';

    const filters = [customerFilter, brandFilter, salesRepFilter, dateRange, searchFilter]
      .filter(Boolean)
      .join('_');

    return `Sales_Report_${filters}.xlsx`;
  };

  // Function to save data to a spreadsheet
  const handleSaveToSpreadsheet = () => {
    const wsData = [
      [
        `Filters applied: Customers: ${ensureArray(selectedCustomers).join(', ') || 'All'}, Brands: ${
          ensureArray(selectedBrands).join(', ') || 'All'
        }, Sales Reps: ${ensureArray(selectedSalesReps).join(', ') || 'All'}, Dates: ${
          startDate || 'N/A'
        } to ${endDate || 'N/A'}, Search Term: ${searchTerm || 'N/A'}`,
      ],
      [], // Empty row
      ['Account', 'Invoice Number', 'Sales Rep', 'Sale Date', 'Brand', 'Product Code', 'Product Description', 'Quantity', 'Sell Price'],
    ];

    filteredSales.forEach((sale) => {
      wsData.push([
        sale.account,
        sale.invoice_number,
        sale.sales_rep || 'Unknown',
        sale.sale_date,
        sale.brand,
        sale.product_code,
        sale.product_description,
        Math.max(sale.quantity_sold || 0, sale.quantity_invoiced),
        sale.sell_price,
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');

    // Auto-size columns to fit text
    const wscols = [
      { wch: 20 }, // Account
      { wch: 20 }, // Invoice Number
      { wch: 20 }, // Sales Rep
      { wch: 15 }, // Sale Date
      { wch: 20 }, // Brand
      { wch: 20 }, // Product Code
      { wch: 50 }, // Product Description
      { wch: 10 }, // Quantity
      { wch: 15 }, // Sell Price
    ];
    ws['!cols'] = wscols;

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const buf = new ArrayBuffer(wbout.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xff;

    saveAs(new Blob([buf], { type: 'application/octet-stream' }), generateFileName());
  };

  return (
    <Paper style={{ padding: '16px', minWidth: '250px', maxWidth: '300px', maxHeight: '100vh', position: 'sticky', top: 0, marginTop: '20px' }}>
      <Text weight={500} size="lg">
        Filters
      </Text>

      {/* Customers Filter */}
      <Autocomplete
        label="Select Customers"
        placeholder="Select Customers"
        value={selectedCustomers.join(', ')}
        data={customers}
        onChange={(value) => setSelectedCustomers(value.split(', '))}
        rightSection={isLoadingCustomers ? <Loader size="sm" /> : null}
        mt="md"
      />

      {/* Brands Filter */}
      <Text weight={500} size="md" mt="md">
        Brands
      </Text>
      {brands.map((brand) => (
        <Chip
          key={brand}
          value={brand}
          checked={selectedBrands.includes(brand)}
          onClick={() =>
            setSelectedBrands(selectedBrands.includes(brand) ? selectedBrands.filter((b) => b !== brand) : [...selectedBrands, brand])
          }
          mt="xs"
        >
          {brand}
        </Chip>
      ))}

      {/* Sales Reps Filter */}
      <Autocomplete
        label="Select Sales Reps"
        placeholder="Select Sales Reps"
        value={selectedSalesReps.join(', ')}
        data={salesReps}
        onChange={(value) => setSelectedSalesReps(value.split(', '))}
        rightSection={isLoadingSalesReps ? <Loader size="sm" /> : null}
        mt="md"
      />

      {/* Start and End Date Filters */}
      <TextInput
        label="Start Date (YYYY-MM-DD)"
        value={startDate}
        onChange={(e) => setStartDate(e.currentTarget.value)}
        placeholder="Enter start date"
        mt="md"
      />
      <TextInput
        label="End Date (YYYY-MM-DD)"
        value={endDate}
        onChange={(e) => setEndDate(e.currentTarget.value)}
        placeholder="Enter end date"
        mt="md"
      />

      {/* Search Products */}
      <TextInput
        label="Search Products"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
        mt="md"
      />

      {/* Save to Spreadsheet Button */}
      <Button variant="default" fullWidth mt="md" color='red' onClick={handleSaveToSpreadsheet}>
        Save to Spreadsheet
      </Button>
    </Paper>
  );
};

export default SalesReportSidebar;
