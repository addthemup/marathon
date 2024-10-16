import { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Group, ActionIcon, Tooltip, TextInput, Text } from '@mantine/core';
import { IconEye, IconSearch } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { fetchInvoices } from '../Api/InvoicesApi';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const PAGE_SIZES = [5, 10, 20];

const InvoicesTable = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [invoices, setInvoices] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'invoice_number',
    direction: 'asc',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(searchQuery, 200);
  const navigate = useNavigate();

  // Fetch invoices from API or localStorage
  useEffect(() => {
    const loadInvoices = async () => {
      const cachedInvoices = localStorage.getItem('invoices');
      if (cachedInvoices) {
        setInvoices(JSON.parse(cachedInvoices));
        setLoading(false);
      } else {
        try {
          const data = await fetchInvoices();
          setInvoices(data);
          localStorage.setItem('invoices', JSON.stringify(data)); // Cache result
          setLoading(false);
        } catch (err) {
          setError('Failed to load invoices');
          setLoading(false);
        }
      }
    };

    loadInvoices();
  }, []);

  // Update displayed records when sorting, pagination, or filtering changes
  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    let filteredData = invoices;

    if (debouncedQuery) {
      filteredData = invoices.filter((invoice) => {
        // Safely access fields, fallback to empty string if null or undefined
        const invoiceNumber = invoice.invoice_number || '';
        const account = invoice.account || '';
        const salesRep = invoice.sales_rep || '';
        const invoiceDate = new Date(invoice.invoice_date).toLocaleDateString() || '';

        const matchesInvoiceNumber = invoiceNumber.toLowerCase().includes(debouncedQuery.toLowerCase());
        const matchesAccount = account.toLowerCase().includes(debouncedQuery.toLowerCase());
        const matchesSalesRep = salesRep.toLowerCase().includes(debouncedQuery.toLowerCase());
        const matchesDate = invoiceDate.toLowerCase().includes(debouncedQuery.toLowerCase());

        return (
          matchesInvoiceNumber ||
          matchesAccount ||
          matchesSalesRep ||
          matchesDate
        );
      });
    }

    const sortedData = filteredData.sort((a, b) => {
      const column = sortStatus.columnAccessor;
      if (sortStatus.direction === 'asc') {
        return a[column]?.toString().localeCompare(b[column]?.toString());
      } else {
        return b[column]?.toString().localeCompare(a[column]?.toString());
      }
    });

    setRecords(sortedData.slice(from, to));
  }, [invoices, page, pageSize, debouncedQuery, sortStatus]);

  if (loading) {
    return (
      <Group position="center" style={{ height: '100%' }}>
        <CircularProgress />
      </Group>
    );
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  const columns = [
    {
      accessor: 'invoice_number',
      title: 'Invoice Number',
      sortable: true,
      render: (invoice) => <Text>{invoice.invoice_number}</Text>,
    },
    {
      accessor: 'account',
      title: 'Account',
      render: (invoice) => <Text>{invoice.account}</Text>, // Account is a string
    },
    {
      accessor: 'invoice_date',
      title: 'Invoice Date',
      sortable: true,
      render: (invoice) => <Text>{new Date(invoice.invoice_date).toLocaleDateString()}</Text>,
    },
    {
      accessor: 'sales_rep',
      title: 'Sales Rep',
      render: (invoice) => <Text>{invoice.sales_rep}</Text>, // Sales Rep is a string
    },
    {
      accessor: 'id',
      title: 'Actions',
      render: (invoice) => (
        <Group>
          <Tooltip label="View invoice details">
            <ActionIcon onClick={() => navigate(`/invoices/${invoice.id}`)}>
              <IconEye />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];

  return (
    <>
      {/* Search bar at the top right */}
      <Group position="end" mb="md">
        <TextInput
          icon={<IconSearch />}
          placeholder="Search invoices"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
        />
      </Group>

      <DataTable
        columns={columns}
        records={records}
        totalRecords={invoices.length}
        recordsPerPage={pageSize}
        page={page}
        onPageChange={setPage}
        onRecordsPerPageChange={setPageSize}
        recordsPerPageOptions={PAGE_SIZES}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
      />
    </>
  );
};

export default InvoicesTable;
