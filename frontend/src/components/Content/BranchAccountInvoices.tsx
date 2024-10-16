import { useState } from 'react';
import { Table, ScrollArea, Paper, Text, Button, Group, Collapse, Pagination } from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

interface BranchAccountInvoicesProps {
  invoices: any[]; // Replace `any` with the actual invoice type if available
}

const BranchAccountInvoices: React.FC<BranchAccountInvoicesProps> = ({ invoices }) => {
  const [expandedInvoice, setExpandedInvoice] = useState<number | null>(null); // Track expanded invoice
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [startDate, setStartDate] = useState<string | null>(null); // Start date filter
  const [endDate, setEndDate] = useState<string | null>(null); // End date filter
  const rowsPerPage = 10; // Max rows per page

  // Function to format date
  const formatDate = (dateString: string | null) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  };

  // Handle toggling the visibility of sales under an invoice
  const handleToggleInvoice = (invoiceId: number) => {
    setExpandedInvoice((prev) => (prev === invoiceId ? null : invoiceId));
  };

  // Filter invoices by the selected startDate and endDate only if both are set
  const filteredInvoices = invoices.filter((invoice) => {
    if (!startDate || !endDate) return true;
    const invoiceDate = new Date(invoice.sale_date || invoice.invoice_date).toISOString().split('T')[0];
    return invoiceDate >= startDate && invoiceDate <= endDate;
  });

  // Paginate the filtered invoices
  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage);
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <Paper shadow="xs" padding="md" style={{ height: '100%' }} mt="lg">
      {/* Date Filters */}
      <Group position="apart" mb="md" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Pagination
          page={currentPage}
          onChange={setCurrentPage}
          total={totalPages}
          size="sm"
          style={{ marginLeft: 'auto' }} // Move pagination to the right
        />
      </Group>

      <ScrollArea style={{ margin: '10px', maxHeight: '500px', width: '100%' }}>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Invoice Date</th>
              <th>Customer PO</th>
              <th>Total Invoice Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInvoices.map((invoice) => (
              <>
                {/* Invoice row */}
                <tr key={invoice.id}>
                  <td>{invoice.invoice_number}</td>
                  <td>{formatDate(invoice.sale_date || invoice.invoice_date)}</td>
                  <td>{invoice.customer_po || 'N/A'}</td>
                  <td>${invoice.invoice_sum.toFixed(2)}</td>
                  <td>
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => handleToggleInvoice(invoice.id)}
                      rightIcon={
                        expandedInvoice === invoice.id ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />
                      }
                    >
                      {expandedInvoice === invoice.id ? 'Hide Sales' : 'Show Sales'}
                    </Button>
                  </td>
                </tr>

                {/* Collapsible Sales rows */}
                <tr>
                  <td colSpan={5} style={{ paddingLeft: '40px' }}>
                    <Collapse in={expandedInvoice === invoice.id}>
                      <div style={{ padding: '10px 0' }}>
                        <Table>
                          <thead>
                            <tr>
                              <th>Product Code</th>
                              <th>Product Description</th>
                              <th>Quantity Sold</th>
                              <th>Sell Price</th>
                              <th>Line Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoice.sales.map((sale) => (
                              <tr key={sale.id} style={{ backgroundColor: '#f9f9f9' }}>
                                <td>{sale.product.product_code}</td>
                                <td>{sale.product.product_description}</td>
                                <td>{sale.quantity_sold || sale.quantity_invoiced}</td>
                                <td>${parseFloat(sale.sell_price).toFixed(2)}</td>
                                <td>${parseFloat(sale.line_price).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Collapse>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
};

export default BranchAccountInvoices;
