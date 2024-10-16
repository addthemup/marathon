const BASE_URL = 'http://localhost:8000/api/sales/report/';  // Base URL for the new sales report API

// Helper function to get authorization headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,  // Assuming JWT token is stored in localStorage
});

// Fetch all sales report data
export const fetchSalesReportData = async () => {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sales report data');
  }

  return await response.json();  // Parse and return the JSON response
};

// Fetch sales report data by filters (e.g., date range, account, sales rep, etc.)
export const fetchSalesReportByFilter = async (filterParams) => {
  const url = new URL(BASE_URL);  // Create a URL object

  // Append filterParams to the URL's search params
  Object.keys(filterParams).forEach(key => {
    if (filterParams[key]) {
      url.searchParams.append(key, filterParams[key]);
    }
  });

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch filtered sales report data');
  }

  return await response.json();  // Parse and return the JSON response
};
