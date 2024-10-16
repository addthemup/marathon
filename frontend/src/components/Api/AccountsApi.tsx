const BASE_URL = "http://localhost:8000/api"; // Adjust if needed

// Helper function to get the authorization token from localStorage
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// Helper function to refresh the token
const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${BASE_URL}/token/refresh/`, {
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
  localStorage.setItem('token', data.access); // Save the new access token
  return data.access;
};

// Helper function to handle token expiration and retry the request
const fetchWithToken = async (url, options, retry = true) => {
  let response = await fetch(url, options);

  // Handle unauthorized errors and refresh token
  if (response.status === 401 && retry) {
    const errorData = await response.json();
    if (errorData.code === 'token_not_valid') {
      try {
        // Token is expired, refresh it
        const newToken = await refreshToken();
        options.headers['Authorization'] = `Bearer ${newToken}`; // Set new token

        // Retry the original request with the new token
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
export const fetchAccounts = async () => {
  try {
    const response = await fetchWithToken(`${BASE_URL}/accounts/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch accounts');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
};

// Fetch all root accounts
export const fetchRootAccounts = async () => {
  try {
    const response = await fetchWithToken(`${BASE_URL}/root-accounts/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch root accounts');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching root accounts:', error);
    throw error;
  }
};

// Create a new root account
export const createRootAccount = async (rootAccountData) => {
  try {
    const response = await fetchWithToken(`${BASE_URL}/root-accounts/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(rootAccountData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating root account:', error);
    throw error;
  }
};

// Create a new account
export const createAccount = async (accountData) => {
  try {
    const response = await fetchWithToken(`${BASE_URL}/accounts/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(accountData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};

// Update existing account (full account update)
export const updateAccount = async (id, accountData) => {
  try {
    const response = await fetchWithToken(`${BASE_URL}/accounts/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(accountData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating account:', error);
    throw error;
  }
};

// Delete an account
export const deleteAccount = async (id) => {
  try {
    const response = await fetchWithToken(`${BASE_URL}/accounts/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete account');
    }

    return true; // Return true if deletion was successful
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};

// Fetch all sales reps
export const fetchSalesReps = async () => {
  try {
    const response = await fetchWithToken(`${BASE_URL}/reps/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sales reps');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching sales reps:', error);
    throw error;
  }
};

// Update sales rep for a specific account
export const updateAccountSalesRep = async (accountId, newSalesRepId) => {
  try {
    const response = await fetchWithToken(`${BASE_URL}/accounts/${accountId}/update-sales-rep/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ sales_rep: newSalesRepId }),
    });

    if (!response.ok) {
      throw new Error('Failed to update sales rep');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating sales rep:', error);
    throw error;
  }
};

// Fetch all branch accounts
export const fetchBranchAccounts = async () => {
  try {
    const response = await fetchWithToken(`${BASE_URL}/branch-accounts/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch branch accounts');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching branch accounts:', error);
    throw error;
  }
};

// Create a new branch account
export const createBranchAccount = async (branchAccountData) => {
  try {
    const response = await fetchWithToken(`${BASE_URL}/branch-accounts/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(branchAccountData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating branch account:', error);
    throw error;
  }
};

// Delete root account
export const deleteRootAccount = async (id) => {
  const response = await fetchWithToken(`${BASE_URL}/root-accounts/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete root account');
  }

  return true; // Return true if deletion was successful
};

// Delete branch account
export const deleteBranchAccount = async (id) => {
  const response = await fetchWithToken(`${BASE_URL}/branch-accounts/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete branch account');
  }

  return true; // Return true if deletion was successful
};
