// /src/components/Api/InvoicesApi.tsx

// Define the type for invoiceData
interface InvoiceData {
  id?: number; // Optional, because it might not exist when creating a new invoice
  customer: string;
  amount: number;
  due_date: string;
  status: string;
  // Add other relevant fields based on your backend API structure
}

// Import the base API URL from environment variables
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/invoices`; // Uses the base URL from .env

// Helper function to get the authorization token
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// Fetch all invoices
export const fetchInvoices = async (): Promise<InvoiceData[]> => {
  const response = await fetch(`${BASE_URL}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch invoices');
  }

  return await response.json();
};

// Create a new invoice
export const createInvoice = async (invoiceData: InvoiceData): Promise<InvoiceData> => {
  const response = await fetch(`${BASE_URL}/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(invoiceData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData);
  }

  return await response.json();
};

// Update an invoice
export const updateInvoice = async (id: number, invoiceData: InvoiceData): Promise<InvoiceData> => {
  const response = await fetch(`${BASE_URL}/${id}/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(invoiceData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData);
  }

  return await response.json();
};

// Delete an invoice
export const deleteInvoice = async (id: number): Promise<boolean> => {
  const response = await fetch(`${BASE_URL}/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete invoice');
  }

  return true;
};

// Fetch a specific invoice by ID
export const fetchInvoiceById = async (id: number): Promise<InvoiceData> => {
  const response = await fetch(`${BASE_URL}/${id}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch invoice details');
  }

  return await response.json();
};
