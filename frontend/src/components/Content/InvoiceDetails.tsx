import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Link for navigation
import { Button, Divider, Stack, Text, Table, Flex, Breadcrumbs } from '@mantine/core';
import { CircularProgress } from '@mui/material';
import { IconCloudDownload, IconPrinter, IconShare } from '@tabler/icons-react';
import { fetchInvoiceById } from '../Api/InvoicesApi'; // Fetch API for invoice by ID

const InvoiceDetails = () => {
  const { id: invoiceId } = useParams(); // Get invoice ID from URL params
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoiceSum, setInvoiceSum] = useState(0); // State to store the invoice total sum

  useEffect(() => {
    const loadInvoiceDetails = async () => {
      setLoading(true);
      try {
        const data = await fetchInvoiceById(invoiceId); // Fetch the invoice by ID
        setInvoice(data);
        setLoading(false);

        // Calculate the total sum for the invoice
        const totalSum = data.sales.reduce((sum, sale) => {
          return sum + sale.quantity_sold * parseFloat(sale.sell_price);
        }, 0);
        setInvoiceSum(totalSum); // Update the state with the calculated sum
      } catch (err) {
        setError('Failed to load invoice details');
        setLoading(false);
      }
    };

    loadInvoiceDetails();
  }, [invoiceId]);

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ height: '100%' }}>
        <CircularProgress />
      </Flex>
    );
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  return (
    <Stack style={{ paddingLeft: '50px', paddingRight: '50px' }}>
      {/* Breadcrumbs for navigation */}
      <Breadcrumbs>
        <Link to="/invoices">Invoices</Link>
        <Text color="dimmed">Invoice {invoice.invoice_number}</Text>
      </Breadcrumbs>

      {/* Invoice Action Buttons */}
      <Flex justify="flex-end" gap="sm" mt="md">
        <Button leftIcon={<IconCloudDownload />} variant="light">
          Download
        </Button>
        <Button leftIcon={<IconPrinter />} variant="light">
          Print
        </Button>
        <Button leftIcon={<IconShare />} variant="light">
          Share
        </Button>
      </Flex>

      {/* Invoice Header Details */}
      <Text mt="md">Invoice Number: {invoice.invoice_number}</Text>
      <Text>Invoice Date: {new Date(invoice.invoice_date).toLocaleDateString()}</Text>
      <Text>Account: {invoice.account}</Text>
      <Text>Sales Representative: {invoice.sales_rep || 'N/A'}</Text>
      <Text>Customer PO: {invoice.customer_po || 'N/A'}</Text>
      <Text>Notes: {invoice.notes || 'No notes provided'}</Text>

      <Divider />

      {/* Invoice Items Table */}
      <Table highlightOnHover striped>
        <thead>
          <tr>
            <th>Description</th>
            <th>Brand</th>
            <th>Quantity Sold</th>
            <th>Sell Price</th>
            <th>Commission Percentage</th>
            <th>Commission Amount</th>
            <th>Total Sold</th>
          </tr>
        </thead>
        <tbody>
          {invoice.sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.product.product_description}</td>
              <td>{sale.product.brand}</td>
              <td>{sale.quantity_sold}</td>
              <td>${parseFloat(sale.sell_price).toFixed(2)}</td>
              <td>{sale.commission_percentage}%</td>
              <td>${parseFloat(sale.commission_amount).toFixed(2)}</td>
              <td>${(sale.quantity_sold * parseFloat(sale.sell_price)).toFixed(2)}</td>
            </tr>
          ))}
          {/* Subtotal and Tax (if needed, you can customize it) */}
          <tr>
            <td colSpan={6} align="right">
              Subtotal
            </td>
            <td>${invoiceSum.toFixed(2)}</td>
          </tr>
        </tbody>
      </Table>

      {/* Invoice Sum */}
      <Text align="right" mt="md" size="lg" weight="bold">
        Total Invoice Sum: ${invoiceSum.toFixed(2)}
      </Text>

      <Text align="center" mt="md" color="dimmed">
        Please ensure timely payment and contact us if you have any questions.
      </Text>
    </Stack>
  );
};

export default InvoiceDetails;
