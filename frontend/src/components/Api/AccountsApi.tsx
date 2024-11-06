// Import the base API URL from environment variables
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/accounts`;

// Types for the API data structures
interface AccountData {
  id?: string;
  name: string;
  [key: string]: any;
}

interface RootAccountData {
  name: string;
  [key: string]: any;
}

interface BranchAccountData {
  name: string;
  [key: string]: any;
}

interface SalesRepData {
  id: string;
  name: string;
}

// Helper function to get authorization headers
const getAuthHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// Helper function to refresh the token
const refreshToken = async (): Promise<string> => {
  const refresh = localStorage.getItem('refreshToken');
  if (!refresh) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  localStorage.setItem('token', data.access);
  return data.access;
};

// Helper function to handle token expiration and retry requests
const fetchWithToken = async (
  url: string,
  options: RequestInit,
  retry = true
): Promise<Response> => {
  let response = await fetch(url, options);

  if (response.status === 401 && retry) {
    const errorData = await response.json();
    if (errorData.code === 'token_not_valid') {
      try {
        const newToken = await refreshToken();
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
        };
        response = await fetch(url, options);
      } catch (err) {
        console.error('Token refresh failed:', err);
        throw err;
      }
    }
  }

  return response;
};

// Fetch all accounts
export const fetchAccounts = async (): Promise<AccountData[]> => {
  const response = await fetchWithToken(`${BASE_URL}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch accounts');
  }

  return await response.json();
};

// Fetch all root accounts
export const fetchRootAccounts = async (): Promise<RootAccountData[]> => {
  const response = await fetchWithToken(`${import.meta.env.VITE_API_BASE_URL}/root-accounts/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch root accounts');
  }

  return await response.json();
};

// Create a new root account
export const createRootAccount = async (
  rootAccountData: RootAccountData
): Promise<RootAccountData> => {
  const response = await fetchWithToken(`${import.meta.env.VITE_API_BASE_URL}/root-accounts/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(rootAccountData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData);
  }

  return await response.json();
};

// Create a new account
export const createAccount = async (
  accountData: AccountData
): Promise<AccountData> => {
  const response = await fetchWithToken(`${BASE_URL}/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(accountData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData);
  }

  return await response.json();
};

// Update existing account
export const updateAccount = async (
  id: string,
  accountData: AccountData
): Promise<AccountData> => {
  const response = await fetchWithToken(`${BASE_URL}/${id}/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(accountData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData);
  }

  return await response.json();
};

// Delete an account
export const deleteAccount = async (id: string): Promise<boolean> => {
  const response = await fetchWithToken(`${BASE_URL}/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete account');
  }

  return true;
};

// Fetch all sales reps
export const fetchSalesReps = async (): Promise<SalesRepData[]> => {
  const response = await fetchWithToken(`${import.meta.env.VITE_API_BASE_URL}/reps/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sales reps');
  }

  return await response.json();
};

// Update sales rep for a specific account
export const updateAccountSalesRep = async (
  accountId: string,
  newSalesRepId: string
): Promise<AccountData> => {
  const response = await fetchWithToken(`${BASE_URL}/${accountId}/update-sales-rep/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ sales_rep: newSalesRepId }),
  });

  if (!response.ok) {
    throw new Error('Failed to update sales rep');
  }

  return await response.json();
};

// Fetch all branch accounts
export const fetchBranchAccounts = async (): Promise<BranchAccountData[]> => {
  const response = await fetchWithToken(`${import.meta.env.VITE_API_BASE_URL}/branch-accounts/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch branch accounts');
  }

  return await response.json();
};

// Create a new branch account
export const createBranchAccount = async (
  branchAccountData: BranchAccountData
): Promise<BranchAccountData> => {
  const response = await fetchWithToken(`${import.meta.env.VITE_API_BASE_URL}/branch-accounts/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(branchAccountData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData);
  }

  return await response.json();
};

// Delete root account
export const deleteRootAccount = async (id: string): Promise<boolean> => {
  const response = await fetchWithToken(`${import.meta.env.VITE_API_BASE_URL}/root-accounts/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete root account');
  }

  return true;
};

// Delete branch account
export const deleteBranchAccount = async (id: string): Promise<boolean> => {
  const response = await fetchWithToken(`${import.meta.env.VITE_API_BASE_URL}/branch-accounts/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete branch account');
  }

  return true;
};
