const BASE_URL = "http://localhost:8000/api/reps/";  // Adjust if needed

// Helper function to get authorization token
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// Fetch all sales reps
export const fetchSalesReps = async () => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sales reps');
  }

  const data = await response.json();

  // Additional processing (e.g., mapping over branch accounts and top sales) if necessary
  return data.map(rep => ({
    ...rep,
    branch_accounts: rep.branch_accounts || [],
    top_ten_items_by_volume: rep.top_ten_items_by_volume || [],
    top_ten_items_by_price: rep.top_ten_items_by_price || []
  }));
};

// Create a new sales rep
export const createSalesRep = async (salesRepData) => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(salesRepData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData);
  }

  return await response.json();
};

// Update sales rep by ID
export const updateSalesRep = async (id, salesRepData) => {
  const response = await fetch(`${BASE_URL}${id}/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(salesRepData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData);
  }

  return await response.json();
};

// Delete sales rep by ID
export const deleteSalesRep = async (id) => {
  const response = await fetch(`${BASE_URL}${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete sales rep');
  }

  return true;
};

// Fetch sales rep details with branch accounts, top volume, and top price items
export const fetchSalesRepDetails = async (id) => {
  const response = await fetch(`${BASE_URL}${id}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sales rep details');
  }

  const data = await response.json();

  return {
    ...data,
    branch_accounts: data.branch_accounts || [],
    top_ten_items_by_volume: data.top_ten_items_by_volume || [],
    top_ten_items_by_price: data.top_ten_items_by_price || []
  };
};
