// /src/components/Api/RepsApi.tsx

// Define the base URL dynamically from environment variables
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/reps/`;

// Helper function to get authorization headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// Define interfaces for sales rep data (example structure)
interface SalesRep {
  id?: number;
  full_name: string;
  branch_accounts?: any[];
  top_ten_items_by_volume?: any[];
  top_ten_items_by_price?: any[];
}

// Fetch all sales reps
export const fetchSalesReps = async (): Promise<SalesRep[]> => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sales reps');
  }

  const data = await response.json();

  // Additional processing if necessary
  return data.map((rep: SalesRep) => ({
    ...rep,
    branch_accounts: rep.branch_accounts || [],
    top_ten_items_by_volume: rep.top_ten_items_by_volume || [],
    top_ten_items_by_price: rep.top_ten_items_by_price || [],
  }));
};

// Create a new sales rep
export const createSalesRep = async (salesRepData: SalesRep): Promise<SalesRep> => {
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
export const updateSalesRep = async (id: number, salesRepData: SalesRep): Promise<SalesRep> => {
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
export const deleteSalesRep = async (id: number): Promise<boolean> => {
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
export const fetchSalesRepDetails = async (id: number): Promise<SalesRep> => {
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
    top_ten_items_by_price: data.top_ten_items_by_price || [],
  };
};
