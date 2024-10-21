const BASE_URL = "http://localhost:8000/api"; 

// Helper function to get the authorization token
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// Fetch account sales invoice by account ID
export const fetchAccountSalesInvoice = async (accountId: number) => {
  const response = await fetch(`${BASE_URL}/accounts/${accountId}/sales-invoice/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sales invoice for account ${accountId}`);
  }

  return await response.json();
};

// Fetch root account sales invoice by root account ID
export const fetchRootAccountSalesInvoice = async (rootAccountId: number) => {
  const response = await fetch(`${BASE_URL}/root-accounts/${rootAccountId}/sales-invoice/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sales invoice for root account ${rootAccountId}`);
  }

  return await response.json();
};

// Fetch branch account sales invoice by branch account ID
export const fetchBranchAccountSalesInvoice = async (branchAccountId: number) => {
  const response = await fetch(`${BASE_URL}/branch-accounts/${branchAccountId}/sales-invoice/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sales invoice for branch account ${branchAccountId}`);
  }

  return await response.json();
};
