import React, { useState, useEffect } from 'react';
import { Table, ScrollArea, LoadingOverlay, Pagination, Button, Box } from '@mantine/core';
import { fetchSalesReportData } from '../Api/SalesReportApi'; // Updated API to fetch sales report data
import SalesReportSidebar from './SalesReportSidebar';  // Import the sidebar component
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const SalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredSales, setFilteredSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);  // For customer filtering
  const [selectedBrands, setSelectedBrands] = useState([]);  // For brand filtering
  const [selectedSalesReps, setSelectedSalesReps] = useState([]);  // For sales rep filtering
  const [brands, setBrands] = useState([]);  // For storing all available brands
  const [customers, setCustomers] = useState([]);  // For storing all available customers
  const [salesReps, setSalesReps] = useState([]);  // For storing all available sales reps
  const [startDate, setStartDate] = useState('');  // For start date filter
  const [endDate, setEndDate] = useState('');  // For end date filter
  const [currentPage, setCurrentPage] = useState(1);
  const [sortByDate, setSortByDate] = useState<'asc' | 'desc'>('asc');
  const rowsPerPage = 18;

  // Fetch sales data on component mount
  useEffect(() => {
    const loadSalesData = async () => {
      try {
        setLoading(true);
        const sales = await fetchSalesReportData();
        setSalesData(sales);
        setFilteredSales(sales);  // Initialize filtered sales with all sales data
        extractFilters(sales);  // Extract unique brands, customers, and sales reps
        setLoading(false);
      } catch (err) {
        setError('Failed to load sales data');
        setLoading(false);
      }
    };

    loadSalesData();
  }, []);

  // Extract unique brands, customers, and sales reps for filtering
  const extractFilters = (sales) => {
    const brandsSet = new Set();
    const customersSet = new Set();
    const salesRepsSet = new Set(['Unknown']);  // Include 'Unknown' for cases where there is no sales rep

    sales.forEach((sale) => {
      brandsSet.add(sale.brand);
      customersSet.add(sale.account);
      salesRepsSet.add(sale.sales_rep || 'Unknown');  // Add 'Unknown' for null sales reps
    });

    setBrands([...brandsSet]);
    setCustomers([...customersSet]);
    setSalesReps([...salesRepsSet]);
  };

  // Filter sales based on the selected filters
  useEffect(() => {
    handleGenerateReport();
  }, [selectedCustomers, selectedBrands, selectedSalesReps, searchTerm, salesData, startDate, endDate]);

  // Function to filter sales based on the selected filters
  const handleGenerateReport = () => {
    const filtered = salesData.filter((sale) => {
      const productDescription = sale.product_description.toLowerCase();
      const productCode = sale.product_code.toLowerCase();
      const customer = sale.account;
      const brand = sale.brand.toLowerCase();
      const salesRep = sale.sales_rep || 'Unknown';  // Default to 'Unknown' if no sales rep
      const saleDate = new Date(sale.sale_date);

      const isCustomerMatch = selectedCustomers.length > 0 ? selectedCustomers.includes(customer) : true;
      const isBrandMatch = selectedBrands.length > 0 ? selectedBrands.includes(sale.brand) : true;
      const isSalesRepMatch = selectedSalesReps.length > 0 ? selectedSalesReps.includes(salesRep) : true;
      const isSearchMatch = productDescription.includes(searchTerm.toLowerCase()) || productCode.includes(searchTerm.toLowerCase());
      
      const isDateInRange = (startDate && endDate) 
        ? (saleDate >= new Date(startDate) && saleDate <= new Date(endDate)) 
        : true;

      return isCustomerMatch && isBrandMatch && isSalesRepMatch && isSearchMatch && isDateInRange;
    });

    setFilteredSales(filtered);
    setCurrentPage(1);  // Reset to the first page after filtering
  };

  // Function to handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to handle sorting by sale date
  const handleSortByDate = () => {
    const sortedSales = [...filteredSales].sort((a, b) => {
      const dateA = new Date(a.sale_date).getTime();
      const dateB = new Date(b.sale_date).getTime();
      return sortByDate === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredSales(sortedSales);
    setSortByDate(sortByDate === 'asc' ? 'desc' : 'asc');
  };

  // Function to save data to a spreadsheet
  const handleSaveToSpreadsheet = () => {
    const wsData = [
      ['Account', 'Invoice Number', 'Sales Rep', 'Sale Date', 'Brand', 'Product Code', 'Product Description', 'Quantity', 'Sell Price']
    ];

    filteredSales.forEach(sale => {
      wsData.push([
        sale.account,
        sale.invoice_number,
        sale.sales_rep || 'Unknown',
        sale.sale_date,
        sale.brand,
        sale.product_code,
        sale.product_description,
        Math.max(sale.quantity_sold || 0, sale.quantity_invoiced),  // Select the larger quantity
        sale.sell_price
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const buf = new ArrayBuffer(wbout.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xFF;
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'Sales_Report.xlsx');
  };

  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div style={{ display: 'flex', overflowY: 'unset' }}>
      {/* Main Sales Report Table */}
      <div style={{ flex: 1, overflowY: 'auto', maxHeight: '100vh', padding: '5px' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <LoadingOverlay visible={loading} />
          </Box>
        ) : (
          <ScrollArea style={{ height: '90%', width: '100%' }}>
            <Table style={{ minWidth: '100%', width: '100%' }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Account</Table.Th>
                  <Table.Th>Invoice Number</Table.Th>
                  <Table.Th>Sales Rep</Table.Th>
                  <Table.Th>
                    <Button variant="subtle" onClick={handleSortByDate}>
                      Sale Date {sortByDate === 'asc' ? '↑' : '↓'}
                    </Button>
                  </Table.Th>
                  <Table.Th>Brand</Table.Th>
                  <Table.Th>Product Code</Table.Th>
                  <Table.Th>Product Description</Table.Th>
                  <Table.Th>Quantity</Table.Th>
                  <Table.Th>Sell Price</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedSales.map((sale, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>{sale.account}</Table.Td>
                    <Table.Td>{sale.invoice_number}</Table.Td>
                    <Table.Td>{sale.sales_rep || 'Unknown'}</Table.Td>
                    <Table.Td>{sale.sale_date}</Table.Td>
                    <Table.Td>{sale.brand}</Table.Td>
                    <Table.Td>{sale.product_code}</Table.Td>
                    <Table.Td>{sale.product_description}</Table.Td>
                    <Table.Td>{Math.max(sale.quantity_sold || 0, sale.quantity_invoiced)}</Table.Td> {/* Larger quantity */}
                    <Table.Td>{`$${parseFloat(sale.sell_price).toFixed(2)}`}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        )}
        <Pagination
          page={currentPage}
          onChange={handlePageChange}
          total={Math.ceil(filteredSales.length / rowsPerPage)}
          position="center"
          mt="lg"
        />
      </div>

      {/* Filters Sidebar */}
      <SalesReportSidebar
        selectedCustomers={selectedCustomers}
        setSelectedCustomers={setSelectedCustomers}
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
        selectedSalesReps={selectedSalesReps}
        setSelectedSalesReps={setSelectedSalesReps}
        customers={customers}
        brands={brands}
        salesReps={salesReps}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        handleSaveToSpreadsheet={handleSaveToSpreadsheet}
        filteredSales={filteredSales}
      />
    </div>
  );
};

export default SalesReport;
