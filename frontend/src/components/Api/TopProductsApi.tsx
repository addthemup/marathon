// /src/components/Api/TopProductsApi.tsx

// Define the base URL dynamically from environment variables
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/sales/top-products`;

// Helper function to get the authorization token from local storage
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// Fetch top products
export const fetchTopProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch top products');
    }

    const data = await response.json();
    return data.top_products;  // Return only the top products
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw error;
  }
};

// Fetch top accounts
export const fetchTopAccounts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch top accounts');
    }

    const data = await response.json();
    return data.top_accounts;  // Return only the top accounts
  } catch (error) {
    console.error('Error fetching top accounts:', error);
    throw error;
  }
};
