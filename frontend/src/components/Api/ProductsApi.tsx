const BASE_URL = 'http://localhost:8000/api/products/';  // Adjust base URL if necessary

// Helper function to get authorization headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,  // Assuming you're using JWT for authorization
});

// Fetch all products
export const fetchProducts = async () => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return await response.json();
};

// Fetch categories
export const fetchCategories = async () => {
  const response = await fetch(`${BASE_URL}categories/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return await response.json();
};

// Fetch subcategories
export const fetchSubCategories = async () => {
  const response = await fetch(`${BASE_URL}subcategories/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch subcategories');
  }

  return await response.json();
};

// Fetch tags
export const fetchTags = async () => {
  const response = await fetch(`${BASE_URL}tags/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tags');
  }

  return await response.json();
};

// Create a new category
export const createCategory = async (categoryData) => {
  const response = await fetch(`${BASE_URL}categories/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    throw new Error('Failed to create category');
  }

  return await response.json();
};

// Create a new subcategory (linked to a category via foreign key)
export const createSubCategory = async (subCategoryData) => {
  const response = await fetch(`${BASE_URL}subcategories/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(subCategoryData),
  });

  if (!response.ok) {
    throw new Error('Failed to create subcategory');
  }

  return await response.json();
};

// Create a new tag
export const createTag = async (tagData) => {
  const response = await fetch(`${BASE_URL}tags/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(tagData),
  });

  if (!response.ok) {
    throw new Error('Failed to create tag');
  }

  return await response.json();
};

// Update a product (e.g., updating category, subcategory, or tags)
export const updateProduct = async (productId, productData) => {
  const response = await fetch(`${BASE_URL}${productId}/`, {
    method: 'PATCH',  // PATCH is used for partial updates
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error('Failed to update product');
  }

  return await response.json();
};
