// /src/components/Api/UsersApi.tsx

const BASE_URL = "http://localhost:8000/api/users";  // Adjust if needed

// Register a new user
export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData);
  }

  return await response.json();
};

// Login and get JWT token
export const loginUser = async (username, password) => {
  const response = await fetch("http://localhost:8000/api/token/", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail);
  }

  const data = await response.json();

  // Save token and username to local storage
  localStorage.setItem('token', data.access);
  localStorage.setItem('refreshToken', data.refresh);
  localStorage.setItem('username', username);

  return data;
};

// Logout function to clear localStorage
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('username');
};

export const getToken = () => localStorage.getItem('token');
export const getUsername = () => localStorage.getItem('username');
