// /src/components/Api/TopProductsApi.tsx

const BASE_URL = "http://localhost:8000/api/sales/top-products";  // Update as needed

// Helper function to get the authorization token from local storage
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// Fetch top products
export const fetchTopProducts = async () => {
  const response = await fetch(`${BASE_URL}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch top products');
  }

  const data = await response.json();
  return data.top_products;  // Return only the top products
};

// Fetch top accounts
export const fetchTopAccounts = async () => {
  const response = await fetch(`${BASE_URL}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch top accounts');
  }

  const data = await response.json();
  return data.top_accounts;  // Return only the top accounts
};
