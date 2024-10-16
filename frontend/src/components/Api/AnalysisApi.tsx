const BASE_URL = 'http://localhost:8000/api/sales/analysis/';  // Adjust the base URL if necessary

// Fetch analysis data
export const fetchAnalysisData = async () => {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`  // Assuming JWT token is stored in localStorage
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch analysis data');
  }

  return await response.json();
};
