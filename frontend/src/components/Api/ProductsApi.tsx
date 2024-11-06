// /src/components/Api/ProductsApi.tsx

// Define the base URL from the environment variables
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/products/`;

// Helper function to get authorization headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// Define types for the data structures
type CategoryData = {
  name: string;
  description?: string;
};

type SubCategoryData = {
  category: number; // assuming it's linked via foreign key
  name: string;
};

type TagData = {
  name: string;
};

type ProductData = {
  name: string;
  category: number;
  subCategory?: number;
  tags?: number[];
  price: number;
};

// Fetch all products
export const fetchProducts = async (): Promise<ProductData[]> => {
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
export const fetchCategories = async (): Promise<CategoryData[]> => {
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
export const fetchSubCategories = async (): Promise<SubCategoryData[]> => {
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
export const fetchTags = async (): Promise<TagData[]> => {
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
export const createCategory = async (categoryData: CategoryData): Promise<CategoryData> => {
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

// Create a new subcategory
export const createSubCategory = async (subCategoryData: SubCategoryData): Promise<SubCategoryData> => {
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
export const createTag = async (tagData: TagData): Promise<TagData> => {
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

// Update a product
export const updateProduct = async (productId: number, productData: Partial<ProductData>): Promise<ProductData> => {
  const response = await fetch(`${BASE_URL}${productId}/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error('Failed to update product');
  }

  return await response.json();
};
