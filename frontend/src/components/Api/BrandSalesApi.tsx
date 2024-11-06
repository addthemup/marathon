// /src/components/Api/BrandSalesApi.tsx

// Import the base API URL from environment variables
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/sales/monthly_sales_by_brand`;

// Fetch monthly sales by brand
export const fetchMonthlySalesByBrand = async () => {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include JWT token if needed
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch monthly sales data');
  }

  return await response.json(); // Return JSON data from response
};
