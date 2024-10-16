// /src/components/Api/BrandSalesApi.tsx

const BASE_URL = "http://localhost:8000/api/sales/monthly_sales_by_brand/";  // Update as needed

// Fetch monthly sales by brand
export const fetchMonthlySalesByBrand = async () => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Include JWT token if needed
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch monthly sales data');
  }

  return await response.json();  // Return JSON data from response
};
