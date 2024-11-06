// /src/components/Api/DashboardApi.tsx

// Import the base API URL from environment variables
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/dashboard/`;

// Helper function to get the authorization token from local storage
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// Fetch Gross Sales Yearly and YTD
export const fetchGrossSalesYearlyYTD = async () => {
  try {
    const response = await fetch(`${BASE_URL}gross-sales/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Gross Sales Yearly and YTD');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Gross Sales Yearly and YTD:', error);
    throw error;
  }
};

// Fetch Top Ten Branch Accounts YTD
export const fetchTopTenBranchAccountsYTD = async () => {
  try {
    const response = await fetch(`${BASE_URL}top-ten-branch-ytd/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Top Ten Branch Accounts YTD');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Top Ten Branch Accounts YTD:', error);
    throw error;
  }
};

// Fetch Top Ten Sales Reps YTD
export const fetchTopTenSalesRepsYTD = async () => {
  try {
    const response = await fetch(`${BASE_URL}top-ten-sales-rep-ytd/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Top Ten Sales Reps YTD');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Top Ten Sales Reps YTD:', error);
    throw error;
  }
};

// Fetch Top Brands YTD
export const fetchTopBrandsYTD = async () => {
  try {
    const response = await fetch(`${BASE_URL}top-brands-ytd/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Top Brands YTD');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Top Brands YTD:', error);
    throw error;
  }
};

// Fetch Monthly Sales By Sales Rep
export const fetchMonthlySalesBySalesRep = async () => {
  try {
    const response = await fetch(`${BASE_URL}monthly-sales-by-sales-rep/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Monthly Sales by Sales Rep');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Monthly Sales by Sales Rep:', error);
    throw error;
  }
};
