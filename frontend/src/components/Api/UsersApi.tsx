const BASE_URL = "http://localhost:8000/api/users"; // Adjust if needed

// Define the type for user registration data
interface UserRegistrationData {
  username: string;
  password: string;
  email?: string; // Optional field if your API allows optional email
  [key: string]: any; // In case there are additional fields
}

// Register a new user
export const registerUser = async (userData: UserRegistrationData): Promise<any> => {
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
export const loginUser = async (username: string, password: string): Promise<any> => {
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
export const logoutUser = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('username');
};

// Retrieve the token from localStorage
export const getToken = (): string | null => localStorage.getItem('token');

// Retrieve the username from localStorage
export const getUsername = (): string | null => localStorage.getItem('username');
