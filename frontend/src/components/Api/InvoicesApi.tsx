// /src/components/Api/InvoicesApi.tsx

const BASE_URL = "http://localhost:8000/api/invoices";  // Adjust if needed

// Fetch all invoices
export const fetchInvoices = async () => {
  const response = await fetch(`${BASE_URL}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Include JWT token
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch invoices');
  }

  return await response.json();  // Return JSON data from response
};

// Create a new invoice (if needed in the future)
export const createInvoice = async (invoiceData) => {
  const response = await fetch(`${BASE_URL}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Include JWT token
    },
    body: JSON.stringify(invoiceData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData);
  }

  return await response.json();  // Return the newly created invoice
};

// Update an invoice (if needed in the future)
export const updateInvoice = async (id, invoiceData) => {
  const response = await fetch(`${BASE_URL}/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Include JWT token
    },
    body: JSON.stringify(invoiceData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData);
  }

  return await response.json();  // Return the updated invoice
};

// Delete an invoice (if needed in the future)
export const deleteInvoice = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Include JWT token
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete invoice');
  }

  return true;  // Return true if deletion was successful
};

// Fetch a specific invoice by ID
export const fetchInvoiceById = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch invoice details');
    }
  
    return await response.json();
  };