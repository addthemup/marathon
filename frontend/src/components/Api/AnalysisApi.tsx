// Import the base API URL from environment variables
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/sales/analysis`;

// Fetch analysis data
export const fetchAnalysisData = async () => {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming JWT token is stored in localStorage
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch analysis data');
  }

  return await response.json();
};
